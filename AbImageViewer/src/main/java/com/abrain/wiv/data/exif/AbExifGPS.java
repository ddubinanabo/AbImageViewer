package com.abrain.wiv.data.exif;

/**
 * 정제된 EXIF GPS 정보
 * @author Administrator
 *
 */
public class AbExifGPS {
	/**
	 * 위도 참고, 북위(N)/남위(S)
	 */
	private String latRef;
	/**
	 * 위도 도분초
	 */
	private Number[] lat;
	/**
	 * 경도 참고, 동경(E)/서경(W)
	 */
	private String lngRef;
	/**
	 * 경도 도분초
	 */
	private Number[] lng;
	/**
	 * 표고기준점을 참고한 고도(해수면 기준), 1이면 해발, 해수면 아래
	 */
	private Number altRef;
	/**
	 * 고도 (단위: 미터)
	 */
	private Number alt;

	//-----------------------------------------------------------

	/**
	 * 위도 참고(을)를 가져옵니다.
	 * @return 위도 참고, 북위(N)/남위(S)
	 */
	public String getLatRef() { return latRef; }
	/**
	 * 위도 참고(을)를 설정합니다.
	 * @param value 위도 참고, 북위(N)/남위(S)
	 */
	public void setLatRef(String value) { latRef = value; }

	/**
	 * 위도 도분초(을)를 가져옵니다.
	 * @return 위도 도분초
	 */
	public Number[] getLat() { return lat; }
	/**
	 * 위도 도분초(을)를 설정합니다.
	 * @param value 위도 도분초
	 */
	public void setLat(Number[] value) { lat = value; }

	/**
	 * 경도 참고(을)를 가져옵니다.
	 * @return 경도 참고, 동경(E)/서경(W)
	 */
	public String getLngRef() { return lngRef; }
	/**
	 * 경도 참고(을)를 설정합니다.
	 * @param value 경도 참고, 동경(E)/서경(W)
	 */
	public void setLngRef(String value) { lngRef = value; }

	/**
	 * 경도 도분초(을)를 가져옵니다.
	 * @return 경도 도분초
	 */
	public Number[] getLng() { return lng; }
	/**
	 * 경도 도분초(을)를 설정합니다.
	 * @param value 경도 도분초
	 */
	public void setLng(Number[] value) { lng = value; }

	/**
	 * 표고기준점을 참고한 고도(을)를 가져옵니다.
	 * @return 1이면 해발, 해수면 아래
	 */
	public Number getAltRef() { return altRef; }
	/**
	 * 표고기준점을 참고한 고도(을)를 설정합니다.
	 * @param value 1이면 해발, 해수면 아래
	 */
	public void setAltRef(Number value) { altRef = value; }

	/**
	 * 고도(을)를 가져옵니다.
	 * @return 단위: 미터
	 */
	public Number getAlt() { return alt; }
	/**
	 * 고도(을)를 설정합니다.
	 * @param value 단위: 미터
	 */
	public void setAlt(Number value) { alt = value; }
	
	//-----------------------------------------------------------
	
	/**
	 * 위도 DEGREE 정보를 가져옵니다.
	 * @return 위도 DEGREE 정보
	 */
	public Number degreeLat() { return dms2degree(lat); }
	/**
	 * 경도 DEGREE 정보를 가져옵니다.
	 * @return 경도 DEGREE 정보
	 */
	public Number degreeLng() { return dms2degree(lng); }
	
	//-----------------------------------------------------------
	
	/**
	 * 도분초를 DEGREE로 변환합니다.
	 * @param dms 도분초
	 * @return DEGREE
	 */
	private static Number dms2degree(Number[] dms) {
		double d = dms[0].doubleValue();
		double m = dms[1].doubleValue();
		double s = dms[2].doubleValue();
		
		return d + (m/60) + (s/3600);
	}
	
	//-----------------------------------------------------------

}
