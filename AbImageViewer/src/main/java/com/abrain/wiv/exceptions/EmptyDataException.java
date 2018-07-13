package com.abrain.wiv.exceptions;

@SuppressWarnings("serial")
public class EmptyDataException extends Exception {
	public EmptyDataException(){
		super("빈 데이터입니다");
	}
}
