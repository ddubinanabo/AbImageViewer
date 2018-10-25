package com.abrain.wiv;

import java.io.File;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import com.abrain.wiv.config.AbViewerConfigPack;
import com.abrain.wiv.converters.PolarisConverter;
import com.abrain.wiv.data.AbBinaryData;
import com.abrain.wiv.enums.AbImageType;
import com.abrain.wiv.exceptions.ArgumentException;
import com.abrain.wiv.exceptions.EmptyDataException;
import com.abrain.wiv.io.AbPartialFile;
import com.abrain.wiv.services.DocService;
import com.abrain.wiv.utils.DebugUtil;
import com.abrain.wiv.utils.WebUtil;

/**
 * 메인 컨트롤러
 */
@Controller
public class HomeController {
	
	/**
	 * HTTP 요청 정보
	 */
	@Autowired
	private HttpServletRequest request;

	/**
	 * 이미지 DB 서비스
	 */
	@Autowired
	private DocService svc;
	
	/**
	 * 이미지 뷰어 설정 정보 팩 
	 */
	@Autowired
	private AbViewerConfigPack config;

	//-----------------------------------------------------------
	
	/**
	 * 이미지 뷰어 페이지 세팅 작업
	 * @param id 아이디
	 * @param q 예약
	 * @param model 뷰 모델
	 * @throws Exception 예외
	 */
	private void prepare(
			String id, String q,
			Model model) throws Exception {
		
		if (id != null && !id.isEmpty())
			model.addAttribute("id", id);
		else if (q != null && !q.isEmpty())
			model.addAttribute("q", q);
		
		String a = request.getParameter("a");
	
		if (a != null && !a.isEmpty())
			model.addAttribute("a", a);
		
		// 샘플 모드 (CGI에 sample=Y를 붙이면 샘플용 UI 바가 표시됩니다
		String sample = request.getParameter("sample");
		if (sample != null && sample.equalsIgnoreCase("Y"))
			model.addAttribute("sample", true);

		config.auth.read();
		
		model.addAttribute("config", config);
	}

	//-----------------------------------------------------------

	/**
	 * 뷰어 페이지
	 * @param q 예약
	 * @param model 뷰 모델
	 * @return JSP 페이지 경로
	 * @throws Exception 예외
	 */
	@RequestMapping(value = "/", method = RequestMethod.GET)
	public String home(
			@RequestParam(defaultValue="") String q, 
			Model model) throws Exception {
		
		prepare(null, q, model);
		
		//System.out.println("[VIEWER][IMAGE][SAVE]=" + viewerConfig.image.save);
		//System.out.println("[VIEWER]=" + viewerConfig.toJSON());
		
		return "home";
	}

	/**
	 * 뷰어 페이지 (수정 페이지)
	 * @param id 아이디
	 * @param model 뷰 모델
	 * @return JSP 페이지 경로
	 * @throws Exception 예외
	 */
	@RequestMapping(value = "/{id}", method = RequestMethod.GET)
	public String homeWithId(
			@PathVariable(value="id") String id,
			Model model) throws Exception {
		prepare(id, null, model);
		
		return "home";
	}

	/**
	 * 컨버팅된 문서 이미지를 다운로드합니다.
	 * @param q 이미지 폴더 경로
	 * @param n 이미지 파일명
	 * @param t 이미지 구분(thumb이면 섬네일 이미지)
	 * @param request HTTP 요청 정보
	 * @param response HTTP 응답 정보
	 * @throws Exception 예외
	 */
	@RequestMapping(value = "/doc")
	public void doc(String q, String n, @RequestParam(required=false) String t, HttpServletRequest request, HttpServletResponse response) throws Exception {
		if (q == null || q.isEmpty())
			throw new ArgumentException();

		if (n == null || n.isEmpty())
			throw new ArgumentException();
		
		PolarisConverter.download(q, n, t, request, response);
	}
	
