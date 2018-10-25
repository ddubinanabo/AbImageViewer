package com.abrain.wiv.data;

import com.abrain.wiv.data.exif.AbExif;
import com.abrain.wiv.data.exif.AbExifGPS;

/**
 * 이미지 DB 정보
 * @author Administrator
 *
 */
public class AbImageDbData {
	/**
	 * 이미지 목록 ID
	 */
	public String id;
	/**
	 * 이미지 목록의 인덱스
	 */
	public int seq;
	/**
	 * 최초 등록자 아이피
	 */
	public String ip;
		
	/**
	 * 이미지 회전
	 */
	public int imgRot;
	/**
	 * 이미지 렌더링 힌트
	 */
	public String imgDec;
	/**
	 * 이미지 크기
	 */
	public long imgWid, imgHgt;
	/**
	 * 이미지
	 */
	public byte[] imgSrc;
	/**
	 * 이미지의 용량
	 */
	public long imgSrcSiz;

	/**
	 * 렌더링(워터마크, 주석/마스킹 등등)된 이미지
	 */
	public byte[] imgRslt;
	/**
	 * 렌더링된 이미지의 용량
	 */
	public long imgRsltSiz;

	/**
	 * 주석/마스킹 정보 (XML)
	 */
	public String shapes;
	
	/**
	 * 섬네일 이미지 크기
	 */
	public long thumbWid, thumbgHgt;
	/**
	 * 섬네일 이미지
	 */
	public byte[] thumbSrc;
	/**
	 * 섬네일 이미지의 용량
	 */
	public long thumbSrcSiz;

	/**
	 * 파일명
	 */
	public String infNm;
	/**
	 * 표시명
	 */
	public String infTxt;
	/**
	 * 파일 타입 (MIME TYPE)
	 */
	public String infTp;
	
	/**
	 * 문서(원본) 파일명
	 */
	public String infOrgNm;
	/**
	 * 문서(원본) 용량
	 */
	public long infOrgSiz;
	/**
	 * 문서(원본) 전체 페이지 수
	 */
	public int infOrgPages;
	/**
	 * 문서(원본) 페이지 인덱스
	 */
	public int infOrgIdx;
	
	/**
	 * EXIF 존재 여부 (Y/N)
	 */
	public String exifYn;
	
	/**
	 * EXIF 제조사 (exif의 Make 태그)
	 */
	public String exifMake;
	/**
	 * EXIF 모델 (exif의 Model 태그)
	 */
	public String exifModel;
	/**
	 * EXIF 소프트웨어 (exif의 Software 태그)
	 */
	public String exifSw;
	/**
	 * EXIF 촬영 일시 (exif의 DateTime 태그)
	 */
	public String exifDt;
	
	/**
	 * EXIF PIXEL X (exif의 PixelXDimension 태그)
	 */
	public int exifXDim;
	/**
	 * EXIF PIXEL Y (exif의 PixelYDimension 태그)
	 */
	public int exifYDim;
	/**
	 * EXIF 사진방향 (exif의 Orientation 태그)
	 */
	public int exifOr;
	/**
	 * EXIF 가로 해상도 (exif의 Xresolution 태그)
	 */
	public int exifXRes;
	/**
	 * EXIF 세로 해상도 (exif의 YResolution 태그)
	 */
	public int exifYRes;
	/**
	 * EXIF 해상도 단위 (2=INCH, 3=CM) (exif의 ResolutionUnit 태그)
	 */
	public int exifResUnit;
	
	/**
	 * EXIF GPS 정보 존재 여부 (Y/N)
	 */
	public String exifGpsYn;
	
	/**
	 * EXIF 위도 참조 (N=북위, S=남위) (exif의 GPSLatitudeRef 태그)
	 */
	public String exifGpsLatref;
	/**
	 * EXIF 위도 DEGREE (도) (exif의 GPSLatitude 태그)
	 */
	public double exifGpsLat;
	/**
	 * EXIF 위도 DMS (도) (exif의 GPSLatitude 태그)
	 */
	public float exifGpsLatD;
	/**
	 * EXIF 위도 DMS (분) (exif의 GPSLatitude 태그)
	 */
	public float exifGpsLatM;
	/**
	 * EXIF 위도 DMS (초) (exif의 GPSLatitude 태그)
	 */
	public float exifGpsLatS;
	/**
	 * EXIF 경도 참조 (E=동경, W=서경) (exif의 GPSLongitudeRef 태그)
	 */
	public String exifGpsLngref;
	/**
	 * EXIF 경도 DEGREE (도) (exif의 GPSLongitude 태그)
	 */
	public double exifGpsLng;
	/**
	 * EXIF 경도 DMS (도) (exif의 GPSLongitude 태그)
	 */
	public float exifGpsLngD;
	/**
	 * EXIF 경도 DMS (분) (exif의 GPSLongitude 태그)
	 */
	public float exifGpsLngM;
	/**
	 * EXIF 경도 DMS (초) (exif의 GPSLongitude 태그)
	 */
	public float exifGpsLngS;
	/**
	 * EXIF 고도 참조 (0=해발, 1=해수면 아래) (exif의 GPSAltitudeRef 태그)
	 */
	public int exifGpsAltref;
	/**
	 * EXIF 고도 (단위: M) (exif의 GPSAltitude 태그)
	 */
	public float exifGpsAlt;

	/**
	 * 등록 상태 (R=RECORDING, C=COMPLETE)
	 */
	public String regSts;
	/**
	 * 이미지 등록 일시
	 */
	public String regDt;

	/**
	 * EXIF 정보가 있는 지 확인합니다.
	 * @return 있으면 true
	 */
	public boolean existExif() { return exifYn != null && exifYn.equalsIgnoreCase("Y"); }
	/**
	 * GPS 정보가 있는 지 확인합니다.
	 * @return 있으면 true
	 */
	public boolean existExifGps() { return exifGpsYn != null && exifGpsYn.equalsIgnoreCase("Y"); }
	
	/**
	 * 정제된 EXIF GPS 정보를 가져옵니다.
	 * @return 정제된 EXIF GPS 정보
	 */
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
	
	/**
	 * 정제된 EXIF 정보를 가져옵니다.
	 * @return 정제된 EXIF 정보
	 */
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
	
	/**
	 * 이미지 메타데이터를 가져옵니다.
	 * @return 이미지 메타데이터
	 */
	public AbImageMetadata metadata() {
		AbImageMetadata info = new AbImageMetadata();
		
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
