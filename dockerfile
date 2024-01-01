# STEP 1
# 1
FROM --platform=linux/amd64 node:16 AS builder
# 2
WORKDIR /app
# 3
COPY . .
# 4
RUN npm install
# 5
RUN npm run build

# STEP 2
#6
FROM --platform=linux/amd64 node:16-alpine
#7
WORKDIR /app
#8
ENV NODE_ENV production
#9
COPY --from=builder /app ./
#10
CMD ["npm", "run", "start:prod"]