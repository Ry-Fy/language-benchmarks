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
		LinkedList { head: None }
	}

	fn push(&mut self, new_val: i32) {
		let new_node = Node { val: new_val, next: self.head.take() };
		let boxed_node = Box::new(new_node);
		self.head = Some(boxed_node);
	}

	fn merge_sort(start_node: Option<&Node>) -> Option<&Node> {
		if start_node.is_none() || start_node.unwrap().next.is_none() {
			return start_node;
		}

		return None
	}

	/*
	func (list *LinkedList) merge(leftNode *Node, rightNode *Node) *Node {
		if leftNode == nil {
			return rightNode
		} else if rightNode == nil {
			return leftNode
		}

		var result *Node
		if leftNode.val <= rightNode.val {
			result = leftNode
			result.next = list.merge(leftNode.next, rightNode)
		} else {
			result = rightNode
			result.next = list.merge(leftNode, rightNode.next)
		}

		return result
	}
	*/
	fn merge<'a>(&self, left_opt: Option<&'a Node>, right_opt: Option<&'a Node>) -> Option<&'a Node> {
		if left_opt.is_none() {
			return right_opt;
		} else if right_opt.is_none() {
			return left_opt;
		}

		let mut left_node: &Node = left_opt.unwrap();
		let mut right_node: &Node = right_opt.unwrap();
		let mut result_node: &Node;

		if left_node.val <= right_node.val {
			result_node = left_node;
			let left_next: Option<&Node> = left_node.next.as_ref().map(|x| &**x);
			//result_node.next = self.merge(left_next, Some(right_node));
		} else {
			result_node = right_node;
			let right_next: Option<&Node> = right_node.next.as_ref().map(|x| &**x);
			//result_node.next = self.merge(Some(left_node), right_next);
		}

		return Some(result_node);
	} 

	fn get_middle(start_node: Option<&Node>) -> Option<&Node> {
		let mut slow_node: &Node = start_node?;
		let mut fast_node: Option<&Node> = slow_node.next.as_ref().map(|x| &**x);

		while let Some(f) = fast_node {
			fast_node = f.next.as_ref().map(|x| &**x);
			if let Some(f) = fast_node {
				slow_node = slow_node.next.as_ref().map(|x| &**x).unwrap();
				fast_node = f.next.as_ref().map(|x| &**x);
			}
		}

		return Some(slow_node)
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