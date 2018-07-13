var AbNoop = {
	url: 'api/noop',
	interval: 60000, // 60초
		
	exec: function(){
		var noop = function (){
			$.ajax({
				type: 'POST',
				url: AbNoop.url,
				data: null,
				async: true,
				//dataType: 'text',
				timeout: 1000000,
				success: function (result) {
					console.log('[NOOP] ok !!!');
				},
				
				error: function (XMLHttpRequest, textStatus, errorThrown) {
					console.log('[NOOP] error !!!');
				}
			});
		};
		
		setInterval(noop, AbNoop.interval);
	},
};