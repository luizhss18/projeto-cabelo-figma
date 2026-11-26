# Hairstyle

HTML, CSS, and native JavaScript application. The deployable site lives in `site/`; it needs no build step.

## Development Server

A Vite development server is **already running** on `$PORT` (default 8443) in Figma Make. Don't start it manually.

- Preview URL: The user can access the running app through the preview panel
- Hot reload: Changes to source files are reflected immediately

## Project Structure

- `site/index.html` - Shared document shell; loads the app and styles
- `site/assets/app.js` - Browser routing, application rendering, and event delegation
- `site/assets/pages/` and `site/assets/components/` - Page and component HTML templates
- `site/assets/lib/` - State, rendering, catalog data, icons, and native WebGL
- `site/assets/styles.css` - Standalone CSS, including utilities exported from the original stylesheet
- `package.json` and `vite.config.js` - Figma Make preview and formatting tools, not deployment requirements
- `.mise.toml` - Toolchain versions for Node.js and pnpm

## Checks and conventions

- Use `pnpm build` for Make preview builds and `pnpm format <files>` for JavaScript formatting.
- Use the `html` and `attr` helpers for template interpolations so user-entered text is escaped.
- Use double quotes for strings containing apostrophes (`"We're here to help"`), or escape them in single-quoted strings. An unescaped apostrophe in a single-quoted string breaks the build.
- Keep CSS `@import` statements at the start of the stylesheet.
