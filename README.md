# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npx sv create

# create a new project in my-app
npx sv create my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

## Current Status

- SvelteKit scaffold with project planning docs.
- No clear product features implemented yet.
- Operational estimate: **15%** (template + planning).

## Archive Rationale

- Archived because it appears to be a baseline scaffold without substantial implementation.

## API Endpoints

- None. This is currently a frontend scaffold.

## Tests

- No test suite detected.

## Future Work

- Define product scope and build core screens.
- Add backend integration (if required).
- Establish testing and deployment workflow.
