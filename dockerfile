# Use Ubuntu as base image
FROM ubuntu:20.04

# Set non-interactive mode for apt
ENV DEBIAN_FRONTEND=noninteractive

# Install necessary packages
RUN apt-get update \
    && apt-get install -y python3 python3-pip nodejs npm

# Upgrade pip
RUN python3 -m pip install --upgrade pip

# Set working directory
WORKDIR /opt/app

# Install Python packages
COPY requirements.txt .
RUN pip3 install -r requirements.txt

# Install Node packages
COPY package.json .
COPY package-lock.json .
RUN npm install

# Copy the rest of your application files
COPY . .

# Expose necessary ports
EXPOSE 3000

# Set environment variables if needed
# ENV MY_VARIABLE=value

# Run your application
CMD ["npm", "run", "start:dev"]
