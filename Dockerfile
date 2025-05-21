FROM nginx:alpine
COPY dist/smart-translate-frontend/browser/. /usr/share/nginx/html/

COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80 433
CMD ["nginx", "-g", "daemon off;"]
