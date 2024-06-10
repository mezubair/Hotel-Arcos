# Use the Node.js 18 Alpine image as the base
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json if available
COPY package*.json ./

# Set environment variables correctly using ENV
ENV NODE_ENV=development
ENV PORT=8081
ENV JWT_SECRET=mysecretkey
ENV JWT_EXPIRES_IN=90d
ENV JWT_COOKIE_EXPIRES_IN=90
ENV MONGO_DB_URL=mongodb+srv://mesamparker1998:Zubair1998@cluster0.hz7oazs.mongodb.net/customProject?retryWrites=true&w=majority&appName=Cluster0
ENV DB_NAME=customProject

# Install application dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the port the application will run on
EXPOSE 8081

# Define the command to run the application
CMD [ "node", "app.js" ]
