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
import com.abrain.wiv.config.AbImageConfig;
import com.abrain.wiv.config.AbViewerConfigPack;
import com.abrain.wiv.converters.PolarisConverter;
import com.abrain.wiv.data.AbAllocKeyData;
import com.abrain.wiv.data.AbBookmarkDbData;
import com.abrain.wiv.data.AbImageData;
import com.abrain.wiv.data.AbImageDataList;
import com.abrain.wiv.data.AbImageDbData;
import com.abrain.wiv.data.AbImageMetadata;
import com.abrain.wiv.data.AbImagePack;
import com.abrain.wiv.data.AbPlainText;
import com.abrain.wiv.data.externals.AbExtImages;
import com.abrain.wiv.exceptions.ArgumentException;
import com.abrain.wiv.io.AbPartialFile;
import com.abrain.wiv.services.DocService;
import com.abrain.wiv.utils.FileUtil;
import com.abrain.wiv.utils.WebUtil;

/**
 * 이미지 API 컨트롤러
 * @author Administrator
 *
 */
@Controller
public class ApiController extends AbstractApiController {
	
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
	 * 이미지 뷰어 설정 정보 팩 
	 */
	@Autowired
	private AbViewerConfigPack config;

	/**
	 * 이미지 파일 설정 정보
	 */
	@Autowired
	private AbImageConfig imageConfig;
	
	//-----------------------------------------------------------

	/**
	 * 이미지 뷰어 설정 정보 팩을 제공합니다.
	 * @return 이미지 뷰어 설정 정보 팩
	 * @throws Exception 예외
	 */
	@RequestMapping(value="/api/config", method=RequestMethod.POST)
	@ResponseBody
	public Object config () throws Exception{
		return config;
	}
	
	//-----------------------------------------------------------

	/**
	 * 계정 권한 정보를 제공합니다.
	 * @param value 계정 정보 또는 계정 권한 레벨
	 * @return 계정 권한 정보
	 * @throws Exception 예외
	 */
	@RequestMapping(value="/api/permission", method=RequestMethod.POST)
	@ResponseBody
	public Object permission (String value) throws Exception{
		if (config.auth.get(value))
			return config.auth.getPermission();
		return null;
	}
	
	/**
	 * 문서를 이미지로 컨버팅합니다.
	 * @param name 문서 파일명
	 * @param content 문서 내용 (BASE64)
	 * @return 이미지 정보 목록
	 * @throws Exception 예외
	 */
	@RequestMapping(value="/api/doc", method=RequestMethod.POST)
	@ResponseBody
	public Object doc (String name, String content) throws Exception{
		return PolarisConverter.convert(request, name, content);
	}

	/**
	 * 세션 유지용 응답
	 * <p>뷰어에서 지속적으로 이 웹 메서드를 호출합니다.
	 * @return 플레인 텍스트 정보
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
	 * @return 할당 키 정보
	 */
	@RequestMapping(value="/api/print-support/alloc")
	@ResponseBody
	public Object printSupportAlloc(){
		AbPartialFile.AllocResult r = AbPartialFile.alloc(request, AbPartialFile.MID_PRINT_SUPPORT);
		//return new AbPlainText(r.id);
		return new AbAllocKeyData(r.id);
	}
	
