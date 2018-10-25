/**
 * 객체 도형 원형
 * <p>* 이 클래스는 가이드용입니다. 이 클래스를 상속하거나 참고하여 도형 객체를 작성하세요.
 * <p>* 도형의 위치와 크기는 옵션에 x/y/width/height 또는 x1/y1/x2/y2 중 택일하여 설정합니다.
 * <dl>객체를 사용하기 위해 선행 준비 작업이 필요한 경우, 엔진은 preload() 함수를 호출하고 대기합니다.
 * 	<dt>prepare()</dt><dd>객체 내부의 동기적 선행 작업을 해야 할때 사용됩니다.</dd>
 * 	<dt>preload()</dt><dd>객체 내부의 비동기적 선행 작업을 해야 할때 사용됩니다.</dd>
 * </dl>
 * @class
 * @abstract
 */
var AbShapeObject = function(){
	// 이 클래스는 가이드용입니다. 이 클래스를 상속하거나 참고하여 도형 객체를 작성하세요.
	/**
	 * 명칭
	 * @type {String}
	 * @default image
	 */
	this.name = 'object';		// name of shape
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
	this.shapeType = 'shape';	// shape, polygon, image
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
	 * @type {(AbBoxEditIndicator|AbLineEditIndicator)}
	 */
	this.indicator = AbCommon.isDefined(AbBoxEditIndicator) ? new AbBoxEditIndicator({ target: this }) : null;

	/**
	 * 회전 각도 (0~359)
	 * @type {Number}
	 */
	this.angle = options.angle || 0;

	// editor에 생성시 크기를 지정할 필요없음을 명시
	/**
	 * &lt;&lt;optional&gt;&gt;
	 * 생성 시 크기 설정 여부를 명시합니다.
	 * <p>* 엔진은 이 필드를 확인하고 값이 auto가 아니면 도형에 크기 정보를 설정합니다.
	 */
	this.creationSize = 'auto';
	
	// editor에 좌료를 수집해야 한다는 것을 명시
	/**
	 * &lt;&lt;optional&gt;&gt;
	 * 스트로크를 수집한다는 것을 명시합니다.
	 * <p>*엔진은 이 필드를 확인하고 도형에 좌표를 전달합니다.
	 * @type {Boolean}
	 */
	this.collectPoints = true;

};

