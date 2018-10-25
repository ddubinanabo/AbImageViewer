package com.abrain.wiv.data;

/**
 * 플레인 텍스트 정보
 * <p>* 플레인 텍스트를 브라우저에 제공합니다.
 * @author Administrator
 *
 */
public class AbPlainText {
	/**
	 * 플레인 텍스트 정보
	 */
	public AbPlainText(){}
	/**
	 * 플레인 텍스트 정보
	 * @param text 텍스트 내용
	 */
	public AbPlainText(String text){
		this.text = text;
	}
	
	/**
	 * 텍스트 내용
	 */
	public String text;
}
