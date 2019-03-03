/**
 * 미디어 메타데이터
 * @typedef {Object} AbMedia.Metadata
 * @property {String} name 파일명
 * @property {String} text 표시명
 * @property {String} type 파일 타입 (mime-type)
 * @property {Number} [size] 파일크기 (단위: 바이트)
 * @property {Number} [originIndex] 원본(문서)의 인덱스<p>* 이 옵션은 문서 파일에서만 설정됩니다.
 * @property {String} [originName] 원본(문서) 파일명<p>* 이 옵션은 문서 파일에서만 설정됩니다.
 * @property {Number} [originPages] 원본(문서) 이미지 개수<p>* 이 옵션은 문서 파일에서만 설정됩니다.
 * @property {Number} [originSize] 원본(문서) 파일크기 (단위: 바이트)<p>* 이 옵션은 문서 파일에서만 설정됩니다.
 * @property {EXIF_Object} [exif] 정제된 EXIF 정보
 * @property {File} [origin] {@link https://developer.mozilla.org/en-US/docs/Web/API/File|File} 인스턴스
 * <p>* 이 옵션은 로컬 이미지에서만 설정됩니다.
 * <p>* {@link https://developer.mozilla.org/en-US/docs/Web/API/File} MSN 자료 참고
 */

/**
 * 미디어 정보
 * @typedef {Object} AbMedia.Info
 * @property {AbMediaLoader.From} from 이미지 획득처
 * @property {String} decoder 렌더링 힌트 (jpeg|png)
 * @property {AbMedia.Metadata} data 이미지 메타데이터
 */

/**
 * 미디어 데이터
 * @typedef {Object} AbMedia.MediaInfo
 * @property {String} kind 미디어 종류 (video|audio)
 * @property {String} type 미디어 타입 (mime type)
 * @property {String} url 미디어 URL
 */

/**
 * 미디어 이미지 데이터
 * @typedef {Object} AbMedia.ImageInfo
 * @property {Boolean} loaded 로드 여부
 * @property {String} url 이미지 URL
 * @property {(Image|HTMLImageElement)} element 이미지 HTML 엘리먼트
 */

/**
 * 섬네일 이미지 데이터
 * @typedef {Object} AbMedia.ThumbnailInfo
 * @property {Boolean} loaded 로드 여부
 * @property {String} url 이미지 URL
 * @property {(Image|HTMLImageElement)} element 이미지 HTML 엘리먼트
 * @property {(Image|HTMLImageElement)} originElement 섬네일 이미지 원본 HTML 엘리먼트
 */

/**
 * 미디어
 * @class
 * @param {Object} [options] 옵션
 * @param {Number} [options.width] 이미지 폭
 * @param {Number} [options.height] 이미지 높이
 * @param {AbMedia.Info} [options.info] 이미지 메타데이터
 * @param {(Image|HTMLImageElement|String)} [options.image] 이미지 엘리먼트 또는 이미지 URL
 * @param {(Image|HTMLImageElement|String)} [options.thumbnail] 섬네일 이미지 URL
 */
function AbMedia(options){
	if (!options) options = {};

	/**
	 * 이미지 폭
	 * @type {Number}
	 */
	this.width = options.width || 0;
	/**
	 * 이미지 높이
	 * @type {Nubmer}
	 */
	this.height = options.height || 0;

	//-----------------------------------------------------------

	/**
	 * 이미지 메타데이터
	 * @type {AbMedia.Info}
	 */
	this.info = options.info || null;

	//-----------------------------------------------------------

	var src = null, element = null;

	//-----------------------------------------------------------

	/**
	 * 미디어 데이터
	 * @type {AbMedia.MediaInfo}
	 */
	this.mediaInfo = {
		kind: options.media.kind,
		uri: options.media.uri,
		data: options.media.data,
	};

	//-----------------------------------------------------------

	src = AbCommon.isString(options.image) ? options.image : null;
	element = !AbCommon.isString(options.image) && options.image ? options.image : null;

	/**
	 * 미디어 이미지 데이터
	 * @type {AbMedia.ImageInfo}
	 */
	this.imgInfo = {
		loaded: AbCommon.isSetted(element),
		url: src,
		element: element,
	};

	//-----------------------------------------------------------

	src = AbCommon.isString(options.thumbnail) ? options.thumbnail : null;
	element = !AbCommon.isString(options.thumbnail) && options.thumbnail ? options.thumbnail : null;

	/**
	 * 미디어 섬네일 데이터
	 * @type {AbMedia.ThumbnailInfo}
	 */
	this.thumbInfo = {
		loaded: AbCommon.isSetted(element),
		url: src,
		element: element,
		originElement: element,
	};
};
	
