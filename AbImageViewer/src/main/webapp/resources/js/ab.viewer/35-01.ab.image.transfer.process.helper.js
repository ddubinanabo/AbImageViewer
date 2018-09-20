var AbImageTransferProcessHelper = function(options){
	if (!options) options = {};

	//-----------------------------------------------------------
	// option validation
	
	if (!options.viewer)
		throw new Error('[IMAGE-TRANSFER] AbImageViewer is not set');

	//-----------------------------------------------------------
	
	this.viewer = options.viewer;
	this.images = this.viewer.images;

	//-----------------------------------------------------------

	this.selector = options.selector;
	this.printShapes = AbCommon.isBool(options.printShapes) ? options.printShapes : true;

	//-----------------------------------------------------------
	
	this.parallels = AbCommon.isNumber(options.parallels) ? options.parallels : 6;

	//-----------------------------------------------------------

	this.errorImageExit = options.errorImageExit || false;

	//-----------------------------------------------------------

	this.handlers = {
		// 사용자 정의 처리(이미지 렌더링 후에 호출됨)
		chain: AbCommon.isFunction(options.chain) ? options.chain : function(sendor, current, data){
			return Promise.resolve(true);
		},
		// 전송 작업 전 처리(이미지 렌더링 후에 호출됨)
		prepare: AbCommon.isFunction(options.prepare) ? options.prepare : function(sendor){
			return Promise.resolve(true);
		},
		// 실제 전송 처리(전송 작업 전 처리 후에 호출됨)
		submit: AbCommon.isFunction(options.submit) ? options.submit : function(sendor, current, data){
			return Promise.resolve(true);
		},
		// 전송 완료 후 처리(전송 완료 후에 호출됨)
		completed: AbCommon.isFunction(options.completed) ? options.completed : function(sendor){
			return Promise.resolve(true);
		},
				
		total: AbCommon.isFunction(options.total) ? options.total : function(sendor, data){
			return data.pageInfos.length * data.imgInfos.length;
		},
	};

	//-----------------------------------------------------------
	var urlOptions = options.urls || {};
	
	this.urls = {
		alloc: urlOptions.alloc,
		modify: urlOptions.modify,
		remove: urlOptions.remove,
		completed: urlOptions.completed,
	};

	//-----------------------------------------------------------
	var msgsOptions = options.msgs || {};

	this.msgs = {
		empty: msgsOptions.empty || '전송할 이미지가 없습니다',
		errorImage: msgsOptions.errorImage || '#{IDX}번 이미지는 전송할 수 없습니다',
		readyException: msgsOptions.readyException || '이미지 전송 준비 중 오류가 발생했습니다',
	};

	//-----------------------------------------------------------
	
	this.requestID = options.id; // 수정 ID

	//-----------------------------------------------------------
	
	this.prog = {
		view: null,
		bar: null,
	};

	//-----------------------------------------------------------

	this.work = 'regist'; // 작업 종류, 프로세스 과정 중에 세팅된다.
	this.transferID = null; // 프로세스 과정 중에 세팅된다.
	this.index = 0; // 프로세스 시작 과정에 세팅된다.
	this.length = 0; // 프로세스 시작 과정에 세팅된다.
	this.endCount = 0; // 프로세스 완료 개수
	this.ignoreProcess = false; // 프로세싱 취소, 프로세스 과정 중에 세팅된다.

	//-----------------------------------------------------------

	this.data = null;
};

//-----------------------------------------------------------
//-----------------------------------------------------------
//-----------------------------------------------------------

