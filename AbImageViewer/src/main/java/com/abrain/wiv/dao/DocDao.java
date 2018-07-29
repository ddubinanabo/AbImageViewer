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
	
	/**
	 * 이미지 임시 등록
	 * @param id
	 * @param seq
	 * @param ip
	 * @param imageInfo
	 * @param imageSource
	 * @param imageResult
	 * @param thumbInfo
	 * @param thumbSource
	 */
	public void record(
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
		
		param.put("IP", ip);
			
		sqlSession.insert("doc-regist", param);
	}

	//-----------------------------------------------------------

	/**
	 * 임시 등록된 이미지 목록 삭제
	 * @param id
	 */
	public void remove(String id){

		HashMap<String, Object> param = new HashMap<String, Object>();
		param.put("ID", id);
		
		//-----------------------------------------------------------
		
		sqlSession.delete("doc-delete", param);
	}

	//-----------------------------------------------------------

	/**
	 * 임시 등록된 이미지 목록을 등록 완료 처리
	 * @param id
	 */
	public void approval(String id){

		HashMap<String, Object> param = new HashMap<String, Object>();
		param.put("ID", id);
		
		//-----------------------------------------------------------
		
		// 기존 등록 완료 이미지 목록 삭제
		sqlSession.delete("doc-delete-previous", param);
		
		// 임시 등록된 이미지 목록을 등록 완료 처리
		sqlSession.insert("doc-approval", param);
	}
	
	//-----------------------------------------------------------
	
	/**
	 * 등록완료된 이미지 목록 조회
	 * @param id
	 * @return
	 */
	public List<AbImageDbData> select (String id){
		HashMap<String, Object> param = new HashMap<String, Object>();
		param.put("ID", id);
		
		return sqlSession.selectList("doc-select", param);
	}
	
	/**
	 * 등록완료된 이미지 조회
	 * @param id
	 * @param seq
	 * @param type
	 * @return
	 */
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
