

/**
 * 사용자 정의 처리 콜백 함수
 * @callback AbImageTransferProcessHelper.ChainCallback
 * @param {AbImageTransferProcessHelper} sendor 대리자 객체
 * @param {AbImageTransferProcessHelper.Current} current 현재 전송 데이터
 * @param {AbImageTransferProcessHelper.CollectResult} data 전송할 이미지 정보 수집 결과
 * @return {Promise} Promise 객체
 */

 /**
 * 전송 작업 전 처리 콜백 함수
 * @callback AbImageTransferProcessHelper.PrepareCallback
 * @param {AbImageTransferProcessHelper} sendor 대리자 객체
 * @return {Promise} Promise 객체
 */

 /**
 * 실제 전송 처리 콜백 함수
 * @callback AbImageTransferProcessHelper.SubmitCallback
 * @param {AbImageTransferProcessHelper} sendor 대리자 객체
 * @param {AbImageTransferProcessHelper.Current} current 현재 전송 데이터
 * @param {AbImageTransferProcessHelper.CollectResult} data 전송할 이미지 정보 수집 결과
 * @return {Promise} Promise 객체
 */

 /**
 * 전송 완료 후 처리 콜백 함수
 * @callback AbImageTransferProcessHelper.CompletedCallback
 * @param {AbImageTransferProcessHelper} sendor 대리자 객체
 * @return {Promise} Promise 객체
 */

 /**
 * 전체 전송 데이터 개수 조회 콜백 함수
 * @callback AbImageTransferProcessHelper.GetTotalCallback
 * @param {AbImageTransferProcessHelper} sendor 대리자 객체
 * @param {AbImageTransferProcessHelper.CollectResult} data 전송할 이미지 정보 수집 결과
 * @return {Number} 전체 전송 데이터 개수
 */

 /**
 * 현재 전송 데이터
 * @callback AbImageTransferProcessHelper.Current
 * @param {Number} index 인덱스
 * @param {AbImageTransferProcessHelper.PageInfo} pageInfo 페이지 정보
 * @param {AbImageTransferProcessHelper.ImageInfo} imgInfo 이미지 정보
 */

 /**
 * 이미지 정보
 * @callback AbImageTransferProcessHelper.ImageInfo
 * @param {Number} width 이미지 폭
 * @param {Number} height 이미지 높이
 * @param {String} url 이미지 URL
 */

 /**
 * 페이지 정보
 * @callback AbImageTransferProcessHelper.PageInfo
 * @param {AbImageTransferProcessHelper.PageRenderType} type 페이지 렌더링 타입 (0|1|2|3)
 * @param {Number} index 수집된 페이지 목록 인덱스
 * @param {AbPage} page {@link AbPage|페이지} 인스턴스
 * @param {AbImageTransferProcessHelper.BookmarkIndexInfo} bookmark 북마크 인덱스 정보
 */

 /**
 * 전송할 이미지 정보 수집 결과
 * @callback AbImageTransferProcessHelper.CollectResult
 * @param {Number} length 페이지 정보 목록 개수
 * @param {Array.<AbImageTransferProcessHelper.PageInfo>} pageInfos 페이지 작업이 필요한 페이지 정보 목록
 * @param {Array.<AbImageTransferProcessHelper.ImageInfo>} imgInfos 이미지 정보 목록
 * @param {Array.<AbImageTransferProcessHelper.PageInfo>} source 페이지 정보 목록
 * @param {Object.<String, Number>} map {@link AbPage|페이지} UUID 별 이미지 정보 인덱스
 * <P>* 필드명이 {@link AbPage|페이지} UUID, 필드값이 이미지 정보 인덱스인 객체입니다.
 * @param {Object} total 전체 전송 데이터 개수 (handlers.total 조회 결과)
 */

/**
 * 페이지 렌더링 타입 (0|1|2|3)
 * <dl>
 * 	<dt>0</dt><dd>로드 완료되었습니다. 별도의 처리가 필요치 않습니다.</dd>
 * 	<dt>1</dt><dd>이미지 로드가 필요합니다.</dd>
 * 	<dt>2</dt><dd>이미지 렌더링이 필요합니다.</dd>
 * 	<dt>3</dt><dd>이미지 로드 후 렌더링이 필요합니다.</dd>
 * </dl>
 * @typedef {Number} AbImageTransferProcessHelper.PageRenderType
 */

 /**
 * 북마크 인덱스 정보
 * @callback AbImageTransferProcessHelper.BookmarkIndexInfo
 * @param {Number} index {@link AbImageViewer#bookmarks|AbImageViewer.bookmarks}의 인덱스
 * @param {Number} vindex 수집된 북마크 목록 인덱스
 */

