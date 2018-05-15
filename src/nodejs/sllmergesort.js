class Node {
	constructor(val, next) {
		this.val = val;
		this.next = next || null;
	}
}

class LinkedList {
	constructor() {
		this.head = null;
	}

	push(newValue) {
		let newNode = new Node(newValue, this.head);
		this.head = newNode;
	}

	sort() {
		this.head = this.mergeSort(this.head);
	}

	mergeSort(startNode) {
		if (startNode == null || startNode.next == null) {
			return startNode;
		}

		const middle = this.getMiddle(startNode);
		const middleStart = middle.next;
		middle.next = null;
		
		const left = this.mergeSort(startNode);
		const right = this.mergeSort(middleStart);
		const merged = this.merge(left, right);

		return merged;
	}

	merge(leftNode, rightNode) {
		if (leftNode == null) return rightNode;
		if (rightNode == null) return leftNode;
		
		let result = null
		if (leftNode.val <= rightNode.val) {
			result = leftNode;
			result.next = this.merge(leftNode.next, rightNode);
		} else {
			result = rightNode;
			result.next = this.merge(leftNode, rightNode.next);
		}

		return result;
	}

	getMiddle(startNode) {
		if (startNode == null) return startNode;

		let fastNode = startNode.next;
		let slowNode = startNode;

		while (fastNode != null) {
			fastNode = fastNode.next;
			if (fastNode != null) {
				slowNode = slowNode.next;
				fastNode = fastNode.next;
			}
		}
		
		return slowNode;
	}

	toString() {
		let result = "";
		let current = this.head;
		while (current != null) {
			result += current.val;
			result += current.next == null ? "" : ", ";
			current = current.next;
		}
		return result;
	}

	length() {
		let count = 0;
		let current = this.head;
		while (current != null) {
			count += 1;
			current = current.next;
		}
		return count
	}
}

const getRandomInt = (max) => {
	return Math.floor(Math.random() * Math.floor(max));
}

const main = () => {
	const mediumIterations = 100;
	const shortIterations = 99;
	const nodeCount = 10000;
	const intMax = Math.pow(2, 31) - 1;

	let longList = new LinkedList();

	for (let i = 0; i < mediumIterations; i++) {
		const mediumList = new LinkedList();
		for (let j = 0; j < nodeCount; j++) {
			mediumList.push(getRandomInt(intMax));
		}

		for (let j = 0; j < shortIterations; j++) {
			const shortList = new LinkedList();
			for (let k = 0; k < nodeCount; k++) {
				shortList.push(getRandomInt(intMax));
			}

			shortList.sort();
			longList.push(shortList.head.val);
		}

		mediumList.sort();
		longList.push(mediumList.head.val);
	}
	

	longList.sort();
	console.log(longList.head.val);
}

main();