---
title: 'Java - 가비지컬렉션 Young/Old(Eden)영역'
description: 'JVM 힙이 Young(Eden)/Old로 나뉘어 있는 이유와 객체가 Old로 승격되는 과정 정리'
date: 2025-05-25
category: 'Language'
tags: ['Java', 'GC', 'JVM']
draft: false
---

> JVM 힙이 Young(Eden)/Old로 나뉘어 있는 이유와 객체가 Old로 승격되는 과정 정리

세대별 GC(Generational GC) 자체는 자바만의 특징은 아니고 V8, .NET CLR 등 다른 런타임에도 있는 개념이다. 다만 HotSpot JVM이 이 구조를 기본으로 채택하고 있어서, 자바 힙 메모리를 다룰 때는 꼭 알아야 하는 부분이다.

### 왜 굳이 영역을 나눠놨을까

전제는 "대부분의 객체는 생성된 직후에 금방 죽는다"는 경험적 관찰(weak generational hypothesis)이다.

- 요청 하나 처리하고 버려지는 DTO, 임시 문자열, 스트림 중간 연산 객체 등이 대표적이다.
- 반대로 커넥션 풀, 캐시, 싱글톤 빈처럼 오래 살아남는 객체는 상대적으로 적다.

그래서 "금방 죽는 객체가 많은 영역"과 "오래 살아남는 객체가 있는 영역"을 아예 물리적으로 분리해두고, 각각 다른 전략의 GC를 돌린다.

### Young 영역 구조

Young 영역은 다시 3개로 나뉜다.

```
[ Eden ] [ Survivor 0 ] [ Survivor 1 ]
```

- **Eden**: 새로 생성된 객체가 처음 할당되는 공간
- **Survivor 0 / Survivor 1**: Eden에서 살아남은 객체가 옮겨가는 공간. 둘 중 하나는 항상 비어있다.

### Minor GC 동작 방식

1. Eden이 가득 차면 Minor GC(= Young GC)가 발생한다.
2. Eden과 사용 중인 Survivor 영역을 검사해서, 살아있는 객체만 비어있는 다른 Survivor 영역으로 복사한다.
3. 복사가 끝나면 Eden과 기존 Survivor 영역은 통째로 비운다.
4. 다음 Minor GC 때는 방금 채운 Survivor 영역과 Eden을 검사하고, 살아있는 객체를 다시 반대쪽 빈 Survivor로 복사한다.

이런 방식(Copying GC)은 "살아남는 객체가 적다"는 전제 위에서 동작하기 때문에, 죽은 객체를 일일이 찾아 제거하는 대신 산 객체만 복사하고 나머지는 통째로 버리는 게 훨씬 빠르다.

### Old로 승격되는 과정 (Promotion)

객체는 Survivor 영역을 오갈 때마다 **age**가 하나씩 증가한다.

이 age가 일정 임계값(Tenuring Threshold, 기본적으로 JVM이 상황에 따라 조정하며 최대치는 `-XX:MaxTenuringThreshold`로 설정 가능, 기본값 15)을 넘기면 Young 영역을 졸업해서 **Old 영역으로 승격(promotion)**된다.

```
Eden에 객체 생성
  ↓ (Minor GC 생존)
Survivor 영역 (age=1)
  ↓ (Minor GC 생존 반복, age 증가)
age가 임계값 초과
  ↓
Old 영역으로 승격
```

Survivor 공간이 부족해서 다 못 옮기는 경우처럼, age와 무관하게 바로 Old로 승격되는 예외 상황도 있다.

### Old 영역과 Major GC

Old 영역은 "오래 살아남을 만한 객체들"이 모이는 곳이라 상대적으로 자주 비우지 않아도 되지만, 대신 한 번 GC가 돌면(Major GC / Full GC) Young GC보다 훨씬 비용이 크다.

- Old 영역은 Young보다 크고, 살아있는 객체 비율도 높아서 Copying 방식이 비효율적이다.
- 그래서 보통 Mark-Sweep-Compact 방식(살아있는 객체 표시 → 죽은 객체 회수 → 메모리 압축)을 쓴다.
- Full GC가 잦다는 건 대부분 "Old 영역에 뭔가 예상보다 오래 살아남는 객체가 쌓이고 있다"는 신호라, 실무에서는 힙 덤프로 이런 객체를 찾아보는 게 메모리 튜닝의 시작점이 된다.
