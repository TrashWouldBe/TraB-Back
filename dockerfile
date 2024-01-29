# Python 빌드 단계
FROM python:3.11-slim AS python-builder
WORKDIR /python
COPY requirements.txt .

# 컴파일러 및 필요한 라이브러리 설치
RUN apt-get update && \
    apt-get install -y gcc libgl1-mesa-glx && \
    rm -rf /var/lib/apt/lists/*

# Python 패키지 설치
RUN pip install --no-cache-dir -r requirements.txt

# Node.js 빌드 단계
FROM --platform=linux/amd64 node:21 AS node-builder
WORKDIR /app
COPY . .
RUN npm install && npm ci && npm run build

# 최종 이미지
FROM --platform=linux/amd64 node:21
WORKDIR /app

# Python 환경 및 라이브러리 복사
COPY --from=python-builder /usr/local /usr/local
COPY --from=python-builder /usr/lib/x86_64-linux-gnu /usr/lib/x86_64-linux-gnu

# Node.js 애플리케이션 복사
COPY --from=node-builder /app .

# Node.js 환경 변수 설정 및 포트 노출
ENV NODE_ENV production
EXPOSE 3000

# 애플리케이션 실행
CMD ["npm", "run", "start:dev"]
