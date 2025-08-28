/**
 * Testing library/framework: Jest (or Vitest-compatible).
 * Strategy: Read the CSS module file as text and assert presence/structure of critical rules.
 * We avoid new deps by using regex checks instead of CSS parsers.
 */

const fs = require('fs');
const path = require('path');

const cssPathCandidates = [
  path.join(__dirname, 'Toast.module.css'),
  path.join(__dirname, 'Toast.module.scss'),
  path.join(__dirname, 'Toast.module.sass'),
  path.join(__dirname, 'Toast.module.pcss'),
  path.join(__dirname, 'Toast.module.less'),
];

function readCss() {
  for (const p of cssPathCandidates) {
    if (fs.existsSync(p)) {
      return { css: fs.readFileSync(p, 'utf8'), path: p };
    }
  }
  throw new Error(
    `Toast module CSS not found. Looked for:\n` +
      cssPathCandidates.map((p) => ` - ${p}`).join('\n')
  );
}

// Utility: build a regex that tolerates whitespace and optional semicolons
function decl(property, valueRegex) {
  const prop = property.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // escape
  return new RegExp(`${prop}\\s*:\\s*${valueRegex}\\s*;?`, 'i');
}

// Utility: matches a class block by name, returns its block content
function getClassBlock(css, className) {
  // naive but effective: match .class { ... }
  const name = className.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`\\.${name}\\s*\\{([\\s\\S]*?)\\}`, 'i');
  const m = css.match(re);
  return m ? m[1] : null;
}

describe('Toast.module.* styles', () => {
  let css, filePath;
  beforeAll(() => {
    const res = readCss();
    css = res.css;
    filePath = res.path;
  });

  it('contains all expected class selectors', () => {
    const required = ['toast', 'text', 'error', 'mismatch', 'point'];
    for (const cls of required) {
      expect(css).toMatch(new RegExp(`\\.${cls}\\b`, 'i'));
    }
  });

  describe('.toast base styles', () => {
    let block;
    beforeAll(() => {
      block = getClassBlock(css, 'toast');
      expect(block).toBeTruthy();
    });

    it('defines layout and spacing', () => {
      expect(block).toMatch(decl('display', 'inline-flex'));
      expect(block).toMatch(decl('justify-content', 'center'));
      expect(block).toMatch(decl('align-items', 'center'));
      expect(block).toMatch(decl('gap', '0\\.8rem'));
      expect(block).toMatch(decl('padding', '1\\.4rem\\s+2\\.8rem'));
      expect(block).toMatch(decl('border-radius', '0\\.5rem'));
    });

    it('defines typography', () => {
      expect(block).toMatch(decl('font-size', '1\\.6rem'));
      expect(block).toMatch(decl('font-weight', '500'));
      expect(block).toMatch(decl('line-height', '1\\.6'));
    });
  });

  describe('.text truncation styles', () => {
    let block;
    beforeAll(() => {
      block = getClassBlock(css, 'text');
      expect(block).toBeTruthy();
    });

    it('prevents wrapping and truncates with ellipsis', () => {
      expect(block).toMatch(decl('white-space', 'nowrap'));
      expect(block).toMatch(decl('min-width', '0'));
      expect(block).toMatch(decl('overflow', 'hidden'));
      expect(block).toMatch(decl('text-overflow', 'ellipsis'));
    });
  });

  describe('error/mismatch variants', () => {
    it('has combined selector for .error and .mismatch', () => {
      // Presence of combined selector line (tolerant to whitespace/newlines)
      const combined = /\.error\s*,\s*\.mismatch\s*\{/i.test(css);
      expect(combined).toBe(true);
    });

    it('sets expected background and color with CSS variables and fallbacks', () => {
      const block = getClassBlock(css, 'error,[\\s\\S]*?mismatch'); // not used; we will verify via regex to include both decls
      // Background variable with fallback rgba(253, 224, 233, 0.5)
      expect(css).toMatch(
        new RegExp(
          `\\.error\\s*,\\s*\\.mismatch\\s*\\{[\\s\\S]*?` +
            `background\\s*:\\s*var\\(\\s*--toast-error-bg\\s*,\\s*rgba\\(\\s*253\\s*,\\s*224\\s*,\\s*233\\s*,\\s*0\\.5\\s*\\)\\s*\\)\\s*;?`,
          'i'
        )
      );
      // Text color var with fallback #dc2626
      expect(css).toMatch(
        new RegExp(
          `\\.error\\s*,\\s*\\.mismatch\\s*\\{[\\s\\S]*?` +
            `color\\s*:\\s*var\\(\\s*--warning-red\\s*,\\s*#dc2626\\s*\\)\\s*;?`,
          'i'
        )
      );
    });
  });

  describe('.point variant', () => {
    let block;
    beforeAll(() => {
      block = getClassBlock(css, 'point');
      expect(block).toBeTruthy();
    });

    it('sets expected point background and color variables with fallbacks', () => {
      expect(block).toMatch(
        decl(
          'background',
          'var\\(\\s*--toast-point-bg\\s*,\\s*rgba\\(\\s*189\\s*,\\s*204\\s*,\\s*236\\s*,\\s*0\\.5\\s*\\)\\s*\\)'
        )
      );
      expect(block).toMatch(
        decl('color', 'var\\(\\s*--brand-blue\\s*,\\s*#0013a7\\s*\\)')
      );
    });
  });

  describe('defensive checks', () => {
    it('contains no obvious empty rule blocks', () => {
      const emptyBlock = /\.[a-z0-9_-]+\s*\{\s*\}/i.test(css);
      expect(emptyBlock).toBe(false);
    });

    it('does not duplicate the same property consecutively within a block', () => {
      // Simple heuristic: property appears twice in a row inside same block
      const duplicateProp = /\{\s*([a-z-]+)\s*:\s*[^;]+;\s*\1\s*:\s*[^;]+;/i.test(css);
      expect(duplicateProp).toBe(false);
    });
  });

  it('keeps the CSS file readable and non-empty', () => {
    expect(css.length).toBeGreaterThan(50);
    // Basic sanity: at least 5 declarations across all blocks
    const decls = css.match(/:[^;]+;/g) || [];
    expect(decls.length).toBeGreaterThanOrEqual(10);
  });

  // Helpful output if failing on path issues
  afterAll(() => {
    // no-op, but keeps linter happy if configured
  });
});