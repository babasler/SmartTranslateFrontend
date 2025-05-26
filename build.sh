output=&(docker build -t smart-translate-frontend .)
echo "$output"

output=$(docker run --name st-frontend  -d  -p 80:80 -p 443:443 \
  -v /home/ubuntu/SmartTranslateFrontend/certs/bastian-basler.de_ssl_certificate.cer:/etc/ssl/certs/cert.pem:ro \
  -v /home/ubuntu/SmartTranslateFrontend/certs/\*.bastian-basler.de_private_key.key:/etc/ssl/private/privkey.pem:ro \
  smart-translate-frontend)
echo "$output"
