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
