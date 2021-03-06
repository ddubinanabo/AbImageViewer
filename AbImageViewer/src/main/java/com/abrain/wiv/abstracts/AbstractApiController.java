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

/**
 * REATfull API 추상 컨트롤러
 * <p>* 예외에 대해 정보를 브라우저에 제공합니다.
 * @author Administrator
 *
 */
public abstract class AbstractApiController {
	
	/**
	 * 예외를 핸들링합니다.
	 * @param request 요청 정보
	 * @param e 예외
	 * @return 예외 정보
	 */
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
	
	/**
	 * 예외 정보를 생성합니다.
	 * @param e 예외
	 * @return 예외 정보
	 */
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
	
	/**
	 * 스택 추적 정보를 문자열로 변환합니다.
	 * @param e 예외
	 * @return 스택 추적 정보 문자열
	 */
	private static String getStackTrace(Exception e){
		ByteArrayOutputStream out = new ByteArrayOutputStream();
		e.printStackTrace(new PrintStream(out));
		
		return out.toString();
	}

}
