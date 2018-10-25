package com.abrain.wiv.auth;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.abrain.wiv.config.AbAuthConfig;
import com.abrain.wiv.dao.AuthDao;
import com.abrain.wiv.data.AbPermissionDbData;
import com.abrain.wiv.enums.AbAuthSourceKind;
import com.abrain.wiv.enums.AbAuthType;

/**
 * 이미지 뷰어 권한 정보
 * @author Administrator
 *
 */
@Component
public class AbAuth {
	
	/**
	 * HTTP 요청 정보
	 */
	@Autowired
	private HttpServletRequest request;
	
	/**
	 * 계정 권한 DAO
	 */
	@Autowired
	private AuthDao dao;

	/**
	 * 권한 설정 정보
	 */
	@Autowired
	public AbAuthConfig config;

	//-----------------------------------------------------------

	/**
	 * 계정 권한 정보
	 */
	private AbAuthPermission permission;

	//-----------------------------------------------------------

	/**
	 * 권한 설정 정보를 가져옵니다.
	 * @return 권한 설정 정보
	 */
	public AbAuthConfig getConfig() { return config; }
	/**
	 * 계정 권한 정보를 가져옵니다.
	 * @return 계정 권한 정보
	 */
	public AbAuthPermission getPermission() { return permission; }

	//-----------------------------------------------------------
	
	/**
	 * 권한 사용 여부를 가져옵니다.
	 * @return 권한 사용 여부
	 */
	public boolean enabled() { return config != null ? config.enabled : false; }

	//-----------------------------------------------------------
	
	/**
	 * 퍼미션을 확인합니다.
	 * @param name 토픽
	 * @return 허용 여부
	 */
	public boolean permission(String...name) {
		return !enabled() ? true : (permission != null ? permission.permission(name) : false);
	}

	/**
	 * 토픽별 분기
	 * <p>* 마지막 문자열은 else 분기입니다.
	 * @param args 토픽명, 문자열, 토픽명, 문자열 ... 마지막 문자열
	 * @return 토픽에 해당하는 문자열을 리턴합니다.
	 */
	public String decode(String...args) {
		if (args == null)
			return "";

		int len = args.length, idx = 0;
		for (int i=0; i+1 < len; i+=2) {
			String c = args[i];
			String r = args[i + 1];
			
			if (permission(c)) {
				return r;
			}
			
			idx += 2;
		}
		return idx + 1 <= len ? args[idx] : "";
	}

	//-----------------------------------------------------------
	
	/**
	 * 계정 정보를 획득합니다.
	 * @return 계정 정보 또는 계정 권한 레벨
	 */
	public boolean read() {
		//System.out.println("sample=" + AbAuthSourceKind.ABAUTH_LOCAL_STORAGE);
		
		if (enabled()) {
			String value = null;
			
			switch (config.account.source) {
			case ABAUTH_CGI:
				value = request.getParameter("a");
				break;
				
			case ABAUTH_LOCAL_STORAGE:
			case ABAUTH_SESSION_STORAGE:
				return false;
				
			case ABAUTH_COOKIE:
				value = cookie(config.account.field);
				break;
				
			case ABAUTH_SESSION:
				value = session(config.account.field);
				break;
			default:
				break;
			}
			
			if (value == null)
				return false;
			
			return get(value);
		}
		return false;
	}

	//-----------------------------------------------------------
	
	/**
	 * 계정의 권한 레벨을 획득합니다.
	 * @param value 계정 정보 또는 계정 권한 레벨
	 * @return 정상적으로 획득하면 true
	 */
	public boolean get(String value) {
		permission = null;
		
		if (value == null || value.isEmpty())
			return false;
		
		int level = -1;
		if (config.account.type == AbAuthType.ABAUTH_TP_ID) {
			level = dao.level(value);
		}else if (config.account.type == AbAuthType.ABAUTH_TP_LEVEL) {
			level = Integer.parseInt(value);
		}else {
			return false;
		}
		
		List<AbPermissionDbData> ps = dao.permissions(config.account.type, value);
		
		permission = new AbAuthPermission(value, level, ps);
		
		return true;
	}

	//-----------------------------------------------------------
	
	/**
	 * 쿠키값를 가져옵니다.
	 * @param name 이름
	 * @return 값
	 */
	private String cookie (String name) {
		Cookie[] cookies = request.getCookies();
		
		if (cookies != null) {
			for (Cookie cookie : cookies) {
				if (cookie.getName().equalsIgnoreCase(name)) {
					return cookie.getValue();
				}
			}
		}
		return null;
	}
	
	/**
	 * 세션값을 가져옵니다.
	 * @param name 이름
	 * @return 값
	 */
	private String session (String name) {
		HttpSession session = request.getSession();
		if (session != null) {
			Object v = session.getAttribute(name);
			if (v == null)
				return null;
			
			if (v instanceof String)
				return (String)v;
			
			return v.toString();
		}
		return null;
	}
}
