package com.abrain.wiv.dao;

import java.util.HashMap;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.abrain.wiv.abstracts.AbstractDao;
import com.abrain.wiv.data.AbBinaryData;
import com.abrain.wiv.data.AbBookmarkDbData;
import com.abrain.wiv.data.AbImageDbData;
import com.abrain.wiv.data.AbImageMetadata;
import com.abrain.wiv.data.AbImagePack;
import com.abrain.wiv.data.exif.AbExif;
import com.abrain.wiv.data.exif.AbExifGPS;
import com.abrain.wiv.enums.AbImageType;
import com.abrain.wiv.utils.DateUtil;

/**
 * 이미지 DB DAO
 * @author Administrator
 *
 */
@SuppressWarnings("unchecked")
@Repository
public class DocDao extends AbstractDao {

	//-----------------------------------------------------------
	
	/**
	 * 테스트용입니다. 이미지 뷰어와는 연관이 없습니다.
	 * @return 값
	 */
	public Integer test(){
		int value = (int)sqlSession.selectOne("doc-test");
		return value;
	}

	//-----------------------------------------------------------
	
	/**
	 * 이미지를 임시 등록합니다.
	 * @param id 이미지 목록 ID
	 * @param seq 이미지 목록의 인덱스
	 * @param mainSeq 메인 인덱스
	 * @param subSeq 서브 인덱스
	 * @param ip 아이피
	 * @param imageInfo 이미지 전송 정보 중 이미지 정보
	 * @param imageSource 이미지 바이너리 데이터
	 * @param imageResult 렌더링된 이미지 바이러니 데이터
	 * @param thumbInfo 이미지 전송 정보 중 섬네일 정보
	 * @param thumbSource 섬네일 이미지 바이러니 데이터
	 * @param bookmark 이미지 전송 정보 중 북마크 인덱스 정보
	 */
	public void record(
			String id,
			int seq,
			int mainSeq,
			int subSeq,
			String ip,
			AbImagePack.ImageInfo imageInfo,
			byte[] imageSource,
			byte[] imageResult,
			AbImagePack.ThumbnailInfo thumbInfo,
			byte[] thumbSource,
			AbImagePack.Bookmark bookmark){
		HashMap<String, Object> param = new HashMap<String, Object>();
		
		param.put("ID", id);
		param.put("SEQ", seq);
		param.put("MAN_SEQ", mainSeq);
		param.put("SUB_SEQ", subSeq);
		param.put("IP", ip);
		param.put("ROT", imageInfo.angle);
		param.put("IMG_DEC", imageInfo.decoder);
		param.put("WID", imageInfo.width);
		param.put("HGT", imageInfo.height);
		param.put("IMG_SRC", imageSource);
		param.put("IMG_SRC_SIZ", imageSource != null ? imageSource.length : 0);		
		param.put("IMG_RSLT", imageResult);
		param.put("IMG_RSLT_SIZ", imageResult != null ? imageResult.length : 0);
		param.put("SHAPES", imageInfo.shapes);
		
		param.put("THUMB_WID", thumbInfo != null ? thumbInfo.width : 0);
		param.put("THUMB_HGT", thumbInfo != null ? thumbInfo.height : 0);
		param.put("THUMB_SRC", thumbSource);
		param.put("THUMB_SRC_SIZ", thumbSource != null ? thumbSource.length : 0);
		
		if (imageInfo.hasMetadata()) {
			AbImageMetadata info = imageInfo.info;
			
			param.put("INF_NM", info.getName());
			param.put("INF_TXT", info.getText());
			param.put("INF_TP", info.getType());
			param.put("INF_ORG_NM", info.getOriginName());
			param.put("INF_ORG_SIZ", info.getOriginSize());
			param.put("INF_ORG_PAGES", info.getOriginPages());
			param.put("INF_ORG_IDX", info.getOriginIndex());
			
			if (info.hasExif()) {
				AbExif exif = info.getExif();
				
				param.put("EXIF_YN", "Y");
				param.put("EXIF_MAKE", exif.getMake());
				param.put("EXIF_MODEL", exif.getModel());
				param.put("EXIF_SW", exif.getSoftware());
				param.put("EXIF_DT", exif.getDatetime());
				param.put("EXIF_X_DIM", exif.getXdimension());
				param.put("EXIF_Y_DIM", exif.getYdimension());
				param.put("EXIF_OR", exif.getOrientation());
				param.put("EXIF_X_RES", exif.getXresolution());
				param.put("EXIF_Y_RES", exif.getYresolution());
				param.put("EXIF_RES_UNIT", exif.getResolutionUnit());
				
				if (exif.hasGPS()) {
					AbExifGPS gps = exif.getGps();
					
					Number[] lat = gps.getLat();
					Number[] lng = gps.getLng();
					
					param.put("EXIF_GPS_YN", "Y");
					param.put("EXIF_GPS_LATREF", gps.getLatRef());
					param.put("EXIF_GPS_LAT", gps.degreeLat());
					param.put("EXIF_GPS_LAT_D", lat[0]);
					param.put("EXIF_GPS_LAT_M", lat[1]);
					param.put("EXIF_GPS_LAT_S", lat[2]);
					param.put("EXIF_GPS_LNGREF", gps.getLngRef());
					param.put("EXIF_GPS_LNG", gps.degreeLng());
					param.put("EXIF_GPS_LNG_D", lng[0]);
					param.put("EXIF_GPS_LNG_M", lng[1]);
					param.put("EXIF_GPS_LNG_S", lng[2]);
					param.put("EXIF_GPS_ALTREF", gps.getAltRef());
					param.put("EXIF_GPS_ALT", gps.getAlt());
				}else {
					param.put("EXIF_GPS_YN", "N");
				}
			}else {
				param.put("EXIF_YN", "N");
				param.put("EXIF_GPS_YN", "N");
			}
		}else {
			param.put("EXIF_YN", "N");
			param.put("EXIF_GPS_YN", "N");
		}
		
		String dt = DateUtil.YMDHIS();	
		param.put("REG_DT", dt);
		
		//-----------------------------------------------------------		
			
		sqlSession.insert("doc-regist", param);
		
		//-----------------------------------------------------------
		
		if (bookmark != null) {
			param.clear();
			
			param.put("ID", id);
			param.put("SEQ", seq);
			param.put("BM_SEQ", bookmark.vindex);		
			param.put("REG_DT", dt);
			
			sqlSession.insert("doc-regist-bookmark", param);
		}
	}

