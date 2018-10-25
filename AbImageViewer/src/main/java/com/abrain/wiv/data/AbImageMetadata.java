package com.abrain.wiv.data;

import org.codehaus.jackson.annotate.JsonIgnoreProperties;

import com.abrain.wiv.data.exif.AbExif;

/**
 * 이미지 메타데이터
 * @author Administrator
 *
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class AbImageMetadata {
	/**
	 * 표시명
	 */
	private String text;
	/**
	 * 파일명
	 */
	private String name;
	/**
	 * 파일 타입 (mime-type)
	 */
	private String type;
	/**
	 * 파일크기 (단위: 바이트)
	 */
	private Long size;
	/**
	 * 정제된 EXIF 정보
	 */
	private AbExif exif;
	
	//-----------------------------------------------------------
	
	/**
	 * 원본(문서) 파일명
	 * <p>* 이 필드는 문서 파일에서만 설정됩니다.
	 */
	private String originName;
	/**
	 * 원본(문서) 파일크기 (단위: 바이트)
	 * <p>* 이 필드는 문서 파일에서만 설정됩니다.
	 */
	private Long originSize = null;
	/**
	 * 원본(문서)의 인덱스
	 * <p>* 이 필드는 문서 파일에서만 설정됩니다.
	 */
	private Integer originIndex = null;
	/**
	 * 원본(문서) 이미지 개수
	 * <p>* 이 필드는 문서 파일에서만 설정됩니다.
	 */
	private Integer originPages = null;

	//-----------------------------------------------------------

	/**
	 * 표시명(을)를 가져옵니다.
	 * @return 표시명
	 */
	public String getText() { return text; }
	/***
	 * 표시명(을)를 설정합니다.
	 * @param value 표시명
	 */
	public void setText(String value) { text = value; }

	/**
	 * 파일명(을)를 가져옵니다.
	 * @return 파일명
	 */
	public String getName() { return name; }
	/***
	 * 파일명(을)를 설정합니다.
	 * @param value 파일명
	 */
	public void setName(String value) { name = value; }

	/**
	 * 파일 타입(을)를 가져옵니다.
	 * @return 파일 타입 (mime-type)
	 */
	public String getType() { return type; }
	/***
	 * 파일 타입(을)를 설정합니다.
	 * @param value 파일 타입 (mime-type)
	 */
	public void setType(String value) { type = value; }

	/**
	 * 파일크기(을)를 가져옵니다.
	 * @return 파일크기 (단위: 바이트)
	 */
	public Long getSize() { return size; }
	/***
	 * 파일크기(을)를 설정합니다.
	 * @param value 파일크기 (단위: 바이트)
	 */
	public void setSize(Long value) { size = value; }

	/**
	 * 정제된 EXIF 정보(을)를 가져옵니다.
	 * @return 정제된 EXIF 정보
	 */
	public AbExif getExif() { return exif; }
	/***
	 * 정제된 EXIF 정보(을)를 설정합니다.
	 * @param value 정제된 EXIF 정보
	 */
	public void setExif(AbExif value) { exif = value; }

	//-----------------------------------------------------------
	
	/**
	 * 정제된 EXIF 정보가 있는 지 확인합니다.
	 * @return 있느면 true
	 */
	public boolean hasExif() { return exif != null; }

	//-----------------------------------------------------------

	/**
	 * 원본(문서) 파일명(을)를 가져옵니다.
	 * @return 원본(문서) 파일명
	 */
	public String getOriginName() { return originName; }
	/***
	 * 원본(문서) 파일명(을)를 설정합니다.
	 * @param value 원본(문서) 파일명
	 */
	public void setOriginName(String value) { originName = value; }

	/**
	 * 원본(문서) 파일크기(을)를 가져옵니다.
	 * @return 원본(문서) 파일크기 (단위: 바이트)
	 */
	public Long getOriginSize() { return originSize; }
	/***
	 * 원본(문서) 파일크기(을)를 설정합니다.
	 * @param value 원본(문서) 파일크기 (단위: 바이트)
	 */
	public void setOriginSize(Long value) { originSize = value; }

	/**
	 * 원본(문서)의 인덱스(을)를 가져옵니다.
	 * @return 원본(문서)의 인덱스
	 */
	public Integer getOriginIndex() { return originIndex; }
	/***
	 * 원본(문서)의 인덱스(을)를 설정합니다.
	 * @param value 원본(문서)의 인덱스
	 */
	public void setOriginIndex(Integer value) { originIndex = value; }

	/**
	 * 원본(문서) 이미지 개수(을)를 가져옵니다.
	 * @return 원본(문서) 이미지 개수
	 */
	public Integer getOriginPages() { return originPages; }
	/***
	 * 원본(문서) 이미지 개수(을)를 설정합니다.
	 * @param value 원본(문서) 이미지 개수
	 */
	public void setOriginPages(Integer value) { originPages = value; }
	
}
