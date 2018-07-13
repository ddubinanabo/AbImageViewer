package com.abrain.wiv.dao;

import java.util.HashMap;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.abrain.wiv.abstracts.AbstractDao;
import com.abrain.wiv.data.AbBinaryData;
import com.abrain.wiv.data.AbImageDbData;
import com.abrain.wiv.data.AbImagePackCollection;
import com.abrain.wiv.data.AbImageType;

@SuppressWarnings("unchecked")
@Repository
public class DocDao extends AbstractDao {

	//-----------------------------------------------------------

	public void record(AbImagePackCollection.AbImagePack pack, String id, int seq, String ip){

		//-----------------------------------------------------------
	
		byte[] imageSource = pack.image.sourceBinary();
		byte[] imageResult = pack.image.resultBinary();
		
		byte[] thumbnailSource = pack.thumbnail.sourceBinary();

		//-----------------------------------------------------------
	
		HashMap<String, Object> param = new HashMap<String, Object>();
		param.put("ID", id);
		param.put("SEQ", seq);
		param.put("IP", ip);
		param.put("IMG_WID", pack.image.width);
		param.put("IMG_HGT", pack.image.height);
		param.put("IMG_SRC", imageSource);
		param.put("IMG_SRC_SIZ", imageSource.length);
		param.put("IMG_RSLT", imageResult);
		param.put("IMG_RSLT_SIZ", imageResult != null ? imageResult.length : 0);
		param.put("SHAPES", pack.image.shapes);
		
		param.put("THUMB_WID", pack.thumbnail.width);
		param.put("THUMB_HGT", pack.thumbnail.height);
		param.put("THUMB_SRC", thumbnailSource);
		param.put("THUMB_SRC_SIZ", thumbnailSource.length);

		//-----------------------------------------------------------
		
		sqlSession.insert("doc-record", param);
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
