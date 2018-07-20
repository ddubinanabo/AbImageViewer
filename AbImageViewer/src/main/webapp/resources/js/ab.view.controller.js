
var toolbar, imageViewer;

//-----------------------------------------------------------

$(function(){
	AbVendor.executePath = 'resources/' + AbVendor.executePath;
	AbImageLoader.executePath = 'resources/' + AbImageLoader.executePath;
	
	AbImageLoader.urlConverter = 'api/doc';
	
	AbImageViewer.prototype.allocUrl = 'api/alloc';
	AbImageViewer.prototype.saveUrl = 'api/save-image';
	AbImageViewer.prototype.removeUrl = 'api/remove';
	AbImageViewer.prototype.openImageUrl = 'api/images';
	
	/*
	 * 이미지 전송 시 분할 사이즈
	 * 기본값은 30KB
	 * 
	 * 전송이 너무 느리다 싶으면 이 사이즈를 더 키우세요 
	 */
	AbImageViewer.prototype.SPLIT_DATA_SIZE = 30720;

	//-----------------------------------------------------------
	
	var GAP = 2;

	imageViewer = new AbImageViewer({
		margin: { left: GAP, top: GAP, right: GAP, bottom: GAP },
	});

	imageViewer.waterMark.image('resources/img/watermark.png');

	//-----------------------------------------------------------
	// 이미지 뷰어 초기화 작업
	//-----------------------------------------------------------

	imageViewer.install();
	
	//-----------------------------------------------------------
	// 세션 유지
	//-----------------------------------------------------------
	
	AbNoop.exec();
	
	//-----------------------------------------------------------
	// 인자값 처리
	//-----------------------------------------------------------
	
	var paramId = $('#param-id').val();
	if (paramId){
		imageViewer.openImages(paramId);
	}
	
});

//-----------------------------------------------------------
//-----------------------------------------------------------
