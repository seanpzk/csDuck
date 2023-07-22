import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Create from "../src/components/Create.jsx";
import { BrowserRouter } from "react-router-dom";
import verifyDAG from '../src/components/helperFunctions/Toposort.jsx';

jest.mock("../src/firebase.config.js", () => ({
    // mock implementation of currentUser
    currentUser: {
        uid : 10000,
        getIdToken: () => "123token"
    }
}));

jest.mock("../src/components/helperFunctions/Toposort.jsx", () => ({
    // bug if not indicated
    __esModule: true,
    ...jest.requireActual("../src/components/helperFunctions/Toposort.jsx"),
    extractExistingTasks: jest.fn().mockReturnValue([{name: 'task1'}, {name: 'task2'}]),
    Toposort: jest.fn().mockReturnValue("HELLO"),
    default: jest.fn().mockReturnValue(true),
}));

global.fetch = jest.fn(() => Promise.resolve({
    json: () => Promise.resolve({
        data: []
    })
}));

describe("Test create task form", () => {
    beforeEach(() => render(
        <BrowserRouter>
            <Create />
        </BrowserRouter>
    ));

    test("UI elements present", async ()=> {
        let form = screen.getByTestId("create-form");
        expect(form).toBeInTheDocument();
        expect(screen.getByTestId("name-label")).toBeInTheDocument();
        expect(screen.getByTestId("name-input")).toBeInTheDocument();
        expect(screen.getByTestId("deadline-label")).toBeInTheDocument();
        expect(screen.getByTestId("deadline-input")).toBeInTheDocument();
        expect(screen.getByTestId("description-label")).toBeInTheDocument();
        expect(screen.getByTestId("description-input")).toBeInTheDocument();
        expect(screen.getByTestId("priority-label")).toBeInTheDocument();
        expect(screen.getByTestId("low-priority-label")).toBeInTheDocument();
        expect(screen.getByTestId("low-priority-input")).toBeInTheDocument();
        expect(screen.getByTestId("med-priority-label")).toBeInTheDocument();
        expect(screen.getByTestId("med-priority-input")).toBeInTheDocument();
        expect(screen.getByTestId("high-priority-label")).toBeInTheDocument();
        expect(screen.getByTestId("high-priority-input")).toBeInTheDocument();
        expect(screen.getByTestId('submit-button')).toBeInTheDocument();
    });

    test('radio-button functionality', () => {
        const buttonTypes = ['Low', 'Medium', 'High'];
        buttonTypes.forEach(name => {
            const labelRadio = screen.getByLabelText(name);
            expect(labelRadio.checked).toEqual(false);
            fireEvent.click(labelRadio);
            expect(labelRadio.checked).toEqual(true);
        })
    })

    test("Submit-button functionality", async () => {
        let submit_button = screen.getByTestId('submit-button');
        // input required fields
        fireEvent.click(screen.getByLabelText('Low'));
        fireEvent.change(screen.getByTestId('name-input'), {
            target: {value: "randomName"}
        });
        await waitFor(() => expect(global.fetch).toBeCalledTimes(0));
        fireEvent.click(submit_button);
        // Calls fetch twice (ScheduleEvent and the post request)
        await waitFor(() => expect(global.fetch).toBeCalledTimes(2));
        verifyDAG.mockReturnValue(false);
        fireEvent.click(submit_button);
        // counter shouldn't increase since it doesnt reset / run fetch
        await waitFor(() => expect(global.fetch).toBeCalledTimes(2));
    })
})