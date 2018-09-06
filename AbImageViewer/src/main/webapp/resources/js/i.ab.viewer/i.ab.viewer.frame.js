var iAbViewerFrame = {
	frames: {},

	//-----------------------------------------------------------
	
	prepare: function(){
		var a = $('iframe[ab-topic]');
		var len = a.length;
		for (var i=0; i < len; i++){
			var f = a[i];
			var ef = $(f);
			var name = ef.attr('ab-topic');
			
			if (!name) name = 'main';
			this.frames[name] = ef;
		}
	},

	//-----------------------------------------------------------

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

	//-----------------------------------------------------------
	
	regist: function (frameSelector, name){
		if (!name) name = 'main';
		
		var frame = $(frameSelector);
		
		if (frame && frame.length)
			this.frames[name] = frame;
	},
	
	release: function (name){
		if (!name) name = 'main';
		delete this.frames[name];
	},
	
	get: function(name){
		if (!name) name = 'main';
		return this.frames[name];
	},
	
	getContentWindow: function(name){
		if (!name) name = 'main';
		var e = this.frames[name];
		if (e)
			return e.length ? e.get(0).contentWindow : null;
		return null;
	},

	//-----------------------------------------------------------
	
	send: function(name, message){
		var w = this.getContentWindow(name);
		if (w)
			w.postMessage(message, '*');
	},
	
	sendReturn: function(message, source){
		var w = source ? source : window.parent;
		if (w)
			w.postMessage(message, '*');
	},
	
	receiveCommands: function (){
		// [Object] event = {
		//		  data: [String], // 전송된 메세지,
		//		  origin: [String], // 메세지를 보낸 도메인(e.g: https://livere.com)
		//		  source: [Object] // 메세지를 보낸 타겟(window 객체)
		//		};		
		$(window).on('message', this, function(event){
			setTimeout(function(){
				var source = event.originalEvent.source;
				var data = event.originalEvent.data;
				var key = data.key;
				
				if (data.type === 'call'){
					switch(data.command){
					case 'view':
						iAbViewer.view(data.args.directoryPath, data.args.combinedDisplayText, data.args.options)
							.then(function(){
								this.sendReturn({
									key: key,
									type: 'return',
									command: 'view',
									success: true,
								}, source);
							}.bind(this))
							.catch(function(e){
								this.sendReturn({
									key: key,
									command: 'view',
									success: false,
									message: e ? e.message : '',
								}, source);
							}.bind(this));
						break;
						
					case 'viewMain':
						iAbViewer.viewMain(data.args.index, data.args.imagePath, data.args.annotationPath, data.args.options)
							.then(function(){
								this.sendReturn({
									key: key,
									type: 'return',
									returnCommand: 'viewMain',
									success: true,
								}, source);
							}.bind(this))
							.catch(function(e){
								this.sendReturn({
									key: key,
									type: 'return',
									command: 'viewMain',
									success: false,
									message: e ? e.message : '',
								}, source);
							}.bind(this));
						break;
					}
				}else if (data.type === 'event'){
					this.trigger(data.name, data.data);
				}
			}.bind(event.data), 0);
		});
		
		// 이미지 뷰어의 모든 이벤트 걸기
		iAbViewer.attachRegistListener(function(name, viewer){
			iAbViewer.attachEvent('*', function(name, data){
				this.sendReturn({
					type: 'event',
					name: name,
					data: data
				});
			}.bind(this));
		}.bind(this));
	},

	//-----------------------------------------------------------
	//-----------------------------------------------------------
	//-----------------------------------------------------------
	// Send Command
	//-----------------------------------------------------------
	
	exec: function(args, name){
		var execKey = this.uuid();
		var self = this;
		
		return new Promise(function (resolve, reject){
			var listener = function(event){
				var source = event.originalEvent.source;
				var data = event.originalEvent.data;
				var key = data.key;
				
				if (data.type === 'return' && key == execKey){
					$(window).unbind('message', listener);
					
					if (data.success){
						resolve(data.result);
					}else{
						reject(new Error(data.message));
					}
				}
			};
			
			$(window).bind('message', listener);
			
			args['key'] = execKey;
			
			self.send(name, args);
		});
	},

	//-----------------------------------------------------------
	
	// 이 함수로 변경된 사항은 History에 기록되지 않습니다.
	view: function (directoryPath, combinedDisplayText){
		return this.exec({
			type: 'call',
			command: 'view',
			args: {
				directoryPath: directoryPath,
				combinedDisplayText: combinedDisplayText,
			},
		});
	},
	
	// 이 함수로 변경된 사항은 History에 기록되지 않습니다.
	// ------------------------------------------------------------
	// options
	//		.removePrevShapes: (boolean) 이전 도형들을 삭제할 지 여부
	viewMain: function (index, imagePath, annotationPath, options){
		return this.exec({
			type: 'call',
			command: 'viewMain',
			args: {
				index: index,
				imagePath: imagePath,
				annotationPath: annotationPath,
				options: options,
			},
		});
	},
	
	listeners: {},
	
	// name
	//   - select
	
	attachEvent: function(name, listener){
		if (typeof listener !== 'function')
			throw new Error('listener is not function');
		
		if (this.listeners[name])
			this.listeners[name].push(listener);
		else
			this.listeners[name] = [listener];
	},
	
	detachEvent: function(name, listener){
		if (typeof listener !== 'function')
			throw new Error('listener is not function');
		
		if (this.listeners[name]){
			var a = this.listeners[name];
			for (var i=a.length - 1; i >= 0; i--){
				if (a[i] == listener){
					a.splice(i, 1);
				}
			}
		}
	},
	
	trigger: function (name, data){
		var a = [];
		
		if (this.listeners['*'])
			Array.prototype.push.apply(a, this.listeners['*']);
		
		if (this.listeners[name])
			Array.prototype.push.apply(a, this.listeners[name]);
		
		if (a.length){
			var len = a.length;
			for (var i=0; i < len; i++){
				var listener = a[i];
				
				listener(name, data);
			}
		}
	},	
};

//-----------------------------------------------------------
//-----------------------------------------------------------
//-----------------------------------------------------------

$(function(){
	iAbViewerFrame.prepare();
	iAbViewerFrame.receiveCommands();
});