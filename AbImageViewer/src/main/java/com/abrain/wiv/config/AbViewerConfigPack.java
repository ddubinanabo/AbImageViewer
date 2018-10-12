package com.abrain.wiv.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.abrain.wiv.auth.AbAuth;

/**
 * 뷰어 Config 정보 팩
 * <p> JSP와 브라우저에 제공하는 데이터
 * @author Administrator
 *
 */
@Component
public class AbViewerConfigPack {
	@Autowired
	public AbImageViewerConfig viewer;
	
	@Autowired
	public AbAuth auth;

	//-----------------------------------------------------------

	public AbImageViewerConfig getViewer() { return viewer; }
	public AbAuth getAuth() { return auth; }
}
