// https://gist.github.com/hardvain/32fca033bb61a5e3bf8bbeeb32fbbd5e
// http://cglab.ca/%7Eabeinges/blah/too-many-lists/book/second-option.html

struct Node {
	val: i32,
	next: Option<Box<Node>>,
}

struct LinkedList {
	head: Option<Box<Node>>,
}

impl LinkedList {
	fn new() -> Self {
		return LinkedList { head: None }
	}

	fn push(&mut self, new_val: i32) {
		let new_node = Node { val: new_val, next: self.head.take() };
		let boxed_node = Box::new(new_node);
		self.head = Some(boxed_node);
	}

	/*
	GO IMPLEMENTATION FOR  THE FUNCTION I'M TRYING TO WRITE
	func (list *LinkedList) getMiddle(startNode *Node) *Node {
		if startNode == nil {
			return startNode
		}

		fastNode := startNode.next
		slowNode := startNode

		for fastNode != nil {
			fastNode = fastNode.next
			if fastNode != nil {
				slowNode = slowNode.next
				fastNode = fastNode.next
			}
		}

		return slowNode
	}
	*/

	fn get_middle(start_node: Option<&Node>) -> Option<&Node> {
		let mut slow: &Node = start_node?;
		let mut fast: Option<&Node> = slow.next.as_ref().map(|x| &**x);
		while let Some(f) = fast {
			fast = f.next.as_ref().map(|x| &**x);
			if let Some(f) = fast {
				slow = slow.next.as_ref().map(|x| &**x).unwrap();
				fast = f.next.as_ref().map(|x| &**x);
			}
		}
		Some(slow)
	}
}

fn main() {
	let mut long_list = LinkedList::new();
	long_list.push(10);
	long_list.push(100);
	long_list.push(50);
	long_list.push(25);
	long_list.push(5);
	long_list.push(75);
}