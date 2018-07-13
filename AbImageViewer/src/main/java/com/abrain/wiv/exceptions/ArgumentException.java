package com.abrain.wiv.exceptions;

@SuppressWarnings("serial")
public class ArgumentException extends Exception {
	public ArgumentException(){
		super("잘못된 호출입니다");
	}
}
