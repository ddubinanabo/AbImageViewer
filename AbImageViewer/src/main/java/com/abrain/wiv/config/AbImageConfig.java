package com.abrain.wiv.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * 이미지 파일 설정 정보
 * @author Administrator
 *
 */
@Component
public class AbImageConfig {
	
	/**
	 * 폴더 내 이미지로 인식할 파일 확장자 목록
	 */
	@Value("#{'${image.file.accepts}'.trim().toLowerCase().split('\\s*\\,\\s*')}")
	public String[] ACCEPTS;
	
}
