package com.abrain.wiv.api;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.abrain.wiv.abstracts.AbstractApiController;
import com.abrain.wiv.config.AbImageViewerConfig;
import com.abrain.wiv.converters.PolarisConverter;
import com.abrain.wiv.data.AbImageData;
import com.abrain.wiv.data.AbImageDbData;
import com.abrain.wiv.data.AbImagePack;
import com.abrain.wiv.data.AbPlainText;
import com.abrain.wiv.exceptions.ArgumentException;
import com.abrain.wiv.io.AbPartialFile;
import com.abrain.wiv.services.DocService;
import com.abrain.wiv.utils.WebUtil;

@Controller
public class ApiController extends AbstractApiController {
	
	@Autowired
	private HttpServletRequest request;
	
	@Autowired
	private DocService svc;
	
	@Autowired
	private AbImageViewerConfig viewerConfig;

	//-----------------------------------------------------------

	@RequestMapping(value="/api/config", method=RequestMethod.POST)
	@ResponseBody
	public Object config () throws Exception{
		return viewerConfig;
	}
	
	/**
	 * 문서 컨버팅
	 * @param name
	 * @param content
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value="/api/doc", method=RequestMethod.POST)
	@ResponseBody
	public Object doc (String name, String content) throws Exception{
		return PolarisConverter.convert(request, name, content);
	}

	/**
	 * 세션 유지용
	 * <p>뷰어에서 지속적으로 이 웹 메서드를 호출합니다.
	 * @return
	 */
	@RequestMapping(value="/api/noop")
	@ResponseBody
	public Object noop (){
		return new AbPlainText("ok");
	}

	//-----------------------------------------------------------
	// 인쇄 지원
	
	/**
	 * 인쇄 지원 아이디 할당 (임시 폴더 생성)
	 * @return
	 */
	@RequestMapping(value="/api/print-support/alloc")
	@ResponseBody
	public Object printSupportAlloc(){
		AbPartialFile.AllocResult r = AbPartialFile.alloc(request, AbPartialFile.MID_PRINT_SUPPORT);
		return new AbPlainText(r.id);
	}
	
