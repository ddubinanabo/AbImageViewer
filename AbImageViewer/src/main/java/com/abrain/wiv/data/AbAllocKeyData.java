package com.abrain.wiv.data;

/**
 * 브라우저에 제공하는 키 정보
 * <p> 이미지 목록 ID, 발급일시
 * <p> 인쇄 지원 임시 폴더 ID
 * @author Administrator
 *
 */
public class AbAllocKeyData {
	public AbAllocKeyData() {}
	public AbAllocKeyData(String key) { this.key = key; }
	public AbAllocKeyData(String key, String time) {
		this.key = key;
		this.time = time;
	}
	
	public String key, time;
}
