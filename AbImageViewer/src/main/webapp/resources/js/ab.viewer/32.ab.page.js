
/**
 * 페이지 로드 상태
 * <dl>
 * 	<dt>0</dt><dd>준비중입니다. (AbPage.prototype.READY)</dd>
 * 	<dt>1</dt><dd>로딩중입니다. (AbPage.prototype.LOADING)</dd>
 * 	<dt>2</dt><dd>로드되었습니다. (AbPage.prototype.LOADED)</dd>
 * 	<dt>3</dt><dd>오류가 발생했습니다. (AbPage.prototype.ERROR)</dd>
 * </dl>
 * @typedef {Number} AbPage.Status
 */

 /**
 * 페이지 로드 상태 문자열
 * <dl>
 * 	<dt>ready</dt><dd>READY: 준비중입니다.</dd>
 * 	<dt>loading</dt><dd>LOADING: 로딩중입니다.</dd>
 * 	<dt>loaded</dt><dd>LOADED: 로드되었습니다.</dd>
 * 	<dt>error</dt><dd>ERROR: 오류가 발생했습니다.</dd>
 * </dl>
 * @typedef {String} AbPage.StatusString
 */

/**
 * 페이지(=이미지) 정보
 * @class
 * @param {Object} options 옵션
 * @param {AbImageLoader.loader} options.loader 이미지 로드 수행 함수
 * @param {String} [options.xmlShapes] 도형 정의 XML 문자열
 * @param {String} [options.uid] 페이지 UUID
 * @param {AbPage.Status} [options.status=AbPage.prototype.LOADED] 로드상태 (0|1|2|3)
 * @param {Number} [options.angle] 페이지 회전 각도
 * @param {Number} [options.x] X좌표
 * @param {Number} [options.y] Y좌표
 * @param {Number} [options.width] 폭
 * @param {Number} [options.height] 높이
 * @param {AbImage} [options.source] 이미지 인스턴스
 */
function AbPage(options){
	if (!options) options = {};
	var scaleOption = options.scale || {};

	/**
	 * 이미지 로드 수행 함수
	 * @type {Function}
	 */
	this.loader = options.loader;
	/**
	 * 도형 정의 XML 문자열
	 * <p>* 이 정보를 이용해 도형을 생성하고, shapes 필드의 데이터를 채웁니다.
	 */
	this.xmlShapes = options.xmlShapes;

	/**
	 * 페이지 UUID
	 * @type {String}
	 */
	this.uid = options.uid || AbCommon.uuid();
	/**
	 * 페이지 로드 상태 정보
	 * <p>* 섬네일 이미지의 로드 상태와 같습니다.
	 * @type {AbPage.Status}
	 */
	this.status = options.hasOwnProperty('status') ? options.status : AbPage.prototype.LOADED;
	/**
	 * 페이지 로드 오류 객체
	 * @type {Error}
	 */
	this.error = null;

	/**
	 * 페이지 회전 각도 (0~359)
	 * @type {Number}
	 */
	this.angle = options.angle || 0;

	/**
	 * 페이지 위치 X좌표
	 * @type {Number}
	 */
	this.x = options.x || 0;
	/**
	 * 페이지 위치 Y좌표
	 * @type {Number}
	 */
	this.y = options.y || 0;
	/**
	 * 페이지 폭
	 * @type {Number}
	 */
	this.width = options.width || 0;
	/**
	 * 페이지 높이
	 * @type {Number}
	 */
	this.height = options.height || 0;
	// 화면 맞춤 (in=전체, horiz=가로, vert=세로)
	/**
	 * 페이지 화면 맞춤 (in=전체, horiz=가로, vert=세로)
	 * @type {String}
	 */
	this.fitTo = 'in';

	/**
	 * 미디어 타입 (image|vedeo|audio)
	 * @type {String}
	 */
	this.mediaType = 'image';

	/**
	 * 화면 확대/축소 비율
	 * @type {Point}
	 */
	this.scale = {
		x: !scaleOption.x || scaleOption.x <= 0 ? 1 : scaleOption.x,
		y: !scaleOption.y || scaleOption.y <= 0 ? 1 : scaleOption.y
	};

	/**
	 * 이미지 인스턴스
	 * @type {AbImage}
	 */
	this.source = options.source || null;

	/**
	 * 도형 목록
	 * @type {Array.<ShapeObject>}
	 */
	this.shapes = [];

	/**
	 * 서브 페이지 목록
	 * @type {AbPageCollection}
	 */
	this.subPages = new AbPageCollection();
};
	