	/**
	 * DB에 저장된 이미지를 다운로드합니다.
	 * @param q 아이디
	 * @param s 인덱스
	 * @param t 이미지 구분(thumb이면 섬네일 이미지)
	 * @param request HTTP 요청 정보
	 * @param response HTTP 응답 정보
	 * @throws Exception 예외
	 */
	@RequestMapping(value = "/img")
	public void img(String q, String s, @RequestParam(required=false) String t, HttpServletRequest request, HttpServletResponse response) throws Exception {
		if (q == null || q.isEmpty())
			throw new ArgumentException();

		if (s == null || s.isEmpty())
			throw new ArgumentException();
		
		int seq = 0;
		
		try
		{
			seq = Integer.parseInt(s);
		}
		catch (Exception e)
		{
			DebugUtil.print(e);
			
			System.out.println("[IMAGE][SEQ] Exception!!!");
			
			throw new ArgumentException();
		}
		
		AbImageType type = AbImageType.find(t);
		
		AbBinaryData r = svc.image(q, seq, type);
		
		if (r == null || r.length == 0){
			throw new EmptyDataException();
		}
		
		Exception ex = WebUtil.download(response, "" + seq, r.bytes);
		
		if (ex != null)
			throw ex;
	}
	
	/**
	 * [인쇄 지원] 임시 저장된 이미지 파일을 다운로드합니다.
	 * @param q 아이디
	 * @param s 인덱스
	 * @param x 세션아이디
	 * @param request HTTP 요청 정보
	 * @param response HTTP 응답 정보
	 * @throws Exception 예외
	 */
	@RequestMapping(value = "/print-support/img")
	public void printSupportImg(
			String q, String s,
			@RequestParam(required=false, defaultValue="") String x,
			HttpServletRequest request, HttpServletResponse response) throws Exception {
		if (q == null || q.isEmpty())
			throw new ArgumentException();

		if (s == null || s.isEmpty())
			throw new ArgumentException();
		
		boolean emptyX = x == null || x.isEmpty();
		int seq = 0;
		
		try
		{
			seq = Integer.parseInt(s);
		}
		catch (Exception e)
		{
			DebugUtil.print(e);
			
			System.out.println("[PRINT-SUPPORT][SEQ] Exception!!!");
			
			throw new ArgumentException();
		}
		
		File file = null;
		
		if (emptyX)
			file = AbPartialFile.read(request, AbPartialFile.MID_PRINT_SUPPORT, q, AbPartialFile.MID_PRINT_SUPPORT_IMAGE + seq);
		else
			file = AbPartialFile.readWithSession(request, x, AbPartialFile.MID_PRINT_SUPPORT, q, AbPartialFile.MID_PRINT_SUPPORT_IMAGE + seq);
		
		Exception ex = WebUtil.download(response, file);
		
		//System.out.println("[PRINT-SUPPORT][IMG][" + q + "][" + seq + "] CALL !! (" + x + ")");
		
//		if (emptyX){
//			// write 한 파일은 삭제 (임시 파일은 딱 한번만 쓰이기 때문에 삭제)
//			AbPartialFile.removeFile(request, AbPartialFile.MID_PRINT_SUPPORT, q, AbPartialFile.MID_PRINT_SUPPORT_IMAGE + seq);
//			// 디렉터리 삭제 시도 (파일이 없는 경우에만 삭제된다)
//			AbPartialFile.removeDirectory(request, AbPartialFile.MID_PRINT_SUPPORT, q);
//		}else{
//			// write 한 파일은 삭제 (임시 파일은 딱 한번만 쓰이기 때문에 삭제)
//			AbPartialFile.removeFileWithSession(request, x, AbPartialFile.MID_PRINT_SUPPORT, q, AbPartialFile.MID_PRINT_SUPPORT_IMAGE + seq);
//			// 디렉터리 삭제 시도 (파일이 없는 경우에만 삭제된다)
//			AbPartialFile.removeDirectoryWithSession(request, x, AbPartialFile.MID_PRINT_SUPPORT, q);
//		}
		
		if (ex != null)
			throw ex;
	}
}
