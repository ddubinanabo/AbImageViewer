package com.abrain.wiv.utils;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileFilter;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import javax.activation.MimetypesFileTypeMap;

import org.apache.commons.io.filefilter.WildcardFileFilter;

/**
 * 파일 관련 도구
 * @author Administrator
 *
 */
public class FileUtil {
	/**
	 * 기본 버퍼 크기
	 */
	public static final int BUFSIZ = 20480;

	//-----------------------------------------------------------------------------------
	
	/**
	 * 파일의 mime-type을 가져옵니다.
	 * @param file 파일 객체
	 * @return mime-type
	 */
	public static String contentType(File file) {
		Path path = Paths.get(file.getAbsolutePath());
		
		String mimeType = null;
		try
		{
			mimeType = Files.probeContentType(path);
		}
		catch (Exception e)
		{
			DebugUtil.print(e);
		}
		return mimeType;
	}
//	
//	private static MimetypesFileTypeMap mime;
//	
//	public static String contentType(File file) {
//		if (mime == null) mime = new MimetypesFileTypeMap();
//		return mime.getContentType(file);
//	}

	//-----------------------------------------------------------------------------------
	
	/**
	 * 경로와 인자들을 경로 구분자로 구분하여 가져옵니다.
	 * @param path 경로
	 * @param arg 인자1, 인자2, ... 인자N
	 * @return 합쳐진 경로
	 */
	public static String combinePath(String path, String ...arg) {
		java.nio.file.Path oPath = java.nio.file.Paths.get(path, arg);
		return oPath.toString();
	}

	//-----------------------------------------------------------------------------------
	
//	public static String path(String path) {
//		return path.replaceAll("\\\\", "/");
//	}

//	public static String combine2(String path1, String path2) {
//		if (path1 == null && path2 == null)
//			return null;
//		
//		String cpath1 = null, cpath2 = null;
//		if (path1 != null) {
//			cpath1 = path(path1);
//			if (cpath1.charAt(cpath1.length() - 1) == '/')
//				cpath1 = cpath1.substring(0, cpath1.length() - 1);
//		}
//		if (path2 != null) {
//			cpath2 = path(path2);
//			if (cpath2.charAt(cpath2.length() - 1) == '/')
//				cpath2 = cpath2.substring(0, cpath2.length() - 1);
//		}
//		
//		boolean existCPath1 = cpath1 != null && cpath1.isEmpty();
//		boolean existCPath2 = cpath2 != null && cpath2.isEmpty();
//		
//		return cpath1 + (existCPath1 && existCPath2 ? "/" : "") + cpath2;
//	}

	//-----------------------------------------------------------------------------------

//	public static String combineDir(boolean mkdir, String path, String ...arg) {
//		File dir = null;
//		java.nio.file.Path oPath = null;
//		
//		if (mkdir) {	
//			dir = new File(path);
//			if (!dir.exists()) {
//				dir.mkdir();
//			}
//		}
//		
//		if (arg != null) {
//			for (int i=0; i < arg.length; i++) {
//				String s = arg[i];
//				
//				oPath = java.nio.file.Paths.get(path, s);
//				dir = oPath.toFile();
//				
//				if (mkdir) {
//					if (!dir.exists()) {
//						dir.mkdir();
//					}
//				}
//				
//				path = oPath.toString();
//			}
//		}
//		return path;
//	}
	
	//-----------------------------------------------------------------------------------

	/**
	 * 안전한 파일명을 가져옵니다.
	 * @param basename 파일명
	 * @return 안전한 파일명
	 */
	public static String safeBaseName(String basename){
		return basename.replace("\\", "").replace("/", "").replace(":", "").replace("*", "").replace("?", "")
				.replace("\"", "").replace("<", "").replace(">", "").replace("|", "");
	}
	
	/**
	 * 파일명을 URL 형식으로 인코딩합니다.
	 * @param filename 파일명
	 * @return 인코딩된 파일명
	 * @throws Exception 예외
	 */
	public static String encodeFileName(String filename)
			throws Exception {
		return java.net.URLEncoder.encode(filename, "UTF-8");
	}
	
	//-----------------------------------------------------------------------------------
	
	/**
	 * 폴더의 유니크한 이름을 가진 폴더를 생성하고, 그 경로를 가져옵니다.
	 * @param dir 폴더
	 * @return 유니크한 폴더 경로
	 */
	public static String unique (String dir){
		return unique(dir, true);
	}

