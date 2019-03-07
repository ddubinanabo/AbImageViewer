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
 * PDF 문서 렌더링 후 호출되는 콜백함수
 * @callback AbVendor.PDFCallback
 * @param {PDFDocumentProxy} doc PDF 문서 객체<p>* PDF.js API 문서 {@link https://mozilla.github.io/pdf.js/api/draft/PDFDocumentProxy.html|PDFDocumentProxy} 참고
 * @param {Array.<AbVendor.PDFPageInfo>} pages PDF 문서 페이지 정보 배열
 */

/**
 * PDF 문서 페이지 정보
 * @typedef {Object} AbVendor.PDFPageInfo
 * @property {CanvasRenderingContext2D} ctx 페이지가 그려진 CANVAS 2D Context
 * @property {PDFPageProxy} page PDF 페이지 객체<p>* PDF.js API 문서 {@link https://mozilla.github.io/pdf.js/api/draft/PDFPageProxy.html|PDFPageProxy} 참고
 * @property {Number} width 페이지의 폭 크기
 * @property {Number} height 페이지의 높이 크기
 * @property {String} image 페이지 이미지의 DATA URL 형식 문자열
 * @property {String} thumbnail 섬네일 이미지의 DATA URL 형식 문자열
 */

/**
 * TIFF 이미지 디코더 정보
 * @typedef {Object} AbVendor.TiffDecoder
 * @property {ArrayBuffer} buffer TIFF 이미지 바이너리 배열
 * @property {Array} map TIFF IFDS 정보
 * @property {Number} numImages 이미지 개수
 * @property {AbVendor.TiffDecoder_Decode} decode 이미지 디코드 함수
 */

/**
 * TIFF 이미지 디코더 정보
 * @callback AbVendor.TiffDecoder_Decode
 * @param {Number} index 이미지 인덱스
 * @return {AbVendor.TiffDecoder_DecodeResult}
 */

/**
 * TIFF 이미지 디코더 정보
 * @typedef {Object} AbVendor.TiffDecoder_DecodeResult
 * @property {Number} index 이미지 인덱스
 * @property {Number} width TIFF IFDS 정보
 * @property {Number} height 이미지 개수
 * @property {TypedArray} rgba RGBA 이미지 배열 (Uint8Array)
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

	/**
	 * PDF 문서를 렌더링 합니다.
	 * <p>* PDF.js가 필요합니다.
	 * @memberof AbVendor
	 * @see {@link https://mozilla.github.io/pdf.js/|PDF.js} PDF Reader in JavaScript
	 * @see {@link https://mozilla.github.io/pdf.js/api/draft/index.html|PDF.js API}
	 * @param {String} blob PDF 파일 URI
	 * @param {String} render 렌더링 힌트 (jpeg|png)
	 * @param {AbVendor.PDFCallback} callback 렌더링 후 호출되는 콜백 함수
	 */
	pdf: function (blob, render, callback){
		if (!render) render = 'jpeg';
		if (!AbCommon.isFunction(callback)) callback = function(){};

		var task = pdfjsLib.getDocument(blob);
		task.promise
			.then(function(pdf){
				//console.log(pdf);

				var pdfData = {
					doc: pdf,
					pages: [],
				};

				var ps = [];				
				for (var i=0; i < pdf.numPages; i++){
					ps.push(pdf.getPage(i + 1));
				}

				var numPages = pdf.numPages;

				Promise.all(ps)
					.then(function(pages){
						//console.log(pages);

						var ps = [];
						for (var i=0; i < numPages; i++){
							var page = pages[i];

							var viewport = page.getViewport(1);
							var ctx = AbGraphics.canvas.createContext(viewport.width, viewport.height);

							pdfData.pages[i] = {
								ctx: ctx,
								page: page,
								width: viewport.width,
								height: viewport.height,
								image: null,
								thumbnail: null,
							};

							ps.push(page.render({
								canvasContext: ctx,
								viewport: viewport,
							}));
						}

						// render all
						Promise.all(ps)
							.then(function(){
								var ps = [];
								for (var i=0; i < numPages; i++){
									var p = pdfData.pages[i];

									var gen = new AbThumbnailGenerator({
										width: p.width,
										height: p.height,
									});

									gen.draw(p.ctx.canvas);

									p.thumbnail = gen.toImage(render);
									p.image = AbGraphics.canvas.toImage(p.ctx, render);

									//ps.push(AbCommon.loadImage(p.uri));
								}

								callback(pdfData);

								// Promise.all(ps)
								// 	.then(function(){
								// 		callback(pdfData);
								// 	})
								// 	.catch(function(e){
								// 		callback(e);
								// 	});

								//callback(pdfData);
							})
							.catch(function(e){
								callback(e);
							});
					})
					.catch(function(e){
						callback(e);
					});

				// 
				// 


				
			}, function (reason) {
				// PDF loading error
				//console.error(reason);

				if (AbCommon.isString(reason))
					throw new Error(reason);
				else
					throw reason;
			})
			.catch(function(e){
				callback(e);
			});
	},

	/**
	 * TIFF 이미지를 렌더링합니다.
	 * <p>* UTIF.js가 필요합니다.
	 * @memberof AbVendor
	 * @see {@link https://github.com/photopea/UTIF.js} Fast and advanced TIFF decoder
	 * @param {ArrayBuffer} arrayBuffer TIFF 이미지 바이너리 배열
	 * @return {AbVendor.TiffDecoder} 이미지 디코더
	 */
	tiff: function(arrayBuffer){
		var ifds = UTIF.decode(arrayBuffer);

		//console.log(ifds);

		return {
			buffer: arrayBuffer,
			map: ifds,

			numImages: ifds && $.isArray(ifds) ? ifds.length : 0,

			decode: function(index){
				var mapPage = this.map[index];

				UTIF.decodeImage(this.buffer, mapPage, this.map);

				var rgba = UTIF.toRGBA8(mapPage);

				return {
					index: index,
					width: mapPage.width,
					height: mapPage.height,
					rgba: rgba,
				};
			},
		};
	},
};
