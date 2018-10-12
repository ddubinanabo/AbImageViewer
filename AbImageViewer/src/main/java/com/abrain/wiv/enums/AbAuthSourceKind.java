package com.abrain.wiv.enums;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.codehaus.jackson.annotate.JsonValue;

public enum AbAuthSourceKind {
	ABAUTH_UNKNOWN("알수없음", null, Arrays.asList("unknown")),
	ABAUTH_CGI("CGI", "cgi", Arrays.asList("cgi")),
	ABAUTH_LOCAL_STORAGE("로컬 스토로지", "local-storage", Arrays.asList("local-storage")),
	ABAUTH_SESSION_STORAGE("세션 스토로지", "session-storage", Arrays.asList("session-storage")),
	ABAUTH_COOKIE("쿠키", "cookie", Arrays.asList("cookie")),
	ABAUTH_SESSION("세션", "session", Arrays.asList("session"));
	
	private String title, value;
	private List<String> list = new ArrayList<String>();
	
	AbAuthSourceKind(String title, String value, List<String> list){
		this.title = title;
		this.value = value;
		this.list = list;
	}
	
	public boolean hasCode(String code){
		return list.stream()
				.anyMatch(type -> type.equals(code));
	}
	
	public String getTitle() { return title; }
	public String getValue() { return value; }
	
	@Override
	@JsonValue
	public String toString() {
		return this.value;
	}

	//-----------------------------------------------------------
	
	public static AbAuthSourceKind find(String code){
		return find(code, ABAUTH_UNKNOWN);
	}
	
	public static AbAuthSourceKind find(String code, AbAuthSourceKind defaultType){
		if (code == null || code.isEmpty())
			return defaultType;
		
		return Arrays.stream(AbAuthSourceKind.values())
				.filter(type -> type.hasCode(code))
				.findAny()
				.orElse(defaultType);
	}

}
