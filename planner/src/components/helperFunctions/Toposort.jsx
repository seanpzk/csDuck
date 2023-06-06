import { Heap } from 'heap-js';
import { backendURL } from './serverUrl';
import firebaseAuth from "../../firebase.config";

// const maxHeap = new Heap(Heap.minComparator);

// maxHeap.init([3, 4, 1, 12, 8]);
// maxHeap.push(2);

// console.log(maxHeap.peek()); //> 12
// console.log(maxHeap.pop()); //> 12
// console.log(maxHeap.peek()); // >8

class node {
    // doBefores it an array of incoming edges
    constructor(task) {
        this.task = task;
        // incoming edges
        console.log("Below is the task");
        console.log(task.doBefore);
        this.doBefore = task.doBefore;
        this.outgoingNode = [];
        this.in_deg = 0;
    }

    checkZero() {
        return this.in_deg === 0;
    }

    setOutgoingNode(nextNode) {
        this.outgoingNode.push(nextNode);
    }

    // hashmap map task: node
    updateOutgoingNodes(hashmap) {
        console.log("Node task: ");
        console.log(this.task);
        if (this.task.doBefore) {
            this.in_deg = this.task.doBefore.length;
            this.task.doBefore.forEach(outgoingTask => {
                // console.log("Outgoing task: ")
                // console.log(outgoingTask);
                // console.log("Hashmap: ");
                // console.log(hashmap);
                // console.log(hashmap.get(outgoingTask._id));
                hashmap.get(outgoingTask._id).setOutgoingNode(this);
            });
        }
    }
    
}

// Check if after addition of newTask, remains DAG
export async function verifyDAG(newTask) {

    const result = [];
    const user = firebaseAuth?.currentUser;
    const idToken = await user.getIdToken();

    const response = await fetch(`${backendURL}/toposort?UID=${user.uid}`, {
        method: "GET",
        headers: {
            Authorization: "Bearer " + idToken,  
            "Content-Type": "application/json",
        }
    });
    // all tasks of the user
    const tasks = await response.json()
    console.log("Below is the TASKSASASDASAS");
    console.log(tasks);

    // a and b are of type node declared above
    function customInDegComparator(a, b) {
        if (a.in_deg < b.in_deg) {
            return -1;
        } else if (a.in_deg > b.in_deg) {
            return 1;
        } else {
            return 0;
        }
    }

    // stores the nodes of the graph (NewTask + Existing tasks)
    const nodes = [];
    if (tasks.length <= 1) {
        return true;
    }
    // Iterates through all the previous tasks, create nodes and place in hashmap
    // hashmap-> task_id : node
    const taskToNode = new Map();
    // only edit request need to push newNode into nodes
    let edit = false;
    tasks.forEach(task => {
        let prevNode = null;
        if (task._id === newTask._id) {
            // Use newTask instead of task in Mongo (Edit function)
            console.log("EDIT");
            prevNode = new node(newTask);
            edit = true;
        } else {
            // (Insert function)
            prevNode = new node(task);
        }
        console.log("nodes");
        console.log(nodes);
        nodes.push(prevNode);
        taskToNode.set(task._id, prevNode);
    });
    if (!edit) {
        // insert the new task into hashmap
        const newNode = new node(newTask);
        nodes.push(newNode);
        taskToNode.set(newTask._id, newNode);
    }
    // iterates through all tasks to initialise the outgoing nodes array
    taskToNode.forEach(node => node.updateOutgoingNodes(taskToNode));
    console.log("THis is the hashmap: ");
    console.log(taskToNode);
    // initialise minHeap with custom comparator
    const inDegMinHeap = new Heap(customInDegComparator);
    console.log("NODES");
    console.log(nodes);
    inDegMinHeap.init(nodes);
    let visited = 0;

    // remove nodes with in-deg == 0
    while(!inDegMinHeap.isEmpty() && inDegMinHeap.peek().checkZero()) {
        console.log(inDegMinHeap);
        const curr_node = inDegMinHeap.poll();
        result.push(curr_node);
        console.log("curr_node: ");
        console.log(curr_node);
        visited ++;

        if (curr_node.outgoingNode.length !== 0) {
            curr_node.outgoingNode
                .forEach(node => {
                    node.in_deg = node.in_deg - 1;
                    console.log("FOR EACH");
                    console.log(node);
                })
        }
        console.log("Next item in-deg: ");
        console.log(inDegMinHeap.peek());
    }
    console.log("Visited number: ");
    console.log(visited);
    console.log("nodes number: ");
    console.log(nodes.length);
    console.log("TopoOrder");
    console.log(result);
    return visited === nodes.length;
}

// receives array of {label: name, value: mongoID}
export default function Toposort() {

    async function enclose() {
        const user = firebaseAuth?.currentUser;
        const idToken = await user.getIdToken();

        const response = await fetch(`${backendURL}/toposort?UID=${user.uid}`, {
            method: "GET",
            headers: {
                Authorization: "Bearer " + idToken,  
                "Content-Type": "application/json",
            }
        });
        const tasks = await response.json();

        // Comparator which creates min-heap based on deadline
        function customDeadlineComparator(a, b) {
            if (a.deadline < b.deadline) {
                return -1;
            } else if (a.deadline > b.deadline) {
                return 1;
            } else {
                return 0;
            }
        }

        // Instantiate min-heap and push items in
        const heap = new Heap(customDeadlineComparator);
        heap.init(tasks);

        function showTasks() {
            console.log(heap.length);
            for (let i = 0; i < 3; i ++) {
                console.log(heap.pop());
            }
        }
        showTasks();
    }

    return( 
        <button onClick = {enclose}>Click here</button>
    );
}