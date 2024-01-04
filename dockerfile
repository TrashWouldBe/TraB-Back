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

# STEP 2
# 7
FROM --platform=linux/amd64 node:21-alpine
# 8
WORKDIR /app
# 9
ENV NODE_ENV production
# 10
COPY --from=builder /app ./
# 11
EXPOSE 3000
# 12
CMD ["npm", "run", "start:prod"]