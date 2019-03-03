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

/**
 * 분할 전송 파일 관리자
 * <p>* 분할 전송된 파일을 관리합니다.
 * @author Administrator
 *
 */
public class AbPartialFile {
	
	/**
	 * 전송 데이터 처리 정보
	 * @author Administrator
	 *
	 */
	public static class Result {
		/**
		 * 마지막 분할 데이터 여부
		 */
		public boolean completed;
		/**
		 * 저장한 파일 객체
		 */
		public File file;
		/**
		 * 세션 아이디
		 */
		public String sessionId;
		/**
		 * 저장한 바이너리 데이터<p>* 마지막 분할 데이터인 경우에만 설정됩니다.
		 */
		public byte[] bytes;
	};
	
	/**
	 * 할당된 폴더 정보
	 * @author Administrator
	 *
	 */
	public static class AllocResult {
		/**
		 * 폴더 경로
		 */
		public String path;
		/**
		 * 아이디
		 */
		public String id;
	};

	//-----------------------------------------------------------------------------------
	//-----------------------------------------------------------------------------------
	//-----------------------------------------------------------------------------------

	/**
	 * 분할 전송 폴더(partials)
	 */
	public static final String MID_PARTIALS = "partials";
	/**
	 * 인쇄 지원 폴더(prints)
	 */
	public static final String MID_PRINT_SUPPORT = "prints";

	/**
	 * 인쇄 임시 파일명 접두사(img-)
	 */
	public static final String MID_PRINT_SUPPORT_IMAGE = "img-";

	//-----------------------------------------------------------------------------------
	
	/**
	 * 디버그 모드
	 */
	private static final boolean debugMode = false;

	//-----------------------------------------------------------------------------------
	
	/**
	 * 아무 작업도 안함
	 * <p>* 작업 플래그
	 */
	public static final int POSTPRC_NONE = 0;
	/**
	 * 바이너리 데이터로 변환하여 읽음
	 * <p>* 작업 플래그
	 */
	public static final int POSTPRC_READ_BYTES = 1;
	/**
	 * 바이러니 데이터로 변환하여 재저장
	 * <p>* 작업 플래그
	 */
	public static final int POSTPRC_SAVE_BYTES = 2;
	/**
	 * 임시 파일을 삭제
	 * <p>* 작업 플래그
	 */
	public static final int POSTPRC_REMOVE = 4;

	//-----------------------------------------------------------------------------------
	
	private static final String DIR_FILES = "/WEB-INF/files/";

	//-----------------------------------------------------------------------------------

	/**
	 * 임시 폴더 할당
	 * <p>임시 폴더에 사용할 폴더를 생성해서 중복되지 않게 한다.
	 * @param request HTTP 요청 정보
	 * @param middleName 중간 폴더명
	 * @return 할당된 폴더 정보
	 */
	public static AllocResult alloc(HttpServletRequest request, String middleName){
		String basePath = getBasePath(request, middleName);

		//-----------------------------------------------------------------------------------
		
		UUID uid = UUID.randomUUID();
		String id = uid.toString().replaceAll("-", "").toUpperCase();
		File target = new File(FileUtil.combinePath(basePath, id));
		
		while(target.exists()){
			uid = UUID.randomUUID();
			id = uid.toString().replaceAll("-", "").toUpperCase();
			target = new File(FileUtil.combinePath(basePath, id));
		}
		
		target.mkdir();

		//-----------------------------------------------------------------------------------
		
		System.out.println("[PARTIAL-FILE]["+middleName+"] ALLOCATED ("+id+")");
		
		AllocResult r = new AllocResult();
		r.id = id;
		r.path = FileUtil.combinePath(basePath, id);
		
		return r;
	}
	
	//-----------------------------------------------------------------------------------
	
