import verifyDAG, { Toposort, node } from '../src/components/helperFunctions/Toposort.jsx';


describe("node class tests", () => {
    const task2 = {
        _id: "task2",
        deadline: "2023-06-25",
        description: "Testing purpose",
        doBefore: [],
        fireabaseUID: "abcdefggsdf",
        name: "nameOfTask2",
        priority: "low"
    };
    const task3 = {
        _id: "task3",
        deadline: "2023-07-25",
        description: "Testing purpose",
        doBefore: [],
        fireabaseUID: "abcdefggsdf",
        name: "nameOfTask3",
        priority: "med"
    };
    const task1 = {
        _id: "task1",
        deadline: "2023-06-23",
        description: "Testing purpose",
        doBefore: [task2, task3],
        fireabaseUID: "abcdefg",
        name: "nameOfTask1",
        priority: "high"
    };
    const node1 = new node(task1);
    const node2 = new node(task2);
    const node3 = new node(task3);
    test("Fields of node class after instantiation", () => {
        expect(node1.task).toBe(task1);
        expect(node1.task).toEqual(task1);
        expect(node1.doBefore).toEqual(node1.task.doBefore);
        // starts with empty outgoingNodes
        expect(node1.outgoingNode).toEqual([]);
        expect(node1.doBefore).toEqual(task1.doBefore);
        // starts with in_deg = -1
        expect(node1.in_deg).toBe(-1);
    });
    test("Functionality of node class methods", () => {
        expect(node1.checkZero()).toBe(false);
        // Test setOutgoingNode method
        node1.setOutgoingNode(node2);
        expect(node1.outgoingNode).toEqual([node2]);
        // reset for next test
        node1.outgoingNode = [];
        // Test updateOutgoingNodes method (with hashmap)
        const taskToNode = new Map();
        taskToNode.set(task1._id, node1);
        taskToNode.set(task2._id, node2);
        taskToNode.set(task3._id, node3);
        taskToNode.forEach(node => node.updateOutgoingNodes(taskToNode));
        expect(node1.in_deg).toEqual(2);
        expect(node2.outgoingNode).toEqual([node1]);
        expect(node3.outgoingNode).toEqual([node1]);
        taskToNode.forEach(node => {
            node.outgoingNode = [];
        });
    })
});

/**
 * Refer to "./topoTestCases" folder for the pictorial graphs
 */
