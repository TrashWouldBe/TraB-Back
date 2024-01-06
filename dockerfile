# STEP 1
# copy server code.
RUN mkdir /server-code
WORKDIR /server-code
ADD package-lock.json /server-code
ADD package.json /server-code
ADD ./tsconfig.json /server-code/tsconfig.json
RUN npm install
ADD ./src /server-code/src
WORKDIR /server-code
RUN npm run build

FROM node:16-slim

RUN mkdir /server-code
WORKDIR /server-code
ADD package.json /server-code
ADD package-lock.json /server-code
RUN npm run build
COPY --from=build /server-code/dist /server-code/dist
# 12
CMD ["npm", "run", "start:dev"]