	/**
	 * 텍스트 파일을 저장합니다.
	 * @param request HTTP 요청 정보
	 * @param middleName 중간 폴더명
	 * @param id 아이디
	 * @param filename 파일명
	 * @param text 텍스트 내용
	 * @return null이면 성공, 아니면 발생한 예외 객체
	 */
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
	 * @return null이면 성공, 아니면 발생한 예외 객체
	 * @throws Exception 예외
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
	 * @param postProc 작업 플래그<p>* 분할된 모든 자료를 저장 후 어떤 작업을 진행할 지를 결정함.
	 * @return null이면 성공, 아니면 발생한 예외 객체
	 * @throws Exception 예외
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
	 * 임시 폴더의 파일에 대한 File 인스턴스를 리턴합니다.
	 * @param request HTTP 요청 정보
	 * @param middleName 중간 파일명
	 * @param id 아이디
	 * @param filename 파일명
	 * @return 파일 객체
	 */
	public static File read(HttpServletRequest request, String middleName, String id, String filename){
		File file = new File(getPath(request, middleName, id, filename));
		return file;
	}

	/**
	 * 임시 폴더의 파일에 대한 File 인스턴스를 리턴합니다.
	 * <p>IE의 P3P 정책때문에 추가된 코드로, 세션ID를 인자로 받습니다.
	 * @param request HTTP 요청 정보
	 * @param sessionId 세션 아이디
	 * @param middleName 중간 파일명
	 * @param id 아이디
	 * @param filename 파일명
	 * @return 파일 객체
	 */
	public static File readWithSession(HttpServletRequest request, String sessionId, String middleName, String id, String filename){
		File file = new File(getPathWithSession(request, sessionId, middleName, id, filename));
		return file;
	}
	
	//-----------------------------------------------------------------------------------
	
	/**
	 * 저장된 임시 파일의 내용(BASE64)을 읽습니다.
	 * @param request HTTP 요청 정보
	 * @param middleName 중간 파일명
	 * @param id 아이디
	 * @param filename 파일명
	 * @return 파일 내용
	 * @throws Exception 예외
	 */
	public static String readText(HttpServletRequest request, String middleName, String id, String filename) throws Exception {
		File file = read(request, middleName, id, filename);
		if (!file.exists())
			return null;
		
		byte[] r = FileUtil.read(file);
		return new String(r, "UTF-8");
	}

	/**
	 * 저장된 임시 파일의 내용(BASE64)을 읽습니다.
	 * <p>IE의 P3P 정책때문에 추가된 코드로, 세션ID를 인자로 받습니다.
	 * @param request HTTP 요청 정보
	 * @param sessionId 세션 아이디
	 * @param middleName 중간 파일명
	 * @param id 아이디
	 * @param filename 파일명
	 * @return 파일 내용
	 * @throws Exception 예외
	 */
	public static String readTextWithSession(HttpServletRequest request, String sessionId, String middleName, String id, String filename) throws Exception {
		File file = readWithSession(request, sessionId, middleName, id, filename);
		if (!file.exists())
			return null;
		
		byte[] r = FileUtil.read(file);
		return new String(r, "UTF-8");
	}
	
	//-----------------------------------------------------------------------------------
	
	/**
	 * 저장된 임시 파일의 내용(BASE64)을 읽어 바이너리로 변한해서 리턴합니다.
	 * @param request HTTP 요청 정보
	 * @param middleName 중간 파일명
	 * @param id 아이디
	 * @param filename 파일명
	 * @return 바이너리 데이터
	 * @throws Exception 예외
	 */
	public static byte[] readBytes(HttpServletRequest request, String middleName, String id, String filename) throws Exception {
		String text = readText(request, middleName, id, filename);
		if (text == null)
			return null;
		
		return Base64.getDecoder().decode(text);
	}

	/**
	 * 저장된 임시 파일의 내용(BASE64)을 읽어 바이너리로 변한해서 리턴합니다.
	 * <p>IE의 P3P 정책때문에 추가된 코드로, 세션ID를 인자로 받습니다.
	 * @param request HTTP 요청 정보
	 * @param sessionId 세션 아이디
	 * @param middleName 중간 파일명
	 * @param id 아이디
	 * @param filename 파일명
	 * @return 바이너리 데이터
	 * @throws Exception 예외
	 */
	public static byte[] readBytesWithSession(HttpServletRequest request, String sessionId, String middleName, String id, String filename) throws Exception {
		String text = readTextWithSession(request, sessionId, middleName, id, filename);
		if (text == null)
			return null;
		
		return Base64.getDecoder().decode(text);
	}
	
