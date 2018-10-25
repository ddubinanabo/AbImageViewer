/**
 * 정제된 EXIF 정보
 * <p>* {@link EXIF_OriginObject} 정보에서 필요한 부분만 추출, 변환한 정보
 * @see {@link EXIF_OriginObject} 이미지의 EXIF 정보
 * @typedef {Object} EXIF_Object
 * @property {String} maker 제조사 (exif의 Make 태그)
 * @property {String} model 모델 (exif의 Model 태그)
 * @property {String} software 소프트웨어 (exif의 Software 태그)
 * @property {String} datetime 촬영 일시(YMDHIS) (exif의 DateTime 태그)
 * @property {Number} orientation 사진방향 (exif의 Orientation 태그)
 * @property {Number} xresolution 가로 해상도 (exif의 Xresolution 태그)
 * @property {Number} yresolution 세로 해상도 (exif의 YResolution 태그)
 * @property {Number} resolutionUnit 해상도 단위 (2=INCH, 3=CM) (exif의 ResolutionUnit 태그)
 * @property {Number} xdimension PIXEL X (exif의 PixelXDimension 태그)
 * @property {Number} ydimension PIXEL Y (exif의 PixelYDimension 태그)
 * @property {EXIF_GPS_Object} [gps] 정제된 EXIF GPS 정보
 * 
 * @example <caption>EXIF 정보</caption>
 * {
 * 	"make": "samsung",
 * 	"model": "SM-N950N",
 * 	"software": "N950NKSU3CRD6",
 * 	"datetime": "20180713234147",
 * 	"orientation": 1,
 * 	"xresolution": 72,
 * 	"yresolution": 72,
 * 	"resolutionUnit": 2,
 * 	"xdimension": 4032,
 * 	"ydimension": 1960,
 * 	"gps": {
 * 		"latRef": "N",
 * 		"lat": [
 * 			37.0,
 * 			46.0,
 * 			35.0
 * 		],
 * 		"lngRef": "E",
 * 		"lng": [
 * 			127.0,
 * 			22.0,
 * 			52.0
 * 		],
 * 		"altRef": 0.0,
 * 		"alt": 173.0
 * 	}
 * }
 * 
 * @example <caption>Orientation 참고</caption>
 * switch (orientation) {
 *   case 2:
 *     // horizontal flip
 *     ctx.translate(width, 0)
 *     ctx.scale(-1, 1)
 *     break
 *   case 3:
 *     // 180° rotate left
 *     ctx.translate(width, height)
 *     ctx.rotate(Math.PI)
 *     break
 *   case 4:
 *     // vertical flip
 *     ctx.translate(0, height)
 *     ctx.scale(1, -1)
 *     break
 *   case 5:
 *     // vertical flip + 90 rotate right
 *     ctx.rotate(0.5 * Math.PI)
 *     ctx.scale(1, -1)
 *     break
 *   case 6:
 *     // 90° rotate right
 *     ctx.rotate(0.5 * Math.PI)
 *     ctx.translate(0, -height)
 *     break
 *   case 7:
 *     // horizontal flip + 90 rotate right
 *     ctx.rotate(0.5 * Math.PI)
 *     ctx.translate(width, -height)
 *     ctx.scale(-1, 1)
 *     break
 *   case 8:
 *     // 90° rotate left
 *     ctx.rotate(-0.5 * Math.PI)
 *     ctx.translate(-width, 0)
 *     break
 * }
 */


 /**
 * 정제된 EXIF GPS 정보
 * @typedef {Object} EXIF_GPS_Object
 * @property {String} latRef 위도 참고, 북위(N)/남위(S)
 * @property {EXIF_GPS_DMS_Object} lat 위도 도분초
 * @property {String} lngRef 경도 참고, 동경(E)/서경(W)
 * @property {EXIF_GPS_DMS_Object} lng 경도 도분초
 * @property {Number} altRef 표고기준점을 참고한 고도(해수면 기준), 1이면 해발, 해수면 아래
 * @property {Number} alt 고도 (단위: 미터)
 */

 /**
 * 위치 도분초
 * @typedef {Array} EXIF_GPS_DMS_Object
 * @property {Number} 0 도
 * @property {Number} 1 분
 * @property {Number} 2 초
 */


/**
 * EXIF 정보 리드 툴
 * <p>이미지에서 정제된 EXIF 정보를 읽어 옵니다.
 * @namespace
 */