//-----------------------------------------------------------
//-----------------------------------------------------------
//-----------------------------------------------------------

AbPage.prototype = {
	constructor: AbPage,

	//-----------------------------------------------------------

	/**
	 * 로드 상태 문자열 테이블
	 * <p>* {@link AbPage.StatusString}을 참고하세요
	 * @type {Array.<String>}
	 */
	STATUS_TABLE: ['ready', 'loading', 'loaded', 'error'],

	/**
	 * 준비 중 상태
	 * @const
	 * @static
	 * @type {Number}
	 * @default
	 */
	READY: 0,
	/**
	 * 로드 중 상태
	 * @const
	 * @static
	 * @type {Number}
	 * @default
	 */
	LOADING: 1,
	/**
	 * 로드 완료 상태
	 * @const
	 * @static
	 * @type {Number}
	 * @default
	 */
	LOADED: 2,
	/**
	 * 오류 상태
	 * @const
	 * @static
	 * @type {Number}
	 * @default
	 */
	ERROR: 3,

	//-----------------------------------------------------------

	/**
	 * 객체를 Dispose합니다.
	 */
	dispose: function(){
		if (this.source && AbCommon.isFunction(this.source.dispose))
			this.source.dispose();

		this.loader = null;
		this.source = null;

		var siz = this.shapes.length;
		for (var i=0; i < siz; i++)
			if (AbCommon.isFunction(this.shapes[i].dispose))
				this.shapes[i].dispose();

		this.shapes.splice(0, this.shapes.length);
	},

	//-----------------------------------------------------------

	/**
	 * 페이지가 준비 중인지 확인합니다.
	 * <p>* 섬네일 이미지를 로드 중인지 확인합니다.
	 * @return {Boolean}
	 */
	isLoading: function () { return this.status == AbPage.prototype.LOADING; },
	/**
	 * 페이지가 오류인지 확인합니다.
	 * <p>* 섬네일 이미지 로드 오류인지 확인합니다.
	 * @return {Boolean}
	 */
	isError: function() { return this.status == AbPage.prototype.ERROR; },

	/**
	 * 페이지가 편집이 가능한 지 확인합니다.
	 * <p>* 섬네일 이미지가 로드가 되었는 지 확인합니다.
	 * @return {Boolean}
	 */
	editable: function() { return this.status == AbPage.prototype.LOADED; },
	/**
	 * 페이지의 상태 문자열을 가져옵니다.
	 * @return {AbPage.StatusString}
	 */
	statusText: function (){ return AbPage.prototype.STATUS_TABLE[this.status]; },
	/**
	 * 이미지 인스턴스에 정보 객체가 있는 지 확인합니다.
	 * @return {Boolean}
	 */
	hasImageInfo: function (){ return this.source && this.source.info && this.source.info.data; },
	/**
	 * 페이지에 도형이 있는 지 확인합니다.
	 * @return {Boolean}
	 */
	hasShapes: function () { return this.shapes.length > 0; },
	/**
	 * 페이지에 도형 정의 문자열이 있는 지 확인합니다.
	 * @return {Boolean}
	 */
	hasXmlShapes: function () { return this.xmlShapes != null; },

	//-----------------------------------------------------------

	// 섬네일만 로드된 경우
	/**
	 * 섬네일만 로드된 상태인지 확인합니다.
	 * @return {Boolean}
	 */
	isReadyImage: function (){
		return !this.error && !this.source.hasImage() && this.source.imgInfo.url;
	},

	//-----------------------------------------------------------

	/**
	 * 이미지 획득처를 확인합니다.
	 * @see {@link AbImageLoader.From} 이미지 획득처
	 * @return {String}
	 */
	infoFrom: function() { return this.source && this.source.info ? this.source.info.from : null; },
	/**
	 * 이미지 인스턴스에서 이미지 메타데이터를 가져옵니다.
	 * @return {AbImage.Metadata} 이미지 메타데이터
	 */
	info: function() { return this.hasImageInfo() ? this.source.info.data : null; },
	/**
	 * 이미지 인스턴스에서 정제된 EXIF 정보를 가져옵니다.
	 * @return {EXIF_Object} 정제된 EXIF 정보
	 */
	exif: function() { return this.hasImageInfo() && this.source.info.data ? this.source.info.data.exif : null; },
	/**
	 * 이미지 렌더링 힌트를 가져옵니다.
	 * @return {String} 이미지 렌더링 힌트
	 */
	decoder: function() { return this.source && this.source.info ? this.source.info.decoder : null; },

	//-----------------------------------------------------------

	/**
	 * 이미지의 크기를 가져옵니다.
	 * @return {Size}
	 */
	sourceSize: function(){
		return this.source;
	},

	/**
	 * 이미지 HTML 엘리먼트를 가져옵니다.
	 * <p>* 섬네일 이미지만 로드된 상태라면, 섬네일 이미지를 가져옵니다.
	 * @param {Object} [options] 옵션
	 * @param {Boolean} [options.origin] 이미지의 원본을 가져옵니다.
	 * <p>* 섬네일 이미지에만 해당됩니다. 캔버스에서 축소 렌더링한 이미지는 질이 낮아 원래의 섬네일 이미지를 사용하도록 유도하는 옵션입니다.
	 * @return {Image} 이미지 HTML 엘리먼트
	 */
	image: function(options){
		if (this.source instanceof AbImage || this.source instanceof AbMedia){
			if (this.source.hasImage())
				return this.source.imageElement();
			else if (this.source.hasThumbnail()){
				if (options && options.origin === true)
					return this.source.originThumbnailElement();
				return this.source.thumbnailElement();
			}
			return null;
		}
		return this.source;
	},

	/**
	 * 섬네일 이미지 HTML 엘리먼트를 가져옵니다.
	 * @return {Image} 이미지 HTML 엘리먼트
	 */
	thumbnail: function(){
		if (this.source instanceof AbImage || this.source instanceof AbMedia){
			if (this.source.hasThumbnail())
				return this.source.thumbnailElement();
		}
		return null;
	},

	/**
	 * 원본 이미지 HTML 엘리먼트를 가져옵니다.
	 * @return {Image} 이미지 HTML 엘리먼트
	 */
	originThumbnail: function(){
		if (this.source instanceof AbImage || this.source instanceof AbMedia){
			if (this.source.hasThumbnail())
				return this.source.originThumbnailElement();
		}
		return null;
	},

	//-----------------------------------------------------------

	/**
	 * 이미지/미디어 정보에서 MIME 정보를 가져옵니다.
	 * @return {String} MIME
	 */
	mimeType: function(){
		var info = this.info();
		if (info) return info.type;
		return null;
	},

	/**
	 * 미디어 정보에서 미디어 URI를 가져옵니다.
	 * @return {String} 미디어 URI
	 */
	mediaURI: function(){
		if (this.source instanceof AbMedia)
			return this.source.mediaInfo.uri;
		return null;
	},

	/**
	 * 미디어 정보에서 미디어 소스를 가져옵니다.
	 * @return {String} 미디어 소스 (URL이거나 DATA URI)
	 */
	mediaSource: function(){
		if (this.source instanceof AbMedia)
			return this.source.mediaInfo.data;
		return null;
	},

	//-----------------------------------------------------------

	/**
	 * 초기 설정에 서브 이미지 정보가 존재 하는 지 확인합니다.
	 * @return {Boolean}
	 */
	isMultiple: function(){
		return this.source && this.source.info && this.source.info.images && this.source.info.images.length;
	},

	/**
	 * 초기 설정 정보에서 서브 이미지 정보를 가져옵니다.
	 * @return {Array}
	 */
	subImages: function(){
		if (this.isMultiple())
			return this.source.info.images;
		return null;
	},

	//-----------------------------------------------------------

	/**
	 * 서브 페이지가 존재 하는 지 확인합니다.
	 * @return {Boolean}
	 */
	hasSubPages: function(){
		return this.subPages.length() > 0;
	},

	//-----------------------------------------------------------

	/**
	 * 서브 페이지들의 도형 정보 개수를 가져옵니다.
	 * @return {Number}
	 */
	numSubPageShapes: function(){
		var numSubPages = this.subPages.length(), nums = 0;
		for (var i=0; i < numSubPages; i++){
			var p = this.subPages.get(i);
			nums += p.shapes.length;
		}
		return nums;
	},

	//-----------------------------------------------------------
	
	/**
	 * 이미지 인스턴스의 이미지를 변경합니다.
	 * @param {String} src 이미지 URL
	 * @return {Promise}
	 */
	changeImage: function(src){
		if (this.source instanceof AbImage || this.source instanceof AbMedia){
			return this.source.changeImage(src)
				.then(function(imgElement){
					this.width = imgElement.width;
					this.height = imgElement.height;
					
				}.bind(this))
				.catch(function(e){
					
				});
		}
		
		return new Promise(function(resolve, reject){
			resolve();
		});
	},

	//-----------------------------------------------------------

	/**
	 * 페이지가 이동하거나 확대/축소되었는 지 확인합니다.
	 * @return {Boolean}
	 */
	transformed: function (){ return this.x != 0 || this.y != 0 || this.scaled(); },
	/**
	 * 페이지가 확대/축소되었는 지 확인합니다.
	 * @return {Boolean}
	 */
	scaled: function(){ return this.scale.x != 1 || this.scale.y != 1; },

	/**
	 * 페이지 좌표계에서 캔버스 좌표계로 변환합니다.
	 * @see {@link Coordinates} 이미지 뷰어 좌표계
	 * @param {Number} x 페이지 좌표계 X좌표
	 * @param {Number} y 페이지 좌표계 Y좌표
	 * @return {Point} 캔버스 좌표계 좌표
	 */
	toCanvas: function (x, y){
		return {
			x: (x * this.scale.x) + this.x,
			y: (y * this.scale.y) + this.y,
		};
	},

	/**
	 * 캔버스 좌표계에서 페이지 좌표계로 변환합니다.
	 * @see {@link Coordinates} 이미지 뷰어 좌표계
	 * @param {Number} canvasX 캔버스 좌표계 X좌표
	 * @param {Number} canvasY 캔버스 좌표계 Y좌표
	 * @return {Point} 페이지 좌표계 좌표
	 */
	fromCanvas: function (canvasX, canvasY){
		return {
			x: (canvasX - this.x) / this.scale.x,
			y: (canvasY - this.y) / this.scale.y,
		};
	},

	/**
	 * 페이지 좌표계 상자 정보를 캔버스 좌표계 상자로 변경합니다.
	 * <table>
	 * <thead>
	 * <tr>
	 * 	<th>인자수</th><th>인자0</th><th>인자1</th><th>인자2</th><th>인자3</th><th>설명</th>
	 * </tr>
	 * </thead>
	 * <tbody>
	 * <tr>
	 * 	<td>1개</td><td>box: {@link Box}</td><td></td><td></td><td></td><td></td>
	 * </tr>
	 * <tr>
	 * 	<td>4개</td><td>x: Number</td><td>y: Number</td><td>width: Number</td><td>height: Number</td><td></td>
	 * </tr>
	 * </tbody>
	 * </table>
	 * @see {@link Coordinates} 이미지 뷰어 좌표계
	 * @param {(Box|Number)} 0 페이지 좌표계 상자 또는 페이지 좌표계 X좌표
	 * @param {Number} [1] 페이지 좌표계 Y좌표
	 * @param {Number} [2] 페이지 좌표계 폭
	 * @param {Number} [3] 페이지 좌표계 높이
	 * @return {Box} 캔버스 좌표계 상자 정보
	 */
	toCanvasBox: function(){
		var box = null;
		if (arguments.length == 1)
			box = arguments[0];
		else if (arguments.length == 4)
			box = {
				x: arguments[0],
				y: arguments[1],
				width: arguments[2],
				height: arguments[3],
			};
		if (!box) return;

		var s = this.toCanvas(box.x, box.y);
		var e = this.toCanvas(box.x + box.width, box.y + box.height);

		return {
			x: s.x,
			y: s.y,
			width: e.x - s.x,
			height: e.y - s.y
		};
	},

	/**
	 * 캔버스 좌표계 상자 정보를 페이지 좌표계 상자로 변경합니다.
	 * <table>
	 * <thead>
	 * <tr>
	 * 	<th>인자수</th><th>인자0</th><th>인자1</th><th>인자2</th><th>인자3</th><th>설명</th>
	 * </tr>
	 * </thead>
	 * <tbody>
	 * <tr>
	 * 	<td>1개</td><td>box: {@link Box}</td><td></td><td></td><td></td><td></td>
	 * </tr>
	 * <tr>
	 * 	<td>4개</td><td>x: Number</td><td>y: Number</td><td>width: Number</td><td>height: Number</td><td></td>
	 * </tr>
	 * </tbody>
	 * </table>
	 * @see {@link Coordinates} 이미지 뷰어 좌표계
	 * @param {(Box|Number)} 0 캔버스 좌표계 상자 또는 캔버스 좌표계 X좌표
	 * @param {Number} [1] 캔버스 좌표계 Y좌표
	 * @param {Number} [2] 캔버스 좌표계 폭
	 * @param {Number} [3] 캔버스 좌표계 높이
	 * @return {Box} 페이지 좌표계 상자 정보
	 */
	fromCanvasBox: function(){
		var box = null;
		if (arguments.length == 1)
			box = arguments[0];
		else if (arguments.length == 4)
			box = {
				x: arguments[0],
				y: arguments[1],
				width: arguments[2],
				height: arguments[3],
			};
		if (!box) return;

		var s = this.fromCanvas(box.x, box.y);
		var e = this.fromCanvas(box.x + box.width, box.y + box.height);

		return {
			x: s.x,
			y: s.y,
			width: e.x - s.x,
			height: e.y - s.y
		};
	},

	/**
	 * 페이지 좌표계 두 점 좌표 정보를 캔버스 좌표계 두 점 좌표 정보로 변경합니다.
	 * <table>
	 * <thead>
	 * <tr>
	 * 	<th>인자수</th><th>인자0</th><th>인자1</th><th>인자2</th><th>인자3</th><th>설명</th>
	 * </tr>
	 * </thead>
	 * <tbody>
	 * <tr>
	 * 	<td>1개</td><td>rect: {@link 2Point}</td><td></td><td></td><td></td><td></td>
	 * </tr>
	 * <tr>
	 * 	<td>4개</td><td>x1: Number</td><td>y1: Number</td><td>x2: Number</td><td>y2: Number</td><td></td>
	 * </tr>
	 * </tbody>
	 * </table>
	 * @see {@link Coordinates} 이미지 뷰어 좌표계
	 * @param {(2Point|Number)} 0 페이지 좌표계 두 점 좌표 정보 또는 페이지 좌표계 점1 X좌표
	 * @param {Number} [1] 페이지 좌표계 점1 Y좌표
	 * @param {Number} [2] 페이지 좌표계 점2 X좌표
	 * @param {Number} [3] 페이지 좌표계 점2 Y좌표
	 * @return {2Point} 캔버스 좌표계 상자 정보
	 */
	toCanvasRect: function(){
		var rect = null;
		if (arguments.length == 1)
			rect = arguments[0];
		else if (arguments.length == 4)
			rect = {
				x1: arguments[0],
				y1: arguments[1],
				x2: arguments[2],
				y2: arguments[3],
			};
		if (!rect) return;

		var s = this.toCanvas(rect.x1, rect.y1);
		var e = this.toCanvas(rect.x2, rect.y2);

		return {
			x1: s.x,
			y1: s.y,
			x2: e.x,
			y2: e.y
		};
	},

	/**
	 * 캔버스 좌표계 두 점 좌표 정보를 페이지 좌표계 두 점 좌표 정보로 변경합니다.
	 * <table>
	 * <thead>
	 * <tr>
	 * 	<th>인자수</th><th>인자0</th><th>인자1</th><th>인자2</th><th>인자3</th><th>설명</th>
	 * </tr>
	 * </thead>
	 * <tbody>
	 * <tr>
	 * 	<td>1개</td><td>rect: {@link 2Point}</td><td></td><td></td><td></td><td></td>
	 * </tr>
	 * <tr>
	 * 	<td>4개</td><td>x1: Number</td><td>y1: Number</td><td>x2: Number</td><td>y2: Number</td><td></td>
	 * </tr>
	 * </tbody>
	 * </table>
	 * @see {@link Coordinates} 이미지 뷰어 좌표계
	 * @param {(2Point|Number)} 0 캔버스 좌표계 두 점 좌표 정보 또는 캔버스 좌표계 점1 X좌표
	 * @param {Number} [1] 캔버스 좌표계 점1 Y좌표
	 * @param {Number} [2] 캔버스 좌표계 점2 X좌표
	 * @param {Number} [3] 캔버스 좌표계 점2 Y좌표
	 * @return {2Point} 페이지 좌표계 상자 정보
	 */
	fromCanvasRect: function(){
		var rect = null;
		if (arguments.length == 1)
			rect = arguments[0];
		else if (arguments.length == 4)
			rect = {
				x1: arguments[0],
				y1: arguments[1],
				x2: arguments[2],
				y2: arguments[3],
			};
		if (!rect) return;

		var s = this.fromCanvas(rect.x1, rect.y1);
		var e = this.fromCanvas(rect.x2, rect.y2);

		return {
			x1: s.x,
			y1: s.y,
			x2: e.x,
			y2: e.y
		};
	},

	//-----------------------------------------------------------

	/**
	 * 페이지의 도형들을 그립니다.
	 * @param {CanvasRenderingContext2D} ctx Canvas 2D Context
	 * @param {Object} [options] 옵션
	 * @param {Boolean} [options.indicator] 편집점 지시자를 그릴 지 여부입니다.
	 * @param {String} [options.mode=null] 드로잉 목적입니다. <p>* null이면 화면을 말하며, 이미지 생성은 image로 입력됩니다.
	 * @param {Object.<String, Boolean>} [options.showingShapeTypeMap] 도형 구분(type 필드)별 그릴 지 여부로<p>필드명이 구분(annotation/masking), 필드값이 부울형인 객체입니다.
	 */
	drawShapes: function (ctx, options){
		var indicator = true;
		var mode = null;
		var showingShapeTypeMap = {};
		
		if (options && AbCommon.isBool(options.indicator)) indicator = options.indicator;
		if (options && options.showingShapeTypeMap) showingShapeTypeMap = options.showingShapeTypeMap;
		if (options && options.mode) mode = options.mode;

		var len = this.shapes.length;
		var sels = [], fsel = null;
		var bak = { selected: false, focused: false };
		for (var i=0; i < len; i++){
			var s = this.shapes[i];
			
			if (showingShapeTypeMap && showingShapeTypeMap[s.type] === false)
				continue;
			
			if (s.focused)
				fsel = s;
			else if (s.selected)
				sels.push(s);

			if (indicator === false){
				bak.selected = s.selected;
				bak.focused = s.focused;

				s.selected = false;
				s.focused = false;
			}

			s.draw(ctx, this, false, mode);

			if (indicator === false){
				s.selected = bak.selected;
				s.focused = bak.focused;
			}
		}
		if (sels.length && indicator){
			for (var i = sels.length - 1; i >= 0; i--){
				var s = sels[i];
				if (typeof s.drawIndicator == 'function')
					s.drawIndicator(ctx, this);
				else
					s.indicator.draw(ctx);
			}
		}

		if (fsel && indicator){
			if (typeof fsel.drawIndicator == 'function')
				fsel.drawIndicator(ctx, this);
			else
				fsel.indicator.draw(ctx);
		}
	},

	/**
	 * 페이지의 도형들을 원본 크기(이미지 크기)로 편집점 지시자 없이 그립니다.
	 * @param {CanvasRenderingContext2D} ctx Canvas 2D Context
	 * @param {Object} [options] 옵션
	 * @param {Number} [options.scale=1] 확대/축소 비율
	 * @param {String} [options.mode=null] 드로잉 목적입니다. <p>* null이면 화면을 말하며, 이미지 생성은 image로 입력됩니다.
	 * @param {Object.<String, Boolean>} [options.showingShapeTypeMap] 도형 구분(type 필드)별 그릴 지 여부로<p>필드명이 구분(annotation/masking), 필드값이 부울형인 객체입니다.
	 */
	drawOrigin: function(ctx, options){
		var scale = 1;
		var showingShapeTypeMap = {};
		
		if (options && AbCommon.isNumber(options.scale)) scale = options.scale;
		if (options && options.showingShapeTypeMap) showingShapeTypeMap = options.showingShapeTypeMap;
		
		var scaleX = this.scale.x, scaleY = this.scale.y;

		this.scale.x = this.scale.y = scale;

		this.drawShapes(ctx, {
			indicator: false,
			showingShapeTypeMap: options ? options.showingShapeTypeMap : null,
			mode: options ? options.mode : null,
		});

		this.scale.x = scaleX;
		this.scale.y = scaleY;
	},
};
