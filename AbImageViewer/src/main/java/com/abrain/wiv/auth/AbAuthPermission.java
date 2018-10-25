package com.abrain.wiv.auth;

import java.util.List;

import com.abrain.wiv.data.AbPermissionDbData;
import com.abrain.wiv.utils.ArrayUtil;

/**
 * 계정 권한 정보
 * @author Administrator
 *
 */
public class AbAuthPermission {
	public AbAuthPermission(String value, int level, List<AbPermissionDbData> permissions) {
		this.value = value;
		this.level = level;
		this.permissions = permissions;
	}

	//-----------------------------------------------------------

	/**
	 * 퍼미션 배열
	 */
	private List<AbPermissionDbData> permissions;
	/**
	 * 계정 권한 레벨
	 */
	private int level = -1;
	private String value;

	//-----------------------------------------------------------

	/**
	 * 퍼미션 배열을 가져옵니다.
	 * @return 퍼미션 배열
	 */
	public List<AbPermissionDbData> getPermissions() { return permissions; }
	/**
	 * 계정 권한 레벨을 가져옵니다.
	 * @return 계정 권한 레벨
	 */
	public int getLevel() { return level; }
	/**
	 * 계정 아이디 또는 계정 권한 레벨을 가져옵니다.
	 * @return 계정 아이디 또는 계정 권한 레벨
	 */
	public String getValue() { return value; }

	//-----------------------------------------------------------
	
	/**
	 * 퍼미션을 확인합니다.
	 * @param name 토픽명, 토픽명, ... 토픽명
	 * @return 하나라도 허용이면 true
	 */
	public boolean permission(String...name) {
		if (level == 0) // super admin
			return true;
		
		if (permissions != null) {
			for (AbPermissionDbData p : permissions) {
				String item = p.getItm();
				if (item != null && ArrayUtil.indexOf(name, item) >= 0) {
					String yn = p.getUseYn();
					boolean yes = yn != null && yn.equalsIgnoreCase("Y");
					
					if (yes)
						return true;
				}
			}
		}
		return false;
	}

}
