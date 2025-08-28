Testing Strategy for CSS Modules (Button.module.css)
- Framework: Jest
- Approach: Parse CSS as plain text and verify presence of selectors and key declarations.
- Why: JSDOM does not compute styles from external CSS; avoiding new dependencies keeps tests stable.
- If PostCSS is available in this repo, consider enhancing tests to parse with PostCSS and assert AST nodes.