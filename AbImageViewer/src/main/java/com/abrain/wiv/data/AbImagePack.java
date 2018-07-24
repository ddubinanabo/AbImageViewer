package com.abrain.wiv.data;

import org.codehaus.jackson.map.ObjectMapper;

public class AbImagePack {
	public static class AbImageInfo {
		public int width, height;
		public String shapes;
		public String decoder;
		
		public static AbImageInfo fromJSON (String jsonData) throws Exception {
			ObjectMapper om = new ObjectMapper();
			return om.readValue(jsonData, AbImageInfo.class);
		}		
	}

	public static class AbThumbnailInfo {
		public int width, height;
		
		public static AbThumbnailInfo fromJSON (String jsonData) throws Exception {
			ObjectMapper om = new ObjectMapper();
			return om.readValue(jsonData, AbThumbnailInfo.class);
		}		
	}	

}
