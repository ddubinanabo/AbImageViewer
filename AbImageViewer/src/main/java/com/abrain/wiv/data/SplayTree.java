package com.abrain.wiv.data;

import java.util.ArrayList;
import java.util.List;

public class SplayTree<T, V> {
	
	private Node<T, V> root;
	
	//-----------------------------------------------------------

	public boolean isEmpty() { return root == null; }
	public void clear() {
		root = null;
	}
	
	//-----------------------------------------------------------
	
	/**
	 * 
	 * @param key
	 * @param value
	 * @return 0 = 삽입 완료, 1 = 수정, -1 = 키 중복
	 */
	public int add(T key, V value){
		return add(key, value, false);
	}
	
	/**
	 * 
	 * @param key
	 * @param value
	 * @param existIsUpdate
	 * @return 0 = 삽입 완료, 1 = 수정, -1 = 키 중복
	 */
	private int add(T key, V value, boolean existIsUpdate){
		if (isEmpty()){
			root = new Node<T, V>(key, value);
			return 0;
		}
		
		int keyCode = getHashCode(key);
		
		splay(keyCode);
		
		if (root.keyCode == keyCode){
			if (existIsUpdate){
				root.value = value;
				return 1;
			}
			return -1;
		}
		
		Node<T, V> node = new Node<T, V>(key, value);
		
		if (keyCode > root.keyCode){
			node.left = root;
			node.right = root.right;
			root.right = null;
		}else{
			node.right = root;
			node.left = root.left;
			root.left = null;
		}
		root = node;
		return 0;
	}
	
	/**
	 * 
	 * @param key
	 * @return 삭제된 노드
	 */
	public Node<T, V> remove(T key){
		if (isEmpty())
			return null;
		
		int keyCode = getHashCode(key);
		splay(keyCode);
		
		if (root.keyCode != keyCode)
			return null;
		
		Node<T, V> removed = root;
		if (root.left == null){
			root = root.right;
		}else{
			Node<T, V> right = root.right;
			root = root.left;
			
			splay(keyCode);
			
			root.right = right;
		}
		
		return removed;
	}
	
	/**
	 * 탐색
	 * @param key
	 * @return
	 */
	public Node<T, V> find(T key){
		if (isEmpty())
			return null;
		
		int keyCode = getHashCode(key);
		splay(keyCode);
		
		return root.keyCode == keyCode ? root : null;
	}
	
	public Node<T, V> findMax(){
		return findMax(null);
	}
	
	public Node<T, V> findMax(Node<T, V> start){
		if (isEmpty())
			return null;
		
		Node<T, V> current = start == null ? root : start;
		while (current.right != null)
			current = current.right;
		return current;
	}
	
	public Node<T, V> findMin(){
		return findMin(null);
	}
	
	public Node<T, V> findMin(Node<T, V> start){
		if (isEmpty())
			return null;
		
		Node<T, V> current = start == null ? root : start;
		while (current.left != null)
			current = current.left;
		return current;
	}
	
	public Node<T, V> findGreatestLessThan(T key){
		if (isEmpty())
			return null;
		
		int keyCode = getHashCode(key);
		splay(keyCode);
		
		if (root.keyCode < keyCode){
			return root;
		}else if (root.left != null){
			return findMax(root.left);
		}
		return null;
	}
	
	public List<T> keys() {
		ArrayList<T> r = new ArrayList<T>();
		
		if (!isEmpty()){
			root.traverse(new TraverseVisitor<T, V>(){
				@Override
				public void node(Node<T, V> node) {
					r.add(node.key);
				}
			});
		}
		
		return r;
	}
	
	public List<V> values() {
		ArrayList<V> r = new ArrayList<V>();
		
		if (!isEmpty()){
			root.traverse(new TraverseVisitor<T, V>(){
				@Override
				public void node(Node<T, V> node) {
					r.add(node.value);
				}
			});
		}
		
		return r;
	}
	
	public void traverse(TraverseVisitor<T, V> visitor){
		if (!isEmpty())
			root.traverse(visitor);
	}
	
	public void traverseBreadthFirst(TraverseBreadthFirstVisitor<V> visitor){
		if (isEmpty())
			return;
		
		if (visitor.check(root.value))
			return;
		
		List<Node<T, V>> stack = new ArrayList<>();
		stack.add(root);
	
		List<Node<T, V>> newStack = new ArrayList<>();
		
		int length = 1, newLength = 0;
		
		while (length > 0){
			newStack.clear();
			newLength = 0;
			
			for (int i=0; i < length; i++){
				Node<T, V> n = stack.get(i);
				Node<T, V> l = n.left;
				Node<T, V> r = n.right;
				
				if (l != null){
					if (visitor.check(l.value))
						return;
					
					newStack.add(l);
					newLength++;
				}
				
				if (r != null){
					if (visitor.check(r.value))
						return;
					
					newStack.add(r);
					newLength++;
				}
			}
			
			stack.clear();
			stack.addAll(newStack);
			
			length = newLength;
		}
	}
	
	//-----------------------------------------------------------

	private void splay(int keyCode){
		if (isEmpty())
			return;
		
		Node<T, V> dummy = null, left = null, right = null;
		
		dummy = left = right = new Node<T, V>();
		
		Node<T, V> current = root;
		
		while (true){
			if (keyCode < current.keyCode){
				if (current.left == null)
					break;
				
				if (keyCode < current.left.keyCode){
					Node<T, V> tmp = current.left;
					current.left = tmp.right;
					tmp.right = current;
					
					current = tmp;
					if (current.left == null)
						break;
				}
				
				right.left = current;
				right = current;
				current = current.left;
			}else if (keyCode > current.keyCode){
				if (current.right == null)
					break;
				
				if (keyCode > current.right.keyCode){
					Node<T, V> tmp = current.right;
					current.right = tmp.left;
					tmp.left = current;

					current = tmp;
					if (current.right == null)
						break;
				}
				
				left.right = current;
				left = current;
				current = current.right;
			}else{
				break;
			}
		}
		
		left.right = current.left;
		right.left = current.right;
		current.left = dummy.right;
		current.right = dummy.left;
		
		root = current;
	}
	
	//-----------------------------------------------------------
	
	private static int getHashCode(Object value){
		return value == null ? 0 : value.hashCode();
	}
	
	//-----------------------------------------------------------
	//-----------------------------------------------------------
	//-----------------------------------------------------------
	
	public static interface TraverseVisitor<T, V> {
		void node(Node<T, V> node);
	}
	
	public static interface TraverseBreadthFirstVisitor<V> {
		boolean check(V value);
	}

	public static class Node<T, V> {
		private Node(){}
		
		public Node(T key, V value){
			keyCode = getHashCode(key);
			this.key = key;
			this.value = value;
		}
		
		//-----------------------------------------------------------
	
		private int keyCode;
		
		private T key;
		private V value;
		
		private Node<T, V> left, right;

		//-----------------------------------------------------------
		
		public int keyCode() { return keyCode; }
		public T key(){ return key; }
		public V value(){ return value; }

		//-----------------------------------------------------------
		
		private void traverse(TraverseVisitor<T, V> v){
			Node<T, V> current = this;
			
			while (current != null){
				Node<T, V> left = current.left;
				if (left != null) left.traverse(v);
				
				v.node(current);
				
				current = current.right;
			}
		}
	}
}
