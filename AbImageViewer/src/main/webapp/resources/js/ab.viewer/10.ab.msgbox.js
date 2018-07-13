var AbMsgBox = {
	show: function(text, title, buttons){
		return this.showIt({
			title: title,
			text: text,
			buttons: buttons || {
				ok: '확인'
			},
		});
	},

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

	showHtml: function(text, title, buttons){
		return this.showIt({
			titleHtml: title,
			textHtml: text,
			buttons: buttons || {
				ok: '확인'
			},
		});
	},

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