/**
 * 핸들러 정보
 * @typedef {Object} AbImageTransferProcessHelper.Handlers 
 * @property {AbImageTransferProcessHelper.ChainCallback} chain 사용자 정의 처리 핸들러
 * <p>* 이미지 렌더링 후에 호출됩니다.
 * @property {AbImageTransferProcessHelper.PrepareCallback} prepare 전송 작업 전 처리 핸들러
 * <p>* 이미지 렌더링 후에 호출됩니다.
 * @property {AbImageTransferProcessHelper.SubmitCallback} submit 실제 전송 처리 핸들러
 * <p>* 전송 작업 전 처리 후에 호출됩니다.
 * @property {AbImageTransferProcessHelper.CompletedCallback} completed 전송 완료 후 처리 핸들러
 * <p>* 전송 완료 후에 호출됩니다.
 * @property {AbImageTransferProcessHelper.GetTotalCallback} total 전체 전송 데이터 개수 조회 핸들러
 */

/**
 * URL 정보
 * @typedef {Object} AbImageTransferProcessHelper.URLS
 * @property {String} alloc ID 할당 URL
 * <p>신규 이미지 목록을 전송하기 위해 아이디를 서버로 부터 할당받습니다.
 * @property {String} modify 수정 준비 URL
 * <p>* 전송 준비 단계로, 서버에 수정 데이터임을 알립니다.
 * @property {String} remove 삭제 URL
 * <p>* 전송 오류/중단 등으로 전송을 중단할 때 이미 보낸 이미지들을 삭제하라고 서버에 알립니다.
 * @property {String} completed 완료 알림 URL
 */

/**
 * 메시지 정보
 * <p>* errorImage 메시지에 변환 문자열을 사용할 수 있습니다.
 * <dl>변환 문자열 목록
 * 	<dt>#{IDX}</dt><dd>페이지 인덱스</dd>
 * </dl>
 * @typedef {Object} AbImageTransferProcessHelper.Messages
 * @property {String} empty 전송할 이미지가 없을 떄 표시 내용
 * @property {String} errorImage 오류 이미지가 있을 때 표시 내용
 * @property {String} readyException 전송 준비 중 오류가 발생했을 때 표시 내용
 */

/**
 * 진행 관련 HTML 엘리먼트 jQuery 객체 정보
 * @typedef {Object} AbImageTransferProcessHelper.ProgressElements 
 * @property {jQueryObject} view 로더 표시 영역 HTML 엘리먼트 jQuery 객체
 * @property {jQueryObject} bar 전행바 HTML 엘리먼트 jQuery 객체
 */