test('VerifyDAG function', async () => {
    // verifyDAG0
    expect(await verifyDAG({}, [])).toBe(true);
    // verifyDAG1
    expect(await verifyDAG({name: "task1", 
    deadline: "", 
    priority: "", 
    description: "", 
    firebaseUID: "sadf", 
    doBefore: []}
    , [])).toBe(true);
    // verifyDAG2
    expect(await verifyDAG({
        deadline: "",
        description: "",
        doBefore: [{
            _id: "1",
            deadline: "",
            description: "",
            doBefore: [],
            fireabaseUID: "asdfasdf",
            name: "task1",
            priority: ""
        }],
        fireabaseUID: "asdfasdf",
        name: "task2",
        priority: ""
    }, [{
        _id: "1",
        deadline: "",
        description: "",
        doBefore: [],
        fireabaseUID: "asdfasdf",
        name: "task1",
        priority: ""
    }])).toBe(true);
    // verifyDAG3
    expect(await verifyDAG({
        deadline: "",
        description: "",
        doBefore: [{
            _id: "2",
            deadline: "",
            description: "",
            doBefore: [],
            fireabaseUID: "asdfasdf",
            name: "task2",
            priority: ""
        }],
        fireabaseUID: "asdfasdf",
        name: "task3",
        priority: ""
    }, [{
        _id: "1",
        deadline: "",
        description: "",
        doBefore: [],
        fireabaseUID: "asdfasdf",
        name: "task1",
        priority: ""
    }, {
        _id: "2",
        deadline: "",
        description: "",
        doBefore: [{
            _id: "1",
            deadline: "",
            description: "",
            doBefore: [],
            fireabaseUID: "asdfasdf",
            name: "task1",
            priority: ""
        }],
        fireabaseUID: "asdfasdf",
        name: "task2",
        priority: ""
    }])).toBe(true);
    // verifyDAG4
    expect(await verifyDAG({
        _id: "1",
        deadline: "",
        description: "",
        doBefore: [{
            _id: "3",
            deadline: "",
            description: "",
            doBefore: [],
            fireabaseUID: "asdfasdf",
            name: "task3",
            priority: ""
        }],
        fireabaseUID: "asdfasdf",
        name: "task1",
        priority: ""
    }, [{
        _id: "2",
        deadline: "",
        description: "",
        doBefore: [{
            _id: "1",
            deadline: "",
            description: "",
            doBefore: [],
            fireabaseUID: "asdfasdf",
            name: "task1",
            priority: ""
        }],
        fireabaseUID: "asdfasdf",
        name: "task2",
        priority: ""
    }, {
        _id: "3",
        deadline: "",
        description: "",
        doBefore: [{
            _id: "2",
            deadline: "",
            description: "",
            doBefore: [],
            fireabaseUID: "asdfasdf",
            name: "task2",
            priority: ""
        }],
        fireabaseUID: "asdfasdf",
        name: "task3",
        priority: ""
    }])).toBe(false);
    // verifyDAG5
    expect(await verifyDAG({
        deadline: "",
        description: "",
        doBefore: [{
            _id: "2",
            deadline: "",
            description: "",
            doBefore: [{
                _id: "1",
                deadline: "",
                description: "",
                doBefore: [],
                fireabaseUID: "asdfasdf",
                name: "task1",
                priority: "" 
            }],
            fireabaseUID: "asdfasdf",
            name: "task2",
            priority: ""
        }, {
            _id: "1",
            deadline: "",
            description: "",
            doBefore: [],
            fireabaseUID: "asdfasdf",
            name: "task1",
            priority: "" 
        }],
        fireabaseUID: "asdasdfvqwerfasdf",
        name: "task3",
        priority: ""
    }, [{
        _id: "1",
        deadline: "",
        description: "",
        doBefore: [],
        fireabaseUID: "asdfasdf",
        name: "task1",
        priority: ""
    }, 
    {
        _id: "2",
        deadline: "",
        description: "",
        doBefore: [{
            _id: "1",
            deadline: "",
            description: "",
            doBefore: [],
            fireabaseUID: "asdfasdf",
            name: "task1",
            priority: ""
        }],
        fireabaseUID: "sdvcdsf",
        name: "task2",
        priority: ""
    }])).toEqual(true);
    // verifyDAG6
    expect(await verifyDAG({
        _id: "4",
        deadline: "",
        description: "",
        doBefore: [{
            _id: "2",
            deadline: "",
            description: "",
            doBefore: [{
                _id: "1",
                deadline: "",
                description: "",
                doBefore: [],
                fireabaseUID: "asdfasdf",
                name: "task1",
                priority: ""
            }],
            fireabaseUID: "asdfasdf",
            name: "task1",
            priority: ""
        }, {
            _id: "3",
            deadline: "",
            description: "",
            doBefore: [{
                _id: "1",
                deadline: "",
                description: "",
                doBefore: [],
                fireabaseUID: "asdfasdf",
                name: "task1",
                priority: ""
            }, {
                _id: "2",
                deadline: "",
                description: "",
                doBefore: [{
                    _id: "1",
                    deadline: "",
                    description: "",
                    doBefore: [],
                    fireabaseUID: "asdfasdf",
                    name: "task1",
                    priority: ""
                }],
                fireabaseUID: "asdfasdf",
                name: "task2",
                priority: ""
            }],
            fireabaseUID: "asdfasdf",
            name: "task3",
            priority: ""
        }],
        fireabaseUID: "asdfasdf",
        name: "task4",
        priority: ""
    }, [{
        _id: "1",
        deadline: "",
        description: "",
        doBefore: [],
        fireabaseUID: "asdfasdf",
        name: "task1",
        priority: ""
    }, {
        _id: "2",
        deadline: "",
        description: "",
        doBefore: [{
            _id: "1",
            deadline: "",
            description: "",
            doBefore: [],
            fireabaseUID: "asdfasdf",
            name: "task1",
            priority: ""
        }],
        fireabaseUID: "asdfasdf",
        name: "task2",
        priority: ""
    }, {
        _id: "3",
        deadline: "",
        description: "",
        doBefore: [{
            _id: "1",
            deadline: "",
            description: "",
            doBefore: [],
            fireabaseUID: "asdfasdf",
            name: "task1",
            priority: ""
        }, {
            _id: "2",
            deadline: "",
            description: "",
            doBefore: [{
                _id: "1",
                deadline: "",
                description: "",
                doBefore: [],
                fireabaseUID: "asdfasdf",
                name: "task1",
                priority: ""
            }],
            fireabaseUID: "asdfasdf",
            name: "task2",
            priority: ""
        }],
        fireabaseUID: "asdfasdf",
        name: "task3",
        priority: ""
    }])).toBe(true);
    // verifyDAG7
    expect(await verifyDAG({
        _id: "1",
        deadline: "",
        description: "",
        doBefore: [{
            _id: "2",
            deadline: "",
            description: "",
            doBefore: [],
            fireabaseUID: "asdfasdf",
            name: "task2",
            priority: ""
        }],
        fireabaseUID: "asdfasdf",
        name: "task1",
        priority: ""
    }, [{
        _id: "1",
        deadline: "",
        description: "",
        doBefore: [],
        fireabaseUID: "asdfasdf",
        name: "task1",
        priority: ""
    }, {
        _id: "2",
        deadline: "",
        description: "",
        doBefore: [{
            _id: "1",
            deadline: "",
            description: "",
            doBefore: [],
            fireabaseUID: "asdfasdf",
            name: "task1",
            priority: ""
        }],
        fireabaseUID: "asdfasdf",
        name: "task2",
        priority: ""
    }])).toBe(false);
});

