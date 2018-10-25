package com.abrain.wiv.enums;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.codehaus.jackson.annotate.JsonValue;

/**
 * 권한 획득처
 * @author Administrator
 *
 */
public enum AbAuthSourceKind {
	ABAUTH_UNKNOWN("알수없음", null, Arrays.asList("unknown")),
	ABAUTH_CGI("CGI", "cgi", Arrays.asList("cgi")),
	ABAUTH_LOCAL_STORAGE("로컬 스토로지", "local-storage", Arrays.asList("local-storage")),
	ABAUTH_SESSION_STORAGE("세션 스토로지", "session-storage", Arrays.asList("session-storage")),
	ABAUTH_COOKIE("쿠키", "cookie", Arrays.asList("cookie")),
	ABAUTH_SESSION("세션", "session", Arrays.asList("session"));
	
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
	
	AbAuthSourceKind(String title, String value, List<String> list){
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
	 * 코드로 권한 획득처를 가져옵니다.
	 * @param code 코드
	 * @return 권한 획득처
	 */
	public static AbAuthSourceKind find(String code){
		return find(code, ABAUTH_UNKNOWN);
	}
	
	/**
	 * 코드로 권한 획득처를 가져옵니다.
	 * @param code 코드
	 * @param defaultType 기본 권한 획득처
	 * @return 권한 획득처
	 */
	public static AbAuthSourceKind find(String code, AbAuthSourceKind defaultType){
		if (code == null || code.isEmpty())
			return defaultType;
		
		return Arrays.stream(AbAuthSourceKind.values())
				.filter(type -> type.hasCode(code))
				.findAny()
				.orElse(defaultType);
	}

}
