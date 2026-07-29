---
title: 'Client 구현을 통한 사용 방법'
description: 'Elasticsearch 클라이언트를 직접 사용하여 클러스터 작업을 수행할 수 있지만 SpringDataElasticsearch 클라이언트를 사용하면 DataAccess, ObjectMapping,...'
date: 2023-12-16
category: 'Backend'
tags: ['Spring', 'Elasticsearch', 'spring data', 'spring data elasticsearch']
draft: false
---

> Elasticsearch 클라이언트를 직접 사용하여 클러스터 작업을 수행할 수 있지만 SpringDataElasticsearch 클라이언트를 사용하면 DataAccess, ObjectMapping, Annotation, QueryDSL, Transaction 등을 이용하여 보다 쉽고 편리하게 Elasticsearch를 사용할 수 있게 도와준다.

![Client 구현을 통한 사용 방법](./client-1.png)

## Imperative Rest Client (명령형 REST 클라이언트)

전통적인 동기식 프로그래밍 방식을 따르며, 요청을 보내고 응답을 기다리는 동안 블로킹되는 방식을 동작한다.

Ex> RestTemplate, WebClient 등,,

명령형 (비반응형) 클라이언트를 사용하기 위한 Bean 구성

```java
@Configuration
public class MyClientConfig extends ElasticsearchConfiguration {

	@Override
	public ClientConfiguration clientConfiguration() {
		return ClientConfiguration.builder()           
			.connectedTo("localhost:9200")
			.build();
	}
}
```

> ElasticsearchConfiguration 클래스를 사용하면 jsonpMapper() 또는 transportOptions() 메소드 등을 재정의하여 추가 구성이 가능하다

ElasticsearchConfiguration의 ClientConfiguration Bean을 구성한 후 Spring 구성 요소에 주입 가능한 Bean.

```
ElasticsearchOperations operations;      

@Autowired
ElasticsearchClient elasticsearchClient; 

@Autowired
RestClient restClient;                   

@Autowired
JsonpMapper jsonpMapper;
```

*기본적으로 Elasticsearch 클러스터와 상호작용 하려면 <u>ElasticsearchOperations</u>을 사용해야 한다.*

(Repository를 사용할 때 이 인스턴스도 내부적으로 사용됨)

## Reactive Rest Client (반응형 REST 클라이언트)

반응성 프로그래밍 패러다임을 따르며, 비동기식 프로그래밍 방식으로 동작한다.

요청을 보내고 응답을 기다리는 동안 블로킹되지 않으며, 비동기적으로 다른 작업을 수행할 수 있다.

반응형 스택으로 작업하기 위해선 다른 클래스를 상속 받아 Bean을 구성해야 한다.

```java
@Configuration
public class MyClientConfig extends ReactiveElasticsearchConfiguration {

	@Override
	public ClientConfiguration clientConfiguration() {
		return ClientConfiguration.builder()           
			.connectedTo("localhost:9200")
			.build();
	}
}
```

> ReactiveElasticsearchConfiguration 클래스를 사용하면 jsonpMapper() 또는 transportOptions() 메소드 등을 재정의하여 추가 구성이 가능하다

ReactiveElasticsearchConfiguration의 ClientConfiguration Bean을 구성한 후 Spring 구성 요소에 주입 가능한 Bean.

```
@Autowired
ReactiveElasticsearchOperations operations;      

@Autowired
ReactiveElasticsearchClient elasticsearchClient; 

@Autowired
RestClient restClient;                           

@Autowired
JsonpMapper jsonpMapper;
```

*기본적으로 Elasticsearch 클러스터와 상호작용 하려면 <u>ReactiveElasticsearchOperations</u>을 사용해야 한다.*

(Repository를 사용할 때 이 인스턴스도 내부적으로 사용됨)

## Client Configuration (클라이언트 구성)

REST 클라이언트의 동작을 조정하기 위한 설정을 포함한다.

Ex> 연결 시간 초과, 요청 및 응답 인터셉터, 프록시 설정 등.

클라이언트 동작은 SSL, 연결 및 소켓 시간 초과, 헤더 및 기타 매개변수에 대한 옵션을 설정할 수 있는 ClientConfiguration을 통해 변경할 수 있다.

