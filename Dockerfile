FROM nginx:stable-alpine

WORKDIR /usr/share/nginx/html
COPY . .
EXPOSE 80