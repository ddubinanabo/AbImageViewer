/**
 * 버튼 옵션
 * <p>* 필드명이 버튼명, 필드값이 표시 텍스트인 객체입니다.
 * @typedef {Object.<String, String>} AbMsgBox.ButtonMap
 */

/**
 * 메시지 창 도구
 * @namespace
 */
var AbMsgBox = {
	/**
	 * 메시지 창을 표시합니다.
	 * @memberof AbMsgBox
	 * @param {String} text 메시지
	 * @param {String} [title] 창 타이틀
	 * @param {AbMsgBox.ButtonMap} [buttons={ok:'확인'}] 버튼 옵션
	 * @return {Promise} Promise 객체
	 */
	show: function(text, title, buttons){
		return this.showIt({
			title: title,
			text: text,
			buttons: buttons || {
				ok: '확인'
			},
		});
	},

	/**
	 * 정보 메시지 창을 표시합니다.
	 * @memberof AbMsgBox
	 * @param {String} text 메시지
	 * @param {String} [title] 창 타이틀
	 * @param {AbMsgBox.ButtonMap} [buttons={ok:'확인'}] 버튼 옵션
	 * @return {Promise} Promise 객체
	 */
	info: function(text, title, buttons){
		return this.showIt({
			css: 'info',
			title: title,
			text: text,
			buttons: buttons || {
				ok: '확인'
			},
		});
	},

	/**
	 * 오류 메시지 창을 표시합니다.
	 * @memberof AbMsgBox
	 * @param {String} text 메시지
	 * @param {String} [title] 창 타이틀
	 * @param {AbMsgBox.ButtonMap} [buttons={ok:'확인'}] 버튼 옵션
	 * @return {Promise} Promise 객체
	 */
	error: function(text, title, buttons){
		return this.showIt({
			css: 'error',
			title: title,
			text: text,
			buttons: buttons || {
				ok: '확인'
			},
		});
	},

	/**
	 * 경고 메시지 창을 표시합니다.
	 * @memberof AbMsgBox
	 * @param {String} text 메시지
	 * @param {String} [title] 창 타이틀
	 * @param {AbMsgBox.ButtonMap} [buttons={ok:'확인'}] 버튼 옵션
	 * @return {Promise} Promise 객체
	 */
	warning: function(text, title, buttons){
		return this.showIt({
			css: 'warn',
			title: title,
			text: text,
			buttons: buttons || {
				ok: '확인'
			},
		});
	},

	/**
	 * 성공 메시지 창을 표시합니다.
	 * @memberof AbMsgBox
	 * @param {String} text 메시지
	 * @param {String} [title] 창 타이틀
	 * @param {AbMsgBox.ButtonMap} [buttons={ok:'확인'}] 버튼 옵션
	 * @return {Promise} Promise 객체
	 */
	success: function(text, title, buttons){
		return this.showIt({
			css: 'success',
			title: title,
			text: text,
			buttons: buttons || {
				ok: '확인'
			},
		});
	},

	/**
	 * 확인 창을 표시합니다.
	 * <p>* 예(ok), 아니오(cancel) 버튼이 있습니다.
	 * @memberof AbMsgBox
	 * @param {String} text 메시지
	 * @param {String} [title] 창 타이틀
	 * @param {String} [css] 창 CSS 스타일명
	 * @return {Promise} Promise 객체
	 */
	confirm: function(text, title, css){
		return this.showIt({
			css: css,
			title: title,
			text: text,
			buttons: {
				ok: '   예   ',
				cancel: '아니오'
			},
		});
	},

	//-----------------------------------------------------------

	/**
	 * 메시지 창을 표시합니다.
	 * @memberof AbMsgBox
	 * @param {String} text HTML 메시지
	 * @param {String} [title] 창 타이틀 HTML
	 * @param {AbMsgBox.ButtonMap} [buttons={ok:'확인'}] 버튼 옵션
	 * @return {Promise} Promise 객체
	 */
	showHtml: function(text, title, buttons){
		return this.showIt({
			titleHtml: title,
			textHtml: text,
			buttons: buttons || {
				ok: '확인'
			},
		});
	},

	/**
	 * 정보 메시지 창을 표시합니다.
	 * @memberof AbMsgBox
	 * @param {String} text HTML 메시지
	 * @param {String} [title] 창 타이틀 HTML
	 * @param {AbMsgBox.ButtonMap} [buttons={ok:'확인'}] 버튼 옵션
	 * @return {Promise} Promise 객체
	 */
	infoHtml: function(text, title, buttons){
		return this.showIt({
			css: 'info',
			titleHtml: title,
			textHtml: text,
			buttons: buttons || {
				ok: '확인'
			},
		});
	},

	/**
	 * 오류 메시지 창을 표시합니다.
	 * @memberof AbMsgBox
	 * @param {String} text HTML 메시지
	 * @param {String} [title] 창 타이틀 HTML
	 * @param {AbMsgBox.ButtonMap} [buttons={ok:'확인'}] 버튼 옵션
	 * @return {Promise} Promise 객체
	 */
	errorHtml: function(text, title, buttons){
		return this.showIt({
			css: 'error',
			titleHtml: title,
			textHtml: text,
			buttons: buttons || {
				ok: '확인'
			},
		});
	},

	/**
	 * 경고 메시지 창을 표시합니다.
	 * @memberof AbMsgBox
	 * @param {String} text HTML 메시지
	 * @param {String} [title] 창 타이틀 HTML
	 * @param {AbMsgBox.ButtonMap} [buttons={ok:'확인'}] 버튼 옵션
	 * @return {Promise} Promise 객체
	 */
	warningHtml: function(text, title, buttons){
		return this.showIt({
			css: 'warn',
			titleHtml: title,
			textHtml: text,
			buttons: buttons || {
				ok: '확인'
			},
		});
	},

	/**
	 * 성공 메시지 창을 표시합니다.
	 * @memberof AbMsgBox
	 * @param {String} text HTML 메시지
	 * @param {String} [title] 창 타이틀 HTML
	 * @param {AbMsgBox.ButtonMap} [buttons={ok:'확인'}] 버튼 옵션
	 * @return {Promise} Promise 객체
	 */
	successHtml: function(text, title, buttons){
		return this.showIt({
			css: 'success',
			titleHtml: title,
			textHtml: text,
			buttons: buttons || {
				ok: '확인'
			},
		});
	},

	/**
	 * 확인 창을 표시합니다.
	 * <p>* 예(ok), 아니오(cancel) 버튼이 있습니다.
	 * @memberof AbMsgBox
	 * @param {String} text HTML 메시지
	 * @param {String} [title] 창 타이틀 HTML
	 * @param {String} [css] 창 CSS 스타일명
	 * @return {Promise} Promise 객체
	 */
	confirmHtml: function(text, title, css){
		return this.showIt({
			css: css,
			titleHtml: title,
			textHtml: text,
			buttons: {
				ok: '   예   ',
				cancel: '아니오'
			},
		});
	},

	//-----------------------------------------------------------

	/**
	 * 메시지 창을 표시합니다.
	 * @memberof AbMsgBox
	 * @param {Object} [options] 수행 옵션
	 * @param {String} [options.css] 창 CSS 스타일명
	 * @param {String} [options.title] 창 타이틀
	 * @param {String} [options.text] 메시지
	 * @param {AbMsgBox.ButtonMap} [options.buttons] 버튼 옵션
	 * @param {String} [options.titleHtml] 창 타이틀 HTML
	 * @param {String} [options.textHtml] 메시지 HTML
	 * @return {Promise} Promise 객체
	 */
	showIt: function (options){
		if (!options) options = {};

		return new Promise(function (resolve, reject){
			var e = $('<div class="modal modal-ready error"/>');
			$(document.body).append(e);
	
			var ebody = $('<div class="body"/>');
	
			var eclose = $('<span class="close" mb-topic="cancel">&times;</span>');
			ebody.append(eclose);
	
			//-----------------------------------------------------------
	
			var clickHandler = function(event){
				var owner = arguments.callee.owner;
				var e = $(this);
	
				owner.find('[mb-topic]').unbind('click', clickHandler);
	
				var result = e.attr('mb-topic');
	
				owner.removeClass('modal-show');
	
				var func = function(){
					var owner = arguments.callee.owner;
					owner.remove();
				};
				func.owner = owner;
	
				setTimeout(func, 300);
	
				resolve(result);
			};
			clickHandler.owner = e;
	
			//-----------------------------------------------------------
	
			if (options.css)
				ebody.addClass(options.css);
	
			if (options.title || options.titleHtml){
				var ce = $('<header/>');
				var eheader = $('<h2/>');
				ce.append(eheader);
	
				if (options.titleHtml) eheader.html(options.titleHtml);
				else eheader.text(options.title);
	
				ebody.append(ce);
			}
	
			var etext = $('<div/>');
			if (options.text || options.textHtml){
				if (options.textHtml) etext.html(options.textHtml);
				else etext.text(options.text);
			}
			ebody.append(etext);
	
			eclose.bind('click', clickHandler);
			
			if (options.buttons){
				var efooter = $('<footer/>');
	
				var btns = options.buttons, cnt = 0;
				for (var p in btns){
					var einp = $('<input type="button"/>');
					einp.attr('mb-topic', p);
					einp.val(btns[p]);
	
					einp.bind('click', clickHandler);
	
					efooter.append(einp);
	
					cnt++;
				}
	
				if (cnt > 0)
					ebody.append(efooter);
			}
	
			e.append(ebody);
		
			setTimeout(function (){
				e.addClass('modal-show');
			}, 100);
		});
	},

	/**
	 * 엘리먼트 레이어를 표시합니다.
	 * <p>* mb-topic 속성이 엘리먼트를 클릭 시 창이 닫힙니다. 클릭된 엘리먼트의 mb-topic 속석의 값은 Promise.resolve()의 인자로 전달됩니다.
	 * @memberof AbMsgBox
	 * @param {Object} [options] 수행옵션
	 * @param {String} [options.selector=#img-info] 엘리먼트 선택자
	 * @param {String} [options.css] 창 CSS 스타일명
	 * @param {String} [options.title] 창 타이틀
	 * @param {String} [options.text] 메시지
	 * @param {AbMsgBox.ButtonMap} [options.buttons] 버튼 옵션
	 * @param {String} [options.titleHtml] 창 타이틀 HTML
	 * @param {String} [options.textHtml] 메시지 HTML
	 * @return {Promise} Promise 객체
	 */
	open: function(options){
		if (!options) options = {};
		if (!options.selector) options.selector = '#img-info';

		return new Promise(function (resolve, reject){
			e = $(options.selector);
		
			var eheader = e.find('.body>header');
			var etext = e.find('.body>div');
			var efooter = e.find('.body>footer');
			var eclose = e.find('.body .close');
	
			e.addClass('modal-ready');
	
			if (options.title || options.titleHtml){
				var ce = eheader.children('h2');
				if (!ce.length){
					ce = $('<h2/>');
					eheader.append(ce);
				}
				eheader.show();
				if (options.titleHtml) ce.html(options.titleHtml);
				else ce.text(options.title);
			}else{
				eheader.hide();
			}
	
			if (options.text || options.textHtml){
				if (options.textHtml) etext.html(options.textHtml);
				else etext.text(options.text);
			}else{
				etext.text('');
			}
		
			//-----------------------------------------------------------
	
			var clickHandler = function(event){
				var owner = arguments.callee.owner;
				var e = $(this);
	
				owner.find('[mb-topic]').unbind('click', clickHandler);
	
				var result = e.attr('mb-topic');
	
				owner.removeClass('modal-show');
	
				var func = function(){
					var owner = arguments.callee.owner;
					owner.removeClass('modal-ready');
				};
				func.owner = owner;
	
				setTimeout(func, 300);
	
				resolve(result);
			};
			clickHandler.owner = e;
	
			//-----------------------------------------------------------
	
			e.find('[mb-topic]').bind('click', clickHandler);
		
			setTimeout(function (){
				e.addClass('modal-show');
			}, 100);				
		});
	},
};