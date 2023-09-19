#base image
FROM node:18.16


#run linux commands

# copy from local file to container
COPY . /planner

# sets working directory
WORKDIR /planner 

# install the necessary dependencies
RUN npm install

# start container with node and parameters: server.js
EXPOSE 5173
CMD [ "npm", "run", "dev"]

