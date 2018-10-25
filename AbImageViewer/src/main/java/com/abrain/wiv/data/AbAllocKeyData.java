package com.abrain.wiv.data;

/**
 * 할당 키 정보
 * <p>브라우저에 제공하는 키 정보입니다.
 * <p> 이미지 목록 요청 시: 이미지 목록 ID, 발급일시
 * <p> 인쇄 지원 요청 시: 인쇄 지원 임시 폴더 ID
 * @author Administrator
 *
 */
public class AbAllocKeyData {
	/**
	 * 할당 키 정보
	 */
	public AbAllocKeyData() {}
	/**
	 * 할당 키 정보
	 * @param key 키
	 */
	public AbAllocKeyData(String key) { this.key = key; }
	/***
	 * 할당 키 정보
	 * @param key 키
	 * @param time 발급 일시
	 */
	public AbAllocKeyData(String key, String time) {
		this.key = key;
		this.time = time;
	}
	
	/**
	 * 키
	 */
	public String key;
	/**
	 * 발급일시
	 * <p> * yyyyMMddHHmmssSSS 형식
	 */
	public String time;
}