AbShapeObject.prototype = {
	constructor: AbShapeObject,

	/**
	 * 도형을 이동합니다.
	 * @param {Number} x X좌표
	 * @param {Number} y Y좌표
	 * @param {Number} [increase] x, y가 증감량인지 여부
	 */
	move: function (x, y, increase){},

	/**
	 * 도형의 스타일 편집 정보를 가져옵니다.
	 * @return {ShapeStyleEditInfo} 도형 스타일 편집 정보
	 */
	styleDesc: function(){},

	/**
	 * 도형의 회전 각도를 설정합니다.
	 * @param {Number} degree 각도
	 */
	setAngle: function (degree){},

	/**
	 * 도형의 가장 자리 좌표를 가져옵니다.
	 * @return {Point}
	 */
	center: function (){},

	/**
	 * 도형의 여백 정보를 가져옵니다. (도형과 지시자 사이의 여백 크기)
	 * @return {Rect}
	 */
	padding: function(){},

	/**
	 * 도형의 상자 크기를 설정하거나 가져옵니다.
	 * @param {Number} [x1] 좌상단 X좌표
	 * @param {Number} [y1] 좌상단 Y좌표
	 * @param {Number} [x2] 우하단 X좌표
	 * @param {Number} [y2] 우하단 Y좌표
	 * @return {2Point} 인자가 없으면 크기를 리턴합니다.
	 */
	rect: function (){},

	/**
	 * 도형의 상자 크기를 설정하거나 가져옵니다.
	 * @param {Number} [x] X좌표
	 * @param {Number} [y] Y좌표
	 * @param {Number} [width] 폭
	 * @param {Number} [height] 높이
	 * @return {2Point} 인자가 없으면 크기를 리턴합니다.
	 */
	box: function (){},

	/**
	 * 도형의 상자가 대상 점/상자와 충돌하는 지 검사합니다.
	 * <p>* 배경색이 없는 경우, 외곽선과의 충돌을 검사합니다.
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
	contains: function(x, y, w, h){},

	/**
	 * 좌표에 맞는 도형의 편집점을 가져옵니다.
	 * @param {Number} x X좌표
	 * @param {Number} y Y좌표
	 * @return {String} 편집점 (A|LT|CT|RT|LC|RC|LB|CB|RB)
	 */
	editable: function (x, y){},

	/**
	 * 편집접에 대한 좌표를 가져옵니다.
	 * @param {String} point 편집점 (A|LT|CT|RT|LC|RC|LB|CB|RB)
	 * @return {Point} 편집점 좌표
	 */
	editPos: function (point){},

	/**
	 * 도형을 회전하거나 위치 및 크기를 설정합니다.
	 * @param {String} point 편집점 (A|LT|CT|RT|LC|RC|LB|CB|RB)
	 * @param {Number} px X좌표
	 * @param {Number} py Y좌표
	 */
	resize: function (point, px, py){},

	/**
	 * 도형 크기를 측정합니다.
	 */
	measure: function(){},

	/**
	 * 도형에 전달된 Notify를 처리합니다.
	 * @param {String} cmd Command Text
	 */
	notify: function(cmd){},

	/**
	 * 도형 속성 정보를 XML 문자열로 가져옵니다.
	 * @return {String} XML 문자열
	 */
	serialize: function(){},

	/**
	 * 도형 준비작업을 수행합니다.
	 */
	prepare: function(){},

	/**
	 * 도형 정보를 초기화합니다.
	 */
	reset: function(){},

	/**
	 * 도형을 그립니다.
	 * @param {CanvasRenderingContext2D} ctx Canvas 2D Context
	 * @param {AbPage} page 페이지 인스턴스
	 * @param {Boolean} direct 생성 중 그리기 여부, true면 생성 중 그리기
	 */
	draw: function(ctx, page, direct){},

	/**
	 * &lt;&lt;optional&gt;&gt;
	 * 비동기적 선행 작업을 진행합니다.
	 * <p>* 엔진은 초기화 작업 중 이 메서드의 작업이 완료될 떄까지 대기합니다.
	 * <dl>객체를 사용하기 위해 선행 준비 작업이 필요한 경우, 엔진은 preload() 함수를 호출하고 대기합니다.
	 * 	<dt>prepare()</dt><dd>객체 내부의 동기적 선행 작업을 해야 할때 사용됩니다.</dd>
	 * 	<dt>preload()</dt><dd>객체 내부의 비동기적 선행 작업을 해야 할때 사용됩니다.</dd>
	 * </dl>
	 * @param {ShapeObjectPreloadCallback} callback 콜백 함수
	 */
	preload: function(callback){},

	/**
	 * &lt;&lt;optional&gt;&gt;
	 * 복제 어드바이스 정보를 가져옵니다.
	 * <p>* AbCommon.cloneShape() 시 사용됩니다.
	 * @return {AbCommon.CloneAdvice} 
	 */
	adviceClone: function(){},

	/**
	 * &lt;&lt;optional&gt;&gt;
	 * 비동기적 선행 작업을 진행합니다.
	 * <p>* 이 메서드는 AbViewerEngine.createShape()에서 호출되는
	 * AbCommon.shapeProp()에서 필드를 복제 전 호출됩니다.
	 * @param {String} name 필드명
	 * @param {*} value 필드값
	 */
	cloneProperty: function(name, value){},

	/**
	 * &lt;&lt;optional&gt;&gt;
	 * 도형의 최소 크기를 가져옵니다.
	 * <p>* 기본값(단위: 픽셀): 10x10
	 * @return {Size}
	 */
	minimum: function() {},

	/**
	 * &lt;&lt;optional&gt;&gt;
	 * 도형 객체가 라인 충돌 판정에 대한 범위를 가져옵니다.
	 * @return {Number}
	 */
	validLineDistance: function () {},

	/**
	 * &lt;&lt;optional&gt;&gt;
	 * 도형 생성 방법을 가져옵니다.
	 * @return {String} 생성 방법, click이면 클릭 시 고정된 크기의 도형을 생성합니다.
	 */
	creationStyle: function(){},

	/**
	 * &lt;&lt;optional&gt;&gt;
	 * 주어진 크기로 설정이 가능한 지 확인합니다.
	 * @param {Number} width 폭
	 * @param {Number} height 높이
	 * @return {ShapeObjectResizeResult} 크기 조정 결과 정보
	 */
	resizable: function (width, height){},

	/**
	 * &lt;&lt;optional&gt;&gt;
	 * 사용자가 텍스트 영역을 클릭했는지 확인합니다.
	 * @param {CanvasRenderingContext2D} ctx Canvas 2D Context
	 * @param {Number} x X좌표
	 * @param {Number} y Y좌표
	 * @return {Boolean} 텍스트 영역 안이면 true
	 */
	testInlineEdit: function (ctx, x, y){},

	/**
	 * &lt;&lt;optional&gt;&gt;
	 * 텍스트 편집을 시작합니다.
	 * @param {AbViewerEngine} engine 엔진 인스턴스
	 */
	inlineEdit: function(engine){},

	/**
	 * &lt;&lt;optional&gt;&gt;
	 * 복구 최소 크기를 가져옵니다.
	 * <p>* 복구 크기는 도형 추가 중 배경을 복구하는 영역의 크기를 말합니다.
	 * @return {Size} 크기
	 */
	restoreMinimumSize: function() {},

	/**
	 * &lt;&lt;optional&gt;&gt;
	 * 좌표를 스트로크 경로에 추가합니다.
	 * @param {Number} x 
	 * @param {Number} y 
	 */
	addPoint: function(x, y){},

	/**
	 * &lt;&lt;optional&gt;&gt;
	 * 스트로크 졍로에 좌표 등록을 마칩니다.
	 */
	endPoint: function(){},

	/**
	 * &lt;&lt;optional&gt;&gt;
	 * 생성 중 도형을 그립니다.
	 * <p>* 펜, 형광펜 등 스르토크를 그리는 데 주로 사용됩니다.
	 * @param {CanvasRenderingContext2D} ctx Canvas 2D Context
	 * @param {AbPage} page 페이지 인스턴스
	 * @param {AbViewerEngineSelection} selection 엔진 선택영역 정보
	 */
	creationDraw: function (ctx, page, selection){},
	
	/**
	 * &lt;&lt;optional&gt;&gt;
	 * 생성 시 최소 크기를 가져옵니다.
	 * @return {Size}
	 */
	creationMinimum: function() {},
};
