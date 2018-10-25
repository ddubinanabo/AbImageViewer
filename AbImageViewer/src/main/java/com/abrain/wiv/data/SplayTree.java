package com.abrain.wiv.data;

import java.util.ArrayList;
import java.util.List;

/**
 * Splay Tree 제네릭
 * <p>* 트리의 노드가 탐색 또는 갱신을 위해 접근된 후, 스플레이되는 이진 탐색 트리입니다.
 * @author Administrator
 *
 * @see <a href="https://en.wikipedia.org/wiki/Splay_tree">Splay tree Wiki</a>
 * @param <T> 키 타입
 * @param <V> 값 타입
 */
public class SplayTree<T, V> {
	
	/**
	 * 루트 노드
	 */
	private Node<T, V> root;
	
	//-----------------------------------------------------------

	/**
	 * 트리가 비었는 지 확인합니다.
	 * @return 비었으면 true
	 */
	public boolean isEmpty() { return root == null; }
	/**
	 * 트리를 비웁니다.
	 */
	public void clear() {
		root = null;
	}
	
	//-----------------------------------------------------------
	
	/**
	 * 노드를 추가합니다.
	 * @param key 키
	 * @param value 값
	 * @return 0 = 삽입 완료, 1 = 수정, -1 = 키 중복
	 */
	public int add(T key, V value){
		return add(key, value, false);
	}
	
	/**
	 * 노드를 추가합니다.
	 * @param key 키
	 * @param value 값
	 * @param existIsUpdate 노드가 존재하면 값을 수정할 지 여부
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
	 * 노드를 제거하고, 그 노드를 가져옵니다.
	 * @param key 키
	 * @return 제거된 노드
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
	 * 노드를 탐색합니다.
	 * @param key 키
	 * @return 노드
	 */
	public Node<T, V> find(T key){
		if (isEmpty())
			return null;
		
		int keyCode = getHashCode(key);
		splay(keyCode);
		
		return root.keyCode == keyCode ? root : null;
	}
	
	/**
	 * 최대 값을 탐색합니다.
	 * @return 노드
	 */
	public Node<T, V> findMax(){
		return findMax(null);
	}
	
	/**
	 * 최대 값을 탐색합니다.
	 * @param start 시작 노드
	 * @return 노드
	 */
	public Node<T, V> findMax(Node<T, V> start){
		if (isEmpty())
			return null;
		
		Node<T, V> current = start == null ? root : start;
		while (current.right != null)
			current = current.right;
		return current;
	}
	
	/**
	 * 최소값을 탐색합니다.
	 * @return 노드
	 */
	public Node<T, V> findMin(){
		return findMin(null);
	}
	
	/**
	 * 최소값을 탐색합니다.
	 * @param start 시작 노드
	 * @return 노드
	 */
	public Node<T, V> findMin(Node<T, V> start){
		if (isEmpty())
			return null;
		
		Node<T, V> current = start == null ? root : start;
		while (current.left != null)
			current = current.left;
		return current;
	}
	
	/**
	 * 키보다 작은 값 중 가장 큰 값을 탐색합니다.
	 * @param key 키
	 * @return 노드
	 */
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
	
	/**
	 * 키 목록을 가져옵니다.
	 * @return 키 목록
	 */
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
	
	/**
	 * 값 목록을 가져옵니다.
	 * @return 값 목록
	 */
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
	
	/**
	 * 트리를 순회합니다.
	 * @param visitor 트리 순회 인터페이스
	 */
	public void traverse(TraverseVisitor<T, V> visitor){
		if (!isEmpty())
			root.traverse(visitor);
	}
	
	/**
	 * 너비 우선 탐색을 합니다.
	 * @param visitor 너비 우선 탐색 인터페이스
	 */
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

	/**
	 * 노드를 루트로 이동합니다.
	 * @param keyCode 해쉬코드
	 */
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
	
	/**
	 * 해쉬코드를 가져옵니다.
	 * @param value 값
	 * @return 해쉬코드
	 */
	private static int getHashCode(Object value){
		return value == null ? 0 : value.hashCode();
	}
	
	//-----------------------------------------------------------
	//-----------------------------------------------------------
	//-----------------------------------------------------------
	
	/**
	 * 트리 순회 인터페이스
	 * @author Administrator
	 *
	 * @param <T> 키 타입
	 * @param <V> 값 타입
	 */
	public static interface TraverseVisitor<T, V> {
		/**
		 * 순회 노드
		 * @param node 노드
		 */
		void node(Node<T, V> node);
	}
	
	/**
	 * 너비 우선 탐색 인터페이스
	 * @author Administrator
	 *
	 * @param <V> 키 타입
	 */
	public static interface TraverseBreadthFirstVisitor<V> {
		/**
		 * 노드의 값을 체크합니다.
		 * @param value 값
		 * @return true을 탐색을 중단합니다.
		 */
		boolean check(V value);
	}

	/**
	 * 노드
	 * @author Administrator
	 *
	 * @param <T> 키 타입
	 * @param <V> 값 타입
	 */
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
		
		/**
		 * 트리를 순회를 합니다.
		 * @param v 트리 순회 인터페이스
		 */
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
