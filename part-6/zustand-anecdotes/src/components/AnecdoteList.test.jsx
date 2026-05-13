import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AnecdoteList from "./AnecdoteLis";

vi.mock("../../store/store", () => ({
  useAnecdotes: vi.fn(),
  useFilter: vi.fn(),
  useAnecdoteActions: vi.fn(),
}));

import {
  useAnecdotes,
  useFilter,
  useAnecdoteActions,
} from "../../store/store";

describe("AnecdoteList", () => {
  const vote = vi.fn();
  const deleteAnecdote = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    useAnecdotes.mockReturnValue([
      { id: "1", content: "First anecdote", votes: 2 },
      { id: "2", content: "Second anecdote", votes: 0 },
    ]);
    useFilter.mockReturnValue("");
    useAnecdoteActions.mockReturnValue({ vote, deleteAnecdote });
  });

  // Note: verifies base rendering from store data, including vote counts.
  it("renders anecdotes and vote counts", () => {
    render(<AnecdoteList />);

    expect(screen.getByText("First anecdote")).toBeTruthy();
    expect(screen.getByText("Second anecdote")).toBeTruthy();
    expect(screen.getByText(/has 2/i)).toBeTruthy();
    expect(screen.getByText(/has 0/i)).toBeTruthy();
  });

  // Note: verifies the component consumes anecdotes in descending vote order.
  it("receives anecdotes from the store in vote-sorted order", () => {
    const unsortedAnecdotes = [
      { id: "a", content: "Lowest votes", votes: 1 },
      { id: "b", content: "Highest votes", votes: 9 },
      { id: "c", content: "Middle votes", votes: 4 },
    ];
    const sortedAnecdotes = unsortedAnecdotes.toSorted(
      (a, b) => b.votes - a.votes,
    );

    useAnecdotes.mockReturnValue(sortedAnecdotes);

    render(<AnecdoteList />);

    expect(useAnecdotes).toHaveBeenCalledTimes(1);

    const highest = screen.getByText("Highest votes");
    const middle = screen.getByText("Middle votes");
    const lowest = screen.getByText("Lowest votes");

    expect(
      highest.compareDocumentPosition(middle) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(
      middle.compareDocumentPosition(lowest) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  // Note: verifies the anecdotes display component receives a correctly filtered list.
  it("shows only the properly filtered anecdotes in the list component", () => {
    const allAnecdotes = [
      { id: "1", content: "React hooks are neat", votes: 4 },
      { id: "2", content: "Zustand keeps state simple", votes: 3 },
      { id: "3", content: "Testing helps prevent regressions", votes: 1 },
    ];
    const filterText = "react";
    const filteredAnecdotes = allAnecdotes.filter((anecdote) =>
      anecdote.content.toLowerCase().includes(filterText),
    );

    useFilter.mockReturnValue(filterText);
    useAnecdotes.mockReturnValue(filteredAnecdotes);

    render(<AnecdoteList />);

    expect(screen.getByText("React hooks are neat")).toBeTruthy();
    expect(screen.queryByText("Zustand keeps state simple")).toBeNull();
    expect(screen.queryByText("Testing helps prevent regressions")).toBeNull();
    expect(screen.getAllByRole("button", { name: "vote" })).toHaveLength(1);
  });

  // Note: verifies filter text limits displayed anecdotes by content match.
  it("filters anecdotes by content", () => {
    useFilter.mockReturnValue("second");

    render(<AnecdoteList />);

    expect(screen.queryByText("First anecdote")).toBeNull();
    expect(screen.getByText("Second anecdote")).toBeTruthy();
  });

  // Note: verifies vote and delete buttons dispatch the correct store actions.
  it("calls actions when vote and delete are clicked", async () => {
    const user = userEvent.setup();
    render(<AnecdoteList />);

    const voteButtons = screen.getAllByRole("button", { name: "vote" });
    await user.click(voteButtons[0]);
    expect(vote).toHaveBeenCalledWith("1");

    const deleteButton = screen.getByRole("button", { name: "delete" });
    await user.click(deleteButton);
    expect(deleteAnecdote).toHaveBeenCalledWith("2");
  });
});
