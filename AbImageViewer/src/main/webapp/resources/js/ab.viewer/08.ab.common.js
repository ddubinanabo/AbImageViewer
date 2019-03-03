/**
 * 마우스 훨 픽셀 정보
 * @typedef {Object} MouseWheelPixelInfo
 * @property {Number} spinX X축 회전 값
 * @property {Number} spinY Y축 회전 값
 * @property {Number} pixelX X축 회전 값 (단위 픽셀)
 * @property {Number} pixelY Y축 회전 값 (단위 픽셀)
 */

/**
 * 애니메이션 콜백 함수
 * @callback TweenCallback
 * @param {Object} [options] 수행옵션 (참조: {@link AbCommon.tween})
 */

/**
 * 애니메이션 수행 콜백 함수
 * @callback TweenProcCallback
 * @param {Number} value 현재 진행 값
 * @param {Object} [options] 수행옵션 (참조: {@link AbCommon.tween})
 * @param {Number} [prevValue] 이전 진행 값
 */

/**
 * 작업 진행 콜백 함수
 * @callback ArrayProcCallback
 * @param {Number} cnt 현재 위치
 * @param {Number} siz 전체 수량
 */

/**
 * 로더 콜백 함수
 * @callback LoadingCallback
 * @param {Boolean} visible 로더 표시 여부
 */

/**
 * Ajax 성공 콜백 함수
 * @callback AjaxSuccessCallback
 * @param {(String|Number|Boolean|Object|Array)} result 결과 데이터
 */

/**
 * Ajax 오류 콜백 함수
 * @callback AjaxErrorCallback
 * @param {XMLHttpRequest} xhr XMLHttpRequest 객체
 * @param {String} textStatus 상태 정보
 * @param {String} errorThrown 발생한 오류 정보
 */

/**
 * Ajax Submit 전송 전 콜백 함수
 * @callback AjaxSubmitBeforeCallback
 * @param {(String|Number|Boolean|Object|Array)} data 전송 데이터
 * @param {XMLHttpRequest} xhr XMLHttpRequest 객체
 * @param {String} textStatus 상태 정보
 * @param {jQueryObject} $form HTML Form jQueryObject
 */

/**
 * Ajax Submit 성공 콜백 함수
 * @callback AjaxSubmitSuccessCallback
 * @param {String} responseText
 * @param {XMLHttpRequest} xhr XMLHttpRequest 객체
 * @param {String} textStatus 상태 정보
 * @param {jQueryObject} $form HTML Form jQueryObject
 */

/**
 * Ajax Submit 오류 콜백 함수
 * @callback AjaxSubmitErrorCallback
 * @param {String} message Message
 * @param {jQueryObject} $form HTML Form jQueryObject
 */

/**
 * XMLHttpReqeust 회신 정보 추출
 * @typedef {Object} XmlHttpRequestResponseInfo
 * @property {Number} status 상태
 * @property {String} exception 예외 클래스명
 * @property {Number} errorCode 오류 코드
 * @property {String} messageType 메시지 타입
 * @property {String} message 메시지
 * @property {String} stackTrace 스택 추척 정보
 * @property {String} token 예약
 */

/**
 * 오류 메시지 추출 수행 결과 정보
 * @typedef {Object} XHRRemoteErrorProcessResult
 * @property {String} message 상태
 * @property {Function} retfunc 오류에 대한 콜백 함수
 */

/**
 * XML HTTP Request 진행 중 콜백 함수
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/ProgressEvent} MDN 자료 참고
 * @callback XHRProgressCallback
 * @param {ProgressEvent} e ProgressEvent 이벤트 객체
 */

/**
 * XML HTTP Request 로드 콜백 함수
 * @callback XHRLoadCallback
 * @param {ProgressEvent} e ProgressEvent 이벤트 객체
 * @param {XMLHttpRequest} xhr XMLHttpRequest 객체
 */

/**
 * XML HTTP Request 오류 콜백 함수
 * @callback XHRErrorCallback
 * @param {(ProgressEvent|Error)} e ProgressEvent 이벤트 객체 또는 Error 객체
 * @param {XMLHttpRequest} xhr XMLHttpRequest 객체
 */

/**
 * 공용 도구 모음
 * @namespace
 */
