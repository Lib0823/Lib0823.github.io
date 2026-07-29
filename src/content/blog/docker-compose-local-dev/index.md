---
title: 'Docker Compose로 로컬 개발 환경 통일하기'
description: 'PostgreSQL, Elasticsearch, Redis 등 여러 인프라 의존성을 Docker Compose 하나로 묶어 팀 전체의 로컬 개발 환경을 통일한 과정을 정리한다.'
date: 2026-03-15
category: 'Infrastructure'
tags: ['Docker', 'Server']
draft: true
---

## Overview

로컬 개발 환경마다 PostgreSQL, Elasticsearch, Redis의 버전과 설정이 제각각이라 발생하던 문제를, Docker Compose로 단일 정의 파일로 통일한 과정을 정리한다.

## Background

팀원 각자 로컬에 직접 설치한 DB/검색엔진 버전이 달라 "내 로컬에서는 되는데" 류의 문제가 반복됐다. 신규 합류자의 개발 환경 셋업에도 반나절 이상이 소요됐다.

## Implementation

```yaml
services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_DB: app
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    ports: ['5432:5432']
    volumes: ['pgdata:/var/lib/postgresql/data']

  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.15.0
    environment:
      discovery.type: single-node
      xpack.security.enabled: 'false'
    ports: ['9200:9200']

volumes:
  pgdata:
```

- 서비스별 버전을 명시적으로 고정해 "버전 드리프트"를 방지했다.
- 볼륨을 분리해 컨테이너 재생성 시에도 데이터가 유지되도록 했다.
- `.env.example`을 함께 제공해 필수 환경 변수를 문서화했다.

## Result

신규 개발자 온보딩 시간이 반나절에서 `docker compose up` 한 번으로 단축됐고, 환경 차이로 인한 버그 재현 실패 사례가 사라졌다.

## References

- [Docker Compose 공식 문서](https://docs.docker.com/compose/)
- [Elasticsearch Docker 공식 가이드](https://www.elastic.co/guide/en/elasticsearch/reference/current/docker.html)
