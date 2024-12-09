FROM node:16

# Set the working directory for your app
WORKDIR /code

# Copy the package.json and package-lock.json for the Express server
COPY package.json package-lock.json ./

# Install only production dependencies (including Express)
#RUN npm install --only=production
RUN npm install express@^4.21.1 

# Copy the built React app from the previous stage
COPY ./build ./build

# Copy the Express server code
COPY server.js ./server.js

# Expose the port (3000 or whatever port you need)
EXPOSE 3000

# Start the Express server
CMD ["node", "server.js"]
