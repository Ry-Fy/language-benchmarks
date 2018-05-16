#include <stdio.h>
#include <stdlib.h>

typedef struct Node {
	int val;
	struct Node* next;
} Node;

typedef struct LinkedList {
	struct Node* head;
} LinkedList;

Node* node_new(int newVal, Node* next);
void node_free(Node* node);
LinkedList* list_new();
void list_push(LinkedList* list, int newVal);
void list_sort(LinkedList* list);
void list_print(LinkedList* list);
Node* merge_sort(Node* startNode);
Node* merge(Node* leftNode, Node* rightNode);
Node* get_middle(Node* startNode);

//////////////////////////////////////////////////
Node* node_new(int newVal, Node* next) {
	Node* newNode = malloc(sizeof(Node));
	newNode->val = newVal;
	newNode->next = next;
	return newNode;
}

void node_free(Node* node) {
	free(node);
}

LinkedList* list_new() {
	LinkedList* newList = malloc(sizeof(LinkedList));
	newList->head = NULL;
	return newList;
}

void list_free(LinkedList* list) {
	Node* current = list->head;
	while (current != NULL) {
		Node* origCurrent = current;
		current = current->next;
		node_free(origCurrent);
	}
	free(list);
}

void list_push(LinkedList* list, int newVal) {
	Node* newNode = node_new(newVal, list->head);
	list->head = newNode;
}

void list_sort(LinkedList* list) {
	list->head = merge_sort(list->head);
}

void list_print(LinkedList* list) {
	Node* current = list->head;
	while (current) {
		printf("%d", current->val);
		if (current->next) {
			printf(", ");
		}
		current = current->next;
	}
}

Node* merge_sort(Node* startNode) {
	if (!startNode || !startNode->next) {
		return startNode;
	}

	Node* middle = get_middle(startNode);
	Node* middleStart = middle->next;
	middle->next = NULL;

	Node* left = merge_sort(startNode);
	Node* right = merge_sort(middleStart);
	Node* merged = merge(left, right);

	return merged;
}

Node* merge(Node* leftNode, Node* rightNode) {
	if (!leftNode) {
		return rightNode;
	} else if (!rightNode) {
		return leftNode;
	}

	Node* result;
	if (leftNode->val <= rightNode->val) {
		result = leftNode;
		result->next = merge(leftNode->next, rightNode);
	} else {
		result = rightNode;
		result->next = merge(leftNode, rightNode->next);
	}

	return result;
}

Node* get_middle(Node* startNode) {
	if (!startNode) {
		return startNode;
	}

	Node* fastNode = startNode->next;
	Node* slowNode = startNode;

	while (fastNode) {
		fastNode = fastNode->next;
		if (fastNode) {
			slowNode = slowNode->next;
			fastNode = fastNode->next;
		}
	}

	return slowNode;
}

int getRandomInt() {
	int max = 2147483647;
	return rand() % max;
}

int main(int argc, char** argv) {
	int mediumIterations = 100;
	int shortIterations = 99;
	int nodeCount = 5000;
	LinkedList* longList = list_new();
	printf("starting\n");

	for (int i = 0; i < mediumIterations; i++) {
		LinkedList* mediumList = list_new();
		for (int j = 0; j < nodeCount; j++) {
			list_push(mediumList, getRandomInt());
		}

		for (int j = 0; j < shortIterations; j++) {
			LinkedList* shortList = list_new();
			for (int k = 0; k < nodeCount; k++) {
				list_push(shortList, getRandomInt());
			}

			list_sort(shortList);
			list_push(longList, shortList->head->val);
			list_free(shortList);
		}

		list_sort(mediumList);
		list_push(longList, mediumList->head->val);
		list_free(mediumList);
	}

	list_sort(longList);
	printf("%d\n", longList->head->val);
	return 0;
}