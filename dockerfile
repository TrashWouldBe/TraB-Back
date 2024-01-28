# STEP 1
FROM --platform=linux/amd64 node:21 AS builder

WORKDIR /app

# Copy only the necessary files for installing Python dependencies
COPY requirements.txt .

# Install Python and required packages directly
RUN apt-get update \
    && apt-get install -y python3 python3-pip \
    && pip3 install --no-cache-dir -r requirements.txt

# Continue with the rest of your build process
COPY . .
RUN npm install
RUN npm ci
RUN npm run build

# STEP 2
FROM --platform=linux/amd64 node:21-alpine

WORKDIR /app

# Copy only the necessary files from the builder stage
COPY --from=builder /app .

# Set environment variables and expose ports
ENV NODE_ENV production
EXPOSE 3000

# Run your application
CMD ["npm", "run", "start:dev"]
