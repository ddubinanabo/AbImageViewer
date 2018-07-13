package com.abrain.wiv.api;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.abrain.wiv.abstracts.AbstractApiController;
import com.abrain.wiv.converters.PolarisConverter;
import com.abrain.wiv.data.AbImageData;
import com.abrain.wiv.data.AbImageDbData;
import com.abrain.wiv.data.AbImagePackCollection;
import com.abrain.wiv.data.AbPlainText;
import com.abrain.wiv.exceptions.ArgumentException;
import com.abrain.wiv.exceptions.EmptyDataException;
import com.abrain.wiv.services.DocService;
import com.abrain.wiv.utils.WebUtil;

@Controller
public class ApiController extends AbstractApiController {
	
	@Autowired
	private HttpServletRequest request;
	
	@Autowired
	private DocService svc;

	//-----------------------------------------------------------
	
	@RequestMapping(value="/api/doc", method=RequestMethod.POST)
	@ResponseBody
	public Object doc (String name, String content) throws Exception{
		return PolarisConverter.convert(request, name, content);
	}

	@RequestMapping(value="/api/noop")
	@ResponseBody
	public Object noop (){
		return new AbPlainText("ok");
	}
	
	@RequestMapping(value="/api/save", method=RequestMethod.POST)
	@ResponseBody
	public Object save (String content) throws Exception{
		if (content == null || content.isEmpty())
			throw new ArgumentException();
		
		AbImagePackCollection collection = AbImagePackCollection.fromJSON(content);
		
		if (collection == null || collection.size() < 1)
			throw new EmptyDataException();

		String ip = WebUtil.getRemoteIP();
		
		Object r = svc.record(collection, ip);
		if (r instanceof Exception){
			throw (Exception)r;
		}
		return new AbPlainText((String)r);
	}
	
	@RequestMapping(value="/api/images", method=RequestMethod.POST)
	@ResponseBody
	public Object images (String id) throws Exception{
		if (id == null || id.isEmpty())
			throw new ArgumentException();
		
		List<AbImageDbData> datas = svc.select(id);
		List<AbImageData> rs = new ArrayList<>();
		
		if (datas != null && datas.size() > 0){
			int siz = datas.size();
			for (int i=0; i < siz; i++){
				AbImageDbData data = datas.get(i);
				
				String q = "q=" + id + "&s=" + data.seq;
				
				rs.add(new AbImageData(
					"img?" + q,
					"img?t=thumb&" + q,
					(int)data.imgWid,
					(int)data.imgHgt,
					data.shapes
				));
			}
		}
		
		return rs;
	}	
}
