package com.abrain.wiv.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.abrain.wiv.enums.AbAuthSourceKind;
import com.abrain.wiv.enums.AbAuthType;

/**
 * 권한 설정 정보
 * @author Administrator
 *
 */
@Component
public class AbAuthConfig {
	
	/**
	 * 권한 사용 여부
	 */
	@Value("#{new Boolean('${auth.enabled}')}")
	public boolean enabled;
	
	/**
	 * 권한 정보의 획득 방법 설정
	 */
	@Autowired
	public Account account;

	//-----------------------------------------------------------------------------------
	//-----------------------------------------------------------------------------------
	//-----------------------------------------------------------------------------------

	/**
	 * 권한 정보의 획득 방법 설정 정보
	 * @author Administrator
	 *
	 */
	@Component
	public static class Account {
		/**
		 * 권한 획득처 (cgi|local-storage|session-storage|cookie|session)
		 */
		@Value("#{T(com.abrain.wiv.enums.AbAuthSourceKind).find('${auth.account.source}')}")
		public AbAuthSourceKind source;
		
		/**
		 * 권한 획득시 필드명 (source가 cgi면 제외)
		 */
		@Value("${auth.account.field}")
		public String field;
		
		/**
		 * 획득된 권한 정보 타입 (id/level)
		 */
		@Value("#{T(com.abrain.wiv.enums.AbAuthType).find('${auth.account.type}')}")
		public AbAuthType type;
	}
}
