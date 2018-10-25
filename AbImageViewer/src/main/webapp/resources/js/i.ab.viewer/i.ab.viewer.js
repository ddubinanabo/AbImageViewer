/**
 * 이미지 뷰어 등록 이벤트 리스너
 * @callback iAbViewer.RegistListener
 * @param {String} name 구분명
 * @param {AbImageViewer} viewer 이미지 뷰어 인스턴스
 */

/**
 * 작업 성공 시 호출되는 콜백
 * @callback iAbViewer.Resolve
 */

/**
 * 오류 시 호출되는 콜백
 * @callback iAbViewer.Reject
 * @param {Error} e Error 객체
 */

/**
 * 이미지 뷰어 인터페이스
 * @group 인터페이스
 * @namespace iAbViewer
 */
var iAbViewer = {

	/**
	 * 서버 API 주소 정보
	 * @const
	 * @type {Object}
	 * @property {String} FOLDER=api/ext/folder 서버 폴더 내 이미지 조회 API 주소
	 * @property {String} FILE=api/ext/file 특정 경로의 이미지 조회 API 주소
	 * @memberof iAbViewer#
	 */
	URLS: {
		FOLDER: 'api/ext/folder',
		FILE: 'api/ext/file',
	},

	//-----------------------------------------------------------

	/**
	 * 이미지 뷰어 맵
	 * @type {Object}
	 * @static
	 * @memberof iAbViewer
	 */
	viewers: {},

	/**
	 * 이미지 뷰어 등록 이벤트 리스너 목록
	 * @type {Array}
	 * @static
	 * @memberof iAbViewer
	 */
	registListeners: [],

	//-----------------------------------------------------------
	
	/**
	 * 이미지 뷰어 인스턴스를 등록합니다.
	 * <p>이미지 뷰어 인스턴스 등록 이벤트가 발생합니다.
	 * @static
	 * @memberof iAbViewer
	 * @param {AbImageViewer} viewer 이미지 뷰어 인스턴스
	 * @param {String} [options] name 구분명 (기본값은: main)
	 */
	regist: function (viewer, name){
		if (!name) name = 'main';
		this.viewers[name] = viewer;
		
		this.registed(name, viewer);
	},
	
	/**
	 * 이미지 뷰어 인스턴스를 삭제합니다.
	 * @static
	 * @memberof iAbViewer
	 * @param {String} [options] name 구분명 (기본값은: main)
	 */
	release: function (name){
		if (!name) name = 'main';
		delete this.viewers[name];
	},
	
	/**
	 * 이미지 뷰어 인스턴스를 조회합니다.
	 * @static
	 * @memberof iAbViewer
	 * @param {String} [options] name 구분명 (기본값은: main)
	 */
	get: function(name){
		if (!name) name = 'main';
		return this.viewers[name];
	},

	//-----------------------------------------------------------
	
	/**
	 * 이미지 뷰어 인스턴스 등록 이벤트 리스너를 등록합니다.
	 * @static
	 * @memberof iAbViewer
	 * @param {iAbViewer.RegistListener} listener 리스너
	 */
	attachRegistListener: function(listener){
		if (typeof listener !== 'function')
			throw new Error('listener is not function');
		
		this.registListeners.push(listener);
	},

	/**
	 * 이미지 뷰어 인스턴스 등록 이벤트 리스너를 제거합니다.
	 * @static
	 * @memberof iAbViewer
	 * @param {iAbViewer.RegistListener} listener 리스너
	 */
	detachRegistListener: function(listener){
		if (typeof listener !== 'function')
			throw new Error('listener is not function');
		
		for (var i=this.registListeners.length - 1; i > 0; i--){
			if (this.registListeners[i] == listener){
				this.registListeners.splice(i, 1);
			}
		}
	},
	
	/**
	 * 이미지 뷰어 인스턴스 등록 이벤트를 발생 시킵니다.
	 * @static
	 * @memberof iAbViewer
	 * @param {String} name 구분명
	 * @param {AbImageViewer} viewer 이미지 뷰어 인스턴스
	 */
	registed: function (name, viewer){
		if (this.registListeners.length){
			var len = this.registListeners.length;
			for (var i=0; i < len; i++){
				this.registListeners[i](name, viewer);
			}
		}
	},

	//-----------------------------------------------------------
	//-----------------------------------------------------------
	//-----------------------------------------------------------

	/**
	 * 서버 폴더의 이미지들을 이미지 뷰어로 로드합니다.
	 * <p>이 함수로 변경된 사항은 History에 기록되지 않습니다.
	 * <p>
	 * @static
	 * @memberof iAbViewer
	 * @param {String} directoryPath 서버의 폴더 경로
	 * @param {String} [combinedDisplayText] 이미지 표시명 목록(|로 구분)
	 * @param {Object} [options] 처리 옵션
	 * @param {String} [options.errorMessage=원격 이미지 정보(들)를 조회하는 데 실패했습니다] 오류시 화면에 표시할 오류 메시지
	 * @param {String} [options.name] 이미지 뷰어 인스턴스 구분명
	 * @param {iAbViewer.Resolve} [options.resolve] 성공시 호출되는 콜백
	 * @param {iAbViewer.Reject} [options.reject] 오류시 호출되는 콜백
	 */
	view: function (directoryPath, combinedDisplayText, options){
		if (!options) options = {};
		if (!options.errorMessage) options.errorMessage = '원격 이미지 정보(들)를 조회하는 데 실패했습니다';
		
		var self = this;
		
		return new Promise(function(resolve, reject){
			AbCommon.ajax({
				url: self.URLS.FOLDER,
				data: {
					q: directoryPath,
					t: combinedDisplayText
				},
				
				success: function(r){
					this.get(options.name).addImages(r)
						.then(function(){
							if (AbCommon.isFunction(options.resolve))
								options.resolve();
							
							resolve();
						})
						.catch(function(e){
							if (AbCommon.isFunction(options.reject))
								options.reject(e);
							
							reject(e);
						});
				}.bind(self),
				
				error: function(xhr, textStatus, errorThrown){
					var e = new Error(options.errorMessage);
					
					if (AbCommon.isFunction(options.reject))
						options.reject(e);
					
					reject(e);
				}
			});
		})
			.then(function(){
				// exec
			});
	},
	
	/**
	 * 서버 폴더의 특정 이미지를 이미지 뷰어에 로드된 이미지로 변경합니다.
	 * <p>이 함수로 변경된 사항은 History에 기록되지 않습니다.
	 * @static
	 * @memberof iAbViewer
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
		if (!options) options = {};
		if (!options.errorMessage) options.errorMessage = '원격 이미지 정보(들)를 조회하는 데 실패했습니다';
	
		var self = this;
		
		return new Promise(function(resolve, reject){
			AbCommon.ajax({
				url: self.URLS.FILE,
				data: {
					q: imagePath,
					a: annotationPath,
				},
				
				success: function(r){
					/**
					 * r
					 * @type {Server.imageData}
					 */
					if (r){
						this.get(options.name).changeImage(index, r, options)
							.then(function(){
								if (AbCommon.isFunction(options.resolve))
									options.resolve();
								
								resolve();
							})
							.catch(function(e){
								reject(e);
							});
					}else{
						if (AbCommon.isFunction(options.resolve))
							options.resolve();
						
						resolve();
					}
				}.bind(self),
				
				error: function(xhr, textStatus, errorThrown){
					var e = new Error(options.errorMessage);
					
					if (AbCommon.isFunction(options.reject))
						options.reject(e);
					
					reject(e);
				}
			});
		})
			.then(function(){
				// exec
			});
	},

	/**
	 * 이미지 뷰어 이벤트 리스너를 등록합니다.
	 * @static
	 * @memberof iAbViewer
	 * @param {String} name 이미지 뷰어 구분명
	 * @param {AbImageViewer.EventListener} listener 리스너
	 */
	attachEvent: function(name, listener){
		var viewer = this.get();
		if (viewer)
			viewer.attachEvent(name, listener);
	},
	
	/**
	 * 이미지 뷰어 이벤트 리스너를 제거합니다.
	 * @static
	 * @memberof iAbViewer
	 * @param {String} name 이미지 뷰어 구분명
	 * @param {AbImageViewer.EventListener} listener 리스너
	 */
	detachEvent: function(name, listener){
		var viewer = this.get();
		if (viewer)
			viewer.detachEvent(name, listener);
	},
};