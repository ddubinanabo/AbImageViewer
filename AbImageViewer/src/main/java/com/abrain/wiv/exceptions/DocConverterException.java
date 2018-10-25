package com.abrain.wiv.exceptions;

/**
 * 문서 컨버팅 중 오류가 있을 때 발생하는 예외 클래스입니다.
 * @author Administrator
 *
 */
@SuppressWarnings("serial")
public class DocConverterException extends Exception {
	public DocConverterException(String type, int errcode){
		super("converter failure: " + type + " (" + errcode + ")");
		this.errcode = errcode; 
	}
	
	private int errcode;

	public int getErrcode() { return errcode; }
}
