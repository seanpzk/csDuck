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
describe("Tests for VerifyDAG Function", () => {
    describe("Empty Graph", () => {
        test('VerifyDAG 0', async () => {
            expect(await verifyDAG({}, [])).toBe(true);
        });
    })

    describe("Graph with no dependencies", () => {
        test("VerifyDAG 1", async () => {
            expect(await verifyDAG({
                name: "task1", 
                deadline: "", 
                priority: "", 
                description: "", 
                firebaseUID: "sadf", 
                doBefore: []
            }
            , [])).toBe(true);
        });
        test("VerifyDAG 9", async () => {
            expect(await verifyDAG({
                _id: "1",
                deadline: "2023-06-23",
                description: "",
                doBefore: [],
                fireabaseUID: "asdfasdf",
                name: "task1",
                priority: ""
            }, [{
                _id: "2",
                deadline: "2023-05-01",
                description: "",
                doBefore: [],
                fireabaseUID: "asdfasdf",
                name: "task2",
                priority: ""
            }, {
                _id: "3",
                deadline: "2022-12-27",
                description: "",
                doBefore: [],
                fireabaseUID: "asdfasdf",
                name: "task3",
                priority: ""
            }
            ])).toBeTruthy();
        });
    });

    describe("Graph with cyclic dependencies", () => {
        test("VerifyDAG 4", async () => {
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
        });

        test("VerifyDAG 7", async () => {
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
    });

    describe("Graph with dependencies", () => {
        test("VerifyDAG 2", async () => {
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
        });

        test("VerifyDAG 3", async () => {
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
        });

        test("VerfiyDAG 5", async () => {
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
        });

        test("VerifyDAG 6", async () => {
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
        });
    });

    describe("Graph with self-referencing nodes", () => {
        test("VerifyDAG 8", async () => {
            expect(await verifyDAG({
                _id: "1",
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
            }, [{
                _id: "1",
                deadline: "",
                description: "",
                doBefore: [],
                fireabaseUID: "asdfasdf",
                name: "task1",
                priority: ""
            }])).toBeTruthy();
        });

        test("VerifyDAG 11", async () => {
            expect(await verifyDAG({
                _id: "5",
                deadline: "",
                description: "",
                doBefore: [{
                    _id: "4",
                    deadline: "2023-02-22",
                    description: "",
                    doBefore: [],
                    fireabaseUID: "asdfasdf",
                    name: "task4",
                    priority: ""
                }, {
                    _id: "5",
                    deadline: "",
                    description: "",
                    doBefore: [{
                        _id: "4",
                        deadline: "2023-02-22",
                        description: "",
                        doBefore: [],
                        fireabaseUID: "asdfasdf",
                        name: "task4",
                        priority: ""
                    }],
                    fireabaseUID: "asdfasdf",
                    name: "task5",
                    priority: ""
                }],
                fireabaseUID: "asdfasdf",
                name: "task5",
                priority: ""
            }, [{
                _id: "4",
                deadline: "2023-02-22",
                description: "",
                doBefore: [],
                fireabaseUID: "asdfasdf",
                name: "task4",
                priority: ""
            }, {
                _id: "1",
                deadline: "2023-06-23",
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
                deadline: "",
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
                    deadline: "",
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
                }],
                fireabaseUID: "asdfasdf",
                name: "task3",
                priority: ""
            }])).toBeFalsy();
        });
    });
    
    describe("Graph with Partially connected components", () => {
        test("VerifyDAG 10", async () => {
            expect(await verifyDAG({
                _id: "5",
                deadline: "",
                description: "",
                doBefore: [{
                    _id: "4",
                    deadline: "2023-02-22",
                    description: "",
                    doBefore: [],
                    fireabaseUID: "asdfasdf",
                    name: "task4",
                    priority: ""
                }],
                fireabaseUID: "asdfasdf",
                name: "task5",
                priority: ""
            }, [{
                _id: "4",
                deadline: "2023-02-22",
                description: "",
                doBefore: [],
                fireabaseUID: "asdfasdf",
                name: "task4",
                priority: ""
            }, {
                _id: "1",
                deadline: "2023-06-23",
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
                deadline: "",
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
                    deadline: "",
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
                }],
                fireabaseUID: "asdfasdf",
                name: "task3",
                priority: ""
            }])).toBeTruthy();
        })
    });
});

describe("Tests for Toposort Function", () => {
    describe("Empty Graph", () => {
        test("Empty Set", async () => {
            expect(await Toposort([])).toEqual([]);
        });
    });

    describe("Graph with no dependencies", () => {
        test("Topo 1", async () => {
            expect((await Toposort([{
                _id: "1",
                deadline: "",
                description: "",
                doBefore: [],
                fireabaseUID: "asdfasdf",
                name: "task1",
                priority: ""
            }])).map(task => task._id)).toEqual(["1"]);
        });
    });

    describe("Graph with dependencies", () => {
        test("Topo 2", async () => {
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
        });

        test("Topo 3", async () => {
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
        });

        test("Topo 4", async () => {
            expect((await Toposort([{
                _id: "1",
                deadline: "2023-06-23",
                description: "",
                doBefore: [],
                fireabaseUID: "asdfasdf",
                name: "task1",
                priority: "Low"
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
                    priority: "Low"
                }],
                fireabaseUID: "asdfasdf",
                name: "task2",
                priority: "High"
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
                    priority: "Low"
                }, {
                    _id: "2",
                    deadline: "2023-06-27",
                    description: "",
                    doBefore: [],
                    fireabaseUID: "asdfasdf",
                    name: "task2",
                    priority: "High"
                }],
                fireabaseUID: "asdfasdf",
                name: "task3",
                priority: "Low"
            }, {
                _id: "4",
                deadline: "2023-06-22",
                description: "",
                doBefore: [],
                fireabaseUID: "asdfasdf",
                name: "task4",
                priority: "Low"
            }])).map(task => task._id)).toEqual(["4", "1", "2", "3"]);
        });
    });

    describe("Graph with Partially connected Components", () => {
        test("Topo 5", async () => {
            expect((await Toposort([{
                _id: "4",
                deadline: "2023-02-22",
                description: "",
                doBefore: [],
                fireabaseUID: "asdfasdf",
                name: "task4",
                priority: ""
            }, {
                _id: "1",
                deadline: "2023-03-22",
                description: "",
                doBefore: [],
                fireabaseUID: "asdfasdf",
                name: "task1",
                priority: ""
            }, {
                _id: "2",
                deadline: "2023-05-23",
                description: "",
                doBefore: [{
                    _id: "1",
                    deadline: "2023-03-22",
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
                deadline: "2023-06-24",
                description: "",
                doBefore: [{
                    _id: "1",
                    deadline: "2023-03-22",
                    description: "",
                    doBefore: [],
                    fireabaseUID: "asdfasdf",
                    name: "task1",
                    priority: ""
                }, {
                    _id: "2",
                    deadline: "2023-05-23",
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
                }],
                fireabaseUID: "asdfasdf",
                name: "task3",
                priority: ""
            }, {
                _id: "5",
                deadline: "2023-04-22",
                description: "",
                doBefore: [{
                    _id: "4",
                    deadline: "2023-02-22",
                    description: "",
                    doBefore: [],
                    fireabaseUID: "asdfasdf",
                    name: "task4",
                    priority: ""
                }],
                fireabaseUID: "asdfasdf",
                name: "task5",
                priority: ""
            }])).map(task => task._id)).toEqual(["4", "1", "5", "2", "3"]);
        });
    });
});