FROM nginx:alpine
COPY dist/smart-translate-frontend/browser/. /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY certs/ /etc/nginx/certs/
EXPOSE 443
CMD ["nginx", "-g", "daemon off;"]
