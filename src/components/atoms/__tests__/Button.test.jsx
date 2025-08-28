/**
 * Button component tests
 *
 * Framework: Jest
 * Library: React Testing Library (@testing-library/react) + jest-dom
 *
 * Scope:
 * - Validate default rendering and accessibility
 * - Validate classes for variant, size, and fullWidth
 * - Validate disabled behavior and event handling
 * - Validate prop spreading (aria, data-attrs, type)
 * - Cover representative size/variant combinations per inline docs
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Import component (co-located with this __tests__ directory)
import Button from '../Button';

describe('Button', () => {
  test('renders with default props and children', () => {
    render(<Button>Confirm</Button>);
    const btn = screen.getByRole('button', { name: /confirm/i });

    expect(btn).toBeInTheDocument();
    // Defaults: variant="action", size="md", not disabled, not fullWidth
    expect(btn).toHaveClass('btn', 'action', 'size-md');
    expect(btn).not.toBeDisabled();
  });

  test('applies fullWidth class when fullWidth is true', () => {
    render(<Button fullWidth>Full Width</Button>);
    const btn = screen.getByRole('button', { name: /full width/i });

    expect(btn).toHaveClass('fullWidth');
  });

  test('appends custom className to computed classes', () => {
    render(<Button className="extra-class">With Extra Class</Button>);
    const btn = screen.getByRole('button', { name: /with extra class/i });

    expect(btn).toHaveClass('extra-class');
    // Still retains base classes
    expect(btn).toHaveClass('btn', 'action', 'size-md');
  });

  test('spreads additional props onto the button element (aria, data attrs)', () => {
    render(
      <Button aria-label="Go" data-testid="primary-btn" name="goName" value="goVal">
        Go
      </Button>
    );
    const btnByRole = screen.getByRole('button', { name: /go/i });
    const btnByTestId = screen.getByTestId('primary-btn');

    expect(btnByRole).toBe(btnByTestId);
    expect(btnByRole).toHaveAttribute('name', 'goName');
    expect(btnByRole).toHaveAttribute('value', 'goVal');
  });

  test('fires onClick when enabled', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);
    const btn = screen.getByRole('button', { name: /click me/i });

    fireEvent.click(btn);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('does not fire onClick when disabled and has disabled attribute', () => {
    const handleClick = jest.fn();
    render(
      <Button disabled onClick={handleClick}>
        Disabled
      </Button>
    );
    const btn = screen.getByRole('button', { name: /disabled/i });

    expect(btn).toBeDisabled();
    fireEvent.click(btn);
    expect(handleClick).not.toHaveBeenCalled();
  });

  describe('variant="action" sizes', () => {
    const actionSizes = ['xl', 'lg', 'md', 'cancel', 'study-mobile', 'more'];

    test.each(actionSizes)('applies size class for size="%s"', (size) => {
      render(<Button size={size}>Action {size}</Button>);
      const btn = screen.getByRole('button', { name: new RegExp(`Action ${size}`, 'i') });

      expect(btn).toHaveClass('action', `size-${size}`);
    });
  });

  describe('variant="chip"', () => {
    test('applies chip classes with size="chip"', () => {
      render(
        <Button variant="chip" size="chip">
          More
        </Button>
      );
      const btn = screen.getByRole('button', { name: /more/i });

      expect(btn).toHaveClass('chip', 'size-chip');
    });
  });

  describe('variant="control" (rectangular)', () => {
    const rectSizes = ['ctrl-lg', 'ctrl-sm'];

    test.each(rectSizes)('applies control rect size class for size="%s"', (size) => {
      render(
        <Button variant="control" size={size}>
          Control {size}
        </Button>
      );
      const btn = screen.getByRole('button', { name: new RegExp(`Control ${size}`, 'i') });

      expect(btn).toHaveClass('control', `size-${size}`);
    });
  });

  describe('variant="control" (circle)', () => {
    test('applies circle size class and is accessible via aria-label', () => {
      render(
        <Button variant="control" size="circle-lg" shape="circle" aria-label="Pause">
          Ⅱ
        </Button>
      );
      const btn = screen.getByLabelText('Pause');

      expect(btn).toHaveClass('control', 'size-circle-lg');
    });
  });

  test('renders without children when accessible name is provided via aria-label', () => {
    render(<Button aria-label="Perform" />);
    const btn = screen.getByLabelText('Perform');

    expect(btn).toBeInTheDocument();
  });

  test('combines fullWidth, custom className, and computed classes', () => {
    render(
      <Button fullWidth className="custom-x" variant="action" size="lg">
        Combined
      </Button>
    );
    const btn = screen.getByRole('button', { name: /combined/i });

    expect(btn).toHaveClass('btn', 'action', 'size-lg', 'fullWidth', 'custom-x');
  });
});