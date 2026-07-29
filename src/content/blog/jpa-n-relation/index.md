---
title: '1:N Relation. 관계 설정'
description: '[1:1] 관계와 거의 유사하지만 하나의 User가 여러 UserHistory를 가질 수 있는 관계이다.'
date: 2023-09-10
category: 'Backend'
tags: ['Spring', 'JPA', 'Spring data JPA', '1:n relation']
draft: false
---

***[1:1]** 관계와 거의 유사하지만 하나의 User가 여러 UserHistory를 가질 수 있는 관계이다.*

***[1:N], [N:1]** 관계는 상황에 따라 둘다 걸어 양방향에서 참조가 가능하게 할 수 도 있고 한쪽 방향에서만 걸어줄 수도 있다.*

#### **1:N 릴레이션 (주 테이블)**

매우 간단하다. (기본적인 것은 1:1 릴레이션 참고!)

- **@OneToMany** 어노테이션을 붙여준다.
- 1:1 관계에서 주 테이블(User)에서 대상 테이블(UserHistory) 타입의 속성을 선언했다면,
- 1:N 관계에서는 대상 테이블(UserHistory)타입을 갖는 List타입으로 속성을 선언해주면 된다.

**(UserEntity)**

```java
@OneToMany(fetch = FetchType.EAGER)
@JoinColumn(name = "user_id", insertable = false, updatable = false)
private List<UserHistory> userHistory = new ArrayList<>();
```

> User에서 UserHistory테이블을 삽입, 갱신하지 못하도록 설정

- `insertable = false, updatable = false`를 붙인 이유는, 이 FK 컬럼(`user_id`)의 진짜 주인은 아래에서 볼 `UserHistory` 쪽(N:1, `@ManyToOne`)이기 때문이다. 여기서도 값을 쓸 수 있게 두면 양쪽이 서로 다른 시점에 같은 컬럼을 갱신하려고 해서 꼬일 수 있다.
- 다만 `fetch = FetchType.EAGER`는 주의가 필요하다. `@OneToMany`/`@ManyToMany`의 JPA 스펙 기본값은 원래 **LAZY**이고, 실무에서도 특별한 이유가 없다면 LAZY를 유지하는 걸 권장한다. 컬렉션을 EAGER로 두면 User 하나 조회할 때마다 매번 UserHistory 전체를 같이 긁어오게 되고, EAGER 컬렉션이 두 개 이상 얽히면 Hibernate가 조인을 만들다가 예외(`MultipleBagFetchException`)를 던지는 경우도 있다.

#### **N:1 릴레이션 (대상 테이블)**

보통 1:N 관계로 세팅하지만 N:1 관계를 추가해 대상 테이블(UserHistory)에서 주 테이블(User)을 참조 할 수 있게 한다.

**(UserHistory)**

```java
@ManyToOne
private User user;
```

#### 더 흔하게 쓰는 방식 - mappedBy 양방향 매핑

위 방식(양쪽에 각각 `@JoinColumn`)도 동작은 하지만, 실무에서 1:N 양방향을 맺을 때 더 표준적으로 쓰는 방식은 `mappedBy`를 쓰는 것이다.

```java
// User (1쪽, 연관관계의 주인이 아님)
@OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
private List<UserHistory> userHistory = new ArrayList<>();

// UserHistory (N쪽, 연관관계의 주인 = FK를 실제로 관리)
@ManyToOne
@JoinColumn(name = "user_id")
private User user;
```

- FK 컬럼은 항상 N쪽(`UserHistory`)에 있으므로, N쪽을 **연관관계의 주인**으로 두고 `@JoinColumn`을 그쪽에만 선언한다.
- 1쪽(`User`)의 `@OneToMany`에는 `mappedBy = "user"`를 붙여서 "이 컬렉션은 `UserHistory.user` 필드가 관리하는 관계를 그대로 보여주기만 하는 거울일 뿐"이라고 명시한다.
- 이렇게 하면 FK 갱신 책임이 한쪽으로 명확히 몰리기 때문에, `insertable = false, updatable = false` 같은 별도 처리 없이도 자연스럽게 안전하다.

> *N:N 관계는 복잡하여 잘 사용하지 않는다.*