/**
 * 이미지 서버 전송 대리자
 * @class
 * @param {Object} options 옵션
 * @param {AbImageViewer} options.viewer {@link AbImageViewer|이미지 뷰어} 인스턴스
 * @param {String} [options.selector] 로더 HTML 엘리먼트 선택자
 * @param {String} [options.id] 수정할 이미지 ID<p>* 수정 작업 시에만 설정합니다.
 * @param {Boolean} [options.printShapes=true] 도형 표시 여부
 * @param {Object.<String, Boolean>} options.printShapeTypeMap 도형 구분({@link AbShapeObject#type|type})별 화면 표시 맵
 * <p>* {@link AbViewerEngine#showingShapeTypeMap|AbViewerEngine.showingShapeTypeMap}을 참고하세요
 * @param {Number} [options.parallels=6] 병렬 개수
 * @param {Boolean} [options.errorImageExit=false] 오류 이미지가 있을 시 전송 중단 여부
 * @param {AbImageTransferProcessHelper.ChainCallback} [options.chain] 사용자 정의 처리 핸들러
 * <p>* 이미지 렌더링 후에 호출됩니다.
 * @param {AbImageTransferProcessHelper.PrepareCallback} [options.prepare] 전송 작업 전 처리 핸들러
 * <p>* 이미지 렌더링 후에 호출됩니다.
 * @param {AbImageTransferProcessHelper.SubmitCallback} [options.submit] 실제 전송 처리 핸들러
 * <p>* 전송 작업 전 처리 후에 호출됩니다.
 * @param {AbImageTransferProcessHelper.CompletedCallback} [options.completed] 전송 완료 후 처리 핸들러
 * <p>* 전송 완료 후에 호출됩니다.
 * @param {AbImageTransferProcessHelper.GetTotalCallback} [options.total] 전체 전송 데이터 개수 조회 핸들러
 * @param {Object} options.urls 서버 URL 정보
 * @param {String} options.urls.alloc ID 할당 URL
 * <p>신규 이미지 목록을 전송하기 위해 아이디를 서버로 부터 할당받습니다.
 * @param {String} options.urls.modify 수정 준비 URL
 * <p>* 전송 준비 단계로, 서버에 수정 데이터임을 알립니다.
 * @param {String} options.urls.remove 삭제 URL
 * <p>* 전송 오류/중단 등으로 전송을 중단할 때 이미 보낸 이미지들을 삭제하라고 서버에 알립니다.
 * @param {String} options.urls.completed 완료 알림 URL
 * <p>* 전송 완료를 서버에 알립니다.
 * @param {Object} [options.msgs] 메시지 정보
 * @param {String} [options.msgs.empty] 전송할 이미지가 없을 떄 표시 내용
 * <p>* {@link AbImageTransferProcessHelper.Messages|메시지 정보}을 참고하세요
 * @param {String} [options.msgs.errorImage] 오류 이미지가 있을 때 표시 내용
 * <p>* {@link AbImageTransferProcessHelper.Messages|메시지 정보}을 참고하세요
 * @param {String} [options.msgs.readyException] 전송 준비 중 오류가 발생했을 때 표시 내용
 * <p>* {@link AbImageTransferProcessHelper.Messages|메시지 정보}을 참고하세요
 */
