---
title: '가상 스레드 (Virtual thread)'
description: '고성능 서버에서 대규모 동시성을 처리하는 가장 효율적인 방법'
date: 2025-03-19
category: 'Language'
tags: ['Java', 'thread']
draft: false
---

> 고성능 서버에서 대규모 동시성을 처리하는 가장 효율적인 방법

### Java의 Thread 처리 방식 변화

#### 1. Native Thread

커널(OS:linux) 스레드와 유저(JVM) 스레드를 1대1 매핑해서 사용

#### 2. 컨텍스트 스위칭

하나의 커널 스레드에 여러개의 스레드를 할당해서 커널 스레드를 점유해서 실행중인 스레드가 I/O, wait, sleep 등의 상태로 전환될 때 다른 스레드가 커널 스레드를 점유하여 작업을 수행하는 방법

* 기존 프로세스 모델을 쪼개서 공통 부분은 공유하며 실행 단위만 번갈아 가면서 수행하도록 함
* 프로세스에 비해 크기가 작아 생성 비용이 적고 컨텍스트 스위칭 비용이 저렴하다.

#### 3. 경량 스레드 모델 (Virtual Thread)

플랫폼 스레드와 가상 스레드로 나뉘고 ForkJoin Pool이 추가됨

- **처리 방식**: ForkJoin Pool에서 플랫폼 스레드를 관리하며, 가상 스레드의 작업을 플랫폼 스레드에 Queue 형태로 할당하여 처리하는 방식
- **장점**: 기존 컨텍스트 스위칭 방식에서는 커널(시스템)에 접근하여 스위칭하기 때문에 시스템콜을 사용하여 스위칭 비용이 비교적 많이 들고 스레드 생성에 한계가 있었지만, 가상 스레드는 ForkJoin Pool이 관리하기 때문에 시스템콜을 호출하지 않고 JVM에서 처리가 가능하며 훨씬 작은 단위로 스레드를 생성할 수 있음
- **필요 이유**: 요청량이 더욱 크게 증가하는 서버 환경에서 기존 방식으로는 스레드 수에 한계가 있고, 스레드가 많아지면서 컨텍스트 스위칭 비용이 증가함

> Java 21부터 정식 기능으로 사용 가능 (JEP 444)

### 사용 방법

가상 스레드를 만드는 방법은 여러 가지가 있는데, 실무에서는 대부분 `Executors.newVirtualThreadPerTaskExecutor()`를 쓴다.

```java
// 1. 요청 하나당 가상 스레드 하나씩 생성해서 실행
try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
    for (int i = 0; i < 10_000; i++) {
        executor.submit(() -> callBlockingApi());
    }
} // try-with-resources가 끝나면 자동으로 shutdown + 종료 대기
```

기존 플랫폼 스레드 풀(`Executors.newFixedThreadPool(200)` 같은)과 인터페이스(`ExecutorService`)가 동일해서, 대부분의 경우 executor를 만드는 코드 한 줄만 바꾸면 나머지 비즈니스 로직은 그대로 재사용할 수 있다.

가상 스레드를 직접 만들고 싶다면 이렇게도 가능하다.

```java
// 2. 가상 스레드 직접 생성 + 시작
Thread vThread = Thread.ofVirtual()
        .name("worker-", 0)
        .start(() -> callBlockingApi());

vThread.join();
```

### 주의할 점 - synchronized와 pinning

가상 스레드가 블로킹 작업(I/O 등)을 만나면 캐리어(플랫폼) 스레드를 반납하고 다른 가상 스레드에게 넘겨주는 게 핵심인데, `synchronized` 블록/메서드 안에서 블로킹이 발생하면 이 반납이 안 되고 캐리어 스레드가 그대로 묶여버리는(pinning) 문제가 있었다.

```java
synchronized (lock) {
    // 이 안에서 블로킹 I/O가 발생하면
    // 캐리어 스레드가 반납되지 않고 pinning 됨 (Java 21~23 기준)
}
```

그래서 가상 스레드를 많이 쓰는 코드에서는 `synchronized` 대신 `ReentrantLock` 같은 java.util.concurrent 계열 락을 쓰는 게 권장됐었다. 다만 이 제약은 JDK 24(JEP 491)에서 대부분 해소돼서, 최신 JDK를 쓴다면 예전만큼 신경 쓰지 않아도 된다.

### 멀티 스레드 vs 가상 스레드 비교

| 구분 | 플랫폼 스레드 | 가상 스레드 |
| --- | --- | --- |
| 매핑 | OS 스레드와 1:1 | 소수의 캐리어(플랫폼) 스레드에 다:1 |
| 생성 비용 | 상대적으로 큼 (기본 스택 크기 등) | 매우 작음 (수십만 개 생성 가능) |
| 블로킹 시 | 커널 스레드가 그대로 대기(점유) | 캐리어 스레드를 반납하고 다른 작업 처리 |
| 적합한 작업 | CPU 바운드 작업 | I/O 바운드, 블로킹이 잦은 작업 |

가상 스레드는 "스레드를 더 빠르게 만든다"기보다는, 블로킹 I/O가 많은 작업에서 스레드 풀 고갈 문제를 없애는 것에 가깝다. CPU 바운드 작업이 많다면 가상 스레드를 써도 캐리어 스레드(보통 CPU 코어 수만큼) 이상으로 동시에 실행되진 않는다.

참고 글

[https://techblog.woowahan.com/15398/](https://techblog.woowahan.com/15398/)