	/**
	 * 인쇄용 임시 이미지 저장
	 * <p>IE에서 IFRAME의 세션 유지가 안되는 문제로, 세션 ID 값을 URL에 포함시켰습니다.
	 * @param id 아이디
	 * @param index 전송 인덱스
	 * @param partials 전체 분할 수
	 * @param partial 현재 분할 인덱스
	 * @param content 분할 데이터
	 * @return 플레인 텍스트 정보 (마지막 전송 시 이미지 URL을, 아니면 ok)
	 * @throws Exception 예외
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
	 * 인쇄 지원 임시 폴더를 삭제합니다.
	 * @param id 아이디
	 * @return 플레인 텍스트 정보
	 * @throws Exception 예외
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
	 * 이미지 목록 키 할당
	 * @param pages 이미지 개수
	 * @return 할당 키 정보
	 * @throws Exception 예외
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
		return r;
	}

	/**
	 * 이미지 수정 준비 작업
	 * @param id 아이디
	 * @param pages 이미지 개수
	 * @return 플레인 텍스트 정보
	 * @throws Exception 예외
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
	 * @param modify 수정 여부(true|false)
	 * @param id 아이디
	 * @param index 인덱스
	 * @param type 전송작업 구분(image|image-source|image-result|thumb)
	 * @param info 정보 (AbImagePack.ImageInfo/AbImagePack.ThumbnailInfo JSON)
	 * @param partials 전체 분할 수
	 * @param partial 현재 분할 인덱스
	 * @param content 분할 데이터
	 * @return 플레인 텍스트 정보
	 * @throws Exception 예외
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
			
			AbImagePack.ImageInfo imgDec = AbImagePack.ImageInfo.fromJSON(imageInfo);
			AbImagePack.ThumbnailInfo thumbDec = AbImagePack.ThumbnailInfo.fromJSON(thumbInfo);
			AbImagePack.Bookmark bookmark = null;
			
			if (info != null && !info.isEmpty())
				bookmark = AbImagePack.Bookmark.fromJSON(info);
			
			//-----------------------------------------------------------
			// modify 인자는 현재 전송되는 이미지 목록을 수정하는 것을 의미일 뿐,
			// DB 작업에 영향이 있는 것은 아니다.
			
			r = svc.record(id, index, ip, imgDec, imageSource, imageResult, thumbDec, thumbSource, bookmark);
			
			//-----------------------------------------------------------
	
			System.out.println("[SAVE-IMAGE][END]["+index+"] " + id);
		
		}
		
		if (r != null){
			throw (Exception)r;
		}
		return new AbPlainText("ok");
	}

	/**
	 * 이미지 등록 완료 처리
	 * @param id 아이디
	 * @return 플레인 텍스트 정보
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
	 * 이미지 전송 중 오류 처리
	 * @param id 아이디
	 * @return 플레인 텍스트 정보
	 * @throws Exception 예외
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
	 * @param id 아이디
	 * @return 이미지 목록 정보
	 * @throws Exception 예외
	 */
	@RequestMapping(value="/api/images", method=RequestMethod.POST)
	@ResponseBody
	public Object images (String id) throws Exception{
		if (config.viewer.image.storage.equalsType("folder")) {
			return folderImages(id);
		}
		return dbImages(id);
	}
	
	//-----------------------------------------------------------
	
	/**
	 * DB에서 이미지 목록 정보를 조회합니다.
	 * @param id 아이디
	 * @return 이미지 목록 정보
	 * @throws Exception 예외
	 */
	private Object dbImages (String id) throws Exception {
		if (id == null || id.isEmpty())
			throw new ArgumentException();
		
		List<AbImageDbData> datas = svc.select(id);
		List<AbBookmarkDbData> bookmarks = svc.selectBookmark(id);
		List<AbImageData> rs = new ArrayList<>();
		
		List<Integer> bs = new ArrayList<>();
		
		if (datas != null && !datas.isEmpty()){
			int siz = datas.size();
			for (int i=0; i < siz; i++){
				AbImageDbData data = datas.get(i);
				AbImageMetadata info = data.metadata();
				
				String q = "q=" + id + "&s=" + data.seq;
				
				AbImageData row = new AbImageData(
					"img?" + q,
					"img?t=thumb&" + q,
					data.imgRot,
					(int)data.imgWid,
					(int)data.imgHgt,
					data.shapes,
					data.imgDec
				);
				row.setInfo(info);
				
				rs.add(row);
			}
		}
		
		if (bookmarks != null && !bookmarks.isEmpty()){
			int siz = bookmarks.size();
			for (int i=0; i < siz; i++){
				AbBookmarkDbData data = bookmarks.get(i);
				bs.add(data.getSeq());
			}
		}
		
		return new AbImageDataList(rs, bs);
	}
	
	/**
	 * 폴더에서 이미지 목록 정보를 조회합니다.
	 * @param id 아이디
	 * @return 이미지 목록 정보
	 * @throws Exception 예외
	 */
	private Object folderImages (String id) throws Exception {
		String path = FileUtil.combinePath(config.viewer.image.storage.path, id);
		
		AbExtImages eximg = new AbExtImages(imageConfig, path);
		List<AbImageData> imgs = eximg.collect();
		
		return new AbImageDataList(imgs);
	}
}
