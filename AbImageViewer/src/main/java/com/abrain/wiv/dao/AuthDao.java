package com.abrain.wiv.dao;

import java.util.HashMap;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.abrain.wiv.abstracts.AbstractDao;
import com.abrain.wiv.data.AbPermissionDbData;
import com.abrain.wiv.enums.AbAuthType;

@SuppressWarnings("unchecked")
@Repository
public class AuthDao extends AbstractDao {

	public int level(String userId) {
		HashMap<String, Object> param = new HashMap<String, Object>();
		
		param.put("USR_ID", userId);
		
		return (int)sqlSession.selectOne("auth-level", param);
	}

	public List<AbPermissionDbData> permissions(AbAuthType type, String value) {
		HashMap<String, Object> param = new HashMap<String, Object>();
		
		param.put("TP", type);
		param.put("VAL", value);
		
		return sqlSession.selectList("auth-permissions", param);
	}
	
	//-----------------------------------------------------------

}
