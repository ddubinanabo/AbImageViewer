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

	public Object recordImage(String id, int seq, String ip, AbImagePack.AbImageInfo info){
		try
		{
			dao.recordImage(id, seq, ip, info);
			return null;
		}
		catch (Exception e)
		{
			return procImageRegError(id, "image", e);
		}
	}
	
	public Object recordImageSource(String id, int seq, byte[] bytes){
		try
		{
			dao.recordImageSource(id, seq, bytes);
			return null;
		}
		catch (Exception e)
		{
			return procImageRegError(id, "image-source", e);
		}		
	}
	
	public Object recordImageResult(String id, int seq, byte[] bytes){
		try
		{
			dao.recordImageResult(id, seq, bytes);
			return null;
		}
		catch (Exception e)
		{
			return procImageRegError(id, "image-result", e);
		}
	}
	
	public Object recordThumbnail(String id, int seq, byte[] bytes, AbImagePack.AbThumbnailInfo info){
		try
		{
			dao.recordThumbnail(id, seq, bytes, info);
			return null;
		}
		catch (Exception e)
		{
			return procImageRegError(id, "thumb", e);
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
			System.out.println("[DOC-REMOVE]["+type+"] 이미지 삭제 실패!!!");
			
			de.printStackTrace();				
		}
		return e;
	}
	
	//-----------------------------------------------------------
	
	public void remove(String id){
		dao.remove(id);
	}
	
	//-----------------------------------------------------------

	public List<AbImageDbData> select (String id){
		return dao.select(id);
	}
	
	public AbBinaryData image (String id, int seq, AbImageType type){
		return dao.image(id, seq, type);
	}
}
