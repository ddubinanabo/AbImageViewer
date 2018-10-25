package com.abrain.wiv.exceptions;

/**
 * 인자 잘못되었을 때 발생하는 예외 클래스입니다.
 * @author Administrator
 *
 */
@SuppressWarnings("serial")
public class ArgumentException extends Exception {
	public ArgumentException(){
		super("잘못된 호출입니다");
	}
}
