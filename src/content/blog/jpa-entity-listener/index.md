---
title: 'Entity Listener. 엔티티 리스너'
description: '엔티티의 변화를 감지하고 테이블의 데이터를 조작한다.'
date: 2023-09-10
category: 'Backend'
tags: ['Spring', 'JPA', 'Spring data JPA', 'entity listener']
draft: false
---

#### Entity Listener란?

*엔티티의 변화를 감지하고 테이블의 데이터를 조작한다.*

**@PrePersist**

- Persist(insert)메서드가 호출되기 전에 실행되는 메서드

**@PreUpdate**

- UPDATE 쿼리가 나가기 직전에 실행되는 메서드. `merge()`를 호출했을 때뿐만 아니라, 관리 중인(managed) 엔티티의 필드값을 바꾼 뒤 트랜잭션이 커밋/flush될 때 Hibernate가 변경 감지(dirty checking)로 UPDATE를 만드는 경우에도 똑같이 호출된다.

**@PreRemove**

- Delete메서드가 호출되기 전에 실행되는 메서드

**@PostPersist**

- Persist(insert)메서드가 호출된 이후에 실행되는 메서드

**@PostUpdate**

- UPDATE 쿼리가 실행된 직후에 호출되는 메서드 (역시 dirty checking으로 인한 UPDATE에도 동일하게 적용된다)

**@PostRemove**

- Delete메서드가 호출된 후에 실행되는 메서드

**@PostLoad**

- Select조회가 일어난 직후에 실행되는 메서드

---

### @EntityListeners(value = CustomListener.class)

- Entity Listener를 현재 Entity 클래스가 아닌 다른 클래스에서 정의해서 사용할 때 사용한다.
- value값을 외부 EntityListener클래스명으로 설정하고 해당 Entity클래스에 붙여주면 된다.

### 활용 방법

1. 데이터 값을 따로 백업 해둘 때 사용
2. 값이 삽입되거나 수정될 때 최종 시간 업데이트

#### 데이터 생성, 수정 시간 업데이트는 SpringBoot에서 어노테이션 지원.

1. SpringBootApplication 클래스에 **@EnableJpaAuditing** 지정
2. 해당 Entity클래스에 **@EntityListeners(value=AuditingEntityListener.class)** 지정
3. Entity의 createdAt(생성 시간) 속성에 **@CreatedDate** 지정
4. Entity의 updatedAt(수정 시간) 속성에 **@LastModifiedDate** 지정

### 실제 사용 방식

1. SpringBootApplication 클래스에 **@EnableJpaAuditing** 지정

2. AuditingEntityListener를 따로 처리할 클래스 생성 (BaseEntity)

```java
@Data
@MappedSuperclass  // 다른 Entity클래스들의 상위 클래스를 뜻함.
@EntityListeners(value = AuditingEntityListener.class)
public class BaseEntity {

	@CreatedDate
	private LocalDateTime createdAt;

	@LastModifiedDate
	private LocalDateTime updatedAt;
}
```

3. 다른 Entity클래스에서 BaseEntity 클래스를 상속(extends)받으면 설정된다.

> 이때 BaseEntity를 상속 받은 클래스에서는 @ToString(callSuper=true), @EqualsAndHashCode(callSuper=true)를 추가해준다.
