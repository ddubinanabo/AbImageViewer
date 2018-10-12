package com.abrain.wiv.auth;

import java.util.List;

import com.abrain.wiv.data.AbPermissionDbData;
import com.abrain.wiv.utils.ArrayUtil;

/**
 * 권한 정보
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

	private List<AbPermissionDbData> permissions;
	private int level = -1;
	private String value;

	//-----------------------------------------------------------

	public List<AbPermissionDbData> getPermissions() { return permissions; }
	public int getLevel() { return level; }
	public String getValue() { return value; }

	//-----------------------------------------------------------
	
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
