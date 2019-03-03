/**
 * 정보 면 렌더링 정보
 * @typedef {Object} AbImageInfoRenderer.RenderData
 * @property {String} title 창 타이틀
 * @property {String} html HTML 문자열
 */

/**
 * 이미지 정보 렌더러
 * @namespace
 */
var AbImageInfoRenderer = {
	/**
	 * {@link AbImageLoader.From|이미지 획득처} 별 정보 화면 렌더링 정보를 가져옵니다.
	 * @see {@link AbImageLoader.From} 이미지 획득처
	 * @memberof AbImageInfoRenderer
	 * @param {AbPage} page {@link AbPage|페이지} 인스턴스
	 * @param {Object} [options] 옵션
	 * @param {Boolean} [options.origin] 정보 데이터의 원본 데이터 사용 여부
	 * @return {AbImageInfoRenderer.RenderData} 정보 화면 렌더링 정보
	 */
	render: function (page, options){
		if (!options) options = {};

		/**
		 * @type {AbImageLoader.From}
		 */
		var from = page.infoFrom();
		/**
		 * @type {AbImage.Metadata}
		 */
		var info = page.info();
		if (options.origin === true){
			if (info.originMeta) info = info.originMeta;
			if (info.from) from = info.from;
		}

		var method = this['render$' + from];
		if (AbCommon.isFunction(method)){
			return method.bind(this)(page, info);
		}
		return null;
	},

	/**
	 * 이미지 방향 정보의 표시 내용을 가져옵니다.
	 * @memberof AbImageInfoRenderer
	 * @private
	 * @param {Number} value 이미지 방향
	 * @return {String} 표시 내용
	 */
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
	
	/**
	 * 해상도 단위 정보의 설명을 가져옵니다.
	 * @memberof AbImageInfoRenderer
	 * @private
	 * @param {Number} value 해상도 단위 정보
	 * @return {String} 설명
	 */
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
	
	/**
	 * 해상도 단위 정보의 표시 내용을 가져옵니다.
	 * @memberof AbImageInfoRenderer
	 * @private
	 * @param {Number} value 해상도 단위 정보
	 * @return {String} 표시 내용
	 */
	resolutionUnit: function (value){
		var s = '';
		switch(value){
		case 2: s = 'DPI'; break;
		case 3: s = 'DPCM'; break;
		default: s = ''; break;
		}
		return s;
	},
	
	/**
	 * 날짜를 포매팅합니다.
	 * @memberof AbImageInfoRenderer
	 * @private
	 * @param {String} value YMDHIS 형식 날짜
	 * @return {String} Y-M-D H-I-S 형식 날짜
	 */
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
	
	/**
	 * 센티미터를 인치로 변환합니다.
	 * @memberof AbImageInfoRenderer
	 * @private
	 * @param {Number} value 센티미터
	 * @return {Number} 인치
	 */
	cm2inch: function (value){ return value / 2.54; },
	/**
	 * 인치를 센티미터로 변환합니다.
	 * @memberof AbImageInfoRenderer
	 * @private
	 * @param {Number} value 인치
	 * @return {Number} 센티미터
	 */
	inch2cm: function (value){ return value * 2.54; },

	/**
	 * EXIF 정보를 렌더링합니다.
	 * @memberof AbImageInfoRenderer
	 * @private
	 * @param {AbPage} page {@link AbPage|페이지} 인스턴스
	 * @param {AbImage.Metadata} info 이미지 메타데이터
	 * @return {String} HTML 문자열
	 */
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
	
	/**
	 * 로컬 이미지의 메타데이터를 렌더링합니다.
	 * @memberof AbImageInfoRenderer
	 * @private
	 * @param {AbPage} page {@link AbPage|페이지} 인스턴스
	 * @param {AbImage.Metadata} info 이미지 메타데이터
	 * @return {AbImageInfoRenderer.RenderData} 정보 화면 렌더링 정보
	 */
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
	
	/**
	 * 컨버팅된 문서 이미지의 메타데이터를 렌더링합니다.
	 * @memberof AbImageInfoRenderer
	 * @private
	 * @param {AbPage} page {@link AbPage|페이지} 인스턴스
	 * @param {AbImage.Metadata} info 이미지 메타데이터
	 * @return {AbImageInfoRenderer.RenderData} 정보 화면 렌더링 정보
	 */
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
	
	/**
	 * 서버 이미지의 메타데이터를 렌더링합니다.
	 * @memberof AbImageInfoRenderer
	 * @private
	 * @param {AbPage} page {@link AbPage|페이지} 인스턴스
	 * @param {AbImage.Metadata} info 이미지 메타데이터
	 * @return {AbImageInfoRenderer.RenderData} 정보 화면 렌더링 정보
	 */
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