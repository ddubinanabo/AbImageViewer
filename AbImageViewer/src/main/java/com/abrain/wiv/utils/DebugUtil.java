package com.abrain.wiv.utils;

public class DebugUtil {
	/**
	 * 웹 취약성 분석에서 [오류메시지를 통한 정보 노출] 보안약점 지적을 피하기 위한 메서드
	 * <p> 모든 catch 문에서 사용하세요.
	 * @param e
	 */
	public static void print(Exception e){
		/**
		 * 웹 취약성 분석을 해야 한다면, 아래 코드를 주석으로 처리하세요.		
		 */
		e.printStackTrace();
	}
}
