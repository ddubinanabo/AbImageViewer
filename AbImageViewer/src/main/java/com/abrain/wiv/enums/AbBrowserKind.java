package com.abrain.wiv.enums;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public enum AbBrowserKind {
	ABBROWSER_UNKNOWN("알수없음", Arrays.asList("unknown")),
	ABBROWSER_IE("Microsoft Internet Explorer", Arrays.asList("ie", "trident", "msie")),
	ABBROWSER_OPERA("Opera", Arrays.asList("opera")),
	ABBROWSER_FIREFOX("Firefox", Arrays.asList("firefox")),
	ABBROWSER_CHROME("Chrome", Arrays.asList("chrome")),
	ABBROWSER_SAFARI("Sarafi", Arrays.asList("safari"));
	
	private String title;
	private List<String> list = new ArrayList<String>();
	
	AbBrowserKind(String title, List<String> list){
		this.title = title;
		this.list = list;
	}
	
	public boolean hasCode(String code){
		return list.stream()
				.anyMatch(type -> type.equals(code));
	}
	
	public String getTitle() { return title; }

	//-----------------------------------------------------------
	
	public static AbBrowserKind find(String code){
		return find(code, ABBROWSER_UNKNOWN);
	}
	
	public static AbBrowserKind find(String code, AbBrowserKind defaultType){
		if (code == null || code.isEmpty())
			return defaultType;
		
		return Arrays.stream(AbBrowserKind.values())
				.filter(type -> type.hasCode(code))
				.findAny()
				.orElse(defaultType);
	}

}
