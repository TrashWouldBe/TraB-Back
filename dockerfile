# STEP 1
# 1
FROM --platform=linux/amd64 node:21 AS builder
# 2
WORKDIR /app
# 3
COPY . .
# 4
RUN npm install
# 5
RUN npm ci
# 6
RUN npm run build
# 7
RUN apt-get update
RUN apt-get install -y python3 python3-pip python3-venv
RUN python3 -m venv /venv
RUN /venv/bin/pip install -r requirements.txt

# STEP 2
# 9
FROM --platform=linux/amd64 node:21-alpine
# 19
WORKDIR /app
# 11
ENV NODE_ENV production
# 12
COPY --from=builder /app ./
# 13
EXPOSE 3000
# 14
CMD ["npm", "run", "start:dev"]
