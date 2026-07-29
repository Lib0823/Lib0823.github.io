---
title: '데이터베이스 서버 보안 취약점 방지'
description: '실제 운영중인 서비스에서 데이터베이스의 보안은 매우 중요한 문제이므로 보안 관련 설정을 적용하여 취약점을 미리 방지하는 것이 좋다.'
date: 2024-10-22
category: 'Database'
tags: ['PostgreSQL', 'SSL', 'Postgres', 'HbA']
draft: false
---

> 실제 운영중인 서비스에서 데이터베이스의 보안은 매우 중요한 문제이므로 보안 관련 설정을 적용하여 취약점을 미리 방지하는 것이 좋다.

![데이터베이스 서버 보안 취약점 방지](./image-1.png)

PostgreSQL은 데이터베이스 보안을 강화하기 위해 다양한 설정과 기능을 제공한다. 특히 서버 설정 파일을 통해 암호화를 적용하고 안전한 인증 방식을 사용할 수 있다.

> 이 글에서는 PostgreSQL의 pg_hba.conf 파일을 중심으로 hostssl 및 scram-sha-256 설정 방법과 관련 정보를 다룬다.

## pg\_hba.conf 파일 개요

- **경로:** /var/lib/postgresql/<버전>/main/pg\_hba.conf
- **역할:** PostgreSQL의 호스트 기반 인증(HBA, Host-Based Authentication) 방식을 정의하며, 클라이언트 접속을 제어한다.

### 1. hostssl 설정

hostssl은 클라이언트와 서버 간 안전한 SSL 연결을 요구한다. 이를 통해 데이터 전송 시 통신을 암호화하여 중간자 공격 및 데이터 유출을 방지할 수 있다.

1) PostgreSQL 버전 확인

hostssl은 PostgreSQL <u>7.1</u> 이상의 버전에서 지원한다.

2) SSL 설정 활성화

PostgreSQL 설정 파일(postgresql.conf)에서 다음과 같이 SSL을 활성화한다.

```
ssl = on
ssl_cert_file = 'server.crt'
ssl_key_file = 'server.key'
```

3) OpenSSL을 사용한 인증서 생성

비밀 키 생성:

```
openssl genrsa -out server.key 2048
```

인증서 요청 파일 생성:

```
openssl req -new -key server.key -out server.csr
```

인증서 서명 및 생성:

```
openssl x509 -req -days 365 -in server.csr -signkey server.key -out server.crt
```

4) pg\_hba.conf 파일에 SSL 적용

다음과 같이 hostssl을 설정하여 SSL 연결을 요구한다.

```
hostssl all all 0.0.0.0/0 scram-sha-256
```

5) JDBC 드라이버에서 SSL 옵션 추가

Spring Boot 애플리케이션 등에서 JDBC URL에 SSL 모드를 설정한다.

```
spring.datasource.url=jdbc:postgresql://<HOST>:<PORT>/<DATABASE>?sslmode=require
```

- **require:** SSL 연결을 사용하지만 서버 인증서를 확인하지 않는다.
- **verify-full:** SSL 연결을 사용하며 서버 인증서를 엄격히 검증한다.

### 2. scram-sha-256 설정

scram-sha-256은 SHA-256 기반의 SCRAM(Salted Challenge Response Authentication Mechanism) 인증 방식을 사용한다. 이를 통해 비밀번호를 안전하게 관리하고, 인증 과정에서의 보안 취약점을 줄일 수 있다.

1. PostgreSQL 설정 파일(postgresql.conf)에서 암호화 방식 설정:

```
password_encryption = 'scram-sha-256'
```

2. pg\_hba.conf에서 인증 방식을 scram-sha-256으로 지정:

```
host all all 0.0.0.0/0 scram-sha-256
```

3. 기존 비밀번호를 SCRAM-SHA-256으로 재설정:

```
ALTER ROLE <username> WITH PASSWORD '<new_password>';
```

*- 끝 -*
