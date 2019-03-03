
//----------------------------------------------------------------------------------------------------------
// Notify Arguments 정의
//----------------------------------------------------------------------------------------------------------

/**
 * Notify (click) Arguments
 * @typedef {Object} AbImageViewer.NotifyClickArgs
 * @property {String} uid {@link AbPage|페이지} UUID
 * @property {String} status 페이지 상태 (ready|loading|loaded|error)
 */

/**
 * Notify (modified) Arguments
 * @typedef {Object} AbImageViewer.NotifyModifiedArgs
 * @property {String} uid {@link AbPage|페이지} UUID
 * @property {String} data 섬네일 이미지 Data URL
 */

//----------------------------------------------------------------------------------------------------------
// 기타
//----------------------------------------------------------------------------------------------------------

/**
 * 페이지 데이터
 * @typedef {Object} AbImageViewer.PageData
 * @property {Number} index 페이지 인덱스
 * @property {AbPage} page {@link AbPage|페이지} 인스턴스
 */

/**
 * 이미지 뷰어 이벤트 리스너
 * @callback AbImageViewer.EventListener
 * @param {String} name 이벤트명 (click|select|renderlist)
 * @param {AbImageViewer.EventArgs} data 인자
 */

/**
 * 이미지 뷰어 이벤트 인자
 * @typedef {(AbImageViewer.ClickArgs|AbImageViewer.SelectArgs|AbImageViewer.RenderListArgs)} AbImageViewer.EventArgs
 */

/**
 * 이미지 뷰어 클릭 이벤트 인자
 * <p>섬네일 클릭 시 발생 (사용자의 액션에 의해서만 발생)
 * <p>* 오류난 경우에도 발생하니 상태에 따라 처리 요망
 * @typedef {Object} AbImageViewer.ClickArgs
 * @property {String} name 이미지 목록 구분(pages/bookmarks)
 * @property {String} token 이미지 목록 구분(popup=모아보기)
 * @property {Number} index 페이지인덱스
 * @property {String} uid 페이지 UUID
 * @property {String} status 상태정보 (ready/error/loading/loaded)
 */

 /**
 * 이미지 뷰어 선택 이벤트 인자
 * <p>섬네일 선택 시 발생 (상황에 따라 자동 발생)
 * @typedef {Object} AbImageViewer.SelectArgs
 * @property {String} name 이미지 목록 구분(pages/bookmarks)
 * @property {String} token 이미지 목록 구분(popup=모아보기)
 * @property {Number} index 페이지인덱스
 * @property {String} uid 페이지 UUID
 */

 /**
 * 이미지 뷰어 렌더리스트 이벤트 인자
 * <p>보여지는 이미지 목록 리스트업 후 발생
 * @typedef {Object} AbImageViewer.RenderListArgs
 * @property {String} name 이미지 목록 구분(pages/bookmarks)
 * @property {String} token 이미지 목록 구분(popup=모아보기)
 * @property {Number} visible 보여지는 이미지 개수
 * @property {Number} loading 로드 요청한 이미지 개수
 */

/**
 * 이미지 뷰어 옵저브 리슨 함수
 * @callback AbImageViewer.ObserveListenFunction
 * @param {AbImageViewer} sendor Notify한 객체
 * @param {String} topic 토픽
 * @param {String} [value] 값
 */

 /**
 * 이미지 뷰어 옵저브 리슨 객체
 * @typedef AbImageViewer.ObserveListenObject
 * @property {AbImageViewer.ObserveListenFunction} notify 리스너 메서드
 */

 /**
 * 이미지 뷰어 옵저브 리스너
 * @typedef {(AbImageViewer.ObserveListenFunction|AbImageViewer.ObserveListenObject)}
 * AbImageViewer.ObserveListener
 */

/**
 * 이미지 뷰어 설정 정보
 * <dl>
 * 	<dt>shape.selection.target</dt>
 * 	<dd>
 * 	<table>
 * 	<thead>
 * 	<tr>
 * 		<th>종류</th><th>설명</th>
 * 	</tr>
 * 	</thead>
 * 	<tbody>
 * 	<tr>
 * 		<td>all</td><td>전체</td>
 * 	</tr>
 * 	<tr>
 * 		<td>rectangle</td><td>사각형</td>
 * 	</tr>
 * 	<tr>
 * 		<td>ellipse</td><td>원형</td>
 * 	</tr>
 * 	<tr>
 * 		<td>line</td><td>선</td>
 * 	</tr>
 * 	<tr>
 * 		<td>arrow</td><td>화살표</td>
 * 	</tr>
 * 	<tr>
 * 		<td>pen</td><td>펜</td>
 * 	</tr>
 * 	<tr>
 * 		<td>highlightpen</td><td>형광펜</td>
 * 	</tr>
 * 	<tr>
 * 		<td>masking.rectangle</td><td>사각형 마스킹</td>
 * 	</tr>
 * 	<tr>
 * 		<td>masking.ellipse</td><td>원형 마스킹</td>
 * 	</tr>
 * 	</tbody>
 * 	</table>
 * 	</dd>
 * </dl>
 * @typedef {Object} AbImageViewer.Config
 * @property {String} mode 이미지 뷰어 초기 모드 설정
 * @property {Object} waterMark 워터마크 관련 설정
 * @property {String} waterMark.image 워터마크 이미지 URL
 * @property {Object} image 이미지 관련 설정
 * @property {String} image.save 서버 전송 방식 설정 (all|current)
 * @property {Number} image.local-save-limit 이미지 로컬 다운로드 제한 설정 (값이 0이거나 음수면 제한 없음)
 * @property {Object} image.storage 이미지 스토로지 관련 설정
 * @property {String} image.storage.type 이미지 스토로지 타입 설정 (db|folder)
 * @property {String} image.storage.path 이미지 스트로지 경로 설정 (type이 folder인 경우)
 * @property {Object} toolbar 툴바 관련 설정
 * @property {String} toolbar.layout 툴바 레이아웃 설정 (all|main|right)
 * @property {Object} shape 주석/마스킹 관련 설정
 * @property {String} shape.save 저장 옵션 (all|masking=마스킹만 저장)
 * @property {String} shape.addUI 추가 방식 설정 (none|window=스타일 설정창 사용|toolbar=도형 스타일 툴바 먼저 표시)
 * @property {Number} shape.local-save-limit 이미지 로컬 다운로드 제한 설정 (값이 0이거나 음수면 제한 없음)
 * @property {Object} shape.selection 주석/마스킹 선택 관련 설정
 * @property {String} shape.selection.style 선택 방식 설정 (path|box)
 * @property {Array.<String>} shape.selection.target 선택 방식을 적용할 도형 배열 (style이 box일 경우)<p>(all|rectangle|ellipse|line|arrow|pen|highlightpen|masking.rectangle|masking.ellipse)
 * @property {String} shape.selection.lineDrawStyle 선 모양 도형(선, 화살표)의 포커스 스타일 (path|box)
 * <dl>
 * 	<dt>path</dt><dd>선 모양의 선택영역을 그립니다. (기본 스타일)</dd>
 * 	<dt>box</dt><dd>선택 영역을 상자로 그립니다.</dd>
 * </dl>
 */

/**
 * 이미지 뷰어 퍼미션 체커
 * @typedef {Object} AbImageViewer.PermissionChecker
 * @property {AbImageViewer.PermissionCheckCallback} check 토픽에 대한 권한을 체크합니다.
 */

/**
 * 이미지 뷰어 퍼미션 체크 콜백 함수
 * @callback AbImageViewer.PermissionCheckCallback
 * @param {String} topic 툴바 토픽
 */

/**
 * URL 정보
 * @typedef2 {Object} AbImageViewer.URLS
 * @property2 {String} CONFIG=api/config 설정 정보 URL
 * @property2 {String} PERMISSION=api/permission 권한 정보 URL
 * @property2 {String} OPEN=api/images 이미지 목록 로드 URL
 * @property2 {String} SAVE 전송 정보
 * @property2 {String} SAVE.ALLOC=api/alloc 아이디 할당 URL
 * <p>* WAS의 {@link Server.AbAllocKeyData|AbAllocKeyData} 객체를 리턴해야 합니다.
 * @property2 {String} SAVE.MODIFY=api/modify-prepare 수정 준비 URL
 * @property2 {String} SAVE.IMAGE=api/save-image 이미지 저장 URL
 * @property2 {String} SAVE.REMOVE=api/remove 삭제 URL
 * @property2 {String} SAVE.COMPLETED=api/save-completed 완료 알림 URL
 * @property2 {String} PRINT 인쇄 지원
 * @property2 {String} PRINT.ALLOC=api/print-support/alloc 아이디 할당 URL
 * <p>* WAS의 {@link Server.AbAllocKeyData|AbAllocKeyData} 객체를 리턴해야 합니다.
 * @property2 {String} PRINT.IMAGE=api/print-support/save 저장할 인쇄 이미지
 * @property2 {String} PRINT.REMOVE=api/print-support/remove 삭제 URL
 * @property2 {String} PRINT.DOWNLOAD=print-support/img 다운로드 URL
 */

//----------------------------------------------------------------------------------------------------------
// 글로벌 함수
//----------------------------------------------------------------------------------------------------------

 /**
  * 화면을 인쇄합니다.
  * <p>* 인쇄 이미지 로드가 완료되고, 호출됩니다.
  * @ignore
  * @function
  */
 function AbImageViewer$$doPrint(){
	setTimeout(function (){
		var eloading = $('#print-loading');
		eloading.hide();
	
		var eframe = $('#print-frame');
		var doc = AbCommon.contentDocument(eframe);
		if (doc){
			if (doc.execCommand('print') !== false)
				return;
		}
	
		var win = AbCommon.contentWindow(eframe);
		if (win){
			win.print();
		}
	}, 100);
}

/**
 * 인쇄를 종료합니다.
 * <p>* 인쇄를 완료하고 호출됩니다. 서버의 임시 이미지들을 삭제합니다.
 * @ignore
 * @function
 * @param {String} id 서버에서 할당받은 아이디
 */
function AbImageViewer$$endPrint(id){
	var func = function (){
		var id = arguments.callee.id;
		var removeUrl = AbImageViewer.prototype.URLS.PRINT.REMOVE;
		
		if (id){
			AbCommon.ajax({
				url: removeUrl,
				data: {
					id: id
				},
			});
		}
	};
	func.id = id;
	
	setTimeout(func, 500);
}

//-----------------------------------------------------------
//-----------------------------------------------------------
//-----------------------------------------------------------

//----------------------------------------------------------------------------------------------------------
// 이미지 뷰어
//----------------------------------------------------------------------------------------------------------

/**
 * 이미지 뷰어
 * @class
 * 
 * @fires renderlist
 * @fires select
 * @fires click
 * 
 * @param {Object} [options] 옵션
 * @param {AbImageViewer.Config} [options.config] 이미지 뷰어 설정 정보
 * @param {AbImageViewer.PermissionChecker} [options.permission] 퍼미션 체커
 * @param {Padding} [options.margin] 페이지 마진
 * <p>* 이미지와 캔버스의 사이의 여백입니다.
 * @param {Boolean} [options.animate] 엔진의 애니메이션 여부
 * @param {Boolean} [options.notifySelectPage=true] 페이지 선택 시 Notify 여부
 * @param {String} [options.mode=view] 툴바가 없을 시 기본 모드 설정 (edit/view)
 * @param {String} [options.stylerWindowSelector] 스타일러 창의 
 * @param {AbWaterMark} [options.waterMark] 워터마크 관리자 인스턴스
 * @param {Object} [options.style] 스타일 정보
 * @param {Object} [options.style.listPopup=default] 모아보기 스타일 (default|readonly)
 * <p>* default (기본보기와 동일), readonly (읽기 전용)
 */
function AbImageViewer(options){
	if (!options) options = {};
	var styleOptions = options.style || {};

	//-----------------------------------------------------------

	/**
	 * 뷰 컨트롤 HTML 엘리먼트 선택자
	 * @type {String}
	 */
	this.selector = options.selector || '#canvas';

	//-----------------------------------------------------------
	
	/**
	 * 이미지 뷰어 설정 정보
	 * @private
	 * @type {AbImageViewer.Config}
	 */
	this.$config = options.config || {};
	/**
	 * 퍼미션 체커
	 * @private
	 * @type {AbImageViewer.PermissionChecker}
	 */
	this.$permission = options.permission;

	//-----------------------------------------------------------

	/**
	 * 페이지 마진
	 * @type {Padding}
	 */
	this.margin = options.margin || null;
	
	//-----------------------------------------------------------

	/**
	 * 옵저브 리스너 목록
	 * @private
	 * @type {Array.<AbImageViewer.ObserveListener>}
	 */
	this.observers = [];
	/**
	 * 이벤트 리스너 목록
	 * <p>* 필드명이 이벤트명, 필드값이 {@link AbImageViewer.EventListener}인 객체입니다.
	 * @private
	 * @type {Object.<String, AbImageViewer.EventListener>}
	 */
	this.listeners = {};

	//-----------------------------------------------------------
	// 마스킹 도형 추가

	if (!AbViewerEngine.prototype.SHAPE_TABLE['masking.rectangle'])
		AbViewerEngine.prototype.SHAPE_TABLE['masking.rectangle'] = this.createMaskingShape('rectangle');
	
	if (!AbViewerEngine.prototype.SHAPE_TABLE['masking.ellipse'])
		AbViewerEngine.prototype.SHAPE_TABLE['masking.ellipse'] = this.createMaskingShape('ellipse');

	//-----------------------------------------------------------

	/**
	 * History 관리자
	 * @type {AbHistory}
	 */
	this.history = new AbHistory();

	//-----------------------------------------------------------

	/**
	 * 현재 이미지 목록 타입 (pages/bookmarks)
	 * @type {String}
	 * @default
	 */
	this.listType = 'pages'; // 현재 이미지 목록 타입 (pages/bookmarks)
	/**
	 * 모아보기 여부
	 * @private
	 * @type {Boolean}
	 * @default
	 */
	this.$showListViewPopup = false; // 모아보기 여부

	//-----------------------------------------------------------
	
	/**
	 * 엔진 애니메이션 여부
	 * @private
	 * @type {Boolean}
	 * @default true
	 */
	this.animatingEngine = AbCommon.isBool(options.animate) ? options.animate: true;
	/**
	 * 페이지 선택 시 Notify 여부
	 * @private
	 * @type {Boolean}
	 * @default true
	 */
	this.enableNotifySelectPage = AbCommon.isBool(options.notifySelectPage) ? options.notifySelectPage : true;

	//-----------------------------------------------------------
	// 요청 인자
	//-----------------------------------------------------------
	// openImages() 메서드에 의해 세팅됨.

	/**
	 * 요청 인자
	 * <p>* {@link AbImageViewer#openImages|openImages()} 메서드에서 설정합니다.
	 * @private
	 * @type {Object}
	 */
	this._requestParam = null;

	//-----------------------------------------------------------

	/**
	 * 모아보기 스타일 (default|readonly)
	 * <p>* default (기본보기와 동일), readonly (읽기 전용)
	 * @private
	 * @type {String}
	 * @default default
	 */
	this.listPopupStyle = styleOptions.listPopup || 'default'; // default (기본보기와 동일), readonly (읽기 전용)

	//-----------------------------------------------------------
	
	// 툴바가 없을 시 기본 모드 설정 (edit/view) view가 디폴트
	//this.defaultMode = options.mode || 'view';

	/**
	 * 툴바가 없을 시 기본 모드 설정 (edit/view)
	 * <p>* 기본값은 view입니다.
	 * @private
	 * @type {String}
	 * @default view
	 */
	this.defaultMode = 'view';
	if (options.mode)
		this.defaultMode = options.mode;
	else if (options.config && options.config.mode)
		this.defaultMode = options.config.mode;
	
	//-----------------------------------------------------------

	/**
	 * 섬네일 생성기
	 * @type {AbThumbnailGenerator}
	 */
	this.thumbnailGenerator = new AbThumbnailGenerator();

	/**
	 * 페이지 목록
	 * @type {AbPageCollection}
	 */
	this.images = new AbPageCollection();
	/**
	 * 북마크 목록
	 * @type {AbPageCollection}
	 */
	this.bookmarks = new AbPageCollection();

	/**
	 * 하단 페이지 목록
	 * @type {AbPageCollection}
	 */
	this.subImages = new AbPageCollection();

	/**
	 * 이미지 이미지뷰
	 * <p>* {@link AbImageViewer#install|install()}에서 설정합니다.
	 * @private
	 * @type {AbImageListView}
	 */
	this.imageListView = null;
	/**
	 * 북마크 이미지뷰
	 * <p>* {@link AbImageViewer#install|install()}에서 설정합니다.
	 * @private
	 * @type {AbImageListView}
	 */
	this.bookmarkListViewView = null;

	// 현재 이미지 리스트뷰
	/**
	 * 현재 화면에 표시된 이미지 리스트뷰
	 * <p>* {@link AbImageViewer#install|install()}에서 설정합니다.
	 * @type {AbImageListView}
	 */
	this.listView = null;

	/**
	 * 도형 스타일러
	 * <p>* {@link AbImageViewer#install|install()}에서 설정합니다.
	 * @private
	 * @type {AbShapeStyler}
	 */
	this.styler = null;
	/**
	 * 툴바
	 * <p>* {@link AbImageViewer#install|install()}에서 설정합니다.
	 * @private
	 * @type {AbToolbar}
	 */
	this.toolbar = null;
	/**
	 * 색상 선택기
	 * <p>* {@link AbImageViewer#install|install()}에서 설정합니다.
	 * @private
	 * @type {AbColorPicker}
	 */
	this.colorPicker = null;

	/**
	 * 창용 도형 스타일러
	 * <p>* {@link AbImageViewer#install|install()}에서 설정합니다.
	 * @private
	 * @type {AbShapeStyler}
	 */
	this.stylerWindow = null;
	/**
	 * 스타일러 창 HTML 엘리먼트 선택자
	 * @private
	 * @type {String}
	 * @default #abstylewindow
	 */
	this.stylerWindowSelector = options.stylerWindowSelector || '#abstylewindow';

	/**
	 * 워터마크
	 * @type {AbWaterMark}
	 */
	this.waterMark = options.waterMark && options.waterMark instanceof AbWaterMark ? options.waterMark : new AbWaterMark();
	this.waterMark.observe(this);
	
	//-----------------------------------------------------------

	/**
	 * 엔진 인스턴스
	 * @type {AbViewerEngine}
	 */
	this.engine = new AbViewerEngine({
		config: this.$config,
		
		pages: this.images,
		history: this.history,
		margin: this.margin,
		waterMark: this.waterMark,
		
		notifySelectPage: this.enableNotifySelectPage,
	});

	/**
	 * 뷰 컨트롤
	 */
	this.canvas = $(this.selector);
};
	
