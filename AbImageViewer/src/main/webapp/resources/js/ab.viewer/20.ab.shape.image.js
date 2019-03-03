/**
 * 이미지 도형
 * <p>* 도형의 위치와 크기는 옵션에 x/y/width/height 또는 x1/y1/x2/y2 중 택일하여 설정합니다.
 * @class
 * @param {Object} [options] 옵션
 * @param {AbIcons.Source} [options.source] 이미지 정보
 * @param {String} [options.name] 도형명
 * @param {Number} [options.angle] 회전 각도 (0~359)
 * @param {Number} [options.x] 도형 x좌표
 * @param {Number} [options.y] 도형 y좌표
 * @param {Number} [options.width] 도형 크기
 * @param {Number} [options.height] 도형 크기
 * @param {Number} [options.x1] 도형 시작점 X좌표
 * @param {Number} [options.y1] 도형 시작점 Y좌표
 * @param {Number} [options.x2] 도형 끝점 X좌표
 * @param {Number} [options.y2] 도형 끝점 Y좌표
 */
function AbShapeImage(options){
	if (!options) options = {};
	var source = options.source || {};
	var sourceRender = source.render || {};
	var style = options.style || {};
	var strokeStyle = style.stroke || {};

	if (!source.data)
		throw new Error('[VECTOR-IMAGE] data is null or empty');

		if (!source.width || !source.height)
		throw new Error('[VECTOR-IMAGE] size(width, height) is not setted');

	/**
	 * 명칭
	 * @type {String}
	 * @default image
	 */
	this.name = options.name || 'image';		// name of shape
	/**
	 * 구분 (annotation=주석|masking=마스킹)
	 * @type {String}
	 * @default 
	 */
	this.type = 'annotation';	// annotation, masking
	/**
	 * 도형 유형 (shape|polygon|image)
	 * @type {String}
	 * @default
	 */
	this.shapeType = 'image';	// shape, polygon, image
	/**
	 * 도형 스타일 (box|line)
	 * @type {String}
	 * @default
	 */
	this.shapeStyle = 'box';	// box, line
	/**
	 * 토큰 (예약)
	 * @private
	 * @type {String}
	 */
	this.token = null;			// for customize

	/**
	 * 선택 여부
	 * @private
	 * @type {Boolean}
	 */
	this.selected = false;
	/**
	 * 포커스 여부
	 * @private
	 * @type {Boolean}
	 */
	this.focused = false;

	/**
	 * 편집점 지시자 인스턴스
	 * @type {AbBoxEditIndicator}
	 */
	this.indicator = AbCommon.isDefined(AbBoxEditIndicator) ? new AbBoxEditIndicator({ target: this }) : null;

	/**
	 * 회전 각도 (0~359)
	 * @type {Number}
	 */
	this.angle = options.angle || 0;

	/**
	 * 이미지 정보
	 * @type {AbIcons.Source}
	 */
	this.source = {
		data: source.data || '',
		width: source.width,
		height: source.height,
		
		render: {
			width: sourceRender.width || source.width,
			height: sourceRender.height || source.height
		},
	};

	if (AbCommon.allNumbers(options.x, options.y, options.width, options.height)){
		this.x = options.x;
		this.y = options.y;
		this.width = options.width;
		this.height = options.height;
	}else{
		var box = AbGraphics.box.rect(options.x1, options.y1, options.x2, options.y2);

		this.x = box.x;
		this.y = box.y;
		this.width = box.width;
		this.height = box.height;
	}

	this.style = {
	};
	
	// 내부 이미지 객체
	/**
	 * 이미지 로드 상태 문자열 또는 HTML 이미지 객체
	 * <table>
	 * <thead>
	 * <tr>
	 * 	<th>자료형</th><th>값</th><th>설명</th>
	 * </tr>
	 * </thead>
	 * <tbody>
	 * <tr>
	 * 	<td>String</td><td>loading</td><td>이미지를 로드중입니다.</td>
	 * </tr>
	 * <tr>
	 * 	<td>String</td><td>error</td><td>이미지 로드 중 오류가 발생했습니다.</td>
	 * </tr>
	 * <tr>
	 * 	<td>Image|HTMLImageElement</td><td></td><td>이미지를 준비했습니다.</td>
	 * </tr>
	 * </tbody>
	 * </table>
	 * @private
	 * @type {(String|Image|HTMLImageElement)}
	 */
	this.$image = null;
};
	
