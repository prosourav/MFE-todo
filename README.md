# MFE Todo App

Microfrontend Todo Application using Module Federation.

## Architecture
```
React Host        (port 9000)
├── Angular 19    (port 4201) → Stats widget
└── React remote  (port 3000) → Todo list
```

## Running locally

### Angular remote
```bash
cd angular-stats
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