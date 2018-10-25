package com.abrain.wiv.services;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.abrain.wiv.dao.DocDao;
import com.abrain.wiv.data.AbAllocKeyData;
import com.abrain.wiv.data.AbBinaryData;
import com.abrain.wiv.data.AbBookmarkDbData;
import com.abrain.wiv.data.AbImageDbData;
import com.abrain.wiv.data.AbImagePack;
import com.abrain.wiv.enums.AbImageType;
import com.abrain.wiv.utils.DebugUtil;

/**
 * 이미지 DB 서비스
 * @author Administrator
 *
 */
@Service
public class DocService {

	@Autowired
	private DocDao dao;
	
	//-----------------------------------------------------------
	
	/**
	 * 테스트용입니다. 이미지 뷰어와는 연관이 없습니다.
	 * @return 값
	 */
	public Integer test(){
		return dao.test();
	}
	
	//-----------------------------------------------------------
	//-----------------------------------------------------------
	//-----------------------------------------------------------
	
	//-----------------------------------------------------------
	
	/**
	 * 이미지 목록 ID를 생성합니다.
	 * @return 할당 키 정보
	 */
	public Object alloc(){
		UUID uid = UUID.randomUUID();
		String id = uid.toString().replaceAll("-", "").toUpperCase();
		
		// 17 자리
		SimpleDateFormat format = new SimpleDateFormat("yyyyMMddHHmmssSSS");
		String alloctime = format.format(new Date());
		
		System.out.println("[ALLOC][TIME][ " + alloctime);
		System.out.println("[ALLOC][ID] " + id);
		
		return new AbAllocKeyData(id, alloctime);
	}
	
	//-----------------------------------------------------------
	
//	public String uid(String id) { return id != null ? id.substring(0, 17) : null; }
//	public String allocTime(String id) { return id != null ? id.substring(17) : null; }
	
	//-----------------------------------------------------------

	/**
	 * 이미지를 임시 등록합니다.
	 * @param id 이미지 목록 ID
	 * @param seq 이미지 목록의 인덱스
	 * @param ip 아이피
	 * @param imageInfo 이미지 전송 정보 중 이미지 정보
	 * @param imageSource 이미지 바이너리 데이터
	 * @param imageResult 렌더링된 이미지 바이러니 데이터
	 * @param thumbInfo 이미지 전송 정보 중 섬네일 정보
	 * @param thumbSource 섬네일 이미지 바이러니 데이터
	 * @param bookmark 이미지 전송 정보 중 북마크 인덱스 정보
	 * @return null이면 정상적으로 등록, 아니면 발생한 예외 객체
	 */
	public Object record(
			String id,
			int seq,
			String ip,
			AbImagePack.ImageInfo imageInfo,
			byte[] imageSource,
			byte[] imageResult,
			AbImagePack.ThumbnailInfo thumbInfo,
			byte[] thumbSource,
			AbImagePack.Bookmark bookmark){
		
		try
		{
			dao.record(id, seq, ip, imageInfo, imageSource, imageResult, thumbInfo, thumbSource, bookmark);
			return null;
		}
		catch (Exception e)
		{
			DebugUtil.print(e);
			
			return procImageRegError(id, "image", e);
		}
	}
	
	//-----------------------------------------------------------
	
	/**
	 * 등록 실패 시 임시 등록 이미지들을 제거합니다.
	 * @param id 이미지 목록 ID
	 * @param type 로그용 구분자
	 * @param e 발생한 예외 객체
	 * @return 발생한 예외 객체
	 */
	private Exception procImageRegError(String id, String type, Exception e){
		System.out.println("[DOC-RECORD]["+type+"] 이미지 저장 실패!!!");
		
		e.printStackTrace();
		
		try
		{
			dao.remove(id);
		}
		catch (Exception de)
		{
			DebugUtil.print(de);
			
			System.out.println("[DOC-REMOVE]["+type+"] 이미지 삭제 실패!!!");
		}
		return e;
	}
	
	//-----------------------------------------------------------
	
	/**
	 * 임시 등록된 이미지 목록을 삭제합니다.
	 * @param id 이미지 목록 ID
	 */
	public void remove(String id){
		dao.remove(id);
	}
	
	/**
	 * 임시 등록된 이미지 목록을 등록 완료 처리합니다.
	 * @param id 이미지 목록 ID
	 */
	public void approval(String id){
		dao.approval(id);
	}
	
	//-----------------------------------------------------------

	/**
	 * 등록완료된 이미지 북마크 목록을 조회합니다.
	 * @param id 이미지 목록 ID
	 * @return 이미지 북마크 DB 정보
	 */
	public List<AbBookmarkDbData> selectBookmark (String id){
		return dao.selectBookmark(id);
	}

	/**
	 * 등록완료된 이미지 목록을 조회합니다.
	 * @param id 이미지 목록 ID
	 * @return 이미지 DB 정보 목록
	 */
	public List<AbImageDbData> select (String id){
		return dao.select(id);
	}
	
	/**
	 * 등록완료된 이미지를 조회합니다.
	 * @param id 이미지 목록 ID
	 * @param seq 이미지 목록의 인덱스
	 * @param type 이미지 구분
	 * @return 바이너리 데이터
	 */
	public AbBinaryData image (String id, int seq, AbImageType type){
		return dao.image(id, seq, type);
	}
}