	/**
	 * 폴더의 유니크한 이름을 가진 폴더의 경로를 가져옵니다.
	 * @param dir 폴더 경로
	 * @param mkdir 폴더를 생성할 지 여부
	 * @return 유니크한 폴더 경로
	 */
	public static String unique (String dir, boolean mkdir){
		UUID uid = UUID.randomUUID();
		//String id = uid.toString().replaceAll("-", "").toUpperCase();
		String path = combinePath(dir, uid.toString());
		File file = new File(path);
		
		while (file.exists()){
			uid = UUID.randomUUID();
			path = combinePath(dir, uid.toString());
			file = new File(path);
		}
		
		if (mkdir)
			file.mkdir();
		
		return path;
	}
	
	//-----------------------------------------------------------------------------------
	
	/**
	 * 파일에 바이너리 데이터를 씁니다.
	 * @param path 파일 경로
	 * @param bytes 바이너리 데이터
	 * @throws Exception FileNotFoundException, Exception
	 */
	public static void write (String path, byte[] bytes) throws Exception{
		FileOutputStream out = null;
		
		try
		{
			out = new FileOutputStream(path);
			out.write(bytes);
		}
		catch (FileNotFoundException fnfe)
		{
			DebugUtil.print(fnfe);
			
			System.out.println("[FileNotFoundException] 파일을 찾을 수 없습니다");
			
			throw fnfe;
		}
		catch (Exception e)
		{
			DebugUtil.print(e);
			
			System.out.println("[IOException] 파일 쓰기 중 예외 발생");
			
			throw e;
		}
		finally
		{
			if (out != null){
				try
				{
					out.close();
				}
				catch (IOException ioe)
				{
					System.out.println("[IOException] 파일 닫기 중 예외 발생");
				}
			}
		}
	}
	
	//-----------------------------------------------------------------------------------
	
	/**
	 * 입력 스트림을 읽어 출력 스트림에 씁니다. 
	 * @param in 입력 스트림
	 * @param out 출력 스트림
	 * @throws Exception 예외
	 */
	public static void write(InputStream in, OutputStream out) throws Exception{
		write(in, out, BUFSIZ);
	}
	
	/**
	 * 입력 스트림을 읽어 출력 스트림에 씁니다.
	 * @param in 입력 스트림
	 * @param out 출력 스트림
	 * @param bufsiz 버퍼 크기
	 * @throws Exception 예외
	 */
	public static void write(InputStream in, OutputStream out, int bufsiz) throws Exception{
        byte[] buf = new byte[bufsiz];
        int len = -1;
		
        while((len = in.read(buf, 0, buf.length)) != -1) {
        	out.write(buf, 0, len);
        }
	}
	
	//-----------------------------------------------------------------------------------
	
	/**
	 * 파일에서 바이너리 데이터를 읽어 옵니다.
	 * @param path 파일 경로
	 * @return 바이너리 데이터
	 * @throws Exception 예외
	 */
	public static byte[] read (String path) throws Exception{
		return read(path, BUFSIZ);
	}
	
	/**
	 * 파일에서 바이너리 데이터를 읽어 옵니다.
	 * @param path 파일 경로
	 * @param bufsiz 버퍼 크기
	 * @return 바이너리 데이터
	 * @throws Exception 예외
	 */
	public static byte[] read (String path, int bufsiz) throws Exception{
		FileInputStream in = null;
		ByteArrayOutputStream out = new ByteArrayOutputStream();
		
		try
		{
			in = new FileInputStream(path);
			
			write(in, out, bufsiz);
			
			return out.toByteArray();
		}
		catch (FileNotFoundException fnfe)
		{
			DebugUtil.print(fnfe);
			
			System.out.println("[FileNotFoundException] 파일을 찾을 수 없습니다");
			
			throw fnfe;
		}
		catch (Exception e)
		{
			DebugUtil.print(e);
			
			System.out.println("[IOException] 파일 쓰기 중 예외 발생");
			
			throw e;
		}
		finally
		{
			if (out != null){
				try
				{
					out.close();
				}
				catch (IOException ioe)
				{
					System.out.println("[IOException] 파일 닫기 중 예외 발생");
				}
			}
		}
	}
	
	//-----------------------------------------------------------------------------------
	
