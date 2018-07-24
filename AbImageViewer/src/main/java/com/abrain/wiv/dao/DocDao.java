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
	
	public void record(
			boolean modify,
			String id,
			int seq,
			String ip,
			AbImagePack.AbImageInfo imageInfo,
			byte[] imageSource,
			byte[] imageResult,
			AbImagePack.AbThumbnailInfo thumbInfo,
			byte[] thumbSource){
		HashMap<String, Object> param = new HashMap<String, Object>();
		param.put("ID", id);
		param.put("SEQ", seq);
		param.put("WID", imageInfo.width);
		param.put("HGT", imageInfo.height);
		param.put("IMG_SRC", imageSource);
		param.put("IMG_SRC_SIZ", imageSource.length);		
		param.put("IMG_RSLT", imageResult);
		param.put("IMG_RSLT_SIZ", imageResult != null ? imageResult.length : 0);
		param.put("SHAPES", imageInfo.shapes);
		param.put("IMG_DEC", imageInfo.decoder);
		
		param.put("THUMB_WID", thumbInfo.width);
		param.put("THUMB_HGT", thumbInfo.height);
		param.put("THUMB_SRC", thumbSource);
		param.put("THUMB_SRC_SIZ", thumbSource.length);
		
		//-----------------------------------------------------------
		
		if (modify){
			sqlSession.update("doc-update", param);
		}else{
			param.put("IP", ip);
			
			sqlSession.insert("doc-regist", param);
		}
	}

	//-----------------------------------------------------------

	/**
	 * 수정 작업을 위해 새 목록 개수 이상을 삭제하기 위한 메서드입니다.
	 * <p>뷰어의 이미지 전송 작업은 이미지를 호출하고, 렌더링하고, 전송하는 작업을 이미지 개수만큼 반복합니다.
	 * <p>때문에, 수정 작업 시에 기존 이미지들을 다 지우고 시작 한다면 이미지를 찾을 수 없다는 오류를 보게 됩니다.
	 * @param id
	 * @param seq
	 */
	public void removeImagePost(String id, int seq){

		HashMap<String, Object> param = new HashMap<String, Object>();
		param.put("ID", id);
		param.put("SEQ", seq);

		//-----------------------------------------------------------
		
		sqlSession.delete("doc-delete-image-post", param);
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
