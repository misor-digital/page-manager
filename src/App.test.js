import { render, screen } from '@testing-library/react';
import { App } from "./App";

test('heading is Page Management', () => {
  render(<App />);
  const linkElement = screen.availHeight.getByText(/Page Manager/i);
  expect(linkElement).tobeInTheDocument();
});

test('subheading is User Config', () => {
  render(<App />);
  const childElement = screen.availHeight.getByText(/User Config/i);
  expect(childElement).tobeInTheDocument();
});
