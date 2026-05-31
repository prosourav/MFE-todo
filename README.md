# MFE Todo App

Microfrontend Todo Application using Module Federation.

## Architecture
```
React Host          (port 9000)
├── React remote    (port 3000) → Todo list
├── Angular remote  (port 4201) → Stats widget
└── Modal webcomponent  remote  (port 6000) → Shared confirm modal
```

## Running locally

### Angular remote
```bash
cd angular-stats# MFE Todo App

A production-grade **Microfrontend Todo Application** built with Module Federation, Angular 19, React, and deployed on AWS.

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Cloud Architecture](#cloud-architecture)
- [Tech Stack](#tech-stack)
- [How It Works](#how-it-works)
- [Project Structure](#project-structure)
- [Running Locally](#running-locally)
- [Deployment](#deployment)
- [CI/CD Pipeline](#cicd-pipeline)
- [Communication Between Remotes](#communication-between-remotes)
- [Key Design Decisions](#key-design-decisions)

---

## Overview

This application demonstrates a real-world microfrontend architecture where four completely independent apps work together as one seamless product:

- A **React host** that owns the layout and shared state
- A **React remote** that renders the todo list
- An **Angular 19 remote** that renders the stats widget
- A **Web Component remote** that provides a shared confirm modal

Each remote can be developed, deployed, and scaled **independently** without touching the others.

---

## Architecture

```
React Host (port 9000)
├── Angular 19 remote  (port 4201) → Stats widget (top-right corner)
├── React remote       (port 3000) → Todo list
└── Modal WC remote    (port 6000) → Shared confirm modal (Web Component)
```

### How remotes connect

```
Host loads remoteEntry.js from each remote
         ↓
Module Federation initialises shared scope
         ↓
Remote components mount inside the host page
         ↓
All remotes share the same browser window
         ↓
Window event bus connects them all
```

---

## Cloud Architecture

```
User's Browser
      ↓  HTTPS
AWS CloudFront (CDN — 4 separate distributions)
      ↓  HTTP
AWS S3 (Static hosting — 4 separate buckets)

┌─────────────────────────────────────────────────────┐
│  CloudFront distributions                           │
│                                                     │
│  d111.cloudfront.net  → mfe-modal-wc S3 bucket      │
│  d222.cloudfront.net  → mfe-todo-react S3 bucket    │
│  d333.cloudfront.net  → mfe-angular-stats S3 bucket │
│  d444.cloudfront.net  → mfe-host-app S3 bucket      │
└─────────────────────────────────────────────────────┘
```

### Why S3 + CloudFront?

| Concern | Solution |
|---|---|
| Static file hosting | S3 serves built JS/HTML/CSS files |
| Global performance | CloudFront caches files at edge locations worldwide |
| HTTPS | CloudFront handles SSL automatically |
| Independent deploys | Each app has its own bucket and distribution |
| Cache invalidation | GitHub Actions runs `cloudfront create-invalidation` after every deploy |

### Cache flow

```
First request:
Browser → CloudFront → S3 → returns file → CloudFront caches it

Every request after:
Browser → CloudFront → returns from cache (S3 never hit again)

After new deployment:
GitHub Actions → uploads to S3 → invalidates CloudFront cache → next request fetches fresh files
```

---

## Tech Stack

| App | Technology | Port (local) | AWS |
|---|---|---|---|
| Host | React + Webpack 5 | 9000 | S3 + CloudFront |
| Todo list remote | React + Webpack 5 | 3000 | S3 + CloudFront |
| Stats widget remote | Angular 19 + ngx-build-plus | 4201 | S3 + CloudFront |
| Modal remote | Plain JS Web Component + Webpack 5 | 6000 | S3 + CloudFront |

### Additional technologies

| Technology | Used for |
|---|---|
| Webpack 5 Module Federation | Wiring all remotes together |
| Window Custom Events | Cross-remote communication |
| Angular Elements | Exposing Angular component as a custom element |
| Angular Signals | Reactive state inside Angular remote |
| Web Components (Shadow DOM) | Framework-agnostic shared modal |
| GitHub Actions | CI/CD pipeline |
| AWS IAM | Deployment credentials |

---

## How It Works

### Adding a todo

```
1. User types in input box and clicks Add
2. TodoInput.jsx calls todoStore.add(text)
3. todoStore._notify() fires window event: todos-updated
4. React TodoList receives event → re-renders list
5. Angular StatsComponent receives event → signals update → UI re-renders
```

### Deleting a todo

```
1. User clicks × on a todo item
2. TodoItem calls openModal({ title, message, confirmColor })
3. Modal WC remote loads confirm-modal web component
4. Modal opens with dynamic config
5. User clicks Delete → modal fires modal-confirm event
6. TodoItem fires window event: todo-delete
7. Host todoStore removes item → fires todos-updated
8. All remotes update
```

### Hiding stats (Angular)

```
1. User clicks Hide stats in Angular widget
2. openModal() called with different config (purple button)
3. Same modal Web Component, different data
4. User confirms → Angular signal visible.set(false) → widget hides
```

### Module Federation loading sequence

```
1. Browser opens host CloudFront URL
2. Host main.js boots
3. Host fetches remoteEntry.js from React remote CloudFront URL
4. Host fetches remoteEntry.js from Angular remote CloudFront URL  (native ESM import)
5. Host fetches remoteEntry.js from Modal WC CloudFront URL        (script tag load)
6. All components mount in the host's browser tab
7. All remotes share the same window object → event bus works
```

## Running Locally

### Prerequisites

- Node.js v22+
- Angular CLI: `npm install -g @angular/cli`
- nvm (recommended): `nvm use 22`

### Start all four apps

Open **four separate terminals**:

```bash
# Terminal 1 — Modal WC (start first)
cd modal-wc
npx webpack serve
# → http://localhost:6000

