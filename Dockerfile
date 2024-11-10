# NGINX 이미지를 사용하여 웹 서버 구성
FROM nginx:latest

# 빌드 결과물 복사
COPY ./dist /usr/share/nginx/html

# 포트 80 노출
EXPOSE 80
