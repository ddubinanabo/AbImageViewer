/**
 * 이미지 뷰어 초기화 전 콜백
 * @callback AbViewController.PreInitailize
 */

 /**
 * 이미지 뷰어 초기화 후 콜백
 * @callback AbViewController.Initailize
 * @param {AbImageViewer} viewer 이미지 뷰어 인스턴스
 */

/**
 * 설정 정보
 * @typedef {Object} AbViewController.Config
 * @property {AbImageViewer.Config} viewer 이미지 뷰어 설정 정보
 * @property {AbViewController.Auth} auth 이미지 뷰어 권한 정보
 */

/**
 * 이미지 뷰어 권한 정보
 * @typedef {Object} AbViewController.Auth
 * @property {AbViewController.AuthConfig} config 권한 설정
 * @property {AbViewController.Permission} permission 계정 권한 정보
 */

/**
 * 계정 권한 정보
 * @typedef {Object} AbViewController.Permission
 * @property {Number} level 계정 권한 레벨
 * @property {Array.<AbViewController.PermissionItem>} permissions 퍼미션 배열
 * @property {Object} map 퍼미션 맵, 필드명이 아이템, 필드 값이 허용여부를 가지는 객체
 * @property {(String|Number)} value 계정 아이디 또는 계정 권한 레벨
 */

/**
 * 퍼미션 아이템
 * @typedef {Object} AbViewController.PermissionItem
 * @property {String} itm 아이템
 * @property {String} useYn 허용 여부 (Y/N)
 * @property {String} dsc 아이템 설명
 */

/**
 * 이미지 뷰어 계정 설정 정보
 * <dl>
 * 	<dt>권한 획득처</dt>
 * 	<dd>
 * 	<table>
 * 	<thead>
 * 	<tr>
 * 		<th>종류</th><th>UI 조작</th><th>설명</th>
 * 	</tr>
 * 	</thead>
 * 	<tbody>
 * 	<tr>
 * 		<td>cgi</td><td>WAS</td><td>URL의 a인자에서 획득합니다.</td>
 * 	</tr>
 * 	<tr>
 * 		<td>cookie</td><td>WAS</td><td>쿠키에서 획득합니다.</td>
 * 	</tr>
 * 	<tr>
 * 		<td>session</td><td>WAS</td><td>세션에서 획득합니다.</td>
 * 	</tr>
 * 	<tr>
 * 		<td>local-storage</td><td>Browser</td><td>window.localStorage에서 획득합니다.</td>
 * 	</tr>
 * 	<tr>
 * 		<td>session-storage</td><td>Browser</td><td>window.sessionStorage에서 획득합니다.</td>
 * 	</tr>
 * 	</tbody>
 * 	</table>
 * 	</dd>
 * 	<dt>권한 정보 타입</dt>
 * 	<dd>
 * 	<table>
 * 	<thead>
 * 	<tr>
 * 		<th>종류</th><th>설명</th>
 * 	</tr>
 * 	</thead>
 * 	<tbody>
 * 	<tr>
 * 		<td>id</td><td>계정 아이디</td>
 * 	</tr>
 * 	<tr>
 * 		<td>level</td><td>계정의 레벨</td>
 * 	</tr>
 * 	</tbody>
 * 	</table>
 * 	</dd>
 * </dl>
 * @typedef {Object} AbViewController.AuthConfig (edit=편집모드/view=보기모드)
 * @property {Boolean} enabled 권한 사용 여부
 * @property {Object} account 권한 정보의 획득 방법 설정
 * @property {String} account.source 권한 획득처 (cgi|local-storage|session-storage|cookie|session)
 * @property {String} account.field 권한 획득시 필드명 (source가 cgi면 제외)
 * @property {String} account.type 획득된 권한 정보 타입 (id/level)
 */

/**
 * 페이지 로드 되면 실행
 */