# Terminal 2 — React remote
cd todo-react
npx webpack serve
# → http://localhost:3000

# Terminal 3 — Angular remote
cd angular-stats
ng serve --configuration development
# → http://localhost:4201

# Terminal 4 — Host (start last)
cd host
npx webpack serve
# → http://localhost:9000
```

Open **http://localhost:9000** in your browser.

### Quick start script

Create `start.sh` at the root:

```bash
#!/bin/bash
cd modal-wc && npx webpack serve &
cd ../todo-react && npx webpack serve &
cd ../angular-stats && ng serve --configuration development &
cd ../host && npx webpack serve &
wait
```

```bash
chmod +x start.sh
./start.sh
```

### Verify remotes are running

Open these URLs — each should return a JavaScript file:

```
http://localhost:6000/remoteEntry.js   ← Modal WC
http://localhost:3000/remoteEntry.js   ← React remote
http://localhost:4201/remoteEntry.js   ← Angular remote
```

### Port reference

| App | Port | Command |
|---|---|---|
| Modal WC | 6000 | `npx webpack serve` |
| React remote | 3000 | `npx webpack serve` |
| Angular remote | 4201 | `ng serve --configuration development` |
| Host | 9000 | `npx webpack serve` |

> Ports are **local only**. In production, CloudFront HTTPS URLs replace all localhost references.

---

## Deployment

### Prerequisites

- AWS account with S3 and CloudFront access
- IAM user `github-actions-mfe` with `AmazonS3FullAccess` and `CloudFrontFullAccess`
- Four S3 buckets created with static website hosting enabled
- Four CloudFront distributions pointing to each S3 bucket

### AWS Resources

| Resource | Name |
|---|---|
| S3 bucket — Modal WC | `mfe-modal-wc` |
| S3 bucket — React remote | `mfe-todo-react` |
| S3 bucket — Angular remote | `mfe-angular-stats` |
| S3 bucket — Host | `mfe-host-app` |
| CloudFront — Modal WC | Points to `mfe-modal-wc.s3-website.ap-south-1.amazonaws.com` |
| CloudFront — React remote | Points to `mfe-todo-react.s3-website.ap-south-1.amazonaws.com` |
| CloudFront — Angular remote | Points to `mfe-angular-stats.s3-website.ap-south-1.amazonaws.com` |
| CloudFront — Host | Points to `mfe-host-app.s3-website.ap-south-1.amazonaws.com` |

### S3 bucket configuration

Each bucket requires:

1. **Public access** — uncheck "Block all public access"
2. **Static website hosting** — enabled, index: `index.html`, error: `index.html`
3. **Bucket policy**:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicRead",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME/*"
    }
  ]
}
```

4. **CORS** (remotes only, not host):

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": []
  }
]
```

### CloudFront configuration

For each distribution:

- **Origin domain**: S3 website endpoint (typed manually, not selected from dropdown)
- **Protocol**: HTTP only
- **Default root object**: `index.html`
- **Error pages**: 403 and 404 → `/index.html` → 200

---

## CI/CD Pipeline

### GitHub Actions secrets required

Add these in **Settings → Secrets and variables → Actions**:

| Secret | Value |
|---|---|
| `AWS_ACCESS_KEY_ID` | IAM user access key |
| `AWS_SECRET_ACCESS_KEY` | IAM user secret key |
| `AWS_REGION` | `ap-south-1` |
| `S3_MODAL_WC` | `mfe-modal-wc` |
| `S3_TODO_REACT` | `mfe-todo-react` |
| `S3_ANGULAR_STATS` | `mfe-angular-stats` |
| `S3_HOST` | `mfe-host-app` |
| `CF_MODAL_WC` | CloudFront distribution ID |
| `CF_TODO_REACT` | CloudFront distribution ID |
| `CF_ANGULAR_STATS` | CloudFront distribution ID |
| `CF_HOST` | CloudFront distribution ID |
| `MODAL_CF_URL` | `https://dxxx.cloudfront.net` |
| `REACT_CF_URL` | `https://dxxx.cloudfront.net` |
| `ANGULAR_CF_URL` | `https://dxxx.cloudfront.net` |
| `HOST_CF_URL` | `https://dxxx.cloudfront.net` |

