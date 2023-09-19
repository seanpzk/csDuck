#base image
FROM node:18.16.1-bullseye


#run linux commands

# copy from local file to container
COPY . /planner

# sets working directory
WORKDIR /planner 

# install the necessary dependencies
RUN npm install vite@4.3.9 react-bootstrap bootstrap@5.2.3 react-phone-input-2 jest babel-jest @babel/preset-env @babel/preset-react react-test-renderer identity-obj-proxy @heroicons/react

# start container with node and parameters: server.js
EXPOSE 5173
CMD [ "npm", "run", "dev"]