	//-----------------------------------------------------------------------------------
	
	/**
	 * 저장된 임시 파일을 삭제합니다.
	 * @param request HTTP 요청 정보
	 * @param middleName 중간 파일명
	 * @param id 아이디
	 * @param filename 파일명
	 * @return 삭제했으면 true, 아니면 false
	 */
	public static boolean removeFile(HttpServletRequest request, String middleName, String id, String filename) {
		File file = read(request, middleName, id, filename);
		return file.delete();
	}
	
	/**
	 * 저장된 임시 파일을 삭제합니다.
	 * <p>IE의 P3P 정책때문에 추가된 코드로, 세션ID를 인자로 받습니다.
	 * @param request HTTP 요청 정보
	 * @param sessionId 세션 아이디
	 * @param middleName 중간 파일명
	 * @param id 아이디
	 * @param filename 파일명
	 * @return 삭제했으면 true, 아니면 false
	 */
	public static boolean removeFileWithSession(HttpServletRequest request, String sessionId, String middleName, String id, String filename) {
		File file = readWithSession(request, sessionId, middleName, id, filename);
		return file.delete();
	}
	
	//-----------------------------------------------------------------------------------
	
	/**
	 * 사용한 임시 폴더의 삭제를 시도합니다. (폴더 내 파일이 없는 경우에만 삭제를 시도합니다)
	 * @param request HTTP 요청 정보
	 * @param middleName 중간 파일명
	 * @param id 아이디
	 * @return 삭제했으면 true, 아니면 false
	 */
	public static boolean removeDirectory(HttpServletRequest request, String middleName, String id) {
		String basePath = getBasePath(request, middleName);
		return tryRemoveDirectory(basePath, id);
	}
	
	//-----------------------------------------------------------------------------------
	
	/**
	 * 사용한 임시 폴더의 삭제를 시도한다. (폴더 내 파일이 없는 경우에만 삭제를 시도한다)
	 * <p>IE의 P3P 정책때문에 추가된 코드로, 세션ID를 인자로 받는다.
	 * @param request HTTP 요청 정보
	 * @param sessionId 세션 아이디
	 * @param middleName 중간 파일명
	 * @param id 아이디
	 * @return 삭제했으면 true, 아니면 false
	 */
	public static boolean removeDirectoryWithSession(HttpServletRequest request, String sessionId, String middleName, String id) {
		String basePath = getBasePathWithSession(request, sessionId, middleName);
		return tryRemoveDirectory(basePath, id);
	}
	
	//-----------------------------------------------------------------------------------
	
