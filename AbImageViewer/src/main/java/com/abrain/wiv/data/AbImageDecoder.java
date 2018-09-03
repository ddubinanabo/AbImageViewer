package com.abrain.wiv.data;

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

	public static AbImageDecoder fromExtension (String extension) {
		if (extension.equalsIgnoreCase("png"))
			return AbImageDecoder.ABDEC_PNG;
		return AbImageDecoder.ABDEC_JPG;
	}
}
