package com.abrain.wiv.abstracts;

import org.apache.ibatis.session.SqlSession;
import org.mybatis.spring.support.SqlSessionDaoSupport;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.stereotype.Repository;

import com.abrain.wiv.transactions.DbTransaction;

/**
 * DAO 객체 추상 클래스
 * <p> 트랜젝션 정보, SQL Session을 제공합니다.
 * @author Administrator
 *
 */
@Repository
public abstract class AbstractDao extends SqlSessionDaoSupport {
	/**
	 * SQL 세션
	 */
	@Autowired
	@Qualifier("sqlSession")
	protected SqlSession sqlSession;
	
	/**
	 * 트랜잭션 관리자
	 */
	@Autowired
	private DataSourceTransactionManager transactionManager;

	//-----------------------------------------------------------
	
	/**
	 * 트랜잭션을 시작합니다.
	 * @return 트랜잭션 정보
	 */
	public DbTransaction begin(){
		return DbTransaction.begin(transactionManager);
	}

	//-----------------------------------------------------------
	
	/**
	 * SQL 세션을 할당합니다.
	 * @param sqlSession SQL 세션
	 */
	public void setSqlSession(SqlSession sqlSession) {
        this.sqlSession = sqlSession;
    }

}
