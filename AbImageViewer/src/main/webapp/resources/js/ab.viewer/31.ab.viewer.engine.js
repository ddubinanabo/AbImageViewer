function AbViewerEngine(options){
	if (!options) options = {};
	var optionMargin = options.margin || { left: 10, top: 10, right: 10, bottom: 10 };
	var styleOption = options.style || {};

	//-----------------------------------------------------------

	this.selector = options.selector;
	if (!this.selector) this.selector = '#engine';
	
	//-----------------------------------------------------------

	this.selectedShapes = [];
	this.focusedShape = null;
	
	//-----------------------------------------------------------

	this.style = {
		color: styleOption.hasOwnProperty('color') ? styleOption.color : null, // '#F8F8F9',
	};
	
	//-----------------------------------------------------------

	this.waterMark = options.waterMark && options.waterMark instanceof AbWaterMark ? options.waterMark : null;
	if (this.waterMark)
		this.waterMark.observe(this);
	
	//-----------------------------------------------------------

	this.status = 'ready';
	this.enabled = true;
	// view = 이미지 뷰잉
	// edit = 도형 편집
	this.engineMode = 'edit';
	// runtime이 true이면,
	// 에디터가 실시간으로 화면 업데이트 중이며,
	// true인 동안에는 인위적으로 화면을 업데이트하는 행위(render/paint 등)를
	// 하면 안된다.
	this.runtime = false;

	this.enableAnimate = true;

	this.$showShapes = true;

	this.margin = {
		left: optionMargin.left,
		top: optionMargin.top,
		right: optionMargin.right,
		bottom: optionMargin.bottom,

		horiz: function() { return this.left + this.right; },
		vert: function() { return this.top + this.bottom; },
	};
	
	//-----------------------------------------------------------
	// 옵저버

	this.observers = {
		listeners: {},
		all: [],

		add: function(name, listener){
			if (!(AbCommon.isFunction(listener) || (listener && AbCommon.isFunction(listener.engineNotify))))
				return;

			if (name && name != 'all'){
				if (this.listeners[name])
					this.listeners[name].push(listener);
				else
					this.listeners[name] = [listener];
			}else{
				this.all.push(listener);
			}
		},

		remove: function(name, listener){
			if (!(AbCommon.isFunction(listener) || (listener && AbCommon.isFunction(listener.engineNotify))))
				return;

			var a = null;
			if (name && name != 'all'){
				if (this.listeners[name])
					a = this.listeners[name];
			}else{
				a = this.all;
			}

			if (!a) return;
			
			var len = a.length;
			for (var i= a.length - 1; i >= 0; i--){
				if (a[i] == listener){
					a.splice(i, 1);
					return;
				}
			}
		},

		clear: function (name){
			if (this.listeners[name])
				this.listeners[name].splice(0, this.listeners[name].length);
		},

		reset: function(){
			for (var p in this.listeners){
				this.listeners[p].splice(0, this.listeners[p].length);
				delete this.listeners[p];
			}

			this.all.splice(0, this.all.length);
		},
	};
	
	//-----------------------------------------------------------
	// 애니메이션 상태 정보

	this.animateStates = {
		$states: {},
		$animated: false,

		$stack: [],

		engine: this,

		// 엔진의 애니메이션 여부
		$engine: false,

		// 엔진 외 기능이 애니메이션 중인지 확인
		animated: function(){
			if (arguments.length)
				return this.$states[arguments[0]];
			return this.$animated;
		},

		begin: function(name){
			this.$stack.push(this.$animated);
			this.$animated = true;

			this.$states[name] = true;

			this.engine.notifyObservers('animate', name);
		},

		end: function(name){
			if (this.$states[name] === true){
				this.$states[name] = false;

				var val = this.$stack.pop();
				this.$animated = val;

				this.engine.notifyObservers('animated', name);
			}
		},
	};

	//-----------------------------------------------------------

	this.pages = options.pages || new AbPageCollection();

	this.currentPageIndex = -1;
	this.currentPage = null;

	//-----------------------------------------------------------

	this.clipboard = options.clipboard || new AbClipboard();
	//this.history = options.history || new AbHistory();

	this.history = options.history || {
		lock: function(){},
		unlock: function(){},
		canUndo: function(){},
		canRedo: function(){},
		begin: function(){},
		end: function(){},
		cancel: function(){},
		undo: function(){},
		redo: function(){},
		clear: function(){},
	};

	//-----------------------------------------------------------

	this.selection = {
		engine: this,

		mode: null,
		target: null,

		edit: null,
		editTarget: null,

		clickTarget: null,

		direction: 0,

		style: {
			stroke: {
				width: 1,
				color: '#99CCFF',
			},
			color: 'rgba(202,229,255, 0.27)',
		},

		start: { x: 0, y: 0 },
		end: { x: 0, y: 0 },
		prev: { x: 0, y: 0 },

		canvas: {
			start: { x: 0, y: 0 },
			end: { x: 0, y: 0 },
			prev: { x: 0, y: 0 },
		},

		dragged: function(){ return this.canvas.end.x - this.canvas.start.x != 0 || this.canvas.end.y - this.canvas.start.y != 0; },

		swap: function (){ return AbGraphics.rect(this.start.x, this.start.y, this.end.x, this.end.y); },
		box: function(){ return AbGraphics.box.rect(this.start.x, this.start.y, this.end.x, this.end.y); },

		// 드로잉 한 좌표 (화면 좌표)
		drawd: null,

		reset: function (){
			if (this.target){
				this.engine.notifyObservers('cancel', 'shape.create');
			}

			this.mode = null;
			this.target = null;
			this.edit = null;
			this.editTarget = null;
			this.clickTarget = null;
		},
	};

	//-----------------------------------------------------------

	this.panel = $(this.selector);
	this.viewContext = null;
	this.context = null;
	this.textbox = {
		engine: this,
		e: null,

		attr: function(){ return this.e.attr.apply(this.e, arguments); },
		prop: function(){ return this.e.prop.apply(this.e, arguments); },
		on: function(){ return this.e.on.apply(this.e, arguments); },
		off: function(){ return this.e.off.apply(this.e, arguments); },
		css: function(){ return this.e.css.apply(this.e, arguments); },
		val: function(){ return this.e.val.apply(this.e, arguments); },

		box: function (x, y, width, height){
			var page = this.engine.currentPage;

			var canvasPoint = page.toCanvas(x, y);
			var screenPoint = this.engine.canvas2screen(canvasPoint);

			x = screenPoint.x;
			y = screenPoint.y;

			var angle = parseFloat(this.e.attr('s-angle'));

			var transform = '';

			//transform = 'translate('+(-page.x)+'px, '+(-page.y)+'px) ';

			//transform += 'rotate(5deg) ';
			//transform += 'scale(1.2,1) ';
			if (angle) transform += 'rotate('+angle+'deg) ';

			if (page.scaled()){
				var hw = (width / 2), hsw = (width * page.scale.x) / 2;
				var hh = (height / 2), hsh = (height * page.scale.y) / 2;

				x -= (hw - hsw);
				y -= (hh - hsh);

				transform += 'scale('+page.scale.x+','+page.scale.y+') ';
			}

			this.e.css('transform', transform);
			this.e.css('-webkit-transform', transform);
			this.e.css('-moz-transform', transform);
			
			this.e.css('left', x);
			this.e.css('top', y);
			this.e.css('width', width);
			this.e.css('height', height);
		},

		show: function(x, y, width, height, angle){
			if (!angle) angle = 0;

			var page = this.engine.currentPage;

			var canvasPoint = page.toCanvas(x, y);
			var screenPoint = this.engine.canvas2screen(canvasPoint);

			x = screenPoint.x;
			y = screenPoint.y;

			this.e.attr('s-w', width);
			this.e.attr('s-h', height);
			this.e.attr('s-angle', angle);

			var transform = '';

			//transform = 'translate('+(-page.x)+'px, '+(-page.y)+'px) ';

			//transform += 'rotate(5deg) ';
			//transform += 'scale(1.2,1) ';
			if (angle) transform += 'rotate('+angle+'deg) ';

			if (page.scaled()){
				var hw = (width / 2), hsw = (width * page.scale.x) / 2;
				var hh = (height / 2), hsh = (height * page.scale.y) / 2;

				x -= (hw - hsw);
				y -= (hh - hsh);

				transform += 'scale('+page.scale.x+','+page.scale.y+') ';
			}

			this.e.css('transform', transform);
			this.e.css('-webkit-transform', transform);
			this.e.css('-moz-transform', transform);
			
			if (arguments.length == 2 || arguments.length == 3){
				this.e.css('left', x);
				this.e.css('top', y);
			}else if (arguments.length >=4){
				this.e.css('left', x);
				this.e.css('top', y);
				this.e.css('width', width);
				this.e.css('height', height);
			}

			this.e.css({
				zIndex: 0,
				visibility: 'visible'
			});

			var textElement = this.e.get(0);

			// IE 11에서는 효과 없음
			//textElement.focus({ preventScroll : true });

			// selection을 이용한 포커싱 (focus 되는 엘리멘트로 이동하지 않는다.)
			textElement.select();
			if (textElement.setSelectionRange)
				textElement.setSelectionRange(0, 0);
			else if (textElement['createTextRange']) {
				var range = textElement['createTextRange']();
				range.moveStart('character', startIndex);
				range.moveEnd('character', endIndex);
				range.select();
			}
		},

		hide: function(){
			this.e.blur();
			this.e.css({
				zIndex: -1,
				visibility: 'hidden'
			});
		},
	};

	this.listening = false;
	this.mouseTriggered = false;
}
	
//-----------------------------------------------------------
//-----------------------------------------------------------
//-----------------------------------------------------------

