package com.abrain.wiv.data;

import org.codehaus.jackson.annotate.JsonIgnoreProperties;

import com.abrain.wiv.data.exif.AbExif;

/**
 * 이미지 정보
 * @author Administrator
 *
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class AbImageInfo {
	private String text;
	private String name;
	private String type;
	private Long size;
	private AbExif exif;
	
	//-----------------------------------------------------------
	
	private String originName;
	private Long originSize = null;
	private Integer originIndex = null;
	private Integer originPages = null;

	//-----------------------------------------------------------

	public String getText() { return text; }
	public void setText(String value) { text = value; }

	public String getName() { return name; }
	public void setName(String value) { name = value; }

	public String getType() { return type; }
	public void setType(String value) { type = value; }

	public Long getSize() { return size; }
	public void setSize(Long value) { size = value; }

	public AbExif getExif() { return exif; }
	public void setExif(AbExif value) { exif = value; }

	//-----------------------------------------------------------
	
	public boolean hasExif() { return exif != null; }

	//-----------------------------------------------------------

	public String getOriginName() { return originName; }
	public void setOriginName(String value) { originName = value; }

	public Long getOriginSize() { return originSize; }
	public void setOriginSize(Long value) { originSize = value; }

	public Integer getOriginIndex() { return originIndex; }
	public void setOriginIndex(Integer value) { originIndex = value; }

	public Integer getOriginPages() { return originPages; }
	public void setOriginPages(Integer value) { originPages = value; }
	
}
