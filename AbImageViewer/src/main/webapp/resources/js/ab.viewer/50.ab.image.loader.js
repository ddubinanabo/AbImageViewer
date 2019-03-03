/**
 * 이미지 로드 수행 함수
 * @callback AbImageLoader.loader
 * @return {Promise} Promise 객체
 */

/**
 * 이미지 획득처
 * <dl>
 * 	<dt>local</dt><dd>로컬에서 읽은 이미지입니다.</dd>
 * 	<dt>server</dt><dd>서버에서 제공한 이미지입니디.</dd>
 * 	<dt>doc</dt><dd>로컬 문서를 서버에서 컨버팅한 이미지입니다.</dd>
 * </dl>
 * @typedef {String} AbImageLoader.From
 */

/**
 * 이미지 로더 서버 URL
 * @typedef2 {Object} AbImageLoader.URL_Table
 * @property2 {String} CONVERTER=api/doc 문서 컨버터 URL
 */

/**
 * 파일 분석 결과
 * <dl>파일 종류 별 처리
 * 	<dt>j2k</dt><dd>JPEG2000 라이브러리로 JPEG 이미지로 변환합니다.
 * <p>* 미구현</dd>
 * 	<dt>doc</dt><dd>서버로 전송해 이미지 목록으로 변환합니다.</dd>
 * 	<dt>tif</dt><dd>TIFF 라이브러리로 PNG 이미지 목록으로 변환합니다.
 * <p>* 미구현</dd>
 * 	<dt>svg</dt><dd>IE에서만 SVG 라이브러리로 PNG 이미지로 변환합니다.
 * <p>* 미구현</dd>
 * 	<dt>def</dt><dd>{@link https://developer.mozilla.org/ko/docs/Web/API/FileReader|FileReader}를 이용해 Data URL로 읽어 들입니다.</dd>
 * </dl>
 * @see {@link https://developer.mozilla.org/ko/docs/Web/API/FileReader} MDN 자료 참고
 * 
 * @typedef {Object} AbImageLoader.Result
 * @property {String} kind 파일 종류 (j2k|doc|tif|svg|def)
 * @property {String} render 렌더링 힌트 (jpeg|png)
 */

/**
 * 작업 진행 콜백 함수
 * @callback AbImageLoader.ProcCallback
 * @property {Number} total 전체 개수
 */

/**
 * 진행 중 콜백 함수
 * @callback AbImageLoader.InProgCallback
 * @property {Number} total 전체 개수
 * @property {Number} index 현재 인덱스 (0부터 시작)
 */

/**
 * 목록 획득 콜백 함수
 * @callback AbImageLoader.GetListCallback
 * @property {Server.ImageList} result 서버 이미지 목록
 * @property {AbImageLoader.GetListToken} token 목록 획득 메타데이터
 */

/**
 * 목록 획득 메타데이터
 * @typedef {Object} AbImageLoader.GetListToken
 * @property {AbImageLoader.From} from 이미지 획득처
 * @property {AbImage.Metadata} preset 기준 이미지 메타데이터
 * <p>* {@link AbImageViewer#addImages|AbImageViewer.addImages}에서 메타데이터를 작성할 때의 기준 데이터입니다.
 * @property {String} decoder 렌더링 힌트 (jpeg|png)
 */

/**
 * 이미지 로드 정보
 * @typedef {Object} AbImageLoader.LoadedImageInfo
 * @property {AbImageLoader.From} from 이미지 획득처
 * @property {AbImageLoader.Result} decoder 파일 분석 결과
 * @property {String} image 이미지 Data URL
 * @property {AbImage.Metadata} info 이미지 메타데이터
 * @property {Array.<AbImageLoader.LoadedImageInfo>} [images] 이미지 목록
 */

/**
 * 오류 콜백 함수
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/ProgressEvent} MDN 자료 참고
 * @callback AbImageLoader.ErrorCallback
 * @property {ProgressEvent} event {@link https://developer.mozilla.org/en-US/docs/Web/API/ProgressEvent|ProgressEvent} 이벤트 객체
 */