AbViewerEngine.prototype = {
	constructor: AbViewerEngine,

	//-----------------------------------------------------------

	NONE: 0,

	DIR_HORIZ : 1,
	DIR_VERT: 2,
	
	//-----------------------------------------------------------

	MIN_SCALE: 0.1,
	MAX_SCALE: 5,

	SCALE_STEP: 0.07,

	SCALE_ANI_STEP: 0.4,
	SCALE_ANI_EASING: 'easeOutExpo',
	SCALE_ANI_DURATION: 300,

	ROTATE_ANI_EASING: 'easeOutExpo',
	ROTATE_ANI_DURATION: 400,
	
	//-----------------------------------------------------------

	SHAPE_TABLE: {
		textbox: new AbShapeTextBox(),
		rectangle: new AbShapeRectangle(),
		pen: new AbShapePen(),
		highlightpen: new AbShapeHighlightPen(),
		ellipse: new AbShapeEllipse(),
		arrow: new AbShapeArrow(),
		line: new AbShapeLine(),
		checker: new AbShapeImage({ source: AbIcons.CHECKER }),
	},
	
	//-----------------------------------------------------------

	install: function (){
		if (this.panel.length){
			this.status = 'preparing';
	
			var box = AbCommon.getBounds(this.panel.get(0));
	
			var canvas = $('<canvas width="'+box.width+'" height="'+box.height+'"/>');
			canvas.css('touch-action', 'none');
			canvas.css('user-select', 'none');
			canvas.css('-webkit-user-drag', 'none');
			canvas.css('-webkit-tap-highlight-color', 'rgba(0, 0, 0, 0);');
			canvas.css('outline', 'none');
			canvas.attr('tabindex', '1');
	
			canvas.focus(function(e){
				this.textbox.hide();
			}.bind(this));
	
			canvas.on('contextmenu', function (e){
				e.preventDefault(); // 현재 이벤트의 기본 동작을 중단한다.
				e.stopPropagation(); // 현재 이벤트가 상위로 전파되지 않도록 중단한다.
				e.stopImmediatePropagation(); // 현재 이벤트가 상위뿐 아니라 현재 레벨에 걸린 다른 이벤트도 동작하지 않도록 중단한다.			
	
				if (e.originalEvent && e.originalEvent.hasOwnProperty('returnValue'))
					e.originalEvent.returnValue = false;
				
				return false;
			});
	
			this.panel.append(canvas);
	
			var viewCanvas = canvas.get(0);
			this.viewContext = viewCanvas.getContext('2d');
	
			var canvas = $('<canvas width="'+box.width+'" height="'+box.height+'"/>');
			//canvas.width = viewCanvas.width;
			//canvas.height = viewCanvas.height;
			this.context = canvas.get(0).getContext('2d');
	
			this.textbox.e = $('<textarea placeholder="내용을 입력하세요" wrap="soft" spellcheck="false"></textarea>');
			this.textbox.css('line-height', '1.2');
			this.textbox.css('border', '0 none white');
			this.textbox.css('padding', '0');
			this.textbox.css('outline', 'none');
			this.textbox.css('IME-MODE', 'active');
			this.textbox.css('overflow', 'hidden');
			this.textbox.css('resize', 'none');
			this.textbox.css('position', 'absolute');
			this.textbox.css('visibility', 'hidden');
			this.textbox.css('z-index', '-1');
			this.textbox.css('-webkit-user-drag', 'none');
			this.textbox.css('-webkit-font-smoothing', 'antialiased');
			this.textbox.css('-moz-osx-font-smoothing', 'grayscale');
			this.textbox.e.keydown(this, function (e){
				e.stopPropagation(); // 현재 이벤트가 상위로 전파되지 않도록 중단한다.
				e.stopImmediatePropagation(); // 현재 이벤트가 상위뿐 아니라 현재 레벨에 걸린 다른 이벤트도 동작하지 않도록 중단한다.			
			});
	
			this.panel.append(this.textbox.e);
			
			this.prepare();
			this.status = 'prepared';
		}	
	},
	
	//-----------------------------------------------------------

	dispose: function(){
		this.selection.engine = null;
		this.animateStates.engine = null;
		
		this.clearPages();
		
		this.textbox.engine = null;
		this.textbox.e = null;
	},

	//-----------------------------------------------------------

	observe: function(topic, observer){ this.observers.add(topic, observer); },
	stopObserve: function(topic, observer){ this.observers.remove(topic, observer); },

	notifyObservers: function(topic, value, callback){
		if (this.observers && (this.observers.listeners[topic] || this.observers.all.length)){
			this.exec(function(){
				var a = this.observers.listeners[topic];
				if (this.observers.all.length){
					if (a){
						var b = [];
						Array.prototype.push.apply(b, a);
						Array.prototype.push.apply(b, this.observers.all);
						a = b;
					}else if (this.observers.all.length)
						a = this.observers.all;
				}

				var len = a ? a.length : 0;
				for (var i=0; i < len; i++){
					if (AbCommon.isFunction(a[i]))
						a[i](this, value);
					else
						a[i].engineNotify(this, topic, value);
				}

				if (AbCommon.isFunction(callback)) callback(true);
			});
		}else{
			if (AbCommon.isFunction(callback)) callback(false);
		}
	},

	//-----------------------------------------------------------

	notifySelectionShapes: function(cmd){
		var len = this.selectedShapes.length;
		for (var i=0; i < len; i++)
			this.selectedShapes[i].notify.apply(this.selectedShapes[i], arguments);
	},

	notifyShapes: function(cmd){
		var len = this.currentPage.shapes.length;
		for (var i=0; i < len; i++)
			this.currentPage.shapes[i].notify.apply(this.currentPage.shapes[i], arguments);
	},

	//-----------------------------------------------------------

	waterMarkNotify: function(sender, topic, value){
		switch(topic){
		case 'render':
			if (this.context && this.currentPage)
				this.render();
			break;
		}
	},

	//-----------------------------------------------------------

	shapeObject: function (s){
		return AbCommon.isString(s) ? AbViewerEngine.prototype.SHAPE_TABLE[s] : (AbCommon.isShape(s) ? s : null);
	},

	createShape: function (){
		if (!arguments.length)
			return null;

		var name = arguments[0];
		var s = AbViewerEngine.prototype.SHAPE_TABLE[name];
		if (!s)
			return null;

		s = AbCommon.cloneShape(s);

		if (arguments.length > 1){
			var len = arguments.length;
			for (var i=1; i < len; i++){
				AbCommon.overWriteProp(arguments[i], s);
			}

			// var a = [true, s];

			// var len = arguments.length;
			// for (var i=1; i < len; i++) a.push(arguments[i]);

			// $.extend.apply($.extend, a);
		}

		return s;
	},

	//-----------------------------------------------------------

	showShapes: function(){
		if (arguments.length && AbCommon.isBool(arguments[0]) && this.$displayShapes != arguments[0]){
			this.$showShapes = arguments[0];
			this.render();

			this.notifyObservers('shapes', this.$showShapes ? 'show' : 'hide');
		}
		return this.$showShapes;
	},

	editable: function(){
		return this.pages.length() > 0 && this.currentPage && !this.currentPage.error && this.maniplatable();
	},

	maniplatable: function(){
		return this.enabled && !this.animateStates.animated();
	},

	//-----------------------------------------------------------
	// 에디터에서 수정이 있었음을 공지
	// - 도형 추가/삭제/회전, 위치/크기 변경
	// - 도형 편집 초기화
	// - 도형 스타일 변경
	// - 페이지 회전
	// - 클립보드 붙이기
	// - 도형 추가 History Undo/Redo
	// - 도형 수정 History Undo/Redo
	// - 도형 삭제 History Undo/Redo

	modified: function(){
		this.notifyObservers('modified');
	},

	//-----------------------------------------------------------

	exec: function(func, delay){
		if (!delay) delay = 0;
		setTimeout(func.bind(this), delay);
		//func.call(this);
	},

	execCommand: function(cmd, value){
		if (!this.maniplatable()) return;

		var f = function(){
			var cmd = arguments.callee.cmd;

			switch(cmd){
			case 'undo': this.undo(); break;
			case 'redo': this.redo(); break;
			case 'copy': this.copy(); break;
			case 'paste': this.paste(); break;
			case 'cut': this.cut(); break;
			case 'delete': this.deleteShapes(); break;
			case 'selectAll': this.selectAll(); break;
			case 'z-index': this.zIndex(value); break;
			}
		};
		f.cmd = cmd;

		this.exec(f);
	},

	keyEvent: function(e){
		var cancel = false;
		var page = e.data.currentPage;
		var editMode = e.data.engineMode == 'edit';
		var maniplatable = e.data.maniplatable();

		//console.log('[KEYDOWN]');

		switch(e.type){
		case 'keydown':
			if (editMode){
				if (page && !e.shiftKey && !e.altKey && !e.ctrlKey && e.keyCode == 32){
					e.data.listening = e.keyCode;

					if (e.data.mouseTriggered){
						e.stopPropagation(); // 현재 이벤트가 상위로 전파되지 않도록 중단한다.
					}

					e.data.mouseTriggered = false;
					//cancel = true;
				}
				if (e.ctrlKey && (e.key == 'A' || e.key == 'a')){
					e.data.execCommand('selectAll');
					cancel = true;
				}else if (e.ctrlKey && (e.key == 'Z' || e.key == 'z')){
					e.data.execCommand('undo');
					//cancel = true;
				}else if (e.ctrlKey && (e.key == 'Y' || e.key == 'y')){
					e.data.execCommand('redo');
					//cancel = true;
				}else if (e.ctrlKey && (e.key == 'C' || e.key == 'c')){
					e.data.execCommand('copy');
					//cancel = true;
				}else if (e.ctrlKey && (e.key == 'V' || e.key == 'v')){
					e.data.execCommand('paste');
					//cancel = true;
				}else if (e.ctrlKey && (e.key == 'X' || e.key == 'x')){
					e.data.execCommand('cut');
					//cancel = true;
				}else if (e.which == 46){ // delete
					e.data.execCommand('delete');
					//cancel = true;
				}else if (e.which == 116){ // F5
					//cancel = true;
				}
			}
			break;
		case 'keyup':
			if (editMode){
				if (page && !e.shiftKey && !e.altKey && !e.ctrlKey && e.keyCode == 32){
					e.data.listening = false;
					e.data.mouseTriggered = false;
					cancel = true;
				}
			}
			break;
		}

		if(cancel){
			e.preventDefault(); // 현재 이벤트의 기본 동작을 중단한다.
			e.stopPropagation(); // 현재 이벤트가 상위로 전파되지 않도록 중단한다.
			e.stopImmediatePropagation(); // 현재 이벤트가 상위뿐 아니라 현재 레벨에 걸린 다른 이벤트도 동작하지 않도록 중단한다.			

			if (e.originalEvent && e.originalEvent.hasOwnProperty('returnValue'))
				e.originalEvent.returnValue = false;

			return false;
		}
		return true;
	},
	
	mouseEvent: function (e){
		if (!e.data.currentPage || !e.data.maniplatable()) return;

		var isRightKey = e.which == 3;
		if (isRightKey) return;
			
		if (e.target == e.data.viewContext || e.target == e.data.viewContext.canvas){
			e.data.mouse(true, e.type, e);
		}else{
			e.data.mouse(false, e.type, e);
		}
	},

	resizeEvent: function (e){
		e.data.exec(function(){
			this.resize();
		});
	},

	canvasBlurEvent: function (e){
		e.data.exec(function(){
			this.selection.reset();
		});
	},

	attachEvents: function (){
		var body = $(document);
		var win = $(window);
		var canvas = $(this.viewContext.canvas);

		body.bind('mousemove', this, this.mouseEvent);
		body.bind('mousedown', this, this.mouseEvent);
		body.bind('mouseup', this, this.mouseEvent);
		body.bind('click', this, this.mouseEvent);
		body.bind('mousewheel', this, this.mouseEvent);
		body.bind('wheel', this, this.mouseEvent);
		win.bind('keydown', this, this.keyEvent);
		win.bind('keyup', this, this.keyEvent);
		win.bind('resize', this, this.resizeEvent);
		canvas.bind('blur', this, this.canvasBlurEvent);
	},

	detachEvents: function (){
		var body = $(document);
		var win = $(window);
		var canvas = $(this.viewContext.canvas);

		body.unbind('mousemove', this, this.mouseEvent);
		body.unbind('mousedown', this, this.mouseEvent);
		body.unbind('mouseup', this, this.mouseEvent);
		body.unbind('click', this, this.mouseEvent);
		body.unbind('mousewheel', this, this.mouseEvent);
		body.unbind('wheel', this, this.mouseEvent);
		win.unbind('keydown', this, this.keyEvent);
		win.unbind('keyup', this, this.keyEvent);
		win.unbind('resize', this, this.resizeEvent);
		canvas.unbind('blur', this, this.canvasBlurEvent);
	},

	screen2canvas: function (){
		var x = 0, y = 0;
		if (arguments.length == 1) { x = arguments[0].x; y = arguments[0].y; }
		else { x = arguments[0]; y = arguments[1]; }

		var box = AbCommon.getBounds(this.viewContext.canvas);
		var pos = $(this.viewContext.canvas).position();
		var scr = AbCommon.scrolledParents($(this.viewContext.canvas));
		
		return {
			x: x - pos.left - scr.x - this.margin.left,
			y: y - pos.top - scr.y - this.margin.top,
		};
	},

	canvas2screen: function(){
		var x = 0, y = 0;
		if (arguments.length == 1) { x = arguments[0].x; y = arguments[0].y; }
		else { x = arguments[0]; y = arguments[1]; }

		var box = AbCommon.getBounds(this.viewContext.canvas);
		var pos = $(this.viewContext.canvas).position();
		var scr = AbCommon.scrolledParents($(this.viewContext.canvas));

		return {
			x: x + pos.left + scr.x + this.margin.left,
			y: y + pos.top + scr.y + this.margin.top,
		};
	},

	event: function (e){
		var ctrlKey = e ? e.ctrlKey : false;
		var shiftKey = e ? e.shiftKey : false;
		var altKey = e ? e.altKey : false;
		var isRightKey = (e && e.originalEvent ? e.originalEvent.location : 1) == 2;

		var box = AbCommon.getBounds(this.viewContext.canvas);
		var scr = AbCommon.scrolledParents($(this.viewContext.canvas));
		
		var p = {
			x: e.pageX - box.left - scr.x - this.margin.left,
			y: e.pageY - box.top - scr.y - this.margin.top,
		};		

		return {
			x: p.x,
			y: p.y,

			ctrlKey: e ? e.ctrlKey : false,
			shiftKey: e ? e.shiftKey : false,
			altKey: e ? e.altKey : false,

			//isRightKey: (e && e.originalEvent ? e.originalEvent.location : 1) == 2,
			button: e.which == 1 ? 'left' : e.which == 2 ? 'middle' : e.which == 3 ? 'right' : null,
		};
	},

	mouse: function (){
		if (!arguments.length)
			return;

		if (!this.enabled)
			return;
		
		var inCanvas = arguments[0] === true;
		var type = arguments[1];
		var event = arguments[2];

		// canvas 내 event
		if (inCanvas){
			var arg = this.event(event);
			var x = arg.x, y = arg.y;

			//console.log('[ENABLE] pageMove=' + states.pageMove +', fix=' + states.fixed + ', additional=' + states.additional);

			if (this.currentPage){
				var cr = this.currentPage.fromCanvas(x, y);
				x = cr.x;
				y = cr.y;
			}

			var states = {
				arg: arg,
				x: x,
				y: y,
				
				additional: arg.shiftKey,
				fixed: arg.ctrlKey,
				pageMove: false,
			};

			if (this.engineMode == 'edit' && this.listening !== false){
				this.mouseTriggered = true;
				states.pageMove = true;
						
				//console.log('[MOUSE][LISTEN] Page Moving');
			}

			// var ctx = this.viewContext;
			// if (ctx){
			// 	var page = this.currentPage;
	
			// 	ctx.fillStyle = '#00FFFF';
			// 	ctx.beginPath();
			// 	ctx.arc((x * page.scale.x) + page.x, (y * page.scale.y) + page.y, 5, 0, 360);
			// 	ctx.fill();
			// 	ctx.closePath();
			// }

			//if (e.type != 'mousemove') console.log('[CANVAS][EVENT][MOUSE] type='+e.type+' (selection='+this.selection.mode+'), pageX=' + pageX + ', pageY=' + pageY + ', x=' + x + ', y=' + y);
	
			//console.log('[MOUSE]['+type+']['+(arg.isRightKey ? 'right' : 'left')+'] mode=' + (this.selection.mode || '') + ', target=' + (this.selection.target || '') );
			
			switch (type){
			case 'mousemove':
				// 드래깅 방향 결정
				if (states.fixed){
					if (this.selection.direction == this.NONE)
						this.selection.direction = this.analysisMouseDirection(this.selection.prev.x,this.selection.prev.y, x, y);
					
					if (this.selection.direction == this.DIR_HORIZ){
						states.y = y = this.selection.start.y;
						states.arg.y = arg.y = this.selection.canvas.start.y;
					}else if (this.selection.direction == this.DIR_VERT){
						states.x = x = this.selection.start.x;
						states.arg.x = arg.x = this.selection.canvas.start.x;
					}

					if (this.selection.direction)
						this.notifyObservers('mouse.direction', this.selection.direction);
				}else if (this.selection.direction){
					this.selection.direction = this.NONE;

					this.notifyObservers('mouse.direction', this.selection.direction);
				}
				
				this.selection.end.x = x;
				this.selection.end.y = y;				
				this.selection.canvas.end.x = arg.x;
				this.selection.canvas.end.y = arg.y;
			
				switch(this.engineMode){
				case 'edit':
					this.editMouseMoveEvent(event, states);
					break;
				case 'view':
					this.viewMouseMoveEvent(event, states);
					break;
				}

				this.selection.prev.x = x;
				this.selection.prev.y = y;
				this.selection.canvas.prev.x = arg.x;
				this.selection.canvas.prev.y = arg.y;
				break;
			case 'mousedown':
				this.selection.prev.x = this.selection.start.x = this.selection.end.x = x;
				this.selection.prev.y = this.selection.start.y = this.selection.end.y = y;
				this.selection.canvas.prev.x = this.selection.canvas.start.x = this.selection.canvas.end.x = arg.x;
				this.selection.canvas.prev.y = this.selection.canvas.start.y = this.selection.canvas.end.y = arg.y;
			
				switch(this.engineMode){
				case 'edit':
					this.editMouseDownEvent(event, states);
					break;
				case 'view':
					this.viewMouseDownEvent(event, states);
					break;
				}

				// console.log('[MODE] ' + this.selection.mode);
				break;
			case 'mouseup':		
				switch(this.engineMode){
				case 'edit':
					this.editMouseUpEvent(event, states);
					break;
				case 'view':
					this.viewMouseUpEvent(event, states);
					break;
				}
				break;
			case 'click':						
				// console.log('[CLICK] ' + this.selection.mode + ', x=' + x + ', y=' + y);

				switch(this.engineMode){
				case 'edit':
					this.editMouseClickEvent(event, states);
					break;
				case 'view':
					this.viewMouseClickEvent(event, states);
					break;
				}
				break;
			case 'mousewheel': case 'wheel':
				return this.mouseWheelEvent(event);
			}
		}else{
			var e = arguments.length >= 2 ? arguments[1] : null;

			switch (type){
			case 'mousemove': break;
			case 'mousedown': break;
			case 'mouseup':
				switch(this.engineMode){
				case 'edit':
					this.editMouseUpEvent(event);
					break;
				case 'view':
					this.viewMouseUpEvent(event);
					break;
				}
				break;
			}
		}
	},
		
	//-----------------------------------------------------------

	editMouseMoveEvent: function (e, states){		
		switch(this.selection.mode){
		case 'page-move':
			this.move(states.arg.x - this.selection.canvas.prev.x, states.arg.y - this.selection.canvas.prev.y, true);

			// Notify
			this.notifyObservers('page', 'move');

			//console.log('[MOUSE][MOVE] Page Moving...');
			break;
		case 'selection':
			this.restoreSelection();
			this.drawSelection();
			break;
		case 'creation':
			var targetShape = this.shapeObject(this.selection.target);
			if (AbCommon.wannaCollectPoints(targetShape))
				targetShape.addPoint(this.selection.end.x, this.selection.end.y);

			if (!AbCommon.supportCreationDraw(targetShape))
				this.restoreSelection();
				//console.log('aa');
			
			if (!AbCommon.hasCreationStyleShape(targetShape) || targetShape.creationStyle() != 'click')
				this.drawCreation();
			break;
		case 'move':					
			var xval = states.x - this.selection.prev.x;
			var yval = states.y - this.selection.prev.y;

			var len = this.selectedShapes.length;
			for (var i=0; i < len; i++){
				var s = this.selectedShapes[i];
				s.move(xval, yval, true);
			}
			this.render();

			//if (this.focusedShape) { var box = this.focusedShape.box(); console.log('[MOVE] x: ' + box.x + ', y: ' + box.y); }
			break;
		case 'resize':
			this.resizeSelection(states.x, states.y);
			break;
		default:
			this.editNormalMouseOperation(e, states);
			break;
		}
	},

	editNormalMouseOperation: function (e, states){
		var edit = null;
		var sel = null;
		var x = states.x, y = states.y;
		for (var i = this.selectedShapes.length - 1; i >= 0; i--){
			var s = this.selectedShapes[i];
			if ((edit = s.editable(x, y, this.viewContext)) != null){
				sel = s;
				break;
			}
		}

		if (!edit){
			for (var i = this.selectedShapes.length - 1; i >= 0; i--){
				var s = this.selectedShapes[i];

				if (s.contains(x, y, this.viewContext)){
					sel = s;
					break;
				}
			}
		}

		if (edit){
			this.selection.edit = edit;
			this.selection.editTarget = sel;
		}else{
			this.selection.edit = null;
			this.selection.editTarget = null;
		}

		//console.log('[EDIT] edit=' + edit + ', target=' + sel);

		if (this.cursor() != 'pointer'){
			if (edit){
				var cursor = AbGraphics.cursor(edit, sel.angle);
				this.cursor(cursor);
			}else if (sel){
				this.cursor('move');
			}else{
				var cursor = this.cursor();
				if(cursor && cursor != 'default')
					this.cursor('default');
			}
		}
	},

	editMouseDownEvent: function(e, states){
		if (states.pageMove){
			var r = this.testContentView();
			if (!r.inCanvas){
				this.selection.mode = 'page-move';

				//-----------------------------------------------------------
				// begin record history
				//this.history.begin('page', 'update', this, ['x', 'y']);
				//-----------------------------------------------------------

				// console.log('[PAGE-MOVE] START');
			}
		}

		if (!this.selection.mode){
			var targetShape = this.shapeObject(this.selection.target);

			if (this.selection.editTarget && this.selection.edit){
				this.selection.mode = 'resize';
			}else if (targetShape){
				this.unselect(false);
				this.selection.mode = 'creation';
	
				if (AbCommon.wannaCollectPoints(targetShape)){
					targetShape.addPoint(this.selection.end.x, this.selection.end.y);
				}
	
				this.runtime = true;
				// console.log('[RUNTIME][ON] ' + this.runtime);
			}else{
				var s = null;
	
				// [20180719] 파워포인트 처럼 처기하기 위해 아래 코드 삭제
				// if (this.selectedShapes.length && (s = this.getContainsSelection(states.x, states.y))){					
				// 	if (states.additional){
				// 		if (s.selected){
				// 			this.unselectShape(s);
				// 			this.render();
				// 			return;
				// 		}else{
				// 			this.focusShape(s);
				// 			this.selection.mode = 'mmove';
				// 		}
				// 	}else{
				// 		this.focusShape(s);
				// 		this.selection.mode = 'move';
				// 	}
				// 	this.render();
				// }
	
				if (!this.selection.mode){
					s = this.getShape(states.x, states.y);
					if (s){
						if (s.selected){
							if (states.additional){
								this.unselectShape(s);
								this.render();
								return;
							}else{
								this.focusShape(s);
								this.selection.mode = 'move';
							}
							this.render();
						}else{
							if (!states.additional)
								this.unselect(false);
							this.selectShape(s);
							this.selection.mode = 'move';
							this.render();
						}
					}
				}
	
				if (!this.selection.mode){
					this.selection.mode = 'selection';

					this.runtime = true;
					// console.log('[RUNTIME][ON] ' + this.runtime);
				}
			}

			//-----------------------------------------------------------
			// begin record history
			switch(this.selection.mode){
			case 'resize':
				this.history.begin('shape', 'update', this, ['angle', 'x', 'y', 'width', 'height', 'x1', 'y1', 'x2', 'y2', 'textWidth', 'textHeight', 'text'], this.selection.edit);
				break;
			case 'move':
				this.history.begin('shape', 'update', this, ['angle', 'x', 'y', 'x1', 'y1', 'x2', 'y2']);
				break;
			}
			//-----------------------------------------------------------
		}
	},

	editMouseUpEvent: function (e, states){
		if (!states) states = {};

		switch(this.selection.mode){
		case 'page-move':
			//-----------------------------------------------------------
			// end record history
			//this.history.end(this);
			//-----------------------------------------------------------

			this.selection.reset();

			// Notify
			this.notifyObservers('page', 'moved');

			// console.log('[PAGE-MOVE] END');
			break;
		case 'selection':
			this.restoreSelection();
			this.selection.reset();

			this.select({
				additional: states.additional
			});

			this.runtime = false;
			// console.log('[RUNTIME][OFF] ' + this.runtime);
	
			
			// Notify
			this.notifyObservers('selection', 'end');
		
			break;
		case 'creation':
			this.runtime = false;
			// console.log('[RUNTIME][OFF] ' + this.runtime);

			var targetShape = this.shapeObject(this.selection.target);
			
			// record end point
			if (AbCommon.wannaCollectPoints(targetShape)){
				targetShape.endPoint();
			}

			// cloning
			if (AbCommon.isString(this.selection.target)){
				var templateShape = targetShape;
				targetShape = AbCommon.cloneShape(targetShape);
				templateShape.reset();
			}

			// restore background
			this.restoreSelection();

			// check minimum size
			var x1 = this.selection.start.x, y1 = this.selection.start.y;
			var x2 = this.selection.end.x, y2 = this.selection.end.y;
	
			if ((!AbCommon.hasCreationStyleShape(targetShape) || targetShape.creationStyle() != 'click') && (AbCommon.hasCreationMinimum(targetShape) || AbCommon.hasMinimum(targetShape))){
				var m = AbCommon.hasCreationMinimum(targetShape) ? targetShape.creationMinimum() : targetShape.minimum();
				var mod = false;
				if (m.width > Math.abs(x2 - x1)){
					if (x2 < x1) x2 = x1 - m.width;
					else x2 = x1 + m.width;
					mod = true;
				}
	
				if (m.height > Math.abs(y2 - y1)){
					if (y2 < y1) y2 = y1 - m.height;
					else y2 = y1 + m.height;
					mod = true;
				}
	
				if (mod){
					console.log('[ADD][MOD] x1: ' + x1 + ', y1: ' + y1 + ', x2: ' + x2 + ', y2: ' + y2);

					targetShape.rect(x1, y1, x2, y2);
				}
			}

			//-----------------------------------------------------------
			// begin record history
			this.history.begin('shape', 'add', this);
			//-----------------------------------------------------------
			
			// add draw list
			this.currentPage.shapes.push(targetShape);
			this.selectShape(targetShape);

			// link engine
			targetShape['engine'] = this;

			// notify created
			targetShape.notify('created', x1, y1, x2, y2);

			// do measure
			targetShape.measure();

			// notify measured
			targetShape.notify('measured');
			
			// log
			var tbox = targetShape.box();
			console.log('[ADD] x: ' + tbox.x + ', y: ' + tbox.y + ', width: ' + tbox.width + ', height: ' + tbox.height);
			var trect = targetShape.rect();
			console.log('\t x1: ' + trect.x1 + ', y1: ' + trect.y1 + ', x2: ' + trect.x2 + ', y2: ' + trect.y2);

			//-----------------------------------------------------------
			// end record history
			this.history.end(this);
			//-----------------------------------------------------------

			// finish
			this.selection.reset();
			this.render();

			// Notify
			this.notifyObservers('shape', 'created');

			// Notify modified
			this.modified();
			break;
		case 'resize':

			this.notifySelectionShapes('resized');

			//-----------------------------------------------------------
			// end record history
			this.history.end(this);
			//-----------------------------------------------------------

			// finish
			this.selection.reset();
			this.render();

			// Notify
			this.notifyObservers('shape', 'resized');

			// Notify modified
			this.modified();
			break;
		case 'move':
			var fs = this.focusedShape;
			if (!this.selection.dragged()){
				//-----------------------------------------------------------
				// cancel record history
				this.history.cancel();
				//-----------------------------------------------------------

				if (!states.additional)
					this.unselect({
						unfocusOnly: true
					});

				if (this.selectedShapes.length){
					// Notify
					this.notifyObservers('shape', 'click');
				}

				if (this.selectedShapes.length == 1 && fs && AbCommon.isSupportInlineEditShape(fs) && fs.testInlineEdit(this.viewContext, this.selection.end.x, this.selection.end.y)){
					this.selection.reset();
					this.selection.mode = 'inline';
					this.selection.clickTarget = fs;
					return;
				}else{
					this.selection.reset();
					this.selection.clickTarget = fs;
				}
			}else{
				this.notifySelectionShapes('moved');

				//-----------------------------------------------------------
				// end record history
				this.history.end(this);
				//-----------------------------------------------------------

				// Notify
				this.notifyObservers('shape', 'moved');

				// Notify modified
				this.modified();
			}

			// if (!this.selection.dragged() && fs && AbCommon.isSupportInlineEditShape(fs)){
			// 	this.selection.reset();
			// 	if (this.selectedShapes.length == 1 && fs.testInlineEdit(this.viewContext, this.selection.end.x, this.selection.end.y)){
			// 		this.selection.reset();
			// 		this.selection.mode = 'inline';
			// 		this.selection.clickTarget = fs;	
			// 	}
			// 	break;
			// }else if (!this.selection.dragged()){
			// 	if (!states.states.additional)
			// 		this.unselect({
			// 			unfocusOnly: true
			// 		});
			// 	this.selection.reset();
			// 	this.selection.clickTarget = fs;
			// 	break;
			// }

			var tbox = this.focusedShape.box();
			console.log('[MOVE] x: ' + tbox.x + ', y: ' + tbox.y + ', width: ' + tbox.width + ', height: ' + tbox.height);
			var trect = this.focusedShape.rect();
			console.log('\t x1: ' + trect.x1 + ', y1: ' + trect.y1 + ', x2: ' + trect.x2 + ', y2: ' + trect.y2);
		default:
			if (e.target && !this.selection.mode && this.selection.target){
				var target = $(e.target);
				if (target.attr('ve-type') === 'creation')
					return;
			}
			this.selection.reset();
			break;
		}
	},

	editMouseClickEvent: function (e, states){
		switch(this.selection.mode){
		case 'inline':
			//console.log('[INLINE]');
			this.exec(function (){
				if (this.selection.clickTarget)
				this.selection.clickTarget.inlineEdit(this);

				this.selection.reset();

				// Notify
				this.notifyObservers('shape', 'inline');
			});
			break;
		}
	},
	
	//-----------------------------------------------------------

	viewMouseMoveEvent: function (e, states){
		switch(this.selection.mode){
		case 'page-move':
			this.move(states.arg.x - this.selection.canvas.prev.x, states.arg.y - this.selection.canvas.prev.y, true);

			// Notify
			this.notifyObservers('page', 'move');
			break;
		}
	},

	viewMouseDownEvent: function (e, states){
		if (!this.selection.mode){
			var r = this.testContentView();
			if (!r.inCanvas){
				this.selection.mode = 'page-move';

				//console.log('[PAGE-MOVE] START');
			}
		}
	},

	viewMouseUpEvent: function (e, states){
		switch(this.selection.mode){
		case 'page-move':
			this.selection.reset();

			//console.log('[PAGE-MOVE] END');

			// Notify
			this.notifyObservers('page', 'moved');
			break;
		}
	},
	
	viewMouseClickEvent: function (e, states){
	},

	//-----------------------------------------------------------

	analysisMouseDirection: function(x1, y1, x2, y2){
		var xval = Math.abs(x2 - x1);
		var yval = Math.abs(y2 - y1);

		if (!xval && !yval)
			return this.NONE;

		if (xval >= yval)
			return this.DIR_HORIZ;
		return this.DIR_VERT;
	},
	
	//-----------------------------------------------------------

	prevScaleStep: 1,

	mouseWheelEvent: function(e){
		//var delta = (e.wheelDeltaY || (e.originalEvent && (e.originalEvent.wheelDeltaY || e.originalEvent.wheelDelta)) || e.wheelDelta || 0);
		//console.log('[BODY LOCK] ' + e.type + ', delta='+delta+', target=' + e.target);
		//var body = $(e.data.headers[idx].listSelector());
		//body.scrollTop(body.scrollTop() - delta);
		//e.data.scroll(idx, -delta);

		this.textbox.hide();

		var ed = this.event(e);

		var d = AbCommon.wheel.normalize(e.originalEvent);
		//console.log('[WHEEL] spinX=' + d.spinX + ', spinY=' + d.spinY + ', pixelX=' + d.pixelX + ', pixelY=' + d.pixelY);

		var page = this.currentPage;

		var fastZoom = e.shiftKey;
		var scaleStep = fastZoom ? this.SCALE_ANI_STEP : this.SCALE_STEP;
		var step = this.prevScaleStep;
		if (d.spinY < 0) step = 1 + scaleStep; else step = 1 - scaleStep;

		var zoom = page.scale.x * step;
		
		//-----------------------------------------------------------

		if (zoom < this.MIN_SCALE) zoom = this.MIN_SCALE;
		else if (zoom > this.MAX_SCALE) zoom = this.MAX_SCALE;

		if (this.scale(zoom, ed.x, ed.y, null, fastZoom, this.SCALE_ANI_DURATION) === false)
			this.prevScaleStep *= step;
		else
			this.prevScaleStep = 1;

		e.preventDefault();
		e.stopPropagation(); 

		return false;
	},
		
	//-----------------------------------------------------------

	mode: function (){
		if (this.currentPage && this.maniplatable() && arguments.length){
			var s = (arguments[0] || '').toLowerCase();
			if (s && this.engineMode != s){
				this.engineMode = s;

				this.unselect(false);
				this.prepare();
				this.render();

				// Notify
				this.notifyObservers('mode', s);
			}
		}
		return this.engineMode;
	},

	prepare: function(){
		if (!this.currentPage || !this.maniplatable()) return;

		switch(this.engineMode){
		case 'edit':
			this.cursor('default');
			break;
		case 'view':
			this.cursor('pointer');
			break;
		}
	},

	//-----------------------------------------------------------

	focus: function(){
		if (this.viewContext.canvas)
			this.viewContext.canvas.focus();
	},

	cursor: function(value){
		if (arguments.length){
			this.exec(function (){
				var e = this.panel;
				//var e = this.panel;
				
				e.css('cursor', value);
				//console.log ('[CURSOR] ' + e.css('cursor'));
	
				//$(document.body).css('cursor', value);
			});
		}else return this.panel.css('cursor');
	},

	//-----------------------------------------------------------

	resize: function(){
		this.runtime = true;

		var width = this.panel.width(), height = this.panel.height();
		if (width <= 0 || height <= 0) return;

		var temp = $('<canvas width="'+width+'" height="'+height+'"/>');
		var tempCtx = temp.get(0).getContext('2d');

		tempCtx.drawImage(this.context.canvas, 0, 0);

		//-----------------------------------------------------------

		var bufe = $(this.context.canvas);
		bufe.css({
			width: width,
			height: height
		});

		this.context.canvas.width = width;
		this.context.canvas.height = height;

		//-----------------------------------------------------------

		//console.log('[RESIZE][CANVAS] width=' + this.context.canvas.width + ', height=' + this.context.canvas.height + ', fitTo=' + this.currentPage.fitTo);
					
		this.imagePositioning(width, height);
		this.render(false);

		//-----------------------------------------------------------

		var e = $(this.viewContext.canvas);
		e.css({
			width: width,
			height: height
		});

		this.viewContext.canvas.width = width;
		this.viewContext.canvas.height = height;

		//-----------------------------------------------------------

		this.viewContext.drawImage(tempCtx.canvas, 0, 0);

		//console.log('[RESIZE][VIEW-CANVAS] width=' + this.viewContext.canvas.width + ', height=' + this.viewContext.canvas.height + ', fitTo=' + this.currentPage.fitTo);

		//-----------------------------------------------------------
		
		this.paint();
		
		this.runtime = false;

		// Notify
		this.notifyObservers('resize');
	},

	//-----------------------------------------------------------

	testContentView: function (scale){
		var canvas = this.context.canvas;
		var page = this.currentPage;

		var scaleX = 1, scaleY = 1;
		if (!arguments.length){
			scaleX = page.scale.x;
			scaleY = page.scale.y;
		}else
			scaleX = scaleY = scale;

		var contentsWidth = page.width * scaleX, contentsHeight = page.height * scaleY;

		var viewWidth = canvas.width, viewHeight = canvas.height;
		viewWidth -= this.margin.horiz();
		viewHeight -= this.margin.vert();
		
		var viewCenter = this.screen2canvas(viewWidth >> 1, viewHeight >> 1);
		
		var horizInCanvas = viewWidth >= contentsWidth, vertInCanvas = viewHeight >= contentsHeight;
		var inCanvas = horizInCanvas && vertInCanvas;

		return {
			canvas: { width: viewWidth, height: viewHeight },
			center: viewCenter,
			contents: { width: contentsWidth, height: contentsHeight },
			inCanvas: inCanvas,
			horizInCanvas: horizInCanvas,
			vertInCanvas: vertInCanvas
		};
	},

	//-----------------------------------------------------------

	rotate: function (direction, degree, callback, animating){
		if (!AbCommon.isBool(animating)) animating = true;
		if (!this.currentPage) return 0;

		if (arguments.length == 2){
			if (!this.maniplatable())
				return;
			
			if (!direction) direction = 1;
			if (!degree) degree = 1;

			direction = parseInt(direction);
			degree = parseInt(degree);

			if (direction != 1 && direction != -1){
				throw 'Invalid direction';
				return;
			}

			if (degree < 0 || degree > 3){
				throw 'Invalid direction';
				return;
			}

			//-----------------------------------------------------------

			this.animateStates.begin('rotate');

			//-----------------------------------------------------------
			
			degree = parseInt(direction) * (parseInt(degree) * 90);

			var angle = this.currentPage.angle;
			var destAngle = angle + degree;

			//-----------------------------------------------------------

			var page = this.currentPage;
			var image = page.image();
			var srcsiz = page.sourceSize();
			var pr = AbGraphics.angle.point(destAngle, 0, 0, srcsiz.width, srcsiz.height);

			var imgpos = this.calcImagePosition(null, null, Math.round(Math.abs(pr.x)), Math.round(Math.abs(pr.y)));

			//-----------------------------------------------------------
			// begin record history
			this.history.begin('page', 'update', this, ['angle', 'width', 'height', 'x', 'y', 'scale'], function(c, o, ctoken, otoken){
				if (c.scale){
					page.scale.x = c.scale.x;
					page.scale.y = c.scale.y;
				}

				if (ctoken && ctoken.fited)
					page.fitTo = ctoken.to;
				
				this.rotatePage(c.angle, false);
			}, { fited: imgpos && imgpos.fited, to: imgpos && imgpos.to });
			//-----------------------------------------------------------

			this.exec(function (){
				AbCommon.tween({
					caller: this,
					start: 0,
					end: 1,
					easing: this.ROTATE_ANI_EASING,
					duration: this.ROTATE_ANI_DURATION,
					animating: animating && this.enableAnimate,
					proc: function (value, d, step){
						if (imgpos && imgpos.fited){
							//console.log('[FIT][ING] ' + value + ', start=' + d.start + ', end=' + d.end + ', scale='+imgpos.scale+', ratio=' + imgpos.ratio + ', value=' + (imgpos.scale + (imgpos.ratio-imgpos.scale) * value));

							var scaleValue = d.end - value;

							page.scale.x = imgpos.scale + (imgpos.ratio-imgpos.scale) * value;
							page.scale.y = imgpos.scale + (imgpos.ratio-imgpos.scale) * value;
						}
						
						this.rotatePage(angle + (degree * value), false, false);

						if (imgpos && imgpos.fited){
							this.center(imgpos.canvas.width, imgpos.canvas.height);
						}else
							this.center();

						this.render();
					},
					ended: function(d){
						this.rotatePage(destAngle, false);

						//-----------------------------------------------------------
						// end record history
						this.history.end(this);
						//-----------------------------------------------------------

						this.animateStates.end('rotate');

						if (typeof callback == 'function')
							this.exec(callback);

						// Notify
						this.notifyObservers('rotate', { from: angle, to: destAngle });

						// Notify modified
						this.modified();						
					},
				});
			});
		}

		return this.currentPage.angle;
	},

	rotatePage: function (degree, increase, rendering){
		if (arguments.length == 1) increase = true;

		if (!AbCommon.isBool(rendering)) rendering = true;

		var page = this.currentPage;

		var stepDegree = 0;
		if (!increase) stepDegree = degree - page.angle;
		else stepDegree = degree;

		if (stepDegree == 0) return;

		var prevAngle = page.angle;
		page.angle = AbGraphics.angle.increase(page.angle, stepDegree);

		var image = page.image();
		var srcsiz = page.sourceSize();
		var pageWidth = srcsiz.width, pageHeight = srcsiz.height;
		
		var pr = AbGraphics.angle.point(page.angle, 0, 0, pageWidth, pageHeight);
		page.width = Math.round(Math.abs(pr.x));
		page.height = Math.round(Math.abs(pr.y));

		var pp = AbGraphics.angle.correctDisplayCoordinate(prevAngle, pageWidth, pageHeight, false);
		var cp = AbGraphics.angle.correctDisplayCoordinate(page.angle, pageWidth, pageHeight, false);
		
		// console.log('[PAGE][ROTATE] page( angle: ' + page.angle + ', stepDegree='+stepDegree+', width: ' + pageWidth + ', height: ' + pageHeight+' )');
		// console.log('[PAGE][ROTATE][PRE] correct(x: '+pp.x+', y: ' + pp.y + ')');
		// console.log('[PAGE][ROTATE][NEW] correct(x: '+cp.x+', y: ' + cp.y + ')');
	
		var slen = page.shapes.length;
		for (var i=0; i < slen; i++){
			var s = page.shapes[i];

			if (s.shapeStyle == 'line'){
				var r = AbGraphics.angle.rect(-prevAngle, 0, 0, s.x1 + pp.x, s.y1 + pp.y, s.x2 + pp.x, s.y2 + pp.y);
				r = AbGraphics.angle.rect(page.angle, 0, 0, r.x1, r.y1, r.x2, r.y2);

				s.rect(r.x1 - cp.x, r.y1 - cp.y, r.x2 - cp.x, r.y2 - cp.y);
			}else{
				var c = s.center();
				var cr = AbGraphics.angle.point(-prevAngle, 0, 0, c.x + pp.x, c.y + pp.y);
				var sr = AbGraphics.angle.point(-prevAngle, 0, 0, s.x + pp.x, s.y + pp.y);

				cr = AbGraphics.angle.point(page.angle, 0, 0, cr.x, cr.y);
				sr = AbGraphics.angle.point(page.angle, 0, 0, sr.x, sr.y);

				sr = AbGraphics.angle.point(-stepDegree, cr.x, cr.y, sr.x, sr.y);

				//console.log('\t\t['+s.shapeStyle+'] sr.x: '+sr.x + ', sr.y: '+sr.y+', cr.x: '+cr.x+', cr.y: '+cr.y);

				s.box(sr.x - cp.x, sr.y - cp.y, s.width, s.height);
	
				s.setAngle(AbGraphics.angle.increase(s.angle, stepDegree));

				//console.log('\t['+s.shapeStyle+'] x: '+s.x + ', y: '+s.y+', width: '+s.width+', height: '+s.height+', angle: '+s.angle + ', sr(x=' + sr.x + ', y=' + sr.y + ')');
			}
		}

		if (rendering){
			this.imagePositioning();
			this.render();
		}
	},

	scale: function (value, canvasX, canvasY, callback, animating, duration){
		if (!AbCommon.isBool(animating)) animating = true;
		if (!AbCommon.isNumber(duration)) duration = 400;
		if (!this.currentPage) return 1;
		
		if (arguments.length){

			this.currentPage.fitTo = null;

			// Notify
			this.notifyObservers('fit', null);

			var r = this.doScale(value, canvasX, canvasY, callback, animating, duration);
			if (r == -2)
				return false;

			// Notify
			this.notifyObservers('scale', value);
		}
		return this.currentPage.scale.x;
	},

	doScale: function (value, canvasX, canvasY, callback, animating, duration, rendering){
		if (!AbCommon.isBool(animating)) animating = true;
		if (!AbCommon.isNumber(duration)) duration = 400;
		if (!AbCommon.isBool(rendering)) rendering = true;
		if (!this.currentPage) return -1;
		
		if (!this.maniplatable())
			return -2;

		if (value < this.MIN_SCALE) value = this.MIN_SCALE;
		//else if (value > this.MAX_SCALE) value = this.MAX_SCALE;

		//-----------------------------------------------------------
		// begin record history
		// this.history.begin('page', 'update', this, ['scale'], function(c, o){
		// 	this.scale(c.scale.x, null, false);
		// });
		//-----------------------------------------------------------
		
		var page = this.currentPage;
		if (value == page.scale.x)
			return 0;
		
		var r = this.testContentView();
		var tr = this.testContentView(value);

		if (!AbCommon.isNumber(canvasX)) canvasX = r.center.x;
		if (!AbCommon.isNumber(canvasY)) canvasY = r.center.y;

		//-----------------------------------------------------------
		
		this.animateStates.begin('scale');

		//console.log('[SCALE] BEGIN...');

		if (r.inCanvas || tr.inCanvas){
			AbCommon.tween({
				caller: this,
				start: page.scale.x,
				end: value,
				easing: this.SCALE_ANI_EASING,
				duration: duration,
				animating: animating && this.enableAnimate,
				proc: function (value, d){
					//console.log('[SCALE][ING] ' + value + ', start=' + d.start + ', end=' + d.end);

					page.scale.x = value;
					page.scale.y = value;

					this.center(r.canvas.width, r.canvas.height);
					if (rendering)
						this.render();
				},
				ended: function(d){
					page.scale.x = d.end;
					page.scale.y = d.end;

					this.center(r.canvas.width, r.canvas.height);

					//-----------------------------------------------------------
					// end record history
					//this.history.end(this);
					//-----------------------------------------------------------
					
					if (rendering)
						this.render();

					this.animateStates.end('scale');

					//console.log('[SCALE] END ---------------------------------------------------------');
					//console.log('[SCALED] scale=' + page.scale.x);

					if (typeof callback == 'function')
						this.exec(callback);
				},
			});
		}else{
			var px = r.horizInCanvas ? r.center.x : canvasX;
			var py = r.vertInCanvas ? r.center.y : canvasY;

			//console.log('[SCALE][BEGIN] point(x: ' + px + ', y: ' + py + '), center(x: '+r.center.x + ', y: '+r.center.y + ')');

			var vp = page.fromCanvas(px, py);

			AbCommon.tween({
				caller: this,
				start: page.scale.x,
				end: value,
				duration: duration,
				animating: animating && this.enableAnimate,
				proc: function (value, d){
					//console.log('[SCALE][ING] ' + value + ', start=' + d.start + ', end=' + d.end);

					page.scale.x = value;
					page.scale.y = value;

					var cp = page.toCanvas(vp.x, vp.y);

					//console.log('[SCALE][ING] xval=' + (-(cp.x - px)) + ', yval=' + (-(cp.y - py)) + '');

					this.move(-(cp.x - px), -(cp.y - py), true, false);
					this.render();
				},
				ended: function (d){
					//console.log('[SCALE][END] ======================================================================================');

					page.scale.x = d.end;
					page.scale.y = d.end;

					var cp = page.toCanvas(vp.x, vp.y);

					this.move(-(cp.x - px), -(cp.y - py), true, false);

					//-----------------------------------------------------------
					// end record history
					//this.history.end(this);
					//-----------------------------------------------------------
					
					this.render();

					this.animateStates.end('scale');

					//console.log('[SCALE] END ---------------------------------------------------------');
					//console.log('[SCALED] scale=' + page.scale.x);

					if (typeof callback == 'function')
						this.exec(callback);
				},
			});
		}

		//console.log('[SCALE] scale(x: ' + page.scale.x + ', y: ' + page.scale.y + ', page rect( x: '+page.x + ', y: '+page.y+', width: ' + page.width + ', height: '+page.height+' )')

		return 1;
	},

	calcImagePosition: function(canvasWidth, canvasHeight, pageWidth, pageHeight){
		var page = this.currentPage;
		if (!page) return null;
		
		var fited = false;
		var pwidth = null, pheight = null;
		var canvas = this.context.canvas;	
		var cwidth = AbCommon.isNumber(canvasWidth) ? canvasWidth : canvas.width;
		var cheight = AbCommon.isNumber(canvasHeight) ? canvasHeight : canvas.height;

		if (!AbCommon.isNumber(pageWidth)) pageWidth = page.width;
		if (!AbCommon.isNumber(pageHeight)) pageHeight = page.height;
		
		cwidth -= this.margin.horiz();
		cheight -= this.margin.vert();

		switch(page.fitTo){
		case 'in':
			pwidth = pageWidth;
			pheight = pageHeight;
			fited = true;
			break;
		case 'horiz':
			pwidth = pageWidth;
			pheight = 0;
			fited = true;
			break;
		case 'vert':
			pheight = pageHeight;
			pwidth = 0;
			fited = true;
			break;
		}

		var dp = null;
		var ratio = 1;
		if (fited){
			var r = AbGraphics.box.zoom(pwidth, pheight, cwidth, cheight);
			ratio = r.ratio;

			dp = this.calcCenter(cwidth, cheight);
		}else{
			dp = this.calcCenter();
		}

		return {
			fited: fited,
			to: page.fitTo,
			scale: page.scale.x,
			ratio: ratio,
			canvas: { width: cwidth, height: cheight },
			origin: { width: pageWidth, height: pageHeight },
			page: { x: page.x, y: page.y, width: pwidth, height: pheight },
			destPage: { x: dp ? dp.x : page.x, y: dp ? dp.y : page.y, width: pwidth * ratio, height: pheight * ratio },
		};
	},

	imagePositioning: function(canvasWidth, canvasHeight, options){
		var page = this.currentPage;
		if (!page || page.error) return;
		
		if (!options) options = {};
		var animating = options.animate === true;
		var callback = options.callback;
		var imgpos = this.calcImagePosition(canvasWidth, canvasHeight);

		//if (!this.maniplatable()) return;

		this.animateStates.begin('fit');

		AbCommon.tween({
			caller: this,
			start: 0,
			end: 1,
			easing: options.easing || this.SCALE_ANI_EASING,
			duration: options.duration || this.SCALE_ANI_DURATION,
			animating: animating && this.enableAnimate,
			proc: function (value, d){
				//console.log('[FIT][ING] ' + value + ', start=' + d.start + ', end=' + d.end + ', scale='+imgpos.scale+', ratio=' + (imgpos.scale + (imgpos.ratio-imgpos.scale) * value));

				if (imgpos.fited){
					page.scale.x = imgpos.scale + (imgpos.ratio-imgpos.scale) * value;
					page.scale.y = imgpos.scale + (imgpos.ratio-imgpos.scale) * value;

					this.center(imgpos.canvas.width, imgpos.canvas.height);
				}else{
					page.x = (imgpos.destPage.x - imgpos.page.x) * value;
					page.y = (imgpos.destPage.y - imgpos.page.y) * value;
				}

				this.render();
			},
			ended: function(d){
				if (imgpos.fited){
					page.scale.x = imgpos.ratio;
					page.scale.y = imgpos.ratio;
		
					this.center(imgpos.canvas.width, imgpos.canvas.height);
				}else
					this.center();
		
				this.animateStates.end('fit');

				//console.log('[FIT] END ---------------------------------------------------------');

				if (typeof callback == 'function')
					this.exec(callback);
			},
		});
	},

	fit: function(value){
		if (arguments.length && this.currentPage){
			this.currentPage.fitTo = value;

			this.imagePositioning(null, null, {
				animate: true,
				callback: function(){
					this.render();

					// Notify
					this.notifyObservers('fit', this.currentPage.fitTo);
				}
			});
		}

		return this.currentPage ? this.currentPage.fitTo : null;
	},

	calcCenter: function(width, height){
		if (!this.currentPage) return;

		if (!arguments.length){
			width = this.context.canvas.width;
			height = this.context.canvas.height;

			// 마진 적용
			width -= this.margin.horiz();
			height -= this.margin.vert();
		}

		var page = this.currentPage;
		var image = page.image();
		var srcsiz = page.sourceSize();
		var pageWidth = srcsiz.width * page.scale.x, pageHeight = srcsiz.height * page.scale.y;

		var pageX = page.x, pageY = page.y;
		
		if (page.angle){
			var b = AbGraphics.angle.bounds(page.angle, 0, 0, pageWidth, pageHeight);
			pageWidth = b.width;
			pageHeight = b.height;
		}

		//console.log('[CENTERING] w=' + pageWidth + ', H=' + pageHeight);

		var half = 0;
		if (AbCommon.isNumber(width)){
			half = width >> 1;
			pageX = Math.round(half - (pageWidth >> 1));
			//page.x = Math.round(half);
		}

		if (AbCommon.isNumber(height)){
			half = height >> 1;
			pageY = Math.round(half - (pageHeight >> 1));
			//page.y = Math.round(half);
		}

		return {
			x: pageX,
			y: pageY
		}
	},

	center: function(width, height){
		var p = this.calcCenter.apply(this, arguments);
		if (!p) return;

		var page = this.currentPage;
		page.x = p.x;
		page.y = p.y;
	},

	move: function (canvasX, canvasY, increase, rendering){
		if (!this.currentPage) return;
		if (!AbCommon.isBool(rendering)) rendering = true;

		var page = this.currentPage;
		var oldx = page.x, oldy = page.y;

		//console.log('[CALL][PAGE-MOVE] page(width: ' + page.width + ', height: ' + page.height+')');

		var canvas = this.context.canvas;
		var canvasWidth = canvas.width, canvasHeight = canvas.height;
		// 마진 적용
		canvasWidth -= this.margin.horiz();
		canvasHeight -= this.margin.vert();
	
		var scaledPageWidth = page.width * page.scale.x, scaledPageHeight = page.height * page.scale.y;	
		
		var px = page.x, py = page.y;
		if (increase){
			px += canvasX;
			py += canvasY;
		}else{
			px = canvasX;
			py = canvasY;
		}

		// var s = '\t start(x=' + px + ', y=' + py + '), origin(x='+page.x+', y='+page.y+')';
		// s += ', view(w='+canvasWidth+', h=' + canvasHeight + ')';
		// s += ', scaled page(w='+scaledPageWidth + ', h='+scaledPageHeight+')';
		// s += ', RB(right='+(px+scaledPageWidth)+ ', bottom='+(py+scaledPageHeight)+')';
		// console.log(s);

		var horiz = scaledPageWidth > canvasWidth, vert = scaledPageHeight > canvasHeight;

		if (horiz){
			if (px > 0) px = 0;
			else if (px + scaledPageWidth < canvasWidth) px = canvasWidth - scaledPageWidth;
		}else{
			px = ((canvasWidth >> 1) - (scaledPageWidth >> 1));
		}

		if (vert){
			if (py > 0) py = 0;
			else if (py + scaledPageHeight < canvasHeight) py = canvasHeight - scaledPageHeight;			
		}else{
			py = ((canvasHeight >> 1) - (scaledPageHeight >> 1));
		}

		page.x = px;
		page.y = py;

		// console.log('\t moved page(x=' + page.x + ', y=' + page.y+')');

		if (rendering && (oldx != page.x || oldy != page.y))
			this.render();
	},

	//-----------------------------------------------------------

	copy: function (){
		if (!this.currentPage || !this.maniplatable()) return;
		this.clipboard.copy(this, this.currentPage, this.selectedShapes);

		// Notify
		this.notifyObservers('clipboard', 'copy');
	},

	cut: function(){
		if (!this.currentPage || !this.maniplatable()) return;
		this.clipboard.cut(this, this.currentPage, this.selectedShapes);

		// Notify
		this.notifyObservers('clipboard', 'cut');
	},

	paste: function (){
		if (!this.currentPage || !this.maniplatable()) return;
		this.clipboard.paste(this, this.currentPage);

		// Notify
		this.notifyObservers('clipboard', 'paste');
	},

	//-----------------------------------------------------------

	undo: function(){
		if (!this.maniplatable()) return;

		if (this.history.canUndo()){
			// Notify
			this.notifyObservers('history', 'undoing');
			
			this.history.undo(this);

			// Notify
			this.notifyObservers('history', 'undo');
		}
	},

	redo: function (){
		if (!this.maniplatable()) return;

		if (this.history.canRedo()){
			// Notify
			this.notifyObservers('history', 'redoing');

			this.history.redo(this);

			// Notify
			this.notifyObservers('history', 'redo');
		}
	},

	//-----------------------------------------------------------

	getShape: function(x, y){
		for (var i = this.currentPage.shapes.length - 1; i >= 0; i--){
			var s = this.currentPage.shapes[i];
			if (s.contains(x, y, this.viewContext))
				return s;
		}
		return null;
	},

	//-----------------------------------------------------------

	deleteShapes: function (rendering){
		if (!this.currentPage || !this.maniplatable()) return;
		if (!arguments.length) rendering = true;

		//-----------------------------------------------------------
		// begin record history
		this.history.begin('shape', 'remove', this);
		//-----------------------------------------------------------

		var page = this.currentPage;
		for (var i = page.shapes.length - 1; i >= 0; i--){
			var s = page.shapes[i];
			if (s.selected)
				page.shapes.splice(i, 1);
		}

		this.selectedShapes.splice(0, this.selectedShapes.length);
		this.focusedShape = false;

		//-----------------------------------------------------------
		// end record history
		this.history.end(this);
		//-----------------------------------------------------------

		if (rendering)
			this.render();

		// Notify
		this.notifyObservers('shape', 'delete');

		// Notify modified
		this.modified();
	},

	focusShape: function (s){
		if (this.focusedShape)
			this.focusedShape.focused = false;

		s.focused = true;
		s.selected = true;
		this.focusedShape = s;
	},

	selectShape: function (s){
		this.focusShape(s);
		this.selectedShapes.push(s);
	},

	unselectShape: function (s){
		var focused = s.focused;

		var idx = this.getIndexOfSelection(s);
		if (idx>=0)
			this.selectedShapes.splice(idx, 1);

		s.selected = false;
		s.focused = false;
	
		if (focused){
			this.focusedShape = null;

			if (this.selectedShapes.length)
				this.focusShape(this.selectedShapes[this.selectedShapes.length - 1]);
		}
	},

	//-----------------------------------------------------------

	getIndexOfSelection: function (s){
		for (var i = this.selectedShapes.length - 1; i >= 0; i--)
			if (this.selectedShapes[i] == s)
				return i;
		return -1;
	},

	getContainsSelection: function (x, y){
		// if (this.focusedShape){
		// 	if (this.focusedShape.contains(x, y, this.viewContext))
		// 		return this.focusedShape;
		// }

		var len = this.selectedShapes.length;
		for (var i = 0; i < len; i++){
			var s = this.selectedShapes[i];
			if (s.contains(x, y, this.viewContext))
				return s;
		}
		return null;
	},

	resizableShape: function (s){
		return s.shapeStyle != 'line';
	},

	resizeSelection: function (x, y, rendering){
		if (!AbCommon.isBool(rendering)) rendering = true;

		var page = this.currentPage;
		var len = this.selectedShapes.length;

		var fep = this.selection.editTarget.editPos(this.selection.edit);
		var ret = this.selection.editTarget.resize(this.selection.edit, x, y);

		//console.log('[RESIZE] ret(x=' + ret.x + ', y=' + ret.y + '), fep(x=' + fep.x + ', y=' + fep.y + ') rpos(x=' + ( ret.x - fep.x) + ', y='+(ret.y - fep.y) + ')');

		var resizable = this.resizableShape(this.selection.editTarget);
		if (ret){
			var rpos = { x: ret.x - fep.x, y: ret.y - fep.y };

			for (var i=0; i < len; i++){
				var s = this.selectedShapes[i];
				if (s == this.selection.editTarget)
					continue;

				if (this.selection.edit == 'A'){
					s.setAngle(AbGraphics.angle.increase(s.angle, ret));
				}else if (resizable && this.resizableShape(s)){
					var ep = s.editPos(this.selection.edit);
					var center = s.center();
					center = page.toCanvas(center.x, center.y);

					//console.log('\t[SHAPE] ep(x=' + ep.x + ', y=' + ep.y + ') result(x=' + (ep.x + rpos.x) + ', y='+(ep.y + rpos.y) + ')');

					var rotatedPx = AbGraphics.angle.point(s.angle, center.x, center.y, ep.x + rpos.x, ep.y + rpos.y);
					rotatedPx = page.fromCanvas(rotatedPx.x, rotatedPx.y);
					s.resize(this.selection.edit, rotatedPx.x, rotatedPx.y);
				}
			}
		}
		if (rendering) this.render();
	},

	//-----------------------------------------------------------

	select: function(options){
		if (!this.currentPage || !this.maniplatable()) return;

		var rendering = true;
		var opt = null;

		if (AbCommon.isBool(options)) {
			opt = {};
			rendering = options;
		}else if (arguments.length) {
			opt = options || {};
			if (AbCommon.isBool(opt.rendering)) rendering = opt.rendering;
		}else
			opt = {};

		if (!opt.additional)
			this.selectedShapes.splice(0, this.selectedShapes.length);

		var startCnt = this.selectedShapes.length;

		//console.log('[SELECTION] dragged=' + this.selection.dragged());

		var sel = null;
		if (this.selection.dragged()){
			if (!opt.additional)
				this.focusedShape = null;

			var box = this.selection.box();
			for (var i=this.currentPage.shapes.length - 1; i >= 0; i--){
				var s = this.currentPage.shapes[i];
				if (s.contains(box.x, box.y, box.width, box.height, this.viewContext)){
					s.selected = true;
					this.selectedShapes.push(s);

					if (!opt.additional){
						if (!sel){
							sel = s;
							s.focused = true;
							this.focusedShape = s;
						}else{
							s.focused = false;
						}
					}
				}else if (!opt.additional){
					s.selected = false;
					s.focused = false;
				}
			}
		}else{
			var x = this.selection.end.x, y = this.selection.end.y;
			// if (this.focusedShape && this.focusedShape.contains(x, y, this.viewContext))
			// 	return;

			if (!opt.additional)
				this.focusedShape = null;

			for (var i=this.currentPage.shapes.length - 1; i >= 0; i--){
				var s = this.currentPage.shapes[i];
				if (!sel && s.contains(x, y, this.viewContext)){
					s.selected = true;
					this.selectedShapes.push(s);

					if (!opt.additional){
						s.focused = true;
						this.focusedShape = s;
					}
					sel = s;
				}else if (!opt.additional){
					s.selected = false;
					s.focused = false;
				}
			}
		}
		if (rendering) this.render();

		var endCnt = this.selectedShapes.length;

		if (endCnt - startCnt > 0){
			// Notify
			this.notifyObservers('shape', 'select');
		}
	},

	unselect: function(options){
		if (!this.currentPage || !this.maniplatable()) return false;

		var unselected = this.selectedShapes.length > 0;
		var rendering = true;
		var opt = null;

		if (AbCommon.isBool(options)) {
			opt = {};
			rendering = options;
		}else if (arguments.length) {
			opt = options || {};
			if (AbCommon.isBool(opt.rendering)) rendering = opt.rendering;
		}else
			opt = {};

		this.selectedShapes.splice(0, this.selectedShapes.length);
		if (opt.unfocusOnly){
			this.selectedShapes.push(this.focusedShape);
		}else{
			this.focusedShape = null;
		}

		for (var i=this.currentPage.shapes.length - 1; i >= 0; i--){
			var s = this.currentPage.shapes[i];

			if (opt.unfocusOnly === true && s == this.focusedShape)
				continue;

			s.selected = false;
			s.focused = false;
		}

		if (rendering) this.render();

		if (unselected){
			// Notify
			this.notifyObservers('shape', 'unselect');
		}

		return unselected;
	},

	unselectUnfocus: function(){
		if (!this.currentPage || !this.maniplatable()) return;

		if (!AbCommon.isBool(rendering)) rendering = true;

		this.selectedShapes.splice(0, this.selectedShapes.length);

		this.focusedShape = null;
		for (var i=this.currentPage.shapes.length - 1; i >= 0; i--){
			var s = this.currentPage.shapes[i];

			s.selected = false;
			s.focused = false;
		}

		if (rendering) this.render();
	},

	//-----------------------------------------------------------

	selectAll: function(rendering){
		if (!this.currentPage || !this.maniplatable()) return;
		
		if (!AbCommon.isBool(rendering)) rendering = true;

		this.selectedShapes.splice(0, this.selectedShapes.length);
		this.focusedShape = null;

		for (var i=this.currentPage.shapes.length - 1; i >= 0; i--){
			var s = this.currentPage.shapes[i];

			s.selected = true;
			s.focused = false;

			this.selectedShapes.push(s);
			if (i == 0){
				s.focused = true;
				this.focusedShape = s;
			}
		}
		
		if (rendering) this.render();

		if (this.selectedShapes.length){
			// Notify
			this.notifyObservers('shape', 'selectAll');
		}
	},

	//-----------------------------------------------------------

	historySync: function (topic, cmd, docmd, data, callback){
		this.notifyObservers('history.sync', {
			topic: topic,
			cmd: cmd,
			docmd: docmd,
			data: data
		}, callback);
	},

	//-----------------------------------------------------------

	pageInserted: function (index){
		if (this.currentPageIndex >= 0){
			if (this.currentPageIndex >= index)
				this.currentPageIndex++;
		}
	},
	
	pageRemoved: function (index){
		if (this.currentPageIndex >= 0){
			if (this.currentPageIndex >= index)
			this.currentPageIndex--;
		}
	},

	//-----------------------------------------------------------

	clearPages: function(){
		this.selectedShapes.splice(0, this.selectedShapes.length);
		this.focusedShape = null;

		this.pages.clear(true);
		
		this.currentPage = null;
		this.currentPageIndex = -1;
	},

	removePages: function (pageIndexArray, history){
		if (!this.maniplatable()) return;
		if (!pageIndexArray || !$.isArray(pageIndexArray)) return;
		
		if (!AbCommon.isBool(history)) history = true;

		var cindex = this.currentPageIndex;
		var cdel = false;
	
		//-----------------------------------------------------------
		// begin record history
		if (history) this.history.begin('page', 'remove', this, pageIndexArray);
		//-----------------------------------------------------------

		pageIndexArray.sort(function (a, b){ return a - b; });

		var pages = [];
		for (var i=pageIndexArray.length - 1; i >= 0; i--){
			var idx = pageIndexArray[i];
			if (idx == cindex) cdel = true;

			var page = this.pages.splice(idx, 1);

			pages.push({
				index: idx,
				page: page
			});
		}

		//-----------------------------------------------------------
		// end record history
		if (history) this.history.end(this);
		//-----------------------------------------------------------

		// Notify
		this.notifyObservers('page.remove', pages);

		if (cdel){
			if (this.pages.length()){
				this.currentPage = null;
				this.currentPageIndex = -1;
	
				if (cindex >= this.pages.length())
					cindex = this.pages.length() - 1;

				this.selectPage(cindex);
	
			}else{
				this.unselectPage();
			}
		}

		return pages;
	},

	removePageRange: function (start, end, history){
		var ia = [], siz = this.pages.length() - 1;
		for (var i = start; i <= end; i++){
			if (i >= 0 && i <= siz)
				ia.push(i);
		}

		if (ia.length)
			this.removePages(ia, history);
	},

	removePage: function (history){
		if (!this.currentPage) return;

		this.removePages([this.currentPageIndex], history);
	},

	addPage: function (page, selecting, history){
		if (!page || !this.maniplatable()) return;
		if (!(page instanceof AbPage)) return;

		if (!AbCommon.isBool(selecting)) selecting = true;
		if (!AbCommon.isBool(history)) history = true;

		//-----------------------------------------------------------
		// begin record history
		if (history) this.history.begin('page', 'add', this);
		//-----------------------------------------------------------
		
		this.pages.push(page);

		if (selecting === true){
			this.currentPageIndex = this.pages.length() - 1;
			this.currentPage = page;
	
			if (page.shapes.length){
				var len = page.shapes.length;
				for (var i=0; i < len; i++){
					var s = page.shapes[i];
	
					s.engine = this;
					e.measure();
				}
			}
		}

		//-----------------------------------------------------------
		// end record history
		if (history) this.history.end(this);
		//-----------------------------------------------------------

		// Notify
		this.notifyObservers('page', 'add');
	},

	selectable: function(idx){
		if (!AbCommon.isNumber(idx)) idx = parseInt(idx);
		//return idx >= 0 && idx < this.pages.length() && !this.pages.get(idx).isError();
		return idx >= 0 && idx < this.pages.length();
	},

	selectPage: function(){
		if (arguments.length && this.maniplatable()){
			var idx = arguments[0];
			var forcibly = arguments[1] === true;
			
			if (this.pages.length() < 1){
				this.currentPage = null;
				this.currentPageIndex = -1;
			}else{
				if (!AbCommon.isNumber(idx)) idx = parseInt(idx);

				if (this.selectable(idx)){
					var checked = forcibly || this.currentPageIndex != idx;

					if (checked){
						var page = this.pages.get(idx);

						if (!page.error && !page.editable()){
							this.notifyObservers('request.select', idx);
						}else{
							this.currentPageIndex = idx;
							this.currentPage = page;
	
							this.focusedShape = null;
							this.selectedShapes.splice(0, this.selectedShapes.length);
	
							if (this.currentPage.shapes.length){
								var siz = this.currentPage.shapes.length;
								for (var i=0; i < siz; i++){
									var s = this.currentPage.shapes[i];
	
									if (s.selected)
										this.selectedShapes.push(s);
	
									if (s.focused)
										this.focusedShape = s;
								}
							}
		
							this.imagePositioning();
							this.render();
						}
					}
					// Notify
					this.notifyObservers('page', 'select');
				}
			}
		}
		return this.currentPage;
	},

	unselectPage: function(rendering){
		if (!AbCommon.isBool(rendering)) rendering = true;

		this.currentPage = null;
		this.currentPageIndex = -1;

		if (rendering)
			this.render();

		this.notifyObservers('page', 'unselect');
	},

	refresh: function(){
		if (!this.currentPage)
			return;

		this.imagePositioning();
		this.render();
	},

	//-----------------------------------------------------------

	removeAllPageShapes: function (history){
		if (!AbCommon.isBool(history)) history = true;
		
		this.exec(function (){
			//var bak = { index: this.currentPageIndex, page: this.currentPage };

			//-----------------------------------------------------------
			// begin record history
			if (history) this.history.begin('shape', 'all', this);
			//-----------------------------------------------------------

			for (var i = this.pages.length() - 1; i >= 0; i--){
				var shapes = this.pages.get(i).shapes;
				shapes.splice(0, shapes.length);
			}

			//-----------------------------------------------------------
			// end record history
			if (history) this.history.end(this);
			//-----------------------------------------------------------

			this.render();

			// Notify
			this.notifyObservers('shape', 'all.remove');
			
			// Notify modified
			this.modified();
		});
	},

	//-----------------------------------------------------------

	removeRangePageShapes: function (pages, history){
		if (!AbCommon.isBool(history)) history = true;
		
		this.exec(function (){
			//var bak = { index: this.currentPageIndex, page: this.currentPage };

			//-----------------------------------------------------------
			// begin record history
			if (history) this.history.begin('shape', 'range', this, pages);
			//-----------------------------------------------------------

			for (var i = pages.length - 1; i >= 0; i--){
				var shapes = pages[i].shapes;
				shapes.splice(0, shapes.length);
			}

			//-----------------------------------------------------------
			// end record history
			if (history) this.history.end(this);
			//-----------------------------------------------------------

			this.render();

			// Notify
			this.notifyObservers('shape', 'range.remove');
			
			// Notify modified
			this.modified();
		});
	},

	//-----------------------------------------------------------

	addShape: function (){
		if (!arguments.length || !this.currentPage)
			return;
		
		var data = arguments[0];
		var shape = this.shapeObject(data);
		if (!shape)
			return;

		var creation = false, options = null;
		if (arguments.length >= 2){
			if (AbCommon.isBool(arguments[1])){
				creation = arguments[1];
				options = {};
			}else{
				options = arguments[1] || {};
				creation = options.creation || false;
			}
		}else{
			options = {};
		}

		if (AbCommon.isString(data))
			creation = true;

		/*
		shape.x = 10;
		shape.y = 20;
		shape.width = 50;
		shape.height = 50;
		*/

		if (creation){
			if (this.maniplatable()){
				this.selection.target = data;
			}
		}else{
			var page = this.currentPage;

			//-----------------------------------------------------------
			// begin record history
			this.history.begin('shape', 'add', this);
			//-----------------------------------------------------------

			page.shapes.push(shape);

			//-----------------------------------------------------------
			// end record history
			this.history.end(this);
			//-----------------------------------------------------------
			
			shape.engine = this;
			shape.measure();

			// Notify
			this.notifyObservers('shape.add', shape);
		}

		// var render = options.render || false;
		// if (render)
		// 	this.render();
	},

	//-----------------------------------------------------------

	restoreSelection: function (){
		//console.log('[CALL] restoreSelection()');
		//return;

		if (this.selection.drawed){
			var ctx = this.viewContext;
			ctx.save();

			var box = this.selection.drawed;
			box.x += this.margin.left;
			box.y += this.margin.top;

			var alpha = ctx.globalAlpha;
			ctx.globalAlpha = 1;

			var page = this.currentPage;
				
			var strokeSize = this.selection.style && this.selection.style.stroke ? this.selection.style.stroke.width : 1;
			var pbox = AbGraphics.box.inflate(box.x, box.y, box.width, box.height, strokeSize);
			
			this.paintRect(pbox.x, pbox.y, pbox.width, pbox.height);
			//this.paintRect(pbox.x + page.x, pbox.y + page.y, pbox.width, pbox.height);

			this.selection.drawed = null;

			ctx.globalAlpha = alpha;
			ctx.restore();
		}

	},

	drawSelection: function (){
		//return;

		var ctx = this.viewContext;
		var box = this.selection.box();
		var page = this.currentPage;
		
		box = page.toCanvasBox(box);

		ctx.save();
		ctx.translate(this.margin.left, this.margin.top);

		if (this.selection.style.color){
			ctx.fillStyle = this.selection.style.color;
			ctx.fillRect(box.x, box.y, box.width, box.height);
		}

		if (this.selection.style.stroke){
			ctx.strokeStyle = this.selection.style.stroke.color;
			ctx.lineWidth = this.selection.style.stroke.width;
			ctx.strokeRect(box.x, box.y, box.width, box.height);
		}
		ctx.restore();

		this.selection.drawed = box;
	},

	drawCreation: function(){
		//console.log('[CALL] drawCreation()');

		var page = this.currentPage;
		var ctx = this.viewContext;
		ctx.save();

		var pc = page.toCanvas(0, 0);
		ctx.translate(pc.x, pc.y);
		ctx.translate(this.margin.left, this.margin.top);

		var targetShape = this.shapeObject(this.selection.target);
		var direct = AbCommon.supportCreationDraw(targetShape);
		//var direct = false;

		if (direct){
			targetShape.creationDraw(ctx, page, this.selection);
		}else{
			if (targetShape.hasOwnProperty('creationAlpha'))
				ctx.globalAlpha = targetShape.creationAlpha;

			if (!targetShape.hasOwnProperty('creationSize') || targetShape.creationSize !== 'auto'){
				targetShape.rect(
					this.selection.start.x,
					this.selection.start.y,
					this.selection.end.x,
					this.selection.end.y
				);
			}
				
			targetShape.draw(ctx, page, true);
		}	

		// 가상 좌표계 좌표
		if (targetShape && AbCommon.supportRestoreMinimumSize(targetShape)){
			var minimum = targetShape.restoreMinimumSize();

			var tbox = page.toCanvasBox(targetShape.box());
			this.selection.drawed = AbGraphics.box.inflate(tbox.x, tbox.y, tbox.width, tbox.height, minimum.width, minimum.height);

			//this.selection.drawed = targetShape.restoreRect(targetShape.box());
		}else{
			this.selection.drawed = page.toCanvasBox(targetShape.box());
		}

		ctx.restore();
	},

	//-----------------------------------------------------------

	drawError: function (){
		var page = this.currentPage;
		var ctx = this.viewContext;
		ctx.save();

		ctx.restore();
	},

	//-----------------------------------------------------------

	renderThumbnail: function (gen, page){
		if (arguments.length <= 1) page = this.currentPage;

		if (AbCommon.isNumber(page)){
			if (page < 0 || page >= this.pages.length()) return;
			page = this.pages.get(page);
		}

		if (page.error) return;
		
		//-----------------------------------------------------------

		var image = page.image();

		gen.resize(page.width, page.height);

		var ctx = gen.context;

		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		
		var image = page.originThumbnail();
		if (!image) image = page.image();

		if (image){
			// var marginLeft = this.margin.left, marginTop = this.margin.top, marginRight = this.margin.right, marginBottom = this.margin.bottom;
			// this.margin.left = this.margin.top = this.margin.right = this.margin.bottom = 0;
			
			var cpage = this.currentPage;
			this.currentPage = page;
			
			var srcsiz = page.sourceSize();
			var w = Math.round(srcsiz.width * gen.ratio), h = Math.round(srcsiz.height * gen.ratio);
			//var w = srcsiz.width * gen.ratio, h = srcsiz.height * gen.ratio;

			//-----------------------------------------------------------
			// Hermite
			// var e = $('<canvas width="'+srcsiz.width+'" height="'+srcsiz.height+'"/>');
			// var imgCanvas = e.get(0);
			// var imgctx = imgCanvas.getContext('2d');
			// imgctx.drawImage(image, 0, 0);

			// AbGraphics.image.hermite(imgCanvas, w, h, true);
			//-----------------------------------------------------------

			ctx.save();
			//AbGraphics.canvas.imageSmoothing(ctx, true);

			if (page.angle){
				var cp = AbGraphics.angle.correctDisplayCoordinate(page.angle, w, h);
				ctx.rotate(AbGraphics.angle.deg2rad(page.angle));
				ctx.translate(-cp.x, -cp.y);
				ctx.drawImage(image, 0, 0, w, h);
			}else{
				ctx.drawImage(image, 0, 0, w, h);
			}

			ctx.restore();
	
			if (this.$showShapes)
				page.drawOrigin(ctx, gen.ratio);				

			// this.margin.left = marginLeft;
			// this.margin.top = marginTop;
			// this.margin.right = marginRight;
			// this.margin.bottom = marginBottom;
			
			this.currentPage = cpage;
		}
	},

	renderImage: function (ctx, page, drawShapes){
		if (arguments.length <= 1) page = this.currentPage;
		if (arguments.length <= 2) drawShapes = this.$showShapes;

		if (AbCommon.isNumber(page)){
			if (page < 0 || page >= this.pages.length()) return;
			page = this.pages.get(page);
		}

		if (page.error) return;

		//-----------------------------------------------------------

		var pageWidth = page.width, pageHeight = page.height;

		if (!page.editable()){
			var srcsiz = page.sourceSize();
			pageWidth = srcsiz.width;
			pageHeight = srcsiz.height;
		}

		ctx.canvas.width = pageWidth;
		ctx.canvas.height = pageHeight;
		
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		
		var image = page.image();
		if (image){
			var cpage = this.currentPage;
			this.currentPage = page;
			
			var srcsiz = page.sourceSize();
			var w = srcsiz.width, h = srcsiz.height;

			// var marginLeft = this.margin.left, marginTop = this.margin.top, marginRight = this.margin.right, marginBottom = this.margin.bottom;
			// this.margin.left = this.margin.top = this.margin.right = this.margin.bottom = 0;

			ctx.save();

			if (page.angle){
				var cp = AbGraphics.angle.correctDisplayCoordinate(page.angle, w, h);
				ctx.rotate(AbGraphics.angle.deg2rad(page.angle));
				ctx.translate(-cp.x, -cp.y);
				ctx.drawImage(image, 0, 0);
			}else{
				ctx.drawImage(image, 0, 0);
			}

			ctx.restore();
	
			//-----------------------------------------------------------

			if (this.drawableWaterMark()){
				this.waterMark.draw(ctx, 1, pageWidth, pageHeight);
			}
		
			//-----------------------------------------------------------

			if (drawShapes)
				page.drawOrigin(ctx, 1);

			// this.margin.left = marginLeft;
			// this.margin.top = marginTop;
			// this.margin.right = marginRight;
			// this.margin.bottom = marginBottom;
			
			this.currentPage = cpage;
		}
	},

	//-----------------------------------------------------------

	drawableWaterMark: function(){ return this.waterMark && this.waterMark.drawable(); },

	//-----------------------------------------------------------

	render: function (painting){
		if (!this.context) return;

		if (!arguments.length) painting = true;

		//console.log('[CALL] render()');
		this.exec(function (){
			//console.log('[CALLED] render()');
			var len = 0, sel = null;
			var ctx = this.context;
			
			//-----------------------------------------------------------
			// page
			var page = this.currentPage;

			if (page && !page.error){
				var runtime = this.runtime;
				this.runtime = true;

				ctx.save();

				this.clearCanvas(ctx);
				
				ctx.translate(page.x, page.y);
				ctx.translate(this.margin.left, this.margin.top);
				
				//-----------------------------------------------------------
	
				var image = page.image();
				if (image){
					var pageAngle = page.angle;
					//var pageAngle = 380 % 360;

					var mx = 0, my = 0;
					var srcsiz = page.sourceSize();
					var w = srcsiz.width * page.scale.x, h = srcsiz.height * page.scale.y;
					var pageWidth = page.width, pageHeight = page.height;
				
					ctx.save();
					if (pageAngle){
					//if (true){
						var b = AbGraphics.angle.bounds(pageAngle, 0, 0, srcsiz.width, srcsiz.height);
						pageWidth = b.width;
						pageHeight = b.height;
						
						var cp = AbGraphics.angle.correctDisplayCoordinate(pageAngle, w, h);

						//console.log('[DRAWE] correct(x: '+cp.x+', y: ' + cp.y + ')');
						
						//-----------------------------------------------------------

						ctx.translate(mx, my);
						ctx.rotate(AbGraphics.angle.deg2rad(pageAngle));
						ctx.translate(-cp.x, -cp.y);

						//-----------------------------------------------------------

						ctx.drawImage(image, 0, 0, w, h);

						//ctx.fillStyle = 'red';
						//ctx.fillRect(0, 0, w, h);
					}else{
						ctx.drawImage(image, 0, 0, w, h);
						//ctx.fillStyle = 'red';
						//ctx.fillRect(0, 0, w, h);
					}
					ctx.restore();

					//-----------------------------------------------------------
					// [Begin] Boxing
					//-----------------------------------------------------------

					// var radian = AbGraphics.angle.deg2rad(pageAngle);
					// var cs = AbGraphics.rotate.corners(radian, 0, 0, 0, 0, w, h);
					// var b = AbGraphics.rotate.bounds(radian, 0, 0, w, h);
					// var hbw = b.width >> 1, hbh = b.height >> 1;
					// var hw = w >> 1, hh = h >> 1;
					// var mlen = 100;

					// //console.log('[DRAWING] w=' + b.width + ', H=' + b.height);
					
					// ctx.strokeStyle = ctx.fillStyle = 'cyan';
					// ctx.lineWidth = 5;
					// ctx.beginPath();
					// ctx.moveTo(mx - mlen, my);
					// ctx.lineTo(mx + mlen, my);
					// ctx.moveTo(mx, my - mlen);
					// ctx.lineTo(mx, my + mlen);
					// ctx.stroke();
					// ctx.closePath();

					// ctx.beginPath();
					// ctx.moveTo(mx + hw - mlen, my + hh);
					// ctx.lineTo(mx + hw + mlen, my + hh);
					// ctx.moveTo(mx + hw, my + hh - mlen);
					// ctx.lineTo(mx + hw, my + hh + mlen);
					// ctx.stroke();
					// ctx.closePath();

					// ctx.strokeStyle = ctx.fillStyle = '#D99088';
					// ctx.beginPath();
					// ctx.moveTo(mx + hbw - mlen, my + hbh);
					// ctx.lineTo(mx + hbw + mlen, my + hbh);
					// ctx.moveTo(mx + hbw, my + hbh - mlen);
					// ctx.lineTo(mx + hbw, my + hbh + mlen);
					// ctx.stroke();
					// ctx.closePath();
					
					// ctx.lineWidth = 1;
					// drawBounds(b, mx, my);

					// ctx.font = '32px tahoma';
					// ctx.beginPath();
					// ctx.strokeStyle = ctx.fillStyle = '#FF00AE';
					// ctx.arc(mx + cs.leftTop.x, my + cs.leftTop.y, 5, 0, 360);
					// ctx.fillText('LT (' + cs.leftTop.x.toFixed(1) + ', ' + cs.leftTop.y.toFixed(1)+')', mx + cs.leftTop.x, my + cs.leftTop.y + 40);
					// ctx.fill();

					// ctx.beginPath();
					// ctx.strokeStyle = ctx.fillStyle = '#D0FF00';
					// ctx.arc(mx + cs.rightTop.x, my + cs.rightTop.y, 5, 0, 360);
					// ctx.fillText('RT (' + cs.rightTop.x.toFixed(1) + ', ' + cs.rightTop.y.toFixed(1)+')', mx + cs.rightTop.x, my + cs.rightTop.y + 40);
					// ctx.fill();

					// ctx.beginPath();
					// ctx.strokeStyle = ctx.fillStyle = '#3AE2CE';
					// ctx.arc(mx + cs.rightBottom.x, my + cs.rightBottom.y, 5, 0, 360);
					// ctx.fillText('RB (' + cs.rightBottom.x.toFixed(1) + ', ' + cs.rightBottom.y.toFixed(1)+')', mx + cs.rightBottom.x, my + cs.rightBottom.y + 40);
					// ctx.fill();

					// ctx.beginPath();
					// ctx.strokeStyle = ctx.fillStyle = '#FFDD00';
					// ctx.arc(mx + cs.leftBottom.x, my + cs.leftBottom.y, 5, 0, 360);
					// ctx.fillText('LB (' + cs.leftBottom.x.toFixed(1) + ', ' + cs.leftBottom.y.toFixed(1)+')', mx + cs.leftBottom.x, my + cs.leftBottom.y + 40);
					// ctx.fill();			
					
					// function drawBounds(b, x, y) {
					// 	if (!x) x = 0; if (!y) y = 0;
					// 	//x -= b.x; y -= b.y;
					// 	var w = b.width, h = b.height;
					// 	// bounds
					// 	ctx.strokeStyle = ctx.fillStyle = 'red';
					// 	ctx.beginPath();
					// 	ctx.moveTo(x, y);
					// 	ctx.lineTo(x + w, y);
					// 	ctx.lineTo(x + w, y + h);
					// 	ctx.lineTo(x, y + h);
					// 	ctx.lineTo(x, y);
					// 	//ctx.fill();
					// 	ctx.stroke();
					// 	ctx.closePath();
					// }

					//-----------------------------------------------------------
					// [END] Boxing
					//-----------------------------------------------------------
				}
		
				//-----------------------------------------------------------

				//console.log('[RENDER] w=' + pageWidth + ', h=' + pageHeight);

				if (this.drawableWaterMark()){
					this.waterMark.draw(ctx, page.scale.x, {
						source: { width: srcsiz.width * page.scale.x, height: srcsiz.height * page.scale.x },
						view: { width: pageWidth * page.scale.x, height: pageHeight * page.scale.y }
					});
				}

				//-----------------------------------------------------------
	
				if (this.$showShapes){
					page.drawShapes(ctx);
				}

				ctx.restore();

				this.runtime = runtime;
			}else{
				this.clearCanvas(ctx);
			}


			//-----------------------------------------------------------

			if (painting)
				this.paint();
		});
	},

	//-----------------------------------------------------------

	clearCanvas: function(ctx){
		// var page = this.currentPage;
			
		// if (page && (!page.angle || page.angle % 90 == 0)){
		// 	var pageWidth = page.width * page.scale.x, pageHeight = page.height * page.scale.y;

		// 	if (this.style.color){
		// 		ctx.fillStyle = this.style.color;
		// 		ctx.fillRect(0, 0, ctx.canvas.width, page.y + this.margin.top); // top
		// 		ctx.fillRect(page.x + pageWidth + this.margin.left, 0, ctx.canvas.width - (page.x + pageWidth + this.margin.left), ctx.canvas.height); // right
		// 		ctx.fillRect(0, page.y + pageHeight + this.margin.top, ctx.canvas.width, ctx.canvas.height - (page.y + pageHeight + this.margin.top)); // bottom
		// 		ctx.fillRect(0, 0, page.x + this.margin.left, ctx.canvas.height); // left
		// 	}else{
		// 		ctx.clearRect(0, 0, ctx.canvas.width, page.y + this.margin.top); // top
		// 		ctx.clearRect(page.x + pageWidth + this.margin.left, 0, ctx.canvas.width - (page.x + pageWidth + this.margin.left), ctx.canvas.height); // right
		// 		ctx.clearRect(0, page.y + pageHeight + this.margin.top, ctx.canvas.width, ctx.canvas.height - (page.y + pageHeight + this.margin.top)); // bottom
		// 		ctx.clearRect(0, 0, page.x + this.margin.left, ctx.canvas.height); // left
		// 	}
		// }else if (this.style.color){
		
		if (this.style.color){
			ctx.fillStyle = this.style.color;
			ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		}else{
			ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		}
	},

	paintRect: function (x, y, w, h){
		//console.log('[PAINT-RECT] x' + x + ', y=' + y + ', w=' + w + ', h=' + h);

		if (x < 0){ w -= x; x = 0; }
		if (y < 0){ h -= y; y = 0; }
		if (w <= 0 || h <= 0) return;

		var ctx = this.viewContext;


		if (!this.style.color)
			ctx.clearRect(x, y, w, h);
		ctx.drawImage(this.context.canvas, x, y, w, h, x, y, w, h);
	},

	paint: function(){
		if (this.animateStates.$engine === true)
			return;

		this.exec(function (){
			var ctx = this.viewContext;

			if (!this.style.color)
				this.clearCanvas(ctx);
			ctx.drawImage(this.context.canvas, 0, 0);
		});
	},

	animate: function (){
		var requestAnimFrame = AbCommon.requestAnimFrame();
		if (typeof requestAnimFrame == 'function'){
			this.animateStates.$engine = true;
			this.notifyObservers('animate.engine', true);

			var render = function (timestamp){
				var self = arguments.callee.self;
	
				//console.log('[ANIMATE] runtime=' + self.runtime);
	
				if (!self.runtime){
					var ctx = self.viewContext;
					
					self.clearCanvas(ctx);
					ctx.drawImage(self.context.canvas, 0, 0);
				}
	
				this.ani = requestAnimFrame(render);
			};
			render.self = this;
	
			this.ani = requestAnimFrame(render);
		}
	},

	stop: function(){
		var cancelAnimFrame = AbCommon.cancelAnimFrame();

		if(this.ani)
			cancelAnimFrame(this.ani);

		this.animateStates.$engine = false;

		this.notifyObservers('animate.engine', false);
	},

	toBlob: function(callback){
		return AbGraphics.canvas.toBlob(this.context);
	},

	zIndex: function (cmd){
		if (!this.currentPage || !this.maniplatable()) return;
		if (!this.selectedShapes.length && !this.focusedShape) return;

		// validation command
		switch(cmd){
		case 'top': case 'up': case 'down': case 'bottom': break;
		default: return;
		}
	
		var page = this.currentPage;

		// rollback selected shapes
		//var backupSelectedShapes = this.selectedShapes;
		//this.selectedShapes = page.shapes;

		//-----------------------------------------------------------
		// begin record history
		this.history.begin('shape', 'zindex', this, cmd);

		if (cmd == 'top' || cmd == 'bottom'){
			var a = [];
			for (var i=page.shapes.length - 1; i >= 0; i--){
				if (page.shapes[i].selected){
					var s = page.shapes.splice(i, 1);
					if (s.length)
						a.unshift(s[0]);
				}
			}
	
			if (cmd == 'top')
				Array.prototype.push.apply(page.shapes, a);
			else
				Array.prototype.unshift.apply(page.shapes, a);
		}else if (cmd == 'up' || cmd == 'down'){
			var a = [];
			for (var i=page.shapes.length - 1; i >= 0; i--){
				if (page.shapes[i].selected){
					a.unshift(i);
				}
			}

			if (cmd == 'up'){
				for (var i=a.length; i >= 0; i--){
					var idx = a[i];

					if (idx + 1 == page.shapes.length)
						break;
					
					var tmp = page.shapes[idx + 1];
					page.shapes[idx + 1] = page.shapes[idx];
					page.shapes[idx] = tmp;
				}
			}else{
				var alen = a.length;
				for (var i=0; i < alen; i++){
					var idx = a[i];

					if (idx == 0)
						break;
					
					var tmp = page.shapes[idx - 1];
					page.shapes[idx - 1] = page.shapes[idx];
					page.shapes[idx] = tmp;
				}
			}
		}

		//-----------------------------------------------------------
		// end record history
		this.history.end(this);

		// rollback selected shapes
		//this.selectedShapes = backupSelectedShapes;

		this.exec(function(){
			this.render();
		});
	},
};