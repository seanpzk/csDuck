import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import DoBefore from "../src/components/DoBefore.jsx";
import { BrowserRouter } from "react-router-dom";
import { taskIdToTask } from '../src/components/DoBefore.jsx';

jest.mock("../src/firebase.config.js", () => ({
    // mock implementation of currentUser
    currentUser: {
        uid : 10000,
        getIdToken: () => "123token"
    }
}));

global.fetch = jest.fn(() => Promise.resolve({
    json: () => Promise.resolve([{
            name: 'task1',
            _id: '1'
        }, {
            name: 'task2',
            _id: '2'
        }, {
            name: 'task3',
            _id: '3'
        }]
        )
}));

describe("Test doBefore file", () => {

    beforeEach(() => {
        render(
            <BrowserRouter>
                <DoBefore />
            </BrowserRouter>
        )
    })

    test("taskIdToTask functionality", () => {
        const arrTasks = taskIdToTask(['2', '4'], [
            {
                name: "task 1",
                _id: '1'
            },
            {
                name: "task 2",
                _id: '2'
            },
            {
                name: "task 3",
                _id: '3'
            },
            {
                name: "task 4",
                _id: '4'
            }
        ]);
        expect(arrTasks).toEqual([{
            name: "task 2",
            _id: '2'
        }, {
            name: "task 4",
            _id: "4"
        }]);
        expect(taskIdToTask([], [])).toEqual([]);
    });

    test('drop-down functionality', async () => {
        const dropdown = screen.getByTestId('dropdown');
        fireEvent.mouseEnter(dropdown);
        await waitFor(() => expect(global.fetch).toBeCalledTimes(1));
    });
});