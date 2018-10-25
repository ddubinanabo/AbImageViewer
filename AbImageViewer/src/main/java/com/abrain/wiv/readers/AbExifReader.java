package com.abrain.wiv.readers;

import java.io.File;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;

import com.abrain.wiv.data.exif.AbExif;
import com.abrain.wiv.data.exif.AbExifGPS;
import com.drew.imaging.ImageMetadataReader;
import com.drew.lang.GeoLocation;
import com.drew.lang.Rational;
import com.drew.metadata.Directory;
import com.drew.metadata.Metadata;
import com.drew.metadata.Tag;
import com.drew.metadata.exif.ExifDirectoryBase;
import com.drew.metadata.exif.GpsDirectory;

/**
 * 이미지 EXIF 리더
 * @author Administrator
 *
 */
public class AbExifReader {
	/**
	 * 파일에서 정제된 EXIF 정보를 읽어 옵니다.
	 * @param file 파일 객체
	 * @return 정제된 EXIF 정보
	 * @throws Exception 예외
	 */
	public static AbExif read(File file) throws Exception {
		Metadata meta = ImageMetadataReader.readMetadata(file);
		return readData(meta);
	}
	
	/**
	 * 스트림에서 정제된 EXIF 정보를 읽어 옵니다.
	 * @param in 입력 스트림
	 * @return 정제된 EXIF 정보
	 * @throws Exception 예외
	 */
	public static AbExif read(InputStream in) throws Exception {
		Metadata meta = ImageMetadataReader.readMetadata(in);
		return readData(meta);
	}

	/**
	 * 스트림에서 정제된 EXIF 정보를 읽어 옵니다.
	 * @param in 입력 스트림
	 * @param length 읽을 크기
	 * @return 정제된 EXIF 정보
	 * @throws Exception 예외
	 */
	public static AbExif read(InputStream in, final long length) throws Exception {
		Metadata meta = ImageMetadataReader.readMetadata(in, length);
		return readData(meta);
	}
	
	//-----------------------------------------------------------
	//-----------------------------------------------------------
	//-----------------------------------------------------------
	
	private static String trimString (Directory dir, int tagType) {
		String s = dir.getString(tagType, "UTF-8");
		if (s != null)
			return s.trim();
		return s;
	}
	
	private static Number[] rationalArray (Directory dir, int tagType) {
		Rational[] r = dir.getRationalArray(tagType);
		ArrayList<Number> ns = new ArrayList<>();
		
		int siz = r.length;
		for (int i=0; i < siz; i++) {
			ns.add(r[i].doubleValue());
		}
		return ns.toArray(new Number[0]);
	}
	
