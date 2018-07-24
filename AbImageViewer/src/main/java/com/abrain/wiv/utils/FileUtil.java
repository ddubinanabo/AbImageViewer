package com.abrain.wiv.utils;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.UUID;

import com.sun.xml.internal.messaging.saaj.util.ByteOutputStream;

public class FileUtil {
	public static final int BUFSIZ = 20480;
	
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
		String path = dir + "/" + uid;
		File file = new File(path);
		
		while (file.exists()){
			uid = UUID.randomUUID();
			path = dir + "/" + uid;
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