	/**
	 * 스트림에서 바이너리 데이터를 읽어옵니다.
	 * @param in 입력 스트림
	 * @return 바이너리 데이터
	 * @throws Exception 예외
	 */
	public static byte[] read (InputStream in) throws Exception{
		return read(in, BUFSIZ);
	}
	
	/**
	 * 스트림에서 바이너리 데이터를 읽어옵니다.
	 * @param in 입력 스트림
	 * @param bufsiz 버퍼 크기
	 * @return 바이너리 데이터
	 * @throws Exception 예외
	 */
	public static byte[] read (InputStream in, int bufsiz) throws Exception{
		ByteArrayOutputStream out = new ByteArrayOutputStream();
		
		write(in, out, bufsiz);
		return out.toByteArray();
	}
	
	//-----------------------------------------------------------------------------------
	
	/**
	 * 파일에서 바이너리 데이터를 읽어옵니다.
	 * @param file 파일 객체
	 * @return 바이너리 데이터
	 * @throws Exception 예외
	 */
	public static byte[] read (File file) throws Exception{
		return read(file, BUFSIZ);
	}
	
	/**
	 * 파일에서 바이너리 데이터를 읽어옵니다.
	 * @param file 파일 객체
	 * @param bufsiz 버퍼 크기
	 * @return 바이너리 데이터
	 * @throws Exception 예외
	 */
	public static byte[] read (File file, int bufsiz) throws Exception{
		ByteArrayOutputStream out = new ByteArrayOutputStream();
		FileInputStream in = null;
		
		try
		{
			in = new FileInputStream(file);
			
			write(in, out, bufsiz);
			return out.toByteArray();
		}
		catch (FileNotFoundException fnfe)
		{
			DebugUtil.print(fnfe);
			
			System.out.println("[WEB-DOWNLOAD] in open FileNotFoundException");
			
			throw fnfe;
		}
		catch (Exception e)
		{
			DebugUtil.print(e);
			
			System.out.println("[WEB-DOWNLOAD] in open IOException");
			
			throw e;
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
					System.out.println("[WEB-DOWNLOAD] in close IOException");
				}
				catch (Exception e)
				{
					System.out.println("[WEB-DOWNLOAD] in close Exception");
				}
			}
			
			if (out != null){
				try
				{
					out.close();
				}
				catch (Exception e)
				{
					System.out.println("[WEB-DOWNLOAD] out close Exception");
				}
			}
		}
	}
	
	/**
	 * 파일을 와일드 카드 패턴으로 검색합니다. 파일이 없거나 디렉터리면 null을 리턴합니다.
	 * @param dir 디렉터리 경로
	 * @param pattern 와일드 카드 패턴
	 * @return 파일 객체
	 */
	public static File searchFile (String dir, String pattern) {
		File dirFile = new File(dir);
		FileFilter filter = new WildcardFileFilter(pattern);
		File[] files = dirFile.listFiles(filter);
		
		int numFiles = files != null ? files.length : 0;
		for (int i=0; i < numFiles; i++) {
			File file = files[i];
			
			if (file.isDirectory())
				continue;
			
			return file;
		}		
		return null;
	}
	
	/**
	 * 와일드 카드 패턴으로 파일들을 검색합니다. 파일이 없거나 디렉터리면 null을 리턴합니다.
	 * @param dir 디렉터리 경로
	 * @param pattern 와일드 카드 패턴
	 * @return 파일 객체
	 */
	public static File[] searchFiles (String dir, String pattern) {
		File dirFile = new File(dir);
		FileFilter filter = new WildcardFileFilter(pattern);
		File[] files = dirFile.listFiles(filter);
		
		List<File> r = new ArrayList<>();
		
		int numFiles = files != null ? files.length : 0;
		for (int i=0; i < numFiles; i++) {
			File file = files[i];
			
			if (file.isDirectory())
				continue;
			
			r.add(file);
		}		
		return r.toArray(new File[r.size()]);
	}

	/**
	 * 파일 객체를 가져옵니다. 파일이 없거나 디렉터리면 null을 리턴합니다.
	 * @param dir 디렉터리 경로
	 * @param filename 파일명
	 * @return 파일 객체
	 */
	public static File getFile (String dir, String filename) {
		File file = new File(FileUtil.combinePath(dir, filename));
		
		if (!file.exists())
			return null;
		
		if (file.isDirectory())
			return null;
		
		return file;
	}
	
}
