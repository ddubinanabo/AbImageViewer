var AbVendor = {

	save: function(blob, filename){
		saveAs(blob, filename);
	},

	//-----------------------------------------------------------

	exif: function(type, src, callback){
		if (type === 'image' || type === 'file' || type === 'blob' || type === 'filereader'){
			EXIF.getData(src, function(){
				var metaData = EXIF.getAllTags(this);
				callback(metaData, this);
			});
		}else{
			throw new Error('[EXIF] Not support data');
		}
	},
	
	// canvg.js 라이브러리가 필요합니다.
	// - https://github.com/canvg/canvg.git
	// - StackBlur.js, rgbcolor.js가 필요합니다.
	renderSVG: function(svg, width, height, callback){
		var ctx = AbGraphics.canvas.createContext(width, height);
		
		canvg(ctx.canvas, svg, {
			log: true,
			renderCallback: function (dom){
				callback(ctx, dom);
			},
		});
	},

};