<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page import="java.io.*" %>

<style>
#test-panel {
	position: absolute;
	left: 50%;
	margin-left: -100px;
	margin-top: 50px;
	
	padding: 10px 20px;
	z-index: 100;
	
	background-color: #FAFAFA;
}
</style>

<div id="test-panel">
	<input type="button" test-topic="remote-folder" value="원격 폴더"/>
	<input type="button" test-topic="change-image" value="2번 이미지 교체"/>
</div>

<script>
$(function(){
	// 인터페이스 사용
	$te('remote-folder').click(function(){
		iAbViewer.view(
			'C:/Users/Administrator/Desktop/원앙',
			'테스트|천사|좋은일|행복|도사'
		)
	});
	
	$te('change-image').click(function(){
		iAbViewer.viewMain(
			1,
			'C:/Users/Administrator/Desktop/닭/c1.jpg',
			'C:/Users/Administrator/Desktop/닭/c1.xml'
		)
	});

	iAbViewer.attachEvent('select', function (name, data){
		var flags = []; flags.push(data.name?'('+data.name+') ':''); flags.push(data.token?'('+data.token+') ':'');
		console.log('  :: DIRECT :: [EVENT]['+name+'] '+flags.join('')+'' + data.index + ', uid=' + data.uid);
	});
});

function $te(topic){
	return $('#test-panel [test-topic="'+topic+'"]');
}
</script>