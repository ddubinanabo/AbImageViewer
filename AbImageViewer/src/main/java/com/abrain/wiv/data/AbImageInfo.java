package com.abrain.wiv.data;

public class AbImageInfo {
	private String text;
	private String name;
	private Integer index = null;
	private AbImageExif exif;
	
	//-----------------------------------------------------------
	
	private String originName;
	private Integer originSize = null;
	private Integer originIndex = null;
	private Integer originPages = null;

	//-----------------------------------------------------------

	public String getText() { return text; }
	public void setText(String value) { text = value; }

	public String getName() { return name; }
	public void setName(String value) { name = value; }

	public Integer getIndex() { return index; }
	public void setIndex(Integer value) { index = value; }

	public AbImageExif getExif() { return exif; }
	public void setExif(AbImageExif value) { exif = value; }

	//-----------------------------------------------------------

	public String getOriginName() { return originName; }
	public void setOriginName(String value) { originName = value; }

	public Integer getOriginSize() { return originSize; }
	public void setOriginSize(Integer value) { originSize = value; }

	public Integer getOriginIndex() { return originIndex; }
	public void setOriginIndex(Integer value) { originIndex = value; }

	public Integer getOriginPages() { return originPages; }
	public void setOriginPages(Integer value) { originPages = value; }
	
}
