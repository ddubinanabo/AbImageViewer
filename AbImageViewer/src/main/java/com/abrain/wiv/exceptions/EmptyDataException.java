package com.abrain.wiv.exceptions;

/**
 * 필수 내용이 없을 때 발생하는 예외입니다.
 * @author Administrator
 *
 */
@SuppressWarnings("serial")
public class EmptyDataException extends Exception {
	public EmptyDataException(){
		super("빈 데이터입니다");
	}
}
