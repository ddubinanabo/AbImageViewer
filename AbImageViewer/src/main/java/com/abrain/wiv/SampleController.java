package com.abrain.wiv;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.abrain.wiv.config.AbImageConfig;
import com.abrain.wiv.services.DocService;

@Controller
public class SampleController {
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

}
