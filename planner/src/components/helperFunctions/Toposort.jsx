import { Heap } from 'heap-js';
import { backendURL } from './serverUrl';
import firebaseAuth from "../../firebase.config";

class node {
    // doBefores it an array of incoming edges
    constructor(task) {
        this.task = task;
        // incoming edges
        this.doBefore = task.doBefore;
        this.outgoingNode = [];
        this.in_deg = -1;
    }

    checkZero() {
        return this.in_deg == 0;
    }

    setOutgoingNode(nextNode) {
        this.outgoingNode.push(nextNode);
    }

    // hashmap map task: node
    updateOutgoingNodes(hashmap) {
        if (this.task.doBefore) {
            this.in_deg = this.doBefore.length;
            this.doBefore.forEach(outgoingTask => {
                if (outgoingTask._id) {
                    hashmap.get(outgoingTask._id).setOutgoingNode(this);
                } else {
                    // for newTask without id
                    hashmap.get("-1").setOutgoingNode(this);
                }
            });
        }
    }
    
}

// Check if after addition of newTask, remains DAG
export default async function verifyDAG(newTask) {

    const user = firebaseAuth?.currentUser;
    const idToken = await user.getIdToken();

    const response = await fetch(`${backendURL}/toposort?UID=${user.uid}`, {
        method: "GET",
        headers: {
            Authorization: "Bearer " + idToken,  
            "Content-Type": "application/json",
        }
    });
    // all tasks of the user from Mongo
    const tasks = await response.json();

    // a and b are of type node declared above
    // Sorts by in-deg, breakeven by deadline
    function customInDegComparator(a, b) {
        if (a.in_deg < b.in_deg) {
            return -1;
        } else if (a.in_deg > b.in_deg) {
            return 1;
        } else {
            if (a.task.deadline < b.task.deadline) {
                return -1;
            } else if (a.task.deadline > b.task.deadline){
                return 1;
            } else {
                return 0;
            }
        }
    }

    // stores the nodes of the graph (NewTask + Existing tasks)
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
            // Use newTask instead of mongoTask (Edit function)
            prevNode = new node(newTask);
            edit = true;
        } else {
            // (Insert function)
            prevNode = new node(task);
        }
        if (task._id) {
            taskToNode.set(task._id, prevNode);
        } else {
            // Find a way to get by this => new task doesn't have an ID
            taskToNode.set("-1", prevNode);
        }
    });
    if (!edit) {
        // insert the new task into hashmap
        const newNode = new node(newTask);
        taskToNode.set(newTask._id, newNode);
    }
    // iterates through all tasks to initialise the outgoing nodes array
    taskToNode.forEach(node => node.updateOutgoingNodes(taskToNode));
    const minArr = [];
    taskToNode.forEach(node => minArr.push(node));
    // initialise minHeap with custom comparator
    const inDegMinHeap = new Heap(customInDegComparator);
    inDegMinHeap.init(minArr);
    let visited = 0;

    // remove nodes with in-deg == 0
    while(!inDegMinHeap.isEmpty() && inDegMinHeap.peek().checkZero()) {
        const curr_node = inDegMinHeap.poll();
        visited ++;

        curr_node.outgoingNode
            .forEach(node => {
                node.in_deg --;
                // Can optimise this
                inDegMinHeap.remove(node);
                inDegMinHeap.add(node);
            })
    }
    return visited === minArr.length;
}

export async function Toposort() {
        // stores the topological sorted items
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
        // all tasks of the user from Mongo
        const tasks = await response.json();
    
        // a and b are of type node declared above
        // Sorts by in-deg, breakeven by deadline
        function customInDegComparator(a, b) {
            if (a.in_deg < b.in_deg) {
                return -1;
            } else if (a.in_deg > b.in_deg) {
                return 1;
            } else {
                if (a.task.deadline < b.task.deadline) {
                    return -1;
                } else if (a.task.deadline > b.task.deadline){
                    return 1;
                } else {
                    return 0;
                }
            }
        }
    
        // stores the nodes of the graph (NewTask + Existing tasks)
        if (tasks.length <= 1) {
            return true;
        }
        // Iterates through all the previous tasks, create nodes and place in hashmap
        // hashmap-> task_id : node
        const taskToNode = new Map();
        // only edit request need to push newNode into nodes
        tasks.forEach(task => {
            const prevNode = new node(task);
            taskToNode.set(task._id, prevNode);
        });
        // iterates through all tasks to initialise the outgoing nodes array
        taskToNode.forEach(node => node.updateOutgoingNodes(taskToNode));
        const minArr = [];
        taskToNode.forEach(node => minArr.push(node));
        // initialise minHeap with custom comparator
        const inDegMinHeap = new Heap(customInDegComparator);
        inDegMinHeap.init(minArr);
    
        // remove nodes with in-deg == 0
        while(!inDegMinHeap.isEmpty() && inDegMinHeap.peek().checkZero()) {
            const curr_node = inDegMinHeap.poll();
            result.push(curr_node);
    
            curr_node.outgoingNode
                .forEach(node => {
                    node.in_deg --;
                    // Can optimise this
                    inDegMinHeap.remove(node);
                    inDegMinHeap.add(node);
                })
        }
        return result;
}