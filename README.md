# csDuck

Orbital project

## Before you run the programs, ensure you have nodejs and npm installed

## To install in planner

```
npm install vite@latest 
react-bootstrap 
bootstrap@5.2.3 
react-phone-input-2 
jest 
babel-jest 
@babel/preset-env 
@babel/preset-react 
react-test-renderer
identity-obj-proxy
@heroicons/react

```

## To install in server

```
npm install googleapis
dayjs

```

## Run the application

```
cd planner;
npm run dev;
cd server;
node server.mjs; (or npm run dev)
```

## Testing using jest
Test firebaseAuthEmail / anything that requires firebase calls: remove the following code in jest.config.cjs
```
testEnvironment: "jsdom"
```

Test react:
Following code must be present
```
testEnvironment: "jsdom"
```
