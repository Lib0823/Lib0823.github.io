---
title: 'JPA N+1 문제, fetch join으로 해결하기'
description: 'Spring Data JPA에서 연관 엔티티 조회 시 발생하는 N+1 쿼리 문제를 fetch join과 EntityGraph로 해결하는 방법을 정리한다.'
date: 2026-01-10
category: 'Backend'
tags: ['Spring', 'JPA']
draft: true
---

## Overview

Spring Data JPA로 연관관계가 있는 엔티티를 조회할 때 흔히 마주치는 N+1 쿼리 문제와, `fetch join` / `@EntityGraph`를 이용한 해결 방법을 정리한다.

## Background

`@OneToMany`로 연관된 엔티티를 지연 로딩(LAZY)으로 설정한 상태에서 목록을 조회하면, 부모 엔티티 조회 쿼리 1번 이후 각 부모마다 자식 엔티티를 조회하는 쿼리가 N번 추가로 발생한다. 목록 크기가 커질수록 쿼리 수가 선형으로 증가해 응답 지연의 주요 원인이 된다.

## Implementation

```java
@Query("select p from Post p join fetch p.comments where p.status = :status")
List<Post> findWithCommentsByStatus(@Param("status") PostStatus status);
```

- `join fetch`로 연관 엔티티를 한 번의 쿼리에 포함시켜 N+1을 제거한다.
- 컬렉션을 두 개 이상 fetch join할 경우 카테시안 곱으로 인한 중복 로우가 발생하므로, `distinct` 키워드나 `@EntityGraph(type = FETCH)`로 범위를 분리한다.
- 페이징이 필요한 경우 컬렉션 fetch join은 메모리 페이징 경고가 발생하므로, `BatchSize`(`@BatchSize` 또는 `hibernate.default_batch_fetch_size`)로 우회한다.

## Result

목록 API 기준 쿼리 수가 요청당 N+1개에서 1~2개로 줄었고, 100건 조회 응답 시간이 개선되었다.

## References

- [Hibernate User Guide - Fetching](https://docs.jboss.org/hibernate/orm/current/userguide/html_single/Hibernate_User_Guide.html#fetching)
- [Spring Data JPA Reference - Query Methods](https://docs.spring.io/spring-data/jpa/reference/jpa/query-methods.html)
