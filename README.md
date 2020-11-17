# Souper Party

Open Souper Party in your browser: https://souper-party.web.app/

## local installation

install node

```
npm i -g @angular/cli
npm i -g firebase-tools
```

create environment files
src/environments/environment.ts
src/environments/environment.prod.ts

```
export const environment = {
    production: ...,
    firebase: {
        apiKey: ...,
        authDomain: ...,
        databaseURL: ...,
        projectId: ...,
        storageBucket: ...
    }
}
```

## Development server

```
npm start
```

Navigate to `http://localhost:4200/`.

## Build

```
ng build --prod
firebase login
firebase deploy
```

The build artifacts will be stored in the `dist/` directory.

## Visual Studio Code Settings

- use prettier to format code (install plugin and configure in the plugin section)
- format code on save (configure in VSC)
- use shift+alt+o to remove unused imports
