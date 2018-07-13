package com.abrain.wiv.data;

import java.util.ArrayList;
import java.util.Base64;

import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.map.type.TypeFactory;

@SuppressWarnings("serial")
public class AbImagePackCollection extends ArrayList<AbImagePackCollection.AbImagePack> {
	
	//-----------------------------------------------------------

	public static AbImagePackCollection fromJSON (String jsonData) throws Exception {
		ObjectMapper om = new ObjectMapper();
		return (AbImagePackCollection) om.readValue(jsonData, TypeFactory.defaultInstance().constructCollectionType(AbImagePackCollection.class, AbImagePack.class));
	}

	//-----------------------------------------------------------
	//-----------------------------------------------------------
	//-----------------------------------------------------------
	
	public static class AbImagePack {
		public AbImage image;
		public AbThumbnail thumbnail;	
	}

	public static class AbImage {
		public int width, height;
		public String source;
		public String result;
		public String shapes;

		//-----------------------------------------------------------

		public byte[] sourceBinary(){
			return Base64.getDecoder().decode(source);
		}

		public byte[] resultBinary(){
			return result != null ? Base64.getDecoder().decode(result) : null;
		}
	}

	public static class AbThumbnail {
		public int width, height;
		public String source;

		//-----------------------------------------------------------

		public byte[] sourceBinary(){
			return Base64.getDecoder().decode(source);
		}
	}	
}
