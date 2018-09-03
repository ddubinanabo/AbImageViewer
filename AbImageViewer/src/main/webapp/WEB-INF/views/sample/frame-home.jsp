<%@page import="com.abrain.wiv.utils.WebUtil"%>
<%@page import="com.abrain.wiv.data.AbBrowserKind"%>
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

	<jsp:include page="/WEB-INF/debug/js-i-viewer.jsp"></jsp:include>
	
	<%/*
	<script type="text/javascript" src="resources/js/i.ab.viewer.min.js"></script>
	*/%>
	
	<script>
	$(function(){
		$('#btn-folder').click(function(){
			iAbViewerFrame.view(
				'C:/Users/Administrator/Desktop/원앙',
				'행복|천사'
			);
		});
		
		$('#btn-chg-file').click(function(){
			iAbViewerFrame.viewMain(
				1,
				'C:/Users/Administrator/Desktop/닭/c1.jpg',
				'C:/Users/Administrator/Desktop/닭/c1.xml'
			);
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
