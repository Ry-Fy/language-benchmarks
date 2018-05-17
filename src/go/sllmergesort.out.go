package main

import (
	"fmt"
	"strconv"
	"math/rand"
) 

type Node struct {
	val int32
	next *Node
}

func NodeNew(newVal int32, next *Node) Node {
	return Node {
		val: newVal,
		next: next,
	}
}

type LinkedList struct {
	head *Node
}

func LinkedListNew() LinkedList {
	return LinkedList {
		head: nil,
	}
}

func (list *LinkedList) push(newVal int32) {
	newNode := NodeNew(newVal, list.head)
	list.head = &newNode
}

func (list *LinkedList) sort() {
	list.head = list.mergeSort(list.head)
}

func (list *LinkedList) mergeSort(startNode *Node) *Node {
	if startNode == nil || startNode.next == nil {
		return startNode
	}

	middle := list.getMiddle(startNode)
	middleStart := middle.next
	middle.next = nil

	left := list.mergeSort(startNode)
	right := list.mergeSort(middleStart)
	merged := list.merge(left, right)

	return merged
}

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

func (list *LinkedList) toString() string {
	result := ""
	current := list.head
	for current != nil {
		result += strconv.Itoa(int(current.val))
		if current.next == nil {
			result += ""
		} else {
			result += ", "
		}
		current = current.next
	}

	return result
}

func main() {
	mediumIterations := 100
	shortIterations := 99
	nodeCount := 5000

	longList := LinkedListNew()

	for i := 0; i < mediumIterations; i++ {
		mediumList := LinkedListNew()
		for j := 0; j < nodeCount; j++ {
			mediumList.push(rand.Int31())
		}

		for j := 0; j < shortIterations; j++ {
			shortList := LinkedListNew()
			for k := 0; k < nodeCount; k++ {
				shortList.push(rand.Int31())
			}

			shortList.sort()
			longList.push(shortList.head.val)
		}

		mediumList.sort()
		longList.push(mediumList.head.val)
	}

	longList.sort()
	fmt.Println(strconv.Itoa(int(longList.head.val)))
}