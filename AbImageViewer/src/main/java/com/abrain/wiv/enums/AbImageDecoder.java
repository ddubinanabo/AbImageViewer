package com.abrain.wiv.enums;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public enum AbImageDecoder {
	ABDEC_PNG("이미지결과", Arrays.asList("jpg", "jpeg")),
	ABDEC_JPG("이미지", Arrays.asList("png"));
	
	private String title;
	private List<String> list = new ArrayList<String>();
	
	AbImageDecoder(String title, List<String> list){
		this.title = title;
		this.list = list;
	}
	
	public boolean hasCode(String code){
		return list.stream()
				.anyMatch(type -> type.equals(code));
	}
	
	public String getTitle() { return title; }

	//-----------------------------------------------------------
	
	public static AbImageDecoder find(String code){
		return find(code, ABDEC_JPG);
	}
	
	public static AbImageDecoder find(String code, AbImageDecoder defaultType){
		if (code == null || code.isEmpty())
			return defaultType;
		
		return Arrays.stream(AbImageDecoder.values())
				.filter(type -> type.hasCode(code))
				.findAny()
				.orElse(defaultType);
	}
	
	public static String toString(AbImageDecoder decoder) {
		if (decoder == ABDEC_PNG) return "png";
		return "jpeg";
	}

	public static AbImageDecoder fromExtension(String extension) {
		if (extension.equalsIgnoreCase("png") || extension.equalsIgnoreCase("gif"))
			return AbImageDecoder.ABDEC_PNG;
		return AbImageDecoder.ABDEC_JPG;
	}
	
	public static AbImageDecoder analysis(String extension, String mimeType) {
		if (mimeType != null && !mimeType.isEmpty()) {
			mimeType = mimeType.toLowerCase();
			
			if (mimeType.equalsIgnoreCase("image/jpeg") || mimeType.equalsIgnoreCase("image/bmp"))
				return AbImageDecoder.ABDEC_JPG;
			else if (mimeType.equalsIgnoreCase("image/png") || mimeType.equalsIgnoreCase("image/apng") || mimeType.equalsIgnoreCase("image/gif"))
				return AbImageDecoder.ABDEC_PNG;
			else if (mimeType.equalsIgnoreCase("image/tiff"))
				return AbImageDecoder.ABDEC_JPG;
			else if (mimeType.equalsIgnoreCase("image/svg+xml"))
				return AbImageDecoder.ABDEC_PNG;
		}
		
		if (extension != null && !extension.isEmpty()) {
			extension = extension.toLowerCase();
			
			if (extension.equalsIgnoreCase("jp2") || extension.equalsIgnoreCase("j2x") || extension.equalsIgnoreCase("j2k") || extension.equalsIgnoreCase("j2c"))
				return AbImageDecoder.ABDEC_JPG;
			if (extension.equalsIgnoreCase("png") || extension.equalsIgnoreCase("gif"))
				return AbImageDecoder.ABDEC_PNG;
		}
		return AbImageDecoder.ABDEC_JPG;
	}
	
	public static String renderingHint(String extension, String mimeType) {
		AbImageDecoder dec = analysis(extension, mimeType);
		return toString(dec);
	}
}
