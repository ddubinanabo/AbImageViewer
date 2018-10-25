package com.abrain.wiv.dao;

import java.util.HashMap;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.abrain.wiv.abstracts.AbstractDao;
import com.abrain.wiv.data.AbPermissionDbData;
import com.abrain.wiv.enums.AbAuthType;

/**
 * 계정 권한 DAO
 * @author Administrator
 *
 */
@SuppressWarnings("unchecked")
@Repository
public class AuthDao extends AbstractDao {

	/**
	 * 계정의 권한 레벨을 조회합니다.
	 * @param userId 계졍 아이디
	 * @return 계정 권한 레벨
	 */
	public int level(String userId) {
		HashMap<String, Object> param = new HashMap<String, Object>();
		
		param.put("USR_ID", userId);
		
		return (int)sqlSession.selectOne("auth-level", param);
	}

	/**
	 * 퍼미션 DB 정보 목록을 조회합니다.
	 * @param type 권한 정보 타입
	 * @param value 권한 정보 (계정 아이디 또는 계정 권한 레벨)
	 * @return 퍼미션 DB 정보 목록
	 */
	public List<AbPermissionDbData> permissions(AbAuthType type, String value) {
		HashMap<String, Object> param = new HashMap<String, Object>();
		
		param.put("TP", type);
		param.put("VAL", value);
		
		return sqlSession.selectList("auth-permissions", param);
	}
	
	//-----------------------------------------------------------

}
