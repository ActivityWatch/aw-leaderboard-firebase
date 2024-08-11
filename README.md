# aw-leaderboard

[![Test](https://github.com/ActivityWatch/aw-leaderboard-firebase/actions/workflows/test.yml/badge.svg)](https://github.com/ActivityWatch/aw-leaderboard-firebase/actions/workflows/test.yml)

Hosted at <https://aw-leaderboard.web.app/> (WIP!)

A prototype of a public leaderboard for screentime data collected by ActivityWatch.

It uses Vue 3, Firebase (for auth/storage), and Bootstrap.

The goal was to make a leaderboard app that complements the local-first nature of ActivityWatch with basic social features like public leaderboards or sharing specific screentime data privately with a group.

Previous experiments/attempts were made in:

- [aw-leaderboard-rust](https://github.com/activitywatch/aw-leaderboard-rust).
- [aw-supabase](https://github.com/ActivityWatch/aw-supabase)

---

<details>
<summary>Click to expand the initial README</summary>

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [TypeScript Vue Plugin](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

### Clone the Repo and its submodules

```sh
git clone --recurse-submodules https://github.com/ActivityWatch/aw-leaderboard-firebase
```

### Install the dependencies

#### Install the live server Globally

```sh
npm install live-server -g
```

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Run End-to-End Tests with [Cypress](https://www.cypress.io/)

```sh
npm run test:e2e:dev
```

This runs the end-to-end tests against the Vite development server.
It is much faster than the production build.

But it's still recommended to test the production build with `test:e2e` before deploying (e.g. in CI environments):

```sh
npm run build
npm run test:e2e
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

### Runs Live  Server

```sh
npm start-server
```

### Compiles, adds prefixes & compress  scss files to the css file

This command is executed when the project is ready for deployment

```sh
npm run build:css
```

</details>
