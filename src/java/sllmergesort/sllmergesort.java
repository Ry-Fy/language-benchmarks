import java.util.Random;

final class Node {
	public int val;
	public Node next;
	public Node(int val, Node next) {
		this.val = val;
		this.next = next;
	}
}

final class LinkedList {
	public Node head;
	public LinkedList() {
		head = null;
	}

	public void push(int newValue) {
		Node newNode = new Node(newValue, head);
		head = newNode;
	}

	public void sort() {
		head = mergeSort(head);
	}

	private Node mergeSort(Node startNode) {
		if (startNode == null || startNode.next == null) {
			return startNode;
		}

		Node middle = getMiddle(startNode);
		Node middleStart = middle.next;
		middle.next = null;

		Node left = mergeSort(startNode);
		Node right = mergeSort(middleStart);
		Node merged = merge(left, right);

		return merged;
	}

	private Node merge(Node leftNode, Node rightNode) {
		if (leftNode == null) return rightNode;
		if (rightNode == null) return leftNode;

		Node result;
		if (leftNode.val <= rightNode.val) {
			result = leftNode;
			result.next = merge(leftNode.next, rightNode);
		} else {
			result = rightNode;
			result.next = merge(leftNode, rightNode.next);
		}

		return result;
	}

	private Node getMiddle(Node startNode) {
		if (startNode == null) return startNode;

		Node fastNode = startNode.next;
		Node slowNode = startNode;

		while (fastNode != null) {
			fastNode = fastNode.next;
			if (fastNode != null) {
				slowNode = slowNode.next;
				fastNode = fastNode.next;
			}
		}

		return slowNode;
	}

	public String toString() {
		String result = "";
		Node current = head;
		while (current != null) {
			result += current.val;
			result += current.next == null ? "" : ", ";
			current = current.next;
		}
		return result;
	}
}

final class SllMergeSort {

	public static void main(String[] args) {
		int mediumIterations = 100;
		int shortIterations = 99;
		int nodeCount = 5000;
		int intMax = (int) Math.pow(2, 31) - 1;

		LinkedList longList = new LinkedList();
		Random rand = new Random();

		for (int i = 0; i < mediumIterations; i++) {
			LinkedList mediumList = new LinkedList();
			for (int j = 0; j < nodeCount; j++) {
				mediumList.push(rand.nextInt(intMax));
			}
	
			for (int j = 0; j < shortIterations; j++) {
				LinkedList shortList = new LinkedList();
				for (int k = 0; k < nodeCount; k++) {
					shortList.push(rand.nextInt(intMax));
				}
	
				shortList.sort();
				longList.push(shortList.head.val);
			}
	
			mediumList.sort();
			longList.push(mediumList.head.val);
		}
		
	
		longList.sort();
		System.out.println(longList.head.val);
	}
}