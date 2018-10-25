package com.abrain.wiv.data;

import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.map.ObjectMapper;

/**
 * 이미지 전송 정보 팩
 * <p>&bull; 브라우저에서 WAS로 전송 시의 데이터
 * @author Administrator
 *
 */
public class AbImagePack {
	/**
	 * 이미지 전송 정보 중 이미지 정보
	 * @author Administrator
	 *
	 */
	@JsonIgnoreProperties(ignoreUnknown = true)
	public static class ImageInfo {
		/**
		 * 회전 각도 및 크기
		 */
		public int angle, width, height;
		/**
		 * 도형 XML 문자열
		 */
		public String shapes;
		/**
		 * 이미지 렌더링 힌트 (jpeg|png)
		 */
		public String decoder;
		/**
		 * 이미지 메타데이터
		 */
		public AbImageMetadata info;
		
		/**
		 * 이미지 메타데이터가 있는 지 확인합니다.
		 * @return 있으면 true
		 */
		public boolean hasMetadata() { return info != null; }
		
		/**
		 * JSON 문자열에서 객체로 변환합니다.
		 * @param jsonData JSON 인코딩 문장열
		 * @return 이미지 전송 정보 중 이미지 정보
		 * @throws Exception 예외
		 */
		public static ImageInfo fromJSON (String jsonData) throws Exception {
			ObjectMapper om = new ObjectMapper();
			return om.readValue(jsonData, ImageInfo.class);
		}		
	}

	/**
	 * 이미지 전송 정보 중 섬네일 정보
	 * @author Administrator
	 *
	 */
	@JsonIgnoreProperties(ignoreUnknown = true)
	public static class ThumbnailInfo {
		/**
		 * 섬네일 이미지 크기
		 */
		public int width, height;
		
		/**
		 * JSON 문자열에서 객체로 변환합니다.
		 * @param jsonData JSON 인코딩 문장열
		 * @return 이미지 전송 정보 중 섬네일 정보
		 * @throws Exception 예외
		 */
		public static ThumbnailInfo fromJSON (String jsonData) throws Exception {
			ObjectMapper om = new ObjectMapper();
			return om.readValue(jsonData, ThumbnailInfo.class);
		}		
	}	

	/**
	 * 이미지 전송 정보 중 북마크 인덱스 정보
	 * @author Administrator
	 *
	 */
	@JsonIgnoreProperties(ignoreUnknown = true)
	public static class Bookmark {
		/**
		 * 북마크 인덱스
		 */
		public int index;
		/**
		 * 수집된 북마크 목록 인덱스
		 */
		public int vindex;
		
		/**
		 * JSON 문자열에서 객체로 변환합니다.
		 * @param jsonData JSON 인코딩 문장열
		 * @return 이미지 전송 정보 중 섬네일 정보
		 * @throws Exception 예외
		 */
	public static Bookmark fromJSON (String jsonData) throws Exception {
			ObjectMapper om = new ObjectMapper();
			return om.readValue(jsonData, Bookmark.class);
		}		
	}
}
