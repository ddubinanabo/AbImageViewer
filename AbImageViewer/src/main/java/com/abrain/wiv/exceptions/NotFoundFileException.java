package com.abrain.wiv.exceptions;

/**
 * 파일 또는 디렉터리를 찾을 수 없을 때 발생하는 예외 클래스입니다.
 * @author Administrator
 *
 */
@SuppressWarnings("serial")
public class NotFoundFileException extends Exception {
	public NotFoundFileException() {
		super("파일 또는 디렉터리를 찾을 수 없습니다");
	}
	
	public NotFoundFileException(String path) {
		super("파일 또는 디렉터리를 찾을 수 없습니다: " + path);
	}
}
