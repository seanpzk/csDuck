import TaskList from "../src/components/TaskList.jsx";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";

describe("Render basic information of Tasklist UI", () => {
  beforeEach(() =>
    render(
      <BrowserRouter>
        <TaskList />
      </BrowserRouter>
    )
  );

  // Test #1: Check for title - Task List
  test("Test Title", () => {
    const tasklistTitle = screen.getByTestId("tasklistTitle");
    expect(tasklistTitle).toBeInTheDocument();
  });

  // Test #2: Test for column headers
  test("Test Column Headers", () => {
    const colHeaders = screen.getByTestId("tasklistHeaders");
    expect(colHeaders).toBeInTheDocument();
  });
});
