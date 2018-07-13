var AbShapeTool = {
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

	endDraw: function (shape, ctx){
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

		if (shape.selected)
			shape.indicator.draw(ctx);
	},
};