//-----------------------------------------------------------
//-----------------------------------------------------------
//-----------------------------------------------------------

AbImageViewer.prototype = {
	constructor: AbImageViewer,

	//-----------------------------------------------------------
	
	/**
	 * 전송 데이터 분할 크기
	 * @static
	 * @type {Number}
	 * @default
	 */
	SPLIT_DATA_SIZE: 30720, // 30KB
	
	/**
	 * 전송 시 병렬 개수
	 * @static
	 * @type {Number}
	 * @default
	 */
	PARALLELS: 3, // 이미지 전송 시 병렬 개수
	
	/**
	 * 서버 URL
	 * @type2 {AbImageViewer.URLS}
	 * @type {Object}
	 * @property {String} CONFIG=api/config 설정 정보 URL
	 * @property {String} PERMISSION=api/permission 권한 정보 URL
	 * @property {String} OPEN=api/images 이미지 목록 로드 URL
	 * @property {String} SAVE 전송 정보
	 * @property {String} SAVE.ALLOC=api/alloc 아이디 할당 URL
	 * <p>* WAS의 {@link Server.AbAllocKeyData|AbAllocKeyData} 객체를 리턴해야 합니다.
	 * @property {String} SAVE.MODIFY=api/modify-prepare 수정 준비 URL
	 * @property {String} SAVE.IMAGE=api/save-image 이미지 저장 URL
	 * @property {String} SAVE.REMOVE=api/remove 삭제 URL
	 * @property {String} SAVE.COMPLETED=api/save-completed 완료 알림 URL
	 * @property {String} PRINT 인쇄 지원
	 * @property {String} PRINT.ALLOC=api/print-support/alloc 아이디 할당 URL
	 * <p>* WAS의 {@link Server.AbAllocKeyData|AbAllocKeyData} 객체를 리턴해야 합니다.
	 * @property {String} PRINT.IMAGE=api/print-support/save 저장할 인쇄 이미지
	 * @property {String} PRINT.REMOVE=api/print-support/remove 삭제 URL
	 * @property {String} PRINT.DOWNLOAD=print-support/img 다운로드 URL
	 * @static
	 */
	URLS: {
		/**
		 * 설정 정보 URL
		 * @type {String}
		 */
		CONFIG: 'api/config',
		/**
		 * 권한 정보 URL
		 * @type {String}
		 */
		PERMISSION: 'api/permission',
		
		/**
		 * 이미지 목록 로드 URL
		 * @type {String}
		 */
		OPEN: 'api/images',

		/**
		 * 전송 정보
		 */
		SAVE: {
			/**
			 * 아이디 할당 URL
			 * <p>* WAS의 {@link Server.AbAllocKeyData|AbAllocKeyData} 객체를 리턴해야 합니다.
			 * @type {String}
			 */
			ALLOC: 'api/alloc', // alloc API는 AbImageKeyData 객체를 리턴해야 합니다.
			/**
			 * 수정 준비 URL
			 * @type {String}
			 */
			MODIFY: 'api/modify-prepare',			
			/**
			 * 이미지 저장 URL
			 * @type {String}
			 */
			IMAGE: 'api/save-image',
			/**
			 * 삭제 URL
			 * @type {String}
			 */
			REMOVE: 'api/remove',
			/**
			 * 완료 알림 URL
			 * @type {String}
			 */			
			COMPLETED: 'api/save-completed',
		},
		
		/**
		 * 인쇄 지원
		 * @type {Object}
		 */
		PRINT: {
			/**
			 * 아이디 할당 URL
			 * <p>* WAS의 {@link Server.AbAllocKeyData|AbAllocKeyData} 객체를 리턴해야 합니다.
			 * @type {String}
			 */
			ALLOC: 'api/print-support/alloc', // alloc API는 AbImageKeyData 객체를 리턴해야 합니다.
			/**
			 * 저장할 인쇄 이미지
			 * @type {String}
			 */
			IMAGE: 'api/print-support/save',
			/**
			 * 삭제 URL
			 * @type {String}
			 */
			REMOVE: 'api/print-support/remove',			
			/**
			 * 다운로드 URL
			 * @type {String}
			 */
			DOWNLOAD: 'print-support/img',
		},
	},
	
	// 이미지 저장 작업 목록
	/**
	 * 이미지 저장 작업 목록
	 * <ul>
	 * 	<li>image: 이미지 정보 및 도형, 메타데이터 등등
	 * 	<li>image-source: 이미지 바이너리
	 * 	<li>image-result: 렌더링된 이미지 바이너리
	 * 	<li>thumb: 섬네일 이미지 정보 및 바이너리
	 * </ul>
	 * @static
	 * @type {Array.<String>}
	 */
	IMAGE_TYPES: [ 'image', 'image-source', 'image-result', 'thumb' ],

	/**
	 * 이미지 저장 작업 목록 (서브 페이지가 있는 페이지용)
	 * @static
	 * @type {Array.<String>}
	 */
	REF_IMAGE_TYPES: [ 'image' ],

	//-----------------------------------------------------------
	
	/**
	 * 이미지 설정 값을 가져옵니다.
	 * @param {ObjectPathString} name 필드 경로
	 * @return {*} 설정 값
	 */
	config: function (name){
		function configObject(config, name){
			var o = config;
			var path = name.split('.'), idx = 0;
			var pathSiz = path.length - 1, leap = path[path.length - 1];
			while (idx < pathSiz){
				o = o[path[idx]];
				if (!o)
					return null;
				idx++;
			}
			return {
				config: o,
				leap: leap
			};
		}
		
		var r = configObject(this.$config, name);
		
		if (!r)
			return null;
		
		return r.config[r.leap];
	},

	//-----------------------------------------------------------
	
	/**
	 * 퍼미션을 확인합니다.
	 * @param {String} topic 토픽명
	 * @return {Boolean}
	 */
	permission: function(topic){
		if (this.$permission && AbCommon.isFunction(this.$permission.check)){
			return this.$permission.check(topic);
		}
		return true;
	},

	//-----------------------------------------------------------

	/**
	 * 이미지 뷰어을 세팅합니다.
	 * @return {Promise} Promise 객체
	 */
	install: function(){
		var promiseFunc = function (resolve, reject){
			
			try
			{
				this.colorPicker = new AbColorPicker();

				this.stylerWindow = new AbShapeStyler({
					selector: this.stylerWindowSelector + ' .abstyler',
					colorPicker: this.colorPicker
				});

				this.styler = new AbShapeStyler({
					colorPicker: this.colorPicker
				});
				this.styler.observe(this);

				//-----------------------------------------------------------

				this.toolbar = new AbToolbar();
				this.toolbar.observe(this);
				this.toolbar.groupObserve(this);

				//-----------------------------------------------------------
				// 기본보기
				//-----------------------------------------------------------

				// 이미지 목록
				this.imageListView = new AbImageListView({
					name: 'pages',
					pages: this.images,

					selector: '#thumbnails',
				});
				this.imageListView.observe(this);
				this.observe(this.imageListView);
			
				// 북마크 목록
				this.bookmarkListView = new AbImageListView({
					name: 'bookmarks',
					pages: this.bookmarks,

					bookmark: true,

					selector: '#bookmarks',
				});
				this.bookmarkListView.observe(this);
				this.observe(this.bookmarkListView);

				//-----------------------------------------------------------
				// 하단 섬네일 목록
				//-----------------------------------------------------------

				this.subListView = new AbImageSubListView({
					name: 'sub',
					pages: this.subImages,

					selector: '#sub-thumbnails',
				});
				this.subListView.observe(this);
				this.observe(this.subListView);

				//-----------------------------------------------------------
				// 모아보기
				//-----------------------------------------------------------

				// 이미지 목록
				this.popupImageListView = new AbImageListView({
					name: 'pages',
					pages: this.images,

					selector: '#thumbnails-popup',

					selecting: {
						method: this.listPopupStyle === 'readonly' ? 'dblclick' : 'click|dblclick',
						auto: this.listPopupStyle === 'readonly' ? false : true,
					},
					token: 'popup',

					pageCount: 10,
				});
				this.popupImageListView.observe(this);
				this.observe(this.popupImageListView);
			
				// 북마크 목록
				this.popupBookmarkListView = new AbImageListView({
					name: 'bookmarks',
					pages: this.bookmarks,

					bookmark: true,

					selector: '#bookmarks-popup',
					selecting: {
						method: this.listPopupStyle === 'readonly' ? 'dblclick' : 'click|dblclick',
						auto: this.listPopupStyle === 'readonly' ? false : true,
					},
					token: 'popup',

					pageCount: 10,
				});
				this.popupBookmarkListView.observe(this);
				this.observe(this.popupBookmarkListView);

				//-----------------------------------------------------------

				this.updateListType();

				//-----------------------------------------------------------
			
				this.engine.install(function(){
					this.engine.observe('all', this);

					//-----------------------------------------------------------

					this.sync();

					//-----------------------------------------------------------

					this.engine.attachEvents();
					
					if (this.animatingEngine)
						this.engine.animate();

					//-----------------------------------------------------------
					
					resolve(true);
					
				}.bind(this));
			}
			catch (e)
			{
				reject(e);
			}
		}.bind(this);
		
		return new Promise(promiseFunc)
			.then(function (){
				return true;
			}.bind(this));
	},
	
//	prepareInsideIcons: function (){
//		try
//		{
//			var promises = [];
//			for (var p in AbIcons){
//				if (AbIcons.hasOwnProperty(p) && AbIcons[p].data){
//					var d = AbIcons[p];
//					
//					var promise = AbCommon.loadImage(d.data);
//					promises.push(promise);
//				}
//			}
//		}
//		catch (e)
//		{
//			return Promise.reject(e);
//		}
//		
//		if (promises.length)
//			return Promise.all(promises);
//		return Promise.resolve(true);
//	},

	/**
	 * listView 필드를 업데이트합니다.
	 * @private
	 */
	updateListType: function(){
		var imageView = this.imageListView, bookmarkView = this.bookmarkListView;

		if (this.$showListViewPopup){
			imageView = this.popupImageListView;
			bookmarkView = this.popupBookmarkListView;
		}

		switch (this.listType){
		case 'pages':
			this.listView = imageView;
			break;

		case 'bookmarks':
			this.listView = bookmarkView;
			break;
		}
	},

	//-----------------------------------------------------------

	/**
	 * 기본 도형을 복제하여 마스킹용 도형을 생성합니다.
	 * @param {String} originalName 기본 도형명칭
	 * @return {ShapeObject} 도형객체
	 */
	createMaskingShape: function(originalName){

		var templateShape = AbViewerEngine.prototype.SHAPE_TABLE[originalName];
		var shape = AbCommon.cloneShape(templateShape);

		$.extend(shape,{
			name: 'masking.' + originalName,
			type: 'masking',

			style: {
				color: 'black',
			},

			styleDesc: function(){
				return {
					descs: [
						{ name: 'color', text: '채우기색상', style: 'color', alpha: false, notset: false },
					],
				};	
			},
		});

		return shape;
	},

	//-----------------------------------------------------------

	/**
	 * 옵저버 리스너를 등록합니다.
	 * @param {AbImageViewer.ObserveListener} observer 리스너
	 */
	observe: function(observer){ this.observers.push(observer); },
	/**
	 * 옵저버 리스너를 제거합니다.
	 * @param {AbImageViewer.ObserveListener} observer 리스너
	 */
	stopObserve: function(observer){
		var idx = this.observers.indexOf(observer);
		if (idx >= 0) this.observers.splice(idx, 1);
	},
	
	/**
	 * 등록된 옵저버에 Notify합니다.
	 * @param {String} topic 토픽
	 * @param {String} [value] 값
	 */
	notifyObservers: function(topic, value, element){
		setTimeout(function(){
			var len = this.observers.length;
			for (var i=0; i < len; i++){
				var o = this.observers[i];

				if (typeof o == 'function')
					o(this, topic, value, element);
				else if (typeof o.notify == 'function')
					o.notify(this, topic, value, element);
		}}.bind(this), 0);
	},

	//-----------------------------------------------------------

	/**
	 * 워터마크를 그릴 수 있는 지 확인합니다.
	 * @return {Boolean}
	 */
	drawableWaterMark: function(){ return this.waterMark && this.waterMark.drawable(); },

	//-----------------------------------------------------------

	/**
	 * 이미지 목록이 변경되었음을 Notify합니다.
	 * @param {Boolean} [usageSubPage=false] 서브 페이지 여부
	 */
	updatePagesNotifyObservers: function(usageSubPage){
		if (!AbCommon.isBool(usageSubPage)) usageSubPage = false;

		if (usageSubPage){
			this.notifyObservers('sub.pages', this.subImages.length());
			this.toolbar.set('page.total', this.subListView.pages.length(), false);	
		}else{
			this.notifyObservers('pages', this.images.length());
			this.toolbar.set('page.total', this.listView.pages.length(), false);	
		}		
	},

	//-----------------------------------------------------------

	/**
	 * 툴바의 설정값을 적용합니다.
	 * @private
	 */
	sync: function(){
		var toolbarDefinedViewerMode = null;
		
		this.toolbar.forEach(function(topic, value){
			switch (topic){
			case 'mode':
				toolbarDefinedViewerMode = value;
				this.engine.engineMode = value ? 'edit' : 'view';
				this.showEditControls(value);
				break;
			case 'fit.horiz': case 'fit.vert': case 'fit.in':
				this.engine.fitTo = topic.replace('fit.', '');
				break;
			}
		}.bind(this));
		
		//console.log('[toolbarDefinedViewerMode]=' + toolbarDefinedViewerMode);
		//console.log('[defaultMode]=' + this.defaultMode);
		
		// 기본 모드 설정
		if (toolbarDefinedViewerMode === null){
			this.engine.engineMode = this.defaultMode;
			this.showEditControls(this.defaultMode === 'edit');
		}

		this.enableToolbarTopics();
	},

	/**
	 * 엔진 상태에 따라 툴바를 활성화합니다.
	 * @private
	 */
	enableToolbarTopics: function(){
		var topics = [
			'file.save.image',
			'file.save.annotation',
			'send.server',
			'page.print',
			'print',
			'zoom.in',
			'zoom.out',

			'zindex.front',
			'zindex.forward',
			'zindex.backward',
			'zindex.back',

			'fit.horiz',
			'fit.vert',
			'fit.in',
			'page.rotate.ccw',
			'page.rotate.cw',
			'page.rotate.180',
			'mode',
			'show.shapes',
			'show.annotation',
			'show.masking',
			'clear.shapes',
			'page.scale',

			'annotation.cursor',
			'annotation.rectangle',
			'annotation.ellipse',
			'annotation.line',
			'annotation.arrow',
			'annotation.pen',
			'annotation.highlightpen',
			'annotation.textbox',
			'annotation.checker',
			'annotation.stamp',
			'annotation.polygon',
			'annotation.memopad',
			
			'masking.rectangle',
			'masking.ellipse'
		];

		var page = this.engine.currentPage;
		var editable = this.engine.currentPage && this.engine.editable();

		this.toolbar.enableTopic(topics, editable);

		var pageTopics = ['page.prev', 'page.next', 'page.no','page.remove'];

		editable = this.engine.pages.length() > 0;

		this.toolbar.enableTopic(pageTopics, editable);

		if (page)
			this.toolbar.enableKind('image', page.mediaType === 'image');
	},

	//-----------------------------------------------------------

	/**
	 * 워터마크 관리자에서 Notify한 내용을 처리합니다. 
	 * @private
	 * @param {AbWaterMark} sender Notify한 객체
	 * @param {String} topic 토픽
	 * @param {*} value 값
	 */
	waterMarkNotify: function(sender, topic, value){
		switch(topic){
		case 'error':
			// value = {Error}
			this.exec(function(){
				AbMsgBox.error('[WATERMARK] ' + value);
			});
			break;
		}
	},

	//-----------------------------------------------------------

	/**
	 * 툴바에서 Notify한 내용을 처리합니다. 
	 * @private
	 * @param {AbToolbar} sender Notify한 객체
	 * @param {String} topic 토픽
	 * @param {*} value 값
	 */
	toolbarNotify: function (sender, topic, value){
		//console.log('[VIEWER][Toolbar][Topic]['+ topic + '] ' + value);
		
		if (!this.permission(topic))
			return;

		switch(topic){
		case 'file.open': this.openLocalFile(); break;
		case 'file.save.image': this.saveToLocalImage(); break;
		case 'file.save.annotation': this.saveToLocalText(); break;

		case 'send.server': this.sendToServer(); break;

		case 'page.remove': this.removePage(); break;

		case 'page.print': this.printPage(); break;
		case 'print': this.printAllPages(); break;

		case 'zoom.in': this.zoom('in'); break;
		case 'zoom.out': this.zoom('out'); break;

		case 'zindex.front': this.engine.execCommand('z-index', 'top'); break;
		case 'zindex.forward': this.engine.execCommand('z-index', 'up'); break;
		case 'zindex.backward': this.engine.execCommand('z-index', 'down'); break;
		case 'zindex.back': this.engine.execCommand('z-index', 'bottom'); break;
		case 'fit.horiz':
		case 'fit.vert':
		case 'fit.in':
			this.engine.fit(topic.replace('fit.', ''));
			break;
		
		case 'page.rotate.ccw': this.engine.rotate(AbRotate.CCW,AbRotate.DEG_90); break;
		case 'page.rotate.cw': this.engine.rotate(AbRotate.CW,AbRotate.DEG_90); break;
		case 'page.rotate.180': this.engine.rotate(AbRotate.CW,AbRotate.DEG_180); break;

		case 'mode':
			this.engine.mode(value ? 'edit' : 'view');
			this.showEditControls(value);
			break;
			
		case 'show.shapes':
			this.engine.showShapes(value);
			break;
		case 'show.annotation':
			this.engine.showShapes('annotation', value);
			break;
		case 'show.masking':
			this.engine.showShapes('masking', value);
			break;
			
		case 'clear.shapes': this.clearShapes(); break;
			
		case 'page.prev':
			if (this.engine.hasSubPage()){
				this.prevSubPage();
			}else{
				this.prevPage();
			}
			break;
		case 'page.next':
			if (this.engine.hasSubPage()){
				this.nextSubPage();
			}else{
				this.nextPage();
			}
			break;
		case 'page.no':
			if (this.engine.hasSubPage()){
				this.subPage(value);
			}else{
				this.page(value);
			}
			break;

		case 'page.scale':
			switch (value){
			case 'fit.in': case 'fit.horiz': case 'fit.vert':
				this.engine.fit(value.replace('fit.', ''));
				break;
			default:
				if (value.indexOf('%') >= 0){
					var scale = parseFloat(value.replace('%', ''));
					this.engine.scale(scale / 100);
				}
			}
			break;

		case 'pages': case 'bookmarks':
			this.toggleListView(topic);
			break;

		case 'annotation.cursor': break;
		case 'annotation.rectangle':
		case 'annotation.ellipse':
		case 'annotation.line':
		case 'annotation.arrow':
		case 'annotation.pen':
		case 'annotation.highlightpen':
		case 'annotation.textbox':
		case 'annotation.checker':
		case 'annotation.stamp':
		case 'annotation.polygon':
		case 'annotation.memopad':
			this.addShape(topic.replace('annotation.',''))
				.then(function(r){
					if (r === 'cancel')
						sender.set('annotation.cursor', true);
				});
			break;
		case 'masking.rectangle':
		case 'masking.ellipse':
			this.addShape(topic)
				.then(function(r){
					if (r === 'cancel')
						sender.set('annotation.cursor', true);
				});
			break;
		case 'thumb-popup.open':
			this.showListViewPopup(true);
			break;
		case 'thumb-popup.pages':
		case 'thumb-popup.bookmarks':
			if (this.listPopupStyle === 'readonly')
				this.toggleListView(topic, false);
			else
				this.toggleListView(topic);
			break;
		case 'thumb-popup.close':
			this.showListViewPopup(false);
			break;
		}
	},

	/**
	 * 툴바에서 그룹 Notify한 내용을 처리합니다. 
	 * @private
	 * @param {AbToolbar} sender Notify한 객체
	 * @param {String} topic 토픽
	 * @param {*} value 값
	 */
	toolbarGroupNotify: function (sender, group, value){
		// console.log('[VIEWER][Toolbar][Group]['+ group + '] ', value);

		switch(group){
		case 'left':
			this.showimageListView(value);
			break;
		case 'draw':
			sender.set('annotation.cursor', true);
			break;
		}
	},

	/**
	 * 리스트뷰에서 Notify한 내용을 처리합니다. 
	 * @private
	 * @param {AbImageListView} sender Notify한 객체
	 * @param {String} topic 토픽
	 * @param {*} value 값
	 */
	listViewNotify: function(sender, topic, value){
		// console.log('[VIEWER][ListView]['+sender.name+']['+ topic + '] ', value);

		var page = null, index = -1;
		switch(topic){
		case 'info':
			var page = this.images.getById(value);
			var rd = AbImageInfoRenderer.render(page, {
				origin: true,
			});
			if (rd){
				AbMsgBox.open({
					title: rd.title,
					textHtml: rd.html,
				});	
			}
			break;
		case 'request.load':
			this.loadPage(value);
			break;
		case 'renderlist':
			// 인터페이스를 위한 이벤트 발생
			this.trigger('renderlist', {
				name: sender.name,
				token: sender.token,
				visible: value.visible,
				loading: value.loading,
			});
			break;
		case 'click':
			page = this.images.getById(value.uid);
			index = this.images.indexOf(page);
			
			// 인터페이스를 위한 이벤트 발생
			this.trigger('click', {
				name: sender.name,
				token: sender.token,
				index: index,
				uid: value.uid,
				status: value.status
			});
			break;
		case 'select':
			page = this.images.getById(value);
			index = this.images.indexOf(page);
			
			// 인터페이스를 위한 이벤트 발생
			this.trigger('select', {
				name: sender.name,
				token: sender.token,
				index: index,
				uid: value,
			});
			
			this.engine.selectPage(index);
			break;
		case 'dblclick':
			if (sender.token === 'popup'){
				if (this.listPopupStyle === 'readonly'){
					this.showListViewPopup(false);
					var collection = this.images;

					page = collection.getById(value);
					index = collection.indexOf(page);

					this.exec(function (){
						this.engine.selectPage(index);
					});
				}else{
					this.showListViewPopup(false);
				}
			}
			break;
		case 'selected':
			this.toolbar.set('page.no', value + 1, false);
			break;
		case 'unselect':
			this.engine.unselectPage();
			this.toolbar.set('page.no', 0, false);
			break;
		case 'bookmark.add':
			page = this.images.getById(value);
			this.bookmarks.push(page);

			this.notifyObservers(topic, value);
			break;
		case 'bookmark.remove':
			this.bookmarks.removeById(value);

			this.notifyObservers(topic, value);

			if (sender.bookmark)
				this.toolbar.set('page.total', sender.pages.length());

			break;

		case 'bookmark.remove.list':
			for (var i=value.length - 1; i>=0; i--)
				this.bookmarks.removeById(value[i]);

			this.toolbar.set('page.no', this.listView.selectedIndex + 1, false);
			this.toolbar.set('page.total', this.listView.pages.length(), false);
				
			if (!this.bookmarks.length())
				this.engine.unselectPage();

			this.notifyObservers(topic, value);
			break;

		case 'page.remove.list':
			var siz = value.pages.length, a = [];
			for (var i=0; i < siz; i++){
				var d = value.pages[i];
				a.push(d.index);
			}

			if (a.length){
				this.engine.removePages(a);

				this.toolbar.set('page.no', this.listView.selectedIndex + 1, false);
				this.toolbar.set('page.total', this.images.length(), false);
	
				this.notifyObservers(topic, value);
	
				this.enableSubImages();	
			}				
			break;

		case 'history.sync.end':
			this.toolbar.set('page.no', this.listView.selectedIndex + 1, false);
			this.toolbar.set('page.total', this.listView.pages.length(), false);

			this.enableSubImages();
			break;
		}
	},

	//-----------------------------------------------------------

	/**
	 * 하단 리스트뷰에서 Notify한 내용을 처리합니다. 
	 * @private
	 * @param {AbImageListView} sender Notify한 객체
	 * @param {String} topic 토픽
	 * @param {*} value 값
	 */
	subListViewNotify: function(sender, topic, value){
		// console.log('[VIEWER][ListView][SUB]['+sender.name+']['+ topic + '] ', value);

		var page = null, index = -1;
		switch(topic){
		case 'info':
			var page = this.subImages.getById(value);
			var rd = AbImageInfoRenderer.render(page);
			if (rd){
				AbMsgBox.open({
					title: rd.title,
					textHtml: rd.html,
				});
			}
			break;
		case 'request.load':
			this.loadSubPage(value);
			break;
		case 'renderlist':
			// 인터페이스를 위한 이벤트 발생
			this.trigger('renderlist', {
				name: sender.name,
				token: sender.token,
				visible: value.visible,
				loading: value.loading,
			});
			break;
		case 'click':
			page = this.subImages.getById(value.uid);
			index = this.subImages.indexOf(page);
			
			// 인터페이스를 위한 이벤트 발생
			this.trigger('click', {
				name: sender.name,
				token: sender.token,
				index: index,
				uid: value.uid,
				status: value.status
			});
			break;
		case 'select':
			page = this.subImages.getById(value);
			index = this.subImages.indexOf(page);
			
			// 인터페이스를 위한 이벤트 발생
			this.trigger('select', {
				name: sender.name,
				token: sender.token,
				index: index,
				uid: value,
			});
			
			this.engine.selectSubPage(index);
			break;
		case 'dblclick':
			if (sender.token === 'popup'){
				if (this.listPopupStyle === 'readonly'){
					this.showListViewPopup(false);
					var collection = this.subImages;

					page = collection.getById(value);
					index = collection.indexOf(page);

					this.exec(function (){
						this.engine.selectPage(index);
					});
				}else{
					this.showListViewPopup(false);
				}
			}
			break;
		case 'selected':
			this.toolbar.set('page.no', value + 1, false);
			break;
		case 'unselect':
			this.engine.unselectSubPage();
			this.toolbar.set('page.no', 0, false);
			break;

		case 'page.remove.list':
			var siz = value.pages.length, a = [];
			for (var i=0; i < siz; i++){
				var d = value.pages[i];
				a.push(d.index);
			}

			if (a.length){
				var delPages = this.engine.removeSubPages(a);
				
				// 서브 리스트 뷰는 기존 리스트 뷰와 다르게 별개의 AbPageCollection 객체를 가지고 있습니다.
				// 따라서, 삭제되는 페이지는 AbPageCollection 객체에 적용하기 위해 삭제 처리를 해줘야 합니다.
				// this.subImages 객체와 동기화
				// this.subImages는 별개의 객체이기 때문에 삭제 처리를 따로 해줘야 합니다.
				for (var i = delPages.length - 1; i >= 0; i--){
					var d = delPages[i];
					this.subImages.splice(d.index, 1);
				}
				
				this.toolbar.set('page.no', this.subListView.selectedIndex + 1, false);
				this.toolbar.set('page.total', this.subImages.length(), false);
	
				this.notifyObservers('sub.' + topic, value);
			}
			break;

		case 'history.sync.end':
			this.toolbar.set('page.no', this.subListView.selectedIndex + 1, false);
			this.toolbar.set('page.total', this.subListView.pages.length(), false);
			break;
		}
	},

	//-----------------------------------------------------------

	/**
	 * 엔진에서 Notify한 내용을 처리합니다.
	 * @private
	 * @param {AbViewerEngine} sender Notify한 객체
	 * @param {String} topic 토픽
	 * @param {*} value 값
	 */
	engineNotify: function(sender, topic, value){
		//console.log('[VIEWER][Engine]['+ topic + '] ', value);

		var isSubPageAction = false;
		var listView = this.listView;
		var images = this.images;
		var curPage = this.engine.currentPage;
		var curPageIndex = this.engine.currentPageIndex;

		// 서브 페이지 처리
		if (this.engine.hasSubPage()){
			isSubPageAction = true;

			listView = this.subListView;
			images = this.subImages;
			
			//if (topic && topic.length >= 4 && topic.substr(0, 4) === 'sub.') topic = topic.substr(4);

			switch (topic){
			case 'sub.request.select':
				this.subListView.go(value);
				return;

			case 'sub.page':
				if (value == 'select'){
					var page = this.engine.currentPage;

					/**
					 * 현재 페이지가 섬네일 이미지만 로드되었는다면
					 * 이미지를 로드하고 화면을 갱신합니다.
					 */
					if (page && page.isReadyImage()){
						this.exec(function (){
							page.source.image()
								.then(function(){
									this.engine.refresh();
								}.bind(this));
						});
					}
				}

				if (value == 'add' || value == 'select'){
					var fitTo = this.engine.fit();
					if (fitTo){
						this.toolbar.set('page.scale', 'fit.' + fitTo, false);

						this.toolbar.set('fit.' + fitTo, true, false);
					}else{
						this.toolbar.set('page.scale', Math.round(this.engine.scale() * 100) + '%', false);

						this.toolbar.set('fit.horiz', false, false);
						this.toolbar.set('fit.vert', false, false);
						this.toolbar.set('fit.in', false, false);
					}
				}

				if (value == 'select' && curPage){
					this.notifyObservers('sub.page.select', curPage.uid);

					if (this.engine.focusedShape)
						this.styler.set(this.engine.focusedShape);
					else if (!this.engine.selectedShapes.length)
						this.styler.clear();
				}
				
				// 툴바 활성화
				this.enableToolbarTopics();
				return;

			case 'sub.history.sync':
				
				// 서브 리스트 뷰는 기존 리스트 뷰와 다르게 별개의 AbPageCollection 객체를 가지고 있습니다.
				// 따라서, Undo/Redo 되면서 추가/삭제되는 페이지는 AbPageCollection 객체에 적용하기 위해 추가/삭제 처리를 해줘야 합니다.
				// this.subImages 객체와 동기화
				// this.subImages는 별개의 객체이기 때문에 추가/삭제 처리를 따로 해줘야 합니다.
				
				// undo/redo에 대한 복원 처리
				switch(value.topic){
				case 'page':
					switch(value.cmd){
					case 'remove':
						switch(value.docmd){
						case 'undo':
							var siz = value.data.length;
							for (var i=0; i < siz; i++){
								var d = value.data[i];
								this.subImages.splice(d.index, 0, d.source);
							}
							break;
	
						case 'redo':
							for (var i=value.data.length - 1; i >= 0; i--){
								var d = value.data[i];
								this.subImages.splice(d.index, 1);
							}
							break;
						}
						break;
					}
					break;
				}

				// notify 메시지 전달
				this.notifyObservers(topic, value);
				return;
			}
		}

		// 페이지 선택 요청
		if (topic == 'request.select'){
			this.listView.go(value);
			return;
		}

		// 툴바 설정 (toolbar)의 후 처리
		if (topic == 'shape' && value === 'created'){
			var addUI = this.config('shape.addUI');
			if (addUI === 'toolbar'){
				this.engine.cancelAnyClick = true;
			}
		}

		// Styler 연게
		if (topic == 'shape'){
			switch(value){
			case 'created': case 'click': case 'select': case 'selectAll': case 'moved':
				if (this.engine.focusedShape)
					this.styler.set(this.engine.focusedShape);
				break;
			case 'delete':
				if (!this.engine.selectedShapes.length)
					this.styler.clear();
				break;
			}			
		}else if (topic == 'selection'){
			switch(value){
			case 'end':
				if (!this.engine.selectedShapes.length)
					this.styler.clear();
				break;
			}
		}else if (topic == 'clipboard'){
			switch(value){
			case 'paste':
				if (this.engine.focusedShape)
					this.styler.set(this.engine.focusedShape);
				break;
			}
		}

		// Toolbar 연계
		if ((topic == 'shape' && value == 'created') || (topic == 'cancel' && value == 'shape.create')){
			this.toolbar.set('annotation.cursor', true);
		}

		switch (topic){
		case 'scale':
			this.toolbar.set('fit.horiz', false, false);
			this.toolbar.set('fit.vert', false, false);
			this.toolbar.set('fit.in', false, false);

			this.toolbar.set('page.scale', Math.round(value * 100) + '%', false);
			break;
		case 'fit':
			if (value == 'horiz') this.toolbar.set('fit.horiz', true, false);
			if (value == 'vert') this.toolbar.set('fit.vert', true, false);
			if (value == 'in') this.toolbar.set('fit.in', true, false);

			this.toolbar.set('page.scale', 'fit.' + value, false);
			break;

		case 'page':
			if (value == 'select'){
				/**
				 * 현재 페이지가 섬네일 이미지만 로드되었는다면
				 * 이미지를 로드하고 화면을 갱신합니다.
				 */
				if (curPage && curPage.isReadyImage()){
					this.exec(function (){
						curPage.source.image()
							.then(function(){
								this.engine.refresh();
							}.bind(this));
					});
				}

				this.enableSubImages();
			}

			if (value == 'add' || value == 'select'){
				var fitTo = this.engine.fit();
				if (fitTo){
					this.toolbar.set('page.scale', 'fit.' + fitTo, false);

					this.toolbar.set('fit.' + fitTo, true, false);
				}else{
					this.toolbar.set('page.scale', Math.round(this.engine.scale() * 100) + '%', false);

					this.toolbar.set('fit.horiz', false, false);
					this.toolbar.set('fit.vert', false, false);
					this.toolbar.set('fit.in', false, false);
				}
			}

			if (value == 'select' && curPage){
				this.notifyObservers('page.select', curPage.uid);

				if (this.engine.focusedShape)
					this.styler.set(this.engine.focusedShape);
				else if (!this.engine.selectedShapes.length)
					this.styler.clear();
			}
			
			// 툴바 활성화
			this.enableToolbarTopics();
			break;
			
		case 'history':
			if (!isSubPageAction){
				if (value == 'undoing' || value == 'redoing')
					// 실행취소/다시실행을 위해 이미지 목록으로 변경
					this.toggleListView('pages', false);
			}
			break;

		case 'history.sync':
			// 에디터 설정을 이미지 목록으로 변경
			if (!isSubPageAction)
				this.toggleListView('pages', false);

			this.notifyObservers(topic, value);
			break;
			
		case 'modified':
			var execDelay = 100;

			if (value && (value === 'all' || $.isArray(value)) ){
				var all = value === 'all';
				var list = all ? this.images.source : value;
				
				for (var i=0; i < list.length; i++){
					var page = list[i];
					
					if (AbCommon.isNumber(page))
						page = images.get(page);
					
					if (!page.source)
						continue;

					var numSubPages = page.subPages.length();
					if (numSubPages){
						for (var j=0; j < numSubPages; j++){
							var subPage = page.subPages.get(j);
							
							if (subPage.status !== AbPage.prototype.LOADED)
								continue;
	
							var func = function (){
								var self = arguments.callee.self;
								var page = arguments.callee.page;
								var index = arguments.callee.index;
								
								self.renderThumbnail(page, {
									topicPrefix: 'sub.',
									refSub: index === 0,
								});
							};
							func.page = subPage;
							func.index = j;
							func.self = this;
		
							setTimeout(func, execDelay);	
						}	
					}else{
						var func = function (){
							var self = arguments.callee.self;
							var page = arguments.callee.page;
	
							self.renderThumbnail(page);
						};
						func.page = page;
						func.self = this;
	
						setTimeout(func, execDelay);	
					}					
				}

			}else{
				this.exec(function (){
					var page = curPage;
					if (!page) return;
					
					if (isSubPageAction)
						this.renderThumbnail(page, {
							topicPrefix: 'sub.',
							refSub: curPageIndex === 0,
						});
					else
						this.renderThumbnail(page);

				}, execDelay);
			}
			break;
		}

		// 엔진에 notify 수행이 종료되었음을 알립니다.
		this.engine.endNotify(topic, value);
	},

	//-----------------------------------------------------------

	/**
	 * 도형 스타일러에서 Notify한 내용을 처리합니다. 
	 * @private
	 * @param {AbShapeStyler} sender Notify한 객체
	 * @param {String} topic 토픽
	 * @param {*} value 값
	 * @param {ShapeObject} shape 도형 객체
	 */
	styleNotify: function (sender, name, value, shape){
		var changed = value.changed;

		var addUI = this.config('shape.addUI');
		if (addUI === 'toolbar' && this.engine.selection.target){
			return;
		}

		if (changed){
			shape.notify('styling');
			shape.measure();
			shape.notify('styled');

			this.history.end(this.engine);

			this.engine.render();

			// Notify modified
			this.engine.modified();
		}else{
			this.history.begin('shape', 'update', this.engine, ['style']);
		}
	},

	//-----------------------------------------------------------

	/**
	 * 태스크 큐에 실행 함수를 등록합니다.
	 * @private
	 * @param {Function} func 실행 함수
	 * @param {Number} [delay=0] 실행 대기 시간
	 */
	exec: function(func, delay){
		if (!delay) delay = 0;
		setTimeout(func.bind(this), delay);
		//func.call(this);
	},

	//-----------------------------------------------------------

	/**
	 * 명령을 수행합니다.
	 * <dl>
	 * 	<dt>undo</dt><dd>실행 취소를 실행합니다.</dd>
	 * 	<dt>redo</dt><dd>다시 실행을 실행합니다.</dd>
	 * 	<dt>copy</dt><dd>선택된 도형들을 클립보드에 복사합니다.</dd>
	 * 	<dt>paste</dt><dd>클립보드에 있는 복사된 도형들을 붙여넣기합니다.</dd>
	 * 	<dt>cut</dt><dd>선택된 도형들을 클립보드에 복사하고 화면에서 제거합니다.</dd>
	 * 	<dt>delete</dt><dd>선택된 도형들을 삭제합니다.</dd>
	 * 	<dt>selectAll</dt><dd>페이지의 모든 도형들을 선택합니다.</dd>
	 * 	<dt>z-index</dt><dd>선택된 도형들을 앞 또는 뒤로 보냅니다.
	 * <p>* value는 (top|up|down|bottom) 중 하나를 설정합니다.
	 * <p>* {@link AbViewerEngine#zIndex|AbViewerEngine.zIndex()}를 참고하세요.</dd>
	 * </dl>
	 * @param {String} cmd 명령어
	 * @param {*} [value] 값
	 */
	execCommand: function(cmd, value){ this.engine.execCommand(cmd, value); },

	//-----------------------------------------------------------

	/**
	 * 리스트뷰를 전환합니다. (이미지 목록<=>북마크 목록)
	 * @private
	 * @param {String} type (pages=이미지 목록|bookmarks=북마크 목록)
	 * @param {Boolean} [selectingPage=true] 선택 처리 여부
	 */
	toggleListView: function (type, selectingPage){
		if (this.listType == type)
			return;

		if (!AbCommon.isBool(selectingPage)) selectingPage = true;

		var originCallType = type;
		var showListPopup = false;
		if (type.indexOf('thumb-popup.') == 0){
			showListPopup = true;
			type = type.replace('thumb-popup.', '');
		}

		var index = -1;
		switch(type){
		case 'pages':
			$(this.imageListView.selector).removeClass('hide');
			$(this.popupImageListView.selector).removeClass('hide');

			$(this.bookmarkListView.selector).addClass('hide');
			$(this.popupBookmarkListView.selector).addClass('hide');

			this.listType = type;
			this.updateListType();

			this.notifyObservers('collection.changed', selectingPage);
			
			this.toolbar.set(originCallType, true, false);
			this.toolbar.set('page.no', this.listView.selectedIndex + 1, false);
			this.toolbar.set('page.total', this.listView.pages.length(), false);

			if (showListPopup) this.toolbar.set('pages', true, false);
			else this.toolbar.set('thumb-popup.pages', true, false);

			break;
		case 'bookmarks':
			$(this.imageListView.selector).addClass('hide');
			$(this.popupImageListView.selector).addClass('hide');

			$(this.bookmarkListView.selector).removeClass('hide');
			$(this.popupBookmarkListView.selector).removeClass('hide');

			this.listType = type;
			this.updateListType();

			this.notifyObservers('collection.changed', selectingPage);

			this.toolbar.set(originCallType, true, false);
			this.toolbar.set('page.no', this.listView.selectedIndex + 1, false);
			this.toolbar.set('page.total', this.listView.pages.length(), false);

			if (showListPopup) this.toolbar.set('bookmarks', true, false);
			else this.toolbar.set('thumb-popup.bookmarks', true, false);

			break;
		}
	},

	/**
	 * 리스트뷰를 화면에 표시하거나 숨깁니다.
	 * @private
	 * @param {Boolean} show 표시 여부
	 */
	showimageListView: function(show){
		var thumbnailLayer = $('.abv-thumbnails-closable');

		if (show){
			thumbnailLayer.removeClass('abv-hide-thumbnails');
		}else{
			thumbnailLayer.addClass('abv-hide-thumbnails');
		}
		this.resize();
	},

	/**
	 * 도형 스타일 패널을 표시하거나 숨깁니다.
	 * @private
	 * @param {Boolean} show 표시 여부
	 */
	showEditControls: function (show){
		var viewLayer = $('.abv-view');
		if (show){
			viewLayer.addClass('abv_show_view_tools');
		}else{
			viewLayer.removeClass('abv_show_view_tools');
		}
		this.resize();
	},

	/**
	 * 모아보기 리스트뷰를 화면에 표시하거나 숨깁니다.
	 * @private
	 * @param {Boolean} show 표시 여부
	 */
	showListViewPopup: function (show){
		this.$showListViewPopup = show;
		this.updateListType();

		var thumbnailLayer = $('#thumbnails-popup-layer');

		if (show){
			thumbnailLayer.removeClass('abv-hide-thumbnails-popup-layer');
		}else{
			thumbnailLayer.addClass('abv-hide-thumbnails-popup-layer');
		}
	},

	//-----------------------------------------------------------

	/**
	 * 크기 변경에 대한 처리를 수행합니다.
	 */
	resize: function(){
		/*
		this.engine.runtime = true;

		var timeId = setInterval(function (){
			this.engine.resize();
		}.bind(this), 100);

		this.exec(function (){
			clearTimeout(timeId);

			this.engine.runtime = false;
		}, 500);
		*/

		this.exec(function (){
			this.engine.resize();
		}, 0);
	},

	/**
	 * 페이지와 도형을 렌더링합니다.
	 */
	render: function (){ this.engine.render(); },

	//-----------------------------------------------------------

	/**
	 * 도형 스타일러 창의 기본값 맵
	 * <p>* 필드명이 도형명칭, 필드값이 속성객체인 객체입니다.
	 * @private
	 * @type {Object.<String, Object>}
	 */
	defaultShapeStyles: {},
	
	/**
	 * 도형을 추가합니다.
	 * @param {String} shapeName 도형명칭
	 * @return {Promise} Promise 객체
	 */
	addShape: function (shapeName){
		var addUI = this.config('shape.addUI');
		var enableShapeWindow = addUI === 'window';
		var enableToolbar = addUI === 'toolbar';
		
		if (enableShapeWindow){
			return this.shapeStyleWindow(shapeName)
						.then(function (r){
							if (r.result === 'cancel'){
								return r.result;
							}
							
							return new Promise(function(resolve, reject){
								this.engine.exec(function(){
									this.addShape(shapeName);
									resolve('ok');
								});
							}.bind(this));
						}.bind(this))
						.catch(function(e){
							AbMsgBox.error(e + '');
						});
		}else{
			return new Promise(function (resolve, reject){
				var viewer = this;

				this.engine.exec(function(){
					this.addShape(shapeName);

					if (enableToolbar){
						this.cancelAnyClick = false;
						viewer.styler.set(this.shapeObject(shapeName));
					}

					resolve('ok');
				});
			}.bind(this));
		}
	},

	/**
	 * 도형 스타일러 창을 표시합니다.
	 * @private
	 * @param {String} s 도형명칭
	 * @return {Promise} Promise 객체
	 */
	shapeStyleWindow: function (s){
		if (!this.engine.editable()){
			return Promise.resolve({ result: 'cancel' });
		}

		var shape = this.engine.shapeObject(s);
		if (!shape)
			return Promise.reject(new Error('Unknown shape string'));

		if (!AbCommon.hasShapeStyle(shape))
			return Promise.resolve({ result: 'ok' });

		// 기본 스타일 저장
		if (!this.defaultShapeStyles[s])
			this.defaultShapeStyles[s] = AbCommon.clone(shape.style);

		var e = $(this.stylerWindowSelector);
		var ebtns = e.find('[abs-cmd]');
		var viewer = this;
		var defaultStyle = this.defaultShapeStyles[s];

		return new Promise(function (resolve, reject){
			// attach panel events
			var clickHandler = function(event){
				var btn = $(this);
				var cmd = btn.attr('abs-cmd');

				if (cmd == 'ok' || cmd == 'cancel'){
					viewer.stylerWindow.clear();
					ebtns.unbind('click', clickHandler);
					e.hide();
					
					viewer.styler.unlock();
	
					resolve({ result: cmd, style: shape.style });
				}else if (cmd == 'reset'){
					AbCommon.copyProp(defaultStyle, shape.style);
					viewer.stylerWindow.set(shape);
				}
			};

			viewer.styler.lock();
			
			ebtns.bind('click', clickHandler);

			// open
			e.show();

			//var observe = function (sendor, topic, value, shape){

			viewer.stylerWindow.set(shape);
		});
	},

	//-----------------------------------------------------------

	/**
	 * 모든 이미지를 제거합니다.
	 */
	clear: function(){
		this.engine.clearPages();
	},

	/**
	 * 페이지를 추가합니다.
	 * @private
	 * @param {Function} promise 이미지 로드 함수
	 * @param {String} [xmlShapes] 도형 정의 XML 문자열
	 * <p>* {@link AbImageLoader#load|AbImageLoader.load()}를 참고하세요.
	 * @param {Object} [options] 옵션 
	 * @param {Object} [options.history=false] History 기록 여부
	 * @param {Object} [options.angle=0] 이미지 회전 각도
	 * @return {AbImageViewer.PageData} 페이지 데이터
	 */
	add: function(promise, xmlShapes, options){
		var history = options && AbCommon.isBool(options.history) ? options.history : false;
		var angle = options && AbCommon.isNumber(options.angle) ? options.angle : 0;

		var page = new AbPage({
			uid: this.images.uuid(),
			status: AbPage.prototype.READY,
			loader: promise,
			xmlShapes: xmlShapes,
			angle: angle,
		});

		var pageIndex = this.engine.pages.length();
		
		this.engine.addPage(page, false, history);	// 엔진은 이미지 배열에만 추가한다.

		var r = { page: page, index: pageIndex };

		this.notifyObservers('page.add', r);

		return r;
	},

	//-----------------------------------------------------------
	
	/**
	 * XML 문자열로 정의된 도형들을 페이지에 추가합니다.
	 * @private
	 * @param {AbPage} page {@link AbPage|페이지} 인스턴스
	 * @param {String} xmlShapes 도형 정의 XML 문자열
	 * @return {Promise} Promise 객체
	 */
	creatingShapes: function (page, xmlShapes){
		var engine = this.engine;
		
		if (xmlShapes){
			promise = new Promise(function (resolve, reject){
				var cpage = engine.currentPage;
				
				try
				{
					// <?xml version="1.0" encoding="UTF-8"?> 제거
					xmlShapes = AbCommon.removeXmlHeader(xmlShapes);
					
					var ps = AbCommon.deserializePageShapes(xmlShapes);
					
					page.xmlShapes = xmlShapes;
					
					var psLen = ps.length, called = 0;
					for (var i=0; i < psLen; i++){
						var prop = ps[i];
						
						engine.currentPage = page;
						
						engine.createShape(prop.name, prop, function (s, error){
							s.prepare();
							
							page.shapes.push(s);
							
							s.engine = engine;
							s.measure();
							
							called++;
							if (called >= psLen){
								engine.currentPage = cpage;
								
								resolve(psLen);
							}
						});
					}
				}
				catch (e)
				{
					engine.currentPage = cpage;
					reject(e);
				}
			});
		}else{
			promise = Promise.resolve(0);
		}
		
		return promise;
	},

	//-----------------------------------------------------------

	/**
	 * 페이지를 로드합니다.
	 * @private
	 * @param {AbImageViewer.PageData} pageData 페이지 데이터
	 */
	loadPage: function (pageData, sync){
		if (pageData.page.isLoading())
			return false;

		function isMultiple(e){ return e.images && e.images.length; }

		pageData.page.status = AbPage.prototype.LOADING;
		this.notifyObservers('page.loading', pageData.page.uid);
		
		var engine = this.engine;

		return pageData.page.loader()
			.then(function(e){
				if (isMultiple(e))
					this.prepareSubImageThumbnails(pageData, e.images, e.from);
				return e;
			}.bind(this))
			.then(function (e){
				/**
				 * e = {@link AbImageLoader.LoadedImageInfo} 이미지 로드 정보
				 */
//				console.log('[PAGE LOADER]');
//				console.log(e);
				

				return this.creatingShapes(pageData.page, pageData.page.xmlShapes)
					.then(function (){
						return e;
					});
			}.bind(this))
			.then(function (e){
				/**
				 * e = {@link AbImageLoader.LoadedImageInfo} 이미지 로드 정보
				 */

				var kind = e && e.decoder ? (AbCommon.isString(e.decoder) ? e.decoder : e.decoder.kind ) : null;

				if (kind === 'video' || kind === 'audio')
					return this.setMedia(pageData, e.media, e.uri, e.info, e.from, e.decoder);	
				return this.setImage(pageData, e.image, e.info, e.from, e.decoder, e.images);	
			}.bind(this))
			.catch(function (e){
				pageData.page.status = AbPage.prototype.ERROR;
				pageData.page.error = e;

				console.log(e);
				this.notifyObservers('page.error', pageData.page.uid);
			}.bind(this));
	},

	/**
	 * 페이지에 로드된 미디어를 설정합니다.
	 * @private
	 * @param {AbImageViewer.PageData} pageData 페이지 데이터
	 * @param {String} media 미디어 이미지 URI
	 * @param {String} mediaUri 미디어 URI
	 * @param {AbMedia.Metadata} mediaInfo 미디어 메타데이터
	 * @param {AbImageLoader.From} from 미디어 획득처
	 * @param {(String|AbImageLoader.Result)} decoder 렌더링 힌트 (jpeg|png)
	 */
	setMedia: function(pageData, media, mediaUri, mediaInfo, from, decoder){
		// 미디어 종류
		var kind = decoder ? (AbCommon.isString(decoder) ? decoder : decoder.kind ) : null;

		// 이미지 객체에 저장될 이미지 정보
		/**
		 * @type {AbMedia.Info}
		 */
		var info = { from: from, data: mediaInfo };

		var iconLarge = null, icon = null;

		if (kind == 'audio'){
			iconLarge = AbIcons.AUDIO_LARGE;
			icon = AbIcons.AUDIO;
		}else{
			iconLarge = AbIcons.VIDEO_LARGE;
			icon = AbIcons.VIDEO;
		}

		//-----------------------------------------------------------

		var options = {
			info: info,

			width: iconLarge.width,
			height: icon.height,

			image: iconLarge.data,
			thumbnail: icon.data,

			media: {
				kind: kind,
				uri: mediaUri,
				data: media,
			}
		};

		//-----------------------------------------------------------

		var abm = new AbMedia(options);
		var promise = abm.thumbnail();

		//-----------------------------------------------------------

		var pageIndex = pageData.index;
		var page = pageData.page;

		return promise
			.then(function(e){
				page.width = abm.width;
				page.height = abm.height;
				page.source = abm;
				page.mediaType = kind;

				page.error = null;
				page.status = AbPage.prototype.LOADED;

			}.bind(this))
			.then(function(e){
				this.notifyObservers('page.loaded', pageData);
			}.bind(this))
			.catch(function(e){
				console.log(e);

				page.status = AbPage.prototype.ERROR;
				page.error = e;

				this.notifyObservers('page.error', page.uid);
			}.bind(this));
	},

	/**
	 * 페이지에 로드된 이미지를 설정합니다.
	 * @private
	 * @param {AbImageViewer.PageData} pageData 페이지 데이터
	 * @param {String} image 이미지 Data URL
	 * @param {AbImage.Metadata} imageInfo 이미지 메타데이터
	 * @param {AbImageLoader.From} from 이미지 획득처
	 * @param {(String|AbImageLoader.Result)} decoder 렌더링 힌트 (jpeg|png)
	 * @param {Array.<AbImageLoader.LoadedImageInfo>} [images] 서브 이미지 목록
	 */
	setImage: function(pageData, image, imageInfo, from, decoder, images){
		// 렌더링 디코더
		var renderDecoder = 'jpeg';
		if (decoder){
			if (AbCommon.isString(decoder)){
				renderDecoder = decoder;
			}else{
				if (decoder.hasOwnProperty('render') && AbCommon.isString(decoder.render))
					renderDecoder = decoder.render;
				else
					renderDecoder = 'png';
			}
		}

		// 이미지 객체에 저장될 이미지 정보
		/**
		 * @type {AbImage.Info}
		 */
		var info = { from: from, data: imageInfo, decoder: renderDecoder };
		if (images && images.length) info.images = images;
		/**
		 * AbImage 옵션
		 */
		var options = { info: info };
		var isThumbnail = false;

		if (AbCommon.isString(image))
			options.image = image;
		else if (image && (image.image || image.thumbnail)){
			if (!image.image)
				image.image = image.thumbnail;
			
			if (image.width && image.height){
				options.width = image.width;
				options.height = image.height;
			}

			if (image.image && image.width && image.height && image.thumbnail)
				isThumbnail = true;

			if (image.image) options.image = image.image;
			if (image.thumbnail) options.thumbnail = image.thumbnail;
		}

		var abimg = new AbImage(options);

		var pageIndex = pageData.index;
		var page = pageData.page;

		//-----------------------------------------------------------

		var promise = isThumbnail ? abimg.thumbnail() : abimg.image();
		
		var engine = this.engine;
		var thumbnailGenerator = this.thumbnailGenerator;

		return promise
			.then(function (e){
				if (!abimg.hasThumbnail()){
					if (abimg.thumbInfo.url)
						return abimg.thumbnail();
					return abimg.generateThumbnail(this.thumbnailGenerator);
				}
			}.bind(this))
			.then(function (e){
				page.width = abimg.width;
				page.height = abimg.height;
				page.source = abimg;
				
				if (page.angle){
					var pr = AbGraphics.angle.point(page.angle, 0, 0, page.width, page.height);
					page.width = Math.round(Math.abs(pr.x));
					page.height = Math.round(Math.abs(pr.y));
				}

				page.error = null;
				page.status = AbPage.prototype.LOADED;
				
				var promise = null;
				if (page.shapes.length || page.angle){
					
					engine.renderThumbnail(thumbnailGenerator, page);
					
					var imgData = thumbnailGenerator.toImage(renderDecoder);
					return page.source.setThumbnailData(imgData);
				}else{
					return Promise.resolve();
				}
			}.bind(this))
			.then(function(e){
				this.notifyObservers('page.loaded', pageData);
			}.bind(this))
			.catch(function(e){
				console.log(e);

				page.status = AbPage.prototype.ERROR;
				page.error = e;

				this.notifyObservers('page.error', page.uid);
			}.bind(this));	
	},

	//-----------------------------------------------------------

	// images: 이미지 배열
	// options: 옵션
	// 		from: 이미지 타입(local/server)
	//		decoder: 렌더링 힌트
	/**
	 * 이미지 목록을 추가합니다.
	 * @param {Server.ImageList} images 이미지 목록
	 * @param {(Object|AbImageLoader.GetListToken)} [options] 옵션
	 * @property {AbImageLoader.From} [options.from] 이미지 획득처
	 * @property {AbImage.Metadata} [options.preset] 기준 이미지 메타데이터
	 * @property {String} [options.decoder] 렌더링 힌트 (jpeg|png)
	 * @property {String} [options.subTexts] 서브 페이지 표시 문자열
	 * @return {Promise} Promise 객체
	 */
	addImages: function (images, options){
		if (!options) options = {};
		if (!options.from) options.from = 'server';
		
		var addedPages = [];

		return new Promise(function (resolve, reject){
			if (!$.isArray(images)){
				if (!AbCommon.isSetted(images)){
					resolve(addedPages);
					return;
				}
				images = [images];
			}
	
			if (!images.length){
				resolve(addedPages);
				return;
			}
	
			this.exec(function (){
				var siz = images.length;
				for (var i=0; i < siz; i++){
					var row = images[i];
					
					var loader = null;
					
					if (row && row.kind === 'pdf'){
						var decoder = row.decoder || 'jpeg';
						var kind = row.kind || 'pdf';
						
						decoder = AbCommon.createDecoder(decoder, kind);
						
						loader = AbImageLoader.loadPdf(false, row.image, decoder, row.info, {
							from: options.from,
							subTexts: options.subTexts,
						});
					}else{
						loader = this.createLoader(row, i, options);
					}
					
					if (loader){
						var xmlShapes = this.getXmlShapesByRow(row);
						
						var ap = this.add(loader, xmlShapes, {
							angle: row.angle
						});
						
						addedPages.push(ap);						
					}
				}
				
				this.exec(function(){
					this.updatePagesNotifyObservers();
					
					resolve(addedPages);
				});
	
			});			
		}.bind(this));
	},

	//-----------------------------------------------------------

	/**
	 * 로드 함수를 생성합니다.
	 * @param {Server.ImageData} row 이미지 정보
	 * @param {Number} index 이미지 정보의 시퀀스
	 * @param {(Object|AbImageLoader.GetListToken)} [options] 옵션
	 * @property {AbImageLoader.From} [options.from] 이미지 획득처
	 * @property {AbImage.Metadata} [options.preset] 기준 이미지 메타데이터
	 * @property {String} [options.decoder] 렌더링 힌트 (jpeg|png)
	 * @return {Promise} Promise 객체
	 */
	createLoader: function (row, index, options){
		if (!options) options = {};

		var loader = function (){
			var row =  arguments.callee.row;
			var index =  arguments.callee.index;

			return new Promise(function (resolve, reject){
				var img = {};
				var imageInfo = null;

				if (options.preset)
					imageInfo = $.extend({}, options.preset);
				else
					imageInfo = {};
				
				if (row.info){
					if (row.images && $.isArray(row.images)){
						var numSubImages = row.images.length;
						for (var i=0; i < numSubImages; i++){
							var subInfo = row.images[i].info;
							
							if (subInfo)
								subInfo.originMeta = row.info;
						}
						imageInfo = $.extend(imageInfo, row.images[0].info);
					}else{
						imageInfo = $.extend(imageInfo, row.info);
					}
				}

				var decoder = options.decoder;
				var kind = options.kind;
				var images = null;
				
				if (AbCommon.isString(row)){
					img['image'] = row;
				}else{
					if (row.images && $.isArray(row.images)){
						img['images'] = row.images;
						
						images = row.images;
						row = row.images[0];
					}
					
					if (AbCommon.isString(row.image)){
						img['image'] = row.image;
					}
					if (AbCommon.isString(row.thumbnail)){
						img['thumbnail'] = row.thumbnail;
					}
					if (AbCommon.isNumber(row.width) && AbCommon.isNumber(row.height) && (row.width > 0 && row.height > 0)){
						img['width'] = row.width;
						img['height'] = row.height;
					}
					if (AbCommon.isNumber(row.angle)){
						img['angle'] = row.angle;
					}
					if (row.decoder)
						decoder = row.decoder;
					if (row.kind)
						kind = row.kind;
				}
				
				decoder = AbCommon.createDecoder(decoder, kind);

				var r = null;
				
				if (kind === 'video' || kind === 'audio')
					r = { from: options.from, decoder: decoder, media: img.image, uri: img.image, info: imageInfo };
				else{
					r = { from: options.from, decoder: decoder, image: img, info: imageInfo };
					
					if (images)
						r.images = images;
				}

				resolve(r);
			});
		};
		loader.row = row;
		loader.index = index;
		
		return loader;
	},
	
	/**
	 * 서브 이미지 정보에 도형 정의 XML 문자열을 가져옵니다.
	 * @param {Server.ImageData} row 이미지 정보
	 * @return {String}
	 */
	getXmlShapesByRow: function (row){
		if (row && row.images && $.isArray(row.images)){
			row = row.images[0];
		}
		return row ? row.shapes : null;
	},

	//-----------------------------------------------------------
	
	/**
	 * 이미지를 변경합니다.
	 * @param {Number} index 페이지 인덱스
	 * @param {Server.imageData} imageData 이미지 정보
	 * @param {Object} [options] 옵션
	 * @param {Boolean} [options.removePrevShapes=true] 기존 도형 정보들의 삭제 여부
	 */
	changeImage: function(index, imageData, options){
		if (!options) options = {};
		var removePrevShapes = AbCommon.isBool(options.removePrevShapes) ? options.removePrevShapes : true;
		
		var self = this;
		
		var images = this.images;
		var engine = this.engine;
		var thumbnailGenerator = this.thumbnailGenerator;
		
		return new Promise(function(resolve, reject){
			if (index < 0 || index >= images.length()){
				AbMsgBox.error('잘못된 호출입니다 (index)');
				reject(new Error('잘못된 호출입니다 (index)'));
				return;
			}
			
			if (!imageData){
				AbMsgBox.error('잘못된 호출입니다 (imageData)');
				reject(new Error('잘못된 호출입니다 (imageData)'));
				return;
			}
			
			if (!imageData.image){
				AbMsgBox.error('잘못된 호출입니다 (imageData.image)');
				reject(new Error('잘못된 호출입니다 (imageData.image)'));
				return;
			}
			
			var page = images.get(index);
			if (page.error){
				AbMsgBox.error('이미지 로드를 재시도 하세요');
				reject(new Error('이미지 로드를 재시도 하세요'));
				return;
			}
			
			var renderDecoder = imageData.decoder;
			
			page.changeImage(imageData.image)
				.then(function (r){
					if (removePrevShapes){
						//-----------------------------------------------------------
						// begin record history
						//this.history.begin('shape', 'range', engine, [page]);
						//-----------------------------------------------------------
						
						page.shapes.splice(0, page.shapes.length);
						
						//-----------------------------------------------------------
						// end record history
						//this.history.end(engine);
						//-----------------------------------------------------------
					}
					return this.creatingShapes(page, imageData.shapes)
				}.bind(self))
				.then(function (){
					engine.renderThumbnail(thumbnailGenerator, page);

					var imgData = thumbnailGenerator.toImage(renderDecoder);
					page.source.setThumbnailData(imgData);
					
					if (this.engine.currentPageIndex == index){
						this.engine.refresh();
					}
					
					this.notifyObservers('modified', {
						uid: page.uid,
						data: imgData
					});
					
					return r;
				}.bind(self))
				.then(function(){
					resolve();
				})
				.catch(function (e){
					AbMsgBox.error(e);
					reject(e);
				});
		});
	},

	//-----------------------------------------------------------

	/**
	 * 하단 섬네일 목록을 표시하거나 숨깁니다.
	 * @private
	 */
	enableSubImages: function(){
		var page = this.engine.currentPage;

		var cssClass = 'adv-sub-open', chgClass = false;
		if (page && page.isMultiple()){
			chgClass = !this.canvas.hasClass(cssClass);

			this.canvas.addClass(cssClass);

			this.exec(function(){
				this.loadSubImageThumbnails(page);
			});
		}else{
			chgClass = this.canvas.hasClass(cssClass);

			this.canvas.removeClass(cssClass);

			this.exec(function(){
				this.clearSubImageThumbnails();

				this.toolbar.set('page.total', this.listView.pages.length(), false);
			});
		}
		if (chgClass) this.engine.resize();
	},

	//-----------------------------------------------------------

	/**
	 * 서브 이미지를 준비합니다.
	 * @param {AbImageViewer.PageData} pageData 페이지 데이터
	 * @param {Server.ImageList} images 이미지 목록
	 * @param {AbImageLoader.From} from 이미지 획득처
	 */
	prepareSubImageThumbnails: function(pageData, images, from){
		if (images){
			var page = pageData.page;
			var numPages = images.length;

			for (var i=0; i < numPages; i++){
				var row = images[i];

				if (i == 0){
					this.addSubRef(pageData, {
						angle: row.angle,
					});
				}else{
					var loader = null;
				
					if (from)
						loader = this.createLoader(row, i, {
							from: from,
						});
					else
						loader = this.createLoader(row, i);
					
					var xmlShapes = this.getXmlShapesByRow(row);
	
					this.addSub(pageData, loader, xmlShapes, {
						angle: row.angle,
					});	
				}
			}
		}
	},

	//-----------------------------------------------------------

	/**
	 * 서브 페이지를 추가합니다.
	 * @private
	 * @param {AbImageViewer.PageData} pageData 페이지 데이터
	 * @param {Function} promise 이미지 로드 함수
	 * @param {String} [xmlShapes] 도형 정의 XML 문자열
	 * <p>* {@link AbImageLoader#load|AbImageLoader.load()}를 참고하세요.
	 * @param {Object} [options] 옵션 
	 * @param {Object} [options.history=false] History 기록 여부
	 * @param {Object} [options.angle=0] 이미지 회전 각도
	 */
	addSub: function(pageData, promise, xmlShapes, options){
		var angle = options && AbCommon.isNumber(options.angle) ? options.angle : 0;

		var subPage = new AbPage({
			uid: this.subImages.uuid(),
			status: AbPage.prototype.READY,
			loader: promise,
			xmlShapes: xmlShapes,
			angle: angle,
		});

		var pageIndex = pageData.page.subPages.length();
		pageData.page.subPages.push(subPage);

		//var r = { page: subPage, index: pageIndex, ownerPage: pageData.page, ownerPageIndex: pageData.index };
		//this.notifyObservers('sub.page.add', r);

		//return r;
	},
	//-----------------------------------------------------------

	/**
	 * 참조 서브 페이지를 추가합니다.
	 * <p>* 페이지 객체를 서브 페이지에 추가합니다.
	 * @private
	 * @param {AbImageViewer.PageData} pageData 페이지 데이터
	 */
	addSubRef: function(pageData, options){
		var angle = options && AbCommon.isNumber(options.angle) ? options.angle : 0;

		pageData.page.subPages.push(pageData.page);

		// var subPage = new AbPage({
		// 	uid: pageData.page.uid,
		// 	status: pageData.page.status,
		// 	source: pageData.page.source,
		// 	angle: angle,
		// });

		//var pageIndex = pageData.page.subPages.length();
		//pageData.page.subPages.push(subPage);

		//var r = { page: subPage, index: pageIndex, ownerPage: pageData.page, ownerPageIndex: pageData.index };
		//this.notifyObservers('sub.page.add', r);

		//return r;
	},

	//-----------------------------------------------------------

	/**
	 * 하단 리스트뷰를 초기화합니다.
	 */
	clearSubImageThumbnails: function(){
		this.subImages.splice(0, this.subImages.length());
		this.subListView.clear();
	},

	/**
	 * 페이지 객체의 서브 페이지 목록을 하단 리스트뷰에 반영합니다.
	 * @param {AbPage} page 페이지 객체
	 */
	loadSubImageThumbnails: function(page){
		this.clearSubImageThumbnails();

		if (page.hasSubPages()){
			var numPages = page.subPages.length();

			for (var i=0; i < numPages; i++){
				var subPage = page.subPages.get(i);

				this.subImages.push(subPage);
				this.subListView.insertListItem(subPage);

				if (subPage.status == AbPage.prototype.LOADED)
					this.subListView.listItemImage(i);
			}
		}
		
		this.subListView.selectedIndex = this.engine.currentPageIndex;
		this.updatePagesNotifyObservers(true);
		
		//this.subListView.paging(1, this.engine.currentPageIndex >= 0 ? this.engine.currentPageIndex : 'first');
		//this.toolbar.set('page.total', this.subListView.pages.length(), false);
		
		//console.log('@@@@@@@@@@ [loadSubImageThumbnails] ', this.engine.currentPageIndex);
	},

	//-----------------------------------------------------------
	
	/**
	 * 서브 리스트뷰에서 선택된 아이템이 페이지와 동일한지 확인합니다.
	 * @param {AbPage} page 페이지 객체
	 * @return {Boolean}
	 */
	isActivateSubPages: function(page){
		if (this.engine.ownerPage.hasSubPages())
			return this.engine.ownerPage.subPages.getById(page.uid) != null;
		return false;
	},

	/**
	 * 서브 리스트뷰에서 체크된 아이템 개수를 가져옵니다.
	 * @return {Number} 체크된 아이템 개수
	 */
	getSelectedSubPages: function (){
		if (this.engine.ownerPage.hasSubPages())
			return this.subListView.numSelectedPages();
		return 0;
	},

	//-----------------------------------------------------------

	/**
	 * 서브 페이지를 로드합니다.
	 * @private
	 * @param {AbImageViewer.PageData} pageData 페이지 데이터
	 */
	loadSubPage: function (pageData, sync){
		if (pageData.page.isLoading())
			return false;
		
		var notifing = this.isActivateSubPages(pageData.page);

		pageData.page.status = AbPage.prototype.LOADING;
		
		if (notifing)
			this.notifyObservers('sub.page.loading', pageData.page.uid);
		
		var engine = this.engine;

		return pageData.page.loader()
			.then(function (e){
				/**
				 * e = {@link AbImageLoader.LoadedImageInfo} 이미지 로드 정보
				 */
//				console.log('[PAGE LOADER]');
//				console.log(e);
				
				return this.creatingShapes(pageData.page, pageData.page.xmlShapes)
					.then(function (){
						return e;
					});
			}.bind(this))
			.then(function (e){
				/**
				 * e = {@link AbImageLoader.LoadedImageInfo} 이미지 로드 정보
				 */
				return this.setSubImage(pageData, e.image, e.info, e.from, e.decoder, e.images);	
			}.bind(this))
			.catch(function (e){
				pageData.page.status = AbPage.prototype.ERROR;
				pageData.page.error = e;

				console.log(e);
				
				if (notifing)
					this.notifyObservers('sub.page.error', pageData.page.uid);
			}.bind(this));
	},

	/**
	 * 서브 페이지에 로드된 이미지를 설정합니다.
	 * @private
	 * @param {AbImageViewer.PageData} pageData 페이지 데이터
	 * @param {String} image 이미지 Data URL
	 * @param {AbImage.Metadata} imageInfo 이미지 메타데이터
	 * @param {AbImageLoader.From} from 이미지 획득처
	 * @param {(String|AbImageLoader.Result)} decoder 렌더링 힌트 (jpeg|png)
	 * @param {Array.<AbImageLoader.LoadedImageInfo>} [images] 서브 이미지 목록
	 */
	setSubImage: function(pageData, image, imageInfo, from, decoder, images){
		// 렌더링 디코더
		var renderDecoder = 'jpeg';
		if (decoder){
			if (AbCommon.isString(decoder)){
				renderDecoder = decoder;
			}else{
				if (decoder.hasOwnProperty('render') && AbCommon.isString(decoder.render))
					renderDecoder = decoder.render;
				else
					renderDecoder = 'png';
			}
		}
		
		var notifing = this.isActivateSubPages(pageData.page);

		// 이미지 객체에 저장될 이미지 정보
		/**
		 * @type {AbImage.Info}
		 */
		var info = { from: from, data: imageInfo, decoder: renderDecoder };
		if (images && images.length) info.images = images;
		/**
		 * AbImage 옵션
		 */
		var options = { info: info };
		var isThumbnail = false;

		if (AbCommon.isString(image))
			options.image = image;
		else if (image && (image.image || image.thumbnail)){
			if (!image.image)
				image.image = image.thumbnail;
			
			if (image.width && image.height){
				options.width = image.width;
				options.height = image.height;
			}

			if (image.image && image.width && image.height && image.thumbnail)
				isThumbnail = true;

			if (image.image) options.image = image.image;
			if (image.thumbnail) options.thumbnail = image.thumbnail;
		}

		var abimg = new AbImage(options);

		var pageIndex = pageData.index;
		var page = pageData.page;

		//-----------------------------------------------------------

		var promise = isThumbnail ? abimg.thumbnail() : abimg.image();
		
		var engine = this.engine;
		var thumbnailGenerator = this.thumbnailGenerator;

		return promise
			.then(function (e){
				if (!abimg.hasThumbnail()){
					if (abimg.thumbInfo.url)
						return abimg.thumbnail();
					return abimg.generateThumbnail(this.thumbnailGenerator);
				}
			}.bind(this))
			.then(function (e){
				page.width = abimg.width;
				page.height = abimg.height;
				page.source = abimg;
				
				if (page.angle){
					var pr = AbGraphics.angle.point(page.angle, 0, 0, page.width, page.height);
					page.width = Math.round(Math.abs(pr.x));
					page.height = Math.round(Math.abs(pr.y));
				}

				page.error = null;
				page.status = AbPage.prototype.LOADED;
				
				var promise = null;
				if (page.shapes.length || page.angle){
					
					engine.renderThumbnail(thumbnailGenerator, page);
					
					var imgData = thumbnailGenerator.toImage(renderDecoder);
					return page.source.setThumbnailData(imgData);
				}else{
					return Promise.resolve();
				}
			}.bind(this))
			.then(function(e){
				if (notifing)
					this.notifyObservers('sub.page.loaded', pageData);
			}.bind(this))
			.catch(function(e){
				console.log(e);

				page.status = AbPage.prototype.ERROR;
				page.error = e;

				if (notifing)
					this.notifyObservers('sub.page.error', page.uid);
			}.bind(this));	
	},

	//-----------------------------------------------------------

	/**
	 * 로컬 이미지 파일둘을 로드합니다.
	 */
	openLocalFile: function(){
		var supported = (window.File && window.FileReader && window.FileList && window.Blob);
		if (!supported){
			alert('File API 지원안함');
			return;
		}

		var efile = $('#fileopen');
		if (efile.length)
			efile.remove();

		efile = $('<input id="fileopen" type="file" multiple="multiple" style="display: none;"/>');
		$(document.body).append(efile);
		
		efile.change(function(e){
			var files = e.currentTarget.files;
			if (!files || !files.length){
				// - 취소 버튼을 눌러도 change가 호출됨.
				//alert('파일을 선택하세요');
				efile.remove();
				return;
			}
			
//			if (files.length >= 2)
//				console.log('[CATCH]');

			// 에디터 설정을 이미지 목록으로 변경
			this.toggleListView('pages', false);

			var siz = files.length;
			for (var i=0; i < siz; i++){
				var file = files[i];

				// lastModified: 1466262376326
				// lastModifiedDate: Sun Jun 19 2016 00:06:16 GMT+0900 (대한민국 표준시) (Date 객체)
				// name: 56ab2bef0aa7d2738266.png
				// size: 568656
				// type: image/png
				// webkitRelativePath: <<empty string>>

				// console.log('[LOCAL][FILE] ' + file.name + ' (' + file.type + ')');

				var loader = AbImageLoader.load(file);
				if (loader)
					this.add(loader, null, { history: true });
			}

			this.updatePagesNotifyObservers();
			efile.remove();

			if (AbImageLoader.needExternalProcess()){
				var eloading = $('#file-loading');
				eloading.attr('pl-topic', 'loading');

				var bar = eloading.find('.bar');
				bar.css('width', '0%');

				AbImageLoader.doExternalProcess({
					total: 0,
					index: 0,
					self: this,

					begin: function(total){
						this.total = total;
						this.index = 0;
				
						eloading.show();
					},
					next: function (total, index){
						this.index++;
						var per = this.index / this.total * 100;

						bar.css('width', per.toFixed(1) + '%');
					},
					end: function(total){
						this.self.updatePagesNotifyObservers();

						this.self.exec(function (){
							eloading.hide();
						});
					},

					//-----------------------------------------------------------

					error: function (e){
					},

					//-----------------------------------------------------------

					get: function (loader, index){
						this.self.add(loader, true);
					},

					//-----------------------------------------------------------

					beginMulti: function (siz){},
					endMulti: function (siz){
						
					},

					//-----------------------------------------------------------
					
					getList: function (list, token){
						this.self.addImages(list, token);
					},
				});
			}
		}.bind(this));

		efile.click();
	},

	/**
	 * 파일 다운로드(로컬 저장)를 지원하는 지 확인합니다.
	 * @return {Boolean}
	 */
	supportFileSaver: function(){
		var isFileSaverSupported = false;
		try {
			isFileSaverSupported = !!new Blob;
		} catch (e) {
			console.log(e);
			return false;
		}
		return isFileSaverSupported;
	},

	/**
	 * 이미지를 로컬로 저장합니다.
	 * <p>* 이미지를 다운로드합니다.
	 */
	saveToLocalImage: function(){
		if (!this.supportFileSaver()){
			AbMsgBox.info('이 브라우저는 파일 저장을 지원하지 않습니다');
			return;
		}

		var configLocalSaveLimit = this.config('image.local-save-limit');

		var ownerPageIdx = this.engine.ownerPageIndex;
		var pageIdx = this.engine.currentPageIndex;

		// 체크된 페이지 또는 현재 페이지 수집
		var collect = this.collectSelectedOrAllPages({
			target: 'auto',
			start: pageIdx,
			end: pageIdx
		});

		if (!collect.pages.length)
			return;
		
		var accessSubPages = collect.target === 'sub';
			
		if (configLocalSaveLimit && configLocalSaveLimit > 0){
			if (collect.pages.length > configLocalSaveLimit){
				AbMsgBox.warningHtml('최대 ' + configLocalSaveLimit + '까지만 다운로드 할 수 있습니다.<br/>'+
					'이미지를 '+configLocalSaveLimit+'개 이하로 선택하세요.');
				return;
			}
		}
	
		var msg = '';
		if (collect.type == 'single'){
			msg = '선택한 이미지를 어떤 형식으로 저장하시겠습니까?';
		}else{
			msg = '선택한 이미지(들)를 어떤 형식으로 저장하시겠습니까?';
		}

		AbMsgBox.show(msg, null, {
			png: 'PNG 형식',
			jpg: 'JPG 형식',
		})
			.then(function (r){
				if (r == 'png' || r == 'jpg'){
					var self = this;
					var ps = [];
					var len = collect.pages.length;
					for (var i=0; i < len; i++){
						var page = collect.pages[i];
						var index = accessSubPages ? this.subImages.indexOf(page.uid) : this.images.indexOf(page.uid);

						// 실행 함수
						var func = function (resolve, reject){
							var type = arguments.callee.type;
							var page = arguments.callee.page;
							var index = arguments.callee.index;
							var self = arguments.callee.self;
							
							var doFunc = function(){
								var ctx = AbGraphics.canvas.createContext(page.width, page.height);
								self.engine.renderImage(ctx, page);
		
								AbGraphics.canvas.toBlob(ctx, type == 'jpg' ? 'image/jpeg' : null)
									.then(function (blob){
										var name = 'image_';
										
										if (accessSubPages) name += (ownerPageIdx+1) + '_' + (index+1);
										else name += '' + (index+1);
										
										name += '.' + type;
										
										AbVendor.save(blob, name);
										resolve(index);
									})
									.catch(function (e){
										reject(e);
									});
							};
							
							// 섬네일만 로드된 경우
							if (page.isReadyImage()){
								page.source.image()
									.then(function(){
										doFunc();
									})
									.catch(function(e){
										console.log(e);
										
										reject(e);
									});
							}else{
								doFunc();
							}
						};
						func.type = r;
						func.page = page;
						func.index = index;
						func.self = self;

						ps.push(new Promise(func));
					}

					AbCommon.sequencePromiseAll(ps, null, { term: { progress: 10, promise: 10 } })
						.then(function (){
							self.notifyObservers('file.save.image');
						})
						.catch(function(e){
							console.log(e);
							AbMsgBox.error(e);
						});
				}
			}.bind(this));
	},

	/**
	 * 이미지의 도형 정보를 로컬로 저장합니다.
	 */
	saveToLocalText: function(){
		var configSave = this.config('shape.save') || 'all';
		var configLocalSaveLimit = this.config('shape.local-save-limit');
		
		var target = { text: '주석/마스킹', value: 'all' };
		if (configSave === 'masking'){
			target.text = '마스킹';
			target.value = configSave;
		}
		
		var ownerPageIdx = this.engine.ownerPageIndex;
		var pageIdx = this.engine.currentPageIndex;
		
		// 체크된 페이지 또는 전체 페이지 수집
		var collect = this.collectSelectedOrAllPages({
			target: 'auto',
		});
		
		var accessSubPages = collect.target === 'sub';

		var numShapePages = 0, numShapes = 0, msg = null, isAll = false;
		if (collect.type == 'all'){
			var rinfo = accessSubPages ? this.subImages.numShapes() : this.images.numShapes();

			numShapes = rinfo.shapes;
			numShapePages = rinfo.pages;

			msg = '모든 이미지의 '+target.text+' 정보를 저장하시겠습니까';
			isAll = true;
		}else{
			var nums = 0;
			for (var i = collect.pages.length - 1; i >= 0; i--){
				nums = collect.pages[i].shapes.length;

				if (nums > 0){
					numShapes += nums;
					numShapePages++;
				}
			}
			msg = '선택한 이미지(들)의 '+target.text+' 정보를 저장하시겠습니까';
		}

		if (!numShapes)
			return;
			
		if (configLocalSaveLimit && configLocalSaveLimit > 0){
			if (numShapePages > configLocalSaveLimit){
				AbMsgBox.warningHtml('최대 ' + configLocalSaveLimit + '까지만 다운로드 할 수 있습니다.<br/>'+
					'도형이 있는 이미지를 '+configLocalSaveLimit+'개 이하로 선택하세요.');
				return;
			}
		}
	
		AbMsgBox.confirm(msg)
			.then(function (r){
				if (r == 'ok'){
					// var blob = new Blob(["Hello, world!"], {type: "text/plain;charset=utf-8"});
					// saveAs(blob, "hello world.txt");

					// this.notifyObservers('file.save.annotation');

					var self = this;
					var ps = [];
					var numPages = collect.pages.length;

					for (var i=0; i < numPages; i++){
						var page = collect.pages[i];

						var index = accessSubPages ? this.subImages.indexOf(page.uid) : this.images.indexOf(page.uid);
	
						if (!page.shapes.length)
							continue;

						var func = function (resolve, reject){
							var target = arguments.callee.target;
							var page = arguments.callee.page;
							var index = arguments.callee.index;
							var ownerIndex = arguments.callee.ownerIndex;
							var accessSubPages = arguments.callee.accessSubPages;
							var self = arguments.callee.self;

							var output = [AbCommon.xmlHeader()];
							
							if (hasSubPage){
								output.push('<page index="'+ownerIndex+'" sub-index="'+index+'">');
							}else{
								output.push('<page index="'+index+'">');
							}
		
							var nums = page.shapes.length;
							for (var j=0; j < nums; j++){
								var s = page.shapes[j];
								
								if (target.value === 'masking' && s.type !== 'masking')
									continue;
								
								output.push(s.serialize());
							}

							output.push('</page>');

							var blob = new Blob(output, {type: 'text/plain;charset=utf-8'});
							
							var name = 'image_';
							
							if (accessSubPages) name += (ownerIndex+1) + '_' + (index+1);
							else name += '' + (index+1);
							
							name += '.xml';
							
							saveAs(blob, name);

							resolve(index);
						};
						func.target = target;
						func.page = page;
						func.index = index;
						func.ownerIndex = ownerPageIdx;
						func.accessSubPages = accessSubPages;
						func.self = self;

						ps.push(new Promise(func));	
					}

					//-----------------------------------------------------------

					AbCommon.sequencePromiseAll(ps, null, { term: { progress: 10, promise: 10 } })
						.then(function (){
							self.notifyObservers('file.save.annotation');
						})
						.catch(function(e){
							console.log(e);
							AbMsgBox.error(e);
						});
				}
			}.bind(this));
	},

	//-----------------------------------------------------------

	/**
	 * 전체 또는 선택된 이미지(들)를 서버로 전송합니다.
	 */
	sendToServer: function (){
		var configSave = this.config('image.save') || 'all';
		
		var collectOptinos = null;
		if (configSave === 'current') collectOptinos = { current: true };
		
		// 체크된 페이지 또는 전체 페이지 수집
		var collect = this.collectSelectedOrAllMainPages(collectOptinos);
		var msg = null, isAll = false;
		if (collect.type == 'all'){
			msg = '모든 이미지를 서버로 전송하시겠습니까?';
			isAll = true;
		}else if (collect.type == 'single'){
			msg = '선택한 이미지를 서버로 전송하시겠습니까?';
		}else{
			msg = '선택한 이미지들을 서버로 전송하시겠습니까?';
		}

		if (!collect.pages.length)
			return;
		
		msg = msg + '<br/><br/>※ 오류 이미지는 전송되지 않습니다.';

		if (this._requestParam){
			AbMsgBox.showHtml(msg, null, {
				regist: '신규등록',
				modify: '수    정',
			})
				.then(function (r){
					if (r === 'regist' || r === 'modify'){
						this.exec(function (){
							this.submitImages(collect.pages, r);
						}, 300);
					}
				}.bind(this));
		}else{
			AbMsgBox.confirmHtml(msg)
				.then(function (r){
					if (r == 'ok'){
						this.exec(function (){
							this.submitImages(collect.pages);
						}, 300);
					}
				}.bind(this));
		}
	},

	//-----------------------------------------------------------
	// 수정 작업을 원하면 두번째 인자를 modify로 입력한다
	
	/**
	 * 페이지 목록을 서버로 전송합니다.
	 * <p>* 수정 작업을 원하면 work를 modify로 설정합니다.
	 * @private
	 * @param {Array.<AbPage>} pages {@link AbPage|페이지} 목록
	 * @param {String} work 작업유형 (auto|modify)
	 */
	submitImages: function(pages, work){
		if (!AbCommon.isSetted(work)) work = 'auto';
		
		// 이 값이 세팅되면 ID 할당 과정을 생략한다. 즉, 수정 작업 처리
		var requestID = null;
		
		if (work === 'modify' || work === 'auto')
			requestID = this._requestParam;
		
		var it = new AbImageTransferProcessHelper({
			viewer: this,
			
			selector: '#server-saving',
			parallels: this.PARALLELS,
			
			scanSubPage: true,
			
			id: requestID,
			
			urls: {
				alloc: this.URLS.SAVE.ALLOC,
				modify: this.URLS.SAVE.MODIFY,
				remove: this.URLS.SAVE.REMOVE,
				completed: this.URLS.SAVE.COMPLETED,
			},
			
			submit: function (sendor, current, data){
				return this.submitProcess(sendor, current, data);
			}.bind(this),
		});
		
		//-----------------------------------------------------------
		
		it.send(pages)
			.then(function(d){
				it.hide();
				it.dispose();
				
				AbMsgBox.success('이미지들을 전송했습니다');
			})
			.catch(function (e){
				it.hide();
				it.remove();
				it.dispose();
				
				console.log(e);
				
				AbMsgBox.error(e);
			})
			.then(function(){
				// 혹시 몰라 넣은 쓰레기 제거 코드 
				$('#save-forms').empty();
			});
	},

	//-----------------------------------------------------------

	/**
	 * 서버로 전송합니다.
	 * @private
	 * @param {AbImageTransferProcessHelper} sendor 대리자 객체
	 * @param {AbImageTransferProcessHelper.Current} current 현재 전송 데이터
	 * @param {AbImageTransferProcessHelper.CollectResult} data 전송할 이미지 정보 수집 결과
	 * @return {Promise} Promise 객체
	 */
	submitProcess: function(sendor, current, data){
		
		//-----------------------------------------------------------

		var index = current.index;
		var pageInfo = current.pageInfo;
		var imgInfo = current.imgInfo;
		var ref = pageInfo.ref;
		
		//-----------------------------------------------------------

		var types = ref ? this.REF_IMAGE_TYPES : this.IMAGE_TYPES;
		var numTypes = types.length;
		
		//-----------------------------------------------------------

		var fc = AbCommon.formController('#save-forms', 'modify,id,index,mainindex,subindex,type,info');
		var modify = sendor.work === 'modify';
		var id = sendor.transferID;
		
		//-----------------------------------------------------------
		// 수정 작업 여부
		fc.modify.val(modify);
		
		//-----------------------------------------------------------
		// 전송 데이터 수집

		var datas = [];
		for (var itype=0; itype < numTypes; itype++){
			var type = types[itype];
			
			datas.push({
				ref: ref,
				index: index,
				mainIndex: pageInfo.index,
				subIndex: pageInfo.subIndex,
				type: type,
				
				info: pageInfo,
				page: pageInfo.page,
				abimg: ref ? null : pageInfo.page.source,
			});
		}

		// 완료 작업
		datas.push({
			ref: ref,
			index: index,
			mainIndex: pageInfo.index,
			subIndex: pageInfo.subIndex,
			type: 'end',
			
			info: pageInfo,
			page: pageInfo.page,
			abimg: ref ? null : pageInfo.page.source,
		});

		//-----------------------------------------------------------
		// 전송
		
		var dindex = 0, dlength = datas.length;
		var self = this;
		var delay = 10;
		
		return new Promise(function(resolve, reject){
			var exec = function(){
				var d = null;
				var r = null, info = null, content = null;
				var imgElement = null, img = null;
				
				try
				{
					d = datas[dindex];
					var output = [];
					
					var decoder = d.page.decoder();
					if (!decoder) decoder = null;
					
					var promise = null;
					
					switch (d.type){
					case 'image':
						promise = Promise.resolve();
						
						imgElement = d.abimg ? d.abimg.imageElement() : null;
						
						output.splice(0, output.length);
						
						if (!d.ref && d.page.shapes.length){
							output.push(AbCommon.xmlHeader());
							output.push('<page index="'+d.mainIndex+'"');
							if (d.subIndex >= 0)
								output.push(' sub-index="'+d.subIndex+'" ');
							output.push('>');
		
							var nums = d.page.shapes.length;
							for (var j=0; j < nums; j++){
								var s = d.page.shapes[j];
								output.push(s.serialize());
							}
							output.push('</page>');
						}
						
						var meta = d.page.info();
						if (d.ref && meta.originMeta) meta = meta.originMeta;
						
						// WAS의 AbImagePack.ImageInfo 대응
						info = JSON.stringify({
							angle: d.page.angle,
							width: imgElement ? imgElement.width : 0,
							height: imgElement ? imgElement.height : 0,
							shapes: output.length ? output.join('') : null,
							decoder: decoder,
							
							info: meta,
						});
						break;
						
					case 'image-source':
						imgElement = d.abimg.imageElement();
						
						promise = AbCommon.loadImageAsDataURL(imgElement.src)
							.then(function(r){
								content = AbCommon.dataUrlContent(r);
							});
						break;
						
					case 'image-result':
						promise = AbCommon.loadImageAsDataURL(imgInfo.url)
							.then(function(r){
								content = AbCommon.dataUrlContent(r);
							});
						
						//console.log('[IMAGE-RESULT][' + d.index + '] ' + r.substr(0, r.indexOf(',')));
						break;

					case 'thumb':
						imgElement = d.abimg.originThumbnailElement();
						
						// WAS의 AbImagePack.ThumbnailInfo 대응
						info = JSON.stringify({
							width: imgElement.width,
							height: imgElement.height,
						});
						
						promise = AbCommon.loadImageAsDataURL(imgElement.src)
							.then(function(r){
								content = AbCommon.dataUrlContent(r);
							});
						
						//console.log('[THUMBNAIL][' + d.index + '] ' + img.substr(0, img.indexOf(',')));
						break;
						
					case 'thumb2':
						promise = Promise.resolve();
						
						imgElement = d.abimg.originThumbnailElement();
						img = AbGraphics.canvas.renderImage(imgElement, decoder);
						
						// console.log('[THUMBNAIL][' + d.index + '] ' + img.substr(0, img.indexOf(',')));
						
						// WAS의 AbImagePack.ThumbnailInfo 대응
						info = JSON.stringify({
							width: imgElement.width,
							height: imgElement.height,
						});
						
						content = img.substr(img.indexOf(',') + 1);
						break;
						
					case 'end':
						promise = Promise.resolve();
						
						// WAS의 AbImagePack.Bookmark 대응
						// - { index: Number, vindex: Number }
						info = JSON.stringify(d.info.bookmark);
						break;
					}
				
					//-----------------------------------------------------------
					
					promise
						.then(function(r){
							self.submitContent(fc, id, d.index, d.mainIndex, d.subIndex, d.type, info, content, function (){
								try
								{
									if (dindex + 1 >= dlength){
										fc.dispose();
										resolve(true);
									}else{
										dindex++;
										setTimeout(exec, delay);
									}
								}
								catch (e){
									fc.dispose();
									reject(e);				
								}
							}, function (e){
								fc.dispose();
								reject(e);
							});
						})
						.catch(function(e){
							fc.dispose();
							reject(e);
						});
				}
				catch (e)
				{
					fc.dispose();
					
					reject(e);
				}
			};
			
			setTimeout(exec, 0);
		});		
	},
	
	//-----------------------------------------------------------

	/**
	 * 오류 콜백 함수
	 * @callback AbImageViewer.SubmitContentErrorCallback
	 * @param {Error} e Error 객체
	 */

	/**
	 * 서버로 분할 전송합니다.
	 * @private
	 * @param {AbCommon.SplitedDataFormController} formController 분할 전송용 양식 컨트럴러
	 * @param {String} id 아이디
	 * @param {Number} index 인덱스
	 * @param {Number} mainIndex 메인 인덱스
	 * @param {Number} subIndex 서브 인덱스
	 * @param {String} type 이미지 저장 작업 (image|image-source|image-result|thumb)
	 * <p>* {@link AbImageViewer#IMAGE_TYPES}을 참고하세요.
	 * @param {String} info 정보 문자열 (WAS의 AbImagePack.ImageInfo 대응, WAS의 AbImagePack.ThumbnailInfo 대응)
	 * @param {String} content 이미지 Base64 문자열
	 * @param {Function} success 성공 시 호출되는 콜백 함수
	 * @param {AbImageViewer.SubmitContentErrorCallback} error 오류 시 호출되는 콜백 함수
	 */
	submitContent: function (formController, id, index, mainIndex, subIndex, type, info, content, success, error, delay){
		var saveUrl = this.URLS.SAVE.IMAGE;
		var splitDataSiz = this.SPLIT_DATA_SIZE;
	
		formController.id.val(id);
		formController.index.val(index);
		formController.mainindex.val(mainIndex);
		formController.subindex.val(subIndex);
		formController.type.val(type);
		formController.info.val(info);
		
		if (content){
			AbCommon.submitPartialContent({
				url: saveUrl,
				content: content,
				
				splitSize: splitDataSiz,
				
				formController: formController,
				
				success: function (){
					if (AbCommon.isFunction(success))
						success();
				},
				
				error: function(e){
					if (AbCommon.isFunction(error))
						error(e);
				}
			});
		}else{
			AbCommon.ajaxSubmit(formController.form, {
				url: saveUrl,
				
				logFail: true,
				nomsg: true,
				
				success: function(r, status, xhr, $form){
					if (AbCommon.isFunction(success))
						success();
				},
				
				error: function(e, $form){
					if (AbCommon.isFunction(error))
						error(e);
				}
			});
		}
	},

	//-----------------------------------------------------------

	/**
	 * 메인 리스트뷰에서 체크된 이미지들을 제거합니다.
	 * <p>* page.remove가 Notify 됩니다.
	 */
	removePage: function (){
		if (!this.listView) return;
		
		// var accessSubPages = false;
		// var nums = this.getSelectedSubPages();
		// if (nums > 0){
		// 	if (this.subImages.length() - nums > 0){
		// 		accessSubPages = true;
		// 	}else{
		// 		this.images
		// 	}
		// }

		// if (accessSubPages){
		// 	this.notifyObservers('sub.page.remove');
		// }else{
		// 	this.notifyObservers('page.remove');
		// }

		this.notifyObservers('page.remove');
	},

	//-----------------------------------------------------------

	/**
	 * 현재 리스트뷰의 페이지를 이동하거나 페이지 번호를 가져옵니다.
	 * @param {(Number|String)} [value] 페이지 번호
	 * @return {Number} 현재 리스트뷰의 페이지 번호
	 */
	page: function (value){
		if (!this.listView) return -1;

		if (arguments.length){
			if (!AbCommon.isNumber(value)) value = parseInt(value);

			if (!this.listView.go(value - 1)){
				this.toolbar.set('page.no', this.listView.selectedIndex + 1, false);
			}
		}
		return this.listView.pager.page();
	},

	/**
	 * 현재 리스트뷰의 이전 페이지로 이동합니다.
	 */
	prevPage: function (){
		if (!this.listView || !this.listView.canPrev()) return;

		this.listView.prev();
	},

	/**
	 * 현재 리스트뷰의 다음 페이지로 이동합니다.
	 */
	nextPage: function (){
		if (!this.listView || !this.listView.canNext()) return;

		this.listView.next();
	},

	//-----------------------------------------------------------

	/**
	 * 현재 리스트뷰의 페이지를 이동하거나 페이지 번호를 가져옵니다.
	 * @param {(Number|String)} [value] 페이지 번호
	 * @return {Number} 현재 리스트뷰의 페이지 번호
	 */
	subPage: function (value){
		if (!this.subListView) return -1;

		if (arguments.length){
			if (!AbCommon.isNumber(value)) value = parseInt(value);

			if (!this.subListView.go(value - 1)){
				this.toolbar.set('page.no', this.subListView.selectedIndex + 1, false);
			}
		}
		return this.subListView.pager.page();
	},

	/**
	 * 현재 리스트뷰의 이전 페이지로 이동합니다.
	 */
	prevSubPage: function (){
		if (!this.subListView || !this.subListView.canPrev()) return;

		this.subListView.prev();
	},

	/**
	 * 현재 리스트뷰의 다음 페이지로 이동합니다.
	 */
	nextSubPage: function (){
		if (!this.subListView || !this.subListView.canNext()) return;

		this.subListView.next();
	},

	//-----------------------------------------------------------

	/**
	 * 리스트뷰에서 체크된 이미지들을 가져옵니다.
	 * @param {String} type 리스트뷰 명칭 (pages|bookmarks)
	 * @return {Array.<AbPage>}
	 */
	selectedPages: function (type){
		var listView = this.listView;

		switch(type){
		case 'pages': listView = this.imageListView; break;
		case 'bookmarks': listView = this.bookmarkListView; break;
		}

		var list = listView.selectedPages();
		var a = [];
		for (var i = list.length - 1; i >= 0; i--){
			if (!list[i].uid)
				continue;

			var page = this.images.getById(list[i].uid);
			if (page && page.mediaType === 'image')
				a.unshift(page);
		}
		return a;
	},

	//-----------------------------------------------------------

	/**
	 * 하단 리스트뷰에서 체크된 이미지들을 가져옵니다.
	 * @param {String} type 리스트뷰 명칭 (pages|bookmarks)
	 * @return {Array.<AbPage>}
	 */
	selectedSubPages: function (type){
		var listView = this.subListView;

		var list = listView.selectedPages();
		var a = [];
		for (var i = list.length - 1; i >= 0; i--){
			if (!list[i].uid)
				continue;

			var page = this.subImages.getById(list[i].uid);
			if (page && page.mediaType === 'image')
				a.unshift(page);
		}
		return a;
	},

	//-----------------------------------------------------------

	/**
	 * 수집 결과 정보
	 * @typedef {Object} AbImageViewer.CollectedResult
	 * @property {String} target 메인|서브 페이지 구분 (main|sub)
	 * @property {String} type (single|range|all)
	 * @property {Array.<AbPage>} pages 수집된 {@link AbPage|페이지} 배열
	 */

	// 체크된 페이지 또는 전체 페이지 수집

	/**
	 * 체크된 (메인|서브) 페이지 또는 전체 (메인|서브) 페이지를 수집합니다.
	 * @private
	 * @param {Object} [options] 옵션
	 * @param {Object} [options.target] 메인|서브 페이지의 선택 방법 (auto|auto:checked|sub|main)
	 * @param {Object} [options.start] 페이지 범위의 시작
	 * @param {Object} [options.end] 페이지 범위의 끝
	 * @return {AbImageViewer.CollectedResult} 수집 결과 정보
	 */
	collectSelectedOrAllPages: function (options){
		var target = options && AbCommon.isString(options.target) ? options.target : 'auto';
		
		var accessSubPages = false;
		
		switch (target){
		case 'auto': // 엔진의 현재 페이지에 서브 페이지가 있으면 서브로 처리
			accessSubPages = this.engine.ownerPage.hasSubPages();
			break;
			
		case 'auto:checked': // 엔진의 현재 페이지에 서브 페이지가 있고, 서브 리스트뷰에 체크된 아이템이 있는 경우 서브로 처리
			accessSubPages = this.getSelectedSubPages() > 0;
			break;
			
		case 'sub': // 서브로 처리
			accessSubPages = true;
			break;
			
		default: // 메인으로 처리
			break;
		}
		
		if (accessSubPages)
			return this.collectSelectedOrAllSubPages(options);
		return this.collectSelectedOrAllMainPages(options);
	},
	
	/**
	 * 체크된 메인 페이지 또는 전체 메인 페이지를 수집합니다.
	 * @private
	 * @param {Object} [options] 옵션
	 * @param {Object} [options.start] 페이지 범위의 시작
	 * @param {Object} [options.end] 페이지 범위의 끝
	 * @return {AbImageViewer.CollectedResult} 수집 결과 정보
	 */
	collectSelectedOrAllMainPages: function (options){
		// 현재 페이지만
		if (options && options.current === true){
			if (!this.engine.currentPage || this.engine.currentPage.mediaType !== 'image')
				return null;
			
			return { target: 'main', type: 'single', pages: [ this.engine.currentPage ] };
		}
		
		// 체크된 페이지가 있는 경우
		var a = this.selectedPages();
		if (a.length)
			return { target: 'main', type: 'range', pages: a };

		// 기본 전체 페이지 지정
		var start = 0, end = this.images.length() - 1;
		var type = 'all';

		// 옵션에 따라 범위 지정
		if (options && (AbCommon.isNumber(options.start) || AbCommon.isNumber(options.end))){
			if (AbCommon.isNumber(options.start)) start = options.start;
			if (AbCommon.isNumber(options.end)) end = options.end;
			type = (start >= 0 || end >= 0) && start === end ? 'single' : 'range';
		}

		// 페이지 수집
		var source = [], pages = [], urls = [], map = {};
		for (var i=start; i >= 0 && i <= end; i++){
			var page = this.images.get(i);

			if (page.mediaType !== 'image')
				continue;

			a.push(page);
		}
		return { target: 'main', type: type, pages: a };
	},
	
	/**
	 * 체크된 페이지 또는 전체 페이지를 수집합니다.
	 * @private
	 * @param {Object} [options] 옵션
	 * @param {Object} [options.start] 페이지 범위의 시작
	 * @param {Object} [options.end] 페이지 범위의 끝
	 * @return {AbImageViewer.CollectedResult} 수집 결과 정보
	 */
	collectSelectedOrAllSubPages: function (options){
		// 현재 페이지만
		if (options && options.current === true){
			if (!this.engine.currentPage || this.engine.currentPage.mediaType !== 'image')
				return null;
			
			return { target: 'sub', type: 'single', pages: [ this.engine.currentPage ] };
		}
		
		// 체크된 서브 페이지가 있는 경우
		var a = this.selectedSubPages();
		if (a.length)
			return { target: 'sub', type: 'range', pages: a };

		// 기본 전체 페이지 지정
		var start = 0, end = this.subImages.length() - 1;
		var type = 'all';

		// 옵션에 따라 범위 지정
		if (options && (AbCommon.isNumber(options.start) || AbCommon.isNumber(options.end))){
			if (AbCommon.isNumber(options.start)) start = options.start;
			if (AbCommon.isNumber(options.end)) end = options.end;
			type = (start >= 0 || end >= 0) && start === end ? 'single' : 'range';
		}

		// 페이지 수집
		var source = [], pages = [], urls = [], map = {};
		for (var i=start; i >= 0 && i <= end; i++){
			var page = this.subImages.get(i);

			if (page.mediaType !== 'image')
				continue;

			a.push(page);
		}
		return { target: 'sub', type: type, pages: a };
	},

	//-----------------------------------------------------------

	/**
	 * 현재 페이지를 인쇄합니다.
	 */
	printPage: function(){
		if (!this.engine.currentPage)
			return;

		//var accessSubPages = this.getSelectedSubPages() > 0;
		var accessSubPages = this.engine.ownerPage.hasSubPages();
		var ownerPageIdx = this.engine.ownerPageIndex;
		var pageIdx = this.engine.currentPageIndex;
		
		var uid = this.engine.currentPage.uid;
		var idx = accessSubPages ? this.subImages.indexOf(uid) : this.images.indexOf(uid);

		if (idx < 0)
			return;

		var page = accessSubPages ? this.subImages.get(idx) : this.images.get(idx);

		this.exec(function(){
			this.print([page]);
			this.notifyObservers('page.print');
		}, 200);
	},

	/**
	 * 전체 페이지 또는 선택된 페이지를 인쇄합니다.
	 */
	printAllPages: function (){
		var collect = this.collectSelectedOrAllPages({
			target: 'auto',
		});
		var siz = collect.pages.length;

		if (siz > 40){
			AbMsgBox.confirmHtml('인쇄하는 데 오래 걸릴 수 있습니다.<br/>계속 진행하시겠습니까?')
				.then(function(r){
					if (r == 'ok'){
						this.exec(function (){
							this.print(collect.pages);
							this.notifyObservers('print');
						}, 300);
					}
				}.bind(this));
		}else{
			this.exec(function(){
				this.print(collect.pages);
				this.notifyObservers('print');
			}, 200);
		}
	},

	/**
	 * iframe HTML 엘리먼트 정보
	 * @typedef {Object} AbImageViewer.PrintElementInfo
	 * @property {jQueryObject} frame iframe 엘리먼트 jQuery 객체
	 * @property {Document} document HTMLIFrameElement.contentDocument
	 */
	
	/**
	 * iframe HTML 엘리먼트의 엘리먼트 정보를 가져옵니다.
	 * @private
	 * @return {AbImageViewer.PrintElementInfo} iframe HTML 엘리먼트 정보
	 */
	getPrintFrameDoc: function (){
		var eframe = $('#print-frame');
		var frameDoc = AbCommon.contentDocument(eframe);

		if (!frameDoc){
			AbMsgBox.error('인쇄 프레임에 접근할 수 없습니다');
			return null;
		}
		
		return {
			frame: eframe,
			document: frameDoc
		};
	},

	/**
	 * 페이지 배열을 인쇄합니다.
	 * @param {Array.<AbPage>} pages {@link AbPage|페이지} 배열
	 */
	print: function (pages){
		var pf = this.getPrintFrameDoc();
		if (!pf) return;
		
		var it = new AbImageTransferProcessHelper({
			viewer: this,
			
			selector: '#print-loading',
			parallels: this.PARALLELS,
			
			printShapes: this.engine.showShapes(),
			printShapeTypeMap: this.engine.showShapeTypeMap(),
			
			errorImageExit: true, // 오류난 이미지 있을 시 프로세스 중단
		
			urls: {
				alloc: this.URLS.PRINT.ALLOC,
				modify: this.URLS.PRINT.MODIFY,
				remove: this.URLS.PRINT.REMOVE,
			},
			
			msgs: {
				empty: '인쇄할 이미지가 없습니다',
				errorImage: '#{IDX}번 이미지는 인쇄할 수 없습니다',
				readyException: '인쇄 이미지 전송 준비 중 오류가 발생했습니다',
			},
			
			prepare: function (sendor){
				for (var i=0; i < sendor.length; i++)
					sendor.outputImageUrls.push(null);
			},
			
			chain: function (sendor, current, data){
				var promise = null;
				
				if (current.pageInfo && !current.pageInfo.page.isError()){
					if (current.pageInfo && current.pageInfo.page.angle){
						var page = current.pageInfo.page;
						
						var pr = AbGraphics.angle.point(page.angle, 0, 0, current.imgInfo.width, current.imgInfo.height);
						current.imgInfo.width = Math.round(Math.abs(pr.x));
						current.imgInfo.height = Math.round(Math.abs(pr.y));
					}
					
					if (AbPrint.isLandscapeImage(current.imgInfo)){
						promise = AbCommon.loadImage(current.imgInfo.url)
										.then(function (eimg){
											var src = AbPrint.landscape(eimg);
											
											var tmp = current.imgInfo.width;
											current.imgInfo.width = current.imgInfo.height;
											current.imgInfo.height = tmp;
											
											current.imgInfo.url = src;
											return src;
										});
					}else{
						promise = Promise.resolve(current.imgInfo.url);
					}
				}else{
					promise = Promise.resolve(false);
				}				
				
				return promise;
			}.bind(this),
			
			submit: function (sendor, current, data){
				return this.submitPrintSupport(sendor, current, data);
			}.bind(this),
		});
		
		//-----------------------------------------------------------
		// 커스텀 데이터
		
		it.outputImageUrls = [];
		
		//-----------------------------------------------------------
		
		it.send(pages)
			.then(function(d){
				// 혹시 몰라 넣은 쓰레기 제거 코드 
				$('#print-support-forms').empty();
			})
			.then(function(){
				it.status('build');
				
				try
				{
					if (it.outputImageUrls.length){
						// 인쇄 데이터 작성 
						this.buildPrintSupport(it);
					}
				}
				catch (e)
				{
					throw e;
				}
			}.bind(this))
			.catch(function (e){
				it.hide();
				
				console.log(e);
				
				AbMsgBox.error(e);
			})
			.then(function(){
				it.dispose();
			});
	},
	
	//-----------------------------------------------------------
	
	/**
	 * 인쇄 지원 서버 분할 전송 처리를 합니다.
	 * @private
	 * @param {AbImageTransferProcessHelper} sendor 대리자 객체
	 * @param {AbImageTransferProcessHelper.Current} current 현재 전송 데이터
	 * @param {AbImageTransferProcessHelper.CollectResult} data 전송할 이미지 정보 수집 결과
	 * @return {Promise} Promise 객체
	 */
	submitPrintSupport: function (sendor, current, data){
		
		//-----------------------------------------------------------

		var fc = AbCommon.formController('#print-support-forms', 'id,index');

		//-----------------------------------------------------------
		
		var saveUrl = this.URLS.PRINT.IMAGE;
		var imgUrl = this.URLS.PRINT.DOWNLOAD;
		
		var splitDataSiz = this.SPLIT_DATA_SIZE;

		//-----------------------------------------------------------

		var id = sendor.transferID;
		
		var src = current.imgInfo.url;
		if (!AbCommon.isDataUrl(src)){
			sendor.outputImageUrls[current.index] = src;
			return Promise.resolve(true);
		}
		
		src = AbCommon.dataUrlContent(src);
		
		//-----------------------------------------------------------
		
		fc.id.val(id);
		fc.index.val(current.index);
		
		return new Promise(function(resolve, reject){
			AbCommon.submitPartialContent({
				url: saveUrl,
				content: src,
				
				splitSize: splitDataSiz,
				
				formController: fc,
				
				success: function (r){
					fc.dispose();
					
					sendor.outputImageUrls[current.index] = imgUrl + r.text;
					
					resolve(true);
				},
				
				error: function(e){
					fc.dispose();
					reject(e);
				}
			});			
		});
	},
	
	//-----------------------------------------------------------
	
	/**
	 * 인쇄 화면을 작성합니다.
	 * @private
	 * @param {AbImageTransferProcessHelper} sendor 대리자 객체
	 */
	buildPrintSupport: function (sendor){
		var pf = this.getPrintFrameDoc();
		if (!pf) return;
		
		var id = sendor.transferID;
		var imageUrls = sendor.outputImageUrls;
		
		var heads = [];
		
		heads.push('<!doctype html>');
		heads.push('<html lang="en">');
		heads.push('<head>');
		heads.push('<meta charset="UTF-8">');
		heads.push('<title>이미지 뷰어 인쇄 지원</title>');
		heads.push('<style type="text/css" media="print">');
		heads.push('body,html{width:100%;height:100%; margin: 0;}');
		heads.push('#print,.print,.print>div{width:100%;height:100%}');
		heads.push('@page{size:A4 portrait!important;orientation:portrait}');
		heads.push('#loading{display:none}');
		heads.push('.print{position:relative;margin:0;padding:0;text-align:center;');
		heads.push('page-break-after:always;');
		heads.push('}');
		heads.push('img{position:absolute;top:0;bottom:0;left:0;right:0;margin:auto;max-width:100%!important;max-height:100%!important}');
		heads.push('</style>');
		heads.push('<script>');
		heads.push('function loadedPage(){');
		heads.push('loadImages(function(){');
		heads.push('parent.AbImageViewer$$doPrint();');
		heads.push('setTimeout(endPrint, 500);');
		heads.push('});');
		heads.push('}');
		
		heads.push('function loadImage(index, url, callback){');
		heads.push('var img = new Image();');
		//heads.push('img.crossOrigin = \'Anonymous\';');
		heads.push('img.onload = function(e){');
		heads.push('setTimeout(callback.bind(null, true, index, this), 0);');
		heads.push('};');
		heads.push('img.onerror = function(e){');
		heads.push('setTimeout(callback.bind(null, false, index, new Error(\'[PRINT-IMAGE][\'+index+\'] It is not an image file\')), 0);');
		heads.push('};');
		heads.push('img.src = url;');
		heads.push('}');
		
		heads.push('function endPrint(){');
		heads.push('setTimeout(function(){');
		heads.push('console.log(\'[PRINT] clear printed data...\');');
		heads.push('document.body.innerHTML=\'\';');
		heads.push('parent.AbImageViewer$$endPrint(\''+id+'\');');
		heads.push(' }, 500);');
		heads.push('}');
		
		heads.push('function loadImages(callback){');
		heads.push('var called = 0, total = ' + imageUrls.length + ';');
		heads.push('');
		heads.push('var func = function(success, index, r){');
		heads.push('called++;');
		heads.push('if (success === true){');
		heads.push('var cover = document.getElementById("PIMG_" + index)');
		//heads.push('console.log("[VPRINT] APPEND " + index);');
		heads.push('cover.appendChild(r);');
		heads.push('}else{');
		heads.push('console.log(r);');
		heads.push('}');
		heads.push('if (called >= total)');
		heads.push('callback();');
		heads.push('}');
		heads.push('');
		
		for (var i=0; i < imageUrls.length; i++){
			var url = imageUrls[i];
			
			heads.push('loadImage('+i+', "' + url + '", func);');
		}
		
		heads.push('}');
		heads.push('</script>');
		heads.push('</head>');
		
		heads.push('<body onload="loadedPage();" ');
		
		//heads.push('<body onload="parent.AbImageViewer$$doPrint()" ');
		
//		heads.push(' onafterprint="setTimeout(function(){ ');
//		heads.push('console.log(\'[PRINT] clear printed data...\');');
//		heads.push('document.body.innerHTML=\'\';');
//		heads.push('parent.AbImageViewer$$endPrint(\''+id+'\');');
//		heads.push(' }, 100);"');
		
		heads.push('>');
		
		var htmls = [];
		
		htmls.push(heads.join('\n'));
		//htmls.push(AbPrint.generateHtml(imageUrls, '<div id="print">', '</div>'));
		htmls.push(AbPrint.generateCoverHtml(imageUrls, 'PIMG_', '<div id="print">', '</div>'));
		htmls.push('</body>');
		htmls.push('</html>');
		
		//-----------------------------------------------------------
	
		pf.document.open();
		pf.document.write(htmls.join(''));
		pf.document.close();
		
		console.log('[PRINT] OK!!');
		//console.log(htmls.join('\n'));		
	},
	
	//-----------------------------------------------------------

	/**
	 * 모든 이미지 또는 선택된 이미지들의 도형들을 제거합니다.
	 */
	clearShapes: function(){
		// 체크된 페이지 또는 전체 페이지 수집
		var a = this.selectedPages();
		var collectType = 'main';
		if (!a.length){
			collectType = 'all';

			var numPages = this.images.length();
			for (var i=0; i < numPages; i++){
				var page = this.images.get(i);
	
				if (page.mediaType !== 'image')
					continue;

				a.push(page);
			}	
		}

		// 도형 또는 도형 정의 XML이 있는 페이지 및 서브 페이지 수집
		var ps = [], tmps = [];
		var existShapes = false;
		var numPages = a.length;
		for (var i=0; i < numPages; i++){
			var page = a[i];
			var exists = false;

			if (page.editable()){
				// 로드된 페이지 수집
				if (page.hasSubPages()){
					// 서브 페이지가 있는 페이지 수집
					var numSubPages = page.subPages.length();
					for (var j=0; j < numSubPages; j++){
						var subPage = page.subPages.get(j);
						var existSub = false;
						
						if (subPage.editable()){
							// 로드된 서브 페이지 수집
							if (subPage.hasShapes()) existSub = true;
						}else{
							// 로드되지 않은 서브 페이지 수집
							if (subPage.hasXmlShapes()){
								existSub = true;
								
								// 로드 함수 추가
								var promiseCallback = function (resolve, reject){
									var index = arguments.callee.index;
									var page = arguments.callee.page;
									var self = arguments.callee.self;
									
									self.loadSubPage({
										index: j,
										page: subPage,									
									})
										.then(function(){
											resolve(index);
										}.bind(self))
										.catch(function(e){
											reject(e);
										}.bind(self));
								};
								promiseCallback.index = j;
								promiseCallback.page = subPage;
								promiseCallback.self = this;
								
								ps.push(new Promise(promiseCallback));
							}
						}
						
						if (existSub) exists = true;
					}
				}else{
					// 단일 페이지 수집
					if (page.hasShapes())
						exists = true;
				}
			}else{
				// 로드되지 않은 페이지 수집
				var index = this.images.indexOf(page.uid);

				// 로드 함수 추가
				var promiseMainCallback = function (resolve, reject){
					var index = arguments.callee.index;
					var page = arguments.callee.page;
					var self = arguments.callee.self;
					
					self.loadPage({
						index: j,
						page: page,									
					})
						.then(function(){
							resolve(index);
						}.bind(self))
						.catch(function(e){
							reject(e);
						}.bind(self));
				};
				promiseMainCallback.index = index;
				promiseMainCallback.page = page;
				promiseMainCallback.self = this;

				// 도형 정의 XML 문자열이 있으면 로드 함수 추가
				if (page.hasXmlShapes()){
					ps.push(new Promise(promiseMainCallback));
					exists = true;
				}

				if (page.hasSubPages()){
					// 서브 페이지가 있는 페이지 수집
					var added = false;
					var numSubPages = page.subPages.length();
					for (var j=0; j < numSubPages; j++){
						var subPage = page.subPages.get(j);
						var existSub = false;
						
						// 도형 정의 XML 문자열이 있으면
						if (subPage.hasXmlShapes()){
							existSub = true;

							// 첫 로드 함수를 추가할 경우,
							// 부모 페이지의 로드 함수도 추가
							if (!added){
								added = true;
								ps.push(new Promise(promiseMainCallback));
							}
							
							// 로드 함수 추가
							var promiseCallback = function (resolve, reject){
								var index = arguments.callee.index;
								var page = arguments.callee.page;
								var self = arguments.callee.self;
								
								self.loadSubPage({
									index: j,
									page: subPage,									
								})
									.then(function(){
										resolve(index);
									}.bind(self))
									.catch(function(e){
										reject(e);
									}.bind(self));
							};
							promiseCallback.index = j;
							promiseCallback.page = subPage;
							promiseCallback.self = this;
							
							ps.push(new Promise(promiseCallback));
						}
						
						if (existSub) exists = true;
					}
				}
			}

			if (exists) existShapes = true;
		}

		//-----------------------------------------------------------

		// 도형 또는 도형 정의 XML 문자열이 없으면 수행 종료
		if (!existShapes)
			return;

		//-----------------------------------------------------------

		var isAll = false;
		if (collectType == 'all'){
			msg = '모든 이미지의 주석/마스킹을 삭제하시겠습니까?';
			isAll = true;
		}else{
			msg = '선택한 이미지의 주석/마스킹을 삭제하시겠습니까?';
		}

		//-----------------------------------------------------------

		AbMsgBox.confirm(msg, null, 'warn')
			.then(function(r){
				if (r == 'ok' && ps.length){
					var loader = $('#file-loading');
					loader.attr('pl-topic', 'proc');

					var view = loader.find('.pl-loading');
					var bar = view.find('.bar');

					bar.css('width', '0%');

					var prog = {
						view: view,
						bar: bar
					};

					var progressCallback = function (cur, max){
						var per = cur / max * 100;
		
						prog.bar.css('width', per.toFixed(1) + '%');				
					};

					loader.show();
				
					return new Promise(function(resolve, reject){
						AbCommon.sequencePromiseAll(ps, progressCallback, { term: { progress: 10, promise: 10 } })
							.then(function (){
								loader.hide();

								resolve(r);
							})
							.catch(function(e){
								loader.hide();

								console.log(e);
								AbMsgBox.error(e);
	
								resolve('cancel');
							});
					});
				}else{
					return r;
				}
			}.bind(this))
			.then(function (r){
				var callback = function(pageInfos){
					if (pageInfos){
						for (var i=0; i < pageInfos.length; i++){
							var pageInfo = pageInfos[i];
							//console.log('[CLEAR][SHAPES][' + pageInfo.index + ']');

							if (pageInfo.ownerPage){
								if (pageInfo.page.editable())
									this.renderThumbnail(pageInfo.page, {
										topicPrefix: 'sub.',
										refSub: pageInfo.index === 0,
									});
							}else{
								if (pageInfo.page.editable())
									this.renderThumbnail(pageInfo.page);
							}
							
						}
					}
				}.bind(this);
				
				if (r == 'ok'){
					if (isAll)
						this.engine.removeAllPageShapes({
							end: callback
						});
					else
						this.engine.removeRangePageShapes(collect.pages, {
							end: callback
						});
				}
			}.bind(this));

	},

	//-----------------------------------------------------------
	
	/**
	 * 페이지를 섬네일 이미지로 렌더링합니다.
	 * <p>* 완료 후 modified가 Notify 됩니다.
	 * @param {AbPage} page {@link AbPage|페이지} 인스턴스
	 * @param {Object} [options] 수행 옵션
	 * @param {String} [options.topicNotify] notify 토픽명 접두사
	 * @param {String} [options.refSub] 해당 서브 페이지가 참조 페이지인지 여부
	 */
	renderThumbnail: function(page, options){
		if (!options) options = {};

		var topicPrefix = AbCommon.isString(options.topicPrefix) ? options.topicPrefix : '';
		var refSub = AbCommon.isBool(options.refSub) ? options.refSub : false;

		this.engine.renderThumbnail(this.thumbnailGenerator, page);

		var decoder = page.decoder();

		var imgData = this.thumbnailGenerator.toImage(decoder);
		page.source.setThumbnailData(imgData);

		this.notifyObservers(topicPrefix + 'modified', { uid: page.uid, data: imgData });

		if (refSub) this.notifyObservers('modified', { uid: page.uid, data: imgData });
	},

	//-----------------------------------------------------------

	/**
	 * 확대/축소 비율 간격
	 * @static
	 * @type {Number}
	 * @default
	 */
	ZOOM_STEP: 0.3,

	/**
	 * 이미지를 확대/축소합니다.
	 * @param {String} value (in|out)
	 */
	zoom: function (value){
		var scale = this.engine.scale();
		var step = 0;

		if (value == 'in'){
			step = 1+this.ZOOM_STEP;
		}else if (value == 'out'){
			step = 1-this.ZOOM_STEP;
		}

		if (step){
			scale *= step;
				
			if (scale < AbViewerEngine.prototype.MIN_SCALE) scale = AbViewerEngine.prototype.MIN_SCALE;
			else if (scale > AbViewerEngine.prototype.MAX_SCALE) scale = AbViewerEngine.prototype.MAX_SCALE;

			if (scale != this.engine.scale())
				this.engine.scale(scale);
		}
	},

	//-----------------------------------------------------------

	/**
	 * 북마크를 설정합니다.
	 * @param {...Number} args 페이지 인덱스
	 * @return {Promise} Promise 객체
	 */
	addBookmark: function (){
		var a = Array.prototype.slice.call(arguments);
		
		return new Promise(function(resolve, reject){
			this.exec(function (){
				var siz = a.length;
				for (var i=0; i < siz; i++){
					var index = a[i];
					var page = this.images.get(index);
					if (!page)
						continue;

					this.bookmarks.push(page);
	
					this.notifyObservers('bookmark.add', page.uid);

					if (page.status == AbPage.prototype.LOADED)
						this.bookmarkListView.notify('page.loaded', { index: index, page: page });
				}

				resolve(siz);
			});
		}.bind(this));
	},

	//-----------------------------------------------------------
	
	/**
	 * 이미지 목록을 로드합니다.
	 * @param {String} id 이미지 목록 아이디
	 * @return {Promise} Promise 객체
	 */
	openImages: function (id){
		var loader = AbLoading.get({
			text: '이미지들을 불러오는 중입니다...',
		});
		loader.show();
		
		var viewer = this;
		
		return new Promise(function(resolve, reject){
			AbCommon.ajax({
				caller: viewer,
				title: '이미지 열기',
				url: viewer.URLS.OPEN,
				data: {
					id: id,
				},
				
				success: function (r){
					viewer._requestParam = id;
					
					var promise = null;
					var images = r && r.images && $.isArray(r.images) ? r.images : [];
					var bookmarks = r && r.bookmarks && $.isArray(r.bookmarks) ? r.bookmarks : [];
					
					if (images.length){
						promise = viewer.addImages(images);
					}else{
						promise = Promise.resolve(0);
					}
					
					promise.then(function(aps){
						// 북마크 등록
						// - aps: 추가된 페이지 목록 ({ index:Number, page:AbPage })
						if (aps && aps.length && bookmarks.length){
							var len = bookmarks.length;
							for (var i=0; i < len; i++){
								var d = aps[bookmarks[i]];

								this.bookmarks.push(d.page);
								
								this.notifyObservers('bookmark.add', d.page.uid);

								if (d.page.status == AbPage.prototype.LOADED)
									this.bookmarkListView.notify('page.loaded', d);
							}
						}
						
						loader.hide();
						
						resolve();
					}.bind(this));
				},

				error: function (r){
					loader.hide();
					
					reject(r);
				},
			});
		});
	},

	//-----------------------------------------------------------
	
	/**
	 * 이벤트 리스너를 추가합니다.
	 * @param {String} name 이벤트명("*"를 사용 시 모든 이벤트를 뜻함), click|select|renderlist
	 * @param {AbImageViewer.EventListener} listener 리스너
	 */
	attachEvent: function (name, listener){
		if (!AbCommon.isFunction(listener))
			throw new Error('listener is not function');
		
		if (this.listeners[name])
			this.listeners[name].push(listener);
		else
			this.listeners[name] = [listener];
	},
	
	/**
	 * 이벤트 리스너를 제거합니다.
	 * @param {String} name 이벤트명("*"를 사용 시 모든 이벤트를 뜻함), click|select|renderlist
	 * @param {AbImageViewer.EventListener} listener 리스너
	 */
	detachEvent: function (name, listener){
		if (!AbCommon.isFunction(listener))
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
	 * 이벤트를 발생시킵니다.
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
