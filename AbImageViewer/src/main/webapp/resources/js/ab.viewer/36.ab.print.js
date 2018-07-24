var AbPrint = {
	transform: function (e, value){
		e.css('-webkit-transform', value);
		e.css('-moz-transform', value);
		e.css('-ms-transform', value);
		e.css('-o-transform', value);
		e.css('transform', value);

		e.css('-webkit-transform-origin: top left;');
		e.css('-moz-transform-origin: top left;');
		e.css('-ms-transform-origin: top left;');
		e.css('-o-transform-origin: top left;');
		e.css('transform-origin: top left;');
	},
	
	isLandscapeImage: function (img){
		return img.width > img.height;
	},

	landscape: function (img){
		var ctx = AbGraphics.canvas.createContext(img.height, img.width);

		var angle = AbGraphics.angle.increase(0, -90);
		var w = img.width, h = img.height;
		var cp = AbGraphics.angle.correctDisplayCoordinate(angle, w, h);

		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		ctx.rotate(AbGraphics.angle.deg2rad(angle));
		ctx.translate(-cp.x, -cp.y);
		ctx.drawImage(img, 0, 0);

		return AbGraphics.canvas.toImage(ctx);
	},

	item: function(target, printPage, options){
		var e = $('<div class="print portrait"/>');
		target.append(e);

		var img = AbCommon.isString(printPage) ? printPage : printPage.image || printPage.source;
		if (img instanceof AbImage) img = img.imgInfo.url;
		else if (!AbCommon.isString(img)) img = img.src;

		return AbCommon.loadImage(img)
			.then(function (eimg){
				if (options && options.orientation === 'auto'){
					if (eimg.width > eimg.height){
						var src = AbPrint.landscape(eimg);
						return AbCommon.loadImage(src);
					}
				}				
				return eimg;
			})
			.then(function (eimg){
				var ei = $('<img/>');
				ei.attr('src', eimg.src);

				var ce = $('<div/>');

				ce.append(ei);
				e.append(ce);

				return e;
			});
	},

	generate: function (target, printPages, options){
		if (!options) options = {};

		var termOptions = options.term || {};
		if (!termOptions.hasOwnProperty('resolve')) termOptions.resolve = 100;

		if (!options.hasOwnProperty('orientation')) options.orientation = 'auto';

		if (printPages instanceof AbPageCollection){
			printPages = printPages.source;
		}else if (!$.isArray(printPages)){
			printPages = [printPages];
		}

		var ps = [];
		var siz = printPages.length;
		for (var i=0; i < siz; i++){
			var printPage = printPages[i];

			var p = AbPrint.item(target, printPage, options);

			ps.push(p);
		}

		return AbCommon.promiseAll(ps, options.progress, options);
	},
	
	generateHtml: function (imageUrls, openHtml, closeHtml){
		var htmls = [];
		
		if (openHtml) htmls.push(openHtml);
		
		var siz = imageUrls.length;
		for (var i=0; i < siz; i++){
			var url = imageUrls[i];

			htmls.push('<div class="print portrait">');
			htmls.push('<div>');
			htmls.push('<img src="'+url+'"/>');
			htmls.push('</div>');
			htmls.push('</div>');
		}

		if (closeHtml) htmls.push(closeHtml);
		
		return htmls.join('');
	},
	
	generateCoverHtml: function (imageUrls, prefix, openHtml, closeHtml){
		var htmls = [];
		
		if (openHtml) htmls.push(openHtml);
		
		var siz = imageUrls.length;
		for (var i=0; i < siz; i++){
			var url = imageUrls[i];

			htmls.push('<div class="print portrait">');
			htmls.push('<div id="'+(prefix ? prefix + i : '' + i)+'">');
			htmls.push('</div>');
			htmls.push('</div>');
		}

		if (closeHtml) htmls.push(closeHtml);
		
		return htmls.join('');
	},
};