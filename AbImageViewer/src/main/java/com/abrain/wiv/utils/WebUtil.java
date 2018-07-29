package com.abrain.wiv.utils;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import com.abrain.wiv.data.AbBrowserKind;

public class WebUtil {
	public static String getRemoteIP(){
		HttpServletRequest req = ((ServletRequestAttributes)RequestContextHolder.currentRequestAttributes()).getRequest();
		return getRemoteIP(req);
	}
	
	public static String getRemoteIP(HttpServletRequest req){
		String ip = req.getHeader("X-FORWARDED-FOR");
		if (ip == null)
			ip = req.getRemoteAddr();
		
		return ip;
	}

	//-----------------------------------------------------------
	
	public static AbBrowserKind getBrowser(HttpServletRequest request){
		String userAgent = new String(request.getHeader("User-Agent")).toLowerCase();
		
		if (userAgent.indexOf("trident") > 0 || userAgent.indexOf("msie") > 0) {
			return AbBrowserKind.ABBROWSER_IE;
		} else if (userAgent.indexOf("opera") > 0) {
			return AbBrowserKind.ABBROWSER_OPERA;
		} else if (userAgent.indexOf("firefox") > 0) {
			return AbBrowserKind.ABBROWSER_FIREFOX;
		}else if (userAgent.indexOf("chrome") > 0) {
			return AbBrowserKind.ABBROWSER_CHROME;
		}else if (userAgent.indexOf("safari") > 0) {
			return AbBrowserKind.ABBROWSER_SAFARI;
		}
		return AbBrowserKind.ABBROWSER_UNKNOWN;
	}

	//-----------------------------------------------------------
	
	public static Exception download(HttpServletResponse response, File file) {
		return download(response, file, null);
	}
	
	public static Exception download(HttpServletResponse response, File file, String filename) {
		long length = file.length();
		FileInputStream in = null;
		Exception r = null;
		
		try
		{
			in = new FileInputStream(file);
		}
		catch (FileNotFoundException fnfe)
		{
			DebugUtil.print(fnfe);
			
			r = fnfe;
			System.out.println("[WEB-DOWNLOAD] in open FileNotFoundException");
		}
		catch (Exception e)
		{
			DebugUtil.print(e);
			
			r = e;
			System.out.println("[WEB-DOWNLOAD] in open IOException");
		}
		finally
		{
		}
		
		if (r != null)
			return r;
		
		if (filename == null){
			filename = file.getName();
		}
		
		r = download(response, filename, in, length);

		return r;
	}
	
	public static Exception download(HttpServletResponse response, String filename, byte[] bytes) {
		ByteArrayInputStream in = new ByteArrayInputStream(bytes);
		
		Exception r = download(response, filename, in, bytes.length);

		return r;
	}
	
	public static Exception download(HttpServletResponse response, String filename, InputStream in, long length) {
		OutputStream out = null;
		Exception ex = null;
		
		try
		{
			out = response.getOutputStream();
						
			String baseName = FileUtil.safeBaseName(filename);
			String encFileName = FileUtil.encodeFileName(baseName);
			
	        response.setHeader("Content-Disposition", "attachment;filename=\""+encFileName+"\";");
			response.setHeader("Content-Transfer-Encoding", "binary");
			
			if (length > 0)
				response.setHeader("Content-Length", "" + length);
			
			FileUtil.write(in, out);
		}
		catch (IOException ioe)
		{
			DebugUtil.print(ioe);
			
			System.out.println("[WEB-DOWNLOAD] IOException");
			ex = ioe;
		}
		catch (Exception e)
		{
			DebugUtil.print(e);
			
			System.out.println("[WEB-DOWNLOAD] Exception");
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
				catch (IOException ioe)
				{
					System.out.println("[WEB-DOWNLOAD] out close IOException");
				}
				catch (Exception e)
				{
					System.out.println("[WEB-DOWNLOAD] out close Exception");
				}
			}
		}
		
		return ex;
	}
}
