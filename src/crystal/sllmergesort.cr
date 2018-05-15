class Node
	property :val, :next
	def initialize(@val : Int32, @next : Node? = nil) end
end

class LinkedList
	getter head
	def initialize(@head : Node? = nil) end

	def push(new_val : Int32) : Void
		new_node = Node.new(new_val, @head)
		@head = new_node
	end

	def sort() : Void
		@head = merge_sort(@head)
	end

	private def merge_sort(start_node : Node?) : Node?
		return start_node if start_node.nil? || start_node.next.nil?

		middle = get_middle(start_node)
		return nil if middle.nil?

		middle_start = middle.next
		middle.next = nil

		left = merge_sort(start_node)
		right = merge_sort(middle_start)
		merged = merge(left, right)

		return merged
	end

	private def merge(left_node : Node?, right_node : Node?) : Node?
		return right_node if left_node.nil?
		return left_node if right_node.nil?

		result : Node
		if (left_node.val <= right_node.val)
			result = left_node
			result.next = merge(left_node.next, right_node)
		else
			result = right_node
			result.next = merge(left_node, right_node.next)
		end

		return result
	end

	private def get_middle(start_node : Node?) : Node?
		return start_node if start_node.nil?

		fast_node = start_node.next
		slow_node = start_node

		while !fast_node.nil?
			fast_node = fast_node.next
			if !fast_node.nil?
				slow_node = slow_node.not_nil!.next
				fast_node = fast_node.next
			end
		end

		return slow_node
	end

	def to_s() : String
		result = ""
		current = @head
		while !current.nil?
			result += current.val.to_s()
			result += current.next.nil? ? "" : ", "
			current = current.next
		end
		return result
	end
end

def main()
	medium_iterations = 100
	short_iterations = 99
	node_count = 10_000
	int_max = (2 ** 31) -1

	long_list = LinkedList.new()

	medium_iterations.times do
		medium_list = LinkedList.new()
		node_count.times do
			medium_list.push(rand(int_max))
		end

		short_iterations.times do
			short_list = LinkedList.new()
			node_count.times do
				short_list.push(rand(int_max))
			end

			short_list.sort()
			long_list.push(short_list.head.not_nil!.val)
		end

		medium_list.sort()
		long_list.push(medium_list.head.not_nil!.val)
	end

	long_list.sort()
	puts long_list.head.not_nil!.val
end

main()