### Deployment order

Every push to `master` triggers:

```
Modal WC deploys first
        ↓
React remote + Angular remote deploy in parallel
        ↓
Host deploys last
```

This order is enforced by the `needs:` field in the workflow — the host can only build after all remotes have their CloudFront URLs ready.

### How localhost URLs get replaced

The workflow uses `sed` to replace localhost URLs with CloudFront URLs before building:

```bash
# In React remote
sed -i "s|http://localhost:6000|$MODAL_CF_URL|g" webpack.config.js

# In Angular remote
sed -i "s|http://localhost:6000|$MODAL_CF_URL|g" src/utils/modal.ts

# In Host
sed -i "s|http://localhost:3000|$REACT_CF_URL|g" webpack.config.js
sed -i "s|http://localhost:4201|$ANGULAR_CF_URL|g" src/components/StatsWidget.jsx
```

Your **local source code is never changed** — `sed` only runs inside the GitHub Actions runner.

---

## Communication Between Remotes

All cross-remote communication uses the **Window Custom Event API** — no Redux, no shared context, no props drilling.

### Event reference

| Event name | Fired by | Listened by | Payload |
|---|---|---|---|
| `todos-updated` | `todoStore._notify()` | React TodoList, Angular StatsComponent | `Array<{ id, text, completed }>` |
| `todo-toggle` | React TodoItem | Host todoStore | `id: number` |
| `todo-delete` | React TodoItem (after modal confirm) | Host todoStore | `id: number` |

### Example — firing an event

```js
window.dispatchEvent(
  new CustomEvent('todos-updated', { detail: todos })
);
```

### Example — listening to an event

```js
// React
useEffect(() => {
  const handler = (e) => setTodos(e.detail);
  window.addEventListener('todos-updated', handler);
  return () => window.removeEventListener('todos-updated', handler);
}, []);

// Angular
window.addEventListener('todos-updated', (e: Event) => {
  const todos = (e as CustomEvent).detail;
  this.done.set(todos.filter(t => t.completed).length);
  this.pending.set(todos.filter(t => !t.completed).length);
});
```

### Why this works in production

All four remotes load into **one browser tab**. They share the same `window` object regardless of which CloudFront URL each file came from. Events fired on `window` in one remote are received by all others.

---

## Key Design Decisions

### Module Federation over iframes

Iframes would have worked but create layout complexity, same-origin restrictions, and poor performance. Module Federation lets each remote's JS run natively in the host page while remaining independently deployable.

### Angular loaded via native ESM import

Angular 19 outputs ESM modules. The standard webpack `ModuleFederationPlugin` loads remotes via script tags which can't handle ESM. The solution is to load Angular's `remoteEntry.js` using the browser's native `import()` and then manually call the MF container API:

```js
const container = await import(/* webpackIgnore: true */ 'ANGULAR_CF_URL/remoteEntry.js');
await __webpack_init_sharing__('default');
await container.init(__webpack_share_scopes__.default);
const factory = await container.get('./Stats');
factory().default(); // bootstraps Angular Elements custom element
```

### Angular Elements for the stats widget

Rather than trying to mount Angular inside React's DOM, the stats component is wrapped as a native custom element (`<angular-stats>`). React renders it like any HTML element with no knowledge that Angular is underneath.

### Angular Signals for reactivity

When the window event fires outside Angular's zone, template bindings don't update automatically. Signals solve this cleanly — no `NgZone.run()`, no `ChangeDetectorRef.detectChanges()`, just reactive state that Angular tracks automatically.

### Shared modal as a separate remote

The confirm modal is needed by both the React remote (delete todo) and the Angular remote (hide stats). Making it a separate Web Component remote means:

- Neither remote bundles the modal code
- The modal can be updated independently
- Any future remote can use it without code changes

### Shadow DOM for the modal

The modal uses Shadow DOM so its CSS is completely isolated from the host and other remotes. No style leakage in either direction.
ng serve --configuration development
```

### React remote
```bash
cd todo-react
npx webpack serve
```

### Host
```bash
cd host
npx webpack serve
```

Open http://localhost:9000
live: https://d3hbaia43enpqz.cloudfront.net/

## Cloud Architecture

<img width="742" height="730" alt="Image" src="https://github.com/user-attachments/assets/511e723b-b59f-4709-bb57-ca396dbeee4f" />

