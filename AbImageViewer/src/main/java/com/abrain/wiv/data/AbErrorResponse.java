package com.abrain.wiv.data;

/**
 * 예외 정보
 * <p>* 브라우저에 제공하는 예외 정보입니다.
 * @author Administrator
 *
 */
public class AbErrorResponse {
	/**
	 * 예외 명
	 */
	public String name;
	/**
	 * 오류 코드
	 */
	public Integer errorCode;
	/**
	 * 메시지 유형
	 */
	public String messageType;
	/**
	 * 메시지
	 */
	public String message;
	/**
	 * 스택 추적 정보
	 */
	public String stackTrace;
	/**
	 * 사용자 정의 (예약)
	 */
	public String token;
}
