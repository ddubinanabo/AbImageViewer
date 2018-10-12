package com.abrain.wiv.converters;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.exec.CommandLine;
import org.apache.commons.exec.DefaultExecutor;
import org.apache.commons.exec.ExecuteWatchdog;
import org.apache.commons.exec.PumpStreamHandler;
import org.apache.commons.io.FilenameUtils;

import com.abrain.wiv.data.AbImageData;
import com.abrain.wiv.data.AbImageInfo;
import com.abrain.wiv.data.exif.AbExif;
import com.abrain.wiv.enums.AbImageDecoder;
import com.abrain.wiv.exceptions.ArgumentException;
import com.abrain.wiv.exceptions.DocConverterException;
import com.abrain.wiv.readers.AbExifReader;
import com.abrain.wiv.utils.DebugUtil;
import com.abrain.wiv.utils.FileUtil;
import com.abrain.wiv.utils.GraphicsUtil;

/**
 * 폴라리스 변환 툴
 * @author Administrator
 *
 */
public class PolarisConverter {
	private PolarisConverter() {}
	
	//-----------------------------------------------------------------------------------
	
	private static final String DIR_DOC = "/WEB-INF/docs/";
	private static final String DIR_CONVERTER = "/WEB-INF/converters";

	private static final int IMG_WIDTH = 700;
	private static final int IMG_HEIGHT = 990;
	
	private static final String IMG_TYPE = "JPEG";
	private static final AbImageDecoder IMG_DECODER = AbImageDecoder.ABDEC_JPG;
	private static final String IMG_MIMETYPE = "image/jpeg";
	
	//-----------------------------------------------------------------------------------
	
	private static final Pattern loadFail = Pattern.compile("^\\s*loadfail\\s*:\\s*([\\-0-9].)\\s*$", Pattern.CASE_INSENSITIVE | Pattern.MULTILINE);
	private static final Pattern printFail = Pattern.compile("^\\s*printfail\\s*:\\s*([\\-0-9].)\\s*$", Pattern.CASE_INSENSITIVE | Pattern.MULTILINE);
	
	//-----------------------------------------------------------------------------------
	
	public static String rootFolder(ServletContext context, String sessionId) {
		String rootDirPath = context.getRealPath(DIR_DOC);
		
		File rootDir = new File(rootDirPath);
		if (!rootDir.exists())
			rootDir.mkdir();
		
		return FileUtil.combinePath(rootDirPath, sessionId);
	}
	
	//-----------------------------------------------------------------------------------
	
