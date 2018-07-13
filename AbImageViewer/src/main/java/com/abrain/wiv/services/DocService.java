package com.abrain.wiv.services;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.abrain.wiv.dao.DocDao;
import com.abrain.wiv.data.AbBinaryData;
import com.abrain.wiv.data.AbImageDbData;
import com.abrain.wiv.data.AbImagePackCollection;
import com.abrain.wiv.data.AbImageType;
import com.abrain.wiv.transactions.DbTransaction;

@Service
public class DocService {

	@Autowired
	private DocDao dao;
	
	//-----------------------------------------------------------

	public Object record(AbImagePackCollection collection, String ip){
		String id = null;
		
		DbTransaction tran = dao.begin();
		
		try
		{
			UUID uid = UUID.randomUUID();
			
			id = uid.toString().replaceAll("-", "").toUpperCase();
			
			int siz = collection.size();
			for (int i=0; i < siz; i++){
				AbImagePackCollection.AbImagePack pack = collection.get(i);
				
				dao.record(pack, id, i + 1, ip);
			}
			
			tran.commit();
			
			System.out.println("[SAVED] " + id);
			
			return id;
		}
		catch (Exception e)
		{
			System.out.println("[DOC-RECORD] 이미지 저장 실패!!!");
			
			e.printStackTrace();
			
			tran.rollback();
			return e;
		}
	}
	
	public List<AbImageDbData> select (String id){
		return dao.select(id);
	}
	
	public AbBinaryData image (String id, int seq, AbImageType type){
		return dao.image(id, seq, type);
	}
}
