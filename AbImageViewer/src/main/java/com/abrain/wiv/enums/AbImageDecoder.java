package com.abrain.wiv.enums;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * 이미지 렌더링 힌트
 * @author Administrator
 *
 */
public enum AbImageDecoder {
	ABDEC_PNG("JPEG 이미지", Arrays.asList("jpg", "jpeg")),
	ABDEC_JPG("PNG 이미지", Arrays.asList("png"));
	
	/**
	 * 표시내용
	 */
	private String title;
	/**
	 * 코드 목록
	 */
	private List<String> list = new ArrayList<String>();
	
	AbImageDecoder(String title, List<String> list){
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
	 * 코드로 이미지 렌더링 힌트를 가져옵니다.
	 * @param code 코드
	 * @return 이미지 렌더링 힌트
	 */
	public static AbImageDecoder find(String code){
		return find(code, ABDEC_JPG);
	}
	
	/**
	 * 코드로 이미지 렌더링 힌트를 가져옵니다.
	 * @param code 코드
	 * @param defaultType 기본 이미지 렌더링 힌트
	 * @return 이미지 렌더링 힌트
	 */
	public static AbImageDecoder find(String code, AbImageDecoder defaultType){
		if (code == null || code.isEmpty())
			return defaultType;
		
		return Arrays.stream(AbImageDecoder.values())
				.filter(type -> type.hasCode(code))
				.findAny()
				.orElse(defaultType);
	}
	
	/**
	 * 이미지 렌더링 힌트를 문자열로 변환합니다.
	 * @param decoder 이미지 렌더링 힌트
	 * @return 문자열
	 */
	public static String toString(AbImageDecoder decoder) {
		if (decoder == ABDEC_PNG) return "png";
		return "jpeg";
	}

	/**
	 * 확장자로 이미지 렌더링 힌트를 가져옵니다.
	 * @param extension 확장자
	 * @return 이미지 렌더링 힌트
	 */
	public static AbImageDecoder fromExtension(String extension) {
		if (extension.equalsIgnoreCase("png") || extension.equalsIgnoreCase("gif"))
			return AbImageDecoder.ABDEC_PNG;
		return AbImageDecoder.ABDEC_JPG;
	}
	
	/**
	 * 확장자와 mime-type을 분석하여 이미지 렌더링 힌트를 가져옵니다.
	 * @param extension 확장자
	 * @param mimeType mime-type
	 * @return 이미지 렌더링 힌트
	 */
	public static AbImageDecoder analysis(String extension, String mimeType) {
		if (mimeType != null && !mimeType.isEmpty()) {
			mimeType = mimeType.toLowerCase();
			
			if (mimeType.equalsIgnoreCase("image/jpeg") || mimeType.equalsIgnoreCase("image/bmp"))
				return AbImageDecoder.ABDEC_JPG;
			else if (mimeType.equalsIgnoreCase("image/png") || mimeType.equalsIgnoreCase("image/apng") || mimeType.equalsIgnoreCase("image/gif"))
				return AbImageDecoder.ABDEC_PNG;
			else if (mimeType.equalsIgnoreCase("image/tiff"))
				return AbImageDecoder.ABDEC_JPG;
			else if (mimeType.equalsIgnoreCase("image/svg+xml"))
				return AbImageDecoder.ABDEC_PNG;
		}
		
		if (extension != null && !extension.isEmpty()) {
			extension = extension.toLowerCase();
			
			if (extension.equalsIgnoreCase("jp2") || extension.equalsIgnoreCase("j2x") || extension.equalsIgnoreCase("j2k") || extension.equalsIgnoreCase("j2c"))
				return AbImageDecoder.ABDEC_JPG;
			if (extension.equalsIgnoreCase("png") || extension.equalsIgnoreCase("gif"))
				return AbImageDecoder.ABDEC_PNG;
		}
		return AbImageDecoder.ABDEC_JPG;
	}
	
	/**
	 * 확장자와 mime-type을 분석하여 이미지 렌더링 힌트 문자열로 가져옵니다.
	 * @param extension 확장자
	 * @param mimeType mime-type
	 * @return 렌더링 힌트 문자열
	 */
	public static String renderingHint(String extension, String mimeType) {
		AbImageDecoder dec = analysis(extension, mimeType);
		return toString(dec);
	}
}
