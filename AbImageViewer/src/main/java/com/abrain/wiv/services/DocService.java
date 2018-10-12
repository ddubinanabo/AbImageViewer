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

@Service
public class DocService {

	@Autowired
	private DocDao dao;
	
	//-----------------------------------------------------------
	
	public Integer test(){
		return dao.test();
	}
	
	//-----------------------------------------------------------
	//-----------------------------------------------------------
	//-----------------------------------------------------------

	public static class Key {
		public String id, time;
	}
	
	//-----------------------------------------------------------
	
	/**
	 * 이미지 목록 키 생성
	 * @return
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
	
	public void remove(String id){
		dao.remove(id);
	}
	
	public void approval(String id){
		dao.approval(id);
	}
	
	//-----------------------------------------------------------

	public List<AbBookmarkDbData> selectBookmark (String id){
		return dao.selectBookmark(id);
	}

	public List<AbImageDbData> select (String id){
		return dao.select(id);
	}
	
	public AbBinaryData image (String id, int seq, AbImageType type){
		return dao.image(id, seq, type);
	}
}
