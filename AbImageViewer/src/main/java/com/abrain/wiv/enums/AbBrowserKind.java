package com.abrain.wiv.enums;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * 브라우저 종류
 * @author Administrator
 *
 */
public enum AbBrowserKind {
	ABBROWSER_UNKNOWN("알수없음", Arrays.asList("unknown")),
	ABBROWSER_IE("Microsoft Internet Explorer", Arrays.asList("ie", "trident", "msie")),
	ABBROWSER_OPERA("Opera", Arrays.asList("opera")),
	ABBROWSER_FIREFOX("Firefox", Arrays.asList("firefox")),
	ABBROWSER_CHROME("Chrome", Arrays.asList("chrome")),
	ABBROWSER_SAFARI("Sarafi", Arrays.asList("safari"));
	
	/**
	 * 표시 내용
	 */
	private String title;
	/**
	 * 코드 목록
	 */
	private List<String> list = new ArrayList<String>();
	
	AbBrowserKind(String title, List<String> list){
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
	 * 코드로 브라우저 종류를 가져옵니다.
	 * @param code 코드
	 * @return 브라우저 종류
	 */
	public static AbBrowserKind find(String code){
		return find(code, ABBROWSER_UNKNOWN);
	}
	
	/**
	 * 코드로 브라우저 종류를 가져옵니다.
	 * @param code 코드
	 * @param defaultType 기본 브라우저 종류
	 * @return 브라우저 종류
	 */
	public static AbBrowserKind find(String code, AbBrowserKind defaultType){
		if (code == null || code.isEmpty())
			return defaultType;
		
		return Arrays.stream(AbBrowserKind.values())
				.filter(type -> type.hasCode(code))
				.findAny()
				.orElse(defaultType);
	}

}
