# Node.js 빌드 단계
FROM node:21 AS builder
WORKDIR /app
COPY . .
RUN npm install && npm ci && npm run build

# Python과 Node.js를 포함하는 최종 이미지
FROM python:3.9-slim
WORKDIR /app

# Node.js 애플리케이션 복사
COPY --from=builder /app ./

# Python 패키지 설치
RUN pip install -r requirements.txt

# Node.js 환경 변수 설정 및 포트 노출
ENV NODE_ENV production
EXPOSE 3000

# 애플리케이션 실행
CMD ["npm", "run", "start:dev"]
