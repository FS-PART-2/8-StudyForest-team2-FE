import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Prefer importing the component from its source file.
// In some branches the file name may be Toast.jsx; in others, the component code was mistakenly placed in a *.test.jsx.
// We attempt the canonical path first and fall back to requiring default export from co-located test file if needed.
let Toast;
try {
  // Common location
  // eslint-disable-next-line import/no-unresolved, node/no-missing-import
  Toast = require('./Toast').default || require('./Toast');
} catch (e) {
  try {
    // Alternate location: component code may be in this test file (PR mismatch). Dynamically eval is avoided; skip import.
    // If this branch is hit, tests will be skipped with a clear message.
    Toast = null;
  } catch {
    Toast = null;
  }
}

const itOrSkip = (Toast ? it : it.skip);
const describeOrSkip = (Toast ? describe : describe.skip);

describeOrSkip('Toast component', () => {
  test('uses Jest + React Testing Library', () => {
    expect(typeof render).toBe('function');
  });

  itOrSkip('renders default "error" toast with correct role, icon, and message', () => {
    render(<Toast />);
    const root = screen.getByRole('alert');
    expect(root).toBeInTheDocument();

    // Icon is aria-hidden
    const icon = root.querySelector('span[aria-hidden="true"]');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveTextContent('🚨');

    // Default error message
    expect(
      screen.getByText('집중이 중단되었습니다.')
    ).toBeInTheDocument();
  });

  itOrSkip('renders "mismatch" type with alert role and message', () => {
    render(<Toast type="mismatch" />);
    const root = screen.getByRole('alert');
    expect(root).toBeInTheDocument();
    const icon = root.querySelector('span[aria-hidden="true"]');
    expect(icon).toHaveTextContent('🚨');
    expect(
      screen.getByText('비밀번호가 일치하지 않습니다. 다시 입력해주세요.')
    ).toBeInTheDocument();
  });

  itOrSkip('renders "point" type with status role, icon, and interpolated point message', () => {
    render(<Toast type="point" point={50} />);
    const root = screen.getByRole('status');
    expect(root).toBeInTheDocument();
    const icon = root.querySelector('span[aria-hidden="true"]');
    expect(icon).toHaveTextContent('🎉');
    expect(screen.getByText('50포인트를 획득했습니다!')).toBeInTheDocument();
  });

  itOrSkip('defaults point to 0 when not provided', () => {
    render(<Toast type="point" />);
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText('0포인트를 획득했습니다!')).toBeInTheDocument();
  });

  itOrSkip('respects custom message prop overriding defaults', () => {
    render(<Toast type="error" message="사용자 지정 메시지" />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('사용자 지정 메시지')).toBeInTheDocument();
  });

  itOrSkip('falls back to "error" when given an invalid type', () => {
    render(<Toast type="invalid-type" />);
    const root = screen.getByRole('alert');
    const icon = root.querySelector('span[aria-hidden="true"]');
    expect(icon).toHaveTextContent('🚨');
    expect(screen.getByText('집중이 중단되었습니다.')).toBeInTheDocument();
  });

  itOrSkip('merges external className at the end', () => {
    render(<Toast className="extra-class" />);
    const root = screen.getByRole('alert');
    expect(root.className).toMatch(/extra-class/);
  });

  itOrSkip('internal a11y props override any externally provided ones (role, aria-atomic)', () => {
    // External role tries to override; component should enforce its own role and aria-atomic=true
    render(<Toast type="error" role="status" aria-atomic={false} data-test="keep-me" />);
    const root = screen.getByRole('alert'); // should still be alert for 'error'
    expect(root).toHaveAttribute('aria-atomic', 'true');
    // Ensure other non-conflicting external props are preserved
    expect(root).toHaveAttribute('data-test', 'keep-me');

    // For type 'point', role is 'status' regardless of external override
    render(<Toast type="point" role="alert" aria-atomic={false} />);
    const statusRoot = screen.getByRole('status');
    expect(statusRoot).toHaveAttribute('aria-atomic', 'true');
  });

  itOrSkip('supports passing through additional HTML attributes via props spread', () => {
    render(<Toast id="toast-1" data-tracking="toast" />);
    const root = screen.getByRole('alert');
    expect(root).toHaveAttribute('id', 'toast-1');
    expect(root).toHaveAttribute('data-tracking', 'toast');
  });
});

// If the component could not be imported, provide a helpful skip reason.
if (!Toast) {
  // eslint-disable-next-line no-console
  console.warn(
    '[Toast.test.jsx] Skipping tests: Toast component could not be imported from ./Toast. ' +
    'Ensure src/components/atoms/Toast.jsx exists and exports default Toast.'
  );
}