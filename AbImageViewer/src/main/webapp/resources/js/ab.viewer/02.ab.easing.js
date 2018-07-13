//
// @param t Specifies time.
// @param b Specifies the initial position of a component.
// @param c Specifies the total change in position of the component.
// @param d Specifies the duration of the effect, in milliseconds.
//
var Easing = {
	get : function (s){ return typeof s == 'string' ? (s == 'get' || s == 'gsap' || s == 'has' ? null : this[s]) : s; },
	has : function (s) { return this[s] != null && typeof this[s] == 'function'; },
	gsap : function (segments){ return function (time, start, change, duration){ var factor = time / duration, qty = segments.length, i = Math.floor(qty * factor), t, s; t = (factor - (i * (1 / qty))) * qty; s = segments[i]; return start + change * (s.s + t * (2 * (1 - t) * (s.cp - s.s) + t * (s.e - s.s))); }; },


	//---------------------------------------------------------------
	// Linear

	linear : function (t, b, c, d){ return c * t / d + b; },

	//---------------------------------------------------------------
	// Customs by wansibi

	swing : function (t, b, c, d){ var ts=(t/=d)*t; var tc=ts*t; return b+c*(2.2025*tc*ts + -5.6525*ts*ts + 3.2*tc + ts + 0.25*t); },
	rolling : function (t, b, c, d){ var ts=(t/=d)*t; var tc=ts*t; return b+c*(1.0475*tc*ts + -4.9425*ts*ts + 7.395*tc + -5.7*ts + 3.2*t); },

	//---------------------------------------------------------------
	// Quadratic

	easeInQuad : function (t, b, c, d){ return c * (t /= d) * t + b; },
	easeOutQuad : function (t, b, c, d){ return -c * (t /= d) * (t - 2) + b; },
	easeInOutQuad : function (t, b, c, d){ if ((t /= d / 2) < 1) return c / 2 * t * t + b; return -c / 2 * ((--t) * (t - 2) - 1) + b; },

	//---------------------------------------------------------------
	// Cubic

	easeInCubic : function (t, b, c, d){ return c * (t /= d) * t * t + b; },
	easeOutCubic : function (t, b, c, d){ return c * ((t = t / d - 1) * t * t + 1) + b; },
	easeInOutCubic : function (t, b, c, d){ if ((t /= d / 2) < 1) return c / 2 * t * t * t + b; return c / 2 * ((t -= 2) * t * t + 2) + b; },	

	//---------------------------------------------------------------
	// Quartic

	easeInQuart : function (t, b, c, d){ return c * (t /= d) * t * t * t + b; },
	easeOutQuart : function (t, b, c, d){ return -c * ((t = t / d - 1) * t * t * t - 1) + b; },
	easeInOutQuart : function (t, b, c, d){ if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b; return -c / 2 * ((t -= 2) * t * t * t - 2) + b; },	

	//---------------------------------------------------------------
	// Quint

	easeInQuint : function (t, b, c, d){ return c * (t /= d) * t * t * t * t + b; },
	easeOutQuint : function (t, b, c, d){ return c * ((t = t / d - 1) * t * t * t * t + 1) + b; },
	easeInOutQuint : function (t, b, c, d){ if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b; return c / 2 * ((t -= 2) * t * t * t * t + 2) + b; },	

	//---------------------------------------------------------------
	// Sinusoidal

	easeInSine : function (t, b, c, d){ return -c * Math.cos(t / d * (Math.PI / 2)) + c + b; },
	easeOutSine : function (t, b, c, d){ return c * Math.sin(t / d * (Math.PI / 2)) + b; },
	easeInOutSine : function (t, b, c, d){ return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b; },	

	//---------------------------------------------------------------
	// Exponential

	easeInExpo : function (t, b, c, d){ return t == 0 ? b : c * Math.pow(2, 10 * (t / d - 1)) + b; },
	easeOutExpo : function (t, b, c, d){ return t == d ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b; },
	easeInOutExpo : function (t, b, c, d){ if (t == 0) return b; if (t == d) return b + c; if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b; return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b; },	

	//---------------------------------------------------------------
	// Circular

	easeInCirc : function (t, b, c, d){ return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b; },
	easeOutCirc : function (t, b, c, d){ return c * Math.sqrt(1 - (t = t/d - 1) * t) + b; },
	easeInOutCirc : function (t, b, c, d){ if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b; return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b; },	

	//---------------------------------------------------------------
	// Elastic

	easeInElastic : function (t, b, c, d){ if (t == 0) return b; if ((t /= d) == 1) return b + c; var p = d * 0.3; var a = 0; var s = 0; if (!a || a < Math.abs(c)) { a = c; s = p / 4; } else { s = p / (2 * Math.PI) * Math.asin(c / a); } return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b; },
	easeOutElastic : function (t, b, c, d){ if (t == 0) return b; if ((t /= d) == 1) return b + c; var p = d * 0.3; var a = 0; var s = 0; if (!a || a < Math.abs(c)) { a = c; s = p / 4; } else { s = p / (2 * Math.PI) * Math.asin(c / a); } return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b; },
	easeInOutElastic : function (t, b, c, d){ if (t == 0) return b; if ((t /= d / 2) == 2) return b + c; var p = d * (0.3 * 1.5); var a = 0; var s = 0; if (!a || a < Math.abs(c)) { a = c; s = p / 4; } else { s = p / (2 * Math.PI) * Math.asin(c / a); } if (t < 1) { return -0.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) /p)) + b; } return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p ) * 0.5 + c + b; },	

	//---------------------------------------------------------------
	// Back

	easeInBack : function (t, b, c, d){ var s = 1.70158; return c * (t /= d) * t * ((s + 1) * t - s) + b; },
	easeOutBack : function (t, b, c, d){ var s = 1.70158; return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b; },
	easeInOutBack : function (t, b, c, d){ var s = 1.70158;  if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b; return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b; },	

	//---------------------------------------------------------------
	// Bounce

	easeInBounce : function (t, b, c, d){ return c - Easing.easeOutBounce(d - t, 0, c, d) + b; },
	easeOutBounce : function (t, b, c, d){ if ((t /= d) < (1 / 2.75)) return c * (7.5625 * t * t) + b; else if (t < (2 / 2.75)) return c * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75) + b; else if (t < (2.5 / 2.75)) return c * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375) + b; else return c * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375) + b; },
	easeInOutBounce : function (t, b, c, d){ if (t < d/2) return Easing.easeInBounce(t * 2, 0, c, d) * 0.5 + b; else return Easing.easeOutBounce(t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b; }
};
