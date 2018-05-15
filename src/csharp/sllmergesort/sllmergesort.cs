using System;

namespace sllmergesort {
	class Node {
		public int val;
		public Node next;
	}

	class LinkedList {
		public Node head;
		public LinkedList() {
			head = null;
		}

		public void push(int newValue) {
			var newNode = new Node { val = newValue, next = head };
			head = newNode;
		}

		public void sort() {
			head = mergeSort(head);
		}

		private Node mergeSort(Node startNode) {
			if (startNode == null || startNode.next == null) {
				return startNode;
			}

			var middle = getMiddle(startNode);
			var middleStart = middle.next;
			middle.next = null;

			var left = mergeSort(startNode);
			var right = mergeSort(middleStart);
			var merged = merge(left, right);

			return merged;
		}

		private Node merge(Node leftNode, Node rightNode) {
			if (leftNode == null) return rightNode;
			if (rightNode == null) return leftNode;

			Node result = null;
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

			var fastNode = startNode.next;
			var slowNode = startNode;

			while (fastNode != null) {
				fastNode = fastNode.next;
				if (fastNode != null) {
					slowNode = slowNode.next;
					fastNode = fastNode.next;
				}
			}

			return slowNode;
		}

		public string toString() {
			var result = "";
			var current = head;
			while (current != null) {
				result += current.val;
				result += current.next == null ? "" : ", ";
				current = current.next;
			}
			return result;
		}
	}

	class Program {
		static void Main(string[] args) {
			var mediumIterations = 100;
			var shortIterations = 99;
			var nodeCount = 5000;
			var intMax = (int) Math.Pow(2, 31) - 1;

			var longList = new LinkedList();
			var rand = new Random();

			for (var i = 0; i < mediumIterations; i++) {
				var mediumList = new LinkedList();
				for (int j = 0; j < nodeCount; j++) {
					mediumList.push(rand.Next());
				}
		
				for (var j = 0; j < shortIterations; j++) {
					var shortList = new LinkedList();
					for (var k = 0; k < nodeCount; k++) {
						shortList.push(rand.Next());
					}
		
					shortList.sort();
					longList.push(shortList.head.val);
				}
		
				mediumList.sort();
				longList.push(mediumList.head.val);
			}

			longList.sort();
			Console.WriteLine(longList.head.val);
		}
	}
}