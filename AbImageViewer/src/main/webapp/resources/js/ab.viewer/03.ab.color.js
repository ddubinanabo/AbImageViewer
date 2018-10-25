/**
 * RGB 배열
 * @typedef {Array} RGB_Array
 * @property {Number} 0 RED (0~255)
 * @property {Number} 1 GREEN (0~255)
 * @property {Number} 2 BLUE (0~255)
 * @property {Number} [3] ALPHA (0~1)
 */

/**
 * HSV 배열
 * @typedef {Array} HSV_Array
 * @property {Number} 0 색상(Hue) 			H (0~365)
 * @property {Number} 1 채도(Saturation)	S (0~1) %
 * @property {Number} 2 명도(Value) 		V (0~1) %
 */

 /**
 * HSL 배열
 * <p>밝은 단계를 더 나눈 것.
 * @typedef {Array} HSL_Array
 * @property {Number} 0 색상(Hue) 			H (0~365)
 * @property {Number} 1 채도(Saturation)	S (0~1) %
 * @property {Number} 2 명도(Lightness) 	L (0~1) %
 */

/**
 * RGB 객체
 * @typedef {Object} RGB_Object
 * @property {Number} r RED (0~255)
 * @property {Number} g GREEN (0~255)
 * @property {Number} b BLUE (0~255)
 * @property {Number} [a] ALPHA (0~1)
 */

/**
 * HSV 객체
 * @typedef {Object} HSV_Object
 * @property {Number} h 색상(Hue) 			H (0~365)
 * @property {Number} s 채도(Saturation)	S (0~1) %
 * @property {Number} v 명도(Value) 		V (0~1) %
 */

 /**
 * HSL 객체
 * <p>밝은 단계를 더 나눈 것.
 * @typedef {Object} HSL_Object
 * @property {Number} h 색상(Hue) 			H (0~365)
 * @property {Number} s 채도(Saturation)	S (0~1) %
 * @property {Number} l 명도(Lightness) 	L (0~1) %
 */


/**
 * 색상 변환 지원
 * @namespace
 */
var AbColor = {

	/**
	 * HSV의 최대값
	 * @private
	 * @type {Number}
	 * @memberof AbColor
	 */
	HSV_MAX: 255,

	/**
	 * RGB를 HSV로 변환햡니다.
	 * @memberof AbColor
	 * @param {Number} r RED
	 * @param {Number} g GREEN
	 * @param {Number} b BLUE
	 * @return {HSV_Array} HSV 배열
	 */
	rgb2hsv: function (r, g, b){
		if (r<0) r=0; if (g<0) g=0; if (b<0) b=0;
		if (r>255) r=255; if (g>255) g=255; if (b>255) b=255;

		r/=255; g/=255; b/=255;

		var M = Math.max(r,g,b);
		var m = Math.min(r,g,b);
		var C = M-m;

		if( C==0 ) h=0;
		else if( M==r ) h=((g-b)/C)%6;
		else if( M==g ) h=(b-r)/C+2;
		else h=(r-g)/C+4;
		
		h*=60;
		if( h<0 ) h+=360;
		
		v = M;
		if( v==0 ) s = 0;
		else s = C/v;
		
		return [h, s, v];
	},

	/**
	 * HSV를 RGB로 변환햡니다.
	 * @memberof AbColor
	 * @param {Number} h 색상(Hue) 			H (0~365)
	 * @param {Number} s 채도(Saturation)	S (0~1) %
	 * @param {Number} v 명도(Value) 		V (0~1) %
	 * @return {RGB_Array} RGB 배열
	 */
	hsv2rgb: function (h,s,v){
		if( h<0 ) h=0; if( s<0 ) s=0; if( v<0 ) v=0;
		if( h>=360 ) h=359;

		if( s>1 ) s=1; if( v>1 ) v=1;

		var C = v*s;
		var hh = h/60;
		var X = C*(1-Math.abs(hh%2-1));
		r = g = b = 0;

		if( hh>=0 && hh<1 ){ r = C; g = X; }
		else if( hh>=1 && hh<2 ){ r = X; g = C; }
		else if( hh>=2 && hh<3 ){ g = C; b = X; }
		else if( hh>=3 && hh<4 ){ g = X; b = C; }
		else if( hh>=4 && hh<5 ){ r = X; b = C; }
		else{ r = C; b = X; }

		var m = v-C;
		
		r += m; g += m; b += m;
		r *= 255; g *= 255; b *= 255;
		r = Math.round(r); g = Math.round(g); b = Math.round(b);

		return [r, g, b];
	},

	/**
	 * RGB를 HSL로 변환햡니다.
	 * @memberof AbColor
	 * @param {Number} r RED
	 * @param {Number} g GREEN
	 * @param {Number} b BLUE
	 * @return {HSL_Array} HSL 배열
	 */
	rgb2hsl: function (r, g, b){
		if (r<0) r=0; if (g<0) g=0; if (b<0) b=0;
		if (r>255) r=255; if (g>255) g=255; if (b>255) b=255;
		
		r /= 255;
		g /= 255;
		b /= 255;

		var cmax = Math.max(r, g, b);
		var cmin = Math.min(r, g, b);
		var delta = cmax - cmin;
		var h = 0, s = 0, l = (cmax + cmin) / 2;
		var X = (1 - Math.abs(2 * l - 1));

		if (delta) {
			if (cmax === r ) { h = ((g - b) / delta); }
			if (cmax === g ) { h = 2 + (b - r) / delta; }
			if (cmax === b ) { h = 4 + (r - g) / delta; }
			if (cmax) s = delta / X;
		}

		h = 60 * h | 0;
		if (h < 0) h += 360;

		return [h, s, l];
	},

	/**
	 * HSL을 RGB로 변환햡니다.
	 * @memberof AbColor
	 * @param {Number} h 색상(Hue) 			H (0~365)
	 * @param {Number} s 채도(Saturation) 	S (0~1) %
	 * @param {Number} l 명도(Lightness) 	L (0~1) %
	 * @return {RGB_Array} RGB 배열
	 */
	hsl2rgb: function (h, s, l){
		var C = s * (1 - Math.abs(2 * l - 1));
		var H = h / 60;
		var X = C * (1 - Math.abs(H % 2 - 1));
		var m = l - C/2;
		var precision = 255;

		C = (C + m) * precision | 0;
		X = (X + m) * precision | 0;
		m = m * precision | 0;

		if (H >= 0 && H < 1) {	return [C, X, m]; }
		if (H >= 1 && H < 2) {	return [X, C, m]; }
		if (H >= 2 && H < 3) {	return [m, C, X]; }
		if (H >= 3 && H < 4) {	return [m, X, C]; }
		if (H >= 4 && H < 5) {	return [X, m, C]; }
		if (H >= 5 && H < 6) {	return [C, m, X]; }
		return [0, 0, 0];
	}
};