var AbExifMetaReader = {
	/**
	 * 이미지에서 정제된 EXIF 정보를 읽어 옵니다.
	 * @memberof AbExifMetaReader
	 * @param {EXIF_OriginObject} meta EXIF 데이터 맵
	 * @return {EXIF_Object} EXIF 정보
	 */
	read: function (meta){
		if (!meta)
			return null;
		
		var cnt = 0;
		for (var p in meta)
			if (meta.hasOwnProperty(p))
				cnt++;
		
		if (!cnt)
			return null;
		
		var gps = null;
		
		if (meta['GPSLatitude'] &&
			meta['GPSLongitude']){
			
			var gpsMeta = {
				versionID: meta['GPSVersionID'],
				
				latitudeRef: meta['GPSLatitudeRef'],
				latitude: meta['GPSLatitude'],
				longitudeRef: meta['GPSLongitudeRef'],
				longitude: meta['GPSLongitude'],
				
				altitudeRef: meta['GPSAltitudeRef'],
				altitude: meta['GPSAltitude'],
				
				//timeStamp: meta['GPSTimeStamp'],
				//dateStamp: meta['GPSDateStamp'],
			};
			
			var lat = this.dmsNumberArray(gpsMeta.latitude);
			var lng = this.dmsNumberArray(gpsMeta.longitude);
			var alt = this.gpsValue(gpsMeta.altitude);
			
			var gpsData = {
				latRef: gpsMeta.latitudeRef,
				lat: lat,
				lngRef: gpsMeta.longitudeRef,
				lng: lng,
				altRef: gpsMeta.altitudeRef,
				alt: alt,
			};
			
			var cnt = 0;
			for (var p in gpsData){
				if (gpsData.hasOwnProperty(p) && gpsData[p]){
					if (gpsData[p])
						cnt++;
				}
			}
			
			if (cnt > 0)
				gps = gpsData;
		}
		
		var data = {
			make: meta['Make'],
			model: meta['Model'],
			software: meta['Software'],
			datetime: this.ymdhis(meta['DateTime']),
			
			orientation: this.value(meta['Orientation']),
			
			xresolution: this.value(meta['XResolution']),
			yresolution: this.value(meta['YResolution']),
			resolutionUnit: this.value(meta['ResolutionUnit']),
			
			xdimension: this.value(meta['PixelXDimension']),
			ydimension: this.value(meta['PixelYDimension']),
			
			gps: gps
		};
		
		var cnt = 0;
		for (var p in data){
			if (data.hasOwnProperty(p)){
				if (data[p])
					cnt++;
			}
		}
		
		if (cnt > 0)
			return data;
		
		return null;
	},
	
	/**
	 * Y:M:D H:I:S 형식을 YMDHIS로 변환합니다.
	 * @memberof AbExifMetaReader
	 * @param {String} value Y:M:D H:I:S 형식 날짜
	 * @return {String} YMDHIS 날짜형식
	 */
	ymdhis: function (value){
		if (value) return value.replace(/[\-\s:]/g, '');
		return value;
	},
	
	/**
	 * GPS 위치 DMS를 단위를 붙인 문자열로 변환합니다.
	 * @memberof AbExifMetaReader
	 * @param {EXIF_GPS_DMS_Object} value 위치 DMS
	 * @return {String} 형식화된 위치 정보(127° 28' 35")
	 */
	gpsText: function (value){
		if (!value || !$.isArray(value))
			return 0;
		
		var d = this.gpsValue(value[0]); // 도
		var m = this.gpsValue(value[1]); // 분
		var s = this.gpsValue(value[2]); // 초
		
		return d + '° ' + m + '\' ' + s + '"';
	},
	
	/**
	 * 이미지 EXIF GPS 위치 정보를 Number Array로 변환합니다.
	 * @memberof AbExifMetaReader
	 * @param {EXIF_GPS_DMS_OriginObject} dms 위치 DMS
	 * @return {EXIF_GPS_DMS_Object} 위치 DMS
	 */
	dmsNumberArray: function (dms){
		return [ this.gpsValue(dms[0]), this.gpsValue(dms[1]), this.gpsValue(dms[2]) ];
	},
	
	/**
	 * DMS 정보를 DEGREE 정보로 변환합니다.
	 * @memberof AbExifMetaReader
	 * @param {(EXIF_GPS_DMS_OriginObject|EXIF_GPS_DMS_Object)} value 
	 * @return {Number} 위치 DEGREE
	 */
	dms2degree: function (value){
		if (!value || !$.isArray(value))
			return 0;
		
		var d = this.gpsValue(value[0]); // 도
		var m = this.gpsValue(value[1]); // 분
		var s = this.gpsValue(value[2]); // 초
		
		return d + (m / 60) + (s / 3600);
	},
	
	/**
	 * @memberof AbExifMetaReader
	 * @private
	 * @param {Number} value 
	 */
	toInt: function (value){
		var a = value * 100000;
		var b = Math.round(a);
		var c = b / 100000;
		
		return c;
	},
	
	/**
	 * 위치 정보 DEGREE를 DMS로 변환합니다.
	 * @memberof AbExifMetaReader
	 * @param {Number} value 위치 DEGREE
	 * @return {EXIF_GPS_DMS_Object} 위치 DMS
	 */
	degree2dms: function (value){
		var d = parseInt(value);
		var mo = (value - d) * 60;
		var m = parseInt(mo);
		var s = (mo - m) * 60;
		
		return [d, this.toInt(m), this.toInt(s)];
	},

	/**
	 * EXIF Rational 타입을 Number 타입을 변환합니다.
	 * @memberof AbExifMetaReader
	 * @param {(String|Number)} value 
	 * @return {Number}
	 */
	gpsValue: function(value){
		if (typeof value === 'undefined' || value == null)
			return 0;
		
		if (AbCommon.isString(value)){
			var a = value.split('/');
			
			if (a.length > 1)
				value = parseFloat(a[0]) / parseFloat(a[1]);
			else
				value = parseFloat(a[0]);
		}else if (value instanceof Number)
			value = parseFloat(value);
		
		return value;
	},
	
	/**
	 * Number 객체인 경우 float로 변환합니다.
	 * @memberof AbExifMetaReader
	 * @private
	 */
	value: function(value){
		if (value instanceof Number)
			value = parseFloat(value);
		
		return value;
	},
	
};
