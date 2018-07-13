package com.abrain.wiv.transactions;

import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.transaction.TransactionDefinition;
import org.springframework.transaction.TransactionStatus;
import org.springframework.transaction.support.DefaultTransactionDefinition;

public class DbTransaction {
	private DbTransaction(){}
	
	//-----------------------------------------------------------------------------------

	private DataSourceTransactionManager tm;
	private DefaultTransactionDefinition def;
	private TransactionStatus status;
	
	//-----------------------------------------------------------------------------------

	public void commit(){
		tm.commit(status);
	}
	
	public void rollback(){
		try
		{
			if (!status.isCompleted())
				tm.rollback(status);
		}
		catch (Exception e)
		{
			System.out.println("[DB-TRANSACTION] Rollback failure!!!");
		}
	}
	
	//-----------------------------------------------------------------------------------
	//-----------------------------------------------------------------------------------
	//-----------------------------------------------------------------------------------

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
