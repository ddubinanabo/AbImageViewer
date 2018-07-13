package com.abrain.wiv.abstracts;

import java.io.ByteArrayOutputStream;
import java.io.PrintStream;

import javax.servlet.http.HttpServletRequest;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import com.abrain.wiv.data.AbErrorResponse;

public class AbstractApiController {
	
	@ExceptionHandler(Exception.class)
	@ResponseStatus(value=HttpStatus.INTERNAL_SERVER_ERROR)
	public ResponseEntity<AbErrorResponse> handleException(HttpServletRequest request, Exception e){
		//return getResponse(e);
		
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);
		
		AbErrorResponse r = getResponse(e);
		
		return new ResponseEntity<AbErrorResponse>(r, headers, HttpStatus.INTERNAL_SERVER_ERROR);
	}

	//-----------------------------------------------------------------------------------
	
	private static AbErrorResponse getResponse(Exception e){
		AbErrorResponse r = new AbErrorResponse();
		
		r.name = e.getClass().getSimpleName();
		r.message = e.getMessage();
		r.errorCode = 0;
		r.messageType = null;
		r.token = null;
		r.stackTrace = getStackTrace(e);
		
		return r;		
	}
	
	private static String getStackTrace(Exception e){
		ByteArrayOutputStream out = new ByteArrayOutputStream();
		e.printStackTrace(new PrintStream(out));
		
		return out.toString();
	}

}