/**
 * 이미지 로더
 * @namespace
 */
var AbImageLoader = {
	/**
	 * 여러 장의 이미지가 있는 파일 목록 (tiff 등등)
	 * @memberof AbImageLoader
	 * @private
	 */
	multiImages: [],

	/**
	 * 문서 파일 목록
	 * @memberof AbImageLoader
	 * @private
	 */
	docs: [],

	/**
	 * 웹 워커 소스 경로
	 * @memberof AbImageLoader
	 * @static
	 * @default
	 */
	executePath : 'js/works/',
	/**
	 * 웹 워커 Minify 소스 사용 여부
	 * @memberof AbImageLoader
	 * @static
	 * @default
	 */
	executeMin : false,

	/**
	 * 서버 URL
	 * @memberof AbImageLoader
	 * @static
	 * @type2 {AbImageLoader.URL_Table}
	 * @type {Object}
	 * @property {String} CONVERTER=api/doc 문서 컨버터 URL
	 */
	URLS: {
		/**
		 * 문서 컨버터 URL
		 */
		CONVERTER: 'api/doc',
	},

	//-----------------------------------------------------------

	/**
	 * 웹 워커 소스 URL 경로를 가져옵니다.
	 * @memberof AbImageLoader
	 * @private
	 * @param {String} workName 웹 워커 파일 명 (.min 제외)
	 * @return {String} 웹 워커 소스 URL
	 */
	workerPath: function (workName){
		return this.executePath + workName + (this.executeMin ? '.min.js' : '.js');
	},

	//-----------------------------------------------------------

	/**
	 * 로컬 이미지를 로드합니다.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/File} MDN 자료 참고
	 * @see {@link SupportImages} 이미지 뷰어 지원 이미지 목록
	 * 
	 * @memberof AbImageLoader
	 * @param {File} data {@link https://developer.mozilla.org/en-US/docs/Web/API/File|File} 인스턴스
	 * @return {Function} 이미지 로드 함수
	 * 
	 * @example <caption>File 객체 샘플</caption>
	 * lastModified: 1466262376326
	 * lastModifiedDate: Sun Jun 19 2016 00:06:16 GMT+0900 (대한민국 표준시) (Date 객체)
	 * name: 56ab2bef0aa7d2738266.png
	 * size: 568656
	 * type: image/png
	 * webkitRelativePath: <<empty string>>
	 */
	load: function(data){
		var decoder = null;
		if (AbCommon.isFileData(data)){
			decoder = this.test(data.name, data.type);
		}else if (AbCommon.isString(data)){
			data = {
				name: data,
				type: '',
				size: 0,
			};
			decoder = this.test(data.name, data.type);
		}
		
		var makeInfo = this.makeResultInfoByFileData;
		var cloneInfo = this.cloneOriginMetadata;

		var kind = decoder ? decoder.kind : null;
		var loader = null;
		switch (kind){
		case 'doc':
			this.docs.push({ decoder: decoder, data: data});
			return null;

		case 'pdf':
			loader = this.loadPdf(true, data, decoder.render);
			return loader;

		case 'tif':
			//this.multiImages.push({ decoder: decoder, data: data});
			return null;

		case 'j2k':
			return null;
			
		case 'def':
			if (AbCommon.supportWebWorker()){
				var workerPath = this.workerPath('work.def');
				loader = function(){
					var data = arguments.callee.data;
					var decoder = arguments.callee.decoder;

					return new Promise(function (resolve, reject){
						var worker = new Worker(workerPath);

						worker.onerror = function(e){
							setTimeout(reject.bind(null, e), 0);
							worker.terminate();
						};

						worker.onmessage = function (e){
							worker.terminate();
							
							makeInfo(e.data.data, { exif: 'read' })
								.then(function(info){
									setTimeout(resolve.bind(null, { from: 'local', decoder: decoder, image: e.data.image, info: info }), 0);
								})
								.catch(function(e){
									setTimeout(reject.bind(null,e), 0);
								});
						};

						worker.postMessage(data);
					});
				};
				loader.data = data;
				loader.decoder = decoder;
			}else{
				loader = function(){
					var data = arguments.callee.data;
					var decoder = arguments.callee.decoder;

					return new Promise(function (resolve, reject){
						var reader = new FileReader();
						reader.onload = function(event){
							makeInfo(data, { exif: 'read' })
								.then(function(info){
									setTimeout(resolve.bind(null, { from: 'local', decoder: decoder, image: event.target.result, info: info }), 0);
								})
								.catch(function(e){
									setTimeout(reject.bind(null,e), 0);
								});
						};
						reader.onerror = function (e){
							reader.abort();
							setTimeout(reject.bind(null,e), 0);
						};

						reader.readAsDataURL(data);
					});
				};
				loader.data = data;
				loader.decoder = decoder;
			}

			return loader;

		case 'video':
		case 'audio':
			loader = function(){
				var data = arguments.callee.data;
				var decoder = arguments.callee.decoder;

				return new Promise(function (resolve, reject){
					var reader = new FileReader();
					reader.onload = function(event){
						makeInfo(data)
							.then(function(info){
								var r = { from: 'local', decoder: decoder, media: event.target.result, uri: null, info: info };
								r.uri = URL.createObjectURL(data);

								setTimeout(resolve.bind(null, r), 0);
							})
							.catch(function(e){
								setTimeout(reject.bind(null,e), 0);
							});
					};
					reader.onerror = function (e){
						reader.abort();
						setTimeout(reject.bind(null,e), 0);
					};

					reader.readAsArrayBuffer(data);
				});
			};
			loader.data = data;
			loader.decoder = decoder;

			return loader;
		}

		loader = function(){
			var data =  arguments.callee.data;

			return new Promise(function (resolve, reject){
				setTimeout(reject.bind(null,new Error('Not support file format')), 0);
			});
		};
		loader.data = data;

		return loader;
	},

	/**
	 * PDF 문서를 로드합니다.
	 * @param {Boolean} useObjectUrl data 인자값을 URL로 변환할 지 여부입니다.
	 * @param {(String|File)} data PDF 문서 URI 또는 {@link https://developer.mozilla.org/en-US/docs/Web/API/File|File} 인스턴스
	 * @param {(String|AbImageLoader.Result)} decoder 렌더링 힌트 또는 파일 분석 결과
	 * @param {AbImage.Metadata} info 문서 메타데이터
	 * @param {Object} [options] 옵션
	 * @param {AbImageLoader.From} [options.from=local] 문서 획득처
	 * @param {String} [options.subTexts] 페이지 표시명 목록(|로 구분)
	 * @return {Function} 이미지 로드 함수
	 */
	loadPdf: function (useObjectUrl, data, decoder, info, options){
		if (!options) options = {};
		var subTexts = options.subTexts ? options.subTexts.split('|') : null;
		var from = options.from ? options.from : null;
		
		var loader = function(){
			var data = arguments.callee.data;
			var decoder = arguments.callee.decoder;
			var info = arguments.callee.info;
			var subTexts = arguments.callee.subTexts;
			var from = arguments.callee.from;

			return new Promise(function (resolve, reject){
				try
				{									
					AbVendor.pdf(useObjectUrl ? URL.createObjectURL(data) : data, AbCommon.isString(decoder) ? decoder : decoder.render, function(pdfData){
						if (pdfData && pdfData instanceof Error){
							setTimeout(reject.bind(null,pdfData), 0);
							return;
						}

						var promise = info ? Promise.resolve(info) : AbImageLoader.makeResultInfoByFileData(data);

						promise
							.then(function(info){
								var r = null;

								if (pdfData.pages.length){
									var images = [];
									var numPages = pdfData.pages.length;
									for (var i=0; i < numPages; i++){
										var p = pdfData.pages[i];
										var subInfo = AbImageLoader.cloneOriginMetadata(info, i, numPages, decoder.render);
										
										if (subTexts && i < subTexts.length){
											var text = $.trim(subTexts[i]);
											if (text) subInfo.text = text;
										}
	
										images.push({
											index: i,

											from: from || 'local',
											decoder: decoder,
											image: p.image,

											width: p.width,
											height: p.height,
											
											thumbnail: p.thumbnail,
											info: subInfo,
										});
									}

									var f = images[0];

									r = {
										from: from || 'local',
										decoder: decoder,
										image: f.image,
										thumbnail: f.thumbnail,
										//info: info,
										info: f.info,
										images: images,
									};
								}else{
									r = {
										from: from || 'local',
										decoder: decoder,
										image: null,
										info: info
									};
								}
	
								setTimeout(resolve.bind(null, r), 0);
							})
							.catch(function(e){
								setTimeout(reject.bind(null,e), 0);
							});
					});
				}
				catch (e)
				{
					setTimeout(reject.bind(null,e), 0);
				}	
			});
		};
		loader.data = data;
		loader.decoder = decoder;
		loader.info = info;
		loader.subTexts = subTexts;
		loader.from = from;

		return loader;
	},
	
	/**
	 * 이미지의 메타데이터를 작성합니다.
	 * @memberof AbImageLoader
	 * @private
	 * @param {File} data {@link https://developer.mozilla.org/en-US/docs/Web/API/File|File} 인스턴스
	 * @param {Object} [options] 옵션
	 * @param {Boolean} [options.exif] EXIF 메타데이터를 읽을 지 여부입니다.
	 * @return {Promise} Promise 객체
	 */
	makeResultInfoByFileData: function (data, options){
		var promise = null;
		var meta = {
			name: data.name,
			text: data.name,
			type: data.type,
			origin: data,
			exif: null
		};
		
		var self = this;
		
		if (options && options.exif === 'read'){
			return new Promise(function (resolve, reject){
				try
				{
					AbVendor.exif('file', data, function(pictureMetaData, instance){
						meta.exif = AbExifMetaReader.read(pictureMetaData);
						
						//console.log(pictureMetaData);
						//console.log(meta.exif);
						
						resolve(meta);
					});
				}
				catch (e)
				{
					reject(e);
				}
			});
		}else{
			return Promise.resolve(meta);
		}
	},

	/**
	 * 메타데이터를 기반으로 서브 이미지 메타데이터를 생성합니다.
	 * @param {AbImage.Metadata} meta 원본 이미지 메타데이터
	 * @param {Number} index 원본(문서)의 인덱스
	 * @param {Number} nums 원본(문서) 이미지 개수
	 * @param {String} render 렌더링 힌트 (jpeg|png)
	 * @return {AbImage.SubImageMetadata} 서브 이미지 메타데이터
	 */
	cloneOriginMetadata: function (meta, index, nums, render){
		var m = meta.name.split(/\./g);
		if (m.length) m.splice(m.length - 1);
		var basename = m.join('.');

		var name = basename + '_' + index;

		return {
			name: name,
			text: name,
			type: render == 'png' ? 'image/png' : 'image/jpeg',
			originMeta: meta,

			originIndex: index,
			originName: meta.name,
			originPages: nums,
			originSize: meta.origin ? meta.origin.size : 0,
		};
	},

	/**
	 * 파일 타입 및 확장자를 확입합니다.
	 * @memberof AbImageLoader
	 * @private
	 * @param {String} name 파일명
	 * @param {String} type 파일타입 (mime-type)
	 * @return {AbImageLoader.Result} 파일 분석 결과
	 */
	test: function (name, type){
		if (!name) return null;

		name = name.toLowerCase();

		if (type === 'application/pdf'){
			return { kind: 'pdf', render: 'jpeg' };
		}

		if (name.match('\.jp2$|\.j2x$|\.j2k$|\.j2c$')){
			return { kind: 'j2k', render: 'jpeg' };
		}
		if (name.match('\.doc$|\.docx$|\.xls$|\.xlsx$|\.ppt$|\.pptx$|\.hwp$|\.pdf$')){
			return { kind: 'doc', render: 'jpeg' };
		}

		if (type === 'image/tiff'){
			return { kind: 'tif', render: 'jpeg' };
		}
		if (type === 'image/svg+xml'){
			return { kind: 'svg', render: 'png' };
		}

		switch(type){
		case 'image/jpeg': case 'image/bmp':
			return { kind: 'def', render: 'jpeg' };
		case 'image/png': case 'image/apng': case 'image/gif':
			return { kind: 'def', render: 'png' };
		}

		if (type){
			var types = type.split('/');

			if (types[0] === 'video')
				return { kind: 'video', render: 'video' };

			if (types[0] === 'audio')
				return { kind: 'audio', render: 'audio' };
		}

		// if (!type.match('image.*')){
		// 	return null;
		// }

		// firefox 기준 지원 이미지 포맷
		// - jpeg (image/jpeg)
		// - gif (image/gif)
		// - png (image/png)
		// - apng (image/apng)
		// - svg (image/svg+xml)
		// - bmp (image/bmp)
		// - bmp ico (image/vnd.microsoft.icon, image/x-icon, image/ico, image/icon, text/ico, application/ico)

		return null;
	},

	/**
	 * 파일이 PDF 문서인지 확인합니다.
	 * @param {String} name 파일명
	 * @param {String} type 파일타입 (mime-type)
	 * @return {Boolean}
	 */
	testPdf: function (name, type){
		if (type === 'application/pdf'){
			return true;
		}

		if (!name) return false;

		name = name.toLowerCase();

		if (name.match('\.pdf$')){
			return true;
		}

		return false;
	},

	/**
	 * 파일이 TIFF 이미지인지 확인합니다.
	 * @param {String} name 파일명
	 * @param {String} type 파일타입 (mime-type)
	 * @return {Boolean}
	 */
	testTiff: function (name, type){
		if (type === 'image/tiff'){
			return true;
		}
		return false;
	},

	/**
	 * 파일 개수를 계산합니다.
	 * @memberof AbImageLoader
	 * @private
	 * @param {Array.<File>} files File 목록
	 */
	analysis: function (files){
		var siz = files.length;
		var d = { doc: 0, img: 0, etc: 0 };
		for (var i=0; i < siz; i++){
			var file = files[i];

			var decoder = this.test(file.name, file.type);
			var r = decoder ? decoder.kind : null;
			switch(r){
			case 'doc':
				d.doc++;
				break;
			case 'def': case 'j2k': case 'tif': case 'svg':
				d.img++;
				break;
			default:
				d.etc++;
				break;
			}
		}
		return d;
	},

	/**
	 * 이미지가 여러 장이 있는 파일이 있는 지 확인합니다.
	 * @memberof AbImageLoader
	 * @private
	 * @return {Boolean}
	 */
	needExternalProcess: function() { return this.multiImages.length > 0 || this.docs.length > 0; },

	/**
	 * 이미지가 여러 장이 있는 파일이나 서버에 전송해야 할 파일들을 처리합니다.
	 * @memberof AbImageLoader
	 * @param {Object} [options] 옵션
	 * @param {AbImageLoader.ProcCallback} [options.begin] 작업 시작 전 호출되는 콜백 함수
	 * @param {AbImageLoader.InProgCallback} [options.next] 다음 작업으로 넘어갈 떄 호출되는 콜백 함수
	 * @param {AbImageLoader.ProcCallback} [options.end] 작업 완료 후 호출되는 콜백 함수
	 * @param {AbImageLoader.GetListCallback} [options.getList] 작업 완료 후 호출되는 콜백 함수
	 * @param {AbImageLoader.ErrorCallback} [options.error] 작업 완료 후 호출되는 콜백 함수
	 */
	doExternalProcess: function(options){
		if (!options) options = {};

		var total = this.docs.length + this.multiImages.length;

		if (AbCommon.isFunction(options.begin))
			options.begin(total);

		var index = 0;

		var callback = function(){
			index++;

			if (AbCommon.isFunction(options.next))
				options.next(total, index);

			if (index >= total){
				if (AbCommon.isFunction(options.end))
					options.end(total);
			}
		};

		this.$doMultiImageProcess(total, options, callback);
		this.$doRemoteProcess(total, options, callback);
	},

	/**
	 * 여러 장이 있는 파일들을 처리합니다.
	 * <p>* 미구현
	 * @memberof AbImageLoader
	 * @private
	 * @param {Number} total 전체 개수
	 * @param {Object} [options] 옵션
	 * @param {AbImageLoader.ProcCallback} [options.begin] 작업 시작 전 호출되는 콜백 함수
	 * @param {AbImageLoader.InProgCallback} [options.next] 다음 작업으로 넘어갈 떄 호출되는 콜백 함수
	 * @param {AbImageLoader.ProcCallback} [options.end] 작업 완료 후 호출되는 콜백 함수
	 * @param {Function} [callback] 한 개 작업을 완료 후 호출되는 콜백 함수
	 */
	$doMultiImageProcess: function(total, options, callback){
		this.multiImages.splice(0, this.multiImages.length);
	},

	/**
	 * 문서 파일들을 컨버팅합니다.
	 * @memberof AbImageLoader
	 * @private
	 * @param {Number} total 전체 개수
	 * @param {Object} [options] 옵션
	 * @param {AbImageLoader.GetListCallback} [options.getList] 작업 완료 후 호출되는 콜백 함수
	 * @param {AbImageLoader.ErrorCallback} [options.error] 작업 완료 후 호출되는 콜백 함수
	 * @param {Function} [callback] 한 개 작업을 완료 후 호출되는 콜백 함수
	 */
	$doRemoteProcess: function (total, options, callback){
		var forms = $('#doc-forms');
		// 혹시 남을 수 있는 경우를 대비한 코드
		var cleared = 0;
		var clear = function(){
			var siz = arguments.length.siz;

			cleared++;

			if (cleared == siz){
				forms.empty();
			}
		};
		clear.siz = this.docs.length;
		
		var makeInfo = this.makeResultInfoByFileData;

		var url = this.URLS.CONVERTER;
		var siz = this.docs.length;
		for (var i=0; i < siz; i++){
			var d = this.docs[i];

			if (d.decoder.kind === 'doc'){
				var loaded = function(event){
					var data = arguments.callee.data;
					var decoder = arguments.callee.decoder;

					var baData =  event.target.result;
					var b64 = baData.substr(baData.indexOf(",") + 1);

					var html = '<form enctype="multipart/form-data"><input type="hidden" name="name"/><input type="hidden" name="content"/></form>';
					var e = $(html);

					e.find('[name="name"]').val(data.name);
					e.find('[name="content"]').val(b64);

					forms.append(e);

					try
					{
						/**
						 * 문서 컨버팅 성공 시
						 * @param {Server.ImageList} r 서버 이미지 목록
						 * @param {String} status 
						 * @param {XMLHttpRequest} xhr XMLHttpRequest 객체
						 * @param {jQueryObject} $form HTML Form jQueryObject
						 */
						var success = function(r, status, xhr, $form){
							var data = arguments.callee.data;
							var decoder = arguments.callee.decoder;

							$form.remove();
							clear();
							
							if (AbCommon.isFunction(options.getList)){
								makeInfo(data)
									.then(function(info){
										options.getList(r, { from: 'doc', preset: info, decoder: decoder });
									})
									.catch(function(e){
										console.log(e);
									});
							}

							if (AbCommon.isFunction(callback))
								callback();
						};
						success.data = data;
						success.decoder = decoder;

						AbCommon.ajaxSubmit(e, {
							title: '문서 변환',
							url: url,
							success: success,

							error: function(e, $form){
								$form.remove();
								clear();

								console.log(e);

								if (AbCommon.isFunction(callback))
									callback();
							},
						});
					}
					catch (e)
					{
						clear();
					}
				};
				loaded.data = d.data;
				loaded.decoder = d.decoder;

				var error = function (e){
					reader.abort();

					if (AbCommon.isFunction(options.error))
						options.error(e);

					if (AbCommon.isFunction(callback))
						callback();
				};

				var reader = new FileReader();
				reader.onload = loaded;
				reader.onerror = error;

				reader.readAsDataURL(d.data);
			}
		}

		this.docs.splice(0, this.docs.length);
	},
};

