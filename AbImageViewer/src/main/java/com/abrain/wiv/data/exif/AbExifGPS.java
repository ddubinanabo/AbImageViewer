package com.abrain.wiv.data.exif;

public class AbExifGPS {
	private String latRef;
	private Number[] lat;
	private String lngRef;
	private Number[] lng;
	private Number altRef;
	private Number alt;

	//-----------------------------------------------------------

	public String getLatRef() { return latRef; }
	public void setLatRef(String value) { latRef = value; }

	public Number[] getLat() { return lat; }
	public void setLat(Number[] value) { lat = value; }

	public String getLngRef() { return lngRef; }
	public void setLngRef(String value) { lngRef = value; }

	public Number[] getLng() { return lng; }
	public void setLng(Number[] value) { lng = value; }

	public Number getAltRef() { return altRef; }
	public void setAltRef(Number value) { altRef = value; }

	public Number getAlt() { return alt; }
	public void setAlt(Number value) { alt = value; }
	
	//-----------------------------------------------------------
	
	public Number degreeLat() { return dms2degree(lat); }
	public Number degreeLng() { return dms2degree(lng); }
	
	//-----------------------------------------------------------
	
	private static Number dms2degree(Number[] dms) {
		double d = dms[0].doubleValue();
		double m = dms[1].doubleValue();
		double s = dms[2].doubleValue();
		
		return d + (m/60) + (s/3600);
	}
	
	//-----------------------------------------------------------

}
