package com.abrain.wiv;

import java.util.List;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.abrain.wiv.config.AbImageConfig;
import com.abrain.wiv.data.sample.SqliteTester;
import com.abrain.wiv.services.DocService;

/**
 * 샘플 제공용 컨트롤러
 * <p>* 이미지 뷰어 샘플을 제공합니다.
 * @author Administrator
 *
 */
@Controller
public class SampleController {
	
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
	 * 이미지 파일 설정 정보
	 */
	@Autowired
	private AbImageConfig imageConfig;

	/**
	 * IFRAME 인터페이스 샘플 페이지 
	 * @param request HTTP 요청 정보
	 * @param response HTTP 응답 정보
	 * @return JSP 페이지 경로
	 * @throws Exception 예외
	 */
	@RequestMapping(value = "/sample", method = RequestMethod.GET)
	public String home(HttpServletRequest request, HttpServletResponse response) throws Exception {
		return "sample/frame-home";
	}

	/**
	 * 테스트용입니다. 이미지 뷰어와는 연관이 없습니다.
	 * @param model 뷰 모델
	 * @return JSP 페이지 경로
	 */
	@RequestMapping(value = "/dbtest", method = RequestMethod.GET)
	public String dbtest(Model model) {
		Integer value = svc.test();
		
		model.addAttribute("text", "MyBatic");
		model.addAttribute("value", value);
		
		return "sample/dbtest";
	}

	/**
	 * 테스트용입니다. 이미지 뷰어와는 연관이 없습니다.
	 * @param model 뷰 모델
	 * @return JSP 페이지 경로
	 */
	@RequestMapping(value = "/dbtest2", method = RequestMethod.GET)
	public String dbtest2(Model model) {
		//Integer value = svc.test();
		
		SqliteTester tester = new SqliteTester();
		Integer value = tester.test();
		
		model.addAttribute("text", "JDBC");
		model.addAttribute("value", value);
		
		return "sample/dbtest";
	}

	/**
	 * 테스트용입니다. 이미지 뷰어와는 연관이 없습니다.
	 * @param name 이름
	 * @param value 값
	 * @param response HTTP 응답 정보
	 * @param model 뷰 모델
	 * @return JSP 페이지 경로
	 */
	@RequestMapping(value = "/cookie", method = RequestMethod.GET)
	public String cookie(String name, String value, HttpServletResponse response, Model model) {
		//Integer value = svc.test();
		
		Cookie cookie = new Cookie(name, value);
		cookie.setMaxAge(365*24*60*60);
		cookie.setPath("/");
		
		response.addCookie(cookie);
		
		model.addAttribute("text", "COOKIE");
		model.addAttribute("name", name);
		model.addAttribute("value", value);
		
		return "sample/ses";
	}

	/**
	 * 테스트용입니다. 이미지 뷰어와는 연관이 없습니다.
	 * @param name 이름
	 * @param value 값
	 * @param model 뷰 모델
	 * @return JSP 페이지 경로
	 */
	@RequestMapping(value = "/session", method = RequestMethod.GET)
	public String session(String name, String value, Model model) {
		//Integer value = svc.test();
		
		HttpSession ses = request.getSession();
		ses.setAttribute(name, value);
		
		model.addAttribute("text", "SESSION");
		model.addAttribute("name", name);
		model.addAttribute("value", value);
		
		return "sample/ses";
	}
}
