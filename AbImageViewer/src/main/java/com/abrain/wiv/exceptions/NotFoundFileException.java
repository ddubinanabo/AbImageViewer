package com.abrain.wiv.exceptions;

@SuppressWarnings("serial")
public class NotFoundFileException extends Exception {
	public NotFoundFileException() {
		super("파일 또는 디렉터리를 찾을 수 없습니다");
	}
	
	public NotFoundFileException(String path) {
		super("파일 또는 디렉터리를 찾을 수 없습니다: " + path);
	}
}
