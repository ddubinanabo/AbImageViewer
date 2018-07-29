package com.abrain.wiv.services;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.abrain.wiv.dao.DocDao;
import com.abrain.wiv.data.AbBinaryData;
import com.abrain.wiv.data.AbImageDbData;
import com.abrain.wiv.data.AbImagePack;
import com.abrain.wiv.data.AbImageType;
import com.abrain.wiv.transactions.DbTransaction;
import com.abrain.wiv.utils.DebugUtil;

@Service
public class DocService {

	@Autowired
	private DocDao dao;
	
	//-----------------------------------------------------------

	public String alloc(){
		UUID uid = UUID.randomUUID();
		String id = uid.toString().replaceAll("-", "").toUpperCase();
		
		System.out.println("[ALLOC] " + id);
		
		return id;
	}
	
	//-----------------------------------------------------------

	public Object record(
			String id,
			int seq,
			String ip,
			AbImagePack.AbImageInfo imageInfo,
			byte[] imageSource,
			byte[] imageResult,
			AbImagePack.AbThumbnailInfo thumbInfo,
			byte[] thumbSource){
		
		try
		{
			dao.record(id, seq, ip, imageInfo, imageSource, imageResult, thumbInfo, thumbSource);
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

	public List<AbImageDbData> select (String id){
		return dao.select(id);
	}
	
	public AbBinaryData image (String id, int seq, AbImageType type){
		return dao.image(id, seq, type);
	}
}
