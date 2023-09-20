# Base image
FROM node:18.16.0-alpine3.16

# Run linux commands 

# Sets working directory
WORKDIR /planner

# Copy from local file to container
COPY . .

# Install the necessary dependencies
RUN npm install

# start container with node and parameters: server.js
EXPOSE 5173
CMD [ "npm", "run", "dev"]

