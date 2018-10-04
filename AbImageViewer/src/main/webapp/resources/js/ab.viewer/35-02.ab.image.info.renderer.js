var AbImageInfoRenderer = {
	render: function (page){
		var from = page.infoFrom();
		var info = page.info();
		
		var method = this['render$' + from];
		if (AbCommon.isFunction(method)){
			return method.bind(this)(page, info);
		}
		return null;
	},
	
	orientationDesc: function (value){
		var s = '';
		switch(value){
		case 1: s = 'Normal'; break;
		case 2: s = 'Mirror horizontal'; break;
		case 3: s = 'Rotate 180'; break;
		case 4: s = 'Mirror vertical'; break;
		case 5: s = 'Mirror horizontal and rotate 270 CW'; break;
		case 6: s = 'Rotate 90 CW '; break;
		case 7: s = 'Mirror horizontal and rotate 90 CW'; break;
		case 8: s = 'Rotate 270 CW'; break;
		default: s = 'Unknown'; break;
		}
		return s + ' ('+value+')';
	},
	
	resolutionUnitDesc: function (value){
		var s = '';
		switch(value){
		case 1: s = 'None'; break; // not standard EXIF
		case 2: s = 'Inches'; break;
		case 3: s = 'cm'; break;
		default: s = 'Unknown'; break;
		}
		return s + ' ('+value+')';
	},
	
	resolutionUnit: function (value){
		var s = '';
		switch(value){
		case 2: s = 'DPI'; break;
		case 3: s = 'DPCM'; break;
		default: s = ''; break;
		}
		return s;
	},
	
	dateFormat: function (value){
		if (!value) return value;
		
		var y = value.substr(0, 4);
		var m = value.substr(4, 2);
		var d = value.substr(6, 2);
		
		var text = y+'-'+m+'-'+d;
		if (value.length > 8){
			var h = value.substr(8, 2);
			var i = value.substr(10, 2);
			var s = value.substr(12, 2);
			
			text += ' ' + h + ':' + i + ':' + s;
		}
		return text;
	},
	
	cm2inch: function (value){ return value / 2.54; },
	inch2cm: function (value){ return value * 2.54; },
	
	renderExif: function (info){
		var html = '';
		
		if (info && info.exif){
			var exif = info.exif;
			
			html += '<tr class="title"><th colspan="2">EXIF 정보</th></tr>';
			
			var runit = '';
			if (exif.hasOwnProperty('resolutionUnit')){
				runit = this.resolutionUnit(exif.resolutionUnit);
				if (runit) runit = ' ' + runit;
			}
			
			if (exif.hasOwnProperty('make')) html += '<tr><th>제조사</th><td>' + AbCommon.escape(exif.make) + '</td></tr>';
			if (exif.hasOwnProperty('model')) html += '<tr><th>모델</th><td>' + AbCommon.escape(exif.model) + '</td></tr>';
			if (exif.hasOwnProperty('software')) html += '<tr><th>소프트웨어</th><td>' + AbCommon.escape(exif.software) + '</td></tr>';
			if (exif.hasOwnProperty('datetime')) html += '<tr><th>촬영일시</th><td>' + this.dateFormat(exif.datetime) + '</td></tr>';
			if (exif.hasOwnProperty('orientation')) html += '<tr><th>사진방향</th><td>' + this.orientationDesc(exif.orientation) + '</td></tr>';
			if (exif.hasOwnProperty('xdimension') && exif.hasOwnProperty('ydimension'))
				html += '<tr><th>이미지 크기</th><td>' + exif.xdimension + 'x' + exif.ydimension + '</td></tr>';
			if (exif.hasOwnProperty('xresolution')) html += '<tr><th>가로 해상도</th><td>' + exif.xresolution + runit + '</td></tr>';
			if (exif.hasOwnProperty('yresolution')) html += '<tr><th>세로 해상도</th><td>' + exif.yresolution + runit + '</td></tr>';
			if (exif.hasOwnProperty('resolutionUnit')) html += '<tr><th>해상도 단위</th><td>' + this.resolutionUnitDesc(exif.resolutionUnit) + '</td></tr>';
			
			if (exif.gps){
				var gps = exif.gps;
				
				html += '<tr><th>위도</th><td>' + AbExifMetaReader.gpsText(gps.lat) + (gps.latRef ? ' ' + gps.latRef : '') + '</td></tr>';
				html += '<tr><th>경도</th><td>' + AbExifMetaReader.gpsText(gps.lng) + (gps.lngRef ? ' ' + gps.lngRef : '') + '</td></tr>';
				
				if (gps.alt){
					var val = Math.round(gps.alt);
					if (gps.altRef === 1) val = '해수면 밑 ' + val;
					
					html += '<tr><th>고도</th><td>' + val + 'm</td></tr>';
				}
			}
		}
		
		return html;
	},
	
	render$local: function(page, info){
		var hasOriginInfo = AbCommon.isSetted(info.originName);

		var data = hasOriginInfo ? info : info.origin;
		if (!data) return null;
		
		var html = '<table>';
		
		if (data.originName) html += '<tr><th>원본명</th><td>' + AbCommon.escape(data.originName) + '</td></tr>';
		//if (data.originSize) html += '<tr><th>원본크기</th><td>' + AbCommon.byteScope(data.originSize) + '</td></tr>';
		if (data.originPages > 1){
			html += '<tr><th>원본의 이미지 수</th><td>' + data.originPages + '</td></tr>';
			html += '<tr><th>원본의 이미지 인덱스</th><td>' + data.originIndex + '</td></tr>';
		}

		if (hasOriginInfo){
			html += '<tr><td>&nbsp;</td></tr>';
			html += '<tr class="title"><th colspan="2">이미지 정보</th></tr>';
		}
		
		html += '<tr><th>이름</th><td>' + AbCommon.escape(data.name) + '</td></tr>';
		//html += '<tr><th>크기</th><td>' + AbCommon.byteScope(data.size) + '</td></tr>';
		if (data.type) html += '<tr><th>타입</th><td>' + AbCommon.escape(data.type) + '</td></tr>';
		
		html += this.renderExif(info);		
		html += '</table>';
		
		return {
			title: '로컬 이미지 정보',
			html: html,
		};
	},
	
	render$doc: function (page, info){
		var data = info;
		if (!data) return null;
		
		var html = '<table>';
		if (data.originName) html += '<tr><th>문서명</th><td>' + AbCommon.escape(data.originName) + '</td></tr>';
		//if (data.originSize) html += '<tr><th>문서크기</th><td>' + AbCommon.byteScope(data.originSize) + '</td></tr>';
		if (data.originPages > 1){
			html += '<tr><th>문서의 페이지 수</th><td>' + data.originPages + '</td></tr>';
			html += '<tr><th>문서의 페이지 인덱스</th><td>' + data.originIndex + '</td></tr>';
		}
		
		html += '<tr><td>&nbsp;</td></tr>';
		html += '<tr class="title"><th colspan="2">이미지 정보</th></tr>';
		
		if (data.name) html += '<tr><th>이름</th><td>' + AbCommon.escape(data.name) + '</td></tr>';
		//if (data.size) html += '<tr><th>크기</th><td>' + AbCommon.byteScope(data.size) + '</td></tr>';
		if (data.type) html += '<tr><th>타입</th><td>' + AbCommon.escape(data.type) + '</td></tr>';
		
		html += this.renderExif(info);		
		html += '</table>';
		
		return {
			title: '문서 정보',
			html: html,
		};
	},
	
	render$server: function (page, info){
		var data = info;
		if (!data) return null;
		
		var html = '<table>';
		
		if (data.originName) html += '<tr><th>원본명</th><td>' + AbCommon.escape(data.originName) + '</td></tr>';
		//if (data.originSize) html += '<tr><th>원본크기</th><td>' + AbCommon.byteScope(data.originSize) + '</td></tr>';
		if (data.originPages > 1){
			html += '<tr><th>원본의 이미지 수</th><td>' + data.originPages + '</td></tr>';
			html += '<tr><th>원본의 이미지 인덱스</th><td>' + data.originIndex + '</td></tr>';
		}
		
		if (data.name) html += '<tr><th>이름</th><td>' + AbCommon.escape(data.name) + '</td></tr>';
		//if (data.size) html += '<tr><th>크기</th><td>' + AbCommon.byteScope(data.size) + '</td></tr>';
		if (data.type) html += '<tr><th>타입</th><td>' + AbCommon.escape(data.type) + '</td></tr>';
		
		html += this.renderExif(info);
		html += '</table>';
		
		return {
			title: '서버 이미지 정보',
			html: html,
		};
	},
};