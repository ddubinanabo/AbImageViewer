package com.abrain.wiv.api;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.ibatis.annotations.Param;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.abrain.wiv.abstracts.AbstractApiController;
import com.abrain.wiv.converters.PolarisConverter;
import com.abrain.wiv.data.AbImageData;
import com.abrain.wiv.data.AbImageDbData;
import com.abrain.wiv.data.AbImagePack;
import com.abrain.wiv.data.AbPlainText;
import com.abrain.wiv.exceptions.ArgumentException;
import com.abrain.wiv.exceptions.EmptyDataException;
import com.abrain.wiv.io.AbPartialFile;
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
	
	@RequestMapping(value="/api/alloc", method=RequestMethod.POST)
	@ResponseBody
	public Object alloc (int pages) throws Exception{
		Object r = svc.alloc();
		if (r instanceof Exception){
			throw (Exception)r;
		}
		return new AbPlainText((String)r);
	}
	
	@RequestMapping(value="/api/save-image", method=RequestMethod.POST)
	@ResponseBody
	public Object saveImage (
			String id,
			int index,
			String type,
			@RequestParam(required=false, defaultValue="") String info,
			@RequestParam(required=false, defaultValue="0") int partials,
			@RequestParam(required=false, defaultValue="0") int partial,
			@RequestParam(required=false, defaultValue="0") String content) throws Exception{
		if (content == null || content.isEmpty())
			throw new ArgumentException();
		
		// System.out.println("[SAVE-IMAGE][" + index + "]["+type+"]["+partial+"/"+partials+"] " + id);
		
		Object r = null, rf = null;
		
		if (type.equals("image")){
			String ip = WebUtil.getRemoteIP();
			
			AbImagePack.AbImageInfo dec = AbImagePack.AbImageInfo.fromJSON(info);
			
			r = svc.recordImage(id, index, ip, dec);
			
			System.out.println("[SAVE-IMAGE]["+type+"] " + id);
		}else if (type.equals("image-source")){
			rf = AbPartialFile.save(request, id, type, partials, partial, content);
			if (rf instanceof Exception)
				r = rf;
			else {
				AbPartialFile.Result result = (AbPartialFile.Result)rf;
				
				if (result.completed){
					r = svc.recordImageSource(id, index, result.bytes);
					
					System.out.println("[SAVE-IMAGE]["+type+"] " + id);
				}
			}
		}else if (type.equals("image-result")){
			rf = AbPartialFile.save(request, id, type, partials, partial, content);
			if (rf instanceof Exception)
				r = rf;
			else {
				AbPartialFile.Result result = (AbPartialFile.Result)rf;
				
				if (result.completed){
					r = svc.recordImageResult(id, index, result.bytes);
					
					System.out.println("[SAVE-IMAGE]["+type+"] " + id);
				}
			}
		}else if (type.equals("thumb")){
			AbImagePack.AbThumbnailInfo dec = AbImagePack.AbThumbnailInfo.fromJSON(info);
			
			rf = AbPartialFile.save(request, id, type, partials, partial, content);
			if (rf instanceof Exception)
				r = rf;
			else {
				AbPartialFile.Result result = (AbPartialFile.Result)rf;
				
				if (result.completed){
					r = svc.recordThumbnail(id, index, result.bytes, dec);
					
					AbPartialFile.remove(request, id);
					
					System.out.println("[SAVE-IMAGE]["+type+"] " + id);
					System.out.println("[SAVE-IMAGE] " + id);
				}
			}
		}
		
		if (r != null){
			throw (Exception)r;
		}
		return new AbPlainText("ok");
	}

	@RequestMapping(value="/api/remove", method=RequestMethod.POST)
	@ResponseBody
	public Object remove (String id) throws Exception{
		if (id == null || id.isEmpty())
			throw new ArgumentException();
		
		System.out.println("[REMOVE-IMAGE] " + id);
		
		svc.remove(id);
		
		return new AbPlainText("ok");
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
	
	//-----------------------------------------------------------
	//-----------------------------------------------------------
	//-----------------------------------------------------------

	private String path(){
		return null;
	}
}
