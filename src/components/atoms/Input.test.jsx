
/* 
Test framework note:
- This test suite assumes the project uses React Testing Library with Jest/Vitest-style APIs:
  - expect, describe, it/test from Jest or Vitest
  - @testing-library/react for render and screen utilities
- We explicitly mock the CSS module to stable class names regardless of test runner CSS handling.
*/

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

// Mock CSS module to predictable class names
jest.mock('./Input.module.css', () => ({
  __esModule: true,
  default: {
    wrap: 'wrap',
    hasRight: 'hasRight',
    input: 'input',
    invalid: 'invalid',
    rightSlot: 'rightSlot',
  },
}));

import Input from './Input';

describe('Input atom', () => {
  it('renders an input with default type="text" and no aria-invalid when not invalid', () => {
    const handleChange = jest.fn();
    render(<Input value="hello" onChange={handleChange} placeholder="Type here" />);
    const el = screen.getByPlaceholderText('Type here');
    expect(el).toBeInTheDocument();
    expect(el).toHaveAttribute('type', 'text');
    expect(el).toHaveValue('hello');
    expect(el).not.toHaveAttribute('aria-invalid');
    // input element gets base class
    expect(el.className).toContain('input');
    // wrapper exists without hasRight when no rightSlot
    const wrapper = el.closest('div');
    expect(wrapper).toBeInTheDocument();
    expect(wrapper.className).toContain('wrap');
    expect(wrapper.className).not.toContain('hasRight');
  });

  it('passes type prop to the input (e.g., password)', () => {
    render(<Input value="" onChange={() => {}} type="password" placeholder="pw" />);
    const el = screen.getByPlaceholderText('pw');
    expect(el).toHaveAttribute('type', 'password');
  });

  it('calls onChange when user types', () => {
    const handleChange = jest.fn((e) => e.target && e.target.value);
    render(<Input value="" onChange={handleChange} placeholder="edit" />);
    const el = screen.getByPlaceholderText('edit');

    fireEvent.change(el, { target: { value: 'A' } });
    expect(handleChange).toHaveBeenCalledTimes(1);

    fireEvent.change(el, { target: { value: 'AB' } });
    expect(handleChange).toHaveBeenCalledTimes(2);
  });

  it('respects disabled prop', () => {
    render(<Input value="x" onChange={() => {}} disabled placeholder="disabled" />);
    const el = screen.getByPlaceholderText('disabled');
    expect(el).toBeDisabled();
  });

  it('applies invalid styles and aria-invalid when invalid=true', () => {
    render(<Input value="" onChange={() => {}} invalid placeholder="err" />);
    const el = screen.getByPlaceholderText('err');
    expect(el).toHaveAttribute('aria-invalid', 'true');
    expect(el.className).toContain('invalid');
  });

  it('does not set aria-invalid when invalid=false (undefined)', () => {
    render(<Input value="" onChange={() => {}} placeholder="ok" />);
    const el = screen.getByPlaceholderText('ok');
    expect(el).not.toHaveAttribute('aria-invalid');
  });

  it('renders rightSlot content and sets wrapper hasRight class', () => {
    const Right = () => <button type="button">Show</button>;
    render(<Input value="secret" onChange={() => {}} rightSlot={<Right />} placeholder="secret" />);
    const btn = screen.getByRole('button', { name: /show/i });
    expect(btn).toBeInTheDocument();

    const input = screen.getByPlaceholderText('secret');
    const wrapper = input.closest('div');
    expect(wrapper).toBeInTheDocument();
    expect(wrapper.className).toContain('hasRight');

    // right slot container uses rightSlot class
    // go up from button to right slot container
    const rightSlotContainer = btn.parentElement;
    expect(rightSlotContainer?.className).toContain('rightSlot');
  });

  it('appends custom className to the wrapper', () => {
    render(<Input value="" onChange={() => {}} className="extraCls" placeholder="cls" />);
    const el = screen.getByPlaceholderText('cls');
    const wrapper = el.closest('div');
    expect(wrapper?.className).toContain('wrap');
    expect(wrapper?.className).toContain('extraCls');
  });

  it('forwards arbitrary props to the input element', () => {
    render(<Input value="" onChange={() => {}} placeholder="data" data-testid="the-input" autoFocus={false} />);
    const el = screen.getByTestId('the-input');
    expect(el).toBeInTheDocument();
    expect(el).toHaveAttribute('placeholder', 'data');
  });

  it('supports empty string value and onChange no-op without crashing', () => {
    // Ensure controlled input supports empty string value
    render(<Input value="" onChange={() => {}} placeholder="empty" />);
    const el = screen.getByPlaceholderText('empty');
    expect(el).toHaveValue('');
  });
});