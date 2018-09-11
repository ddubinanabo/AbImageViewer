package com.abrain.wiv;

import java.io.File;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import com.abrain.wiv.config.AbImageConfig;
import com.abrain.wiv.converters.PolarisConverter;
import com.abrain.wiv.data.AbBinaryData;
import com.abrain.wiv.data.AbImageData;
import com.abrain.wiv.data.AbImageType;
import com.abrain.wiv.data.externals.AbExtImages;
import com.abrain.wiv.exceptions.ArgumentException;
import com.abrain.wiv.exceptions.EmptyDataException;
import com.abrain.wiv.io.AbPartialFile;
import com.abrain.wiv.services.DocService;
import com.abrain.wiv.utils.DebugUtil;
import com.abrain.wiv.utils.FileUtil;
import com.abrain.wiv.utils.WebUtil;

/**
 * Handles requests for the application home page.
 */
@Controller
public class HomeController {
	
	@Autowired
	private DocService svc;
	
	@Autowired
	private AbImageConfig imageConfig;

	/**
	 * 뷰어 페이지
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/", method = RequestMethod.GET)
	public String home(HttpServletRequest request, HttpServletResponse response) throws Exception {
		
		//System.out.println("[ACCEPTS] " + imageConfig.ACCEPTS);
		
		return "home";
	}

	/**
	 * 뷰어 페이지 (수정 페이지)
	 * @param id
	 * @param model
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/{id}", method = RequestMethod.GET)
	public String homeWithId(@PathVariable(value="id") String id, HttpServletRequest request, HttpServletResponse response, Model model) throws Exception {
		if (id != null && !id.isEmpty())
			model.addAttribute("id", id);
		
		return "home";
	}

	/**
	 * 컨버팅된 문서 이미지 제공
	 * @param q
	 * @param n
	 * @param request
	 * @param response
	 * @throws Exception
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
	 * DB에 저장된 이미지 제공
	 * @param q ID
	 * @param s 시퀀스
	 * @param t 타입
	 * @param request
	 * @param response
	 * @throws Exception
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
	 * [인쇄 지원] 임시 저장된 이미지 파일 제공
	 * @param q ID
	 * @param s 시퀀스
	 * @param request
	 * @param response
	 * @throws Exception
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
