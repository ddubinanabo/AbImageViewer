/**
 * 이미지 뷰어 인터페이스 (iframe용)
 * @group 인터페이스
 * @namespace iAbViewerFrame
 */
var iAbViewerFrame = {

	/**
	 * 조회된 iframe 맵
	 * @private
	 * @static
	 * @memberof iAbViewerFrame
	 * @type {Object}
	 */
	frames: {},

	//-----------------------------------------------------------
	
	/**
	 * 조횐된 iframe 목록 초기화
	 * @static
	 * @memberof iAbViewerFrame
	 */
	reset: function (){
		for (var p in this.frames){
			if (this.frames.hasOwnProperty(p))
				delete this.frames[p];
		}
	},

	//-----------------------------------------------------------
	
	/**
	 * iframe 조회
	 * <p>ab-topic 속성이 있는 iframe만 조회
	 * @static
	 * @memberof iAbViewerFrame
	 */
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

	/**
	 * UUID 생성
	 * <p>A Universally Unique IDentifier (UUID)
	 * @static
	 * @memberof iAbViewerFrame
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

	//-----------------------------------------------------------
	
	/**
	 * iframe 관리 등록
	 * @static
	 * @memberof iAbViewerFrame
	 * @param {String} frameSelector
	 * @param {String} name 토픽명(ab-topic 속성)
	 */
	regist: function (frameSelector, name){
		if (!name) name = 'main';
		
		var frame = $(frameSelector);
		
		if (frame && frame.length)
			this.frames[name] = frame;
	},
	
	/**
	 * iframe 관리 제거
	 * @static
	 * @memberof iAbViewerFrame
	 * @param {String} name 토픽명(ab-topic 속성)
	 */
	release: function (name){
		if (!name) name = 'main';
		delete this.frames[name];
	},
	
	/**
	 * 관리되는 iframe 조회
	 * @static
	 * @memberof iAbViewerFrame
	 * @param {String} name 토픽명(ab-topic 속성)
	 * @return {jQueryObject} iframe jQuery Object
	 */
	get: function(name){
		if (!name) name = 'main';
		return this.frames[name];
	},
	
	/**
	 * iframe의 window 객체
	 * @static
	 * @memberof iAbViewerFrame
	 * @param {String} name 토픽명(ab-topic 속성)
	 * @return {window} Window 객체
	 */
	getContentWindow: function(name){
		if (!name) name = 'main';
		var e = this.frames[name];
		if (e)
			return e.length ? e.get(0).contentWindow : null;
		return null;
	},

	//-----------------------------------------------------------
	
	/**
	 * 명령을 iframe에 전송
	 * @static
	 * @memberof iAbViewerFrame
	 * @param {String} name 토픽명(ab-topic 속성)
	 * @param {String} message 
	 */
	send: function(name, message){
		var w = this.getContentWindow(name);
		if (w)
			w.postMessage(message, '*');
	},
	
	/**
	 * 리턴값을 부모에 전송
	 * @static
	 * @memberof iAbViewerFrame
	 * @param {String} message 
	 * @param {String} source 
	 */
	sendReturn: function(message, source){
		var w = source ? source : window.parent;
		if (w)
			w.postMessage(message, '*');
	},
	
	/**
	 * iframe 내부(이미지 뷰어)에서 전달된 명령 처리
	 * @static
	 * @memberof iAbViewerFrame
	 */
	receiveCommands: function (){
		/**
		 * 메시지 처리
		 * [Object] event = {
		 * 		data: [String], // 전송된 메세지,
		 * 		origin: [String], // 메세지를 보낸 도메인(e.g: https://livere.com)
		 * 		source: [Object] // 메세지를 보낸 타겟(window 객체)
		 * };
		 */
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

					case 'viewFile':
						iAbViewer.viewFile(data.args.filePath, data.args.combinedDisplayText, data.args.combinedSubDisplayText, data.args.options)
							.then(function(){
								this.sendReturn({
									key: key,
									type: 'return',
									command: 'viewFile',
									success: true,
								}, source);
							}.bind(this))
							.catch(function(e){
								this.sendReturn({
									key: key,
									command: 'viewFile',
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
	
	/**
	 * 명령을 전달하고 리턴 값 받기
	 * @private
	 * @static
	 * @memberof iAbViewerFrame
	 * @param {Array} args 
	 * @param {String} name 
	 */
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
	
	/**
	 * 서버 폴더의 이미지들을 이미지 뷰어로 로드합니다.
	 * <p>이 함수로 변경된 사항은 History에 기록되지 않습니다.
	 * @static
	 * @memberof iAbViewerFrame
	 * @param {String} directoryPath 서버의 폴더 경로
	 * @param {String} [combinedDisplayText] 이미지 표시명 목록(|로 구분)
	 */
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

	/**
	 * 서버 폴더의 특정 이미지를 이미지 뷰어에 로드된 이미지로 변경합니다.
	 * <p>이 함수로 변경된 사항은 History에 기록되지 않습니다.
	 * @static
	 * @memberof iAbViewerFrame
	 * @param {Number} index 이미지 뷰어의 이미지 인덱스
	 * @param {String} imagePath 서버의 이미지 경로
	 * @param {String} [annotationPath] 서버의 이미지 주석/마스킹 경로
	 * @param {Object} [options] 처리 옵션
	 * @param {String} [options.errorMessage=원격 이미지 정보(들)를 조회하는 데 실패했습니다] 오류시 화면에 표시할 오류 메시지
	 * @param {String} [options.name] 이미지 뷰어 인스턴스 구분명
	 * @param {iAbViewer.Resolve} [options.resolve] 성공시 호출되는 콜백
	 * @param {iAbViewer.Reject} [options.reject] 오류시 호출되는 콜백
	 */
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

	/**
	 * 서버 파일을 이미지 뷰어로 로드합니다.
	 * <p>이 함수로 변경된 사항은 History에 기록되지 않습니다.
	 * <p>
	 * @static
	 * @memberof iAbViewer
	 * @param {String} filePath 서버의 파일 경로
	 * @param {String} [combinedDisplayText] 이미지 표시명 목록(|로 구분)
	 * @param {String} [combinedSubDisplayText] 하단 이미지 표시명 목록(|로 구분)
	 * @param {Object} [options] 처리 옵션
	 * @param {String} [options.errorMessage=원격 이미지 정보(들)를 조회하는 데 실패했습니다] 오류시 화면에 표시할 오류 메시지
	 * @param {String} [options.name] 이미지 뷰어 인스턴스 구분명
	 * @param {iAbViewer.Resolve} [options.resolve] 성공시 호출되는 콜백
	 * @param {iAbViewer.Reject} [options.reject] 오류시 호출되는 콜백
	 */
	viewFile: function (filePath, combinedDisplayText, combinedSubDisplayText, options){
		return this.exec({
			type: 'call',
			command: 'viewFile',
			args: {
				filePath: filePath,
				combinedDisplayText: combinedDisplayText,
				combinedSubDisplayText: combinedSubDisplayText,
			},
		});
	},

	/**
	 * 리스너 맵
	 * @static
	 * @memberof iAbViewerFrame
	 * @private
	 */
	listeners: {},
	
	// name
	//   - select
	
	/**
	 * 이미지 뷰어 이벤트 리스너를 추가합니다.
	 * @static
	 * @memberof iAbViewerFrame
	 * @param {String} name 이벤트명("*"를 사용 시 모든 이벤트를 뜻함), click|select|renderlist
	 * @param {AbImageViewer.EventListener} listener 리스너
	 */
	attachEvent: function(name, listener){
		if (typeof listener !== 'function')
			throw new Error('listener is not function');
		
		if (this.listeners[name])
			this.listeners[name].push(listener);
		else
			this.listeners[name] = [listener];
	},
	
	/**
	 * 이미지 뷰어 이벤트 리스너를 제거합니다.
	 * @static
	 * @memberof iAbViewerFrame
	 * @param {String} name 이벤트명("*"를 사용 시 모든 이벤트를 뜻함), click|select|renderlist
	 * @param {AbImageViewer.EventListener} listener 리스너
	 */
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
	
	/**
	 * 이미지 뷰어 이벤트를 발생시킵니다.
	 * @static
	 * @memberof iAbViewerFrame
	 * @param {String} name 이벤트명
	 * @param {AbImageViewer.EventArgs} data 인자
	 */
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

/**
 * 페이지 로드 시 인터페이스 초기화 작업 진행
 */
$(function(){
	// iframe 바깥 세팅
	iAbViewerFrame.prepare();
	// iframe 안 세팅
	iAbViewerFrame.receiveCommands();
});