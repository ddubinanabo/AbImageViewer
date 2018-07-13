
var toolbar, imageViewer;

//-----------------------------------------------------------

$(function(){
	AbVendor.executePath = 'resources/' + AbVendor.executePath;
	AbImageLoader.executePath = 'resources/' + AbImageLoader.executePath;
	
	AbImageLoader.urlConverter = 'api/doc';
	
	AbImageViewer.prototype.saveUrl = 'api/save';
	AbImageViewer.prototype.openImageUrl = 'api/images';

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
