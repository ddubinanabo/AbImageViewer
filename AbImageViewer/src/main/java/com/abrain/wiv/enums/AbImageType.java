package com.abrain.wiv.enums;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * 이미지 구분
 * @author Administrator
 *
 */
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
	
	/**
	 * 주어진 코드가 해당되는 지 확인합니다.
	 * @param code 코드
	 * @return 해당되면 true
	 */
	public boolean hasCode(String code){
		return list.stream()
				.anyMatch(type -> type.equals(code));
	}
	
	/**
	 * 표시내용을 가져옵니다. 
	 * @return 표시내용
	 */
	public String getTitle() { return title; }

	//-----------------------------------------------------------
	
	/**
	 * 코드로 이미지 구분을 가져옵니다.
	 * @param code 코드
	 * @return 이미지 구분
	 */
	public static AbImageType find(String code){
		return find(code, ABIMG_IMAGE);
	}
	
	/**
	 * 코드로 이미지 구분을 가져옵니다.
	 * @param code 코드
	 * @param defaultType 기본 이미지 구분
	 * @return 이미지 구분
	 */
	public static AbImageType find(String code, AbImageType defaultType){
		if (code == null || code.isEmpty())
			return defaultType;
		
		return Arrays.stream(AbImageType.values())
				.filter(type -> type.hasCode(code))
				.findAny()
				.orElse(defaultType);
	}
	
}
