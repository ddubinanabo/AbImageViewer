package com.abrain.wiv.exceptions;

@SuppressWarnings("serial")
public class DocConverterException extends Exception {
	public DocConverterException(String type, int errcode){
		super("converter failure: " + type + " (" + errcode + ")");
		this.errcode = errcode; 
	}
	
	private int errcode;

	public int getErrcode() { return errcode; }
}
