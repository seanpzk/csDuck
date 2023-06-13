import { Heap } from 'heap-js';
import { backendURL } from './serverUrl';
import firebaseAuth from "../../firebase.config";

/** 
 * Acts as a Node in a Graph.
 *  Graph used to carry out Topological sorting 
 * */
class node {
    
    /**
     * The node Constructor.
     * Only required params specified here.
     * 
     * @param {Object} task - The task object from MongoDB.
     * @param {Object[]} task.doBefore - Array of tasks to be done before current.
     */
    constructor(task) {
        /** Task that is the value of the current node */
        this.task = task;
        this.doBefore = task.doBefore;
        /** Models the outgoing edges from current node */
        this.outgoingNode = [];
        /** in-deg of current node */
        this.in_deg = -1;
    }

    /**  
     * Check if node's in-deg equals 0.
     * 
     * @method checkZero
     * @returns {boolean} - if current node's in-deg == 0.
    */
    checkZero() {
        return this.in_deg == 0;
    }

    /**
     * Push outgoing Node into current Node's outgoingNode array.
     * 
     * @param {Object} nextNode - Task (Node) to be done AFTER current task is completed
     * @return {void}
     */
    setOutgoingNode(nextNode) {
        this.outgoingNode.push(nextNode);
    }

    /**
     * Updates in-deg of current node based on doBefore array length. 
     * Update the modeling of outgoing edges of this node.
     * 
     * @method updateOutgoingNodes
     * @param {Map} hashmap - Maps task : node
     * @return {void}
     */
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

/**
 * Extracts existing tasks previosly added by user from MongoDB.
 * 
 * @function extractExistingTasks
 * @async
 * @returns {Object[]} - array of tasks from MongoDB
 */
async function extractExistingTasks() {
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
    return tasks;
}

/**
 * Checks if AFTER addition of newTask, graph remains a DAG.
 * Fetches data from database to obtain past tasks records
 * 
 * @function verifyDAG
 * @async
 * @param {Object} newTask - new Task to be added
 * @returns {boolean} - if DAG is present. return: number of visited nodes != number of nodes
 */
export default async function verifyDAG(newTask) {

    /**
     * Custom Comparator used for ordering in min in-deg Heap.
     * Sorts by in-deg, breakevens by deadline.
     * 
     * @param {Node} a
     * @param {Node} b 
     * @returns {int} - {-1 : top of Heap, 1 : bottom of Heap}
     */
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

    const tasks = await extractExistingTasks();
    
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

/**
 * Topologically Sorts a DAG 
 * 
 * @function Toposort
 * @async
 * @return {Object[]} - array of sorted tasks
 */
export async function Toposort() {
        // stores the topological sorted items
        const result = [];
        // all tasks of the user from Mongo
        const tasks = await extractExistingTasks();
    
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