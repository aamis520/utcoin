FROM nginx

LABEL maintainer="John <john@zhuandian.net>"

ADD ./dockerfiles/default.conf /etc/nginx/conf.d/default.conf
ADD ./dist/ /usr/share/nginx/html/
