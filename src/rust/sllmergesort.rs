// https://gist.github.com/hardvain/32fca033bb61a5e3bf8bbeeb32fbbd5e
// http://cglab.ca/%7Eabeinges/blah/too-many-lists/book/second-option.html

struct Node {
	val: i32,
	next: Option<Box<Node>>,
}

impl Node {
	fn new(val: i32, next: Option<Box<Node>>) -> Self {
		return Node { val: val, next: next };
	}
}

struct LinkedList {
	head: Option<Box<Node>>,
}

impl LinkedList {
	fn new() -> Self {
		return LinkedList { head: None }
	}

	fn push(&mut self, new_val: i32) {
		let new_node = Box::new(Node::new(new_val, self.head.take()));
		self.head = Some(new_node);
	}

	/*fn sort() {

	}

	fn merge_sort(start_node: Option<Box<Node>>) -> Option<Box<Node>> {

	}

	fn merge(left_node: Option<Box<Node>>, right_node: Option<Box<Node>>) -> Option<Box<Node>> {
		
	}

	fn pop_node(&mut self) -> Option<Box<Node<T>>> {
    self.head.take().map(|mut node| {
        self.head = node.next.take();
        node
    })
}
	*/

	fn get_middle(&mut self, start_node: Option<Box<Node>>) -> Option<Box<Node>> {
		if start_node.is_none() { return None; }
		
		let fast_node = start_node.map(|start| start.next);
		let slow_node = start_node;

		//while fast_node.is_some() {
		//	fast_node = match fast_node.unwrap().next { Some(next) => Some(next), None => None };
		//}

		return None;
	}
}

fn main() {
	let medium_iterations: i32 = 100;
	let short_iterations: i32 = 99;
	let node_count: i32 = 5000;
	let int_max: i32 = 2i32.pow(31) - 1;

	let long_list = LinkedList::new();

	for _ in 0..medium_iterations {
		let medium_list = LinkedList::new();
		for _ in 0..node_count {

		}
	}
}