	//-----------------------------------------------------------

	/**
	 * 임시 등록된 이미지 목록을 삭제합니다.
	 * @param id 이미지 목록 ID
	 */
	public void remove(String id){

		HashMap<String, Object> param = new HashMap<String, Object>();
		param.put("ID", id);
		
		//-----------------------------------------------------------
		
		sqlSession.delete("doc-delete", param);
		sqlSession.delete("doc-delete-bookmark", param);
	}

	//-----------------------------------------------------------

	/**
	 * 임시 등록된 이미지 목록을 등록 완료 처리합니다.
	 * @param id 이미지 목록 ID
	 */
	public void approval(String id){

		HashMap<String, Object> param = new HashMap<String, Object>();
		param.put("ID", id);
		
		//-----------------------------------------------------------
		
		// 기존 등록 완료 이미지 목록 삭제
		sqlSession.delete("doc-delete-previous", param);
		
		// 기존 등록 완료 이미지 목록 삭제
		sqlSession.delete("doc-delete-previous-bookmark", param);
		
		// 임시 등록된 이미지 목록을 등록 완료 처리
		sqlSession.insert("doc-approval", param);
		
		// 임시 등록된 이미지 목록을 등록 완료 처리
		sqlSession.insert("doc-approval-bookmark", param);
	}
	
	//-----------------------------------------------------------
	
	/**
	 * 등록완료된 이미지 목록을 조회합니다.
	 * @param id 이미지 목록 ID
	 * @return 이미지 DB 정보 목록
	 */
	public List<AbImageDbData> select (String id){
		HashMap<String, Object> param = new HashMap<String, Object>();
		param.put("ID", id);
		
		return sqlSession.selectList("doc-select", param);
	}
	
	/**
	 * 등록완료된 이미지 북마크 목록을 조회합니다.
	 * @param id 이미지 목록 ID
	 * @return 이미지 북마크 DB 정보
	 */
	public List<AbBookmarkDbData> selectBookmark (String id){
		HashMap<String, Object> param = new HashMap<String, Object>();
		param.put("ID", id);
		
		return sqlSession.selectList("doc-select-bookmark", param);
	}
	
	/**
	 * 등록완료된 이미지를 조회합니다.
	 * @param id 이미지 목록 ID
	 * @param seq 이미지 목록의 인덱스
	 * @param type 이미지 구분
	 * @return 바이너리 데이터
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
