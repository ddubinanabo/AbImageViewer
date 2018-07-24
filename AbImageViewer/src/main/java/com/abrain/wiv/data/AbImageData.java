package com.abrain.wiv.data;

public class AbImageData {
	public AbImageData(){}
	public AbImageData(String image, String thumbnail){
		this.image = image;
		this.thumbnail = thumbnail;
	}
	public AbImageData(String image, String thumbnail, int width, int height){
		this.image = image;
		this.thumbnail = thumbnail;
		this.width = width;
		this.height = height;
	}
	public AbImageData(String image, String thumbnail, int width, int height, String shapes){
		this.image = image;
		this.thumbnail = thumbnail;
		this.width = width;
		this.height = height;
		this.shapes = shapes;
	}
	public AbImageData(String image, String thumbnail, int width, int height, String shapes, String decoder){
		this.image = image;
		this.thumbnail = thumbnail;
		this.decoder = decoder;
		this.width = width;
		this.height = height;
		this.shapes = shapes;
	}
	
	//-----------------------------------------------------------
	
	private int width, height;
	private String decoder;
	private String image;
	private String thumbnail;
	private String shapes;
	
	//-----------------------------------------------------------
	
	public int getWidth() { return width; }
	public void setWidth(int value) { width = value; }
	
	public int getHeight() { return height; }
	public void setHeight(int value) { height = value; }
	
	//-----------------------------------------------------------
	
	public String getDecoder() { return decoder; }
	public void setDecoder(String value) { decoder = value; }
	
	//-----------------------------------------------------------
	
	public String getImage() { return image; }
	public void setImage(String value) { image = value; }
	
	//-----------------------------------------------------------
	
	public String getThumbnail() { return thumbnail; }
	public void setThumbnail(String value) { thumbnail = value; }
	
	//-----------------------------------------------------------
	
	public String getShapes() { return shapes; }
	public void setShapes(String value) { shapes = value; }
}
