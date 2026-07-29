---
title: 'Java 21 Virtual Thread로 블로킹 I/O 병목 줄이기'
description: 'Java 21에 도입된 Virtual Thread의 동작 원리와, 블로킹 I/O가 많은 백엔드 서비스에 적용할 때의 고려사항을 정리한다.'
date: 2026-02-03
category: 'Language'
tags: ['Java']
draft: true
---

## Overview

Java 21 LTS에서 정식 도입된 Virtual Thread가 기존 플랫폼 스레드 모델과 어떻게 다른지, 블로킹 I/O 위주의 백엔드 서비스에서 얻을 수 있는 이점과 주의점을 정리한다.

## Background

기존 플랫폼 스레드는 OS 스레드에 1:1로 매핑되어 스택 크기(기본 1MB 수준)와 컨텍스트 스위칭 비용 때문에 동시 처리량에 한계가 있다. 요청당 스레드(thread-per-request) 모델에서 외부 API 호출이나 DB I/O로 스레드가 블로킹되면, 스레드 풀이 고갈되어 처리량이 정체되는 문제가 반복적으로 발생했다.

## Implementation

```java
try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
    IntStream.range(0, 10_000).forEach(i ->
        executor.submit(() -> callBlockingApi(i))
    );
}
```

- Virtual Thread는 JVM이 관리하는 경량 스레드로, 블로킹 시 캐리어(OS) 스레드를 반납하고 다른 Virtual Thread를 실행한다.
- `synchronized` 블록 내부의 블로킹 호출은 캐리어 스레드를 고정(pinning)시켜 이점이 사라지므로 `ReentrantLock`으로 전환이 필요하다.
- 커넥션 풀 크기 등 기존에 스레드 풀 크기에 맞춰 튜닝했던 설정값들은 Virtual Thread 환경에서 재검토가 필요하다.

## Result

외부 API 호출이 잦은 배치 작업에서 동시 실행 가능한 작업 수 제약이 크게 완화되었고, 별도의 리액티브 스택 도입 없이 동기 코드 스타일을 유지하며 처리량을 개선할 수 있었다.

## References

- [JEP 444: Virtual Threads](https://openjdk.org/jeps/444)
- [Java Concurrency in Practice - Thread Pinning](https://docs.oracle.com/en/java/javase/21/core/virtual-threads.html)