	public static List<AbImageData> convert (HttpServletRequest request, String name, String content)
			throws Exception{
		if (name == null || name.isEmpty()){
			throw new ArgumentException();
		}

		if (content == null || content.isEmpty()){
			throw new ArgumentException();
		}
		
		byte[] bytes = Base64.getDecoder().decode(content);
		
		HttpSession session = request.getSession();
		
		ServletContext context = session.getServletContext();
		String sessionId = session.getId();
		
		//String docDirPath = context.getRealPath(DIR_DOC + sessionId);
		String docDirPath = rootFolder(context, sessionId);

		//-----------------------------------------------------------------------------------
	
		File docDir = new File(docDirPath);
		if (!docDir.exists())
			docDir.mkdir();
		
		String userDocDirPath = FileUtil.unique(docDirPath);

		//-----------------------------------------------------------------------------------
		
		String resultDirPath = FileUtil.combinePath(userDocDirPath, "result");
		File resultDir = new File(resultDirPath);
		if (!resultDir.exists())
			resultDir.mkdir();
		
		String thumbDirPath = FileUtil.combinePath(resultDirPath, "thumbnail");
		File thumbDir = new File(thumbDirPath);
		if (!thumbDir.exists())
			thumbDir.mkdir();
	
		String tempDirPath = FileUtil.combinePath(userDocDirPath, "temp");
		File tempDir = new File(tempDirPath);
		if (!tempDir.exists())
			tempDir.mkdir();

		//-----------------------------------------------------------------------------------
		
		String basename = FilenameUtils.getBaseName(name);
		String ext = FilenameUtils.getExtension(name);
	
		String docPath = FileUtil.combinePath(userDocDirPath, "src." + ext);
		
		FileUtil.write(docPath, bytes);

		//-----------------------------------------------------------------------------------
		
		Exception e = exec(request, docPath, resultDirPath, tempDirPath);
		if (e != null)
			throw e;

		//-----------------------------------------------------------------------------------

		List<AbImageData> images = new ArrayList<>();
		File[] files = resultDir.listFiles();
		int numFiles = files.length;
		
		// 이미지 파일 추출 및 파일명 변경
		ArrayList<File> imgFiles = new ArrayList<>();
		for (int i=0; i < numFiles; i++){
			File file = files[i]; 
			
			if (!file.isFile())
				continue;
			
			// 이름 변경
			File newNameFile = new File(FileUtil.combinePath(resultDirPath, basename + "_" + file.getName()));
			file.renameTo(newNameFile);
			
			imgFiles.add(newNameFile);
		}
		
		int numImgFiles = imgFiles.size();
		for (int i=0; i < numImgFiles; i++){
			File file = imgFiles.get(i);

			String filename = file.getName();
//			String extension = FilenameUtils.getExtension(filename);
//			String mimeType = FileUtil.contentType(file);
//			String decoder = AbImageDecoder.renderingHint(extension, mimeType);
			
			System.out.println("filename=" + filename);
			
			GraphicsUtil.ThumbnailResult r = GraphicsUtil.thumbnail(file, thumbDirPath + "/" + file.getName(), IMG_DECODER);
			if (r.e != null){
				throw r.e;
			}
			
			String q = userDocDirPath.substring(docDirPath.length()).replaceAll("\\\\", "/") + "/";
			if (q.charAt(0) != '/')
				q = sessionId + "/" + q;
			else
				q = sessionId + q;
			
			System.out.println("[q] " + q);
			
			String url = "doc?q=" + q + "&n=";
			
			String imageUrl = url + filename;
			String thumbUrl = url + r.name + "&t=thumb";
			
			AbImageData img = new AbImageData(imageUrl, thumbUrl, r.srcWidth, r.srcHeight);
			img.setDecoder(AbImageDecoder.toString(IMG_DECODER));
			
			//-----------------------------------------------------------
			
			//AbExif exif = AbExifReader.read(file);
			
			AbImageInfo info = new AbImageInfo();
			info.setName(filename);
			info.setText(filename);
			info.setType(IMG_MIMETYPE);
			info.setSize(file.length());
			
			info.setOriginName(name);
			info.setOriginIndex(i);
			info.setOriginPages(numImgFiles);
			info.setOriginSize((long)bytes.length);
			
			//if (exif != null) info.setExif(exif);
		
			img.setInfo(info);
			
			images.add(img);
		}	
		
		return images;
	}

	//-----------------------------------------------------------------------------------
	
