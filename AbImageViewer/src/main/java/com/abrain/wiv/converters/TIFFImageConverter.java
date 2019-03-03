package com.abrain.wiv.converters;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.abrain.wiv.config.AbImageConfig;
import com.abrain.wiv.data.AbImageData;
import com.abrain.wiv.data.externals.AbExtImages;

/**
 * TIFF 이미지 변환 도구 샘플입니다.
 * <p>* 컨버터를 구현하세요.
 * @author Administrator
 *
 */
public class TIFFImageConverter {
	private TIFFImageConverter() {}
	
	//-----------------------------------------------------------------------------------
	
	/**
	 * 문서 파일을 이미지 파일로 컨버팅하고, 그 이미지 파일들의 이미지 정보 목록을 가져옵니다.
	 * @param config 이미지 파일 설정 정보
	 * @param path 문서 파일 경로
	 * @return 이미지 정보 목록
	 * @throws Exception 예외
	 */
	public static List<AbImageData> convert (AbImageConfig config, String path)
			throws Exception{
		
		//List<AbImageData> images = new ArrayList<>();
		
		String dir = "C:/Users/Administrator/Desktop/닭/tiff-sample";
		
		AbExtImages imgs = new AbExtImages(config, dir);
		return imgs.collect();
	}
}
