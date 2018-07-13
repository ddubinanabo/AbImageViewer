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