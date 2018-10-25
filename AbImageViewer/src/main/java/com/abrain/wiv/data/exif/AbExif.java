package com.abrain.wiv.data.exif;

/**
 * 정제된 EXIF 정보
 * <p>* 이미지 EXIF 정보에서 필요한 부분만 추출, 변환한 정보입니다.
 * @author Administrator
 *
 */
public class AbExif {
	/**
	 * 제조사 (exif의 Make 태그)
	 */
	private String make;
	/**
	 * 모델 (exif의 Model 태그)
	 */
	private String model;
	/**
	 * 	소프트웨어 (exif의 Software 태그)
	 */
	private String software;
	
	/**
	 * 촬영 일시(YMDHIS) (exif의 DateTime 태그)
	 */
	private String datetime;
	/**
	 * 사진방향 (exif의 Orientation 태그)
	 */
	private Number orientation;
	/**
	 * 가로 해상도 (exif의 Xresolution 태그)
	 */
	private Number xresolution;
	/**
	 * 세로 해상도 (exif의 YResolution 태그)
	 */
	private Number yresolution;
	/**
	 * 해상도 단위 (2=INCH, 3=CM) (exif의 ResolutionUnit 태그)
	 */
	private Number resolutionUnit;
	/**
	 * PIXEL X (exif의 PixelXDimension 태그)
	 */
	private Number xdimension;
	/**
	 * PIXEL Y (exif의 PixelYDimension 태그)
	 */
	private Number ydimension;
	
	/**
	 * 정제된 EXIF GPS 정보
	 */
	private AbExifGPS gps;

	//-----------------------------------------------------------

	/**
	 * 제조사를 가져옵니다.
	 * @return 제조사 (exif의 Make 태그)
	 */
	public String getMake() { return make; }
	/**
	 * 제조사를 설정합니다.
	 * @param value 제조사 (exif의 Make 태그)
	 */
	public void setMake(String value) { make = value; }

	/**
	 * 모델을 가져옵니다.
	 * @return 모델 (exif의 Model 태그)
	 */
	public String getModel() { return model; }
	/**
	 * 모델을 설정합니다.
	 * @param value 모델 (exif의 Model 태그)
	 */
	public void setModel(String value) { model = value; }

	/**
	 * 소프트웨어를 가져옵니다.
	 * @return 소프트웨어 (exif의 Software 태그)
	 */
	public String getSoftware() { return software; }
	/**
	 * 소프트웨어를 설정합니다.
	 * @param value 소프트웨어 (exif의 Software 태그)
	 */
	public void setSoftware(String value) { software = value; }

	/**
	 * 촬영 일시를 가져옵니다.
	 * @return 촬영 일시(YMDHIS) (exif의 DateTime 태그)
	 */
	public String getDatetime() { return datetime; }
	/**
	 * 촬영 일시를 설정합니다.
	 * @param value 촬영 일시(YMDHIS) (exif의 DateTime 태그)
	 */
	public void setDatetime(String value) { datetime = value; }

	/**
	 * 사진방향(을)를 가져옵니다.
	 * @return 사진방향 (exif의 Orientation 태그)
	 */
	public Number getOrientation() { return orientation; }
	/**
	 * 사진방향(을)를 설정합니다.
	 * @param value 사진방향 (exif의 Orientation 태그)
	 */
	public void setOrientation(Number value) { orientation = value; }

	/**
	 * 가로 해상도(을)를 가져옵니다.
	 * @return 가로 해상도 (exif의 Xresolution 태그)
	 */
	public Number getXresolution() { return xresolution; }
	/**
	 * 가로 해상도(을)를 설정합니다.
	 * @param value 가로 해상도 (exif의 Xresolution 태그)
	 */
	public void setXresolution(Number value) { xresolution = value; }

	/**
	 * 세로 해상도(을)를 가져옵니다.
	 * @return 세로 해상도 (exif의 YResolution 태그)
	 */
	public Number getYresolution() { return yresolution; }
	/**
	 * 세로 해상도(을)를 설정합니다.
	 * @param value 세로 해상도 (exif의 YResolution 태그)
	 */
	public void setYresolution(Number value) { yresolution = value; }

	/**
	 * 해상도 단위(을)를 가져옵니다.
	 * @return 해상도 단위 (2=INCH, 3=CM) (exif의 ResolutionUnit 태그)
	 */
	public Number getResolutionUnit() { return resolutionUnit; }
	/**
	 * 해상도 단위(을)를 설정합니다.
	 * @param value 해상도 단위 (2=INCH, 3=CM) (exif의 ResolutionUnit 태그)
	 */
	public void setResolutionUnit(Number value) { resolutionUnit = value; }

	/**
	 * PIXEL X(을)를 가져옵니다.
	 * @return PIXEL X (exif의 PixelXDimension 태그)
	 */
	public Number getXdimension() { return xdimension; }
	/**
	 * PIXEL X(을)를 설정합니다.
	 * @param value PIXEL X (exif의 PixelXDimension 태그)
	 */
	public void setXdimension(Number value) { xdimension = value; }

	/**
	 * PIXEL Y(을)를 가져옵니다.
	 * @return PIXEL Y (exif의 PixelYDimension 태그)
	 */
	public Number getYdimension() { return ydimension; }
	/**
	 * PIXEL Y(을)를 설정합니다.
	 * @param value PIXEL Y (exif의 PixelYDimension 태그)
	 */
	public void setYdimension(Number value) { ydimension = value; }
	
	//-----------------------------------------------------------
	
	/**
	 * GPS 정보가 있는 확인합니다.
	 * @return 있으면 true
	 */
	public boolean hasGPS() { return gps != null; }
	
	//-----------------------------------------------------------

	/**
	 * GPS 정보(을)를 가져옵니다.
	 * @return 정제된 EXIF GPS 정보
	 */
	public AbExifGPS getGps() { return gps; }
	/**
	 * GPS 정보(을)를 설정합니다.
	 * @param value 정제된 EXIF GPS 정보
	 */
	public void setGps(AbExifGPS value) { gps = value; }
	
	//-----------------------------------------------------------
	
}
