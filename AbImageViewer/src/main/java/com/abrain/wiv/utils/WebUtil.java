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

import com.abrain.wiv.enums.AbBrowserKind;

/**
 * 웹 관련 도구
 * @author Administrator
 *
 */
public class WebUtil {
	/**
	 * 아이피를 가져옵니다.
	 * @return 아이피
	 */
	public static String getRemoteIP(){
		HttpServletRequest req = ((ServletRequestAttributes)RequestContextHolder.currentRequestAttributes()).getRequest();
		return getRemoteIP(req);
	}
	
	/**
	 * 아이피를 가져옵니다.
	 * @param req HTTP 요청 정보
	 * @return 아이피
	 */
	public static String getRemoteIP(HttpServletRequest req){
		String ip = req.getHeader("X-FORWARDED-FOR");
		if (ip == null)
			ip = req.getRemoteAddr();
		
		return ip;
	}

	//-----------------------------------------------------------
	
	/**
	 * 브라우저의 종류를 가져옵니다.
	 * @param request HTTP 요청 정보
	 * @return 브라우저 종류
	 */
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
	
	/**
	 * 파일을 다운로드합니다.
	 * @param response HTTP 응답 정보
	 * @param file 다운로드할 파일 객체
	 * @return null이면 정상, null이 아니면 발생한 예외의 객체입니다.
	 */
	public static Exception download(HttpServletResponse response, File file) {
		return download(response, file, null);
	}
	
	/**
	 * 파일을 다운로드합니다.
	 * @param response HTTP 응답 정보
	 * @param file 다운로드할 파일 객체
	 * @param filename 파일명
	 * @return null이면 정상, null이 아니면 발생한 예외의 객체입니다.
	 */
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
	
	/**
	 * 바이너리 데이터를 다운로드합니다.
	 * @param response HTTP 응답 정보
	 * @param filename 파일명
	 * @param bytes 바이너리 데이터
	 * @return null이면 정상, null이 아니면 발생한 예외의 객체입니다.
	 */
	public static Exception download(HttpServletResponse response, String filename, byte[] bytes) {
		ByteArrayInputStream in = new ByteArrayInputStream(bytes);
		
		Exception r = download(response, filename, in, bytes.length);

		return r;
	}
	
	/**
	 * 입력 스트림에서 바리너리 데이터를 읽어 다운로드합니다.
	 * @param response HTTP 응답 정보
	 * @param filename 파일명
	 * @param in 입력 스트림
	 * @param length 읽을 길이
	 * @return null이면 정상, null이 아니면 발생한 예외의 객체입니다.
	 */
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