$(function(){
	AbViewController.initialize()
		.then(function(){
		})
		.catch(function(e){
			console.log('[이미지 뷰어 초기화 오류]');
			console.log(e);
			
			AbMsgBox.errorHtml('엔진 준비 중 오류가 발생했습니다<br/>페이지를 다시 로드해주세요');
		});
});

//-----------------------------------------------------------
//-----------------------------------------------------------
//-----------------------------------------------------------

/**
 * 이미지 뷰어 초기화 도구
 * @namespace AbViewController
 */
var AbViewController = {

	/**
	 * 서버 개발 옵션
	 * @memberof AbViewController
	 * @private
	 * @const
	 * @type {Boolean}
	 * @default false
	 */
	SERVER_ACCESS: true,

	/**
	 * 이미지 뷰어 인스턴스, 자동으로 설정된다
	 * @static
	 * @type AbImageViewer
	 */
	imageViewer: null,
	
	//-----------------------------------------------------------

	/**
	 * 초기화 작업 전 호출됩니다. 본 소스를 수정하지 않고 서버 URL 등을 변경해야 할 경우 사용하세요.
	 * @static
	 * @type {AbViewController.PreInitailize}
	 */

	onPreInitailize: null,
	
	/**
	 * 초기화 작업 완료 후 호출됩니다.
	 * @static
	 * @type {AbViewController.Initailize}
	 */
	onInitailize: null,
	
	//-----------------------------------------------------------
	
	/**
	 * 이미지 뷰어 초기화 작업을 진행합니다.
	 * <ol>
	 * 	<li>initServerUrls()
	 * 	<li>onPreInitailize()
	 * 	<li>loadConfig()
	 * 	<li>prepare()
	 * 	<li>initImageViewer()
	 * 	<li>loadedImageViewer()
	 * 	<li>onInitailize()
	 * </ol>
	 */
	initialize: function (){
		this.initServerUrls();
		
		// 환경 초기화
		this.initEnvironment();
		
		if (AbCommon.isFunction(this.onPreInitailize))
			this.onPreInitailize();
		
		return this.loadConfig()
			.then(function(r){
				return this.prepare(r);				
			}.bind(this))
			.then(function(r){
				// 이미지 뷰어 초기화
				return this.initImageViewer(r)
					.then(function(){
						if (AbCommon.isFunction(this.onInitailize))
							this.onInitailize(this.imageViewer);
					}.bind(this));
			}.bind(this));
	},
	
	//-----------------------------------------------------------
	
	/**
	 * 서버 URL 관련 세팅
	 * <p>변경이 필요한 경우 사용하세요
	 */
	initServerUrls: function(){

		//var host = 'http://localhost:8084/wiv/';
		var host = '';
		var resourcePath = AbViewController.SERVER_ACCESS ? 'resources/' : '';

		//-----------------------------------------------------------
		// HTML5 웹 워커 실행 경로
		
		AbVendor.executePath = host + resourcePath + AbVendor.executePath;
		AbImageLoader.executePath = host + resourcePath + AbImageLoader.executePath;

		//-----------------------------------------------------------
		// WAS 문서 컨버터의 웹메서드 URL 정보

		AbImageLoader.URLS.CONVERTER = 'api/doc';

		//-----------------------------------------------------------
		// WAS 이미지 저장 웹메서드 URL 정보

		AbImageViewer.prototype.URLS.CONFIG = host + 'api/config';
		AbImageViewer.prototype.URLS.PERMISSION = host + 'api/permission';
		
		AbImageViewer.prototype.URLS.OPEN = host + 'api/images';
		
		AbImageViewer.prototype.URLS.SAVE.ALLOC = host + 'api/alloc'; // 신규 등록 아이디 할당
		AbImageViewer.prototype.URLS.SAVE.MODIFY = host + 'api/modify-prepare'; // 수정 준비 작업
		
		AbImageViewer.prototype.URLS.SAVE.IMAGE = host + 'api/save-image'; // 각 이미지 및 관련 정보 분할 등록
		AbImageViewer.prototype.URLS.SAVE.REMOVE = host + 'api/remove'; // 전송 중 오류 시 삭제
		AbImageViewer.prototype.URLS.SAVE.COMPLETED = host + 'api/save-completed'; // 이미지 등록 완료 

		//-----------------------------------------------------------
		// WAS 인쇄지원 웹메서드 URL 정보
		
		AbImageViewer.prototype.URLS.PRINT.ALLOC = host + 'api/print-support/alloc';
		AbImageViewer.prototype.URLS.PRINT.IMAGE = host + 'api/print-support/save';
		AbImageViewer.prototype.URLS.PRINT.REMOVE = host + 'api/print-support/remove';
		AbImageViewer.prototype.URLS.PRINT.DOWNLOAD = host + 'print-support/img';		

		//-----------------------------------------------------------
		// WAS 인터페이스 URL 정보

		iAbViewer.URLS.FOLDER = host + iAbViewer.URLS.FOLDER;
		iAbViewer.URLS.FILE = host + iAbViewer.URLS.FILE;
		iAbViewer.URLS.FILE_EX = host + iAbViewer.URLS.FILE_EX;
	},
		
	/**
	 * 이미지 뷰어 환경 초기화
	 */
	initEnvironment: function(){
		//-----------------------------------------------------------
		// HTML5 웹 워커 활성화 처리
		//-----------------------------------------------------------
		// IE Web Worker에 불안정한 부분을 발견하여 IE에서는 Web Worker를 비활성화합니다.
		// - 사이즈가 큰 이미지를 로컬에서 50장 이상 부른 뒤 전체 인쇄를 하면,
		//   이미지 로드 중 먹통이 되는 현상이 있습니다.

		if (AbCommon.ieVersion() != -1)
			AbCommon.ENABLE_WEB_WORKER = true;

		//-----------------------------------------------------------
		// 이미지 전송 시 병렬 처리 개수
		
		AbImageViewer.prototype.PARALLELS = 3;

		//-----------------------------------------------------------
		// 이미지 전송 작업
		// : 작업 내역을 설정할 수 있습니다.
		//   이 값을 수정한다면, WAS에도 반영해야 합니다. (com.abrain.wiv.api.ApiController)
		//
		// - image: (필수) 이미지 정보를 이미지 크기 및 도형 정보와 렌더링 타입 등을 전송합니다.
		// - thumb: (필수) 섬네일을 전송합니다.
		// - image-source: 이미지를 전송합니다.
		// - image-result: 도형 및 워터마크가 표시된 이미지를 전송합니다.
		
		// AbImageViewer.prototype.IMAGE_TYPES = [ 'image', 'image-source', 'image-result', 'thumb' ];

		//-----------------------------------------------------------
		// 이미지 퀄리티 조정 (기본값: 없음) (JPEG만 해당)
		// - 0.0에서 1.0까지의 범위
		// - 크롬의 기본값은 0.92
		// - 이 값을 올릴수록 이미지의 용량이 증가합니다.
		
		//AbGraphics.canvas.IMAGE_QUALITY = 1;

		//-----------------------------------------------------------
		// 이미지 전송 시 분할 사이즈
		// : 전송이 너무 느리다 싶으면 이 사이즈와 병렬 처리 개수를 더 늘리세요
		//
		// - 기본값은 30KB
		
		AbImageViewer.prototype.SPLIT_DATA_SIZE = 307200;
	},
	
	/**
	 * 이미지 뷰어 옵션 로드
	 */
	loadConfig: function(){
		var loader = AbLoading.get({
			text: '환경설정을 불러오는 중입니다...',
		});
		loader.show();
		
		var paramA = $('#param-a').val();
		
		var self = this;
		
		return new Promise(function(resolve, reject){
			if (AbViewController.SERVER_ACCESS){
				AbCommon.ajax({
					caller: self,
					title: '서버 옵션 로드',
					url: AbImageViewer.prototype.URLS.CONFIG,
					data: {
						a: paramA
					},
					
					success: function (r){
						loader.hide();
						resolve(r);
					},
	
					error: function (r){
						loader.hide();
						reject(r);
					},
				});	
			}else{
				loader.hide();
				resolve({
					"viewer": {
						"mode": "edit",
						"waterMark": {
						  "image": "img/watermark.png"
						},
						"image": {
						  "save": "all",
						  "storage": {
							"type": "db",
							"path": "C:\\Users\\Administrator\\Desktop\\AB_DOC"
						  },
						  "local-save-limit": 0
						},
						"toolbar": {
						  "layout": [
							"all",
						  ]
						},
						"shape": {
						  "save": "all",
						  "addUI": "toolbar",
						  "selection": {
							"style": "box",
							"target": [
							  "rectangle",
							  "ellipse",
							  //"arrow",
							  "pen",
							  "polygon",
							  "masking.rectangle",
							  "masking.ellipse"
							],
							"lineDrawStyle": "path"
						  },
						  "local-save-limit": 0
						}
					  },
					  "auth": {
						"config": {
						  "enabled": false,
						  "account": {
							"source": "cgi",
							"field": "ab_usr_id",
							"type": "id"
						  }
						},
						"permission": null
					  }
				});	
			}
		});
	},
	
	/**
	 * 이미지 뷰어 레이아웃 설정 등의 준비 작업
	 * @param {AbViewController.Config} config 설정 정보
	 * @return {Promise} Promise 객체
	 */
	prepare: function (config){
		var promise = null;
		var pm = {
			level: -99,
			permissions: [],
			value: null,
		};

		var layoutConfig = config && config.viewer && config.viewer.toolbar ? config.viewer.toolbar.layout : 'all';
		if (layoutConfig !== 'all')
			this.setLayout(layoutConfig);
		
		if (config && config.auth && config.auth.config.enabled === true){
			var local = config.auth.config.account.source === 'local-storage';
			var session = config.auth.config.account.source === 'session-storage';
			
			if (local || session){
				var value = null;
				
				if (session)
					value = sessionStorage.getItem(config.auth.config.account.field);
				else if (local)
					value = localStorage.getItem(config.auth.config.account.field);
				
				if (value){
					promise = this.loadPermissions(value)
						.then(function(r){
							config.auth.permission = r;
							config.auth.permission.map = this.permissionMap(config.auth.permission);
							
							this.setLayoutByPermission(config.auth.permission);						
							return config;
						}.bind(this));
				}else{
					pm.map = {};
					config.auth.permission = pm;
					
					this.setLayoutByPermission(config.auth.permission);
				}
			}else{
				pm.map = this.permissionMap(config.auth.permission);
				config.auth.permission = pm;
			}
		}
		
		if (!promise)
			promise = Promise.resolve(config);
		
		return promise;
	},
	
	/**
	 * 퍼미션 배열을 맵으로 변환
	 * @param {Array.<AbViewController.PermissionItem>} permission 퍼미션 목록
	 * @return {Object} 퍼미션 맵
	 */
	permissionMap: function(permission){
		var numPermission = permission && permission.permissions ? permission.permissions.length : 0;
		if (!numPermission)
			return null;
		
		var map = {};
		for (var i=0; i < numPermission; i++){
			var p = permission.permissions[i];
			map[p.itm] = p.useYn === 'Y';
		}
		return map;
	},
	
	/**
	 * 레이아웃 옵션에 따라 레이아웃 설정
	 * @param {Array.<String>} layoutConfig 레이아웃 옵션
	 */
	setLayout: function (layoutConfig){
		var layouts = $('[ab-layout]');
		var numLayouts = layouts.length;
		for (var i=0; i < numLayouts; i++){
			var he = layouts.get(i);
			var e = $(he);
			
			var layout = e.attr('ab-layout');

			var accept = false;
			
			var topics = layout.trim().split(/\s*,\s*/g);
			var numTopics = topics.length;
			for (var j=0; j < numTopics; j++){
				var item = topics[j];
				
				if ($.inArray(item, layoutConfig) >= 0){
					accept = true;
					break;
				}
			}

			if (!accept)
				e.detach();
		}
	},
	
	/**
	 * 퍼미션에 따라 레이아웃 설정
	 * @param {AbViewController.Permission} permission 서버에서 다운받은 퍼미션 객체
	 */
	setLayoutByPermission: function (permission){
		var level = permission ? permission.level : -1;
		var map = permission && permission.map ? permission.map : {};
		
		if (level == 0)
			return;
		
		var perms = $('[ab-perm],[tb-topic]');
		var numPerms = perms.length;
		for (var i=0; i < numPerms; i++){
			var he = perms.get(i);
			var e = $(he);
			
			var topic = e.attr('tb-topic');
			var perm = e.attr('ab-perm');
			
			var accept = false;
			
			if (topic){
				accept = map[topic] === true;
			}else if (perm){
				var topics = perm.trim().split(/\s*,\s*/g);
				var numTopics = topics.length;
				for (var j=0; j < numTopics; j++){
					var item = topics[j];
					
					if (map[item] === true){
						accept = true;
						break;
					}
				}
			}
			
			if (!accept)
				e.detach();
		}
	},
	
	/**
	 * 권한 정보에 대한 퍼미션 목록 로드
	 * @param {String} value 권한 정보
	 * @return {Promise} Promise 객체
	 */
	loadPermissions: function(value){
		if (!value)
			return Promise.resolve();
		
		var loader = AbLoading.get({
			text: '권한 정보를 불러오는 중입니다...',
		});
		loader.show();
		
		var self = this;
		
		return new Promise(function(resolve, reject){
			if (AbViewController.SERVER_ACCESS){
				AbCommon.ajax({
					caller: self,
					title: '권한 정보 로드',
					url: AbImageViewer.prototype.URLS.PERMISSION,
					data: {
						value: value,
					},
					
					success: function (r){
						loader.hide();
						resolve(r);
					},
	
					error: function (r){
						loader.hide();
						reject(r);
					},
				});
			}else{
				loader.hide();
				resolve(null);	
			}
		});
	},
	
	/**
	 * 이미지 뷰어 초기화
	 * @param {AbViewController.Config} config 설정 정보
	 * @return {Promise} Promise 객체
	 */
	initImageViewer: function (config){
		var GAP = 2;

		var imageViewer = new AbImageViewer({
			margin: { left: GAP, top: GAP, right: GAP, bottom: GAP },
			config: config ? config.viewer : null,
			permission: {
				auth: config ? config.auth : null,
				
				check: function (topic){
					var config = this.auth ? this.auth.config : null;
					
					if (config.enabled !== true)
						return true;
					
					var permission = this.auth ? this.auth.permission : null;
					var level = permission ? permission.level : -1;
					var map = permission && permission.map ? permission.map : {};

					if (level === 0)
						return true;
					
					return map.hasOwnProperty(topic) && map[topic] === true;
				},
			},
			//animate: false,
			//notifySelectPage: true,
		});
		
		if (typeof iAbViewer != 'undefined')
			iAbViewer.regist(imageViewer);
		
		this.imageViewer = imageViewer;
		
		var waterMarkImageUrl =
			config && config.viewer && config.viewer.waterMark && config.viewer.waterMark.image ?
					$.trim(config.viewer.waterMark.image) : null;
		
		var promise = null;
		// 이미지 URL 사용
		if (waterMarkImageUrl)
			promise = imageViewer.waterMark.image(waterMarkImageUrl);
		else
			promise = Promise.resolve();

		// HTMLImageElement 사용
		// var wimg = $('<img/>');
		// wimg.attr('src', waterMarkImageUrl);		
		// promise = imageViewer.waterMark.image(wimg.get(0));

		// Image 객체 사용
		// var wimg = new Image();
		// wimg.src = waterMarkImageUrl;
		// promise = imageViewer.waterMark.image(wimg);

		// AbImage 객체 사용
		// var wimg = new AbImage({ image: waterMarkImageUrl });
		// promise = imageViewer.waterMark.image(wimg);

		// imageViewer.waterMark.text('참 잘했어요');
		// promise = Promise.resolve();
		
		return promise.then(function(){
			//-----------------------------------------------------------
			// 이미지 뷰어 초기화 작업
			//-----------------------------------------------------------

			return imageViewer.install()
				.then(function (){
					return this.loadedImageViewer();
				}.bind(this));
		}.bind(this));
	},
	
	/**
	 *  이미지 뷰어가 준비 완료되면 호출되는 함수
	 *  <p>초기화 완료 후 진행해야 할 작업을 수행하세요
	 */
	loadedImageViewer: function(){
		//-----------------------------------------------------------
		// 세션 유지
		//-----------------------------------------------------------
		
		if (AbViewController.SERVER_ACCESS)
			AbNoop.exec();

		//-----------------------------------------------------------
		// 샘플 이미지 로드
		//-----------------------------------------------------------

		//sampleImage.bind(this)(0);
			
		//-----------------------------------------------------------
		// 인자값 처리
		//-----------------------------------------------------------
		
		var paramId = $('#param-id').val();
		if (paramId){
			return this.imageViewer.openImages(paramId);
		}else{
			return Promise.resolve();
		}
	},
};

