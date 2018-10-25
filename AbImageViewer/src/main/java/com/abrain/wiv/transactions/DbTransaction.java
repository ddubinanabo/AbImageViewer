package com.abrain.wiv.transactions;

import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.transaction.TransactionDefinition;
import org.springframework.transaction.TransactionStatus;
import org.springframework.transaction.support.DefaultTransactionDefinition;

import com.abrain.wiv.utils.DebugUtil;

/**
 * 트랜잭션 정보
 * @author Administrator
 *
 */
public class DbTransaction {
	private DbTransaction(){}
	
	//-----------------------------------------------------------------------------------

	private DataSourceTransactionManager tm;
	private DefaultTransactionDefinition def;
	private TransactionStatus status;
	
	//-----------------------------------------------------------------------------------

	/**
	 * 커밋합니다.
	 */
	public void commit(){
		tm.commit(status);
	}
	
	/**
	 * 롤백합니다.
	 */
	public void rollback(){
		try
		{
			if (!status.isCompleted())
				tm.rollback(status);
		}
		catch (Exception e)
		{
			DebugUtil.print(e);
			
			System.out.println("[DB-TRANSACTION] Rollback failure!!!");
		}
	}
	
	//-----------------------------------------------------------------------------------
	//-----------------------------------------------------------------------------------
	//-----------------------------------------------------------------------------------

	/**
	 * 트랜잭션을 시작합니다.
	 * @param tm 트랜잭션 관리자
	 * @param name 이름
	 * @return 트랜잭션 정보
	 */
	public static DbTransaction begin(DataSourceTransactionManager tm, String name){
//		WebApplicationContext context = ContextLoader.getCurrentWebApplicationContext();
//		DataSource ds = (DataSource)context.getBean(DataSource.class);
		
		DbTransaction tran = new DbTransaction();
		tran.tm = tm;

		tran.def = new DefaultTransactionDefinition();
		tran.def.setName(name);
		tran.def.setPropagationBehavior(TransactionDefinition.PROPAGATION_REQUIRED);
		
		tran.status = tran.tm.getTransaction(tran.def);
		
		return tran;
	}
	
	public static DbTransaction begin(DataSourceTransactionManager tm){
		return begin(tm, "transaction");
	}
}
