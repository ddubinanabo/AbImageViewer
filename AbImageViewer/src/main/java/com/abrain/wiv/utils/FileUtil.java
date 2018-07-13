package com.abrain.wiv.utils;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.UUID;

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
			System.out.println("[FileNotFoundException] 파일을 찾을 수 없습니다");
			
			throw fnfe;
		}
		catch (Exception e)
		{
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
}
