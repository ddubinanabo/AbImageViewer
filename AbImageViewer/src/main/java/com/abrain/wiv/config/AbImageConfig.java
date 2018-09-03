package com.abrain.wiv.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class AbImageConfig {
	
	@Value("${image.file.accepts}")
	public String ACCEPTS;
	
	
}
