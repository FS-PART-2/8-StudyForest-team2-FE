/**
 * Framework: Jest (expect/describe/it).
 * Purpose: Validate Button.module.css contract introduced in the PR diff:
 * - Presence of key class selectors
 * - Critical declarations per variant/size states
 * - Disabled and active pseudo-class rules
 *
 * These tests parse the CSS file as text and assert for canonical selector + declaration snippets.
 * This avoids reliance on DOM style computation and keeps zero new dependencies.
 */

const fs = require('fs');
const path = require('path');

const CSS_PATH_CANDIDATES = [
  // Common locations for the css module next to this test or alongside atoms folder
  path.join(__dirname, '../Button.module.css'),
  path.join(process.cwd(), 'src/styles/components/atoms/Button.module.css'),
  path.join(process.cwd(), 'src/styles/components/atoms/Button.module.scss'),
];

function readCss() {
  for (const p of CSS_PATH_CANDIDATES) {
    if (fs.existsSync(p)) {
      return { css: fs.readFileSync(p, 'utf8'), path: p };
    }
  }
  throw new Error(
    "Button.module.css not found. Checked:\n" + CSS_PATH_CANDIDATES.map(p => ' - ' + p).join('\n')
  );
}

function normalize(css) {
  return css
    .replace(/\/\*[^*]*\*+([^/*][^*]*\*+)*\//g, '') // remove comments
    .replace(/\s+/g, ' ') // collapse whitespace
    .trim();
}

describe('Button.module.css contract', () => {
  let raw;
  let css;

  beforeAll(() => {
    const res = readCss();
    raw = res.css;
    css = normalize(raw);
  });

  it('contains the base .btn selector with core declarations', () => {
    expect(css).toMatch(/\.btn\s*\{/);
    expect(css).toMatch(/\.btn[^}]*font-weight:\s*600/);
    expect(css).toMatch(/\.btn[^}]*border-radius:\s*1rem/);
    expect(css).toMatch(/\.btn[^}]*display:\s*inline-flex/);
    expect(css).toMatch(/\.btn[^}]*align-items:\s*center/);
    expect(css).toMatch(/\.btn[^}]*justify-content:\s*center/);
    expect(css).toMatch(/\.btn[^}]*gap:\s*0\.8rem/);
    expect(css).toMatch(/\.btn[^}]*cursor:\s*pointer/);
    expect(css).toMatch(/\.btn[^}]*user-select:\s*none/);
    expect(css).toMatch(/\.btn[^}]*white-space:\s*nowrap/);
    expect(css).toMatch(/\.btn[^}]*padding:\s*0\s*1\.6rem/);
    expect(css).toMatch(/\.btn[^}]*background:\s*var\(--brand-blue\)/);
    expect(css).toMatch(/\.btn[^}]*color:\s*#fff/);
    // Transition group present (don’t test exact ordering beyond representative properties)
    expect(css).toMatch(/\.btn[^}]*transition:[^;]*transform[^;]*background-color[^;]*color[^;]*border-color[^;]*box-shadow/);
  });

  it('defines :active transform for .btn', () => {
    expect(css).toMatch(/\.btn:active\s*\{\s*transform:\s*translateY\(0\.1rem\)\s*;\s*\}/);
  });

  it('defines :disabled state for .btn', () => {
    expect(css).toMatch(/\.btn:disabled\s*\{/);
    expect(css).toMatch(/\.btn:disabled[^}]*background:\s*var\(--btn-inactive\)/);
    expect(css).toMatch(/\.btn:disabled[^}]*color:\s*#fff/);
    expect(css).toMatch(/\.btn:disabled[^}]*cursor:\s*not-allowed/);
    expect(css).toMatch(/\.btn:disabled[^}]*opacity:\s*0\.9/);
  });

  it('has .action variant with default and hover states', () => {
    expect(css).toMatch(/\.action\s*\{/);
    expect(css).toMatch(/\.action[^}]*background:\s*var\(--brand-blue\)/);
    expect(css).toMatch(/\.action[^}]*color:\s*#fff/);
    // Hover not when disabled
    expect(css).toMatch(/\.action:hover:not\(:disabled\)\s*\{\s*background:\s*var\(--brand-blue-dark\)\s*;\s*\}/);
  });

  it('has .control variant with hover shadow', () => {
    expect(css).toMatch(/\.control\s*\{/);
    expect(css).toMatch(/\.control[^}]*background:\s*var\(--btn-active\)/);
    expect(css).toMatch(/\.control[^}]*color:\s*#fff/);
    expect(css).toMatch(/\.control:hover:not\(:disabled\)\s*\{[^}]*box-shadow:\s*0\s*0\.2rem\s*1rem\s*rgba\(0,\s*19,\s*167,\s*0\.18\)/);
  });

  it('defines circular size helpers', () => {
    expect(css).toMatch(/\.size-circle-lg\s*,\s*\.size-circle-sm\s*\{\s*border-radius:\s*50%/);
    expect(css).toMatch(/\.size-circle-lg\s*,\s*\.size-circle-sm[^}]*padding:\s*0/);
    expect(css).toMatch(/\.size-circle-lg\s*\{\s*width:\s*6\.4rem\s*;\s*height:\s*6\.4rem\s*;\s*\}/);
    expect(css).toMatch(/\.size-circle-sm\s*\{\s*width:\s*4\.8rem\s*;\s*height:\s*4\.8rem\s*;\s*\}/);
  });

  it('includes discrete size classes with expected dimensions', () => {
    const sizeExpectations = [
      ['\\.size-xl', '60rem', '5\\.5rem'],
      ['\\.size-lg', '31\\.2rem', '5\\.5rem'],
      ['\\.size-md', '14rem', '5\\.5rem'],
      ['\\.size-cancel', '28\\.8rem', '5\\.5rem'],
      ['\\.size-study-mobile', '10\\.6rem', '3\\.5rem'],
      ['\\.size-more', '28\\.8rem', '5\\.5rem'],
      ['\\.size-chip', '40rem', '5\\.5rem'],
      ['\\.size-ctrl-lg', '33\\.3rem', '6rem'],
      ['\\.size-ctrl-sm', '14rem', '4\\.5rem'],
    ];

    for (const [selector, w, h] of sizeExpectations) {
      const re = new RegExp(`${selector}\\s*\\{[^}]*width:\\s*${w}\\s*;[^}]*height:\\s*${h}\\s*;?[^}]*\\}`, 'i');
      expect(css).toMatch(re);
    }
  });

  it('has .fullWidth utility forcing width 100% with !important', () => {
    expect(css).toMatch(/\.fullWidth\s*\{\s*width:\s*100%\s*!important\s*;\s*\}/);
  });

  it('applies font-size overrides for action and size-ctrl-lg', () => {
    // .action font-size: 1.8rem
    expect(css).toMatch(/\.action[^}]*font-size:\s*1\.8rem/);
    // .size-ctrl-lg font-size: 2.8rem (in the later definition block)
    expect(css).toMatch(/\.size-ctrl-lg[^}]*font-size:\s*2\.8rem/);
  });

  it('does not contain obvious syntax errors like unmatched braces', () => {
    // Primitive sanity: count of '{' equals count of '}'
    const open = (raw.match(/\{/g) || []).length;
    const close = (raw.match(/\}/g) || []).length;
    expect(open).toBe(close);
  });

  describe('edge cases robustness', () => {
    it('retains :hover:not(:disabled) specificity (no whitespace-drop issues)', () => {
      expect(css).toMatch(/:hover:not\(:disabled\)/);
    });

    it('keeps transitions list intact for .btn (transform present)', () => {
      const btnBlockMatch = css.match(/\.btn\s*\{[^}]+\}/);
      expect(btnBlockMatch).toBeTruthy();
      const btnBlock = btnBlockMatch ? btnBlockMatch[0] : '';
      expect(btnBlock).toMatch(/transition:[^}]*transform/);
    });
  });
});