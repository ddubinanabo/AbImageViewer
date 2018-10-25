package com.abrain.wiv.enums;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.codehaus.jackson.annotate.JsonValue;

/**
 * 권한 정보 타입
 * @author Administrator
 *
 */
public enum AbAuthType {
	ABAUTH_TP_UNKNOWN("알수없음", null, Arrays.asList("unknown")),
	ABAUTH_TP_ID("아이디", "id", Arrays.asList("id")),
	ABAUTH_TP_LEVEL("레벨", "level", Arrays.asList("level"));
	
	/**
	 * 표시내용
	 */
	private String title;
	/**
	 * 코드
	 */
	private String value;
	/**
	 * 코드 목록
	 */
	private List<String> list = new ArrayList<String>();
	
	AbAuthType(String title, String value, List<String> list){
		this.title = title;
		this.value = value;
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
	/**
	 * 코드를 가져옵니다. 
	 * @return 코드
	 */
	public String getValue() { return value; }
	
	/**
	 * 코드를 가져옵니다.
	 * <p>* JSON으로 변환 시 이 메서드의 값을 사용합니다.
	 */
	@Override
	@JsonValue
	public String toString() {
		return this.value;
	}

	//-----------------------------------------------------------
	
	/**
	 * 코드로 권한 정보 타입을 가져옵니다.
	 * @param code 코드
	 * @return 권한 정보 타입
	 */
	public static AbAuthType find(String code){
		return find(code, ABAUTH_TP_UNKNOWN);
	}
	
	/**
	 * 코드로 권한 정보 타입을 가져옵니다.
	 * @param code 코드
	 * @param defaultType 기본 권한 정보 타입
	 * @return 권한 정보 타입
	 */
	public static AbAuthType find(String code, AbAuthType defaultType){
		if (code == null || code.isEmpty())
			return defaultType;
		
		return Arrays.stream(AbAuthType.values())
				.filter(type -> type.hasCode(code))
				.findAny()
				.orElse(defaultType);
	}

}
