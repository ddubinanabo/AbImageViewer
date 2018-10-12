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

@Controller
public class SampleController {
	
	@Autowired
	private HttpServletRequest request;
	
	
	@Autowired
	private DocService svc;
	
	@Autowired
	private AbImageConfig imageConfig;

	/**
	 * 아이프레임 사용 뷰어 페이지
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/sample", method = RequestMethod.GET)
	public String home(HttpServletRequest request, HttpServletResponse response) throws Exception {
		return "sample/frame-home";
	}

	@RequestMapping(value = "/dbtest", method = RequestMethod.GET)
	public String dbtest(Model model) {
		Integer value = svc.test();
		
		model.addAttribute("text", "MyBatic");
		model.addAttribute("value", value);
		
		return "sample/dbtest";
	}

	@RequestMapping(value = "/dbtest2", method = RequestMethod.GET)
	public String dbtest2(Model model) {
		//Integer value = svc.test();
		
		SqliteTester tester = new SqliteTester();
		Integer value = tester.test();
		
		model.addAttribute("text", "JDBC");
		model.addAttribute("value", value);
		
		return "sample/dbtest";
	}

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
