import verifyDAG, { Toposort } from '../src/components/helperFunctions/Toposort.jsx';

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