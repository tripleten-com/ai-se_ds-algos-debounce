import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import ProfileList from "../../src/components/ProfileList/ProfileList";

describe("Lesson 05 — debounced search", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders all 8 profiles on mount", () => {
    render(<ProfileList />);
    expect(screen.getAllByRole("listitem")).toHaveLength(8);
  });

  it("filters profiles by name after the debounce delay fires", () => {
    render(<ProfileList />);
    const input = screen.getByRole("searchbox");
    fireEvent.change(input, { target: { value: "alice" } });
    act(() => vi.runAllTimers());
    expect(screen.getAllByRole("listitem")).toHaveLength(1);
    expect(screen.getByText(/Alice Johnson/i)).toBeInTheDocument();
  });

  it("filter is case-insensitive", () => {
    render(<ProfileList />);
    const input = screen.getByRole("searchbox");
    fireEvent.change(input, { target: { value: "ALICE" } });
    act(() => vi.runAllTimers());
    expect(screen.getAllByRole("listitem")).toHaveLength(1);
    expect(screen.getByText(/Alice Johnson/i)).toBeInTheDocument();
  });

  it("partial matches are included in results", () => {
    render(<ProfileList />);
    const input = screen.getByRole("searchbox");
    // "son" matches Alice John-son and Frank Wil-son
    fireEvent.change(input, { target: { value: "son" } });
    act(() => vi.runAllTimers());
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });

  it("clearing the search restores all profiles", () => {
    render(<ProfileList />);
    const input = screen.getByRole("searchbox");
    fireEvent.change(input, { target: { value: "alice" } });
    act(() => vi.runAllTimers());
    expect(screen.getAllByRole("listitem")).toHaveLength(1);
    fireEvent.change(input, { target: { value: "" } });
    act(() => vi.runAllTimers());
    expect(screen.getAllByRole("listitem")).toHaveLength(8);
  });
});
