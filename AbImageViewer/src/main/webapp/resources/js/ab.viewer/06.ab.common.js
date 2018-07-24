var AbCommon = {

	//-----------------------------------------------------------
	// 마우스 훨 처리
	//-----------------------------------------------------------

	wheel: {
		PIXEL_STEP: 100,
		LINE_HEIGHT: 40,
		PAGE_HEIGHT: 800,

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
	// IE 버전 확인
	//-----------------------------------------------------------

	ieVersion: function(){
		var agent = navigator.userAgent.toLowerCase();

		var word = null;
		
		if (navigator.appName == 'Microsoft Internet Explorer') word = 'msie'; // IE old version (IE10 or Lower)
		else if (agent.search('trident') > -1) word = 'trident/.*rv:'; // IE11
		else if ( agent.search('edge/') > -1 ) word = 'edge/'; // Microsoft Edge
		else return -1;

		var reg = new RegExp(word +'([0-9]{1,})(\\.{0,}[0-9]{0,1})');
		if (reg.exec(agent) != null) return parseFloat( RegExp.$1 + RegExp.$2 );
		return -1;
	},

	//-----------------------------------------------------------

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

	flag: function(value, n){ return (value & n) == n; },

	isSetted: function (val){ return typeof val != 'undefined' && val != null; },
	isDefined: function (val){ return typeof val != 'undefined'; },
	isFunction: function (val) { return typeof val == 'function'; },
	isString: function (value) { return typeof value == 'string'; },
	isNumber: function (value) { return typeof value == 'number'; },
	isBool: function (value) { return typeof value == 'boolean'; },

	escape: function (value){ return value ? value.replace ( /&/gi, '&amp;' ).replace ( /&/gi, '&nbsp;' ).replace ( /</gi, '&lt;' ).replace ( />/gi, '&gt;' ).replace ( /'/g, '&#039;' ).replace ( /"/g, '&quot;' ) : value; },

	//-----------------------------------------------------------
	// Web Worker
	//-----------------------------------------------------------

	// 조건에 따라 Web Worker를 비활성화 하기 위한 옵션
	ENABLE_WEB_WORKER : true,

	// Web Worker 사용 가능 여부 확인
	supportWebWorker: function(){
		return window.Worker != null && window.Worker != undefined && AbCommon.ENABLE_WEB_WORKER;
	},

	//-----------------------------------------------------------
	// IFRAME 제어 관련
	
	contentWindow: function(e){
		return e.length ? e.get(0).contentWindow : null;
	},

	contentDocument: function(e){
		if (!e.length) return null;
		var htmlElement = e.get(0);

		if (htmlElement.contentWindow) return htmlElement.contentWindow.document;
		return htmlElement.contentDocument ? htmlElement.contentDocument.document ? htmlElement.contentDocument.document : htmlElement.contentDocument : null;
	},

	allNumbers: function (){
		var len = arguments.length;
		for (var i=0; i < len; i++)
			if (!this.isNumber(arguments[i]))
				return false;
		return true;
	},

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

	BYTE_UNITS: [ 'Bytes', 'KB', 'MB', 'GB', 'TB', 'PB' ],

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
	
	isHistoryState: function (o) {
		return o && o.type && o.cmd
			&& typeof o.begin == 'function'
			&& typeof o.end == 'function'
			&& typeof o.undo == 'function'
			&& typeof o.redo == 'function'
			&& typeof o.dispose == 'function';
	},
	
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

	disposeShapes: function(shapes){
		var len=shapes.length;
		for (var i=0; i < len; i++){
			if (typeof shapes[i].dispose == 'function')
				shapes[i].dispose();
		}
		shapes.splice(0, shapes.length);
	},

	//-----------------------------------------------------------

	isFileData: function(d){
		return d && (d instanceof File || (d.hasOwnProperty('name') && d.hasOwnProperty('type') && d.hasOwnProperty('size')) );
	},

	//-----------------------------------------------------------
	
	// support editor
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

	isStrokeShape: function (o) {
		return o && o.shapeStyle
			&& typeof o.addPoint == 'function'
			&& typeof o.endPoint == 'function';
	},

	wannaCollectPoints: function (o){
		return this.isStrokeShape(o) && o.hasOwnProperty('collectPoints') && o.collectPoints === true;
	},

	isSupportInlineEditShape: function (o) {
		return o && o.shapeStyle
			&& typeof o.inlineEdit == 'function'
			&& typeof o.testInlineEdit == 'function';
	},

	hasCreationStyleShape: function (o){
		return o && o.shapeStyle
			&& typeof o.creationStyle == 'function';
	},

	supportCreationDraw: function (o){
		return o && o.shapeStyle
			&& typeof o.creationDraw == 'function';
	},

	supportRestoreMinimumSize: function (o){
		return o && o.shapeStyle
			&& typeof o.restoreMinimumSize == 'function';
	},

	// support indicator
	supportResizable: function (o){
		return  o && o.shapeStyle
			&& typeof o.resizable == 'function';
	},

	hasValidLineDistance: function (o){
		return  o && o.shapeStyle
			&& typeof o.validLineDistance == 'function';
	},

	hasMinimum: function (o){
		return  o && o.shapeStyle
			&& typeof o.minimum == 'function';
	},

	hasCreationMinimum: function (o){
		return  o && o.shapeStyle
			&& typeof o.creationMinimum == 'function';
	},

	hasClass: function (o) { return o.constructor && o.constructor.name && o.constructor.name.toLowerCase() != 'object'; },

	getBounds: function(element) { return element.getBoundingClientRect ? element.getBoundingClientRect() : { left: 0, top: 0, right: 0, bottom: 0, width: 0, height: 0 }; },

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
						if ($.inArray(p, advice.moveProps) >= 0){
							dest[p] = o;
							delete src[p];

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

	createObject: function(obj){
		try { return Object.create(obj); }
		catch(e) { return obj.constructor ? obj.constructor() : {}; }	
	},

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

	overWriteProp: function (src, dest, props){
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
					if (!AbCommon.isSetted(dest[p]))
						dest[p] = this.createObject(o);
					this.overWriteProp(o, dest[p]);
				}
			}
		}
		return dest;
	},
		
	//-----------------------------------------------------------

	engineScale: function (s){
		return s && s.engine && s.engine.currentPage ? { x: s.engine.currentPage.scale.x, y: s.engine.currentPage.scale.y } : { x: 1, y: 1 };
	},
		
	//-----------------------------------------------------------
	// XNK

	xmlHeader: function (){ return '<?xml version="1.0" encoding="UTF-8"?>'; },

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

	deserializeShape: function (shapeXml){
		if (!shapeXml) return null;

		var e = $($.parseXML(shapeXml));
		
		var prop = {};
		this.deserializeShapeXmlNode(e.find('shape'), prop);

		return prop;
	},
		
	//-----------------------------------------------------------

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
	
	loadImage: function (url){
		return new Promise(function(resolve, reject){
			var img = new Image();
			img.crossOrigin = 'Anonymous';
			img.onload = function(e){
				setTimeout(resolve.bind(null, this), 0);
			};
			img.onerror = function(e){
				setTimeout(reject.bind(null, new Error('It is not an image file')), 0);
			};
			img.src = url;
		});
	},
	
	//-------------------------------------------------------------------------------------------------------
	// Ajax
	//-------------------------------------------------------------------------------------------------------

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
	
			url += 'responseType' + options.dataType;
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
			url += 'responseType' + options.dataType;
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
	
	toStringAjaxFail: function (XMLHttpRequest, textStatus, errorThrown) {
		if (XMLHttpRequest) {
			return AbCommon.toStringXmlHttpRequest(XMLHttpRequest);
		} else {
			return 'Status: ' + textStatus;
		}
	},
	
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

			if (AbCommon.isDefined(json.name)) xhrd.exception = json.name;
			if (AbCommon.isDefined(json.errorCode)) xhrd.errorCode = json.errorCode;
			if (AbCommon.isDefined(json.messageType)) xhrd.messageType = json.messageType;
			if (AbCommon.isDefined(json.message)) xhrd.message = json.message;
			if (AbCommon.isDefined(json.stackTrace)) xhrd.stackTrace = json.stackTrace;
			if (AbCommon.isDefined(json.token)) xhrd.token = json.token;
	
			return xhrd;
		}
		return null;
	},
	
	readRemoteError: function(xhr, textStatus, errorThrown) {
		var xhrd = AbCommon.readxhr(xhr);
		if (!xhrd) xhrd = {};
		xhrd.textStatus = textStatus;
		xhrd.errorThrown = errorThrown;
		return xhrd;
	},
	
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
	
	xmlHttpRequest: function(options){
		if (!options) options = {};
		var xhr = new XMLHttpRequest();

		if (options.path)
			xhr.open(options.type || 'GET', options.path);

		xhr.mozResponseType = xhr.responseType = options.responseType || 'arraybuffer';

		if (options.progress)
			xhr.onprogress = options.progress;

		if (options.load)
			xhr.onload = function(e){
				if (AbCommon.isFunction(options.load))
					options.load.call(options, e, xhr);
			};

		if (options.error)
			xhr.onerror = function(e){
				if (AbCommon.isFunction(options.error))
					options.error.call(options, e, xhr);
			};

		return xhr;
	},

	xhrArrayBufferResponse: function (xhr){
		return xhr.mozResponseArrayBuffer || xhr.mozResponse || xhr.responseArrayBuffer || xhr.response;
	},
	
	//-------------------------------------------------------------------------------------------------------
	// 분할 전송용 양식 컨트럴러
	//-------------------------------------------------------------------------------------------------------

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
		
		var formController = {
			forms: forms,
			form: eform,
			
			_fields: ra,
			
			reset: function (){
				this.partial.val('');
				this.partials.val('');
				this.content.val('');				
			},
			
			record: function(index, total, content){
				this.partial.val(index);
				this.partials.val(total);
				this.content.val(content);
			},
			
			dispose: function(){
				this.form.remove();
			},
			
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

};