package com.abrain.wiv;

import java.io.File;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.abrain.wiv.config.AbImageConfig;
import com.abrain.wiv.data.externals.AbExtImages;
import com.abrain.wiv.enums.AbImageType;
import com.abrain.wiv.exceptions.ArgumentException;
import com.abrain.wiv.exceptions.NotFoundFileException;
import com.abrain.wiv.utils.WebUtil;

/**
 * 서버 파일 지원 컨트롤러
 * @author Administrator
 *
 */
@Controller
public class ExtController {
	
	/**
	 * 이미지 파일 설정 정보
	 */
	@Autowired
	private AbImageConfig imageConfig;

	//-----------------------------------------------------------

	/**
	 * 서버 이미지를 다운로드 합니다.
	 * <p>* iAbViewer.view()을 통해 호출된 AbExtImages.collect()에서 제공합니다.
	 * @param q 폴더명
	 * @param n 파일명
	 * @param c 생성이 필요한 지 여부 (섬네일 이미지만 해당됩니다)
	 * @param d 예약
	 * @param t 이미지 구분 (thumb이면 섬네일 이미지)
	 * @param response HTTP 응답 정보
	 * @throws Exception 예외
	 */
	@RequestMapping(value = "/ext/img")
	public void img(
		String q,
		String n,
		@RequestParam(defaultValue="N") String c,
		@RequestParam(defaultValue="") String d,
		@RequestParam(defaultValue="") String t,
		HttpServletResponse response) throws Exception {
		if (q == null || q.isEmpty())
			throw new ArgumentException();

		if (n == null || n.isEmpty())
			throw new ArgumentException();
		
		boolean needCreate = c.equalsIgnoreCase("Y");
		
		//System.out.println("[EXTERNAL IMAGE]["+(t.equalsIgnoreCase("thumb") ? "THUMB" : "IMG")+"] " + q + "/" + n);
		
		AbImageType type = AbImageType.find(t);
		AbExtImages eximg = new AbExtImages(imageConfig, q);
		
		eximg.download(response, n, type, needCreate);
	}

	/**
	 * 서버 파일을 다운로드 합니다.
	 * <p>* iAbViewer.viewMain()을 통해 호출된 ExtApiController.file()에서 이 URL을 제공합니다.
	 * @param q 파일 경로
	 * @param c 예약
	 * @param d 예약
	 * @param t 예약
	 * @param response HTTP 응답 정보
	 * @throws Exception 예외
	 */
	@RequestMapping(value = "/ext/file")
	public void file(
		String q,
		@RequestParam(defaultValue="N") String c,
		@RequestParam(defaultValue="") String d,
		@RequestParam(defaultValue="") String t,
		HttpServletResponse response) throws Exception {
		if (q == null || q.isEmpty())
			throw new ArgumentException();
		
		File file = new File(q);
		if (!file.exists())
			throw new NotFoundFileException(q);
		
		if (file.isDirectory())
			throw new NotFoundFileException(q);
		
		//boolean needCreate = c.equalsIgnoreCase("Y");
		
		//AbImageType type = AbImageType.find(t);

		WebUtil.download(response, file);
	}
}
