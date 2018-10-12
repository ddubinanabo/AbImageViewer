package com.abrain.wiv.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.abrain.wiv.enums.AbAuthSourceKind;
import com.abrain.wiv.enums.AbAuthType;

@Component
public class AbAuthConfig {
	
	@Value("#{new Boolean('${auth.enabled}')}")
	public boolean enabled;
	
	@Autowired
	public Account account;

	//-----------------------------------------------------------------------------------
	//-----------------------------------------------------------------------------------
	//-----------------------------------------------------------------------------------

	@Component
	public static class Account {
		@Value("#{T(com.abrain.wiv.enums.AbAuthSourceKind).find('${auth.account.source}')}")
		public AbAuthSourceKind source;
		
		@Value("${auth.account.field}")
		public String field;
		
		@Value("#{T(com.abrain.wiv.enums.AbAuthType).find('${auth.account.type}')}")
		public AbAuthType type;
	}
}
