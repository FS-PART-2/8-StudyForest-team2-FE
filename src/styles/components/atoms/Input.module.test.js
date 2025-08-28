
/*
Test framework note:
- These tests are compatible with Jest or Vitest (describe/it/expect API).
- They avoid CSS-module tooling assumptions by reading the stylesheet text and asserting selectors/declarations.
- Focus: Validate selectors and declarations introduced/modified in the diff for Input.module.css.
*/

let fsRef, pathRef;

beforeAll(async () => {
  try {
    // CommonJS path
    // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require
    fsRef = require("fs");
    // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require
    pathRef = require("path");
  } catch (e) {
    // ESM fallback
    const fsMod = await import("fs");
    const pathMod = await import("path");
    fsRef = fsMod.default || fsMod;
    pathRef = pathMod.default || pathMod;
  }
});

function escapeReg(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getBlock(css, selector) {
  const pattern = new RegExp(escapeReg(selector) + "\\s*\\{([\\s\\S]*?)\\}", "m");
  const m = css.match(pattern);
  return m ? m[1] : null;
}

function expectDecl(block, prop, value) {
  expect(block).toBeTruthy();
  const valueSource = value instanceof RegExp ? value.source : escapeReg(value);
  const re = new RegExp("(^|;)\\s*" + escapeReg(prop) + "\\s*:\\s*" + valueSource + "\\s*(;|$)", "m");
  expect(re.test(block)).toBe(true);
}

function findInputStylesheet() {
  const { existsSync, readdirSync } = fsRef;
  const { join } = pathRef;
  const cwd = process.cwd();

  const candidates = [
    "src/styles/components/atoms/Input.module.css",
    "src/components/atoms/Input.module.css",
    "src/styles/components/atoms/Input.module.scss",
    "src/styles/components/atoms/Input.module.sass",
    "src/styles/atoms/Input.module.css",
    "src/styles/components/Input.module.css"
  ].map(p => join(cwd, p));

  for (const p of candidates) {
    if (existsSync(p)) return p;
  }

  // Fallback: scan common roots for a file named Input.module.(css|scss|sass)
  const roots = ["src", "packages", "app", "client"].map(r => join(cwd, r)).filter(existsSync);
  const targetNames = new Set(["Input.module.css", "Input.module.scss", "Input.module.sass"]);
  const ignore = new Set(["node_modules", ".git", "dist", "build", "coverage", ".next", ".nuxt", ".svelte-kit", "out"]);
  const queue = [...roots];

  while (queue.length) {
    const dir = queue.shift();
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const ent of entries) {
      if (ent.isDirectory()) {
        if (!ignore.has(ent.name)) queue.push(join(dir, ent.name));
      } else if (targetNames.has(ent.name)) {
        return join(dir, ent.name);
      }
    }
  }
  throw new Error("Input.module.(css|scss|sass) not found. Please ensure the stylesheet exists.");
}

describe("Input.module.css styles", () => {
  let cssText;
  let cssPath;

  beforeAll(() => {
    const { readFileSync } = fsRef;
    cssPath = findInputStylesheet();
    cssText = readFileSync(cssPath, "utf8");
    expect(typeof cssText).toBe("string");
    expect(cssText.length).toBeGreaterThan(0);
  });

  it("defines .wrap with positioning and full width", () => {
    const block = getBlock(cssText, ".wrap");
    expectDecl(block, "position", "relative");
    expectDecl(block, "width", "100%");
  });

  it("defines base .input styles and transition timing", () => {
    const block = getBlock(cssText, ".input");
    expectDecl(block, "width", "100%");
    expectDecl(block, "height", "44px");
    expectDecl(block, "border", "1px solid var(--background-neutral)");
    expectDecl(block, "border-radius", "8px");
    expectDecl(block, "padding", "0 12px");
    expectDecl(block, "font-size", "16px");
    expectDecl(block, "line-height", "1.2");
    expectDecl(block, "background", "var(--background-secondary)");
    expectDecl(block, "color", "var(--text-primary)");
    expectDecl(block, "outline", "0");

    // Transition should include three parts regardless of spacing nuances
    expect(/transition\s*:\s*[^;]*border-color\s*120ms\s*ease/i.test(block)).toBe(true);
    expect(/transition\s*:\s*[^;]*box-shadow\s*120ms\s*ease/i.test(block)).toBe(true);
    expect(/transition\s*:\s*[^;]*background-color\s*120ms\s*ease/i.test(block)).toBe(true);
  });

  it("styles ::placeholder color", () => {
    const block = getBlock(cssText, ".input::placeholder");
    expectDecl(block, "color", "var(--text-gray)");
  });

  it("applies focus border and shadow", () => {
    const block = getBlock(cssText, ".input:focus");
    expectDecl(block, "border-color", "var(--brand-blue)");
    expectDecl(block, "box-shadow", "0 0 0 2px rgba(0, 19, 167, 0.12)");
  });

  it("applies disabled state with neutral colors and cursor", () => {
    const block = getBlock(cssText, ".input:disabled");
    expectDecl(block, "background", "#f3f4f6");
    expectDecl(block, "color", "#9ca3af");
    expectDecl(block, "cursor", "not-allowed");
  });

  it("applies invalid state border and shadow", () => {
    const block = getBlock(cssText, ".input.invalid");
    expectDecl(block, "border-color", "var(--warning-red)");
    expectDecl(block, "box-shadow", "0 0 0 2px rgba(220, 38, 38, 0.08)");
  });

  it("reserves right padding when parent has .hasRight", () => {
    const block = getBlock(cssText, ".hasRight .input");
    expectDecl(block, "padding-right", "44px");
  });

  it("positions .rightSlot correctly", () => {
    const block = getBlock(cssText, ".rightSlot");
    expectDecl(block, "position", "absolute");
    expectDecl(block, "top", "50%");
    expectDecl(block, "right", "8px");
    // transform value contains parentheses and hyphen; use regex for robustness
    expectDecl(block, "transform", /translateY\(\s*-50%\s*\)/);
    expectDecl(block, "display", "grid");
    expectDecl(block, "place-items", "center");
    expectDecl(block, "pointer-events", "auto");
  });

  it("does not accidentally override text color for enabled state", () => {
    const base = getBlock(cssText, ".input");
    const disabled = getBlock(cssText, ".input:disabled");
    expect(/color\s*:\s*var\(--text-primary\)/.test(base)).toBe(true);
    expect(/color\s*:\s*#9ca3af/.test(disabled)).toBe(true);
  });
});