AbImageTransferProcessHelper.prototype = {
	constructor: AbImageTransferProcessHelper,

	//-----------------------------------------------------------
	
	NEXT_DELAY: 10, // 다음 실행 대기시간

	//-----------------------------------------------------------
	
	dispose: function (){
		this.viewer = null;
		this.images = null;
	},

	//-----------------------------------------------------------
	
	isFormController: function (o){
		return o && o.form && AbCommon.isFunction(o.reset) && AbCommon.isFunction(o.record);
	},

	//-----------------------------------------------------------
	
	loader: function (){
		if (!this.$loader){
			this.$loader = $(this.selector);
		}
		return this.$loader;
	},

	//-----------------------------------------------------------

	show: function (){
		var loader = this.loader();
		loader.show();
	},
	
	hide: function (){
		var loader = this.loader();
		loader.hide();
	},

	//-----------------------------------------------------------

	status: function (status){
		var loader = this.loader();
		loader.attr('pl-topic', status);
		
		var view = loader.find('.pl-' + status);
		var bar = view.find('.bar');
		
		if (bar.length)
			bar.css('width', '0%');
		
		this.prog.view = view;
		this.prog.bar = bar;
	},

	progress: function (cur, max){
		var per = cur / max * 100;
		
		this.prog.bar.css('width', per.toFixed(1) + '%');
	},

	//-----------------------------------------------------------
		
	// 전송할 이미지 정보 수집
	collect: function (pages){
		var viewer = this.viewer;
		var images = this.images;
		var handlers = this.handlers;
		
		var printShapes = this.printShapes === true;

		var src = null, pageLength = pages.length;
		var source = [], pageInfos = [], imgInfos = [], map = {};
		for (var i=0; i < pageLength; i++){
			var page = pages[i];

			if (page.isError()){
				if (this.errorImageExit === true){
					pageInfos.splice(0, pageInfos.length);
					return this.msgs.errorImage.replace(/#{IDX}/g, '' + i);
				}
				continue;
			}

			var type = 0;
			if (!page.editable()){
				type |= 1;
			}
			if (page.angle || viewer.drawableWaterMark() || (page.hasShapes() && printShapes) ){
				type |= 2;
			}

			map[page.uid] = imgInfos.length;
			
			imgInfos.push({
				width: type ? 0 : page.source.width,
				height: type ? 0 : page.source.height,
				url: type ? null : page.source.imgInfo.url
			});

			var dat = { type: type, index: i, page: page };

			if (type)
				pageInfos.push(dat);

			source.push(dat);
		}
		
		this.data = {
			length: pageInfos.length,
			pageInfos: pageInfos,
			imgInfos: imgInfos,
			source: source,
			map: map,
		};
		
		var total = handlers.total(this, this.data);
		
		this.data['total'] = total;
		
		return null;
	},

	//-----------------------------------------------------------
	
	prepare: function (){
		var handlers = this.handlers;
		
		var allocUrl = this.urls.alloc;
		var modifyUrl = this.urls.modify;
		var self = this;
		var msgs = this.msgs;
		
		var promise = null, requestID = this.requestID;
		
		this.transferID = null;
		this.work = 'regist';
		
		if (this.requestID){
			if (modifyUrl){
				this.transferID = this.requestID;
				this.work = 'modify';
				
				promise = new Promise(function(resolve, reject){
					AbCommon.ajax({
						title: '수정 준비 작업',
						url: modifyUrl,
						data: {
							id: requestID,
							pages: self.length
						},
						success: function(r){
							console.log('[SEND-SERVER] update prepare !!!');
							
							resolve(true);
						},
						error: function (e){
							AbMsgBox.error(msgs.readyException);
							
							reject(e);
						},
					});
				});
			}
		}else if (allocUrl){
			promise = new Promise(function(resolve, reject){
				AbCommon.ajax({
					title: '아이디 할당',
					url: allocUrl,
					data: {
						pages: self.length
					},
					success: function(r){
						console.log('[SEND-SERVER] allocated (' + r.key + ') ' + (r.time ? r.time : ''));
						
						self.transferID = r.key;
						
						resolve(true);
					},
					error: function (e){
						AbMsgBox.error(msgs.readyException);
						
						reject(e);
					},
				});
			});
		}
		
		if (!promise){
			promise = Promise.resolve(true);
		}
		
		return promise.then(function(){
			return handlers.prepare(this);
		}.bind(this));
	},

	//-----------------------------------------------------------
	
	render: function (index){
		var viewer = this.viewer;
		var engine = viewer.engine;
		var images = this.images;
		var handlers = this.handlers;
		
		var printShapes = this.printShapes === true;
		var data = this.data;
		
		var pageInfo = data.source[index];
		var current = {
			index: index,
			pageInfo: pageInfo,
			imgInfo: data.imgInfos[data.map[pageInfo.page.uid]],
		};
		
		var promise = null;
		if (AbCommon.flag(pageInfo.type, 1)){
			promise = viewer.loadPage(pageInfo, true);
		}else{
			promise = Promise.resolve();
		}

		return promise
			.then(function(d){
				if (pageInfo.page.isReadyImage()){
					return pageInfo.page.source.image();
				}
			})
			.then(function(d){
				if (AbCommon.flag(pageInfo.type, 2)){
					var decoder = pageInfo.page.decoder();

					var ctx = AbGraphics.canvas.createContext();
					engine.renderImage(ctx, pageInfo.page, printShapes);
					var src = AbGraphics.canvas.toImage(ctx, decoder);

					current.imgInfo.width = pageInfo.page.source.width;
					current.imgInfo.height = pageInfo.page.source.height;
					current.imgInfo.url = src;
				}
			})
			.then(function(d){
				return handlers.chain(this, current, data);
			}.bind(this))
	},

	//-----------------------------------------------------------
	
	submit: function (index){
		var data = this.data;
		
		var pageInfo = data.source[index];
		var current = {
			index: index,
			pageInfo: pageInfo,
			imgInfo: data.imgInfos[data.map[pageInfo.page.uid]],
		};
		
		var handlers = this.handlers;
		return handlers.submit(this, current, data);
	},

	//-----------------------------------------------------------
	// 전송 완료 후 호출
	
	completed: function (){
		var completedUrl = this.urls.completed;
		var transferID = this.transferID;

		var promise = null;
		if (completedUrl){
			promise = new Promise(function(resolve, reject){
				// 기록 중인 이미지 정보 삭제
				AbCommon.ajax({
					url: completedUrl,
					data: {
						id: transferID,
					},
					
					logFail: true,
					nomsg: true,
					
					success: function(){
						resolve(true);
					},
					
					error: function(e){
						reject(e);
					}
				});			
				
			});
		}else{
			promise = Promise.resolve(true);
		}
		
		return promise.then(function (){
			var handlers = this.handlers;
			return handlers.completed(this);
		}.bind(this));	
	},

	//-----------------------------------------------------------
	// 전송 오류 시 호출

	remove: function (){
		var removeUrl = this.urls.remove;
		var transferID = this.transferID;
		
		if (removeUrl && transferID){
			// 기록 중인 이미지 정보 삭제
			AbCommon.ajax({
				url: removeUrl,
				data: {
					id: transferID,
				},
				
				logFail: true,
				nomsg: true,
			});			
		}
	},

	//-----------------------------------------------------------
		
	send: function(pages){
		var viewer = this.viewer;
		var engine = viewer.engine;
		var images = this.images;
		var handlers = this.handlers;
		
		var self = this;
		var parallels = this.parallels;
		
		this.status('ready');
		this.show();
		
		return new Promise(function (resolve, reject){
			
			//-----------------------------------------------------------

			var exec = function(){
				var index = this.index;
				
				if (this.length <= this.index)
					return;
				
				this.index++;
				
				if (this.ignoreProcess)
					return;
				
				this.progress(this.index, this.length);
				
				// 프로세스 시작
				this.render(index)
					.then(function(){
						return this.submit(index);
					}.bind(this))
					.then(function(){
						this.endCount++;
						
						if (this.length <= this.endCount){
							this.completed()
								.then(function (){
									// 프로세스 완료
									resolve(true);
								})
								.catch(function(e){
									reject(e);
								});
						}else if (this.length > this.endCount){
							// 다음 프로세스
							setTimeout(exec, AbImageTransferProcessHelper.prototype.NEXT_DELAY);
						}
					}.bind(this))
					.catch(function(e){
						this.ignoreProcess = true;
						
						reject(e);
					}.bind(this));
			}.bind(self);
			
			//-----------------------------------------------------------
			
			var errmsg = self.collect(pages);
			
			if (errmsg)
				reject(new Error(errmsg));
			
			var length = self.data.source.length;
			if (!length)
				reject(new Error(self.msgs.empty));
			
			//-----------------------------------------------------------
			
			self.length = length;
			self.index = 0;
			self.endCount = 0;
			self.ignoreProcess = false;
			
			//-----------------------------------------------------------
		
			self.prepare()
				.then(function(){
					self.status('proc');
					
					for (var i = 0; i < parallels; i++)
						setTimeout(exec, 0);
				});
			
			//-----------------------------------------------------------
		})
			.then(function(){
				return Promise.resolve(true);
			}.bind(this))
			.catch(function(e){
				this.remove();
				
				throw e;
			}.bind(this));
	},
	
	//-----------------------------------------------------------

	
};