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
		public int angle, width, height;
		public String shapes;
		public String decoder;
		
		public AbImageInfo info;
		
		public boolean hasInfo() { return info != null; }
		
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
		public int width, height;
		
		public static ThumbnailInfo fromJSON (String jsonData) throws Exception {
			ObjectMapper om = new ObjectMapper();
			return om.readValue(jsonData, ThumbnailInfo.class);
		}		
	}	

}
