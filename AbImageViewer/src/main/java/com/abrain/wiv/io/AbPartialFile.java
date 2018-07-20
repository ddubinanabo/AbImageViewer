package com.abrain.wiv.io;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Base64;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.commons.io.FileUtils;

public class AbPartialFile {
	
	public static class Result {
		public boolean completed;
		public File file;
		public byte[] bytes;
	};

	//-----------------------------------------------------------------------------------
	//-----------------------------------------------------------------------------------
	//-----------------------------------------------------------------------------------
	
	private static final String DIR_FILES = "/WEB-INF/files/";
	
	private static String getPath(HttpServletRequest request, String id, String type){
		
		HttpSession session = request.getSession();
		
		ServletContext context = session.getServletContext();
		String sessionId = session.getId();

		//-----------------------------------------------------------------------------------
	
		String path = context.getRealPath(DIR_FILES + sessionId);
		File pathFile = new File(path);
		if (!pathFile.exists())
			pathFile.mkdir();

		//-----------------------------------------------------------------------------------
		
		String tmpPath = path + "/" + id;
		File tmpPathFile = new File(tmpPath);
		if (!tmpPathFile.exists())
			tmpPathFile.mkdir();

		//-----------------------------------------------------------------------------------
		
		String filepath = path + "/" + id + "/" + type;
	
		return filepath;
	}

	public static Object save(HttpServletRequest request, String id, String type, int partials, int partial, String content) throws Exception{
		String filepath = getPath(request, id, type);
		
		File file = new File(filepath);
		
		FileWriter fw = null;
		FileInputStream in = null;
		
		try
		{
			if (partial == 0){
				file.createNewFile();
			}
			
			fw = new FileWriter(file, true);
			BufferedWriter bw = new BufferedWriter(fw);
			
			PrintWriter w = new PrintWriter(bw, true);
			w.append(content);
			w.flush();
			w.close();
			w = null;
			bw = null;
			
			Result r = new Result();
			r.file = file;
			
			if (partial + 1 >= partials){
				r.completed = true;
				
				byte[] inbytes = new byte[(int)file.length()];
				
				in = new FileInputStream(file);
				in.read(inbytes);
				in.close();
				in = null;
				
				file.delete();
				
				r.bytes = Base64.getDecoder().decode(new String(inbytes, "UTF-8"));
			}
			
			return r;
		}
		catch (FileNotFoundException fnfe)
		{
			System.out.println("[PARTIAL-FILE]["+type+"]["+partial+"/"+partials+"] FileNotFoundException");
			return fnfe;
		}
		catch (IOException ioe)
		{
			System.out.println("[PARTIAL-FILE]["+type+"]["+partial+"/"+partials+"] IOException");
			return ioe;
		}
		catch (Exception e)
		{
			System.out.println("[PARTIAL-FILE]["+type+"]["+partial+"/"+partials+"] Exception");
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
					System.out.println("[PARTIAL-FILE]["+type+"]["+partial+"/"+partials+"] in close IOException");
				}
				catch (Exception e)
				{
					System.out.println("[PARTIAL-FILE]["+type+"]["+partial+"/"+partials+"] in close Exception");
				}
			}
			
			if (fw != null){
				try
				{
					fw.close();
				}
				catch (Exception e)
				{
					System.out.println("[PARTIAL-FILE]["+type+"]["+partial+"/"+partials+"] out close Exception");
				}
			}
		}
	}
	
	public static void remove(HttpServletRequest request, String id){
		HttpSession session = request.getSession();
		
		ServletContext context = session.getServletContext();
		String sessionId = session.getId();

		//-----------------------------------------------------------------------------------
	
		String path = context.getRealPath(DIR_FILES + sessionId);
		File pathFile = new File(path);
		if (!pathFile.exists())
			pathFile.mkdir();

		//-----------------------------------------------------------------------------------
		
		String tmpPath = path + "/" + id;
		
		File tmpPathFile = new File(tmpPath);
		if (tmpPathFile.exists()){
			try
			{
				FileUtils.deleteDirectory(tmpPathFile);
				
				System.out.println("[RATIAL-FILE]["+id+"][REMOVE-DIR] Removed!!!");
			}
			catch (IOException ioe)
			{
				System.out.println("[RATIAL-FILE]["+id+"][REMOVE-DIR] IOException");
			}
			catch (Exception e)
			{
				System.out.println("[RATIAL-FILE]["+id+"][REMOVE-DIR] Exception");
			}
		}
	}
}
