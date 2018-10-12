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
 * 권한 정보 처리
 * @author Administrator
 *
 */
@Component
public class AbAuth {
	
	@Autowired
	private HttpServletRequest request;
	
	@Autowired
	private AuthDao dao;

	@Autowired
	public AbAuthConfig config;

	//-----------------------------------------------------------

	private AbAuthPermission permission;

	//-----------------------------------------------------------

	public AbAuthConfig getConfig() { return config; }
	public AbAuthPermission getPermission() { return permission; }

	//-----------------------------------------------------------
	
	public boolean enabled() { return config != null ? config.enabled : false; }

	//-----------------------------------------------------------
	
	public boolean permission(String...name) {
		return !enabled() ? true : (permission != null ? permission.permission(name) : false);
	}

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
