var AbImageInfoRenderer = {
	render: function (page){
		var from = page.infoFrom();
		var info = page.info();
		
		var method = this['render$' + from];
		if (AbCommon.isFunction(method)){
			return method(page, info);
		}
		return null;
	},
	
	render$local: function(page, info){
		var data = info.origin;
		if (!data) return null;
		
		var html = '<table>';
		
		if (data.originName)
			html += '<tr><th>원본명</th><td>' + AbCommon.escape(data.originName) + '</td></tr>';
		if (data.originSize)
			html += '<tr><th>원본크기</th><td>' + AbCommon.byteScope(data.originSize) + '</td></tr>';
		if (data.originPages > 1){
			html += '<tr><th>원본의 이미지 수</th><td>' + data.originPages + '</td></tr>';
			html += '<tr><th>원본의 이미지 인덱스</th><td>' + data.originIndex + '</td></tr>';
		}
		
		html += '<tr><th>이름</th><td>' + AbCommon.escape(data.name) + '</td></tr>';
		html += '<tr><th>크기</th><td>' + AbCommon.byteScope(data.size) + '</td></tr>';
		if (data.type)
			html += '<tr><th>타입</th><td>' + AbCommon.escape(data.type) + '</td></tr>';
		
		if (AbCommon.isSetted(data.pages)) html += '<tr><th>이미지 수</th><td>' + data.pages + '</td></tr>';
		if (AbCommon.isSetted(data.index)) html += '<tr><th>인덱스</th><td>' + data.index + '</td></tr>';
		
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
		if (data.originName)
			html += '<tr><th>문서명</th><td>' + AbCommon.escape(data.originName) + '</td></tr>';
		if (data.originSize)
			html += '<tr><th>문서크기</th><td>' + AbCommon.byteScope(data.originSize) + '</td></tr>';
		if (data.originPages > 1){
			html += '<tr><th>문서의 페이지 수</th><td>' + data.originPages + '</td></tr>';
			html += '<tr><th>문서의 페이지 인덱스</th><td>' + data.originIndex + '</td></tr>';
		}
		if (data.name)
			html += '<tr><th>이름</th><td>' + AbCommon.escape(data.name) + '</td></tr>';
		if (data.size)
			html += '<tr><th>크기</th><td>' + AbCommon.byteScope(data.size) + '</td></tr>';
		if (data.type)
			html += '<tr><th>타입</th><td>' + AbCommon.escape(data.type) + '</td></tr>';
		
//		if (AbCommon.isSetted(data.pages)) html += '<tr><th>페이지 수</th><td>' + data.pages + '</td></tr>';
//		if (AbCommon.isSetted(data.index)) html += '<tr><th>인덱스</th><td>' + data.index + '</td></tr>';
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
		
		if (data.originName)
			html += '<tr><th>원본명</th><td>' + AbCommon.escape(data.originName) + '</td></tr>';
		if (data.originSize)
			html += '<tr><th>원본크기</th><td>' + AbCommon.byteScope(data.originSize) + '</td></tr>';
		if (data.originPages > 1){
			html += '<tr><th>원본의 이미지 수</th><td>' + data.originPages + '</td></tr>';
			html += '<tr><th>원본의 이미지 인덱스</th><td>' + data.originIndex + '</td></tr>';
		}
		
		if (data.name)
			html += '<tr><th>이름</th><td>' + AbCommon.escape(data.name) + '</td></tr>';
		if (data.size)
			html += '<tr><th>크기</th><td>' + AbCommon.byteScope(data.size) + '</td></tr>';
		if (data.type)
			html += '<tr><th>타입</th><td>' + AbCommon.escape(data.type) + '</td></tr>';
		
		if (AbCommon.isSetted(data.pages)) html += '<tr><th>페이지 수</th><td>' + data.pages + '</td></tr>';
		if (AbCommon.isSetted(data.index)) html += '<tr><th>인덱스</th><td>' + data.index + '</td></tr>';
		html += '</table>';
		
		return {
			title: '서버 이미지 정보',
			html: html,
		};
	},
};