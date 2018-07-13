package com.abrain.wiv.abstracts;

import org.apache.ibatis.session.SqlSession;
import org.mybatis.spring.support.SqlSessionDaoSupport;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.stereotype.Repository;

import com.abrain.wiv.transactions.DbTransaction;

@Repository
public abstract class AbstractDao extends SqlSessionDaoSupport {
	@Autowired
	@Qualifier("sqlSession")
	protected SqlSession sqlSession;
	
	@Autowired
	private DataSourceTransactionManager transactionManager;

	//-----------------------------------------------------------
	
	public DbTransaction begin(){
		return DbTransaction.begin(transactionManager);
	}

	//-----------------------------------------------------------
	
	public void setSqlSession(SqlSession sqlSession) {
        this.sqlSession = sqlSession;
    }

}
