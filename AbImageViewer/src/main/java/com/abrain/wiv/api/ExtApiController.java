package com.abrain.wiv.api;

import java.io.File;
import java.net.URLEncoder;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.abrain.wiv.abstracts.AbstractApiController;
import com.abrain.wiv.config.AbImageConfig;
import com.abrain.wiv.data.AbImageData;
import com.abrain.wiv.data.AbPlainText;
import com.abrain.wiv.data.externals.AbExtImages;
import com.abrain.wiv.exceptions.ArgumentException;
import com.abrain.wiv.exceptions.NotFoundFileException;

/**
 * External
 * @author Administrator
 *
 */
@Controller
public class ExtApiController extends AbstractApiController {
	
	@Autowired
	private HttpServletRequest request;
	
	@Autowired
	private AbImageConfig imageConfig;

	//-----------------------------------------------------------
	
	@RequestMapping(value="/api/ext/folder", method=RequestMethod.POST)
	@ResponseBody
	public Object folder (String q, @RequestParam(defaultValue="") String t) throws Exception{
		if (q == null || q.isEmpty())
			throw new ArgumentException();
		
		String[] ts = t.trim().split("\\|");
		
		AbExtImages eximg = new AbExtImages(imageConfig, q);
		List<AbImageData> imgs = eximg.collect();
		
		for (int i=0; i < ts.length; i++) {
			String customText = ts[i];
			
			if (i < imgs.size()) {
				AbImageData img = imgs.get(i);
				if (img.hasInfo()) {
					img.getInfo().setText(customText);
				}
			}
		}
		return imgs;
	}

	//-----------------------------------------------------------
	
	@RequestMapping(value="/api/ext/file", method=RequestMethod.POST) 
	@ResponseBody
	public Object file (String q, @RequestParam(defaultValue="") String a) throws Exception{
		if (q == null || q.isEmpty())
			throw new ArgumentException();
		
		if (a != null && a.isEmpty())
			a = null;
		
		AbImageData img = AbExtImages.file(q, a);

		return img;
	}

}
