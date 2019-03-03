/**
 * 선택영역 스타일 정보
 * @typedef {Object} AbViewerEngineSelection.Style
 * @property {CSS_Color} color=rgba(202,229,255,0.27) 배경색
 * @property {Object} stroke 외곽선 스타일
 * @property {Number} stroke.width=1 선 굵기
 * @property {CSS_Color} stroke.color=#99CCFF 선 색상
 */

/**
 * 캔버스 좌표계 선택영역 좌표
 * @typedef {Object} AbViewerEngineSelection.CanvasCoordData
 * @property {Point} start 선택영역 시작점 좌표
 * @property {Point} end 선택영역 끝점 좌표
 * @property {Point} prev 선택영역 끝점의 이전 좌표
 */


/**
 * 엔진 선택영역 정보
 * @class
 * @param {Object} options 옵션
 * @param {AbViewerEngine} options.engine 엔진 인스턴스
 */
function AbViewerEngineSelection(options){
	if (!options) options = {};

	/**
	 * 엔진 인스턴스
	 * @type {AbViewerEngine}
	 */
	this.engine = options.engine || null;

	/**
	 * 현재 편집 상태
	 * <dl>
	 * 	<dt>page-move</dt><dd>확대된 이미지의 위치 변경</dd>
	 * 	<dt>selection</dt><dd>도형 선택</dd>
	 * 	<dt>creation</dt><dd>도형 생성</dd>
	 * 	<dt>resize</dt><dd>도형 변경 (회전/위치/크기)</dd>
	 * 	<dt>move</dt><dd>도형 이동</dd>
	 * 	<dt>inline</dt><dd>도형 인라인 편집</dd>
	 * </dl>
	 * @type {String}
	 */
	this.mode = null;
	/**
	 * 도형 생성 중인 도형 객체
	 * @type {ShapeObject}
	 */
	this.target = null;

	/**
	 * 도형 편집점 (A|LT|CT|RT|LC|RC|LB|CB|RB)
	 * @type {String}
	 */
	this.edit = null;
	/**
	 * 편집중인 도형 객체
	 * @type {ShapeObject}
	 */
	this.editTarget = null;

	/**
	 * 클릭된 도형 객체
	 * @type {ShapeObject}
	 */
	this.clickTarget = null;

	/**
	 * 드래깅 방향
	 * <dl>
	 * 	<dt>0</dt><dd>{@link AbViewerEngine#NONE|AbViewerEngine.NONE}: 방향없음</dd>
	 * 	<dt>1</dt><dd>{@link AbViewerEngine#DIR_HORIZ|AbViewerEngine.DIR_HORIZ}: 수평방향</dd>
	 * 	<dt>2</dt><dd>{@link AbViewerEngine#DIR_VERT|AbViewerEngine.DIR_VERT}: 수직방향</dd>
	 * </dl>
	 * @type {Number}
	 */
	this.direction = 0;

	/**
	 * 선택영역 스타일 정보
	 * @type {AbViewerEngineSelection.Style}
	 */
	this.style = {
		stroke: {
			width: 1,
			color: '#99CCFF',
		},
		color: 'rgba(202,229,255,0.27)',
	};

	/**
	 * 선택영역 시작점 좌표
	 * @type {Point}
	 */
	this.start = { x: 0, y: 0 };
	/**
	 * 선택영역 끝점 좌표
	 * @type {Point}
	 */
	this.end = { x: 0, y: 0 };
	/**
	 * 선택영역 끝점의 이전 좌표
	 * @type {Point}
	 */
	this.prev = { x: 0, y: 0 };

	/**
	 * 캔버스 좌표계 좌표
	 * @type {AbViewerEngineSelection.CanvasCoordData}
	 */
	this.canvas = {
		start: { x: 0, y: 0 },
		end: { x: 0, y: 0 },
		prev: { x: 0, y: 0 },
	};

};

AbViewerEngineSelection.prototype = {
	constructor: AbViewerEngineSelection,

	/**
	 * 드래깅 여부를 가져옵니다.
	 * @method
	 * @return {Boolean}
	 */
	dragged: function(){ return this.canvas.end.x - this.canvas.start.x != 0 || this.canvas.end.y - this.canvas.start.y != 0; },

	/**
	 * 선택영역의 시작점과 끝점의 최소/최대 좌표를 가져옵니다.
	 * @return {2Point}
	 */
	swap: function (){ return AbGraphics.rect(this.start.x, this.start.y, this.end.x, this.end.y); },
	/**
	 * 선택영역의 상자 크기를 가져옵니다.
	 * @return {Box}
	 */
	box: function(){ return AbGraphics.box.rect(this.start.x, this.start.y, this.end.x, this.end.y); },

	// 드로잉 한 좌표 (화면 좌표)
	/**
	 * 화면에 그린 영역의 크기 (캔버스 좌표계)
	 * <p>* 엔진은 이 크기로 화면을 복구합니다.
	 * @type {Box}
	 */
	drawed: null,

	/**
	 * 선택을 초기화합니다.
	 * <p>* 생성중인 도형 객체가 있으면 엔진에서 cancel을 Notify합니다.
	 */
	reset: function (){
		if (this.target){
			this.engine.notifyObservers('cancel', 'shape.create');
		}

		this.mode = null;
		this.target = null;
		this.edit = null;
		this.editTarget = null;
		this.clickTarget = null;
	},

};