var AbImageTransferProcessHelper = function(options){
	if (!options) options = {};

	//-----------------------------------------------------------
	// option validation
	
	if (!options.viewer)
		throw new Error('[IMAGE-TRANSFER] AbImageViewer is not set');

	//-----------------------------------------------------------
	
	/**
	 * {@link AbImageViewer|이미지 뷰어} 인스턴스
	 * @type {AbImageViewer}
	 */
	this.viewer = options.viewer;
	/**
	 * 페이지 목록
	 * <p>* 이미지 뷰어의 {@link AbImageViewer#images|images 필드}를 참조합니다.
	 * @see {@link AbImageViewer#images} AbImageViewer.images 필드
	 * @type {AbPageCollection}
	 */
	this.images = this.viewer.images;
	/**
	 * 북마크 목록
	 * <p>* 이미지 뷰어의 {@link AbImageViewer#bookmarks|bookmarks 필드}를 참조합니다.
	 * @see {@link AbImageViewer#bookmarks} AbImageViewer.bookmarks 필드
	 * @type {AbPageCollection}
	 */
	this.bookmarks = this.viewer.bookmarks;

	//-----------------------------------------------------------

	/**
	 * 로더 HTML 엘리먼트 선택자
	 * @type {String}
	 */
	this.selector = options.selector;
	/**
	 * 도형 표시 여부
	 * @type {Boolean}
	 * @default true
	 */
	this.printShapes = AbCommon.isBool(options.printShapes) ? options.printShapes : true;
	/**
	 * 도형 구분({@link AbShapeObject#type|type})별 화면 표시 맵
	 * @see {@link AbViewerEngine#showingShapeTypeMap} AbViewerEngine.showingShapeTypeMap 필드
	 * @type {Object.<String, Boolean>}
	 */
	this.printShapeTypeMap = options.printShapeTypeMap;

	//-----------------------------------------------------------
	
	/**
	 * 병렬 개수
	 * @type {Number}
	 * @default 6
	 */
	this.parallels = AbCommon.isNumber(options.parallels) ? options.parallels : 6;

	//-----------------------------------------------------------

	/**
	 * 오류 이미지가 있을 시 전송 중단 여부
	 * @type {Boolean}
	 * @default false
	 */
	this.errorImageExit = options.errorImageExit || false;

	//-----------------------------------------------------------

	/**
	 * 핸들러 정보
	 * @type {AbImageTransferProcessHelper.Handlers }
	 */
	this.handlers = {
		/**
		 * 사용자 정의 처리(이미지 렌더링 후에 호출됨)
		 * @function
		 * @type {AbImageTransferProcessHelper.ChainCallback}
		 */
		chain: AbCommon.isFunction(options.chain) ? options.chain : function(sendor, current, data){
			return Promise.resolve(true);
		},
		/**
		 * 전송 작업 전 처리(이미지 렌더링 후에 호출됨)
		 * @function
		 * @type {AbImageTransferProcessHelper.PrepareCallback}
		 */
		prepare: AbCommon.isFunction(options.prepare) ? options.prepare : function(sendor){
			return Promise.resolve(true);
		},
		/**
		 * 실제 전송 처리(전송 작업 전 처리 후에 호출됨)
		 * @function
		 * @type {AbImageTransferProcessHelper.SubmitCallback}
		 */
		submit: AbCommon.isFunction(options.submit) ? options.submit : function(sendor, current, data){
			return Promise.resolve(true);
		},
		/**
		 * 전송 완료 후 처리(전송 완료 후에 호출됨)
		 * @function
		 * @type {AbImageTransferProcessHelper.CompletedCallback}
		 */
		completed: AbCommon.isFunction(options.completed) ? options.completed : function(sendor){
			return Promise.resolve(true);
		},
		
		/**
		 * 전체 전송 데이터 개수 조회
		 * @function
		 * @type {AbImageTransferProcessHelper.GetTotalCallback}
		 */
		total: AbCommon.isFunction(options.total) ? options.total : function(sendor, data){
			return data.pageInfos.length * data.imgInfos.length;
		},
	};

	//-----------------------------------------------------------
	var urlOptions = options.urls || {};
	
	/**
	 * URL 정보
	 * @type {AbImageTransferProcessHelper.URLS}
	 */
	this.urls = {
		/**
		 * ID 할당 URL
		 * @type {String}
		 */
		alloc: urlOptions.alloc,
		/**
		 * 수정 준비 URL
		 * @type {String}
		 */
		modify: urlOptions.modify,
		/**
		 * 삭제 URL
		 * @type {String}
		 */
		remove: urlOptions.remove,
		/**
		 * 완료 알림 URL
		 * @type {String}
		 */
		completed: urlOptions.completed,
	};

	//-----------------------------------------------------------
	var msgsOptions = options.msgs || {};

	/**
	 * 메시지 정보
	 * @type {AbImageTransferProcessHelper.Messages}
	 */
	this.msgs = {
		/**
		 * 전송할 이미지가 없을 떄 표시 내용
		 * @type {String}
		 */
		empty: msgsOptions.empty || '전송할 이미지가 없습니다',
		/**
		 * 오류 이미지가 있을 때 표시 내용
		 * @type {String}
		 */
		errorImage: msgsOptions.errorImage || '#{IDX}번 이미지는 전송할 수 없습니다',
		/**
		 * 전송 준비 중 오류가 발생했을 때 표시 내용
		 * @type {String}
		 */
		readyException: msgsOptions.readyException || '이미지 전송 준비 중 오류가 발생했습니다',
	};

	//-----------------------------------------------------------
	
	/**
	 * 수정할 이미지 ID
	 * <p>* 수정 작업 시에만 설정합니다.
	 * @type {String}
	 */
	this.requestID = options.id; // 수정 ID

	//-----------------------------------------------------------
	
	/**
	 * 진행 관련 HTML 엘리먼트 jQuery 객체 정보
	 * <p>* status() 호출 후에 세팅됩니다.
	 * @type {AbImageTransferProcessHelper.ProgressElements}
	 */
	this.prog = {
		/**
		 * 로더 표시 영역 HTML 엘리먼트 jQuery 객체
		 * @type {jQueryObject}
		 */
		view: null,
		/**
		 * 전행바 HTML 엘리먼트 jQuery 객체
		 * @type {jQueryObject}
		 */
		bar: null,
	};

	//-----------------------------------------------------------

	/**
	 * 작업 종류
	 * <p>* 작업 진행 중에 설정됩니다.
	 * @private
	 * @type {String}
	 */
	this.work = 'regist'; // 작업 종류, 프로세스 과정 중에 세팅된다.
	/**
	 * 전송 ID
	 * <p>* 서버에서 할당받거나 requestID 필드로 설정됩니다.
	 * <p>* 작업 진행 중에 설정됩니다.
	 * @private
	 * @type {String}
	 */
	this.transferID = null; // 프로세스 과정 중에 세팅된다.
	/**
	 * 현재 전송 중인 페이지 인덱스
	 * <p>* 작업 진행 중에 설정됩니다.
	 * @private
	 * @type {Number}
	 */
	this.index = 0; // 프로세스 시작 과정에 세팅된다.
	/**
	 * 페이지 정보 목록 개수
	 * <p>* 작업 진행 중에 설정됩니다.
	 * @private
	 * @type {Number}
	 */
	this.length = 0; // 프로세스 시작 과정에 세팅된다.
	/**
	 * 진행 완료 개수
	 * <p>* 작업 진행 중에 설정됩니다.
	 * @private
	 * @type {Number}
	 */
	this.endCount = 0; // 프로세스 완료 개수
	/**
	 * 프로세싱 취소 여부
	 * <p>* 작업 진행 중에 설정됩니다.
	 * @private
	 * @type {Boolean}
	 */
	this.ignoreProcess = false; // 프로세싱 취소, 프로세스 과정 중에 세팅된다.

	//-----------------------------------------------------------

	/**
	 * 전송할 이미지 정보 수집 결과
	 * @type {AbImageTransferProcessHelper.CollectResult}
	 */
	this.data = null;
};