	public static void download(String q, String n, String t, HttpServletRequest request, HttpServletResponse response) throws Exception {
		if (q == null || q.isEmpty()){
			throw new ArgumentException();
		}
		
		if (n == null || n.isEmpty()){
			throw new ArgumentException();
		}
		
		//-----------------------------------------------------------------------------------

		ServletContext context = request.getSession().getServletContext();
		String docPath = context.getRealPath(DIR_DOC);
		
		//-----------------------------------------------------------------------------------

		String path = docPath + q;
		if (path.charAt(path.length() - 1) != '/'){
			path += "/";
		}
		
		path += "result/";
		
		if (t != null && t.equalsIgnoreCase("thumb"))
			path += "thumbnail/";
		
		path += n;
		
		//-----------------------------------------------------------------------------------
		
		File file = new File(path);
		FileInputStream in = null;
		OutputStream out = null;
		Exception ex = null;
		
		try
		{
			long length = file.length();
			
			in = new FileInputStream(file);
			
			response.reset();
			//response.setContentType("application/octet-stream");
			
			String baseName = FileUtil.safeBaseName(n);
			String encFileName = FileUtil.encodeFileName(baseName);
	        
	        response.setHeader("Content-Disposition", "attachment;filename=\""+encFileName+"\";");
			response.setHeader("Content-Transfer-Encoding", "binary");
			
			if (length > 0)
				response.setHeader("Content-Length", "" + length);
			
			out = response.getOutputStream();
			
			FileUtil.write(in, out);
		}
		catch (IOException ioe)
		{
			DebugUtil.print(ioe);
			
			System.out.println("[download] IOException");
			ex = ioe;
		}
		catch (Exception e)
		{
			DebugUtil.print(e);
			System.out.println("[download] Exception");
			ex = e;
		}
		finally
		{
			if (in != null){
				try
				{
					in.close();
				}
				catch (IOException ioe)
				{
					System.out.println("[download] in close IOException");
				}
				catch (Exception e)
				{
					System.out.println("[download] in close Exception");
				}
			}
			
			if (out != null){
				try
				{
					out.close();
				}
				catch (IOException ioe)
				{
					System.out.println("[download] out close IOException");
				}
				catch (Exception e)
				{
					System.out.println("[download] out close Exception");
				}
			}
		}
		
		if (ex != null)
			throw ex;
	}
	
	//-----------------------------------------------------------------------------------
	
	private static Exception exec(HttpServletRequest request, String docPath, String dir, String tempDir){
		ServletContext context = request.getSession().getServletContext();
		String modPath = context.getRealPath(DIR_CONVERTER);

		//-----------------------------------------------------------------------------------
		
		String[] cmds = new String[] {
			"java", "-jar", "PolarisConverter8.jar", IMG_TYPE,
			docPath, dir,
			"" + IMG_WIDTH, "" + IMG_HEIGHT,
			tempDir
		};
		
		try
		{
			DefaultExecutor executor = new DefaultExecutor();
			CommandLine cmdLine = CommandLine.parse(cmds[0]);
			for (int i=1; i < cmds.length; i++){
				cmdLine.addArguments(cmds[i]);
			}
			
			executor.setWorkingDirectory(new File(modPath));
			
			ByteArrayOutputStream out = new ByteArrayOutputStream();
			PumpStreamHandler handler = new PumpStreamHandler(out, out);
			executor.setStreamHandler(handler);
			
			executor.setWatchdog(new ExecuteWatchdog(60000 * 2));

			//-----------------------------------------------------------------------------------
	
			int r = executor.execute(cmdLine);
			
			System.out.println("[CONVERTER] resut=" + r);

			if (out.size() > 0){
				String s = out.toString("UTF-8");
				
				System.out.println("[CONVERTER] OUTPUT ==============================");
				System.out.println(s);
				
				//String lines[] = s.replaceAll("\r",  "").split("\n");
				
				String loaderrcode = null, printerrcode = null;
				
				Matcher m = loadFail.matcher(s);
				if (m.find()){
					loaderrcode = m.group(1);
					if (!loaderrcode.isEmpty()){
						int errcode = Integer.parseInt(loaderrcode);
						throw new DocConverterException("load", errcode);
					}
				}
				
				m = printFail.matcher(s);
				if (m.find()){
					printerrcode = m.group(1);
					
					if (!printerrcode.isEmpty()){
						int errcode = Integer.parseInt(loaderrcode);
						throw new DocConverterException("print", errcode);
					}
				}
			}
			
			return null;
		}
		catch (Exception e)
		{
			DebugUtil.print(e);
			
			System.out.println("[Exception] 실행 중 오류");
			return e;
		}
	}

}
