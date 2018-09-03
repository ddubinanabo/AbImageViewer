package com.abrain.wiv.data;

public class AbImageInfo {
	private String text;
	private String name;
	private Integer index = null, length = null;
	private AbImageExif exif;

	//-----------------------------------------------------------

	public String getText() { return text; }
	public void setText(String value) { text = value; }

	public String getName() { return name; }
	public void setName(String value) { name = value; }

	public Integer getIndex() { return index; }
	public void setIndex(Integer value) { index = value; }

	public AbImageExif getExif() { return exif; }
	public void setExif(AbImageExif value) { exif = value; }
}
