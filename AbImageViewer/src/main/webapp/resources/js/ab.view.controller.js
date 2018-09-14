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

var AbViewController = {
		
	imageViewer: null,
	
	//-----------------------------------------------------------

	/**
	 * 초기화 작업 전 호출됩니다. 본 소스를 수정하지 않고 서버 URL 등을 변경해야 할 경우 사용하세요.
	 * function ()
	 */
	onPreInitailize: null,
	
	/**
	 * 초기화 작업 완료 후 호출됩니다.
	 * function (viewer)
	 */
	onInitailize: null,
	
	//-----------------------------------------------------------
	
	initialize: function (){
		this.initServerUrls();
		
		// 환경 초기화
		this.initEnvironment();
		
		if (AbCommon.isFunction(this.onPreInitailize))
			this.onPreInitailize();
		
		return this.loadConfig()
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
	 */
	initServerUrls: function(){

		//-----------------------------------------------------------
		// HTML5 웹 워커 실행 경로
		
		AbVendor.executePath = 'resources/' + AbVendor.executePath;
		AbImageLoader.executePath = 'resources/' + AbImageLoader.executePath;

		//-----------------------------------------------------------
		// WAS 문서 컨버터의 웹메서드 URL 정보

		AbImageLoader.URLS.CONVERTER = 'api/doc';

		//-----------------------------------------------------------
		// WAS 이미지 저장 웹메서드 URL 정보

		AbImageViewer.prototype.URLS.CONFIG = 'api/config';
		AbImageViewer.prototype.URLS.OPEN = 'api/images';
		
		AbImageViewer.prototype.URLS.SAVE.ALLOC = 'api/alloc'; // 신규 등록 아이디 할당
		AbImageViewer.prototype.URLS.SAVE.MODIFY = 'api/modify-prepare'; // 수정 준비 작업
		
		AbImageViewer.prototype.URLS.SAVE.IMAGE = 'api/save-image'; // 각 이미지 및 관련 정보 분할 등록
		AbImageViewer.prototype.URLS.SAVE.REMOVE = 'api/remove'; // 전송 중 오류 시 삭제
		AbImageViewer.prototype.URLS.SAVE.COMPLETED = 'api/save-completed'; // 이미지 등록 완료 

		//-----------------------------------------------------------
		// WAS 인쇄지원 웹메서드 URL 정보
		
		AbImageViewer.prototype.URLS.PRINT.ALLOC = 'api/print-support/alloc';
		AbImageViewer.prototype.URLS.PRINT.IMAGE = 'api/print-support/save';
		AbImageViewer.prototype.URLS.PRINT.REMOVE = 'api/print-support/remove';
		AbImageViewer.prototype.URLS.PRINT.DOWNLOAD = 'print-support/img';		
	},
		
	/**
	 * 환경 초기화
	 */
	initEnvironment: function(){
		//-----------------------------------------------------------
		// HTML5 웹 워커 활성화 처리
		//-----------------------------------------------------------
		// IE Web Worker에 불안정한 부분을 발견하여 IE에서는 Web Worker를 비활성화합니다.
		// - 사이즈가 큰 이미지를 로컬에서 50장 이상 부른 뒤 전체 인쇄를 하면,
		//   이미지 로드 중 먹통이 되는 현상이 있습니다.

		if (AbCommon.ieVersion() != -1)
			AbCommon.ENABLE_WEB_WORKER = false;

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
	
	loadConfig: function(){
		var loader = AbLoading.get({
			text: '환경설정을 불러오는 중입니다...',
		});
		loader.show();
		
		var self = this;
		
		return new Promise(function(resolve, reject){
			AbCommon.ajax({
				caller: self,
				title: '서버 옵션 로드',
				url: AbImageViewer.prototype.URLS.CONFIG,
				
				success: function (r){
					loader.hide();
					resolve(r);
				},

				error: function (r){
					loader.hide();
					reject(r);
				},
			});
		});
	},
	
	/**
	 * 이미지 뷰어 초기화
	 */
	initImageViewer: function (viewerConfig){
		var config = viewerConfig || {};
		var GAP = 2;

		var imageViewer = new AbImageViewer({
			margin: { left: GAP, top: GAP, right: GAP, bottom: GAP },
			config: viewerConfig,
		});
		
		if (typeof iAbViewer != 'undefined')
			iAbViewer.regist(imageViewer);
		
		this.imageViewer = imageViewer;
		
		var waterMarkImageUrl = config && config.waterMark && config.waterMark.image ? $.trim(config.waterMark.image) : null;
		
		var promise = null;
		if (waterMarkImageUrl)
			promise = imageViewer.waterMark.image(waterMarkImageUrl);
		else
			promise = Promise.resolve();
		
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
	 */
	loadedImageViewer: function(){
		//-----------------------------------------------------------
		// 세션 유지
		//-----------------------------------------------------------
		
		AbNoop.exec();
		
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
