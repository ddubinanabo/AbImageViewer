package com.abrain.wiv.data;

import com.abrain.wiv.data.exif.AbExif;
import com.abrain.wiv.data.exif.AbExifGPS;

/**
 * 이미지 DB 정보
 * @author Administrator
 *
 */
public class AbImageDbData {
	public String id;
	public int seq;
	public String ip;
		
	public int imgRot;
	public String imgDec;
	public long imgWid, imgHgt;
	public byte[] imgSrc;
	public long imgSrcSiz;

	public byte[] imgRslt;
	public long imgRsltSiz;

	public String shapes;
	
	public long thumbWid, thumbgHgt;
	public byte[] thumbSrc;
	public long thumbSrcSiz;

	public String infNm;
	public String infTxt;
	public String infTp;
	
	public String infOrgNm;
	public long infOrgSiz;
	public int infOrgPages;
	public int infOrgIdx;
	
	public String exifYn;
	
	public String exifMake;
	public String exifModel;
	public String exifSw;
	public String exifDt;
	
	public int exifXDim;
	public int exifYDim;
	public int exifOr;
	public int exifXRes;
	public int exifYRes;
	public int exifResUnit;
	
	public String exifGpsYn;
	
	public String exifGpsLatref;
	public double exifGpsLat;
	public float exifGpsLatD;
	public float exifGpsLatM;
	public float exifGpsLatS;
	public String exifGpsLngref;
	public double exifGpsLng;
	public float exifGpsLngD;
	public float exifGpsLngM;
	public float exifGpsLngS;
	public int exifGpsAltref;
	public float exifGpsAlt;

	public String regSts;
	public String regDt;

	public boolean existExif() { return exifYn != null && exifYn.equalsIgnoreCase("Y"); }
	public boolean existExifGps() { return exifGpsYn != null && exifGpsYn.equalsIgnoreCase("Y"); }
	
	public AbExifGPS gps() {
		if (existExifGps()) {
			AbExifGPS gps = new AbExifGPS();
			
			gps.setLatRef(exifGpsLatref);
			
			Number[] lat = new Number[] { exifGpsLatD, exifGpsLatM, exifGpsLatS };
			gps.setLat(lat);
			
			gps.setLngRef(exifGpsLngref);
			
			Number[] lng = new Number[] { exifGpsLngD, exifGpsLngM, exifGpsLngS };
			gps.setLng(lng);
			
			gps.setAltRef(exifGpsAltref);
			gps.setAlt(exifGpsAlt);
			
			return gps;
		}
		return null;
	}
	
	public AbExif exif() {
		if (existExif()) {
			AbExif exif = new AbExif();
			
			exif.setMake(exifMake);
			exif.setModel(exifModel);
			exif.setSoftware(exifSw);
			exif.setDatetime(exifDt);
			
			exif.setXdimension(exifXDim);
			exif.setYdimension(exifYDim);
			
			exif.setOrientation(exifOr);
			
			exif.setXresolution(exifXRes);
			exif.setYresolution(exifYRes);
			exif.setResolutionUnit(exifResUnit);
			
			AbExifGPS gps = gps();
			if (gps != null)
				exif.setGps(gps);
			
			return exif;
		}
		return null;
	}
	
	public AbImageInfo info() {
		AbImageInfo info = new AbImageInfo();
		
		info.setName(infNm);
		info.setText(infTxt);
		info.setType(infTp);
		info.setSize(imgSrcSiz);
		info.setOriginName(infOrgNm);
		info.setOriginSize(infOrgSiz);
		info.setOriginPages(infOrgPages);
		info.setOriginIndex(infOrgIdx);
		
		AbExif exif = exif();
		if (exif != null)
			info.setExif(exif);
		
		return info;
	}
}
