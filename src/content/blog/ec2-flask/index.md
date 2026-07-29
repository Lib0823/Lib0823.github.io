---
title: 'Flask앱 배포'
description: 'Nginx를 사용하면 지정 경로(포트)로 들어오는 요청을 받아 flask앱의 경로 localhost:5000로 매핑하여 연결할 수 있지만 flask를 실행할 수 없어 문제가 발생한다.'
date: 2023-09-10
category: 'Infrastructure'
tags: ['AWS', 'nginx', 'mongoDB', 'AWS EC2']
draft: false
---

#### 구름IDE에서 Flask, MongoDB를 이용하여 개발한 chatbotAPI 프로젝트를 Nginx와 Gunicorn을 이용하여 배포한다.

- Nginx를 사용하면 지정 경로(포트)로 들어오는 요청을 받아 flask앱의 경로 `localhost:5000`로 매핑하여 연결할 수 있지만 flask를 실행할 수 없어 문제가 발생한다.
- 그렇기 때문에 gunicorn을 이용하여 flask앱을 실행시켜주고 nginx는 gunicorn의 경로 `localhost:8000`을 매핑하여 nginx → gunicorn → flask 순서로 작동하게 된다.

## 1. Gunicorn

```
# Gunicorn 설치
> pip install gunicorn

# Flask 앱 실행 (app는 flask앱의 파일이름)
> gunicorn app:application --daemon

# 포트 지정하여 실행 
> gunicorn -b 0.0.0.0:8000 app:application

# Gunicorn 상태 확인
> ps aux | grep gunicorn
> netstat -tuln | grep 8000
```

> gunicorn을 먼저 실행하고 Nginx 서버를 실행시켜야 한다. gunicorn이 떠있지 않은 상태에서 Nginx가 먼저 요청을 받으면 8000번 포트로 proxy_pass 할 대상이 없어 502 에러가 발생한다. 만약 문제가 생긴다면 gunicorn과 nginx의 서비스를 중지 시킨 뒤 다시 실행

## 2. Nginx

```
# Nginx 설치
> sudo apt-get install nginx

# Nginx 설정파일 수정
> vi /etc/nginx/sites-available/default

server {
    listen 80;
    server_name example.com;  # 도메인 또는 IP 주소

    location / {
        proxy_pass http://127.0.0.1:8000;  # Gunicorn이 실행되는 주소와 포트로 설정
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

# Nginx 재시작 
> sudo service nginx restart

# Nginx 상태 확인
> sudo service nginx status
```

## 3. MongoDB

> MongoDB를 따로 외부 서버에서 돌리지 않고 Client로 사용할 때의 방법

개발할 때는 mongod 명령어를 이용하여 서버를 실행시킬 수 있다.

```
# MongoDB 설치
pip install pymongo
sudo apt-get install mongodb-server

# MongoDB 서비스
sudo service mongodb start  # 서비스 시작
sudo service mongodb stop   # 서비스 중지
sudo service mongodb restart  # 서비스 재시작
```

*첫 배포 완료..!*
