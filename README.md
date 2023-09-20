# csDuck

Orbital project

## Before you run the programs, ensure you have nodejs and npm installed

## Run following command in planner

```
npm install
```

## Run following command in server

```
npm install 
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
```
npm i jest-environment-jsdom
```
Following code must be present
```
testEnvironment: "jsdom"
```

## Containerization

Create Dockerfile to build docker image for containerization.

### To deploy the **dev** server in container
Access the directory _planner_ using terminal:
1. `build` docker image:
   `docker build -t csduckplanner:1.0 .`

2. `run` docker container:
  `docker run -d -p 5173:5173 csduckplanner:1.0`


### To deploy the **static** server in container
Access the directory _planner_ using terminal:
1. `build` docker image:
   `docker build --file Dockerfile-static -t csduckstatic:1.1 .`
2. `run` docker container:
   `docker run -d -p 4173:4173 csduckstatic:1.1`


