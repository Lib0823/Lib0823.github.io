---
title: 'Entity Callbacks. 특정 메서드가 호출되기 전후에 Entity 수정 사항을 적용하는 방법'
description: '특정 메서드가 호출되기 전후에 Entity 수정 사항을 적용하는 방법.'
date: 2023-12-16
category: 'Backend'
tags: ['Spring', 'Elasticsearch', 'spring data elasticsearch', 'entity callbacks']
draft: false
---

### Entity Callbacks

특정 메서드가 호출되기 전후에 Entity 수정 사항을 적용하는 방법.

![Entity Callbacks](./entity-callbacks-1.png)

- SpringData 인프라는 특정 메서드가 호출되기 전/후에 엔티티를 수정할 수 있는 훅을 제공하며, 이러한 EnttiyCallback 인스턴스는 Entity를 콜백 형식으로 확인하고 수정하는 편리한 방법을 제공한다.
- EntityCallback은 동기 및 반응형 API와의 통합 지점을 제공하며 ProcessChain 내에서 실행 순서를 보장하고, 수정된 Entity나 반응형 래퍼 유형을 반환할 수 있다.

### 엔티티 콜백 구현 (Implementing Entity Callbacks)

EntityCallback은 일반적으로 제네릭 타입 인수를 사용하기 때문에 해당 도메인 타입과 직접적인 연관관계를 가진다.

> Interface

```java
@FunctionalInterface
public interface BeforeSaveCallback<T> extends EntityCallback<T> {

	/**
	 * Entity callback method invoked before a domain object is saved.
	 * Can return either the same or a modified instance.
	 *
	 * @return the domain object to be persisted.
	 */
	
	T onBeforeSave(T entity,
		String collection);
}

// 반응형 (reactive)
@FunctionalInterface
public interface ReactiveBeforeSaveCallback<T> extends EntityCallback<T> {

	/**
	 * Entity callback method invoked on subscription, before a domain object is saved.
	 * The returned Publisher can emit either the same or a modified instance.
	 *
	 * @return Publisher emitting the domain object to be persisted.
	 */
	
	Publisher<T> onBeforeSave(T entity,
		String collection);
}
```

> 실제 구현 예시

```java
class DefaultingEntityCallback implements BeforeSaveCallback<Person>, Ordered {

	@Override
	public Object onBeforeSave(Person entity, String collection) {
		if(collection.equals("user")) {
		    return // ...
		}
		return // ...
	}

	@Override
	public int getOrder() {
		return 100;
	}
}
```

### 엔티티 콜백 등록 (Registering Entity Callbacks)

EntityCallback Bean들은 ApplicationContext에 등록되어 있을 경우 저장소의 특정 구현체에 의해 선택되어 사용된다.

대부분의 Template API는 이미 ApplicationContextAware를 구현하고 있기 때문에 ApplicationContext에 액세스할 수 있다.

> EntityCallback 등록 예시

```java
@Order(1)
@Component
class First implements BeforeSaveCallback<Person> {

	@Override
	public Person onBeforeSave(Person person) {
		return // ...
	}
}

@Component
class DefaultingEntityCallback implements BeforeSaveCallback<Person>, Ordered {

	@Override
	public Object onBeforeSave(Person entity, String collection) {
		// ...
	}

	@Override
	public int getOrder() {
		return 100;
	}
}

@Configuration
public class EntityCallbackConfiguration {

    @Bean
    BeforeSaveCallback<Person> unorderedLambdaReceiverCallback() {
        return (BeforeSaveCallback<Person>) it -> // ...
    }
}

@Component
class UserCallbacks implements BeforeConvertCallback<User>, BeforeSaveCallback<User> {

	@Override
	public Person onBeforeConvert(User user) {
		return // ...
	}

	@Override
	public Person onBeforeSave(User user) {
		return // ...
	}
}
```

이렇게 Bean으로 등록된 EntityCallbacks는 Spring Data에서 자동으로 감지하여 적절한 이벤트가 발생할 때 호출된다.

### 특정 엔티티 콜백 저장 (Store specific EntityCallbacks)

Spring Data Elasticsearch 내부에서는 자체적으로 EntityCallback API를 사용하여 감사 지원을 구현하고 있다.

> 지원되는 EntityCallbacks.

| Callback | Method | Description | Order |
| --- | --- | --- | --- |
| Reactive / BeforeConvertCallback | onBeforeConvert(T entity, IndexCoordinates index) | 도메인 객체가 Elasticsearch에서 사용되는 org.springframework.data.elasticsearch.core.document.Document로 변환되기 전에 호출되는 콜백이다. 도메인 객체를 그대로 반환하거나 수정된 도메인 객체를 반환할 수 있으며, 수정된 도메인 객체는 변환된다. | Ordered.LOWEST\_PRECEDENCE |
| Reactive / AfterLoadCallback | onAfterLoad(Document document, Class<T> type, IndexCoordinates indexCoordinates) | Elasticsearch에서의 결과가 org.springframework.data.elasticsearch.core.document.Document로 읽혀진 후에 호출되는 콜백이다. Ordered.LOWEST\_PRECEDENCE에 해당하는 우선순위로 호출되며, Elasticsearch에서 읽어온 문서를 처리하거나 수정할 수 있다. | Ordered.LOWEST\_PRECEDENCE |
| Reactive / AfterConverterCallback | onAfterConvert(T entity, Document document, IndexCoordinates indexCoordinates) | Elasticsearch에서 결과 데이터를 읽어올 때, 도메인 객체가 org.springframework.data.elasticsearch.core.document.Document에서 변환된 후에 호출되는 콜백이다. | Ordered.LOWEST\_PRECEDENCE |
| Reactive / AuditingEntityCallback | onBeforeConvert(Object entity, IndexCoordinates index) | 생성되거나 수정된 감사 가능한 Entity를 표시한다. | 100 |
| Reactive / AfterSaveCallback | T onAfterSave(T entity, IndexCoordinates index) | 도메인 객체가 저장된 후 호출된다. | Ordered.LOWEST\_PRECEDENCE |

- 끝 -

reference.

[https://docs.spring.io/spring-data/elasticsearch/reference/elasticsearch/entity-callbacks.html](https://docs.spring.io/spring-data/elasticsearch/reference/elasticsearch/entity-callbacks.html)