//-----------------------------------------------------------
//-----------------------------------------------------------
//-----------------------------------------------------------

AbImageTransferProcessHelper.prototype = {
	constructor: AbImageTransferProcessHelper,

	//-----------------------------------------------------------
	
	/**
	 * 다음 전송 대기 시간
	 * @static
	 * @const
	 * @type {Number}
	 * @default
	 */
	NEXT_DELAY: 10, // 다음 실행 대기시간

	//-----------------------------------------------------------
	
	/**
	 * 객체를 dispose 합니다.
	 */
	dispose: function (){
		this.viewer = null;
		this.images = null;
	},

	//-----------------------------------------------------------
	
	/**
	 * 객체가 양식 컨트롤러인지 확인합니다.
	 * @param {Object} o 객체
	 */
	isFormController: function (o){
		return o && o.form && AbCommon.isFunction(o.reset) && AbCommon.isFunction(o.record);
	},

	//-----------------------------------------------------------
	
	/**
	 * 로더 HTML 엘리먼트 jQuery 객체를 가져옵니다.
	 * @private
	 * @return {jQueryObject}
	 */
	loader: function (){
		if (!this.$loader){
			this.$loader = $(this.selector);
		}
		return this.$loader;
	},

	//-----------------------------------------------------------

	/**
	 * 로더를 화면에 표시합니다.
	 * @private
	 */
	show: function (){
		var loader = this.loader();
		loader.show();
	},
	
	/**
	 * 로더를 숨깁니다.
	 * @private
	 */
	hide: function (){
		var loader = this.loader();
		loader.hide();
	},

	//-----------------------------------------------------------

	/**
	 * 상태에 따른 로더 표시 영역 HTML 엘리먼트 jQuery 객체를 설정합니다.
	 * <p>* prog 필드를 설정합니다.
	 * @private
	 * @param {String} status (ready|proc|build)
	 */
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

	/**
	 * 진행 사항을 표시합니다.
	 * @private
	 * @param {Number} cur 현재 진행
	 * @param {Number} max 전체
	 */
	progress: function (cur, max){
		var per = cur / max * 100;
		
		this.prog.bar.css('width', per.toFixed(1) + '%');
	},

	//-----------------------------------------------------------
		
	// 전송할 이미지 정보 수집
	/**
	 * 전송할 이미지 정보를 수집합니다.
	 * <p>* data 필드를 설정합니다.
	 * @private
	 * @param {Array.<AbPage>} pages {@link AbPage|페이지} 목록
	 * @return {String} 정상적으로 수집했으면 null을 오류가 있으면 문자열이 리턴됩니다.
	 */
	collect: function (pages){
		var viewer = this.viewer;
		var images = this.images;
		var bookmarks = this.bookmarks;
		var handlers = this.handlers;
		
		var printShapes = this.printShapes === true;

		var src = null, pageLength = pages.length;
		var source = [], pageInfos = [], imgInfos = [], map = {};
		var bookmark = null, bookmarkIdx = -1;
		
		var collectedBookmarks = []; // 수집된 북마크 목록
		
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
			
			bookmarkIdx = bookmarks.indexOf(page.uid);
			bookmark = null;
			
			if (bookmarkIdx >= 0){
				bookmark = {
					index: bookmarkIdx,		// viewer.bookmarks 컬렉션의 인덱스
					vindex: bookmarkIdx,	// 수집된 북마크 목록에서의 인덱스
				};
				
				collectedBookmarks.push({
					bookmark: bookmark,
					page: page
				});
			}

			map[page.uid] = imgInfos.length;
			
			imgInfos.push({
				width: type ? 0 : page.source.width,
				height: type ? 0 : page.source.height,
				url: type ? null : page.source.imgInfo.url
			});

			var dat = { type: type, index: i, page: page, bookmark: bookmark };

			if (type)
				pageInfos.push(dat);

			source.push(dat);
		}
		
		// 북마크 수집된 목록 내 인덱스 재부여 처리
		collectedBookmarks.sort(function(a, b){
			return a.bookmark.index - b.bookmark.index;
		});
		
		var bmLen = collectedBookmarks.length;
		for (var i=0; i < bmLen; i++){
			var bm = collectedBookmarks[i];
			bm.bookmark.vindex = i;
		}
		
		// 결과 저장
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
	
	/**
	 * 전송 준비 작업을 진행합니다.
	 * @private
	 * @return {Promise} Promise 객체
	 */
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
							//console.log('[SEND-SERVER] update prepare !!!');
							
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
						//console.log('[SEND-SERVER] allocated (' + r.key + ') ' + (r.time ? r.time : ''));
						
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
	
	/**
	 * 이미지를 로드하거나 렌더링합니다.
	 * @private
	 * @param {Number} index 수집된 페이지 목록 인덱스
	 * @return {Promise} Promise 객체
	 */
	render: function (index){
		var viewer = this.viewer;
		var engine = viewer.engine;
		var images = this.images;
		var handlers = this.handlers;
		
		var printShapes = this.printShapes === true;
		var printShapeTypeMap = this.printShapeTypeMap;
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

		// collect()는 로드된 이미지들 내에서만 체크한다.
		// 로드되지 않은 이미지들의 오류 여부는 렌더링 후에나 알 수 있다.
		return promise
			.then(function(d){
				if (!pageInfo.page.isError() && pageInfo.page.isReadyImage()){
					return pageInfo.page.source.image();
				}
			})
			.then(function(d){
				if (!pageInfo.page.isError() && AbCommon.flag(pageInfo.type, 2)){
					var decoder = pageInfo.page.decoder();

					var ctx = AbGraphics.canvas.createContext();
					engine.renderImage(ctx, pageInfo.page, printShapes, printShapeTypeMap);
					var src = AbGraphics.canvas.toImage(ctx, decoder);
					
					try
					{
						current.imgInfo.width = pageInfo.page.source.width;
						current.imgInfo.height = pageInfo.page.source.height;
						current.imgInfo.url = src;
					}
					catch (e)
					{
						console.log(e);
						throw e;
					}
				}
			})
			.then(function(d){
				return handlers.chain(this, current, data);
			}.bind(this))
	},

	//-----------------------------------------------------------
	
	/**
	 * 인덱스의 페이지가 오류가 있는 지 확인합니다.
	 * @param {Number} index 인덱스
	 * @return {Boolean}
	 */
	isError: function (index){
		var data = this.data;
		var pageInfo = data.source[index];
		return pageInfo.page.isError();
	},

	//-----------------------------------------------------------

	/**
	 * submit 핸들러를 호출합니다.
	 * @private
	 * @param {Number} index 인덱스
	 * @return {Promise} Promise 객체
	 */
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
	
	/**
	 * 전송 완료를 진행합니다.
	 * @private
	 * @return {Promise} Promise 객체
	 */
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

	/**
	 * 전송 오류를 처리합니다.
	 * @private
	 */
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
		
	/**
	 * 전송을 진행합니다.
	 * @param {Array.<AbPage>} pages {@link AbPage|페이지} 목록
	 * @return {Promise} Promise 객체
	 */
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
				// collect()는 로드된 이미지들 내에서만 체크한다.
				// 로드되지 않은 이미지들의 오류 여부는 렌더링 후에나 알 수 있다.
				this.render(index)
					.then(function(){
						if (!this.isError(index))
							return this.submit(index);
						return false;
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