	private static AbExif readData(Metadata meta) {
		//SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		SimpleDateFormat format = new SimpleDateFormat("yyyyMMddHHmmss");
		Date date = null;

		boolean exists = false;
		
		AbExif exif = new AbExif();

		//for (Directory dir : meta.getDirectories()) { for (Tag tag : dir.getTags()) { System.out.println("\t" + tag); } }
		
		for (Directory dir : meta.getDirectories()) {
			
			if (dir instanceof GpsDirectory) {
				GpsDirectory gpsDir = (GpsDirectory)dir;
				GeoLocation geoLoc = gpsDir.getGeoLocation();
				
				if (geoLoc != null && !geoLoc.isZero()) {
					AbExifGPS gps = new AbExifGPS();
					
					gps.setLatRef(trimString(gpsDir, GpsDirectory.TAG_LATITUDE_REF));
					gps.setLat(rationalArray(gpsDir, GpsDirectory.TAG_LATITUDE));
					
					gps.setLngRef(trimString(gpsDir, GpsDirectory.TAG_LONGITUDE_REF));
					gps.setLng(rationalArray(gpsDir, GpsDirectory.TAG_LONGITUDE));
					
					gps.setAltRef(gpsDir.getDoubleObject(GpsDirectory.TAG_ALTITUDE_REF));
					gps.setAlt(gpsDir.getDoubleObject(GpsDirectory.TAG_ALTITUDE));
					
					exif.setGps(gps);
					
					exists = true;
				}
			}else {
				for (Tag tag : dir.getTags()) {
					int tagType = tag.getTagType();
					switch(tagType) {
					case ExifDirectoryBase.TAG_MAKE:
						exif.setMake(trimString(dir, tagType));
						exists = true;
						break;
					case ExifDirectoryBase.TAG_MODEL:
						exif.setModel(trimString(dir, tagType));
						exists = true;
						break;
					case ExifDirectoryBase.TAG_SOFTWARE:
						exif.setSoftware(trimString(dir, tagType));
						exists = true;
						break;
					case ExifDirectoryBase.TAG_DATETIME:
						date = dir.getDate(tagType);
						exif.setDatetime(format.format(date));
						exists = true;
						break;
					case ExifDirectoryBase.TAG_EXIF_IMAGE_WIDTH: // Pixel X dimension
						exif.setXdimension(dir.getInteger(tagType));
						exists = true;
						break;
					case ExifDirectoryBase.TAG_EXIF_IMAGE_HEIGHT: // Pixel Y dimension
						exif.setYdimension(dir.getInteger(tagType));
						exists = true;
						break;
					case ExifDirectoryBase.TAG_ORIENTATION:
						exif.setOrientation(dir.getInteger(tagType));
						exists = true;
						break;
					case ExifDirectoryBase.TAG_X_RESOLUTION:
						exif.setXresolution(dir.getInteger(tagType));
						exists = true;
						break;
					case ExifDirectoryBase.TAG_Y_RESOLUTION:
						exif.setYresolution(dir.getInteger(tagType));
						exists = true;
						break;
					case ExifDirectoryBase.TAG_RESOLUTION_UNIT:
						exif.setResolutionUnit(dir.getInteger(tagType));
						exists = true;
						break;
					}
				}
			}
		}
		
		return exists ? exif : null;
	}

}