test('Verify Toposort output', async () => {
    // Empty set
    expect(await Toposort([])).toEqual([]);
    // Topo1
    expect((await Toposort([{
        _id: "1",
        deadline: "",
        description: "",
        doBefore: [],
        fireabaseUID: "asdfasdf",
        name: "task1",
        priority: ""
    }])).map(task => task._id)).toEqual(["1"]);
    // Topo2
    expect((await Toposort([{
        _id: "1",
        deadline: "",
        description: "",
        doBefore: [],
        fireabaseUID: "asdfasdf",
        name: "task1",
        priority: ""
    }, {
        _id: "2",
        deadline: "",
        description: "",
        doBefore: [{
            _id: "1",
            deadline: "",
            description: "",
            doBefore: [],
            fireabaseUID: "asdfasdf",
            name: "task1",
            priority: ""
        }],
        fireabaseUID: "asdfasdf",
        name: "task2",
        priority: ""
    }])).map(task => task._id)).toEqual(["1", "2"]);
    // Topo3
    expect((await Toposort([{
        _id: "1",
        deadline: "",
        description: "",
        doBefore: [],
        fireabaseUID: "asdfasdf",
        name: "task1",
        priority: ""
    }, {
        _id: "2",
        deadline: "",
        description: "",
        doBefore: [{
            _id: "1",
            deadline: "",
            description: "",
            doBefore: [],
            fireabaseUID: "asdfasdf",
            name: "task1",
            priority: ""
        }],
        fireabaseUID: "asdfasdf",
        name: "task2",
        priority: ""
    }, {
        _id: "3",
        deadline: "",
        description: "",
        doBefore: [{
            _id: "1",
            deadline: "",
            description: "",
            doBefore: [],
            fireabaseUID: "asdfasdf",
            name: "task1",
            priority: ""
        }],
        fireabaseUID: "asdfasdf",
        name: "task3",
        priority: ""
    }, {
        _id: "4",
        deadline: "",
        description: "",
        doBefore: [],
        fireabaseUID: "asdfasdf",
        name: "task4",
        priority: ""
    }])).map(task => task._id)).toEqual(["1", "4", "3", "2"]);

    // Topo4
    expect((await Toposort([{
        _id: "1",
        deadline: "2023-06-23",
        description: "",
        doBefore: [],
        fireabaseUID: "asdfasdf",
        name: "task1",
        priority: ""
    }, {
        _id: "2",
        deadline: "2023-06-27",
        description: "",
        doBefore: [{
            _id: "1",
            deadline: "2023-06-23",
            description: "",
            doBefore: [],
            fireabaseUID: "asdfasdf",
            name: "task1",
            priority: ""
        }],
        fireabaseUID: "asdfasdf",
        name: "task2",
        priority: ""
    }, {
        _id: "3",
        deadline: "2023-06-26",
        description: "",
        doBefore: [{
            _id: "1",
            deadline: "2023-06-23",
            description: "",
            doBefore: [],
            fireabaseUID: "asdfasdf",
            name: "task1",
            priority: ""
        }, {
            _id: "2",
            deadline: "2023-06-27",
            description: "",
            doBefore: [],
            fireabaseUID: "asdfasdf",
            name: "task2",
            priority: ""
        }],
        fireabaseUID: "asdfasdf",
        name: "task3",
        priority: ""
    }, {
        _id: "4",
        deadline: "2023-06-22",
        description: "",
        doBefore: [],
        fireabaseUID: "asdfasdf",
        name: "task4",
        priority: ""
    }])).map(task => task._id)).toEqual(["4", "1", "2", "3"]);
});