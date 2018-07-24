package com.abrain.wiv.io;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.util.Base64;
import java.util.UUID;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.commons.io.FileUtils;

import com.abrain.wiv.utils.DebugUtil;
import com.abrain.wiv.utils.FileUtil;

public class AbPartialFile {
	
	public static class Result {
		public boolean completed;
		public File file;
		public String sessionId;
		public byte[] bytes;
	};
	
	public static class AllocResult {
		public String path;
		public String id;
	};

	//-----------------------------------------------------------------------------------
	//-----------------------------------------------------------------------------------
	//-----------------------------------------------------------------------------------

	public static final String MID_PARTIALS = "partials";
	public static final String MID_PRINT_SUPPORT = "prints";

	public static final String MID_PRINT_SUPPORT_IMAGE = "img-";

	//-----------------------------------------------------------------------------------
	
	private static final boolean debugMode = false;

	//-----------------------------------------------------------------------------------
	
	/**
	 * 아무 작업도 안함
	 */
	public static final int POSTPRC_NONE = 0;
	/**
	 * 바이너리 데이터로 변환하여 읽음
	 */
	public static final int POSTPRC_READ_BYTES = 1;
	/**
	 * 바이러니 데이터로 변환하여 재저장
	 */
	public static final int POSTPRC_SAVE_BYTES = 2;
	/**
	 * 임시 파일을 삭제
	 */
	public static final int POSTPRC_REMOVE = 4;

	//-----------------------------------------------------------------------------------
	
	private static final String DIR_FILES = "/WEB-INF/files/";

	//-----------------------------------------------------------------------------------

	/**
	 * 임시 폴더 할당
	 * <p>임시 폴더에 사용할 폴더를 생성해서 중복되지 않게 한다.
	 * @param request
	 * @param middleName
	 * @return
	 */
	public static AllocResult alloc(HttpServletRequest request, String middleName){
		String basePath = getBasePath(request, middleName);

		//-----------------------------------------------------------------------------------
		
		UUID uid = UUID.randomUUID();
		String id = uid.toString().replaceAll("-", "").toUpperCase();
		File target = new File(basePath + "/" + id);
		
		while(target.exists()){
			uid = UUID.randomUUID();
			id = uid.toString().replaceAll("-", "").toUpperCase();
			target = new File(basePath + "/" + id);
		}
		
		target.mkdir();

		//-----------------------------------------------------------------------------------
		
		System.out.println("[PARTIAL-FILE]["+middleName+"] ALLOCATED ("+id+")");
		
		AllocResult r = new AllocResult();
		r.id = id;
		r.path = basePath + "/" + id;
		
		return r;
	}
	
	//-----------------------------------------------------------------------------------
	
	public static Object saveText(HttpServletRequest request, String middleName, String id, String filename, String text){
		String filepath = getPath(request, middleName, id, filename);
		
		File file = new File(filepath);
		
		FileWriter fw = null;
		FileInputStream in = null;
		
		try
		{
			file.createNewFile();
			
			fw = new FileWriter(file, true);
			BufferedWriter bw = new BufferedWriter(fw);
			
			PrintWriter w = new PrintWriter(bw, true);
			w.write(text);
			w.flush();
			w.close();
			w = null;
			bw = null;
			
			return null;
		}
		catch (FileNotFoundException fnfe)
		{
			DebugUtil.print(fnfe);
			
			System.out.println("[PARTIAL-FILE]["+middleName+"]["+filename+"] FileNotFoundException");
			return fnfe;
		}
		catch (IOException ioe)
		{
			DebugUtil.print(ioe);
			
			System.out.println("[PARTIAL-FILE]["+middleName+"]["+filename+"] IOException");
			return ioe;
		}
		catch (Exception e)
		{
			DebugUtil.print(e);
			
			System.out.println("[PARTIAL-FILE]["+middleName+"]["+filename+"] Exception");
			return e;
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
					System.out.println("[PARTIAL-FILE]["+middleName+"]["+filename+"] in close IOException");
				}
				catch (Exception e)
				{
					System.out.println("[PARTIAL-FILE]["+middleName+"]["+filename+"] in close Exception");
				}
			}
			