/*
9월 15, 2018 7:51:57 오후 org.apache.catalina.startup.Catalina start
정보: Server startup in 7645 ms
[HTTP Session] Created, ID: 383C14471AFE673EEE3367E4540A4BD7
=====================================================
[IMAGE FILE] 1.jpg
-----------------------------------------------------
	[JPEG] Compression Type - Baseline
	[JPEG] Data Precision - 8 bits
	[JPEG] Image Height - 3024 pixels
	[JPEG] Image Width - 4032 pixels
	[JPEG] Number of Components - 3
	[JPEG] Component 1 - Y component: Quantization table 0, Sampling factors 2 horiz/1 vert
	[JPEG] Component 2 - Cb component: Quantization table 1, Sampling factors 1 horiz/1 vert
	[JPEG] Component 3 - Cr component: Quantization table 1, Sampling factors 1 horiz/1 vert
	[Exif IFD0] Make - samsung
	[Exif IFD0] Model - SM-G935S
	[Exif IFD0] Orientation - Top, left side (Horizontal / normal)
	[Exif IFD0] X Resolution - 72 dots per inch
	[Exif IFD0] Y Resolution - 72 dots per inch
	[Exif IFD0] Resolution Unit - Inch
	[Exif IFD0] Software - G935SKSU1APCF
	[Exif IFD0] Date/Time - 2016:04:08 17:29:16
	[Exif IFD0] YCbCr Positioning - Center of pixel array
	[Exif SubIFD] Exposure Time - 1/490 sec
	[Exif SubIFD] F-Number - f/1.7
	[Exif SubIFD] Exposure Program - Program normal
	[Exif SubIFD] ISO Speed Ratings - 50
	[Exif SubIFD] Exif Version - 2.20
	[Exif SubIFD] Date/Time Original - 2016:04:08 17:29:16
	[Exif SubIFD] Date/Time Digitized - 2016:04:08 17:29:16
	[Exif SubIFD] Shutter Speed Value - 1/491 sec
	[Exif SubIFD] Aperture Value - f/1.7
	[Exif SubIFD] Brightness Value - 6.29
	[Exif SubIFD] Exposure Bias Value - 0 EV
	[Exif SubIFD] Max Aperture Value - f/1.7
	[Exif SubIFD] Metering Mode - Center weighted average
	[Exif SubIFD] Flash - Flash did not fire
	[Exif SubIFD] Focal Length - 4.2 mm
	[Exif SubIFD] Makernote - [98 values]
	[Exif SubIFD] User Comment - 
	[Exif SubIFD] Sub-Sec Time - 0371
	[Exif SubIFD] Sub-Sec Time Original - 0371
	[Exif SubIFD] Sub-Sec Time Digitized - 0371
	[Exif SubIFD] FlashPix Version - 1.00
	[Exif SubIFD] Color Space - sRGB
	[Exif SubIFD] Exif Image Width - 4032 pixels
	[Exif SubIFD] Exif Image Height - 3024 pixels
	[Exif SubIFD] Exposure Mode - Auto exposure
	[Exif SubIFD] White Balance Mode - Auto white balance
	[Exif SubIFD] Focal Length 35 - 26 mm
	[Exif SubIFD] Scene Capture Type - Standard
	[Exif SubIFD] Unique Image ID - C12LSII00VM C12LSJC01GM

	[Interoperability] Interoperability Index - Recommended Exif Interoperability Rules (ExifR98)
	[Interoperability] Interoperability Version - 1.00
	[Exif Thumbnail] Image Width - 512 pixels
	[Exif Thumbnail] Image Height - 384 pixels
	[Exif Thumbnail] Compression - JPEG (old-style)
	[Exif Thumbnail] Orientation - Top, left side (Horizontal / normal)
	[Exif Thumbnail] X Resolution - 72 dots per inch
	[Exif Thumbnail] Y Resolution - 72 dots per inch
	[Exif Thumbnail] Resolution Unit - Inch
	[Exif Thumbnail] Thumbnail Offset - 988 bytes
	[Exif Thumbnail] Thumbnail Length - 22636 bytes
	[Huffman] Number of Tables - 4 Huffman tables
	[File Type] Detected File Type Name - JPEG
	[File Type] Detected File Type Long Name - Joint Photographic Experts Group
	[File Type] Detected MIME Type - image/jpeg
	[File Type] Expected File Name Extension - jpg
	[File] File Name - 1.jpg
	[File] File Size - 4851897 bytes
	[File] File Modified Date - 목 8월 25 00:15:54 +09:00 2016
=====================================================
[IMAGE FILE] 2.jpg
-----------------------------------------------------
	[JPEG] Compression Type - Baseline
	[JPEG] Data Precision - 8 bits
	[JPEG] Image Height - 2322 pixels
	[JPEG] Image Width - 4128 pixels
	[JPEG] Number of Components - 3
	[JPEG] Component 1 - Y component: Quantization table 0, Sampling factors 2 horiz/2 vert
	[JPEG] Component 2 - Cb component: Quantization table 1, Sampling factors 1 horiz/1 vert
	[JPEG] Component 3 - Cr component: Quantization table 1, Sampling factors 1 horiz/1 vert
	[Exif IFD0] Image Width - 4128 pixels
	[Exif IFD0] Image Height - 2322 pixels
	[Exif IFD0] Make - SAMSUNG
	[Exif IFD0] Model - SHV-E330S
	[Exif IFD0] Orientation - Right side, top (Rotate 90 CW)
	[Exif IFD0] X Resolution - 72 dots per inch
	[Exif IFD0] Y Resolution - 72 dots per inch
	[Exif IFD0] Resolution Unit - Inch
	[Exif IFD0] Software - E330SKSUBML2
	[Exif IFD0] Date/Time - 2014:03:03 16:38:41
	[Exif IFD0] YCbCr Positioning - Center of pixel array
	[Exif SubIFD] Exposure Time - 1/910 sec
	[Exif SubIFD] F-Number - f/2.2
	[Exif SubIFD] Exposure Program - Program normal
	[Exif SubIFD] ISO Speed Ratings - 50
	[Exif SubIFD] Exif Version - 2.20
	[Exif SubIFD] Date/Time Original - 2014:03:03 16:38:41
	[Exif SubIFD] Date/Time Digitized - 2014:03:03 16:38:41
	[Exif SubIFD] Components Configuration - YCbCr
	[Exif SubIFD] Shutter Speed Value - 1/910 sec
	[Exif SubIFD] Aperture Value - f/2.2
	[Exif SubIFD] Brightness Value - 8.07
	[Exif SubIFD] Exposure Bias Value - 0 EV
	[Exif SubIFD] Max Aperture Value - f/2.2
	[Exif SubIFD] Metering Mode - Center weighted average
	[Exif SubIFD] White Balance - Unknown
	[Exif SubIFD] Flash - Flash did not fire
	[Exif SubIFD] Focal Length - 4.1 mm
	[Exif SubIFD] User Comment - JKJK?
	[Exif SubIFD] FlashPix Version - 1.00
	[Exif SubIFD] Color Space - sRGB
	[Exif SubIFD] Exif Image Width - 4128 pixels
	[Exif SubIFD] Exif Image Height - 2322 pixels
	[Exif SubIFD] Sensing Method - One-chip color area sensor
	[Exif SubIFD] Scene Type - Directly photographed image
	[Exif SubIFD] Exposure Mode - Auto exposure
	[Exif SubIFD] White Balance Mode - Auto white balance
	[Exif SubIFD] Focal Length 35 - 31 mm
	[Exif SubIFD] Scene Capture Type - Standard
	[Exif SubIFD] Unique Image ID - D13QSGH04OA
	[Samsung Makernote] Maker Note Version - 1.00
	[Samsung Makernote] Device Type - Cell Phone
	[Samsung Makernote] Unknown tag (0x000c) - 0
	[Samsung Makernote] Unknown tag (0x0010) - 49/49226
	[Samsung Makernote] Unknown tag (0x0040) - 0
	[Samsung Makernote] Unknown tag (0x0050) - 1
	[Samsung Makernote] Face Detect - Off
	[Interoperability] Interoperability Index - Recommended Exif Interoperability Rules (ExifR98)
	[Interoperability] Interoperability Version - 1.00
	[GPS] GPS Version ID - 2.200
	[Exif Thumbnail] Image Width - 512 pixels
	[Exif Thumbnail] Image Height - 288 pixels
	[Exif Thumbnail] Compression - JPEG (old-style)
	[Exif Thumbnail] Orientation - Right side, top (Rotate 90 CW)
	[Exif Thumbnail] X Resolution - 72 dots per inch
	[Exif Thumbnail] Y Resolution - 72 dots per inch
	[Exif Thumbnail] Resolution Unit - Inch
	[Exif Thumbnail] Thumbnail Offset - 3124 bytes
	[Exif Thumbnail] Thumbnail Length - 16524 bytes
	[Huffman] Number of Tables - 4 Huffman tables
	[File Type] Detected File Type Name - JPEG
	[File Type] Detected File Type Long Name - Joint Photographic Experts Group
	[File Type] Detected MIME Type - image/jpeg
	[File Type] Expected File Name Extension - jpg
	[File] File Name - 2.jpg
	[File] File Size - 3119162 bytes
	[File] File Modified Date - 목 8월 25 00:15:40 +09:00 2016
=====================================================
[IMAGE FILE] 20180713_144147.jpg
-----------------------------------------------------
	[JPEG] Compression Type - Baseline
	[JPEG] Data Precision - 8 bits
	[JPEG] Image Height - 1960 pixels
	[JPEG] Image Width - 4032 pixels
	[JPEG] Number of Components - 3
	[JPEG] Component 1 - Y component: Quantization table 0, Sampling factors 2 horiz/2 vert
	[JPEG] Component 2 - Cb component: Quantization table 1, Sampling factors 1 horiz/1 vert
	[JPEG] Component 3 - Cr component: Quantization table 1, Sampling factors 1 horiz/1 vert
	[Exif IFD0] Make - samsung
	[Exif IFD0] Model - SM-N950N
	[Exif IFD0] Orientation - Top, left side (Horizontal / normal)
	[Exif IFD0] X Resolution - 72 dots per inch
	[Exif IFD0] Y Resolution - 72 dots per inch
	[Exif IFD0] Resolution Unit - Inch
	[Exif IFD0] Software - N950NKSU3CRD6
	[Exif IFD0] Date/Time - 2018:07:13 14:41:47
	[Exif IFD0] YCbCr Positioning - Center of pixel array
	[Exif SubIFD] Exposure Time - 1/1324 sec
	[Exif SubIFD] F-Number - f/1.7
	[Exif SubIFD] Exposure Program - Program normal
	[Exif SubIFD] ISO Speed Ratings - 40
	[Exif SubIFD] Exif Version - 2.20
	[Exif SubIFD] Date/Time Original - 2018:07:13 14:41:47
	[Exif SubIFD] Date/Time Digitized - 2018:07:13 14:41:47
	[Exif SubIFD] Components Configuration - YCbCr
	[Exif SubIFD] Shutter Speed Value - 1/1323 sec
	[Exif SubIFD] Aperture Value - f/1.7
	[Exif SubIFD] Brightness Value - 7.88
	[Exif SubIFD] Exposure Bias Value - 0 EV
	[Exif SubIFD] Max Aperture Value - f/1.7
	[Exif SubIFD] Metering Mode - Center weighted average
	[Exif SubIFD] Flash - Flash did not fire
	[Exif SubIFD] Focal Length - 4.3 mm
	[Exif SubIFD] Makernote - [98 values]
	[Exif SubIFD] User Comment - 
	[Exif SubIFD] Sub-Sec Time - 0605
	[Exif SubIFD] Sub-Sec Time Original - 0605
	[Exif SubIFD] Sub-Sec Time Digitized - 0605
	[Exif SubIFD] FlashPix Version - 1.00
	[Exif SubIFD] Color Space - sRGB
	[Exif SubIFD] Exif Image Width - 4032 pixels
	[Exif SubIFD] Exif Image Height - 1960 pixels
	[Exif SubIFD] Exposure Mode - Auto exposure
	[Exif SubIFD] White Balance Mode - Auto white balance
	[Exif SubIFD] Focal Length 35 - 26 mm
	[Exif SubIFD] Scene Capture Type - Standard
	[Exif SubIFD] Unique Image ID - G12LLKA02SM G12LLKL01GM

	[Interoperability] Interoperability Index - Recommended Exif Interoperability Rules (ExifR98)
	[Interoperability] Interoperability Version - 1.00
	[GPS] GPS Version ID - 2.200
	[GPS] GPS Latitude Ref - N
	[GPS] GPS Latitude - 37° 46' 35"
	[GPS] GPS Longitude Ref - E
	[GPS] GPS Longitude - 127° 22' 52"
	[GPS] GPS Altitude Ref - Sea level
	[GPS] GPS Altitude - 173 metres
	[GPS] GPS Time-Stamp - 05:41:39.000 UTC
	[GPS] GPS Date Stamp - 2018:07:13
	[Exif Thumbnail] Image Width - 496 pixels
	[Exif Thumbnail] Image Height - 240 pixels
	[Exif Thumbnail] Compression - JPEG (old-style)
	[Exif Thumbnail] Orientation - Top, left side (Horizontal / normal)
	[Exif Thumbnail] X Resolution - 72 dots per inch
	[Exif Thumbnail] Y Resolution - 72 dots per inch
	[Exif Thumbnail] Resolution Unit - Inch
	[Exif Thumbnail] Thumbnail Offset - 1218 bytes
	[Exif Thumbnail] Thumbnail Length - 17230 bytes
	[Huffman] Number of Tables - 4 Huffman tables
	[File Type] Detected File Type Name - JPEG
	[File Type] Detected File Type Long Name - Joint Photographic Experts Group
	[File Type] Detected MIME Type - image/jpeg
	[File Type] Expected File Name Extension - jpg
	[File] File Name - 20180713_144147.jpg
	[File] File Size - 3554916 bytes
	[File] File Modified Date - 금 9월 14 21:20:26 +09:00 2018
=====================================================
[IMAGE FILE] 3.jpg
-----------------------------------------------------
	[JPEG] Compression Type - Baseline
	[JPEG] Data Precision - 8 bits
	[JPEG] Image Height - 2304 pixels
	[JPEG] Image Width - 4096 pixels
	[JPEG] Number of Components - 3
	[JPEG] Component 1 - Y component: Quantization table 0, Sampling factors 2 horiz/2 vert
	[JPEG] Component 2 - Cb component: Quantization table 1, Sampling factors 1 horiz/1 vert
	[JPEG] Component 3 - Cr component: Quantization table 1, Sampling factors 1 horiz/1 vert
	[JFIF] Version - 1.1
	[JFIF] Resolution Units - none
	[JFIF] X Resolution - 1 dot
	[JFIF] Y Resolution - 1 dot
	[JFIF] Thumbnail Width Pixels - 0
	[JFIF] Thumbnail Height Pixels - 0
	[Exif IFD0] Image Width - 4096 pixels
	[Exif IFD0] Image Height - 2304 pixels
	[Exif IFD0] Make - SAMSUNG
	[Exif IFD0] Model - SHV-E330S
	[Exif IFD0] Orientation - Right side, top (Rotate 90 CW)
	[Exif IFD0] X Resolution - 72 dots per inch
	[Exif IFD0] Y Resolution - 72 dots per inch
	[Exif IFD0] Resolution Unit - Inch
	[Exif IFD0] Software - E330SKSUBML2
	[Exif IFD0] Date/Time - 2014:03:03 16:39:29
	[Exif IFD0] YCbCr Positioning - Center of pixel array
	[Exif SubIFD] F-Number - f/2.2
	[Exif SubIFD] Exposure Program - Program normal
	[Exif SubIFD] Exif Version - 2.20
	[Exif SubIFD] Date/Time Original - 2014:03:03 16:39:29
	[Exif SubIFD] Date/Time Digitized - 2014:03:03 16:39:29
	[Exif SubIFD] Max Aperture Value - f/2.2
	[Exif SubIFD] Metering Mode - Center weighted average
	[Exif SubIFD] Focal Length - 4.1 mm
	[Exif SubIFD] Color Space - sRGB
	[Exif SubIFD] Exif Image Width - 4096 pixels
	[Exif SubIFD] Exif Image Height - 2304 pixels
	[Exif SubIFD] Exposure Mode - Auto exposure
	[Exif SubIFD] White Balance Mode - Auto white balance
	[Exif SubIFD] Focal Length 35 - 31 mm
	[Exif SubIFD] Scene Capture Type - Standard
	[Samsung Makernote] Maker Note Version - 1.00
	[Samsung Makernote] Device Type - Cell Phone
	[Samsung Makernote] Unknown tag (0x000c) - 0
	[Samsung Makernote] Unknown tag (0x0010) - 109/98452
	[Samsung Makernote] Unknown tag (0x0040) - 0
	[Samsung Makernote] Unknown tag (0x0050) - 1
	[Samsung Makernote] Face Detect - Off
	[Huffman] Number of Tables - 4 Huffman tables
	[File Type] Detected File Type Name - JPEG
	[File Type] Detected File Type Long Name - Joint Photographic Experts Group
	[File Type] Detected MIME Type - image/jpeg
	[File Type] Expected File Name Extension - jpg
	[File] File Name - 3.jpg
	[File] File Size - 4421232 bytes
	[File] File Modified Date - 목 8월 25 00:15:40 +09:00 2016 
*/