//-----------------------------------------------------------
//-----------------------------------------------------------
//-----------------------------------------------------------

AbMedia.prototype = {
	constructor: AbMedia,

	//-----------------------------------------------------------

	/**
	 * 객체를 dispose 합니다.
	 */
	dispose: function (){
		this.info = null;

		this.mediaInfo.kind = null;
		this.mediaInfo.type = null;
		this.mediaInfo.url = null;

		this.imgInfo.url = null;
		this.imgInfo.element = null;

		this.thumbInfo.url = null;
		this.thumbInfo.element = null;
		this.thumbInfo.originElement = null;
	},

	//-----------------------------------------------------------

	/**
	 * 이미지 크기가 있는 지 확인합니다.
	 * @return {Boolean}
	 */
	existSize: function () { return this.width && this.height; },

	/**
	 * 이미지가 로드되었는 지 확인합니다.
	 * @return {Boolean}
	 */
	hasImage: function (){ return this.imgInfo.loaded; },
	/**
	 * 섬네일 이미지가 로드되었는 지 확인합니다.
	 * @return {Boolean}
	 */
	hasThumbnail: function (){ return this.thumbInfo.loaded; },

	//-----------------------------------------------------------

	/**
	 * 이미지 URL을 가져옵니다.
	 * @return {String}
	 */
	imageUrl: function() { return this.imgInfo.url; },
	/**
	 * 섬네일 이미지 URL을 가져옵니다.
	 * @return {String}
	 */
	thumbnailUrl: function() { return this.thumbInfo.url; },

	//-----------------------------------------------------------
	
	/**
	 * 이미지를 로드합니다.
	 * @private
	 * @param {(AbMedia.ImageInfo|AbMedia.ThumbnailInfo)} imgdat 이미지 정보
	 * @param {Boolean} [recordOrigin] 원본 이미지를 originElement필드로 보관할 지 여부
	 * @return {Promise} Promise 객체
	 */
	getImage: function(imgdat, recordOrigin){
		if (imgdat.loaded){
			return new Promise(function (resolve, reject){
				resolve({ image: imgdat.element, loaded: false });
			});
		}

		return AbCommon.loadImage(imgdat.url)
			.then(function (e){
				imgdat.loaded = true;
				imgdat.element = e;
				
				return new Promise(function (resolve, reject){
					if (recordOrigin){
						AbCommon.loadImage(imgdat.url)
							.then(function(eorigin){
								imgdat.originElement = eorigin;
								
								resolve({ image: imgdat.element, loaded: true});
							})
							.catch(function(e){
								reject(e);
							});
					}else{
						resolve({ image: imgdat.element, loaded: true});
					}
				});
			});
	},
	
	//-----------------------------------------------------------

	/**
	 * 이미지 HTML 엘리먼트를 가져옵니다.
	 * @return {(Image|HTMLImageElement)} 이미지 HTML 엘리먼트
	 */
	imageElement: function() { return this.imgInfo.element; },
	/**
	 * 섬네일 이미지 HTML 엘리먼트를 가져옵니다.
	 * @return {(Image|HTMLImageElement)} 이미지 HTML 엘리먼트
	 */
	thumbnailElement: function() { return this.thumbInfo.element; },
	/**
	 * 섬네일 원본 이미지 HTML 엘리먼트를 가져옵니다.
	 * @return {(Image|HTMLImageElement)} 이미지 HTML 엘리먼트
	 */
	originThumbnailElement: function() { return this.thumbInfo.originElement; },

	//-----------------------------------------------------------

	/**
	 * 이미지 HTML 엘리먼트를 가져옵니다.
	 * <p>* 이미지가 로드되지 않았다면 이미지를 로드합니다.
	 * @return {Promise} Promise 객체
	 */
	image: function(){
		return this.getImage(this.imgInfo)
			.then(function (e){
				// if (e.loaded && !this.existSize()){
				// 	this.width = e.image.width;
				// 	this.height = e.image.height;
				// }

				this.width = e.image.width;
				this.height = e.image.height;

				var existSize = this.existSize();

				return new Promise(function (resolve, reject){
					if (existSize){
						setTimeout(resolve.bind(null, e.image), 0);
					}else{
						setTimeout(reject.bind(null, new Error('It is not an image file')), 0);
					}
				});
			}.bind(this));
	},

	/**
	 * 섬네일 이미지 HTML 엘리먼트를 가져옵니다.
	 * <p>* 이미지가 로드되지 않았다면 이미지를 로드합니다.
	 * @return {Promise} Promise 객체
	 */
	thumbnail: function(){ return this.getImage(this.thumbInfo, true); },

	//-----------------------------------------------------------
	
	/**
	 * 이미지 변경합니다.
	 * @param {String} src 이미지 URL
	 * @return {Promise} Promise 객체
	 */
	changeImage: function (src){
		var imgdat = this.imgInfo;
		var loaded = imgdat.loaded;
		
		imgdat.loaded = false;
		imgdat.url = src;
		
		if (loaded){
			return this.image();
		}else{
			return new Promise(function (resolve, reject){
				setTimeout(function(){
					resolve(imgdat.element);
				},0);
			});
		}
	},

	//-----------------------------------------------------------

	/**
	 * 섬네일 이미지를 생성합니다.
	 * <table>
	 * <thead>
	 * <tr>
	 * 	<th>인자수</th><th>인자0</th><th>인자1</th><th>인자2</th><th>설명</th>
	 * </tr>
	 * </thead>
	 * <tbody>
	 * <tr>
	 * 	<td>1개</td><td>gen: {@link AbThumbnailGenerator}</td><td></td><td></td><td>섬네일 이미지 생성기 인스턴스로 섬네일 이미지를 생성합니다.</td>
	 * </tr>
	 * <tr>
	 * 	<td>2개</td><td>width: Number</td><td>height: Number</td><td></td><td>이미지 크기로 섬네일 이미지를 생성합니다.</td>
	 * </tr>
	 * <tr>
	 * 	<td>3개</td><td>width: Number</td><td>height: Number</td><td>gen: {@link AbThumbnailGenerator}</td><td>섬네일 이미지 생성기 인스턴스를 이용해 width/height 크기의 섬네일 이미지를 생성합니다.</td>
	 * </tr>
	 * </tbody>
	 * </table>
	 * @param {(AbThumbnailGenerator|Number)} 0 섬네일 이미지 생성기 인스턴스 또는 이미지 폭
	 * @param {Number} [1] 이미지 높이
	 * @param {AbThumbnailGenerator} [2] 섬네일 이미지 생성기 인스턴스
	 * @return {Promise} Promise 객체
	 */
	generateThumbnail: function(){
		var w = 0, h = 0, gen = null;
		if (arguments.length == 3){
			w = arguments[0];
			h = arguments[1];
			gen = arguments[3];
		}else if (arguments.length == 2){
			w = arguments[0];
			h = arguments[1];
		}else{
			gen = arguments[0];
		}

		if (!gen && (!w || !h))
			throw 'invalid usage!!';

		return this.image()
			.then(function (e){
				if (!gen) gen = new AbThumbnailGenerator({ limit: { width: w, height: h } });
				else if (w || h) gen.resizeLimit(w, h);

				gen.resize(this.width, this.height);

				var decoder = this.info ? this.info.decoder : null;
				
				var data = gen.generate(e, decoder);

				return this.setThumbnailData(data);
				
				/*
				var img = AbCommon.createImage();
				img.src = data;

				this.thumbInfo.loaded = true;
				this.thumbInfo.element = img;
				this.thumbInfo.url = data;

				return new Promise(function (resolve, reject){
					setTimeout(resolve.bind(null, { element: img, data: data }), 0);
					
				});
				*/
			}.bind(this));
	},

	/**
	 * 섬네일 이미지 정보를 설정합니다.
	 * @private
	 */
	setThumbnailData: function (imageData){
		if (this.thumbInfo.loaded){
			var img = this.thumbInfo.element;
			img.src = imageData;

			return new Promise(function (resolve, reject){
				setTimeout(resolve.bind(null, { element: img, data: img.src }), 0);
			});
		}else{
			var img = AbCommon.createImage();
			img.src = imageData;

			var imgsrc = AbCommon.createImage();
			imgsrc.src = imageData;

			this.thumbInfo.loaded = true;
			this.thumbInfo.element = img;
			this.thumbInfo.url = imageData;
			this.thumbInfo.originElement = imgsrc;

			return new Promise(function (resolve, reject){
				setTimeout(resolve.bind(null, { element: img, data: img.src }), 0);
			});
		}
	},
};