			if (fw != null){
				try
				{
					fw.close();
				}
				catch (Exception e)
				{
					System.out.println("[PARTIAL-FILE]["+middleName+"]["+filename+"] out close Exception");
				}
			}
		}		
	}

	//-----------------------------------------------------------------------------------
	
	/**
	 * 분할 전송된 파일 임시 저장
	 * <p>전체 분할 데이터를 모두 저장하게 되면 임시 파일을 삭제하고, 저장된 데이터를 바이트배열로 리턴한다.
	 * @param request HTTP 서블릿 Request
	 * @param middleName 임시 폴더명
	 * @param id 아이디
	 * @param filename 저장 파일명
	 * @param partials 전체 분할 수
	 * @param partial 현재 분할 인덱스
	 * @param content 분할 데이터
	 * @return
	 * @throws Exception
	 */
	public static Object save(HttpServletRequest request, String middleName, String id, String filename, int partials, int partial, String content) throws Exception{
		return save(request, middleName, id, filename, partials, partial, content, POSTPRC_NONE);
	}

	/**
	 * 분할 전송된 파일 임시 저장
	 * <p>저장된 데이터가 BASE64이므로, 바이너리로 변환하는 작업을 해야 함.
	 * <p>postProc 인자는 분할된 모든 자료를 저장 후 어떤 작업을 진행할 지를 결정함.
	 * @param request HTTP 서블릿 Request
	 * @param middleName 임시 폴더명
	 * @param id 아이디
	 * @param filename 저장 파일명
	 * @param partials 전체 분할 수
	 * @param partial 현재 분할 인덱스
	 * @param content 분할 데이터
	 * @param postProc 분할된 모든 자료를 저장 후 어떤 작업을 진행할 지를 결정함.
	 * @return
	 * @throws Exception
	 */
	public static Object save(
			HttpServletRequest request,
			String middleName,
			String id,
			String filename,
			int partials,
			int partial,
			String content,
			int postProc) throws Exception{
		String filepath = getPath(request, middleName, id, filename);
		
		HttpSession session = request.getSession();
		String sessionId = session.getId();
		
		File file = new File(filepath);
		
		OutputStreamWriter fw = null;
		FileInputStream in = null;
		
		try
		{
			if (partial == 0){
				file.createNewFile();
			}
			
			fw = new OutputStreamWriter(new FileOutputStream(file, true), "UTF-8");
			BufferedWriter bw = new BufferedWriter(fw);
			
			PrintWriter w = new PrintWriter(bw, true);
			w.append(content);
			w.flush();
			w.close();
			w = null;
			bw = null;
			
			
			Result r = new Result();
			r.sessionId = sessionId;
			r.file = file;
			
			if (partial + 1 >= partials){
				r.completed = true;
				
				if (postProc != POSTPRC_NONE){
					boolean flagReadBytes = (postProc & POSTPRC_READ_BYTES) == POSTPRC_READ_BYTES;
					boolean flagSaveBytes = (postProc & POSTPRC_SAVE_BYTES) == POSTPRC_SAVE_BYTES;
					
					byte[] inbytes = null, binary = null;
					
					if (flagReadBytes || flagSaveBytes){
						inbytes = new byte[(int)file.length()];
						
						in = new FileInputStream(file);
						in.read(inbytes);
						in.close();
						in = null;
					}

					if ((postProc & POSTPRC_REMOVE) == POSTPRC_REMOVE){
						if (!debugMode)
							file.delete();
					}
					
					binary = Base64.getDecoder().decode(new String(inbytes, "UTF-8"));
					
					if (flagReadBytes)
						r.bytes = binary;
					
					if (flagSaveBytes){
						FileOutputStream out = new FileOutputStream(file);
						out.write(binary);
						out.close();
						out = null;
					}
				}
			}
			
			return r;
		}
		catch (FileNotFoundException fnfe)
		{
			DebugUtil.print(fnfe);
			
			System.out.println("[PARTIAL-FILE]["+middleName+"]["+filename+"]["+partial+"/"+partials+"] FileNotFoundException");
			return fnfe;
		}
		catch (IOException ioe)
		{
			DebugUtil.print(ioe);
			
			System.out.println("[PARTIAL-FILE]["+middleName+"]["+filename+"]["+partial+"/"+partials+"] IOException");
			return ioe;
		}
		catch (Exception e)
		{
			DebugUtil.print(e);
			
			System.out.println("[PARTIAL-FILE]["+middleName+"]["+filename+"]["+partial+"/"+partials+"] Exception");
			return e;
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
					System.out.println("[PARTIAL-FILE]["+middleName+"]["+filename+"]["+partial+"/"+partials+"] in close IOException");
				}
				catch (Exception e)
				{
					System.out.println("[PARTIAL-FILE]["+middleName+"]["+filename+"]["+partial+"/"+partials+"] in close Exception");
				}
			}
			
			if (fw != null){
				try
				{
					fw.close();
				}
				catch (Exception e)
				{
					System.out.println("[PARTIAL-FILE]["+middleName+"]["+filename+"]["+partial+"/"+partials+"] out close Exception");
				}
			}
		}
	}
	
	//-----------------------------------------------------------------------------------
	
	/**
	 * 임시 폴더의 파일에 대한 File 인스턴스를 리턴한다.
	 * @param request
	 * @param middleName
	 * @param id
	 * @param filename
	 * @return
	 */
	public static File read(HttpServletRequest request, String middleName, String id, String filename){
		File file = new File(getPath(request, middleName, id, filename));
		return file;
	}

	/**
	 * 임시 폴더의 파일에 대한 File 인스턴스를 리턴한다.
	 * <p>IE의 P3P 정책때문에 추가된 코드로, 세션ID를 인자로 받는다.
	 * @param request
	 * @param sessionId
	 * @param middleName
	 * @param id
	 * @param filename
	 * @return
	 */
	public static File readWithSession(HttpServletRequest request, String sessionId, String middleName, String id, String filename){
		File file = new File(getPathWithSession(request, sessionId, middleName, id, filename));
		return file;
	}
	
	//-----------------------------------------------------------------------------------
	
	/**
	 * 저장된 임시 파일의 내용(BASE64)을 읽는다.
	 * @param request
	 * @param middleName
	 * @param id
	 * @param filename
	 * @return
	 * @throws Exception
	 */
	public static String readText(HttpServletRequest request, String middleName, String id, String filename) throws Exception {
		File file = read(request, middleName, id, filename);
		
		byte[] r = FileUtil.read(file);
		return new String(r, "UTF-8");
	}

	/**
	 * 저장된 임시 파일의 내용(BASE64)을 읽는다.
	 * <p>IE의 P3P 정책때문에 추가된 코드로, 세션ID를 인자로 받는다.
	 * @param request
	 * @param sessionId
	 * @param middleName
	 * @param id
	 * @param filename
	 * @return
	 * @throws Exception
	 */
	public static String readTextWithSession(HttpServletRequest request, String sessionId, String middleName, String id, String filename) throws Exception {
		File file = readWithSession(request, sessionId, middleName, id, filename);
		
		byte[] r = FileUtil.read(file);
		return new String(r, "UTF-8");
	}
	
	//-----------------------------------------------------------------------------------
	
	/**
	 * 저장된 임시 파일의 내용(BASE64)을 읽어 바이너리로 변한해서 리턴한다.
	 * @param request
	 * @param middleName
	 * @param id
	 * @param filename
	 * @return
	 * @throws Exception
	 */
	public static byte[] readBytes(HttpServletRequest request, String middleName, String id, String filename) throws Exception {
		String text = readText(request, middleName, id, filename);
		return Base64.getDecoder().decode(text);
	}

	/**
	 * 저장된 임시 파일의 내용(BASE64)을 읽어 바이너리로 변한해서 리턴한다.
	 * <p>IE의 P3P 정책때문에 추가된 코드로, 세션ID를 인자로 받는다.
	 * @param request
	 * @param sessionId
	 * @param middleName
	 * @param id
	 * @param filename
	 * @return
	 * @throws Exception
	 */
	public static byte[] readBytesWithSession(HttpServletRequest request, String sessionId, String middleName, String id, String filename) throws Exception {
		String text = readTextWithSession(request, sessionId, middleName, id, filename);
		return Base64.getDecoder().decode(text);
	}
	
	//-----------------------------------------------------------------------------------
	
	/**
	 * 저장된 임시 파일을 삭제한다.
	 * @param request
	 * @param middleName
	 * @param id
	 * @param filename
	 * @return
	 */
	public static boolean removeFile(HttpServletRequest request, String middleName, String id, String filename) {
		File file = read(request, middleName, id, filename);
		return file.delete();
	}
	
	/**
	 * 저장된 임시 파일을 삭제한다.
	 * <p>IE의 P3P 정책때문에 추가된 코드로, 세션ID를 인자로 받는다.
	 * @param request
	 * @param sessionId
	 * @param middleName
	 * @param id
	 * @param filename
	 * @return
	 */
	public static boolean removeFileWithSession(HttpServletRequest request, String sessionId, String middleName, String id, String filename) {
		File file = readWithSession(request, sessionId, middleName, id, filename);
		return file.delete();
	}
	
	//-----------------------------------------------------------------------------------
	
	/**
	 * 사용한 임시 폴더의 삭제를 시도한다. (폴더 내 파일이 없는 경우에만 삭제를 시도한다)
	 * @param request
	 * @param middleName
	 * @param id
	 * @return
	 */
	public static boolean removeDirectory(HttpServletRequest request, String middleName, String id) {
		String basePath = getBasePath(request, middleName);
		return tryRemoveDirectory(basePath, id);
	}
	
	//-----------------------------------------------------------------------------------
	
	/**
	 * 사용한 임시 폴더의 삭제를 시도한다. (폴더 내 파일이 없는 경우에만 삭제를 시도한다)
	 * <p>IE의 P3P 정책때문에 추가된 코드로, 세션ID를 인자로 받는다.
	 * @param request
	 * @param sessionId
	 * @param middleName
	 * @param id
	 * @return
	 */
	public static boolean removeDirectoryWithSession(HttpServletRequest request, String sessionId, String middleName, String id) {
		String basePath = getBasePathWithSession(request, sessionId, middleName);
		return tryRemoveDirectory(basePath, id);
	}
	
	//-----------------------------------------------------------------------------------
	
	private static boolean tryRemoveDirectory(String basePath, String id){
		String tmpPath = basePath + "/" + id;
		File tmpPathFile = new File(tmpPath);
		
		File[] files = tmpPathFile.listFiles();
		int cnt = 0;
		for (File file : files){
			if (file.isFile())
				cnt++;
		}
		
		if (cnt == 0)
			return tmpPathFile.delete();
		
		return false;		
	}
	
	//-----------------------------------------------------------------------------------
	
	/**
	 * 임시 폴더를 삭제한다.
	 * <p> 하위 폴더 및 파일들도 같이 삭제
	 * @param request
	 * @param middleName
	 * @param id
	 */
	public static void remove(HttpServletRequest request, String middleName, String id){
		HttpSession session = request.getSession();
		
		ServletContext context = session.getServletContext();
		String sessionId = session.getId();

		//-----------------------------------------------------------------------------------
	
		String path = context.getRealPath(DIR_FILES + "tmp/" + sessionId);
		File pathFile = new File(path);
		if (!pathFile.exists())
			pathFile.mkdir();

		//-----------------------------------------------------------------------------------
		
		String tmpPath = path + "/" + middleName + "/" + id;
		
		File tmpPathFile = new File(tmpPath);
		if (tmpPathFile.exists()){
			try
			{
				if (!debugMode)
					FileUtils.deleteDirectory(tmpPathFile);
				
				System.out.println("[PARTIAL-FILE]["+middleName+"]["+id+"][REMOVE-DIR] Removed!!!");
			}
			catch (IOException ioe)
			{
				DebugUtil.print(ioe);
				
				System.out.println("[PARTIAL-FILE]["+middleName+"]["+id+"][REMOVE-DIR] IOException");
			}
			catch (Exception e)
			{
				DebugUtil.print(e);
				
				System.out.println("[PARTIAL-FILE]["+middleName+"]["+id+"][REMOVE-DIR] Exception");
			}
		}
	}
	
	//-----------------------------------------------------------------------------------
	//-----------------------------------------------------------------------------------
	//-----------------------------------------------------------------------------------
	
	private static boolean debugFirstCalled = false;
	private static Object debugLock = new Object();
	
	private static String getBasePath(HttpServletRequest request, String middleName){
		return getBasePathWithSession(request, null, middleName);
	}

	private static String getBasePathWithSession(HttpServletRequest request, String sessionId, String middleName){
		
		HttpSession session = request.getSession();		
		ServletContext context = session.getServletContext();
		
		if (sessionId == null || sessionId.isEmpty())
			sessionId = session.getId();

		//-----------------------------------------------------------------------------------
	
		String path = context.getRealPath(DIR_FILES + "/tmp");
		File pathFile = new File(path);
		if (!pathFile.exists())
			pathFile.mkdir();

		//-----------------------------------------------------------------------------------
	
		String tmpPath = path + "/" + sessionId;
		File tmpPathFile = new File(tmpPath);
		if (!tmpPathFile.exists())
			tmpPathFile.mkdir();

		//-----------------------------------------------------------------------------------
		
		String tmpMidPath = tmpPath + "/" + middleName;
		File tmpMidPathFile = new File(tmpMidPath);
		if (!tmpMidPathFile.exists())
			tmpMidPathFile.mkdir();

		//-----------------------------------------------------------------------------------

		if (!debugFirstCalled){
			System.out.println("[PARTIAL-FILE]["+middleName+"] " + tmpMidPath);
			
			synchronized (debugLock) {
				debugFirstCalled = true;
			}
		}
		
		return tmpMidPath;
	}

	//-----------------------------------------------------------------------------------
	
	private static String getPath(HttpServletRequest request, String middleName, String id, String filename){
		return getPathWithSession(request, null, middleName, id, filename);
	}

	private static String getPathWithSession(HttpServletRequest request, String sessionId, String middleName, String id, String filename){
		
		String basePath = getBasePathWithSession(request, sessionId, middleName);

		//-----------------------------------------------------------------------------------
		
		String tmpPath = basePath + "/" + id;
		File tmpPathFile = new File(tmpPath);
		if (!tmpPathFile.exists())
			tmpPathFile.mkdir();

		//-----------------------------------------------------------------------------------
		
		String filepath = tmpPath + "/" + filename;
	
		return filepath;
	}
	
}