	/**
	 * 디렉터리 삭제를 시도합니다.
	 * @param basePath 폴더 경로
	 * @param id 아이디
	 * @return 삭제했으면 true, 아니면 false
	 */
	private static boolean tryRemoveDirectory(String basePath, String id){
		String tmpPath = FileUtil.combinePath(basePath, id);
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
	 * 임시 폴더를 삭제합니다.
	 * <p> 하위 폴더 및 파일들도 같이 삭제
	 * @param request HTTP 요청 정보
	 * @param middleName 중간 파일명
	 * @param id 아이디
	 */
	public static void remove(HttpServletRequest request, String middleName, String id){
		HttpSession session = request.getSession();
		
		ServletContext context = session.getServletContext();
		String sessionId = session.getId();

		//-----------------------------------------------------------------------------------
	
		String path = FileUtil.combinePath(context.getRealPath(DIR_FILES), "tmp", sessionId);
		File pathFile = new File(path);
		if (!pathFile.exists())
			return;

		//-----------------------------------------------------------------------------------
		
		String tmpPath = FileUtil.combinePath(path, middleName, id);
		
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

	/**
	 * 기본 폴더에 세션아이디로 폴더를 생성하고, 그 경로를 가져옵니다.
	 * @param context 서블릿 Context
	 * @param sessionId 세션 아이디
	 * @return 생성된 폴더의 경로
	 */
	public static String rootFolder(ServletContext context, String sessionId) {
		String rootDirPath = context.getRealPath(DIR_FILES);
		
		File rootDir = new File(rootDirPath);
		if (!rootDir.exists())
			rootDir.mkdir();
		
		return FileUtil.combinePath(rootDirPath, sessionId);
	}
	
	//-----------------------------------------------------------------------------------

	/**
	 * 디버깅용
	 */
	private static boolean debugFirstCalled = false;
	/**
	 * 디버깅용
	 */
	private static Object debugLock = new Object();
	
	/**
	 * 기본 폴더에 세션아이디, 중간 폴더명으로 된 폴더를 만들고 그 경로를 가져옵니다.
	 * @param request HTTP 요청 정보
	 * @param middleName 중간 폴더명
	 * @return
	 */
	private static String getBasePath(HttpServletRequest request, String middleName){
		return getBasePathWithSession(request, null, middleName);
	}

	/**
	 * 기본 폴더에 세션아이디, 중간 폴더명으로 된 폴더를 만들고 그 경로를 가져옵니다.
	 * @param request HTTP 요청 정보
	 * @param sessionId 세션 아이디
	 * <p>* null을 입력하면 세션아이디를 쿠기에서 읽어옵니다.
	 * @param middleName 중간 폴더명
	 * @return 폴더 경로
	 */
	private static String getBasePathWithSession(HttpServletRequest request, String sessionId, String middleName){
		
		HttpSession session = request.getSession();		
		ServletContext context = session.getServletContext();
		
		if (sessionId == null || sessionId.isEmpty())
			sessionId = session.getId();

		//-----------------------------------------------------------------------------------
		
		String path = rootFolder(context, "tmp");

		//-----------------------------------------------------------------------------------
	
		//String path = context.getRealPath(DIR_FILES + "/tmp");
		File pathFile = new File(path);
		if (!pathFile.exists())
			pathFile.mkdir();

		//-----------------------------------------------------------------------------------
	
		String tmpPath = FileUtil.combinePath(path, sessionId);
		File tmpPathFile = new File(tmpPath);
		if (!tmpPathFile.exists())
			tmpPathFile.mkdir();

		//-----------------------------------------------------------------------------------
		
		String tmpMidPath = FileUtil.combinePath(tmpPath, middleName);
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
	
	/**
	 * 기본 폴더에 세션아이디, 중간 폴더명, 아이디으로 된 폴더를 만들고 그 경로에 파일명의 경로를 가져옵니다.
	 * @param request HTTP 요청 정보
	 * @param middleName 중간 폴더명
	 * @param id 아이디
	 * @param filename 파일명
	 * @return 파일 경로
	 */
	private static String getPath(HttpServletRequest request, String middleName, String id, String filename){
		return getPathWithSession(request, null, middleName, id, filename);
	}

	/**
	 * 기본 폴더에 세션아이디, 중간 폴더명, 아이디으로 된 폴더를 만들고 그 경로에 파일명의 경로를 가져옵니다.
	 * @param request HTTP 요청 정보
	 * @param sessionId 세션 아이디
	 * <p>* null을 입력하면 세션아이디를 쿠기에서 읽어옵니다.
	 * @param middleName 중간 폴더명
	 * @param id 아이디
	 * @param filename 파일명
	 * @return 파일 경로
	 */
	private static String getPathWithSession(HttpServletRequest request, String sessionId, String middleName, String id, String filename){
		
		String basePath = getBasePathWithSession(request, sessionId, middleName);

		//-----------------------------------------------------------------------------------
		
		String tmpPath = FileUtil.combinePath(basePath, id);
		File tmpPathFile = new File(tmpPath);
		if (!tmpPathFile.exists())
			tmpPathFile.mkdir();

		//-----------------------------------------------------------------------------------
		
		String filepath = FileUtil.combinePath(tmpPath, filename);
	
		return filepath;
	}
	
}
