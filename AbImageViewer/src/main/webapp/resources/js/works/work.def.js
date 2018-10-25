/**
 * 파일 읽기 웹 워커
 * <p>* 로컬 파일을 Data URL로 읽어 호출자에게 전달합니다.
 * 
 * @namespace NormalWebWorker
 */

self.onmessage = function(e){
	load(e.data);
};

function load(data){
	var reader = new FileReader();
	reader.onload = function(event){
		postMessage({ image: event.target.result, data: data });
	};
	reader.onerror = function (e){
		reader.abort();
		throw e;
	};

	reader.readAsDataURL(data);
}