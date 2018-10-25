package com.abrain.wiv.data;

/**
 * 이미지 정보
 * <p>* 브라우저에 제공하는 이미지 정보입니다.
 * @author Administrator
 *
 */
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
	public AbImageData(String image, String thumbnail, int angle, int width, int height, String shapes, String decoder){
		this.image = image;
		this.thumbnail = thumbnail;
		this.decoder = decoder;
		this.angle = angle;
		this.width = width;
		this.height = height;
		this.shapes = shapes;
	}
	
	//-----------------------------------------------------------
	
	/**
	 * 이미지 회전 각도
	 */
	private int angle;
	/**
	 * 이미지 폭
	 */
	private int width;
	/**
	 * 이미지 높이
	 */
	private int height;
	/**
	 * 이미지 렌더링 힌트 (jpeg|png)
	 */
	private String decoder;
	/**
	 * 이미지 URL
	 */
	private String image;
	/**
	 * 섬네일 이미지 URL
	 */
	private String thumbnail;
	/**
	 * 도형 XML 문자열
	 */
	private String shapes;
	//private int bookmark;
	
	//-----------------------------------------------------------
	
	/**
	 * 	이미지 메타데이터
	 */
	private AbImageMetadata info;

	//-----------------------------------------------------------
	
	/**
	 * 이미지 회전 각도(을)를 가져옵니다.
	 * @return 이미지 회전 각도
	 */
	public int getAngle() { return angle; }
	/**
	 * 이미지 회전 각도(을)를 설정합니다.
	 * @param value 이미지 회전 각도
	 */
	public void setAngle(int value) { angle = value; }
	
	/**
	 * 이미지 폭(을)를 가져옵니다.
	 * @return 이미지 폭
	 */
	public int getWidth() { return width; }
	/**
	 * 이미지 폭(을)를 설정합니다.
	 * @param value 이미지 폭
	 */
	public void setWidth(int value) { width = value; }
	
	/**
	 * 이미지 높이(을)를 가져옵니다.
	 * @return 이미지 높이
	 */
	public int getHeight() { return height; }
	/**
	 * 이미지 높이(을)를 설정합니다.
	 * @param value 이미지 높이
	 */
	public void setHeight(int value) { height = value; }
	
	//-----------------------------------------------------------
	
	/**
	 * 이미지 렌더링 힌트(을)를 가져옵니다.
	 * @return 이미지 렌더링 힌트 (jpeg|png)
	 */
	public String getDecoder() { return decoder; }
	/**
	 * 이미지 렌더링 힌트(을)를 설정합니다.
	 * @param value 이미지 렌더링 힌트 (jpeg|png)
	 */
	public void setDecoder(String value) { decoder = value; }
	
	//-----------------------------------------------------------
	
	/**
	 * 이미지 URL(을)를 가져옵니다.
	 * @return 이미지 URL
	 */
	public String getImage() { return image; }
	/**
	 * 이미지 URL(을)를 설정합니다.
	 * @param value 이미지 URL
	 */
	public void setImage(String value) { image = value; }
	
	//-----------------------------------------------------------
	
	/**
	 * 섬네일 이미지 URL(을)를 가져옵니다.
	 * @return 섬네일 이미지 URL
	 */
	public String getThumbnail() { return thumbnail; }
	/**
	 * 섬네일 이미지 URL(을)를 설정합니다.
	 * @param value 섬네일 이미지 URL
	 */
	public void setThumbnail(String value) { thumbnail = value; }
	
	//-----------------------------------------------------------
	
	/**
	 * 도형 XML 문자열(을)를 가져옵니다.
	 * @return 도형 XML 문자열
	 */
	public String getShapes() { return shapes; }
	/**
	 * 도형 XML 문자열(을)를 설정합니다.
	 * @param value 도형 XML 문자열
	 */
	public void setShapes(String value) { shapes = value; }

	//-----------------------------------------------------------
	
	public boolean hasInfo() { return info != null; }

	//-----------------------------------------------------------

	/**
	 * 이미지 메타데이터(을)를 가져옵니다.
	 * @return 이미지 메타데이터
	 */
	public AbImageMetadata getInfo() { return info; }
	/**
	 * 이미지 메타데이터(을)를 설정합니다.
	 * @param value 이미지 메타데이터
	 */
	public void setInfo(AbImageMetadata value) { info = value; }

	//-----------------------------------------------------------

//	public int getBookmark() { return bookmark; }
//	public void setBookmark(int value) { bookmark = value; }

}
