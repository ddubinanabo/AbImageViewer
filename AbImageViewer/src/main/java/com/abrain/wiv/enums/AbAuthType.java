package com.abrain.wiv.enums;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.codehaus.jackson.annotate.JsonValue;

public enum AbAuthType {
	ABAUTH_TP_UNKNOWN("알수없음", null, Arrays.asList("unknown")),
	ABAUTH_TP_ID("아이디", "id", Arrays.asList("id")),
	ABAUTH_TP_LEVEL("레벨", "level", Arrays.asList("level"));
	
	private String title, value;
	private List<String> list = new ArrayList<String>();
	
	AbAuthType(String title, String value, List<String> list){
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
	
	public static AbAuthType find(String code){
		return find(code, ABAUTH_TP_UNKNOWN);
	}
	
	public static AbAuthType find(String code, AbAuthType defaultType){
		if (code == null || code.isEmpty())
			return defaultType;
		
		return Arrays.stream(AbAuthType.values())
				.filter(type -> type.hasCode(code))
				.findAny()
				.orElse(defaultType);
	}

}
