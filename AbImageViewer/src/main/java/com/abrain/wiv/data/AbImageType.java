package com.abrain.wiv.data;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public enum AbImageType {
	ABIMG_IMAGE("이미지", Arrays.asList("image")),
	ABIMG_RESULT("이미지결과", Arrays.asList("result")),
	ABIMG_THUMBNAIL("섬네일", Arrays.asList("thumb", "thumbnail"));
	
	private String title;
	private List<String> list = new ArrayList<String>();
	
	AbImageType(String title, List<String> list){
		this.title = title;
		this.list = list;
	}
	
	public boolean hasCode(String code){
		return list.stream()
				.anyMatch(type -> type.equals(code));
	}
	
	public String getTitle() { return title; }

	//-----------------------------------------------------------
	
	public static AbImageType find(String code){
		return find(code, ABIMG_IMAGE);
	}
	
	public static AbImageType find(String code, AbImageType defaultType){
		if (code == null || code.isEmpty())
			return defaultType;
		
		return Arrays.stream(AbImageType.values())
				.filter(type -> type.hasCode(code))
				.findAny()
				.orElse(defaultType);
	}
	
}
