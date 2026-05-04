# Start from the node v20 base image
FROM node:20 AS build

# Create an app directory within the image
WORKDIR /app

# Install dependencies into the image - doing this first will speed up subsequent builds, as Docker will cache this step
COPY package*.json ./
RUN npm install

# Copy the remaining app source code into the default directory within the image
COPY . .

# Build the Vite app for production
RUN npm run build

# Production stage - use a lightweight base image
FROM node:20-alpine

WORKDIR /app

# Install serve to run the production build
RUN npm install -g serve

# Copy the built app from the build stage
COPY --from=build /app/dist ./dist

# Expose port 5173 to make it available to the docker daemon
EXPOSE 5173

# Define the runtime command that will be executed when a container is made from the image
CMD [ "serve", "-s", "dist", "-l", "5173" ]
