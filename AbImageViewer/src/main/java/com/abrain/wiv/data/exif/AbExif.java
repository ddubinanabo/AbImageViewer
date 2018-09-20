package com.abrain.wiv.data.exif;

public class AbExif {
	private String make;
	private String model;
	private String software;
	
	private String datetime;
	private Number orientation;
	private Number xresolution;
	private Number yresolution;
	private Number resolutionUnit;
	private Number xdimension;
	private Number ydimension;
	
	private AbExifGPS gps;

	//-----------------------------------------------------------

	public String getMake() { return make; }
	public void setMake(String value) { make = value; }

	public String getModel() { return model; }
	public void setModel(String value) { model = value; }

	public String getSoftware() { return software; }
	public void setSoftware(String value) { software = value; }

	public String getDatetime() { return datetime; }
	public void setDatetime(String value) { datetime = value; }

	public Number getOrientation() { return orientation; }
	public void setOrientation(Number value) { orientation = value; }

	public Number getXresolution() { return xresolution; }
	public void setXresolution(Number value) { xresolution = value; }

	public Number getYresolution() { return yresolution; }
	public void setYresolution(Number value) { yresolution = value; }

	public Number getResolutionUnit() { return resolutionUnit; }
	public void setResolutionUnit(Number value) { resolutionUnit = value; }

	public Number getXdimension() { return xdimension; }
	public void setXdimension(Number value) { xdimension = value; }

	public Number getYdimension() { return ydimension; }
	public void setYdimension(Number value) { ydimension = value; }
	
	//-----------------------------------------------------------
	
	public boolean hasGPS() { return gps != null; }
	
	//-----------------------------------------------------------

	public AbExifGPS getGps() { return gps; }
	public void setGps(AbExifGPS value) { gps = value; }
	
	//-----------------------------------------------------------
	
}
