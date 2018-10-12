package com.abrain.wiv;

import java.io.File;

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

@Controller
public class ExtController {
	
	@Autowired
	private AbImageConfig imageConfig;

	//-----------------------------------------------------------

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