	/**
	 * 인쇄용 임시 이미지 저장
	 * <p>IE에서 IFRAME의 세션 유지가 안되는 문제로, 세션 ID 값을 URL에 포함시킴
	 * @param id
	 * @param index
	 * @param partials
	 * @param partial
	 * @param content
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value="/api/print-support/save")
	@ResponseBody
	public Object printSupportSave(String id, int index, int partials, int partial, String content) throws Exception{
		Object r = AbPartialFile.save(
				request,
				AbPartialFile.MID_PRINT_SUPPORT,
				id,
				AbPartialFile.MID_PRINT_SUPPORT_IMAGE + index,
				partials,
				partial,
				content,
				AbPartialFile.POSTPRC_SAVE_BYTES);
		
		if (r instanceof Exception){
			AbPartialFile.remove(request, AbPartialFile.MID_PRINT_SUPPORT, id);
			
			throw (Exception)r;
		}
		
		AbPartialFile.Result ar = (AbPartialFile.Result)r;
		
		if (ar.completed)
			return new AbPlainText("?q=" + id + "&s=" + index + "&x=" + ar.sessionId);
		else
			return new AbPlainText("ok");
	}
	
	/**
	 * 인쇄 지원 임시 폴더 삭제
	 * @param id
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value="/api/print-support/remove")
	@ResponseBody
	public Object printSupportClear(String id) throws Exception{
		AbPartialFile.remove(request, AbPartialFile.MID_PRINT_SUPPORT, id);
		
		return new AbPlainText("ok");
	}
	
	//-----------------------------------------------------------
	// 저장 지원
	
	/**
	 * 아이디 할당
	 * @param pages
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value="/api/alloc", method=RequestMethod.POST)
	@ResponseBody
	public Object alloc (int pages) throws Exception{
		//
		// ID가 중복되지 않게 신경 쓰셔야 합니다.
		//
		Object r = svc.alloc();
		if (r instanceof Exception){
			throw (Exception)r;
		}
		return new AbPlainText((String)r);
	}

	/**
	 * 이미지 수정 준비 작업
	 * @param id
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value="/api/modify-prepare", method=RequestMethod.POST)
	@ResponseBody
	public Object modifyPrepare (String id, int pages) throws Exception{
		if (id == null || id.isEmpty())
			throw new ArgumentException();
		
		System.out.println("[MODIFY-PREPARE] " + id);
		
		return new AbPlainText("ok");
	}

	/**
	 * 이미지 및 관련 정보 분할 등록 및 DB 저장 처리
	 * <p>modify 인자는 현재 전송되는 이미지 목록을 수정하는 것을 의미한다.
	 * @param modify
	 * @param id
	 * @param index
	 * @param type
	 * @param info
	 * @param partials
	 * @param partial
	 * @param content
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value="/api/save-image", method=RequestMethod.POST)
	@ResponseBody
	public Object saveImage (
			@RequestParam(required=false, defaultValue="false") boolean modify,
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
		String filename = index + "_" + type;
		
		if (type.equals("image")){
			rf = AbPartialFile.save(request, AbPartialFile.MID_PARTIALS, id, filename, partials, partial, info);
			if (rf instanceof Exception)
				r = rf;
			else {
				AbPartialFile.Result result = (AbPartialFile.Result)rf;
				
				if (result.completed){
					System.out.println("[SAVE-IMAGE]["+index+"]["+type+"] " + id);
				}
			}
		}else if (type.equals("image-source")){
			rf = AbPartialFile.save(request, AbPartialFile.MID_PARTIALS, id, filename, partials, partial, content);
			if (rf instanceof Exception)
				r = rf;
			else {
				AbPartialFile.Result result = (AbPartialFile.Result)rf;
				
				if (result.completed){
					System.out.println("[SAVE-IMAGE]["+index+"]["+type+"] " + id);
				}
			}
		}else if (type.equals("image-result")){
			rf = AbPartialFile.save(request, AbPartialFile.MID_PARTIALS, id, filename, partials, partial, content);
			if (rf instanceof Exception)
				r = rf;
			else {
				AbPartialFile.Result result = (AbPartialFile.Result)rf;
				
				if (result.completed){
					System.out.println("[SAVE-IMAGE]["+index+"]["+type+"] " + id);
				}
			}
		}else if (type.equals("thumb")){
			// thumb-info
			rf = null;
			
			if (partial == 0){
				rf = AbPartialFile.saveText(request, AbPartialFile.MID_PARTIALS, id, filename + "_info", info);
				if (rf instanceof Exception)
					r = rf;
			}
			
			if (rf == null){
				// thumb-image
				rf = AbPartialFile.save(request, AbPartialFile.MID_PARTIALS, id, filename, partials, partial, content);
				if (rf instanceof Exception)
					r = rf;
				else {
					AbPartialFile.Result result = (AbPartialFile.Result)rf;
					
					if (result.completed){
						System.out.println("[SAVE-IMAGE]["+index+"]["+type+"] " + id);
					}
				}
			}
		}else if (type.equals("end")){
			//-----------------------------------------------------------
			// 이미지 전송 완료 작업
			//-----------------------------------------------------------
			// 이미지 저장 작업을 여기서 처리하세요.
			// 
			
			// image info
			filename = index + "_image";
			
			String imageInfo = AbPartialFile.readText(request, AbPartialFile.MID_PARTIALS, id, filename);
			AbPartialFile.removeFile(request, AbPartialFile.MID_PARTIALS, id, filename);
			
			// image-source
			filename = index + "_image-source";
			
			byte[] imageSource = AbPartialFile.readBytes(request, AbPartialFile.MID_PARTIALS, id, filename);
			AbPartialFile.removeFile(request, AbPartialFile.MID_PARTIALS, id, filename);
			
			// image-result
			filename = index + "_image-result";
			
			byte[] imageResult = AbPartialFile.readBytes(request, AbPartialFile.MID_PARTIALS, id, filename);
			AbPartialFile.removeFile(request, AbPartialFile.MID_PARTIALS, id, filename);
			
			// thumb info
			filename = index + "_thumb_info";
			
			String thumbInfo = AbPartialFile.readText(request, AbPartialFile.MID_PARTIALS, id, filename);
			AbPartialFile.removeFile(request, AbPartialFile.MID_PARTIALS, id, filename);
			
			// thumb-source
			filename = index + "_thumb";
			
			byte[] thumbSource = AbPartialFile.readBytes(request, AbPartialFile.MID_PARTIALS, id, filename);
			AbPartialFile.removeFile(request, AbPartialFile.MID_PARTIALS, id, filename);
			
			//-----------------------------------------------------------
			
			String ip = WebUtil.getRemoteIP();
			
			AbImagePack.AbImageInfo imgDec = AbImagePack.AbImageInfo.fromJSON(imageInfo);
			AbImagePack.AbThumbnailInfo thumbDec = AbImagePack.AbThumbnailInfo.fromJSON(thumbInfo);
			
			//-----------------------------------------------------------
			// modify 인자는 현재 전송되는 이미지 목록을 수정하는 것을 의미일 뿐,
			// DB 작업에 영향이 있는 것은 아니다.
			
			r = svc.record(id, index, ip, imgDec, imageSource, imageResult, thumbDec, thumbSource);
			
			//-----------------------------------------------------------
	
			System.out.println("[SAVE-IMAGE][END]["+index+"] " + id);
		
		}
		
		if (r != null){
			throw (Exception)r;
		}
		return new AbPlainText("ok");
	}

	/**
	 * 이미지 등록 완료
	 * @param id
	 * @return
	 */
	@RequestMapping(value="/api/save-completed", method=RequestMethod.POST)
	@ResponseBody
	public Object saveCompleted(String id){
		AbPartialFile.remove(request, AbPartialFile.MID_PARTIALS, id);
		
		System.out.println("[SAVED-IMAGE] clear template!! (" + id + ")");
		
		svc.approval(id);
		
		return new AbPlainText("ok");
	}
	
	/**
	 * 이미지 전송 중 오류
	 * @param id
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value="/api/remove", method=RequestMethod.POST)
	@ResponseBody
	public Object remove (String id) throws Exception{
		if (id == null || id.isEmpty())
			throw new ArgumentException();
		
		System.out.println("[REMOVE-IMAGE] " + id);
		
		svc.remove(id);
		
		return new AbPlainText("ok");
	}
	
	/**
	 * 등록된 이미지 목록 조회
	 * @param id
	 * @return
	 * @throws Exception
	 */
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
					data.shapes,
					data.imgDec
				));
			}
		}
		
		return rs;
	}
	
	//-----------------------------------------------------------
	//-----------------------------------------------------------
	//-----------------------------------------------------------
}
