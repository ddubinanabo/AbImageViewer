/**
 * 이미지의 EXIF 정보
 * @typedef {Object} EXIF_OriginObject
 * @example
 * {
 * 	"Make": "Apple",
 * 	"Model": "iPhone 7 Plus",
 * 	"Orientation": 6,
 * 	"XResolution": 72,
 * 	"YResolution": 72,
 * 	"ResolutionUnit": 2,
 * 	"Software": "12.0.1",
 * 	"DateTime": "2018:10:17 00:08:00",
 * 	"YCbCrPositioning": 1,
 * 	"ExifIFDPointer": 210,
 * 	"GPSInfoIFDPointer": 1816,
 * 	"ExposureTime": 0.16666666666666666,
 * 	"FNumber": 1.8,
 * 	"ExposureProgram": "Normal program",
 * 	"ISOSpeedRatings": 100,
 * 	"ExifVersion": "0221",
 * 	"DateTimeOriginal": "2018:10:17 00:08:00",
 * 	"DateTimeDigitized": "2018:10:17 00:08:00",
 * 	"ComponentsConfiguration": "YCbCr",
 * 	"ShutterSpeedValue": 2.5849942421826557,
 * 	"ApertureValue": 1.6959938128383605,
 * 	"BrightnessValue": -0.44100524222228077,
 * 	"ExposureBias": 0,
 * 	"MeteringMode": "Spot",
 * 	"Flash": "Flash did not fire, compulsory flash mode",
 * 	"FocalLength": 3.99,
 * 	"SubjectArea": [
 * 		2496,
 * 		1333,
 * 		753,
 * 		756
 * 	],
 * 	"MakerNote": [
 * 		65,
 * 		112,
 * 		112,
 * 		:
 * 		:
 * 	],
 * 	"SubsecTimeOriginal": "611",
 * 	"SubsecTimeDigitized": "611",
 * 	"FlashpixVersion": "0100",
 * 	"ColorSpace": 65535,
 * 	"PixelXDimension": 4032,
 * 	"PixelYDimension": 3024,
 * 	"SensingMethod": "One-chip color area sensor",
 * 	"SceneType": "Directly photographed",
 * 	"ExposureMode": 0,
 * 	"WhiteBalance": "Auto white balance",
 * 	"FocalLengthIn35mmFilm": 28,
 * 	"SceneCaptureType": "Standard",
 * 	"undefined": 65,
 * 	"GPSLatitudeRef": "N",
 * 	"GPSLatitude": [
 * 		36,
 * 		48,
 * 		9.4
 * 	],
 * 	"GPSLongitudeRef": "E",
 * 	"GPSLongitude": [
 * 		127,
 * 		6,
 * 		19.66
 * 	],
 * 	"GPSAltitudeRef": 0,
 * 	"GPSAltitude": 41.8062744140625,
 * 	"GPSTimeStamp": [
 * 		15,
 * 		7,
 * 		57
 * 	],
 * 	"GPSSpeedRef": "K",
 * 	"GPSSpeed": 0,
 * 	"GPSImgDirectionRef": "T",
 * 	"GPSImgDirection": 233.56303418803418,
 * 	"GPSDestBearingRef": "T",
 * 	"GPSDestBearing": 233.56303418803418,
 * 	"GPSDateStamp": "2018:10:16",
 * 	"thumbnail": {
 * 		"Compression": 6,
 * 		"XResolution": 72,
 * 		"YResolution": 72,
 * 		"ResolutionUnit": 2,
 * 		"JpegIFOffset": 2220,
 * 		"JpegIFByteCount": 7484,
 * 		"blob": {}
 * 	}
 * }
 */

/**
 * EXIF GPS 위치 DMS 정보
 * @typedef {Array} EXIF_GPS_DMS_OriginObject
 * @property {(String|Number)} 0 도(D), 숫자/숫자 또는 숫자
 * @property {(String|Number)} 1 분(M), 숫자/숫자 또는 숫자
 * @property {(String|Number)} 2 초(S), 숫자/숫자 또는 숫자
 */

/**
 * EXIF 데이터 콜백
 * @see {@link https://github.com/exif-js/exif-js} JavaScript library for reading EXIF image metadata
 * @callback AbVendor.EXIFCallback
 * @param {EXIF_OriginObject} data
 * @param {EXIF} exif EXIF 추출 객체
 */

/**
 * SVG 렌더링 후 호출되는 콜백함수
 * @callback AbVendor.SVGRenderCallback
 * @param {CanvasRenderingContext2D} ctx CANVAS 2D Context
 * @param {XMLDocument} dom SVG XML Document
 */

/**
 * 외부 라이브러리 링커
 * @namespace
 */
var AbVendor = {

	/**
	 * BLOB 데이터를 다운로드합니다.
	 * <p>* 이미지, 주석/마스킹 다운로드에 사용됩니다.
	 * <p>* FileSaver.js 라이브러리가 필요합니다.
	 * @see {@link https://github.com/eligrey/FileSaver.js/} An HTML5 saveAs() FileSaver implementation
	 * @memberof AbVendor
	 * @param {blob} blob BLOB 데이터
	 * @param {String} filename 파일명 
	 */
	save: function(blob, filename){
		saveAs(blob, filename);
	},

	//-----------------------------------------------------------

	/**
	 * 이미지에서 EXIF 정보를 추출합니다.
	 * @memberof AbVendor
	 * @see {@link https://github.com/exif-js/exif-js} JavaScript library for reading EXIF image metadata
	 * @param {String} type src의 타입(image|file|blob|filereader)
	 * @param {String} src 데이터 객체
	 * @param {AbVendor.EXIFCallback} callback 추출 완료 시 호출되는 콜백 함수
	 */
	exif: function(type, src, callback){
		if (type === 'image' || type === 'file' || type === 'blob' || type === 'filereader'){
			EXIF.getData(src, function(){
				var metaData = EXIF.getAllTags(this);
				callback(metaData, this);
			});
		}else{
			throw new Error('[EXIF] Not support data');
		}
	},
	
	// canvg.js 라이브러리가 필요합니다.
	// - https://github.com/canvg/canvg.git
	// - StackBlur.js, rgbcolor.js가 필요합니다.

	/**
	 * SVG 이미지를 렌더링합니다.
	 * <p>* canvg.js, StackBlur.js, rgbcolor.js가 필요합니다.
	 * @memberof AbVendor
	 * @see {@link https://github.com/canvg/canvg.git} Javascript SVG parser and renderer on Canvas
	 * @see {@link http://www.phpied.com/rgb-color-parser-in-javascript/} RGB color parser in JavaScript
	 * @see {@link https://github.com/flozz/StackBlur} StackBlur.js - Fast and almost Gaussian blur
	 * @param {String} svg SVG 이미지 정의 XML 문자열
	 * @param {Number} width 렌더링 폭
	 * @param {Number} height 렌더링 높이
	 * @param {AbVendor.SVGRenderCallback} callback 렌더링 후 호출되는 콜백 함수
	 */
	renderSVG: function(svg, width, height, callback){
		var ctx = AbGraphics.canvas.createContext(width, height);
		
		canvg(ctx.canvas, svg, {
			log: true,
			renderCallback: function (dom){
				callback(ctx, dom);
			},
		});
	},

};
