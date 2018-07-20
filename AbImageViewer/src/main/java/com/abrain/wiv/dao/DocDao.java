package com.abrain.wiv.dao;

import java.util.HashMap;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.abrain.wiv.abstracts.AbstractDao;
import com.abrain.wiv.data.AbBinaryData;
import com.abrain.wiv.data.AbImageDbData;
import com.abrain.wiv.data.AbImagePack;
import com.abrain.wiv.data.AbImageType;

@SuppressWarnings("unchecked")
@Repository
public class DocDao extends AbstractDao {

	//-----------------------------------------------------------
	
	public void recordImage(String id, int seq, String ip, AbImagePack.AbImageInfo info){
		HashMap<String, Object> param = new HashMap<String, Object>();
		param.put("ID", id);
		param.put("SEQ", seq);
		param.put("IP", ip);
		param.put("WID", info.width);
		param.put("HGT", info.height);
		param.put("SHAPES", info.shapes);
		
		//-----------------------------------------------------------
		
		sqlSession.insert("doc-record-image", param);		
	}
	
	public void recordImageSource(String id, int seq, byte[] bytes){
		HashMap<String, Object> param = new HashMap<String, Object>();
		param.put("ID", id);
		param.put("SEQ", seq);
		param.put("SRC", bytes);
		param.put("SRC_SIZ", bytes != null ? bytes.length : 0);
		
		//-----------------------------------------------------------
		
		sqlSession.insert("doc-update-image-source", param);		
	}
	
	public void recordImageResult(String id, int seq, byte[] bytes){
		HashMap<String, Object> param = new HashMap<String, Object>();
		param.put("ID", id);
		param.put("SEQ", seq);
		param.put("SRC", bytes);
		param.put("SRC_SIZ", bytes != null ? bytes.length : 0);
		
		//-----------------------------------------------------------
		
		sqlSession.insert("doc-update-image-result", param);		
	}
	
	public void recordThumbnail(String id, int seq, byte[] bytes, AbImagePack.AbThumbnailInfo info){
		HashMap<String, Object> param = new HashMap<String, Object>();
		param.put("ID", id);
		param.put("SEQ", seq);
		param.put("WID", info.width);
		param.put("HGT", info.height);
		param.put("SRC", bytes);
		param.put("SRC_SIZ", bytes != null ? bytes.length : 0);
		
		//-----------------------------------------------------------
		
		sqlSession.insert("doc-update-thumb", param);		
	}

	//-----------------------------------------------------------

	public void remove(String id){

		HashMap<String, Object> param = new HashMap<String, Object>();
		param.put("ID", id);

		//-----------------------------------------------------------
		
		sqlSession.delete("doc-delete", param);
	}
	
	public List<AbImageDbData> select (String id){
		HashMap<String, Object> param = new HashMap<String, Object>();
		param.put("ID", id);
		
		return sqlSession.selectList("doc-select", param);
	}
		
	public AbBinaryData image (String id, int seq, AbImageType type){
		HashMap<String, Object> param = new HashMap<String, Object>();
		param.put("ID", id);
		param.put("SEQ", seq);
		
		String name = null;
		switch(type){
		case ABIMG_RESULT:
			name = "doc-result";
			break;
		case ABIMG_THUMBNAIL:
			name = "doc-thumbnail";
			break;
		default:
			name = "doc-image";
			break;
		}
		
		return (AbBinaryData) sqlSession.selectOne(name, param);
	}
}
