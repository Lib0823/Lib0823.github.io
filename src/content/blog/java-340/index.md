---
title: '멀티 스레드 성능 개선'
description: '설명과 장단점'
date: 2025-03-14
category: 'Language'
tags: ['Java', 'Lock', 'multi thread']
draft: false
---

### 멀티 스레드란?

하나의 프로세스 안에서 여러 스레드가 동시에 작업을 처리하는 것. 스레드끼리 힙(Heap) 메모리를 공유하기 때문에 프로세스를 여러 개 띄우는 것보다 훨씬 가볍다.

**장점**

- CPU 코어를 여러 개 활용해서 처리량을 늘릴 수 있다.
- I/O 대기(DB 응답, 외부 API 호출 등) 중에 다른 작업을 처리할 수 있어 자원을 효율적으로 쓴다.

**단점**

- 여러 스레드가 같은 데이터를 동시에 건드리면 경쟁 상태(Race Condition)가 생길 수 있다.
- 디버깅이 어렵다. 타이밍에 따라 재현이 안 되는 버그가 흔하다.
- 스레드 개수를 무작정 늘린다고 성능이 비례해서 좋아지지 않는다. 컨텍스트 스위칭 비용이 커지는 시점부터는 오히려 느려진다.

#### 효과적인 활용 사례

- **I/O 바운드 작업**: DB 조회, 외부 API 호출처럼 대기 시간이 긴 작업. 스레드가 대기하는 동안 다른 스레드가 CPU를 쓸 수 있어 효과가 크다.
- **대량 배치 처리**: 파일 여러 개 파싱, 이미지 여러 장 리사이징처럼 작업 단위를 쪼갤 수 있는 CPU 바운드 작업. 코어 수만큼 병렬로 처리하면 전체 소요 시간이 줄어든다.
- 반대로 순서가 중요하거나 공유 자원 접근이 잦은 작업은 오히려 멀티 스레드로 바꾸면 동기화 비용 때문에 손해를 볼 수 있다.

#### 사용 방법

**1. Runnable 인터페이스 구현**

```java
Runnable task = () -> System.out.println("작업 실행: " + Thread.currentThread().getName());
Thread thread = new Thread(task);
thread.start();
```

- `run()`만 정의하고 실행 주체(Thread)와 분리되어 있어 재사용하기 좋다.
- Java는 클래스 다중 상속이 안 되기 때문에, 이미 다른 클래스를 상속하고 있어도 Runnable은 구현할 수 있다.

**2. Thread 클래스 상속**

```java
class MyThread extends Thread {
    @Override
    public void run() {
        System.out.println("작업 실행: " + getName());
    }
}

new MyThread().start();
```

- 간단하지만 이미 Thread를 상속했기 때문에 다른 클래스를 상속할 수 없다. 실무에서는 Runnable 방식을 더 많이 쓴다.

**3. ExecutorService 사용**

스레드를 직접 만들고 관리하는 건 생성 비용도 크고 개수 제어도 번거롭다. `ExecutorService`는 스레드 풀을 미리 만들어두고, 작업을 던지면 알아서 놀고 있는 스레드에 배정해준다.

```java
ExecutorService executor = Executors.newFixedThreadPool(20);

for (int i = 0; i < 100; i++) {
    executor.submit(() -> System.out.println("작업 실행: " + Thread.currentThread().getName()));
}

executor.shutdown(); // 새 작업 접수를 막고, 진행 중인 작업이 끝나면 종료
```

- **스레드 풀 크기**: CPU 바운드 작업은 보통 `코어 수` ~ `코어 수 + 1` 정도가 적당하고, I/O 바운드 작업은 대기 시간이 긴 만큼 그보다 훨씬 많은 스레드를 둬도 된다.
- `Executors.newFixedThreadPool()`은 내부적으로 무제한 큐(`LinkedBlockingQueue`)를 쓰기 때문에, 작업이 쌓이는 속도가 처리 속도보다 계속 빠르면 큐가 무한정 늘어나 메모리 문제로 이어질 수 있다. `newCachedThreadPool()`은 반대로 큐잉 없이(`SynchronousQueue`) 놀고 있는 스레드가 없으면 바로 새 스레드를 만들기 때문에, 스레드 개수 자체가 무제한으로 늘어날 위험이 있다. 실무에서는 큐 크기와 최대 스레드 수를 직접 지정한 `ThreadPoolExecutor`를 쓰는 걸 권장한다.

#### 멀티 스레드 주의 사항

여러 스레드가 같은 변수/객체를 동시에 수정하면 값이 꼬이는 **경쟁 상태(Race Condition)**가 발생한다. 예를 들어 여러 스레드가 동시에 `count++`를 실행하면, 이 연산이 "읽기 → 더하기 → 쓰기" 3단계로 쪼개져 실행되기 때문에 일부 증가분이 누락될 수 있다.

이걸 막으려면 임계 영역(critical section)에 한 번에 하나의 스레드만 들어가도록 **락(Lock)**을 걸어야 한다.

**synchronized**

```java
synchronized (this) {
    count++;
}
```

- 가장 간단한 방법. 블록을 벗어나면 자동으로 락이 풀린다.
- 대기 중인 스레드를 특정할 수 없고(공정성 제어 불가), 락 획득을 기다리다 인터럽트할 수도 없다는 한계가 있다.

**ReentrantLock**

```java
private final ReentrantLock lock = new ReentrantLock();

public void increment() {
    lock.lock();
    try {
        count++;
    } finally {
        lock.unlock(); // 반드시 finally에서 해제
    }
}
```

- `synchronized`와 달리 락 해제를 직접 해줘야 해서 `try-finally`로 감싸는 게 필수다 (안 그러면 예외 발생 시 락이 안 풀려서 데드락으로 이어질 수 있다).
- `tryLock()`으로 락을 못 잡으면 대기하지 않고 바로 포기하는 것도 가능하고, 생성자에 `true`를 넘기면 먼저 대기한 스레드부터 순서대로 락을 얻는 공정성(fairness) 모드도 쓸 수 있다.
- 그만큼 코드가 복잡해지기 때문에, 단순히 임계 영역만 보호하면 되는 상황이라면 `synchronized`로 충분하고 `tryLock`이나 공정성 제어가 필요할 때만 `ReentrantLock`을 쓰는 게 낫다.