//-----------------------------------------------------------
//-----------------------------------------------------------
//-----------------------------------------------------------

AbShapeImage.prototype = {
	constructor: AbShapeImage,

	//-----------------------------------------------------------

	// cloneShape 시 어드바이스
	/**
	 * 복제 어드바이스 정보를 가져옵니다.
	 * <p>* AbCommon.cloneShape() 시 사용됩니다.
	 * @return {AbCommon.CloneAdvice} 
	 */
	adviceClone: function(){
		return {
			//moveProps: ['$image'],
			
			customProps: ['$image'],
			
			custom: function(name, object){
				return $(object).clone().get(0);
			},
		};
	},

	//-----------------------------------------------------------
	// 객체를 사용하기 위해 선 로드가 필요한 경우,
	// 엔진은 preload() 함수를 호출하고 대기한다.
	//-----------------------------------------------------------
	// prepare()는 객체 내부의 동기적 선행 작업을 해야 할때 사용되며,
	// preload()는 객체 내부의 비동기적 선행 작업을 해야 할때 사용된다.
	
	/**
	 * 비동기적 선행 작업을 진행합니다.
	 * <p>* 엔진은 초기화 작업 중 이 메서드의 작업이 완료될 떄까지 대기합니다.
	 * <dl>객체를 사용하기 위해 선행 준비 작업이 필요한 경우, 엔진은 preload() 함수를 호출하고 대기합니다.
	 * 	<dt>prepare()</dt><dd>객체 내부의 동기적 선행 작업을 해야 할때 사용됩니다.</dd>
	 * 	<dt>preload()</dt><dd>객체 내부의 비동기적 선행 작업을 해야 할때 사용됩니다.</dd>
	 * </dl>
	 * @param {ShapeObjectPreloadCallback} callback 콜백 함수
	 */
	preload: function(callback){
		if (this.$image || !this.source.data){
			callback('skip');
			return;
		}
		
		var renderWidth = this.source.width;
		var renderHeight = this.source.height;
		
		if (this.source.render && AbCommon.isNumber(this.source.render.width) && AbCommon.isNumber(this.source.render.height)){
			renderWidth = this.source.render.width;
			renderHeight = this.source.render.height;
		}
		
		AbCommon.loadImageExt(this.source.data, {
			width: renderWidth,
			height: renderHeight,
			
			success: function (img){
				this.$image = img;
				callback('ok');
			}.bind(this),
			
			error: function (e){
				console.log(e);
				
				this.$image = 'error';
				callback('error', e);
			}.bind(this),
		});
		
		this.$image = 'loading';
	},
	
	/**
	 * 필드 복제 전에 호출되는 메서드입니다.
	 * <p>* 이 메서드는 AbViewerEngine.createShape()에서 호출되는
	 * AbCommon.shapeProp()에서 필드를 복제 전 호출됩니다.
	 * @param {String} name 필드명
	 * @param {*} value 필드값
	 */
	cloneProperty: function(name, value){
		// 이미지 변경이 있는 지 확인하고,
		// 변경이 있다면, 내부 이미지 객체를 초기화한다.
		// 그러면, createShape() 메서드에서 preload()를 호출하고,
		// preload()에서 수정된 URL의 이미지 객체를 다시 생성할 수 있다.
		if (name === 'source.data'){
			if (value !== this.source.data)
				this.$image = null;
		}
	},

	//-----------------------------------------------------------

	/**
	 * 도형의 스타일 편집 정보를 가져옵니다.
	 * @return {ShapeStyleEditInfo} 도형 스타일 편집 정보
	 */
	styleDesc: function(){
		return {
			select: [],
			descs: [],
		};
	},

	//-----------------------------------------------------------

	/**
	 * 도형 준비작업을 수행합니다.
	 */
	prepare: function(){},
	/**
	 * 도형 정보를 초기화합니다.
	 */
	reset: function(){},

	//-----------------------------------------------------------

	/**
	 * 도형 속성 정보를 XML 문자열로 가져옵니다.
	 * @return {String} XML 문자열
	 */
	serialize: function(){
		var serializer = new AbShapeSerializer();

		serializer.add('name', this.name);
		serializer.add('type', this.type);
		serializer.add('shapeType', this.shapeType);
		serializer.add('shapeStyle', this.shapeStyle);

		serializer.add('token', this.token);

		serializer.add('angle', this.angle);
		serializer.add('x', Math.round(this.x));
		serializer.add('y', Math.round(this.y));
		serializer.add('width', Math.round(this.width));
		serializer.add('height', Math.round(this.height));

		var source = serializer.addGroup('source');
		serializer.add(source, 'data', this.source.data);
		serializer.add(source, 'width', this.source.width);
		serializer.add(source, 'height', this.source.height);

		var render = serializer.addGroup(source, 'render');
		serializer.add(render, 'width', this.source.render.width);
		serializer.add(render, 'height', this.source.render.height);

		return serializer.serialize();
	},

	//-----------------------------------------------------------
	
	/**
	 * 도형에 전달된 Notify를 처리합니다.
	 * @param {String} cmd Command Text
	 */
	notify: function(cmd){},

	//-----------------------------------------------------------

	/**
	 * 도형의 회전 각도를 설정합니다.
	 * @param {Number} degree 각도
	 */
	setAngle: function (degree){ this.angle = degree; },

	/**
	 * 도형을 이동합니다.
	 * @param {Number} x X좌표
	 * @param {Number} y Y좌표
	 * @param {Number} [increase] x, y가 증감량인지 여부
	 */
	move: function(x, y, increase){
		if (increase === true){
			this.x += x;
			this.y += y;
		}else{
			this.x = x;
			this.y = y;
		}
	},

	/**
	 * 도형의 상자 크기를 설정하거나 가져옵니다.
	 * @param {Number} [x1] 좌상단 X좌표
	 * @param {Number} [y1] 좌상단 Y좌표
	 * @param {Number} [x2] 우하단 X좌표
	 * @param {Number} [y2] 우하단 Y좌표
	 * @return {2Point} 인자가 없으면 크기를 리턴합니다.
	 */
	rect: function (){
		if (arguments.length == 4){
			var box = AbGraphics.box.rect(arguments[0], arguments[1], arguments[2], arguments[3]);
			this.x = box.x;
			this.y = box.y;
			this.width = box.width;
			this.height = box.height;
		}else{
			return {
				x1: this.x,
				y1: this.y,
				x2: this.x + this.width,
				y2: this.y + this.height
			};
		}
	},

	/**
	 * 도형의 상자 크기를 설정하거나 가져옵니다.
	 * @param {Number} [x] X좌표
	 * @param {Number} [y] Y좌표
	 * @param {Number} [width] 폭
	 * @param {Number} [height] 높이
	 * @return {Box} 인자가 없으면 크기를 리턴합니다.
	 */
	box: function (){
		if (arguments.length == 4){
			this.x = arguments[0];
			this.y = arguments[1];
			this.width = arguments[2];
			this.height = arguments[3];
		}else{
			return {
				x: this.x,
				y: this.y,
				width: this.width,
				height: this.height
			};
		}
	},

	/**
	 * 도형의 가장 자리 좌표를 가져옵니다.
	 * @return {Point}
	 */
	center: function (){ return { x: this.x + (this.width >> 1), y: this.y + (this.height >> 1) }; },
	
	/**
	 * 도형의 최소 크기를 가져옵니다.
	 * @return {Size}
	 */
	minimum: function() { return { width: 10, height: 10 }; },

	//-----------------------------------------------------------

	/**
	 * 도형의 여백 정보를 가져옵니다. (도형과 지시자 사이의 여백 크기)
	 * @return {Rect}
	 */
	padding: function() { return { left: 0, top: 0, right: 0, bottom: 0 }; },

	/**
	 * 도형의 상자가 대상 점/상자와 충돌하는 지 검사합니다.
	 * <table>
	 * <thead>
	 * <tr>
	 * 	<th>인자 수</th><th>인자0</th><th>인자1</th><th>인자2</th><th>인자3</th><th>설명</th>
	 * </tr>
	 * </thead>
	 * <tbody>
	 * <tr>
	 * 	<td>2개</td><td>x: Number</td><td>y: Number</td><td></td><td></td><td>도형 상자와 점의 충돌 검사</td>
	 * </tr>
	 * <tr>
	 * 	<td>4개</td><td>x: Number</td><td>y: Number</td><td>width: Number</td><td>height: Number</td><td>도형 상자와 상자의 충돌 검사</td>
	 * </tr>
	 * </tbody>
	 * </table>
	 * @param {Number} x 대상 점의 X좌표 또는 대상 상자의 X좌표
	 * @param {Number} y 대상 점의 Y좌표 또는 대상 상자의 Y좌표
	 * @param {Number} [w] 대상 상자의 폭
	 * @param {Number} [h] 대상 상자의 높이
	 * @return {Boolean} 충돌하면 true
	 */
	contains: function(x, y, w, h){ return this.indicator.contains.apply(this.indicator, arguments); },

	/**
	 * 좌표에 맞는 도형의 편집점을 가져옵니다.
	 * @param {Number} x X좌표
	 * @param {Number} y Y좌표
	 * @return {String} 편집점 (A|LT|CT|RT|LC|RC|LB|CB|RB)
	 */
	editable: function (x, y){ if (this.selected) return this.indicator.editable(x, y); return null; },

	/**
	 * 편집접에 대한 좌표를 가져옵니다.
	 * @param {String} point 편집점 (A|LT|CT|RT|LC|RC|LB|CB|RB)
	 * @return {Point} 편집점 좌표
	 */
	editPos: function (point){ return this.indicator.editPos(point); },

	/**
	 * 도형을 회전하거나 위치 및 크기를 설정합니다.
	 * @param {String} point 편집점 (A|LT|CT|RT|LC|RC|LB|CB|RB)
	 * @param {Number} px X좌표
	 * @param {Number} py Y좌표
	 */
	resize: function (point, px, py){ return this.indicator.resize(point, px, py); },

	/**
	 * 도형 크기를 측정합니다.
	 */
	measure: function(){},

	/**
	 * 도형 객체가 라인 충돌 판정에 대한 범위를 가져옵니다.
	 * @return {Number}
	 */
	validLineDistance: function () { return this.style.stroke && this.style.stroke.width ? this.style.stroke.width: 1; },

	//-----------------------------------------------------------

	/**
	 * 도형을 그립니다.
	 * @param {CanvasRenderingContext2D} ctx Canvas 2D Context
	 * @param {AbPage} page 페이지 인스턴스
	 * @param {Boolean} direct 생성 중 그리기 여부, true면 생성 중 그리기
	 */
	draw: function(ctx, page, direct){
		var scaleX = page ? page.scale.x : 1, scaleY = page ? page.scale.y : 1;

		AbShapeTool.beginRectDraw(this, ctx, page);
		
		if (this.$image && this.$image !== 'error' && this.$image !== 'loading'){
			try
			{
				ctx.drawImage(this.$image, 0, 0, this.width * scaleX, this.height * scaleY);
			}
			catch (e)
			{
				console.log('[SHAPE-IMAGE] Drawing Error');
				console.log(e);
			}
		}
		
		AbShapeTool.endDraw(this, ctx);
	},
}