var AbCommon = {

	//-----------------------------------------------------------
	// 쿠키
	//-----------------------------------------------------------
		
	/**
	 * 쿠키 도구
	 * @namespace
	 * @memberof AbCommon
	 */
	cookie: {
		/**
		 * 쿠키 값을 가져옵니다.
		 * @memberof AbCommon.cookie
		 * @param {String} name 쿠키명
		 * @return {String} 쿠키값
		 */
		get : function (name){
			var flag = document.cookie.indexOf(name+'=');
			if (flag != -1){
				flag += name.length + 1;
				end = document.cookie.indexOf(';', flag);

				if (end == -1) end = document.cookie.length;
				return unescape(document.cookie.substring(flag, end));
			}
			return null;
		},

		/**
		 * 만료되지 않는 쿠키를 설정합니다.
		 * @memberof AbCommon.cookie
		 * @param {String} name 쿠키명
		 * @param {String} value 쿠키값
		 */
		setAlways : function (name,value){ this.set (name,value,31536000); },

		/**
		 * 쿠키를 설정합니다.
		 * @memberof AbCommon.cookie
		 * @param {String} name 쿠키명
		 * @param {String} value 쿠키값
		 * @param {Number} expiredays 만료정보
		 * @param {String} [opt=d] 만료정보의 단위입니다. (y|m|d|h|i|s)<dl><dt>y</dt><dd>년</dd><dt>m</dt><dd>월</dd><dt>d</dt><dd>일</dd><dt>h</dt><dd>시간</dd><dt>i</dt><dd>분</dd><dt>s</dt><dd>초</dd></dl>
		 */
		set: function (name, value, expiredays, opt) {
			var today = new Date();
			if (expiredays == null)
				document.cookie = name + "=" + escape(value) + "; path=/;";
			else {
				switch(opt){
				case 'y': case 'Y':
					today.setFullYear(today.getFullYear() + expiredays);
					break;
				case 'm': case 'M':
					today.setMonth(today.getMonth() + expiredays);
					break;
				case 'h': case 'H':
					today.setHours(today.getHours() + expiredays);
					break;
				case 'i': case 'I':
					today.setMinutes(today.getMinutes() + expiredays);
					break;
				case 's': case 'S':
					today.setSeconds(today.getSeconds() + expiredays);
					break;
				default:
					today.setDate(today.getDate() + expiredays);
					break;
				}
				
				document.cookie = name + "=" + value + "; path=/; expires=" + today.toGMTString() + ";";
			}
		},

		/**
		 * 쿠키를 삭제합니다.
		 * @param {String} name 쿠키명
		 */
		remove: function (name) {
			var expireDate = new Date();
			expireDate.setDate(expireDate.getDate() - 1);
			document.cookie = name + "= " + "; expires=" + expireDate.toGMTString() + "; path=/";
		}
	},

	//-----------------------------------------------------------
	// 마우스 훨 처리
	//-----------------------------------------------------------

	/**
	 * 마우스 훨 도구
	 * @namespace
	 */
	wheel: {

		/**
		 * 회전당 픽셀 수
		 * @memberof AbCommon.wheel
		 * @const
		 * @type {Number}
		 * @default
		 */
		PIXEL_STEP: 100,
		/**
		 * 한 줄의 높이
		 * @memberof AbCommon.wheel
		 * @const
		 * @type {Number}
		 * @default
		 */
		LINE_HEIGHT: 40,
		/**
		 * 페이지의 높이
		 * @memberof AbCommon.wheel
		 * @const
		 * @type {Number}
		 * @default
		 */
		PAGE_HEIGHT: 800,

		/**
		 * 마우스 훨에 대한 계산 처리
		 * @memberof AbCommon.wheel
		 * @param {jQueryEventObject} event jQuery 이벤트 객체
		 * @return {MouseWheelPixelInfo} 마우스 훨 픽셀 정보
		 */
		normalize: function(event){
			var sX = 0, sY = 0; // spinX, spinY
			var pX = 0, pY = 0; // pixelX, pixelY

			// Legacy
			if ('detail'      in event) { sY = event.detail; }
			if ('wheelDelta'  in event) { sY = -event.wheelDelta / 120; }
			if ('wheelDeltaY' in event) { sY = -event.wheelDeltaY / 120; }
			if ('wheelDeltaX' in event) { sX = -event.wheelDeltaX / 120; }

			// side scrolling on FF with DOMMouseScroll
			if ( 'axis' in event && event.axis === event.HORIZONTAL_AXIS ) {
				sX = sY;
				sY = 0;
			}

			pX = sX * this.PIXEL_STEP;
			pY = sY * this.PIXEL_STEP;

			if ('deltaY' in event) { pY = event.deltaY; }
			if ('deltaX' in event) { pX = event.deltaX; }

			if ((pX || pY) && event.deltaMode) {
				if (event.deltaMode == 1) {          // delta in LINE units
					pX *= this.LINE_HEIGHT;
					pY *= this.LINE_HEIGHT;
				} else {                             // delta in PAGE units
					pX *= this.PAGE_HEIGHT;
					pY *= this.PAGE_HEIGHT;
				}
			}

			// Fall-back if spin cannot be determined
			if (pX && !sX) { sX = (pX < 1) ? -1 : 1; }
			if (pY && !sY) { sY = (pY < 1) ? -1 : 1; }

			return {
				spinX  : sX,
				spinY  : sY,
				pixelX : pX,
				pixelY : pY
			};
		}
	},

	//-----------------------------------------------------------
	// 브라우저 확인
	//-----------------------------------------------------------

	/**
	 * 현재 브라우저의 종류를 가져옵니다.
	 * @memberof AbCommon
	 * @return {String} 브라우저 (ie|opera|firefox|chrome|safari|unknown)
	 */
	getBrowser: function(){
		var userAgent = navigator.userAgent.toLowerCase();
		
		if (userAgent.indexOf('trident') > 0 || userAgent.indexOf('msie') > 0) {
			return 'ie';
		} else if (userAgent.indexOf("opera") > 0) {
			return 'opera';
		} else if (userAgent.indexOf("firefox") > 0) {
			return 'firefox';
		}else if (userAgent.indexOf("chrome") > 0) {
			return 'chrome';
		}else if (userAgent.indexOf("safari") > 0) {
			return 'safari';
		}
		return 'unknown';
	},
	
	//-----------------------------------------------------------
	// IE 버전 확인
	//-----------------------------------------------------------

	/**
	 * IE 버전을 가져옵니다.
	 * @memberof AbCommon
	 * @return {Number} IE 버전, -1이면 IE가 아닙니다.
	 */
	ieVersion: function(){
		var userAgent = navigator.userAgent.toLowerCase();

		var word = null;
		
		if (navigator.appName == 'Microsoft Internet Explorer') word = 'msie'; // IE old version (IE10 or Lower)
		else if (userAgent.search('trident') > -1) word = 'trident/.*rv:'; // IE11
		else if (userAgent.search('edge/') > -1 ) word = 'edge/'; // Microsoft Edge
		else return -1;

		var reg = new RegExp(word +'([0-9]{1,})(\\.{0,}[0-9]{0,1})');
		if (reg.exec(userAgent) != null) return parseFloat( RegExp.$1 + RegExp.$2 );
		return -1;
	},

	//-----------------------------------------------------------

	/**
	 * 크로스 브라우저 지원 애니메이션 프레임 호출 함수
	 * <p>* 일반적으로 1초당 60회 콜백을 호출하는 함수입니다.
	 * <p>* 대부분의 브라우저들은 W3C 권장사항에 따라 디스플레이 주사율과 일치하도록 실행됩니다.
	 * @memberof AbCommon
	 * @see {@link https://developer.mozilla.org/ko/docs/Web/API/Window/requestAnimationFrame} MDN 자료 참고
	 * @return {Function} requestAnimationFrame 함수
	 */
	requestAnimFrame: function (){
		return window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame || 
			window.mozRequestAnimationFrame || 
			window.oRequestAnimationFrame || 
			window.msRequestAnimationFrame;
	},

	cancelAnimFrame: function(){
		return window.cancelAnimationFrame || window.mozCancelAnimationFrame;
	},
	
	// Esing 애니메이션 처리
	/**
	 * Esing 함수를 이용해 애니메이션을 수행합니다.
	 * @memberof AbCommon
	 * @param {Object} [options] 수행 옵션
	 * @param {Object} [options.caller] 콜백 함수의 this 지정자
	 * @param {Number} [options.start=0] 시작 값
	 * @param {Number} [options.end=start+100] 종료 값
	 * @param {String} [options.easing=swing] Easing 함수 또는 함수명
	 * @param {Number} [options.duration=300] 진행 시간
	 * @param {Boolean} [options.animating=true] 애니메이션 진행 여부, false면 애니메이션을 진행하지 않습니다.
	 * @param {TweenCallback} [options.starting] 애니메이션 시작 시 호출되는 함수
	 * @param {TweenProcCallback} [options.proc] 애니메이션 진행 중 호출되는 함수
	 * @param {TweenCallback} [options.ended] 애니메이션 종료 후 호출되는 함수
	 */
	tween: function (options){
		if (!options) options = {};
		if (typeof options.proc != 'function') return;

		var animating = true;

		if (!AbCommon.isSetted(options.start)) options.start = 0;
		if (!AbCommon.isSetted(options.end)) options.end = options.start + 100;
		if (!AbCommon.isSetted(options.easing)) options.easing = 'swing';
		if (!AbCommon.isSetted(options.duration)) options.duration = 300;
		if (AbCommon.isSetted(options.animating)) animating = options.animating;

		var requestAnimFrame = this.requestAnimFrame();

		if (typeof requestAnimFrame != 'function') options.animating = false;

		var runtime = this.runtime;
		var startTime = null, caller = options.caller;
		var prev = null;

		/*
		var requestAnimFrame = (function(callback) {
			return window.requestAnimationFrame || 
			window.webkitRequestAnimationFrame || 
			window.mozRequestAnimationFrame || 
			window.oRequestAnimationFrame || 
			window.msRequestAnimationFrame ||
			function(callback) { window.setTimeout(callback, 1000 / 60); };
		})();
		*/
		
		function render(timestamp){
			if (startTime == null)
				startTime = timestamp;

			var easing = Easing.get(options.easing);
			var time = timestamp - startTime;

			var value = easing(time, 0, options.end - options.start, options.duration);
			if (isNaN(value)) value = 0;

			value = options.start + value;

			var isEnd = false;
			// if (options.start <= options.end) isEnd = options.end < value;
			// else isEnd = options.end > value;

			if (isEnd) value = options.end;

			options.proc.call(caller || options.proc, value, options, prev != null ? value - prev : 0);

			prev = value;

			if (time < options.duration){
				requestAnimFrame(render);
			}else{
				if (typeof options.ended == 'function')
					options.ended.call(caller || options.ended, options);
			}
		};

		if (typeof options.starting == 'function')
			options.starting.call(caller || options.starting, options);

		if (animating === true){
			requestAnimFrame(render);
		}else{
			options.proc.call(caller || options.proc, options.end, options);

			if (typeof options.ended == 'function')
				options.ended.call(caller || options.ended, options);
		}
		
	},

	//-----------------------------------------------------------
	// UUID 생성
	
	/**
	 * UUID 생성
	 * <p>A Universally Unique IDentifier (UUID)
	 * @memberof AbCommon
	 * @return {String} UUID
	 */
	uuid: function (){
		// http://www.ietf.org/rfc/rfc4122.txt
		var s = [];
		var hexDigits = '0123456789abcde';
		for (var i = 0; i < 36; i++) {
			s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
		}
		s[14] = '4';  // bits 12-15 of the time_hi_and_version field to 0010
		s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
		s[8] = s[13] = s[18] = s[23] = '-';

		var uuid = s.join('');
		return uuid;
	},

	/**
	 * 비트 플래그를 확인합니다.
	 * @memberof AbCommon
	 * @param {Number} value 정보
	 * @param {Number} n 플래그 값
	 * @return {Boolean} 플래그가 있다면 true
	 */
	flag: function(value, n){ return (value & n) == n; },

	/**
	 * 값이 설정되어 있는 지 확인합니다.
	 * @memberof AbCommon
	 * @param {*} val 값
	 * @return {Boolean} 설정되어 있으면 true
	 */
	isSetted: function (val){ return typeof val != 'undefined' && val != null; },
	/**
	 * 값이 정의되어 있는 지 확인합니다.
	 * @memberof AbCommon
	 * @param {*} val 값
	 * @return {Boolean} 정의되어 있으면 true
	 */
	isDefined: function (val){ return typeof val != 'undefined'; },
	/**
	 * 값이 함수인지 확인합니다.
	 * @memberof AbCommon
	 * @param {*} val 값
	 * @return {Boolean} 함수면 true
	 */
	isFunction: function (val) { return typeof val == 'function'; },
	/**
	 * 값이 문자열인지 확인합니다.
	 * @memberof AbCommon
	 * @param {*} value 값
	 * @return {Boolean} 문자열이면 true
	 */
	isString: function (value) { return typeof value == 'string'; },
	/**
	 * 값이 숫자형인지 확인합니다.
	 * @memberof AbCommon
	 * @param {*} value 값
	 * @return {Boolean} 숫자형이면 true
	 */
	isNumber: function (value) { return typeof value == 'number'; },
	/**
	 * 값이 부울형인지 확인합니다.
	 * @memberof AbCommon
	 * @param {*} value 값
	 * @return {Boolean} 부울형이면 true
	 */
	isBool: function (value) { return typeof value == 'boolean'; },

	/**
	 * HTML 엔티티를 인코딩합니다.
	 * @memberof AbCommon
	 * @param {String} value 문자열
	 * @return {String} 인코딩된 문자열
	 */
	escape: function (value){ return value ? value.replace ( /&/gi, '&amp;' ).replace ( /&/gi, '&nbsp;' ).replace ( /</gi, '&lt;' ).replace ( />/gi, '&gt;' ).replace ( /'/g, '&#039;' ).replace ( /"/g, '&quot;' ) : value; },

	//-----------------------------------------------------------
	// Web Worker
	//-----------------------------------------------------------

	// 조건에 따라 Web Worker를 비활성화 하기 위한 옵션
	/**
	 * 웹 워커 수행 여부
	 * <p>* 이 옵션은 IE 때문에 추가된 것으로, 성능 상 문제로 IE에서는 웹 워커를 비활성화하기 위함입니다.
	 * @memberof AbCommon
	 * @type {Boolean}
	 * @default
	 */
	ENABLE_WEB_WORKER : true,

	// Web Worker 사용 가능 여부 확인
	/**
	 * 웹 워커 수행 여부를 확인합니다.
	 * @memberof AbCommon
	 * @return {Boolean} 브라우저가 웹 워커를 지원하고, ENABLE_WEB_WORKER 필드가 true면 true를 리턴합니다.
	 */
	supportWebWorker: function(){
		return window.Worker != null && window.Worker != undefined && AbCommon.ENABLE_WEB_WORKER;
	},

	//-----------------------------------------------------------
	// IFRAME 제어 관련
	
	/**
	 * IFRAME jQueryObject에서 window 객체를 가져옵니다.
	 * @memberof AbCommon
	 * @param {jQueryObject} e IFRAME jQueryObject
	 * @return {Window} HTMLIFrameElement.contentWindow
	 */
	contentWindow: function(e){
		return e.length ? e.get(0).contentWindow : null;
	},

	/**
	 * IFRAME jQueryObject에서 document 객체를 가져옵니다.
	 * @memberof AbCommon
	 * @param {jQueryObject} e IFRAME jQueryObject
	 * @return {Document} HTMLIFrameElement.contentDocument
	 */
	contentDocument: function(e){
		if (!e.length) return null;
		var htmlElement = e.get(0);

		if (htmlElement.contentWindow) return htmlElement.contentWindow.document;
		return htmlElement.contentDocument ? htmlElement.contentDocument.document ? htmlElement.contentDocument.document : htmlElement.contentDocument : null;
	},

	/**
	 * 배열의 원소들이 전부 숫자형인지 확인합니다.
	 * @memberof AbCommon
	 * @return {Boolean} 전부 숫자형이면 true
	 */
	allNumbers: function (){
		var len = arguments.length;
		for (var i=0; i < len; i++)
			if (!this.isNumber(arguments[i]))
				return false;
		return true;
	},

	/**
	 * 스크롤 영역이 있는 부모 엘리먼트를 탐색하여 스크롤 정보를 가져옵니다.
	 * @memberof AbCommon
	 * @param {jQueryObject} e 현재 엘리먼트 jQueryObject
	 * @return {Point} 스크롤 위치 정보
	 */
	scrolledParents: function(e){
		e = e.parent();
		while (e && e.length){
			var element = e.get(0);

			var scrolledH = element.offsetWidth < element.scrollWidth && element.scrollLeft;
			var scrolledV = element.offsetHeight < element.scrollHeight && element.scrollTop;

			if (scrolledH || scrolledV)
				return {
					x: element.scrollLeft,
					y: element.scrollTop
				};

			e = e.parent();
		}
		return { x: 0, y: 0 };
	},

	/**
	 * 용량 단위
	 * @memberof AbCommon
	 * @const
	 * @type {Array}
	 * @default
	 */
	BYTE_UNITS: [ 'Bytes', 'KB', 'MB', 'GB', 'TB', 'PB' ],

	/**
	 * 바이트 용량을 최대 단위로 환산합니다.
	 * @memberof AbCommon
	 * @param {Number} bytes 바이트 용량
	 * @param {Number} [dec=1] 소수점 자리수
	 * @return {String} 최대 단위로 환산된 문자열(2048 => 2 KB)
	 */
	byteScope: function (bytes, dec){
		if (!AbCommon.isNumber(dec)) dec = 1;

		var units = this.BYTE_UNITS;

		if (bytes == 0) return bytes + ' ' + units[0];

		var value = Math.floor(Math.log(bytes) / Math.log(1024));
		var ivalue = parseInt(value);

		value = bytes / Math.pow(1024, ivalue);

		var val = 1;
		for (var i=0; i < dec; i++)
			val *= 10;

		value = Math.round(value * val) / val;
		return value + ' ' + units[ivalue];
	},

	/**
	 * Promise 객체 배열의 전체 원소들을 태스크 큐을 통해 수행합니다.
	 * @memberof AbCommon
	 * @param {Array} a Promise 객체 배열
	 * @param {ArrayProcCallback} [progress] 진행 중 호출되는 함수
	 * @param {(Number|Object)} [options] 옵션, 숫자로 값을 주면 resolve 수행 대기 시간을 설정하게 됩니다.
	 * @param {Object} [options.term] 대기시간 옵션
	 * @param {Object} [options.term.resolve=0] resolve 수행 대기 시간을 설정합니다.
	 * @param {Object} [options.term.progree=0] progress 함수 호출 대기 시간을 설정합니다.
	 * @return {Promise} Promise 객체
	 */
	promiseAll: function (a, progress, options){
		var resolveDelay = 0, progreeDelay = 0, promiseDelay = 0;
		if (AbCommon.isNumber(options)){
			resolveDelay = options;
		}else{
			if (!options) options = {};
			var termOptions = options.term || {};

			resolveDelay = termOptions.resolve || 0;
			progreeDelay = termOptions.progree || 0;
			promiseDelay = termOptions.promise || 0;
		}
		if (!$.isArray(a)) a = [a];

		return new Promise(function(resolve, reject){
			var siz = a.length;
			var cnt = 0;

			if (siz == 0){
				setTimeout(resolve.bind(null), resolveDelay);
				return;
			}

			for (var i=0; i < siz; i++){
				var func = function(){
					var promise = arguments.callee.promise;

					promise.then(function (){
						cnt++;
						if (cnt >= siz){
							if (progress) setTimeout(function (){ progress(cnt, siz) }, progreeDelay);
							setTimeout(resolve.bind(null), resolveDelay);
						}else{
							if (progress) setTimeout(function (){ progress(cnt, siz) }, progreeDelay);
						}
					}).catch(function (e){
						reject(e);
					})
				};
				func.promise = a[i];

				setTimeout(func, 0);
			}
		});
	},

	/**
	 * Promise 객체 배열의 전체 원소들을 순차적으로 수행합니다.
	 * @memberof AbCommon
	 * @param {Array} a Promise 객체 배열
	 * @param {ArrayProcCallback} [progress] 진행 중 호출되는 함수
	 * @param {(Number|Object)} [options] 옵션, 숫자로 값을 주면 resolve 수행 대기 시간을 설정하게 됩니다.
	 * @param {Object} [options.term] 대기시간 옵션
	 * @param {Object} [options.term.resolve=0] resolve 수행 대기 시간을 설정합니다.
	 * @param {Object} [options.term.progree=0] progress 함수 호출 대기 시간을 설정합니다.
	 * @return {Promise} Promise 객체
	 */
	sequencePromiseAll: function (a, progress, options){
		var resolveDelay = 0, progreeDelay = 0, promiseDelay = 0, execDelay = 0;
		if (AbCommon.isNumber(options)){
			resolveDelay = options;
		}else{
			if (!options) options = {};
			var termOptions = options.term || {};

			resolveDelay = termOptions.resolve || 0;
			progreeDelay = termOptions.progree || 0;
			promiseDelay = termOptions.promise || 0;
			execDelay = termOptions.exec || 0;
		}
		if (!$.isArray(a)) a = [a];

		return new Promise(function(resolve, reject){
			var siz = a.length;
			var cnt = 0;

			if (siz == 0){
				setTimeout(resolve.bind(null), resolveDelay);
				return;
			}

			var exec = function(){
				var promise = a[cnt];

				promise.then(function (){
					cnt++;
					if (cnt >= siz){
						if (progress) setTimeout(function (){ progress(cnt, siz) }, progreeDelay);
						setTimeout(resolve.bind(null), resolveDelay);
					}else{
						if (progress) setTimeout(function (){ progress(cnt, siz) }, progreeDelay);

						setTimeout(exec, execDelay);
					}
				}).catch(function (e){
					reject(e);
				})
			};

			setTimeout(exec, execDelay);
		});
	},

	//-----------------------------------------------------------
	
	/**
	 * 객체가 history 상태 객체인지 확인합니다.
	 * <p>begin, end, undo, redo, dispose 메서드가 정의되어 있는 지 확인합니다.
	 * @memberof AbCommon
	 * @param {Object} o 도형 객체
	 * @return {Boolean} history 상태 객체면 true
	 */
	isHistoryState: function (o) {
		return o && o.type && o.cmd
			&& typeof o.begin == 'function'
			&& typeof o.end == 'function'
			&& typeof o.undo == 'function'
			&& typeof o.redo == 'function'
			&& typeof o.dispose == 'function';
	},

	/**
	 * 인덱스 정보 배열
	 * @typedef {Array.<IndexInfoItem>} IndexInfoArray
	 */

	/**
	 * 인덱스 정보 배열 아이템 
	 * @typedef {Object} IndexInfoItem
	 * @property {Number} index 검색된 인덱스
	 * @property {Object} source 검색 배열의 원소
	 */
	
	/**
	 * list배열에서 olist 배열의 원소들을 탐색합니다.
	 * @memberof AbCommon
	 * @param {Array} list 대상 배열
	 * @param {Array} olist 검색 배열
	 * @param {Boolean} [attachDest=false]
	 * @return {IndexInfoArray} 인덱스 정보 배열
	 */
	indexArrayOf: function (list, olist, attachDest){
		if (arguments.length == 2) attachDest = false;
		var len = list.length, a = olist.slice(0);
		var r = [], aidx = -1;
		for (var i=0; i < len; i++){
			if ((aidx = $.inArray(list[i], a))>= 0){
				if (attachDest){
					r.push({ index: i, source: a[aidx] });
				}else{
					r.push(i);
				}
				a.splice(aidx, 1);
			}
		}
		return r;
	},

	//-----------------------------------------------------------

	/**
	 * 도형 객체 배열의 dispose 작업을 수행합니다.
	 * @memberof AbCommon
	 * @param {Array} shapes 도형 객체 배열
	 */
	disposeShapes: function(shapes){
		var len=shapes.length;
		for (var i=0; i < len; i++){
			if (typeof shapes[i].dispose == 'function')
				shapes[i].dispose();
		}
		shapes.splice(0, shapes.length);
	},

	//-----------------------------------------------------------

	/**
	 * File 객체인지 확인합니다.
	 * @memberof AbCommon
	 * @param {Object} d 데이터 객체
	 * @return {Boolean} File 객체면 true
	 */
	isFileData: function(d){
		return d && (d instanceof File || (d.hasOwnProperty('name') && d.hasOwnProperty('type') && d.hasOwnProperty('size')) );
	},

	//-----------------------------------------------------------

	/**
	 * 이미지 디코더 정보를 생성합니다.
	 * @param {(String|Object)} decoder 렌더링 정보 또는 디코더 정보
	 * @param {String} kind 이미지 정보 종류
	 */
	createDecoder: function(decoder, kind){
		if (decoder){
			if (kind){
				if (AbCommon.isString(decoder)){
					decoder = {
						render: decoder,
						kind: kind,
					};
				}else{
					decoder.kind = kind;
				}						
			}
		}else if (kind){
			decoder = {
				kind: kind,
			};					
		}
		
		return decoder;
	},

	//-----------------------------------------------------------
	
	// support editor
	/**
	 * 도형 객체인지 확인합니다.
	 * <p>* move, styleDesc, setAngle, center, padding, rect, box, contains, editable, editPos, resize, measure, notify, serialize, prepare, reset, draw 메서드가 정의되어 있는 지 확인합니다.
	 * @see {@link ShapeObject} 도형 객체
	 * @memberof AbCommon
	 * @param {Object} o 도형 객체
	 * @return {Boolean} 도형 객체이면 true
	 */
	isShape: function (o) {
		return o && o.shapeStyle
			&& typeof o.move == 'function'
			&& typeof o.styleDesc == 'function'
			&& typeof o.setAngle == 'function'
			&& typeof o.center == 'function'
			&& typeof o.padding == 'function'
			&& typeof o.rect == 'function'
			&& typeof o.box == 'function'
			&& typeof o.contains == 'function'
			&& typeof o.editable == 'function'
			&& typeof o.editPos == 'function'
			&& typeof o.resize == 'function'
			&& typeof o.measure == 'function'
			&& typeof o.notify == 'function'
			&& typeof o.serialize == 'function'
			&& typeof o.prepare == 'function'
			&& typeof o.reset == 'function'
			&& typeof o.draw == 'function';
	},

	/**
	 * 스트로크 수집 도형 객체인지 확인합니다.
	 * <p>* addPoint, endPoint 메서드가 정의되어 있는 지 확인합니다.
	 * @memberof AbCommon
	 * @param {Object} o 도형 객체
	 * @return {Boolean} 스트로크 수집 도형 객체면 true
	 */
	isStrokeShape: function (o) {
		return o && o.shapeStyle
			&& typeof o.addPoint == 'function'
			&& typeof o.endPoint == 'function';
	},

	/**
	 * 도형 객체가 스타일 UI 정보가 있는 지 확인합니다.
	 * @memberof AbCommon
	 * @param {Object} o 도형 객체
	 * @return {Boolean} 스타일 UI 정보가 있으면 true
	 */
	hasShapeStyle: function (o) {
		var styleDesc = o ? o.styleDesc() : null;
		return styleDesc && styleDesc.descs && styleDesc.descs.length > 0;
	},
	
	// 도형 객체가 비동기로 선행 작업을 요하는 지 체크
	/**
	 * 도형 객체가 비동기로 선행 작업을 요하는 지 확인합니다.
	 * <p>* preload 메서드가 정의되어 있는 지 확인합니다.
	 * @memberof AbCommon
	 * @param {Object} o 도형 객체
	 * @return {Boolean} 도형 객체가 비동기로 선행 작업을 요하면 true
	 */
	needPreloading: function (o){
		return o
		&& typeof o.preload == 'function';
	},

	/**
	 * 스트로크 수집 도형 객체가 스트로크를 수집해야 하는 지 확인합니다.
	 * @memberof AbCommon
	 * @param {Object} o 도형 객체
	 * @return {Boolean} 수집해야 하면 true
	 */
	wannaCollectPoints: function (o){
		return this.isStrokeShape(o) && o.hasOwnProperty('collectPoints') && o.collectPoints === true;
	},

	/**
	 * 도형 객체가 라인 포인트를 수집해야 하는 지 확인합니다.
	 * @memberof AbCommon
	 * @param {Object} o 도형 객체
	 * @return {Boolean} 수집해야 하면 true
	 */
	wannaCollectLines: function (o){
		return this.isStrokeShape(o) && o.hasOwnProperty('collectLines') && o.collectLines === true;
	},

	/**
	 * 도형 객체가 마지막 포인트 체크를 하는 지 여부를 확인합니다.
	 * @memberof AbCommon
	 * @param {Object} o 도형 객체
	 * @return {Boolean} 체크 하면 true
	 */
	supportEndPointCheck: function (o){
		return o && o.shapeStyle && typeof o.isEndPoint == 'function';
	},

	/**
	 * 인라인 편집 도형 객체인지 확인합니다.
	 * <p>* inlineEdit, testInlineEdit 메서드가 정의되어 있는 지 확인합니다.
	 * @memberof AbCommon
	 * @param {Object} o 도형 객체
	 * @return {Boolean} 인라인 편집 도형 객체면 true
	 */
	isSupportInlineEditShape: function (o) {
		return o && o.shapeStyle
			&& typeof o.inlineEdit == 'function'
			&& typeof o.testInlineEdit == 'function';
	},

	/**
	 * 도형 객체가 도형 생성 방법을 제공하는 지 확인합니다.
	 * <p>* creationStyle 메서드가 정의되어 있는 지 확인합니다.
	 * @memberof AbCommon
	 * @param {Object} o 도형 객체
	 * @return {Boolean} 제공하면 true
	 */
	hasCreationStyleShape: function (o){
		return o && o.shapeStyle
			&& typeof o.creationStyle == 'function';
	},

	/**
	 * 도형 추가 시 드로잉을 지원하는 지 확인합니다.
	 * <p>* creationDraw 메서드가 정의되어 있는 지 확인합니다.
	 * <p>엔진은 도형 추가 시 creationDraw 메서드가 있는 경우 해당 메서드를 호출합니다. 없으면 draw 메서드를 호출합니다.
	 * @memberof AbCommon
	 * @param {Object} o 도형 객체
	 * @return {Boolean} 지원하면 true
	 */
	supportCreationDraw: function (o){
		return o && o.shapeStyle
			&& typeof o.creationDraw == 'function';
	},

	/**
	 * 도형이 복구 최소 크기를 설정하는 지 확인합니다. 복구 크기는 도형 추가 중 배경을 복구하는 영역의 크기를 말합니다.
	 * <p>* restoreMinimumSize 메서드가 정의되어 있는 지 확인합니다.
	 * @memberof AbCommon
	 * @param {Object} o 도형 객체
	 * @return {Boolean} 설정하면 true
	 */
	supportRestoreMinimumSize: function (o){
		return o && o.shapeStyle
			&& typeof o.restoreMinimumSize == 'function';
	},

	// support indicator
	/**
	 * 도형 객체가 크기 제한을 하는 지 확인합니다.
	 * <p>* resizable 메서드가 정의되어 있는 지 확인합니다.
	 * @memberof AbCommon
	 * @param {Object} o 도형 객체
	 * @return {Boolean} 크기 제한을 하면 true
	 */
	supportResizable: function (o){
		return  o && o.shapeStyle
			&& typeof o.resizable == 'function';
	},

	/**
	 * 도형 객체가 라인 충돌 판정에 대한 범위를 정의하는 지 확인합니다.
	 * <p>* validLineDistance 메서드가 정의되어 있는 지 확인합니다.
	 * @memberof AbCommon
	 * @param {Object} o 도형 객체
	 * @return {Boolean} 정의하면 true
	 */
	hasValidLineDistance: function (o){
		return  o && o.shapeStyle
			&& typeof o.validLineDistance == 'function';
	},

	/**
	 * 도형 객체가 최소 크기를 정의하는 지 확인합니다.
	 * <p>* minimum 메서드가 정의되어 있는 지 확인합니다.
	 * @memberof AbCommon
	 * @param {Object} o 도형 객체
	 * @return {Boolean} 정의하면 true
	 */
	hasMinimum: function (o){
		return  o && o.shapeStyle
			&& typeof o.minimum == 'function';
	},

	/**
	 * 도형 객체가 도형 추가 시 최소 크기를 정의하는 지 확인합니다.
	 * <p>* creationMinimum 메서드가 정의되어 있는 지 확인합니다.
	 * @memberof AbCommon
	 * @param {Object} o 도형 객체
	 * @return {Boolean} 정의하면 true
	 */
	hasCreationMinimum: function (o){
		return  o && o.shapeStyle
			&& typeof o.creationMinimum == 'function';
	},

	/**
	 * 객체가 클래스의 인스턴스인지 확인합니다.
	 * @memberof AbCommon
	 * @param {Object} o 객체
	 * @return {Boolean} 클래스의 인스턴스이면 true
	 */
	hasClass: function (o) { return o.constructor && o.constructor.name && o.constructor.name.toLowerCase() != 'object'; },

	/**
	 * HTML 엘리먼트의 크기와 뷰포트에서의 상대적인 위치를 반환합니다.
	 * @see {@link https://developer.mozilla.org/ko/docs/Web/API/Element/getBoundingClientRect} MDN 자료 참고
	 * @memberof AbCommon
	 * @param {HTMLElement} element HTML 엘리먼트
	 * @return {HTMLBounds} HTML 엘리먼트 크기 정보
	 */
	getBounds: function(element) { return element.getBoundingClientRect ? element.getBoundingClientRect() : { left: 0, top: 0, right: 0, bottom: 0, width: 0, height: 0 }; },

	/**
	 * 도형 복제 어드바이스 정보
	 * @typedef {Object} AbCommon.CloneAdvice
	 * @property {Array.<String>} [moveProps] 이동할 필드명 배열<p>* 이 배열에 등록된 필드는 대상 객체로 이동됩니다.
	 * @property {Array.<String>} [customProps] 사용자 작업을 수행할 필드명 배열<p>* 이 배열에 등록된 필드는 custom()을 통해 복제됩니다.
	 * @property {AbCommon.CloneAdviceCustomCallback} [custom] 사용자 복제 메서드
	 */

	/**
	 * 도형 복제 어드바이스 정보
	 * @callback AbCommon.CloneAdviceCustomCallback
	 * @param {String} name 필드명
	 * @param {*} object 필드값
	 * @return {*} 복제된 필드값
	 */

	/**
	 * 도형 객체를 복제합니다.
	 * <p>* 도형 객체가 제공하는 복제 어드바이스 정보를 참고합니다.
	 * <dl>객체 중 $$로 시작하는 필드를 참고합니다.
	 * 	<dt>$$CLONE</dt><dd>해당 객체를 복제할 지 참조할 지 결정합니다.</dd>
	 * 	<dt>$$CHAIN</dt><dd>해당 객체의 $$CHAIN 필드에 도형 객체를 참조합니다.</dd>
	 * </dl>
	 * @memberof AbCommon
	 * @param {Object} s 도형 객체
	 * @return {Object} 복제된 도형 객체
	 */
	cloneShape: function (s){
		function copyProp(dest, src, excludes){
			if (!$.isArray(excludes)) excludes = [];

			var advice = null;
			if (AbCommon.isFunction(s.adviceClone)){
				advice = s.adviceClone();
			}
	
			for (var p in src){				
				if (src.hasOwnProperty(p) && $.inArray(p, excludes) < 0){
					var o = src[p];

					if (advice){
						if (advice.moveProps && $.inArray(p, advice.moveProps) >= 0){
							dest[p] = o;
							delete src[p];

							continue;
						}
						
						if (advice.customProps && $.inArray(p, advice.customProps) >= 0){
							dest[p] = advice.custom(p, o);
							continue;
						}
					}

					if (!AbCommon.isSetted(o)){
						dest[p] = null;
					}else if ($.isArray(o)){
						dest[p] = o.slice(0);
					}else if (AbCommon.isString(o) || AbCommon.isNumber(o) || AbCommon.isBool(o)){
						dest[p] = o;
					}else if (AbCommon.isFunction(o)){
						dest[p] = o.bind(dest);
					}else{
						// var hasProp = o.hasOwnProperty('$$CLONE');
						// var hasProtoProp = o.prototype && o.prototype.hasOwnProperty('$$CLONE');
						// var hasProtoChainProp = o.__proto__ && o.__proto__.hasOwnProperty('$$CLONE');

						var cloning = true;
						if (AbCommon.hasClass(o)) cloning = o['$$CLONE'] === true;
							
						if (cloning){
							dest[p] = AbCommon.createObject(o);
							
							if (o['$$CHAIN']){
								copyProp(dest[p], o, [ o['$$CHAIN'] ]);
								if (o['$$CHAIN']) dest[p][o['$$CHAIN']] = cs;
							}else{
								copyProp(dest[p], o);
							}
						}else{
							dest[p] = o;
						}
					}
				}
			}
		}
		
		//var cs = {};
		//var cs = s.constructor();
		var cs = AbCommon.createObject(s);

		copyProp(cs, s);
		
		return cs;
	},

	/**
	 * 객체를 복제합니다.
	 * <dl>객체 중 $$로 시작하는 필드를 참고합니다.
	 * 	<dt>$$CLONE</dt><dd>해당 객체를 복제할 지 참조할 지 결정합니다.</dd>
	 * </dl>
	 * @memberof AbCommon
	 * @param {Object} s 객체
	 * @return {Object} 복제된 객체
	 */
	clone: function (s){
		function copyProp(dest, src){
			for (var p in src){
				if (src.hasOwnProperty(p)){
					var o = src[p];

					if (!AbCommon.isSetted(o)){
						dest[p] = null;
					}else if ($.isArray(o)){
						dest[p] = o.slice(0);
					}else if (AbCommon.isString(o) || AbCommon.isNumber(o) || AbCommon.isBool(o)){
						dest[p] = o;
					}else if (AbCommon.isFunction(o)){
						dest[p] = o.bind(dest);
					}else{
						var cloning = true;
						if (AbCommon.hasClass(o)) cloning = o['$$CLONE'] === true;
						
						if (cloning){
							dest[p] = AbCommon.createObject(o);
							copyProp(dest[p], o);
						}else{
							dest[p] = o;
						}
					}
				}
			}
		}
		
		var cs = AbCommon.createObject(s);
		copyProp(cs, s);
		
		return cs;
	},

	/**
	 * 객체를 깊은 복사 방식으로 복제합니다.
	 * @memberof AbCommon
	 * @param {Object} s 객체
	 * @return {Object} 복제된 객체
	 */
	deepClone: function (s){
		function copyProp(dest, src){
			for (var p in src){
				if (src.hasOwnProperty(p)){
					var o = src[p];

					if (!AbCommon.isSetted(o)){
						dest[p] = null;
					}else if ($.isArray(o)){
						dest[p] = o.slice(0);
					}else if (AbCommon.isString(o) || AbCommon.isNumber(o) || AbCommon.isBool(o)){
						dest[p] = o;
					}else if (AbCommon.isFunction(o)){
						dest[p] = o.bind(dest);
					}else{
						dest[p] = AbCommon.createObject(o);
						copyProp(dest[p], o);
					}
				}
			}
		}
		
		var cs = AbCommon.createObject(s);
		copyProp(cs, s);
		
		return cs;
	},

	/**
	 * 두 객체의 값을 비교합니다.
	 * @memberof AbCommon
	 * @param {*} actual 원본 객체
	 * @param {*} expected 대상 객체
	 * @return {Booelan} 두 객체의 값이 같으면 true
	 */
	equals: function (actual, expected){
		if (actual === expected) {
			return true;
		} else if (actual instanceof Date && expected instanceof Date) {
			return actual.getTime() === expected.getTime();
		} else if (typeof actual != 'object' && typeof expected != 'object') {
			return actual == expected;
		}

		function Object_keys(obj){
			if (typeof Object.keys === 'function') return Object.keys(obj);
			var keys = [];
			for (var key in obj) keys.push(key);
			return keys;
		}
		function isUndefinedOrNull(value) { return value === null || value === undefined; }
		function isArguments(object) { return Object.prototype.toString.call(object) == '[object Arguments]'; }
		function objEquiv(a, b) {
			if (isUndefinedOrNull(a) || isUndefinedOrNull(b)) return false;
			if (a.prototype !== b.prototype) return false;
			if (isArguments(a)) {
				if (!isArguments(b)) return false;
				a = Array.prototype.slice.call(a);
				b = Array.prototype.slice.call(b);
				return AbCommon.equals(a, b);
			}
			var ka = null, kb = null, key, i;
			try { ka = Object_keys(a); kb = Object_keys(b); } catch (e) { return false; }
			if (ka.length != kb.length)
				return false;

			ka.sort();
			kb.sort();

			for (i = ka.length - 1; i >= 0; i--)
				if (ka[i] != kb[i]) return false;

			for (i = ka.length - 1; i >= 0; i--) {
				key = ka[i];
				if (!AbCommon.equals(a[key], b[key])) return false;
			}
			return true;
		}
					
		return objEquiv(actual, expected);
	},
	
	//-----------------------------------------------------------

	/**
	 * 배열을 복제합니다.
	 * @memberof AbCommon
	 * @param {Array} a 원본 배열
	 * @param {Number} [start=0] 시작 위치
	 * @param {Number} [end=a.length] 종료 위치
	 * @return {Array} 복제된 배열
	 */
	copyArray: function (a, start, end){
		var len = a.length;
		if (arguments.length < 2) start = 0;
		if (arguments.length < 3) end = len;

		var ra = [];
		for (var i=start; i < end; i++)
			ra.push(a[i]);
		return ra;
	},
		
	//-----------------------------------------------------------

	/**
	 * 새 객체를 생성합니다.
	 * @see {@link https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Object/create} MDN 자료 참고
	 * @memberof AbCommon
	 * @param {Object} obj 새 객체의 프로토타입이 될 객체
	 * @return {Object} 생성된 객체
	 */
	createObject: function(obj){
		try { return Object.create(obj); }
		catch(e) { return obj.constructor ? obj.constructor() : {}; }	
	},

	/**
	 * 원본 객체의 필드를 대상 객체로 복제합니다.
	 * @memberof AbCommon
	 * @param {Object} src 원본 객체
	 * @param {Object} dest 대상 객체
	 * @param {Array} [props] 필드명 배열, 설정하면 해당 배열의 필드만 복제합니다.
	 * @return {Object} 대상 객체
	 */
	copyProp: function (src, dest, props){
		for (var p in src){
			if (src.hasOwnProperty(p) && (!props || $.inArray(p, props)>=0)){
				var o = src[p];

				if (!AbCommon.isSetted(o)){
					dest[p] = null;
				}else if ($.isArray(o)){
					dest[p] = o.slice(0);
				}else if (AbCommon.isString(o) || AbCommon.isNumber(o) || AbCommon.isBool(o)){
					dest[p] = o;
				}else{
					dest[p] = this.createObject(o);
					this.copyProp(o, dest[p]);
				}
			}
		}
		return dest;
	},

	/**
	 * 속성 객체의 필드를 도형 객체에 복제합니다.
	 * <p>* 도형 객체에 cloneProperty 메서드가 정의되어 있으면 필드 복제 전에 해당 메서드를 호출합니다.
	 * @memberof AbCommon
	 * @param {Object} shape 도형 객체
	 * @param {Array} props 속성 객체
	 * @return {Object} 도형 객체
	 */
	shapeProp: function (shape, props){
		function writeProp(shape, src, dest, path){
			if (!path) path = '';
			else path += '.';
			
			for (var p in src){
				if (src.hasOwnProperty(p)){
					var o = src[p];
					
					var isNotSet = !AbCommon.isSetted(o);
					var isArray = $.isArray(o);
					var isValue = AbCommon.isString(o) || AbCommon.isNumber(o) || AbCommon.isBool(o);
					
					if ( (isNotSet || isArray || isValue) && AbCommon.isFunction(shape.cloneProperty) )
						shape.cloneProperty(path + p, o);

					if (isNotSet){
						dest[p] = null;
					}else if (isArray){
						dest[p] = o.slice(0);
					}else if (isValue){
						dest[p] = o;
					}else{
						if (!AbCommon.isSetted(dest[p]))
							dest[p] = this.createObject(o);
						writeProp(shape, o, dest[p], path + p);
					}
				}
			}
		}
		
		writeProp(shape, props, shape);
		return shape;
	},
		
	//-----------------------------------------------------------

	/**
	 * 도형 객체와 연결된 엔진의 스케일 정보를 가져옵니다.
	 * @memberof AbCommon
	 * @param {Object} s 도형 객체
	 * @return {Point} 스케일 정보
	 */
	engineScale: function (s){
		return s && s.engine && s.engine.currentPage ? { x: s.engine.currentPage.scale.x, y: s.engine.currentPage.scale.y } : { x: 1, y: 1 };
	},
		
	//-----------------------------------------------------------
	// XML

	/**
	 * XML 헤더
	 * @memberof AbCommon
	 * @return {String} XML 헤더
	 */
	xmlHeader: function (){ return '<?xml version="1.0" encoding="UTF-8"?>'; },
	
	/**
	 * XML 문자열에서 헤더를 제거합니다.
	 * @memberof AbCommon
	 * @param {String} xmlString XML 문자열
	 * @return {String} 헤더가 제거된 XML 문자열
	 */
	removeXmlHeader: function(xmlString){
		return xmlString.replace(/^\s*<\?(.*)\?>\s*/g, '');
	},

	/**
	 * XML로 정의된 정보를 대상 객체로 복사합니다.
	 * @memberof AbCommon
	 * @param {Node} node XML 노드
	 * @param {Object} obj 대상 객체
	 */
	deserializeShapeXmlNode: function(node, obj){
		if (!node || !node.length) return;

		var childs = node.children();
		var clen = childs.length;
		for (var i=0; i < clen; i++){
			var cnode = $(childs.get(i));

			var name = cnode.get(0).tagName;
			if (cnode.attr('ptype') === 'group'){
				obj[name] = {};
				this.deserializeShapeXmlNode(cnode, obj[name]);
			}else{
				var value = null;
				if (cnode.attr('nul') != 'true'){
					var type = cnode.attr('type');
					value = cnode.text();
					if (type == 'json')
						value = JSON.parse(value);
					else if (type == 'number')
						value = parseFloat(value);
					else if (type == 'boolean')
						value = value == 'true' ? true : false;
				}

				obj[name] = value;
			}
		}
	},

	/**
	 * 도형 XML 정보로 속성 객체를 생성합니다.
	 * @memberof AbCommon
	 * @param {String} shapeXml 도형 XML 정보
	 * @return {Object} 생성된 속성 객체
	 */
	deserializeShape: function (shapeXml){
		if (!shapeXml) return null;

		var e = $($.parseXML(shapeXml));
		
		var prop = {};
		this.deserializeShapeXmlNode(e.find('shape'), prop);

		return prop;
	},
	
	//-----------------------------------------------------------
	
	/**
	 * XML Document에서 XML 문자열을 가져옵니다.
	 * @memberof AbCommon
	 * @param {XMLDocument} xmlDom XML Document
	 * @return {String} XML 문자열
	 */
	xmlString: function (xmlDom){
		return typeof XMLSerializer != 'undefined' ? (new XMLSerializer()).serializeToString(xmlDom) : xmlDom.xml;
	},
		
	//-----------------------------------------------------------

	/**
	 * 페이지 정의 XML
	 * @typedef {Object} XMLPageInfo
	 * @property {Node} 페이지 정보
	 * @property {Array.<Node>} 페이지 내 도형 정보
	 */

	/**
	 * 페이지 정의 XML 문자열을 파싱합니다.
	 * <p>* 페이지는 이미지를 말합니다.
	 * @memberof AbCommon
	 * @param {String} pageXml 페이지 정의 XML 문자열
	 * @return {XMLPageInfo} 페이지 정의 XML
	 */
	parsePageShapes: function (pageXml){
		if (!pageXml) return null;

		var e = $($.parseXML(pageXml));
		var r = [];

		var eshape = e.find('shape');
		return {
			body: e,
			shapes: eshape
		};
	},

	/**
	 * 페이지 정의 XML 문자열에서 도형 정보들을 파싱합니다.
	 * <p>* 페이지는 이미지를 말합니다.
	 * @memberof AbCommon
	 * @param {String} pageXml 페이지 정의 XML 문자열
	 * @return {Array} 도형 속성 객체 배열
	 */
	deserializePageShapes: function (pageXml){
		if (!pageXml) return null;

		var e = $($.parseXML(pageXml));
		var r = [];

		var eshape = e.find('shape');
		var len = eshape.length;
		for (var i=0; i < len; i++){
			var es = $(eshape.get(i));

			var prop = {};
			this.deserializeShapeXmlNode(es, prop);

			r.push(prop);
		}

		return r;
	},
		
	//-----------------------------------------------------------
	
	/**
	 * 값이 DATA URL 인지 확인합니다.
	 * @memberof AbCommon
	 * @param {String} s 값
	 * @return {Boolean} DATA URL이면 true
	 */
	isDataUrl: function (s){
		return s && AbCommon.isString(s) && s.indexOf('data:') == 0;
	},
	
	/**
	 * 값이 BLOB인지 확인합니다.
	 * @memberof AbCommon
	 * @param {String} s 값
	 * @return {Boolean} BLOB이면 true
	 */
	isBlobUrl: function (s){
		return s && AbCommon.isString(s) && s.indexOf('blob:') == 0;
	},

	/**
	 * DATA URL 문자열에서 내용을 추출합니다.
	 * @memberof AbCommon
	 * @param {String} value DATA URL 문자열
	 * @return {String} DATA URL 내용
	 */
	dataUrlContent: function (value){
		return value.substr(value.indexOf(',') + 1);
	},
	
	//-----------------------------------------------------------
	
	/**
	 * HTML 이미지 객체를 생성합니다.
	 * <p>* IE에서 호출하는 경우 crossOrigin을 설정합니다.
	 * <blockquote>IE에서는 로컬 이미지를 로드하면 SecurityError가 발생합니다. 반면 맥용 사파리에서는 crossOrigin을 설정하면 CORS 오류가 발생합니다.</blockquote>
	 * @memberof AbCommon
	 * @return {Image} HTML 이미지 객체
	 */
	createImage: function(){
		var img = new Image();
		
		// IE에서는 로컬 이미지를 로드하면 SecurityError가 발생한다.
		// 하지만, 맥용 사파리에서는 crossOrigin을 세팅하면 CORS 오류가 발생한다.
		// 따라서, IE인 경우만 crossOrigin을 세팅한다.
		if (AbCommon.ieVersion() != -1)
			img.crossOrigin = 'Anonymous';
		
		return img;
	},
	
	/**
	 * 이미지를 불러옵니다.
	 * @memberof AbCommon
	 * @param {String} url 이미지 URL
	 * @return {Promise} Promise 객체
	 */
	loadImage: function (url){
		return new Promise(function(resolve, reject){
			var img = AbCommon.createImage();
			/**
			 * @param {Event} e HTML Event
			 */
			img.onload = function(e){
				setTimeout(resolve.bind(null, this), 0);
			};
			/**
			 * @param {Event} e HTML Event
			 */
			img.onerror = function(e){
				setTimeout(reject.bind(null, new Error('It is not an image file')), 0);
			};
			img.src = url;
		});
	},
	
	/**
	 * 이미지를 DATA URL 형태로 불러옵니다.
	 * @memberof AbCommon
	 * @param {String} url 이미지 URL
	 * @return {Promise} Promise 객체
	 */
	loadImageAsDataURL: function (url){
		return new Promise(function(resolve, reject){
			if (AbCommon.isDataUrl(url)){
				resolve(url);
			}else{
				var fileReader = new FileReader();
				fileReader.onload = function(e){
					resolve(e.target.result);
				};
				
				var xhr = AbCommon.xmlHttpRequest({
					path: url,
					responseType: 'blob',
					
					load: function (e, xhr){
						fileReader.readAsDataURL(xhr.response);
					},
					
					error: function (e, xhr){
						reject(e);
					},
				});
				
				xhr.send();
			}
		});
	},
	
	/**
	 * 이미지를 불러옵니다. (기능 확장)
	 * <p>SVG 이미지는 렌더링합니다.
	 * @private
	 * @memberof AbCommon
	 * @param {String} url 이미지 URL
	 * @param {Object} [options] 옵션
	 */
	loadImageExt: function(url, options){
		if (!options) options = {};
		
		var browser = AbCommon.getBrowser();
		//var isIE = AbCommon.ieVersion() != -1;
		var isIE = browser === 'ie';
		var isFIREFOX = browser === 'firefox';
		var isNSB = isIE || isFIREFOX;
		
		var isDataUrl = AbCommon.isDataUrl(url);
		
		var isNotSupportSVG = isNSB && !isDataUrl && url.toLowerCase().lastIndexOf('.svg') == url.length - 4;
		
		if (isNotSupportSVG){
			AbCommon.ajax({
				type: 'GET',
				url: url,
				data: null,
				dataType: 'text',
				timeout: 1000000,
				success: function (result) {
					try
					{
						var xml = $($.parseXML(result));
						var svg = xml.find('svg').get(0);
						var esvg = $(svg);
						
						if (AbCommon.isNumber(options.width))
							esvg.attr('width', options.width);
						
						if (AbCommon.isNumber(options.height))
							esvg.attr('height', options.height);
						
						var width = esvg.attr('width');
						var height = esvg.attr('height');
						
						try { width = parseInt(width); } catch (e) { width = null; }
						try { height = parseInt(height); } catch (e) { height = null; }
						
						if (isNaN(width)) width = null;
						if (isNaN(height)) height = null;
						
						var xmlDom = xml.get(0);
						var xmlText = AbCommon.xmlString(xmlDom);
						console.log(xmlText);
						
						AbVendor.renderSVG(xmlText, width, height, function (ctx, svgDom){
							var src = AbGraphics.canvas.toImage(ctx, 'png');
							
							var img = AbCommon.createImage();
							
							img.onerror = function(e){
								if (AbCommon.isFunction(options.error))
									options.error(e);
							}.bind(this);
							img.onload = function (){
								if (AbCommon.isFunction(options.success))
									options.success(img);
							}.bind(this);
							img.src = src;
						});
					}
					catch(e)
					{
						if (AbCommon.isFunction(options.error))
							options.error(e);
					}
				}.bind(this),
				
				error: function (XMLHttpRequest, textStatus, errorThrown) {
					if (AbCommon.isFunction(options.error))
						options.error(new Error('SVG load error: ' + textStatus));
				}.bind(this)
			});
		}else{
			var img = AbCommon.createImage();
			
			img.onerror = function(e){
				if (AbCommon.isFunction(options.error))
					options.error(e);
			}.bind(this);
			img.onload = function (){
				if (AbCommon.isFunction(options.success))
					options.success(img);
			}.bind(this);
			img.src = url;
		}
	},
	
//	loadImageXHR: function (url){
//		// IE SecurityError 해결을 위해 XHR 이용
//		var isIE = AbCommon.ieVersion() != -1;
//		var isDATAURL = AbCommon.isDataUrl(url);
//		
//		// IE이고, 서버 이미지 URL이면 XHR을 이용한다.
//		if (isIE && !isDATAURL){
//			return new Promise(function(resolve, reject){
//				var xhr = AbCommon.xmlHttpRequest({
//					path: url,
//					responseType: 'blob',
//					
//					load: function(e, $xhr){
//						// alloc
//						var rurl = URL.createObjectURL(xhr.response);
//						
//						var img = AbCommon.createImage();
//						img.onload = function(e){
//							// release
//							URL.revokeObjectURL(rurl);
//							
//							setTimeout(resolve.bind(null, this), 0);
//						};
//						img.onerror = function(e){
//							console.log(e);
//							
//							// release
//							URL.revokeObjectURL(rurl);
//							
//							setTimeout(reject.bind(null, new Error('It is not an image file')), 0);
//						};
//						img.src = rurl;
//					},
//					
//					error: function (e, $xhr){
//						console.log(e);
//						
//						setTimeout(reject.bind(null, new Error('It is not an image file')), 0);
//					}
//				});
//				
//				xhr.send();
//			});
//		}else{
//			return new Promise(function(resolve, reject){
//				var img = AbCommon.createImage();
//				img.onload = function(e){
//					setTimeout(resolve.bind(null, this), 0);
//				};
//				img.onerror = function(e){
//					setTimeout(reject.bind(null, new Error('It is not an image file')), 0);
//				};
//				img.src = url;
//			});
//		}
//	},
	
	//-------------------------------------------------------------------------------------------------------
	// Ajax
	//-------------------------------------------------------------------------------------------------------

	/**
	 * Ajax을 호출합니다.
	 * @memberof AbCommon
	 * @see {@link http://api.jquery.com/jquery.ajax/} jQuery.ajax() | jQuery API Documentation
	 * @param {Object} options 옵션
	 * @param {Object} options.url 요청 URL
	 * @param {Object} [options.caller] 콜백 함수의 this 지정자
	 * @param {(String|Number|Boolean|Object|Array)} [options.data] 요청 URL로 전달할 값
	 * @param {String} [options.type=POST] 전송 방식 (GET|HEAD|POST|PUT|DELETE|CONNECT|OPTIONS|TRACE|PATCH)
	 * @param {String} [options.dataType=json] 회신 데이터 유형 (xml|html|script|json|jsonp|text)
	 * @param {Number} [options.timeout=1000000] 요청 시간제한
	 * @param {Boolean} [options.logAll=false] 모든 로그를 콘솔에 남길 지 여부
	 * @param {Boolean} [options.logSuccess=false] 회신 성공한 로그를 콘솔에 남길 지 여부
	 * @param {Boolean} [options.logFail=true] 오류 또는 회신 실패한 로그를 콘솔에 남길 지 여부
	 * @param {Boolean} [options.async=true] 비동기 요청 여부
	 * @param {Boolean} [options.useResponseType=false] 요청 URL에 responseType 필드를 추가할 지 여부
	 * @param {Number} [options.delayExec=0] 성공 및 오류 대한 처리 대기 시간
	 * @param {LoadingCallback} [options.loadFunc] 로더 표시 콜백 함수
	 * @param {String} [options.title] 로그 작성 시의 타이틀
	 * @param {AjaxSuccessCallback} [options.success] 성공 시 호출되는 콜백 함수
	 * @param {AjaxErrorCallback} [options.error] 오류 시 호출되는 콜백 함수
	 */
	ajax: function (options) {
		if (!options || !options.url || options.url.replace(/\s/g, '') == '')
			return;
	
		if (!options.type)
			options.type = 'POST';
		else
			options.type = options.type.toUpperCase();
	
		if (!options.dataType)
			options.dataType = 'json';
		else
			options.dataType = options.dataType.toLowerCase();
	
		if (!options.timeout || options.timeout <= 0)
			options.timeout = 1000000;
	
		if (!AbCommon.isDefined(options.loading)) options.loading = true;
	
		var logAll = typeof options.logAll == 'boolean' ? options.logAll : false;
		var logSuccess = typeof options.logSuccess == 'boolean' ? options.logSuccess : false;
		var logFail = typeof options.logFail == 'boolean' ? options.logFail : true;
		var asyncExec = typeof options.async == 'boolean' ? options.async : true;
	
		//var url = $url(options.url);
		var url = options.url;
	
		if (options.useResponseType === true) {
			if (url.indexOf('?') >= 0)
				url += '&';
			else
				url += '?';
	
			url += 'responseType=' + options.dataType;
		}
	
		//--------------------------------------------------------
	
		var delayExec = options.delayExec || 0;
	
		//--------------------------------------------------------
	
		if (AbCommon.isFunction(options.loadFunc)) options.loadFunc.call(options.caller || options.loadFunc, true);
	
		//--------------------------------------------------------
	
		$.ajax({
			type: options.type,
			url: url,
			data: options.data,
			async: asyncExec,
			dataType: options.dataType,
			timeout: options.timeout,
			success: function (result) {
				if (AbCommon.isFunction(options.loadFunc)) options.loadFunc.call(options.caller || options.loadFunc, false);
	
				var successFunc = function () {
					var result = arguments.callee.result;
					var options = arguments.callee.options;
					var logAll = arguments.callee.logAll;
					var logSuccess = arguments.callee.logSuccess;
					var logFail = arguments.callee.logFail;
	
					if (logAll || logSuccess) {
						var title = options.title ? options.title + '에 실패했습니다\n' : ''
						var msg = title + ' 전송 성공';
	
						// try {
						// 	msg += ' responseText:' + toString(responseText) + ', statusText:' + statusText + ', xhr:' + xhr + ', $form:' + $form;
						// } catch (e) { }
	
						console.log(msg);
					}
	
					if (options.success && typeof options.success == 'function')
						options.success.call(options.caller ? options.caller : options.success, result);
				};
				successFunc.result = result;
				successFunc.options = options;
				successFunc.logAll = logAll;
				successFunc.logSuccess = logSuccess;
				successFunc.logFail = logFail;
				
				if (asyncExec && delayExec >= 0)
					setTimeout(successFunc, delayExec);
				else
					successFunc();
	
			},
			error: function (XMLHttpRequest, textStatus, errorThrown) {
				if (AbCommon.isFunction(options.loadFunc)) options.loadFunc.call(options.caller || options.loadFunc, false);
	
				var errorFunc = function () {
					var xhr = arguments.callee.xhr;
					var textStatus = arguments.callee.ts;
					var errorThrown = arguments.callee.et;
					var options = arguments.callee.options;
					var logAll = arguments.callee.logAll;
					var logSuccess = arguments.callee.logSuccess;
					var logFail = arguments.callee.logFail;
	
					var r = AbCommon.remoteErrorProcess(options, xhr, textStatus, errorThrown, logAll || logFail);
	
					if (options.error && typeof options.error == 'function')
						options.error.call(options.caller ? options.caller : options.error, xhr, textStatus, errorThrown);
	
					if (AbCommon.isFunction(r.retfunc)) {
						var vRetFunc = function () {
							var callback = arguments.callee.callback;
							callback.call(arguments.callee.owner || callback);
						};
						vRetFunc.owner = options.caller;
						vRetFunc.callback = r.retfunc;
	
						setTimeout(vRetFunc, delayExec);
					}
				};
				errorFunc.xhr = XMLHttpRequest;
				errorFunc.ts = textStatus;
				errorFunc.et = errorThrown;
				errorFunc.options = options;
				errorFunc.logAll = logAll;
				errorFunc.logSuccess = logSuccess;
				errorFunc.logFail = logFail;
	
				if (asyncExec && delayExec >= 0)
					setTimeout(errorFunc, delayExec);
				else
					errorFunc();
			}
		});
	},


	//--------------------------------------------------------

	/**
	 * HTML 양식을 Ajax로 전송합니다.
	 * <p>* jQuery Form Plugin을 사용합니다.
	 * @memberof AbCommon
	 * @see {@link https://github.com/malsup/form} Project repository
	 * @see {@link http://malsup.com/jquery/form/} Examples and documentation
	 * @param {(String|jQueryObject)} formSelector 양식 선택자 또는 양식 jQuery 객체
	 * @param {Object} options 옵션
	 * @param {Object} options.url 요청 URL
	 * @param {Object} [options.caller] 콜백 함수의 this 지정자
	 * @param {(String|Number|Boolean|Object|Array)} [options.data] 요청 URL로 전달할 값
	 * @param {String} [options.type=POST] 전송 방식 (GET|HEAD|POST|PUT|DELETE|CONNECT|OPTIONS|TRACE|PATCH)
	 * @param {String} [options.dataType=json] 회신 데이터 유형 (xml|html|script|json|jsonp|text)
	 * @param {Number} [options.timeout=1000000] 요청 시간제한
	 * @param {Boolean} [options.logAll=false] 모든 로그를 콘솔에 남길 지 여부
	 * @param {Boolean} [options.logSuccess=false] 회신 성공한 로그를 콘솔에 남길 지 여부
	 * @param {Boolean} [options.logFail=true] 오류 또는 회신 실패한 로그를 콘솔에 남길 지 여부
	 * @param {Boolean} [options.async=true] 비동기 요청 여부
	 * @param {Boolean} [options.useResponseType=false] 요청 URL에 responseType 필드를 추가할 지 여부
	 * @param {Number} [options.delayExec=0] 성공 및 오류 대한 처리 대기 시간
	 * @param {LoadingCallback} [options.loadFunc] 로더 표시 콜백 함수
	 * @param {String} [options.title] 로그 작성 시의 타이틀
	 * @param {AjaxSubmitBeforeCallback} [options.beforeSubmit] 전송 전 호출되는 콜백 함수
	 * @param {AjaxSubmitSuccessCallback} [options.success] 성공 시 호출되는 콜백 함수
	 * @param {AjaxSubmitErrorCallback} [options.error] 오류 시 호출되는 콜백 함수
	 */
	ajaxSubmit: function(formSelector, options) {
		if (!options || !options.url || options.url.replace (/\s/g,'') == '')
			return;

		if (!options.type) options.type = 'POST';
		else options.type = options.type.toUpperCase();

		if (!options.dataType) options.dataType = 'json';
		else options.dataType = options.dataType.toLowerCase();

		if (!options.timeout || options.timeout <= 0) options.timeout = 1000000;

		if (!AbCommon.isDefined(options.loading)) options.loading = true;

		var logAll = options.logAll && typeof options.logAll == 'boolean' ? options.logAll : false;
		var logSuccess = options.logSuccess && typeof options.logSuccess == 'boolean' ? options.logSuccess : false;
		var logFail = options.logFail && typeof options.logFail == 'boolean' ? options.logFail : true;

		//var url = $url(options.url);
		var url = options.url;

		if (options.useResponseType === true) {
			if (url.indexOf('?') >= 0) url += '&'; else url += '?';
			url += 'responseType=' + options.dataType;
		}

		//--------------------------------------------------------

		var delayExec = options.delayExec || 100;

		//--------------------------------------------------------

		if (AbCommon.isFunction(options.loadFunc)) options.loadFunc.call(options.caller || options.loadFunc, true);

		//--------------------------------------------------------

		var frm = typeof formSelector == 'string' ? $(formSelector) : formSelector;

		frm.ajaxSubmit({
			url: url,
			type: options.type,
			data: options.data,
			dataType: options.dataType,
			timeout: options.timeout,

			beforeSubmit: function (data, frm, opt) {
				if (options.beforeSubmit && typeof options.beforeSubmit == 'function')
					return options.beforeSubmit.call(options.caller ? options.caller : options.beforeSubmit, data, frm, opt);
				else
					return true;
			},

			success: function (responseText, statusText, xhr, $form) {
				if (AbCommon.isFunction(options.loadFunc)) options.loadFunc.call(options.caller || options.loadFunc, false);

				var successFunc = function () {
					var responseText = arguments.callee.responseText;
					var statusText = arguments.callee.statusText;
					var xhr = arguments.callee.xhr;
					var $form = arguments.callee.$form;
					var options = arguments.callee.options;
					var logAll = arguments.callee.logAll;
					var logSuccess = arguments.callee.logSuccess;
					var logFail = arguments.callee.logFail;

					if (logAll || logSuccess) {
						var title = options.title ? options.title + '에 실패했습니다\n' : ''
						var msg = title + ' 전송 성공';

						// try {
						// 	msg += ' responseText:' + toString(responseText) + ', statusText:' + statusText + ', xhr:' + xhr + ', $form:' + $form;
						// } catch (e) { }

						console.log(msg);
					}

					if (options.success && typeof options.success == 'function')
						options.success.call(options.caller ? options.caller : options.success, responseText, statusText, xhr, $form);
				};
				successFunc.responseText = responseText;
				successFunc.statusText = statusText;
				successFunc.xhr = xhr;
				successFunc.$form = $form;
				successFunc.options = options;
				successFunc.logAll = logAll;
				successFunc.logSuccess = logSuccess;
				successFunc.logFail = logFail;

				setTimeout(successFunc, delayExec);
			},

			error: function (xhr, textStatus, errorThrown, $form) {
				if (AbCommon.isFunction(options.loadFunc)) options.loadFunc.call(options.caller || options.loadFunc, false);

				var errorFunc = function () {
					var xhr = arguments.callee.xhr;
					var textStatus = arguments.callee.ts;
					var errorThrown = arguments.callee.et;
					var $form = arguments.callee.form;
					var options = arguments.callee.options;
					var logAll = arguments.callee.logAll;
					var logSuccess = arguments.callee.logSuccess;
					var logFail = arguments.callee.logFail;

					var r = AbCommon.remoteErrorProcess(options, xhr, textStatus, errorThrown, logAll || logFail);

					if (options.error && typeof options.error == 'function')
						options.error.call(options.caller ? options.caller : options.error, r, $form);

					if (AbCommon.isFunction(r.retfunc)) {
						var vRetFunc = function () {
							var callback = arguments.callee.callback;
							callback.call(arguments.callee.owner || callback);
						};
						vRetFunc.owner = options.caller;
						vRetFunc.callback = r.retfunc;

						setTimeout(vRetFunc, delayExec);
					}
				};
				errorFunc.xhr = xhr;
				errorFunc.ts = textStatus;
				errorFunc.et = errorThrown;
				errorFunc.form = $form;
				errorFunc.options = options;
				errorFunc.logAll = logAll;
				errorFunc.logSuccess = logSuccess;
				errorFunc.logFail = logFail;

				setTimeout(errorFunc, delayExec);
			}
		});
	},
	
	//-------------------------------------------------------------------------------------------------------
	// Ajax 오류 메시지 관련 함수
	//-------------------------------------------------------------------------------------------------------
	
	/**
	 * Ajax 오류 메시지를 작성합니다.
	 * @memberof AbCommon
	 * @param {XMLHttpRequest} XMLHttpRequest XMLHttpRequest 객체
	 * @param {String} textStatus 상태 정보
	 * @param {String} errorThrown 발생한 오류 정보
	 * @return {String} 오류 메시지
	 */
	toStringAjaxFail: function (XMLHttpRequest, textStatus, errorThrown) {
		if (XMLHttpRequest) {
			return AbCommon.toStringXmlHttpRequest(XMLHttpRequest);
		} else {
			return 'Status: ' + textStatus;
		}
	},
	
	/**
	 * XML Http Request 객체에서 오류메시지를 가져옵니다.
	 * @memberof AbCommon
	 * @param {XMLHttpRequest} XMLHttpRequest XMLHttpRequest 객체
	 * @return {String} 오류메시지
	 */
	toStringXmlHttpRequest: function(XMLHttpRequest) {
		if (XMLHttpRequest) {
			var s = '';
	
			if (XMLHttpRequest.responseJSON) {
				var msg = XMLHttpRequest.responseJSON.Message || XMLHttpRequest.responseJSON.message;
				var etype = XMLHttpRequest.responseJSON.ExceptionType || XMLHttpRequest.responseJSON.exceptionType;
				var emsg = XMLHttpRequest.responseJSON.ExceptionMessage || XMLHttpRequest.responseJSON.exceptionMessage;
	
				if (etype && emsg)
					//s += emsg;
					s += msg + ' [' + etype + ']: ' + emsg + '';
				else if (etype)
					s += msg + ' [' + etype + ']';
				else if (emsg)
					//s += emsg;
					s += msg + ' [Exception]: ' + emsg + '';
				else
					s += msg;
			} else if (XMLHttpRequest.responseText) {
				s += XMLHttpRequest.responseText;
			}
	
			if (s.length) s += '\n\n';
			s += 'Status: ' + XMLHttpRequest.status;
	
			if (XMLHttpRequest.statusText)
				s += ' (' + XMLHttpRequest.statusText + ')';
	
			return s;
		}
		return '' + XMLHttpRequest;
	},	

	/**
	 * XML Http Request 객체의 responseJSON 필드에서 회신 정보를 추출합니다.
	 * @memberof AbCommon
	 * @param {XMLHttpRequest} xhr XMLHttpRequest 객체
	 * @return {XmlHttpRequestResponseInfo} 회신 정보
	 */
	readxhr: function(xhr) {
		var json = AbCommon.isDefined(xhr.responseJSON) ? xhr.responseJSON : null;
	
		if (json) {
			var xhrd = {
				status: null,
				exception: null,
				errorCode: null,
				messageType: null,
				message: null,
				stackTrace: null,
				token: null,
			};
	
			if (AbCommon.isDefined(xhr.status)) xhrd.status = xhr.status;
			
			if (AbCommon.isDefined(json.Name)) xhrd.exception = json.Name;
			if (AbCommon.isDefined(json.ErrorCode)) xhrd.errorCode = json.ErrorCode;
			if (AbCommon.isDefined(json.MessageType)) xhrd.messageType = json.MessageType;
			if (AbCommon.isDefined(json.Message)) xhrd.message = json.Message;
			if (AbCommon.isDefined(json.StackTrace)) xhrd.stackTrace = json.StackTrace;
			if (AbCommon.isDefined(json.Token)) xhrd.token = json.Token;
	
			return xhrd;
		}
		return null;
	},
	
	/**
	 * 원격 오류 정보를 추출합니다.
	 * @memberof AbCommon
	 * @param {XMLHttpRequest} xhr XMLHttpRequest 객체
	 * @param {String} textStatus 상태 정보
	 * @param {String} errorThrown 발생한 오류 정보
	 * @return {XmlHttpRequestResponseInfo} 회신 정보
	 */
	readRemoteError: function(xhr, textStatus, errorThrown) {
		var xhrd = AbCommon.readxhr(xhr);
		if (!xhrd) xhrd = {};
		xhrd.textStatus = textStatus;
		xhrd.errorThrown = errorThrown;
		return xhrd;
	},
	
	/**
	 * 오류 메시지를 추출하는 작업을 수행합니다.
	 * @memberof AbCommon
	 * @param {Object} options Ajax 옵션 ({@link AbCommon.ajax}와 {@link AbCommon.ajaxSubmit}를 참고하세요)
	 * @param {XMLHttpRequest} xhr XMLHttpRequest 객체
	 * @param {String} textStatus 상태 정보
	 * @param {String} errorThrown 발생한 오류 정보
	 * @param {Boolean} [logging] 콘솔 기록 여부
	 * @return {XHRRemoteErrorProcessResult} 오류 메시지 추출 수행 결과 정보
	 */
	remoteErrorProcess: function(options, xhr, textStatus, errorThrown, logging) {
		var rerror = AbCommon.readRemoteError(xhr);
		var skip = false, r = null, func = null, arg = null;
		var skipRetFunc = null;
		var msg = null;
	
		if (AbCommon.isFunction(options.confirm)) {
			r = options.confirm.call(options.caller || options.confirm, rerror);
		} else if (options.skips) {
			if (AbCommon.isFunction(options.skips.errorcode)) {
				func = options.skips.errorcode;
				arg = rerror.errorCode;
			} else if (AbCommon.isFunction(options.skips.status)) {
				func = options.skips.status;
				arg = rerror.status;
			} else if (options.skips.type && AbCommon.isFunction(options.skips.type[rerror.messageType])) {
				r = options.skips.type[rerror.messageType];
			} else if (options.skips.token && AbCommon.isFunction(options.skips.token[rerror.token])) {
				r = options.skips.token[rerror.token];
			} else if (options.skips.exception && AbCommon.isFunction(options.skips.exception[rerror.exception])) {
				r = options.skips.exception[rerror.exception];
			}
	
			if (func) r = func.call(options.caller || func, arg);
		}
	
		func = null;
		arg = null;
	
		if (r === false) skip = true;
		else if (AbCommon.isFunction(r)) {
			skip = true;
			skipRetFunc = r;
		}
	
		if (!skip) {
			if (options.msgs) {
				if (AbCommon.isFunction(options.msgs)) {
					func = options.msgs;
					arg = rerror;
				} else {
					if (AbCommon.isFunction(options.msgs.errorcode)) {
						func = options.msgs.errorcode;
						arg = rerror.errorCode;
					} else if (AbCommon.isFunction(options.msgs.status)) {
						func = options.msgs.status;
						arg = rerror.status;
					} else if (options.msgs.type && options.msgs.type[rerror.messageType]) {
						msg = options.msgs.type[rerror.messageType];
					} else if (options.msgs.token && options.msgs.token[rerror.token]) {
						msg = options.msgs.token[rerror.token];
					} else if (options.msgs.exception && options.msgs.exception[rerror.exception]) {
						msg = options.msgs.exception[rerror.exception];
					}
				}
	
				if (func) msg = func.call(options.caller || func, arg);
			}
	
			/*
			if (options.msgs) {
				if (isFunction(options.msgs)) {
					msg = options.msgs.call(options.caller || options.msgs, rerror.exception);
				} else {
					if (rerror.exception) msg = options.msgs[rerror.exception];
					else msg = options.msgs[rerror.status];
				}
			}
			*/
	
			if (msg == null) msg = AbCommon.toStringAjaxFail(xhr, textStatus, errorThrown);
	
			var title = options.title ? options.title + '에 실패했습니다\n' : ''
			if (!msg) msg = '';
			msg = title + msg;
	
			if (msg && !options.nomsg) {
				if (logging) console.log(msg);
	
				if (AbCommon.isFunction(options.msgFunc))
					options.msgFunc.call(options.caller || options.msgFunc, msg);
				else
					AbMsgBox.error(msg);
			}
		}
	
		return {
			message: msg,
			retfunc: skipRetFunc
		};
	},
	
	//-------------------------------------------------------------------------------------------------------
	// XML Http Request 관련 함수
	//-------------------------------------------------------------------------------------------------------
	
	/**
	 * XML HTTP Request(XHR) 객체를 생성합니다.
	 * @memberof AbCommon
	 * @param {Object} [options] 수행 옵션
	 * @param {Boolean} [options.async=true] 비동기 요청 여부
	 * @param {String} [options.type=GET] 전송 방식 (GET|HEAD|POST|PUT|DELETE|CONNECT|OPTIONS|TRACE|PATCH)
	 * @param {String} [options.path] 요청 URL
	 * @param {String} [options.responseType] 회신 받을 타입 (arraybuffer|blob|document|json|text)
	 * @param {XHRProgressCallback} [options.progress] 진행 중 호출되는 콜백 함수
	 * @param {XHRLoadCallback} [options.load] 로드 후 호출되는 콜백 함수
	 * @param {XHRErrorCallback} [options.error] 오류 시 호출되는 콜백 함수
	 * @return {XMLHttpRequest} XML HTTP Request(XHR) 객체
	 */
	xmlHttpRequest: function(options){
		if (!options) options = {};
		var xhr = new XMLHttpRequest();
		var asyncExec = typeof options.async == 'boolean' ? options.async : true;

		if (options.path)
			xhr.open(options.type || 'GET', options.path, asyncExec);

		// arraybuffer
		// blob
		// document
		// json
		// text
		xhr.mozResponseType = xhr.responseType = options.responseType || 'arraybuffer';

		if (options.progress)
			xhr.onprogress = options.progress;

		if (options.load)
			xhr.onload = function(e){
				if (this.status == 200 || this.status === 0) {
					if (AbCommon.isFunction(options.load))
						options.load.call(options, e, xhr);
				}else{
					if (AbCommon.isFunction(options.error))
						options.error.call(options, new Error('Could not load'), xhr);
				}
			};

		if (options.error)
			xhr.onerror = function(e){
				if (AbCommon.isFunction(options.error))
					options.error.call(options, e, xhr);
			};

		return xhr;
	},

	/**
	 * XML HTTP Request(XHR) 객체에서 arrayBuffer 데이터를 가져옵니다.
	 * @memberof AbCommon
	 * @param {XMLHttpRequest} xhr XML HTTP Request(XHR) 객체
	 * @return {arrayBuffer} arrayBuffer 데이터
	 */
	xhrArrayBufferResponse: function (xhr){
		return xhr.mozResponseArrayBuffer || xhr.mozResponse || xhr.responseArrayBuffer || xhr.response;
	},
	
	/**
	 * arrayBuffer 데이터를 base64로 인코딩합니다.
	 * @memberof AbCommon
	 * @param {arrayBuffer} ab arrayBuffer 데이터
	 * @return {String} base64 인코딩 문자열 
	 */
	arrayBufferToBase64: function (ab){
		var a = new Uint8Array(ab);
		var raw = String.fromCharCode.apply(null, a);
		return btoa(raw);
	},
	
	/**
	 * arrayBuffer 데이터를 DATA URL로 인코딩합니다.
	 * @memberof AbCommon
	 * @param {arrayBuffer} ab arrayBuffer 데이터
	 * @param {String} mimeType MIME-TYPE
	 * @return {String} DATA URL 문자열
	 */
	arrayBufferToDataUrl: function (ab, mimeType){
		var b64 = this.arrayBufferToBase64(ab);
		return 'data:' + mimeType + ';base64,' + b64; 
	},
	
	//-------------------------------------------------------------------------------------------------------
	// 분할 전송용 양식 컨트럴러
	//-------------------------------------------------------------------------------------------------------

	/**
	 * 분할 전송용 양식 컨트럴러를 생성합니다.
	 * @memberof AbCommon
	 * @param {*} selector 
	 * @param {*} fields 
	 * @return {AbCommon.SplitedDataFormController} HTML 양식 컨트롤러
	 */
	formController: function(selector, fields){
		if (AbCommon.isString(fields)) fields = fields.split(/,/g);
		
		var pa = ['partials', 'partial', 'content'];
		
		for (var i = 0; i < pa.length; i++){
			if ($.inArray(pa[i], fields) < 0)
				fields.push(pa[i]);
		}
		
		var html = '<form enctype="multipart/form-data">';
		
		var len = fields.length, nums = 0;
		var ra = [];
		for (var i=0; i < len; i++){
			var field = fields[i];
			
			if (!field) continue;
			
			field = $.trim(field);
			ra.push(field);
			
			html += '<input type="hidden" name="'+field+'"/>';
			nums++;
		}
		html += '</form>';
		
		var forms = $(selector);
		var eform = $(html);
		
		forms.append(eform);
		
		/**
		 * 분할 전송용 양식 컨트럴러
		 * @namespace SplitedDataFormController
		 * @memberof AbCommon
		 */
		var formController = {
			forms: forms,
			form: eform,
			
			_fields: ra,

			/**
			 * 양식을 초기화합니다.
			 * @memberof AbCommon.SplitedDataFormController
			 */
			reset: function (){
				this.partial.val('');
				this.partials.val('');
				this.content.val('');				
			},
			
			/**
			 * 데이터를 기록합니다.
			 * @memberof AbCommon.SplitedDataFormController
			 * @param {Number} index 현재 파트의 인덱스
			 * @param {Number} total 전체 파트 개수
			 * @param {String} content 데이터
			 */
			record: function(index, total, content){
				this.partial.val(index);
				this.partials.val(total);
				this.content.val(content);
			},
			
			/**
			 * 양식을 삭제합니다.
			 * @memberof AbCommon.SplitedDataFormController
			 */
			dispose: function(){
				this.form.remove();
			},
			
			/**
			 * 로그 작성용
			 * @memberof AbCommon.SplitedDataFormController
			 * @private
			 * @param {*} token 
			 * @param {*} exclude 
			 */
			toString: function (token, exclude){
				if (!$.isArray(exclude)) exclude = exclude.split(/,/g);
				if (!token) token = '';
				var len = this._fields.length;
				var out = [];
				for (var i=0; i < len; i++){
					var field = this._fields[i];
					
					if ($.isArray(exclude) && $.inArray(field, exclude) >= 0)
						continue;
					
					out.push('[' + field + ']=' + this[field].val());
				}
				return out.join(token);
			},
		};
		
		len = ra.length;
		for (var i=0; i < len; i++){
			var field = ra[i];
			
			formController[field] = eform.find('[name="'+field+'"]');
		}
		
		return formController;
	},
	
	//-------------------------------------------------------------------------------------------------------
	// 분할 SUBMIT 관련 함수
	//-------------------------------------------------------------------------------------------------------
	
	/**
	 * 분할 전송을 수행합니다.
	 * @memberof AbCommon
	 * @param {Object} options 수행 옵션
	 * @param {Object} options.url 대상 URL
	 * @param {Object} options.content 전송 데이터
	 * @param {AbCommon.SplitedDataFormController} options.formController 분할 전송용 양식 컨트럴러 객체
	 * @param {Object} [options.delay=10] 다음 파트 전송 대기 시간
	 * @param {Object} [options.splitSize=30720] 분할 크기 (단위: 바이트)
	 * @param {AjaxSubmitSuccessCallback} [options.success] 성공 시 호출되는 콜백 함수
	 * @param {AjaxSubmitErrorCallback} [options.error] 오류 시 호출되는 콜백 함수
	 */
	submitPartialContent: function (options){
		if (!options) options = {};
		if (!AbCommon.isNumber(options.delay)) options.delay = 10;
		if (!AbCommon.isNumber(options.splitSize)) options.splitSize = 30720; // 30KB
		
		if (!options.url)
			throw new Error('[PARTIAL-SUBMIT] URL is null or empty!!!');
		
		if (!options.content)
			throw new Error('[PARTIAL-SUBMIT] CONTENT is null or empty!!!');
		
		if (!options.formController)
			throw new Error('[PARTIAL-SUBMIT] FORM Controller is null or empty!!!');
		
		var splitDataSiz = options.splitSize;
		var formController = options.formController;
		
		if (options.content){
			var ca = [], ci = 0, clen = options.content.length;
			
			while (ci < clen){
				var s = null;
				if (ci + options.splitSize < clen){
					s = { index: ci, length: options.splitSize };
				}else{
					s = { index: ci, length: clen - ci };
				}
				
				ca.push(s);
				ci += options.splitSize;
			}
			
			if (ca.length){
				var caIndex = 0, caLength = ca.length;
				
				var exec = function(){
					var caitem = ca[caIndex];
					
					formController.record(
						caIndex,
						caLength,
						options.content.substr(caitem.index, caitem.length)
					);

					//console.log('[PARTIAL-SEND]['+caIndex+'/'+caLength+'] ' + formController.toString(', ', 'content'));
					
					AbCommon.ajaxSubmit(formController.form, {
						url: options.url,
						
						logFail: true,
						nomsg: true,
						
						success: function(r, status, xhr, $form){
							if (caIndex + 1 >= caLength){
								if (AbCommon.isFunction(options.success))
									options.success(r, status, xhr, $form);
							}else{
								caIndex++;
								setTimeout(exec, options.delay);
							}							
						},
						
						error: function(e, $form){
							if (AbCommon.isFunction(options.error))
								options.error(e, $form);
						}
					});
				};
				
				setTimeout(exec, 0);
			}
		}
	},
	
	//-------------------------------------------------------------------------------------------------------
	
};