```
HttpHeaders httpHeaders = new HttpHeaders();
httpHeaders.add("some-header", "on every request") // 헤더 정의                   

ClientConfiguration clientConfiguration = ClientConfiguration.builder() // Builder Pattern을 사용하여 옵션 추가
  .connectedTo("localhost:9200", "localhost:9291")                      
  .usingSsl() // SSL 활성화 선택                     
  .withProxy("localhost:8888") // 프록시                                        
  .withPathPrefix("ela") // 접두사                        
  .withConnectTimeout(Duration.ofSeconds(5)) // 연결 시간                         
  .withSocketTimeout(Duration.ofSeconds(3)) // 소켓 시간                
  .withDefaultHeaders(defaultHeaders) // 헤더                                   
  .withBasicAuth(username, password) // 기본 인증                                    
  .withHeaders(() -> { // Elasticsearch로 요청이 전송되기 전에 호출되는 헤더 설정 이벤트 생성                            
    HttpHeaders headers = new HttpHeaders();
    headers.add("currentTime", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
    return headers;
  })
  .withClientConfigurer( // 생성된 ClientConfiguration을 여러 번 추가할 수 있다.                                                 
    ElasticsearchClientConfigurationCallback.from(clientBuilder -> {
  	  // ...
      return clientBuilder;
  	}))
  . // ... other options
  .build();
```

> 위와 같이 **헤더 공급자**를 추가하면, 시간이 지남에 따라 변할 수 있는 헤더를 주입하는 것이 가능해진다.
> 주로 인증 <u>JWT 토큰과 같이 동적으로 변경되는 헤더 값을 삽입</u>하는데 사용되는데, 이때 공급자 함수는 비동기적이며 블로킹되지 않는 형태로 작성되어야 한다.

### ※ Client configuration callbacks (클라이언트 구성 콜백)

클라이언트의 동작을 구성하기 위한 콜백 매커니즘이다.

클라이언트의 특정 동작에 대한 콜백을 등록하거나 클라이언트의 동적인 구성을 변경하기 위해 콜백을 사용할 수 있다.

ClientConfiguration 클래스는 클라이언트를 구성하는 데 필요한 매개변수를 제공하는데, withClientConfigurer(ClientConfigurationCallback<?>) 메소드를 사용하여 콜백 함수를 추가해 구성을 추가할 수 있다.

**RestClient**

Elasticsearch를 구성하는데 사용할 수 있는 org.elasticsearch.client.RestClientBuilder를 제공한다.

```
ClientConfiguration.builder()
    .withClientConfigurer(ElasticsearchClients.ElasticsearchRestClientConfigurationCallback.from(restClientBuilder -> {
        // configure the Elasticsearch RestClient
        return restClientBuilder;
    }))
    .build();
```

**HttpAsyncClient**

HttpClient를 구성하는데 사용할 수 있는 org.apache.http.impl.nio.client.HttpAsyncClientBuilder를 제공한다.

```
ClientConfiguration.builder()
    .withClientConfigurer(ElasticsearchClients.ElasticsearchHttpClientConfigurationCallback.from(httpAsyncClientBuilder -> {
        // configure the HttpAsyncClient
        return httpAsyncClientBuilder;
    }))
    .build();
```

## Client Logging (클라이언트 로깅)

클라이언트가 수행하는 작업 및 발생하는 이벤트를 기록하는 메커니즘이다.

로깅을 통해 주로 클라이언트의 동작을 추적하고 문제를 해결하며 디버깅, 성능 분석, 모니터링 등을 수행할 수 있다.

Java REST 클라이언트는 Apache Async Http 와 동일한 로깅 라이브러리를 사용한다. (Apache Commons Logging)

> 로그 활성화 하기..!

**Trace Logs**

**1**. Gradle 설정 추가

```
dependencies {
    implementation('org.slf4j:slf4j-api:1.8.0-beta2')
    implementation('ch.qos.logback:logback-classic:1.3.0-alpha4')
    implementation('org.slf4j:jcl-over-slf4j:1.8.0-beta2')
}
```

**2**. commons-logging.jar 제외

```
dependencies {
    configurations.all {
        exclude group: "commons-logging", module: "commons-logging"
    }
}
```

**3**. Logback 구성에 Trace Logger 추가

```html
<logger name="tracer" level="TRACE" additivity="false">
    <appender-ref ref="your_appender_block_name" />
</logger>
```

**RestClient Debug Logs**

RestClient 클래스에 대한 Debug Logger 활성화

```html
<logger name="org.elasticsearch.client.RestClient" level="DEBUG" additivity="false">
    <appender-ref ref="your_appender_block_name" />
</logger>
```

*- 끝 -*

reference.

[https://docs.spring.io/spring-data/elasticsearch/reference/elasticsearch/clients.html](https://docs.spring.io/spring-data/elasticsearch/reference/elasticsearch/clients.html)