function sampleImage(index){
	var urls = [
		'sample/sample1.png',
		//'sample/sample2.jpg',
		'sample/sample0.jpg',
	];

	var url = urls[index];

	this.imageViewer.addImages(urls);

	//-----------------------------------------------------------

	setTimeout(function(){
		this.engine.addShape(new AbShapePolygon({
			x: 133.02988505747126, y: 116.72720306513409, width: 167.59157088122603, height: 116.0750957854406,
			points: [{ x: 11.08582375478926, y: 43.6911877394636 }, { x: 92.59923371647508, y: 0 }, { x: 167.59157088122603, y: 64.55862068965516 }, { x: 95.20766283524904, y: 116.0750957854406 }, { x: 0, y: 93.90344827586208 }, { x: 18.25900383141763, y: 67.16704980842911 }, { x: 84.77394636015325, y: 87.3823754789272 }, { x: 115.42298850574713, y: 62.6022988505747 }, { x: 86.07816091954021, y: 31.30114942528735 }, { x: 41.082758620689646, y: 54.77701149425286 },]
		}));
		//this.engine.addShape(new AbShapeMemoPad({ source: AbIcons.MEMOPAD, x: 77.91318074191003, y: 298.21941594317286, width: 48, height: 48, }));
		this.engine.addShape(new AbShapeRectangle({
			x: 173.28966061562747, y: 422.8492501973165, width: 193.43962115232833, height: 80.59984214680344
		}));

		this.engine.createShape('memopad', {
			x: 77.91318074191003, y: 298.21941594317286, width: 133, height: 86,
			style: {
				color: '#99CFFF',
			},
			text: '테스트입니다.\n이 얼간이야!!'
		}, function(s){
			s.prepare();
			this.engine.addShape(s);
			this.engine.render();

			var page = this.engine.currentPage;
			this.renderThumbnail(page);

		}.bind(this));

		// this.engine.createShape('memopad', { x: 77.91318074191003, y: 298.21941594317286 }, function(s){
		// 	s.prepare();
		// 	this.engine.addShape(s);

		// 	this.engine.render();

		// 	var page = this.engine.currentPage;
		// 	this.renderThumbnail(page);

		// }.bind(this));
	}.bind(this.imageViewer), 500);
}
