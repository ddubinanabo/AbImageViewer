<%@page import="com.abrain.wiv.utils.WebUtil"%>
<%@page import="com.abrain.wiv.enums.AbBrowserKind"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page session="false" %>

<!doctype html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>이미지 뷰어 (IFRAME)</title>
	<!-- <meta http-equiv="X-UA-Compatible" content="IE=edge"> -->

	<script type="text/javascript" src="resources/js/es6-promise.auto.js"></script>
	<script type="text/javascript" src="resources/js/jquery-3.3.1.min.js"></script>
	
	<%/*
	<jsp:include page="/WEB-INF/debug/js-viewer.jsp"></jsp:include>
	<jsp:include page="/WEB-INF/debug/js-i-viewer.jsp"></jsp:include>
	*/%>
	
	<script type="text/javascript" src="resources/js/ab.viewer.min.js"></script>
	<script type="text/javascript" src="resources/js/i.ab.viewer.min.js"></script>
	
	<script>
	var folder1 = 'C:/Users/Administrator/Desktop/원앙';
	var folder = 'C:/Users/Administrator/Desktop/닭/';
	var viewFileCalled = 0;
	
	$(function(){
		$('#btn-folder').click(function(){
			iAbViewerFrame.view(
				folder1,
				'행복|천사'
			)
		});
		
		$('#btn-chg-file').click(function(){
			iAbViewerFrame.viewMain(
				1,
				folder + 'c1.jpg',
				folder + 'c1.xml'
			)
		});
		
		$('[tst-cmd="viewFile"]').click(function(){
			var e = $(this);
			
			var path = e.attr('path');
			var file = e.attr('file');
			
			if (!path && !file) return;
			
			if (file) path = folder + file;
			
			viewFileCalled++;
			
			iAbViewerFrame.viewFile(
				path,
				'테스트-' + viewFileCalled,
				'첫페이지|두번째'
			);
		});

		//-----------------------------------------------------------
	
		var func = function (name, data){
			console.log('::TEST:: [IFRAME][EVENT]['+name+'] ' + data.index + ', uid=' + data.uid);
		};
		
		iAbViewerFrame.attachEvent('select', func);
		iAbViewerFrame.detachEvent('select', func);

		//-----------------------------------------------------------
	
		iAbViewerFrame.attachEvent('click', function (name, data){
			var flags = []; flags.push(data.name?'('+data.name+') ':''); flags.push(data.token?'('+data.token+') ':'');
			console.log('[IFRAME][EVENT]['+name+'] '+flags.join('')+'' + data.index + ', uid=' + data.uid);
		});
		
		iAbViewerFrame.attachEvent('select', function (name, data){
			var flags = []; flags.push(data.name?'('+data.name+') ':''); flags.push(data.token?'('+data.token+') ':'');
			console.log('[IFRAME][EVENT]['+name+'] '+flags.join('')+'' + data.index + ', uid=' + data.uid);
		});
		
		iAbViewerFrame.attachEvent('renderlist', function (name, data){
			var flags = []; flags.push(data.name?'('+data.name+') ':''); flags.push(data.token?'('+data.token+') ':'');
			console.log('[IFRAME][EVENT]['+ name +'] '+flags.join('')+'name='+data.name+', token=' + data.token + ' (' + data.loading + '/' + data.visible + ')');
		});
	});
	
	</script>
	<style>
	html, body { height: 100%; }
	* { margin: 0; }
	
	iframe {
		border: 0px;
	}
	
	.boxsiz {
		-webkit-box-sizing: border-box;
		-moz-box-sizing: border-box;
		box-sizing: border-box;
	}
	
	</style>
	</head>
<body>

	<div class="boxsiz" style="height: 100%;">
		<div class="boxsiz" style="z-index: 1; width: 100%; height: 60px; background-color: #f5f5f5; position: absolute; top: 0;">
			<span>IFRAME: </span>
			<input id="btn-folder" type="button" value="원격 폴더"/>
			<input id="btn-chg-file" type="button" value="두번째 이미지 변경"/>
			<input tst-cmd="viewFile" file="viewFile/a.png" type="button" value="파일 - PNG 파일"/>
			<input tst-cmd="viewFile" file="viewFile/a.jpg" type="button" value="파일 - JPEG 파일"/>
			<input tst-cmd="viewFile" file="viewFile/a.tiff" type="button" value="파일 - TIFF 파일"/>
			<input tst-cmd="viewFile" file="viewFile/a.pdf" type="button" value="파일 - PDF 파일"/>
			<input tst-cmd="viewFile" file="viewFile/a.mp3" type="button" value="파일 - MP3 파일"/>
			<input tst-cmd="viewFile" file="viewFile/a.mp4" type="button" value="파일 - MP4 파일"/>
			<!--
			<a href="/wiv/F88D41F3DBB44B1FB6E24A8FBEC78DC9" target="main">체크</a>
			-->
		</div>
		
		<div class="boxsiz" style="height: 100%; padding: 60px 5px 5px 5px;">
		<iframe name="main" ab-topic="main" src="/wiv" class="boxsiz" style="width: 100%; height: 100%;"></iframe>
		</div>
	</div>


</body>
</html>
