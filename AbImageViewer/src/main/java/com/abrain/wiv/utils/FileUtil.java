package com.abrain.wiv.utils;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

import javax.activation.MimetypesFileTypeMap;

public class FileUtil {
	public static final int BUFSIZ = 20480;

	//-----------------------------------------------------------------------------------
	
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

	public static String safeBaseName(String basename){
		return basename.replace("\\", "").replace("/", "").replace(":", "").replace("*", "").replace("?", "")
				.replace("\"", "").replace("<", "").replace(">", "").replace("|", "");
	}
	
	public static String encodeFileName(String filename)
			throws Exception {
		return java.net.URLEncoder.encode(filename, "UTF-8");
	}
	
	//-----------------------------------------------------------------------------------
	
	public static String unique (String dir){
		return unique(dir, true);
	}

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
	
	public static void write(InputStream in, OutputStream out) throws Exception{
		write(in, out, BUFSIZ);
	}
	
	public static void write(InputStream in, OutputStream out, int bufsiz) throws Exception{
        byte[] buf = new byte[bufsiz];
        int len = -1;
		
        while((len = in.read(buf, 0, buf.length)) != -1) {
        	out.write(buf, 0, len);
        }
	}
	
	//-----------------------------------------------------------------------------------
	
	public static byte[] read (String path) throws Exception{
		return read(path, BUFSIZ);
	}
	
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
	
	public static byte[] read (InputStream in) throws Exception{
		return read(in, BUFSIZ);
	}
	
	public static byte[] read (InputStream in, int bufsiz) throws Exception{
		ByteArrayOutputStream out = new ByteArrayOutputStream();
		
		write(in, out, bufsiz);
		return out.toByteArray();
	}
	
	//-----------------------------------------------------------------------------------
	
	public static byte[] read (File file) throws Exception{
		return read(file, BUFSIZ);
	}
	
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
}
