FROM python:3.10 as build

WORKDIR /opt/app
RUN python -m venv /opt/app/venv
ENV PATH="/opt/app/venv/bin:$PATH"

COPY requirements.txt .
RUN pip install -r requirements.txt

# STEP 1
# 1
FROM --platform=linux/amd64 node:21

RUN apt update \
    && apt install software-properties-common \
    && add-apt-repository ppa:deadsnakes/ppa \
    && apt update \
    && apt install python3.10

WORKDIR /opt/app
COPY --from=build /opt/app/venv /venv

ENV PATH="/opt/app/venv/bin:$PATH"

RUN npm ci
# 6
RUN npm run build

ENV NODE_ENV production

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start:dev"]
