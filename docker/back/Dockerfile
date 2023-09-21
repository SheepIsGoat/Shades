# Use the official Node.js image
FROM node:latest

# Create and change to the app directory
WORKDIR /usr/src/app

COPY package*.json ./
# Run the commands to set up your project in a single layer
RUN npm install express @sanity/client typescript@4.4.3 && \
    npm install @types/node @types/express --save-dev && \
    npm install react @types/react dotenv react-scripts react-dom && \
    npm install -g ts-node

# Copy local code to the container image
COPY . ./

# Open a port for the application
EXPOSE 3001

# Run the application
CMD [ "npm", "run", "server" ]
