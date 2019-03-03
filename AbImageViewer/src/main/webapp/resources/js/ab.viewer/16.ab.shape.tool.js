/**
 * 도형 객체 툴킷
 * @namespace
 */
var AbShapeTool = {
	/**
	 * 도형 그리기 준비 작업을 합니다.
	 * <p>Context의 기준 좌표를 도형의 좌상단 좌표로 설정합니다.
	 * <p>* Context 매트릭스에 rotate와 translate를 적용합니다.
	 * @memberof AbShapeTool
	 * @param {ShapeObject} shape 도형 객체
	 * @param {CanvasRenderingContext2D} ctx Canvas 2D Context
	 * @param {AbPage} page 페이지(=이미지) 정보 객체
	 */
	beginRectDraw: function (shape, ctx, page, mode){
		var scaleX = page ? page.scale.x : 1, scaleY = page ? page.scale.y : 1;

		ctx.save();
		
		var tbox = shape.box();
		tbox.x *= scaleX;
		tbox.y *= scaleY;
		tbox.width *= scaleX;
		tbox.height *= scaleY;

		var cx = (tbox.width >> 1), cy = (tbox.height >> 1);
		if (shape.angle){
			ctx.translate(tbox.x + cx, tbox.y + cy);
			ctx.rotate(AbGraphics.angle.deg2rad(shape.angle));
			ctx.translate(-cx, -cy);
		}else{
			ctx.translate(tbox.x, tbox.y);
		}
	},

	/**
	 * 설정한 도형의 매트릭스를 복구하고, 편집 지시자를 그립니다.
	 * @memberof AbShapeTool
	 * @param {ShapeObject} shape 도형 객체
	 * @param {CanvasRenderingContext2D} ctx Canvas 2D Context
	 */
	endDraw: function (shape, ctx, drawIndicator){
		if (!AbCommon.isBool(drawIndicator)) drawIndicator = true;

		// var box = shape.box();
		// ctx.strokeStyle = 'black';
		// ctx.lineWidth = 1;
		// ctx.font = '16px verdana';
		// ctx.scale(1, 1);
		// ctx.strokeText('테스트', 35, 35);
		
		ctx.restore();
		
		/*
		// 바운더리 확인
		var b = AbGraphics.angle.bounds(this.angle, this.x, this.y, this.width, this.height);

		ctx.save();
		ctx.strokeStyle = 'yellow';
		ctx.strokeRect(b.x, b.y, b.width, b.height);
		ctx.restore();
		*/

		if (shape.selected && drawIndicator)
			shape.indicator.draw(ctx);
	},
};