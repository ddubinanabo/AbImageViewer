/**
 * Easing 함수
 * @typedef {Function} Easing_Function
 * @param {Number} t Specifies time.
 * @param {Number} b Specifies the initial position of a component.
 * @param {Number} c Specifies the total change in position of the component.
 * @param {Number} d Specifies the duration of the effect, in milliseconds.
 */

/**
 * Easing 정의
 * <p>see <a href="http://gizma.com/easing/">Easing Equations by Robert Penner</a>
 * @see {@link https://easings.net/ko} Easing Functions 치트시트
 * @namespace
 */
var Easing = {

	/**
	 * easing 함수를 조회합니다.
	 * @static
	 * @param {String} s Easing 함수명
	 * @return {Easing_Function} Easing 함수
	 * @memberof Easing
	 */
	get : function (s){ return typeof s == 'string' ? (s == 'get' || s == 'gsap' || s == 'has' ? null : this[s]) : s; },
	/**
	 * @private
	 * @param {String} s 
	 * @memberof Easing
	 */
	has : function (s) { return this[s] != null && typeof this[s] == 'function'; },
	/**
	 * @private
	 * @param {Array} segments 
	 * @memberof Easing
	 */
	gsap : function (segments){ return function (time, start, change, duration){ var factor = time / duration, qty = segments.length, i = Math.floor(qty * factor), t, s; t = (factor - (i * (1 / qty))) * qty; s = segments[i]; return start + change * (s.s + t * (2 * (1 - t) * (s.cp - s.s) + t * (s.e - s.s))); }; },


	//---------------------------------------------------------------
	// Linear

	/**
	 * Linear
	 * @param {Number} t Specifies time.
	 * @param {Number} b Specifies the initial position of a component.
	 * @param {Number} c Specifies the total change in position of the component.
	 * @param {Number} d Specifies the duration of the effect, in milliseconds.
	 * @memberof Easing
	 */
	linear : function (t, b, c, d){ return c * t / d + b; },

	//---------------------------------------------------------------
	// Customs by wansibi

	/**
	 * swing
	 * @param {Number} t Specifies time.
	 * @param {Number} b Specifies the initial position of a component.
	 * @param {Number} c Specifies the total change in position of the component.
	 * @param {Number} d Specifies the duration of the effect, in milliseconds.
	 * @memberof Easing
	 */
	swing : function (t, b, c, d){ var ts=(t/=d)*t; var tc=ts*t; return b+c*(2.2025*tc*ts + -5.6525*ts*ts + 3.2*tc + ts + 0.25*t); },
	/**
	 * Rolling
	 * @param {Number} t Specifies time.
	 * @param {Number} b Specifies the initial position of a component.
	 * @param {Number} c Specifies the total change in position of the component.
	 * @param {Number} d Specifies the duration of the effect, in milliseconds.
	 * @memberof Easing
	 */
	rolling : function (t, b, c, d){ var ts=(t/=d)*t; var tc=ts*t; return b+c*(1.0475*tc*ts + -4.9425*ts*ts + 7.395*tc + -5.7*ts + 3.2*t); },

	//---------------------------------------------------------------
	// Quadratic

	/**
	 * Quadratic easing in
	 * @param {Number} t Specifies time.
	 * @param {Number} b Specifies the initial position of a component.
	 * @param {Number} c Specifies the total change in position of the component.
	 * @param {Number} d Specifies the duration of the effect, in milliseconds.
	 * @memberof Easing
	 */
	easeInQuad : function (t, b, c, d){ return c * (t /= d) * t + b; },
	/**
	 * Quadratic easing out
	 * @param {Number} t Specifies time.
	 * @param {Number} b Specifies the initial position of a component.
	 * @param {Number} c Specifies the total change in position of the component.
	 * @param {Number} d Specifies the duration of the effect, in milliseconds.
	 * @memberof Easing
	 */
	easeOutQuad : function (t, b, c, d){ return -c * (t /= d) * (t - 2) + b; },
	/**
	 * Quadratic easing in and out
	 * @param {Number} t Specifies time.
	 * @param {Number} b Specifies the initial position of a component.
	 * @param {Number} c Specifies the total change in position of the component.
	 * @param {Number} d Specifies the duration of the effect, in milliseconds.
	 * @memberof Easing
	 */
	easeInOutQuad : function (t, b, c, d){ if ((t /= d / 2) < 1) return c / 2 * t * t + b; return -c / 2 * ((--t) * (t - 2) - 1) + b; },

	//---------------------------------------------------------------
	// Cubic

	/**
	 * Cubic easing in
	 * @param {Number} t Specifies time.
	 * @param {Number} b Specifies the initial position of a component.
	 * @param {Number} c Specifies the total change in position of the component.
	 * @param {Number} d Specifies the duration of the effect, in milliseconds.
	 * @memberof Easing
	 */
	easeInCubic : function (t, b, c, d){ return c * (t /= d) * t * t + b; },
	/**
	 * Cubic easing out
	 * @param {Number} t Specifies time.
	 * @param {Number} b Specifies the initial position of a component.
	 * @param {Number} c Specifies the total change in position of the component.
	 * @param {Number} d Specifies the duration of the effect, in milliseconds.
	 * @memberof Easing
	 */
	easeOutCubic : function (t, b, c, d){ return c * ((t = t / d - 1) * t * t + 1) + b; },
	/**
	 * Cubic easing in and out
	 * @param {Number} t Specifies time.
	 * @param {Number} b Specifies the initial position of a component.
	 * @param {Number} c Specifies the total change in position of the component.
	 * @param {Number} d Specifies the duration of the effect, in milliseconds.
	 * @memberof Easing
	 */
	easeInOutCubic : function (t, b, c, d){ if ((t /= d / 2) < 1) return c / 2 * t * t * t + b; return c / 2 * ((t -= 2) * t * t + 2) + b; },	

	//---------------------------------------------------------------
	// Quartic

	/**
	 * Quartic easing in
	 * @param {Number} t Specifies time.
	 * @param {Number} b Specifies the initial position of a component.
	 * @param {Number} c Specifies the total change in position of the component.
	 * @param {Number} d Specifies the duration of the effect, in milliseconds.
	 * @memberof Easing
	 */
	easeInQuart : function (t, b, c, d){ return c * (t /= d) * t * t * t + b; },
	/**
	 * Quartic easing out
	 * @param {Number} t Specifies time.
	 * @param {Number} b Specifies the initial position of a component.
	 * @param {Number} c Specifies the total change in position of the component.
	 * @param {Number} d Specifies the duration of the effect, in milliseconds.
	 * @memberof Easing
	 */
	easeOutQuart : function (t, b, c, d){ return -c * ((t = t / d - 1) * t * t * t - 1) + b; },
	/**
	 * Quartic easing in and out
	 * @param {Number} t Specifies time.
	 * @param {Number} b Specifies the initial position of a component.
	 * @param {Number} c Specifies the total change in position of the component.
	 * @param {Number} d Specifies the duration of the effect, in milliseconds.
	 * @memberof Easing
	 */
	easeInOutQuart : function (t, b, c, d){ if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b; return -c / 2 * ((t -= 2) * t * t * t - 2) + b; },	

	//---------------------------------------------------------------
	// Quint

	/**
	 * Quint easing in
	 * @param {Number} t Specifies time.
	 * @param {Number} b Specifies the initial position of a component.
	 * @param {Number} c Specifies the total change in position of the component.
	 * @param {Number} d Specifies the duration of the effect, in milliseconds.
	 * @memberof Easing
	 */
	easeInQuint : function (t, b, c, d){ return c * (t /= d) * t * t * t * t + b; },
	/**
	 * Quint easing out
	 * @param {Number} t Specifies time.
	 * @param {Number} b Specifies the initial position of a component.
	 * @param {Number} c Specifies the total change in position of the component.
	 * @param {Number} d Specifies the duration of the effect, in milliseconds.
	 * @memberof Easing
	 */
	easeOutQuint : function (t, b, c, d){ return c * ((t = t / d - 1) * t * t * t * t + 1) + b; },
	/**
	 * Quint easing in and out
	 * @param {Number} t Specifies time.
	 * @param {Number} b Specifies the initial position of a component.
	 * @param {Number} c Specifies the total change in position of the component.
	 * @param {Number} d Specifies the duration of the effect, in milliseconds.
	 * @memberof Easing
	 */
	easeInOutQuint : function (t, b, c, d){ if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b; return c / 2 * ((t -= 2) * t * t * t * t + 2) + b; },	

	//---------------------------------------------------------------
	// Sinusoidal

	/**
	 * Sinusoidal easing in
	 * @param {Number} t Specifies time.
	 * @param {Number} b Specifies the initial position of a component.
	 * @param {Number} c Specifies the total change in position of the component.
	 * @param {Number} d Specifies the duration of the effect, in milliseconds.
	 * @memberof Easing
	 */
	easeInSine : function (t, b, c, d){ return -c * Math.cos(t / d * (Math.PI / 2)) + c + b; },
	/**
	 * Sinusoidal easing out
	 * @param {Number} t Specifies time.
	 * @param {Number} b Specifies the initial position of a component.
	 * @param {Number} c Specifies the total change in position of the component.
	 * @param {Number} d Specifies the duration of the effect, in milliseconds.
	 * @memberof Easing
	 */
	easeOutSine : function (t, b, c, d){ return c * Math.sin(t / d * (Math.PI / 2)) + b; },
	/**
	 * Sinusoidal easing in and out
	 * @param {Number} t Specifies time.
	 * @param {Number} b Specifies the initial position of a component.
	 * @param {Number} c Specifies the total change in position of the component.
	 * @param {Number} d Specifies the duration of the effect, in milliseconds.
	 * @memberof Easing
	 */
	easeInOutSine : function (t, b, c, d){ return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b; },	

	//---------------------------------------------------------------
	// Exponential

	/**
	 * Exponential easing in
	 * @param {Number} t Specifies time.
	 * @param {Number} b Specifies the initial position of a component.
	 * @param {Number} c Specifies the total change in position of the component.
	 * @param {Number} d Specifies the duration of the effect, in milliseconds.
	 * @memberof Easing
	 */
	easeInExpo : function (t, b, c, d){ return t == 0 ? b : c * Math.pow(2, 10 * (t / d - 1)) + b; },
	/**
	 * Exponential easing out
	 * @param {Number} t Specifies time.
	 * @param {Number} b Specifies the initial position of a component.
	 * @param {Number} c Specifies the total change in position of the component.
	 * @param {Number} d Specifies the duration of the effect, in milliseconds.
	 * @memberof Easing
	 */
	easeOutExpo : function (t, b, c, d){ return t == d ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b; },
	/**
	 * Exponential easing in and out
	 * @param {Number} t Specifies time.
	 * @param {Number} b Specifies the initial position of a component.
	 * @param {Number} c Specifies the total change in position of the component.
	 * @param {Number} d Specifies the duration of the effect, in milliseconds.
	 * @memberof Easing
	 */
	easeInOutExpo : function (t, b, c, d){ if (t == 0) return b; if (t == d) return b + c; if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b; return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b; },	

	//---------------------------------------------------------------
	// Circular

	/**
	 * Circular easing in
	 * @param {Number} t Specifies time.
	 * @param {Number} b Specifies the initial position of a component.
	 * @param {Number} c Specifies the total change in position of the component.
	 * @param {Number} d Specifies the duration of the effect, in milliseconds.
	 * @memberof Easing
	 */
	easeInCirc : function (t, b, c, d){ return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b; },
	/**
	 * Circular easing out
	 * @param {Number} t Specifies time.
	 * @param {Number} b Specifies the initial position of a component.
	 * @param {Number} c Specifies the total change in position of the component.
	 * @param {Number} d Specifies the duration of the effect, in milliseconds.
	 * @memberof Easing
	 */
	easeOutCirc : function (t, b, c, d){ return c * Math.sqrt(1 - (t = t/d - 1) * t) + b; },
	/**
	 * Circular easing in and out
	 * @param {Number} t Specifies time.
	 * @param {Number} b Specifies the initial position of a component.
	 * @param {Number} c Specifies the total change in position of the component.
	 * @param {Number} d Specifies the duration of the effect, in milliseconds.
	 * @memberof Easing
	 */
	easeInOutCirc : function (t, b, c, d){ if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b; return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b; },	

	//---------------------------------------------------------------
	// Elastic

	/**
	 * Elastic easing in
	 * @param {Number} t Specifies time.
	 * @param {Number} b Specifies the initial position of a component.
	 * @param {Number} c Specifies the total change in position of the component.
	 * @param {Number} d Specifies the duration of the effect, in milliseconds.
	 * @memberof Easing
	 */
	easeInElastic : function (t, b, c, d){ if (t == 0) return b; if ((t /= d) == 1) return b + c; var p = d * 0.3; var a = 0; var s = 0; if (!a || a < Math.abs(c)) { a = c; s = p / 4; } else { s = p / (2 * Math.PI) * Math.asin(c / a); } return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b; },
	/**
	 * Elastic easing out
	 * @param {Number} t Specifies time.
	 * @param {Number} b Specifies the initial position of a component.
	 * @param {Number} c Specifies the total change in position of the component.
	 * @param {Number} d Specifies the duration of the effect, in milliseconds.
	 * @memberof Easing
	 */
	easeOutElastic : function (t, b, c, d){ if (t == 0) return b; if ((t /= d) == 1) return b + c; var p = d * 0.3; var a = 0; var s = 0; if (!a || a < Math.abs(c)) { a = c; s = p / 4; } else { s = p / (2 * Math.PI) * Math.asin(c / a); } return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b; },
	/**
	 * Elastic easing in and out
	 * @param {Number} t Specifies time.
	 * @param {Number} b Specifies the initial position of a component.
	 * @param {Number} c Specifies the total change in position of the component.
	 * @param {Number} d Specifies the duration of the effect, in milliseconds.
	 * @memberof Easing
	 */
	easeInOutElastic : function (t, b, c, d){ if (t == 0) return b; if ((t /= d / 2) == 2) return b + c; var p = d * (0.3 * 1.5); var a = 0; var s = 0; if (!a || a < Math.abs(c)) { a = c; s = p / 4; } else { s = p / (2 * Math.PI) * Math.asin(c / a); } if (t < 1) { return -0.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) /p)) + b; } return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p ) * 0.5 + c + b; },	

	//---------------------------------------------------------------
	// Back

	/**
	 * Back easing in
	 * @param {Number} t Specifies time.
	 * @param {Number} b Specifies the initial position of a component.
	 * @param {Number} c Specifies the total change in position of the component.
	 * @param {Number} d Specifies the duration of the effect, in milliseconds.
	 * @memberof Easing
	 */
	easeInBack : function (t, b, c, d){ var s = 1.70158; return c * (t /= d) * t * ((s + 1) * t - s) + b; },
	/**
	 * Back easing out
	 * @param {Number} t Specifies time.
	 * @param {Number} b Specifies the initial position of a component.
	 * @param {Number} c Specifies the total change in position of the component.
	 * @param {Number} d Specifies the duration of the effect, in milliseconds.
	 * @memberof Easing
	 */
	easeOutBack : function (t, b, c, d){ var s = 1.70158; return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b; },
	/**
	 * Back easing in and out
	 * @param {Number} t Specifies time.
	 * @param {Number} b Specifies the initial position of a component.
	 * @param {Number} c Specifies the total change in position of the component.
	 * @param {Number} d Specifies the duration of the effect, in milliseconds.
	 * @memberof Easing
	 */
	easeInOutBack : function (t, b, c, d){ var s = 1.70158;  if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b; return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b; },	

	//---------------------------------------------------------------
	// Bounce

	/**
	 * Bounce easing in
	 * @param {Number} t Specifies time.
	 * @param {Number} b Specifies the initial position of a component.
	 * @param {Number} c Specifies the total change in position of the component.
	 * @param {Number} d Specifies the duration of the effect, in milliseconds.
	 * @memberof Easing
	 */
	easeInBounce : function (t, b, c, d){ return c - Easing.easeOutBounce(d - t, 0, c, d) + b; },
	/**
	 * Bounce easing out
	 * @param {Number} t Specifies time.
	 * @param {Number} b Specifies the initial position of a component.
	 * @param {Number} c Specifies the total change in position of the component.
	 * @param {Number} d Specifies the duration of the effect, in milliseconds.
	 * @memberof Easing
	 */
	easeOutBounce : function (t, b, c, d){ if ((t /= d) < (1 / 2.75)) return c * (7.5625 * t * t) + b; else if (t < (2 / 2.75)) return c * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75) + b; else if (t < (2.5 / 2.75)) return c * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375) + b; else return c * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375) + b; },
	/**
	 * Bounce easing in and out
	 * @param {Number} t Specifies time.
	 * @param {Number} b Specifies the initial position of a component.
	 * @param {Number} c Specifies the total change in position of the component.
	 * @param {Number} d Specifies the duration of the effect, in milliseconds.
	 * @memberof Easing
	 */
	easeInOutBounce : function (t, b, c, d){ if (t < d/2) return Easing.easeInBounce(t * 2, 0, c, d) * 0.5 + b; else return Easing.easeOutBounce(t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b; }
};
