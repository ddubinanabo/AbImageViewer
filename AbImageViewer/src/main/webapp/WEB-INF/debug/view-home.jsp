<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page import="java.io.*" %>

<style>
#test-panel {
	width: 600px;

	position: fixed;
	left: 50%;
	margin-left: -300px;
	margin-top: 90px;
	
	padding: 10px 20px;
	z-index: 100;
	
	background-color: #FAFAFA;
}
</style>

<div id="test-panel">
	<input type="button" test-topic="remote-folder" value="원격 폴더"/>
	<input type="button" test-topic="change-image" value="2번 이미지 교체"/>
	
	<input type="text" test-topic="authname" value="ab_usr_id" style="width: 50px;"/>
	<input type="text" test-topic="authval" value="dev" style="width: 50px;"/>
	
	<input type="button" test-topic="cookie" value="cookie"/>
	<input type="button" test-topic="localStorage" value="localStorage"/>
	<input type="button" test-topic="sessionStorage" value="sessionStorage"/>
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
	
	$te('cookie').click(function(){
		var name = $te('authname').val();
		var value = $te('authval').val();
		
		AbCommon.cookie.setAlways(name, value);
	});
	
	$te('localStorage').click(function(){
		var name = $te('authname').val();
		var value = $te('authval').val();

		localStorage.setItem(name, value);
	});
	
	$te('sessionStorage').click(function(){
		var name = $te('authname').val();
		var value = $te('authval').val();

		sessionStorage.setItem(name, value);
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