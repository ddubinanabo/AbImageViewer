package com.abrain.wiv.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.abrain.wiv.auth.AbAuth;

/**
 * 이미지 뷰어 설정 정보 팩
 * <p> JSP와 브라우저에 제공하는 데이터
 * @author Administrator
 *
 */
@Component
public class AbViewerConfigPack {
	/**
	 * 이미지 뷰어 설정 정보
	 */
	@Autowired
	public AbImageViewerConfig viewer;
	
	/**
	 * 이미지 뷰어 권한 정보
	 */
	@Autowired
	public AbAuth auth;

	//-----------------------------------------------------------

	/**
	 * 이미지 뷰어 설정 정보를 가져옵니다.
	 * @return {@link #viewer}
	 */
	public AbImageViewerConfig getViewer() { return viewer; }
	/**
	 * 이미지 뷰어 권한 정보를 가져옵니다.
	 * @return {@link #auth}
	 */
	public AbAuth getAuth() { return auth; }
}
