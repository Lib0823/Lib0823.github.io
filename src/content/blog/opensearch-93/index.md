---
title: 'OpenSearch란? (기본 사용법)'
description: 'OpenSearch는 Elastic에서 Elastic License를 v2.0으로 변경함에 따라 상업적으로 이용할 시 추가비용이 발생하게 되어 AWS에서 Elasticsearch의 오픈 소스 버전을 포크하여...'
date: 2023-08-25
category: 'Database'
tags: ['Elasticsearch', 'OpenSearch']
draft: false
---

> OpenSearch는 Elastic에서 Elastic License를 v2.0으로 변경함에 따라 상업적으로 이용할 시 추가비용이 발생하게 되어 AWS에서 Elasticsearch의 오픈 소스 버전을 포크하여 개발하고 있는 오픈 소스 프로젝트이다.

![OpenSearch란? (기본 사용법)](./opensearch-1.png)

#### OpenSearch는 Elasticsearch에서 파생된 <u>오픈 소스 검색 및 분석 엔진</u>이다.

- AWS를 주도로하는 커뮤니티 프로젝트로, Elasticsearch와의 호환성을 유지하면서 오픈 소스 커뮤니티의 협력을 받고 있다.
- Elasticsearch와 유사한 기능을 제공하며, 실시간 데이터 인덱싱, 검색, 분석 기능을 지원하고 데이터를 수평으로 확장할 수 있다.
- Apache 2.0 라이센스를 사용하여 무료로 사용할 수 있으며, AWS에서 OpenSearch 서비스를 제공하고 있다.
- 활발한 커뮤니티의 지원과 지속적인 개발로 기능과 생태계가 확장되고 있다.

### Elasticsearch VS OpenSearch 특징 비교

**1. 라이선스**

- **Elastic**: Elastic License v2.0을 사용하고 있다. 기본적으로 오픈 소스이지만, 상업적으로 사용할 경우 추가 비용이 발생할 수 있다.
- **Open**: Apache 2.0 라이선스를 사용하므로 무료로 사용 가능하며, 상업적 용도로 사용해도 상관이 없다.

**2. 개발 방향**

- **Elastic**: Elastic사가 주도하는 프로젝트로, Elastic의 비즈니스 목표와 우선순위를 반영한다.
- **Open**: AWS가 주도하는 오픈 소스 프로젝트로, AWS와 다양한 협력사, 커뮤니티 기여자 들이 개발에 참여하고 있다.

**3. AWS 통합**

- **Elastic**: AWS는 Elasticsearch를 서비스로 제공하고 있었으나, Elastic사의 라이선스 변경으로 인해 자체적으로 OpenSearch를 개발하여 서비스를 제공하고 있다.
- **Open**: AWS 환경에서의 통합과 호환성을 강조하며, AWS 서비스와의 쉬운 통합을 제공한다.

**4. 보안 기능**

- **Elastic**: 보안 기능이 일부 상용 기능으로 취급되어 추가 비용이 발생할 수 있다.
- **Open**: 기본적인 보안 기능을 무료로 제공하며, 필요에 따라 추가적인 고급 보안 기능을 활성화할 수 있다.

**5. 업데이트**

- **Elastic**: Elastic사가 주도하고 개발하는 프로젝트로 일정한 주기로 업데이트를 진행한다.
- **Open**: 다양한 커뮤니티와 협력사, AWS가 개발에 참여하고 있어 업데이트가 활발히 이루어지고 있다.

**6. 플러그인 호환성**

- **Elastic**: Elasticsearch의 라이선스와 호환되는 조건에서만 작동한다.
- **Open**: OpenSearch는 Apache 2.0 라이선스를 사용하므로 Elasticsearch 플러그인을 수정하여 OpenSearch에서 사용할 수 있다.

---

> 기본 세팅 및 사용

#### 1. Maven **설정**

```html
# OpenSearch Java 고급 REST 클라이언트를 사용하려면 해당 종속성 추가.

<dependency>
  <groupId>org.opensearch.client</groupId>
  <artifactId>opensearch-rest-high-level-client</artifactId>
  <version>2.8.0</version>
</dependency>
```

#### 2. 클라이언트 접속 계정

```
credentialsProvider.setCredentials(AuthScope.ANY,
      new UsernamePasswordCredentials("admin", "admin"));
```

#### 3. 클라이언트 build

```java
//Create a client.
    RestClientBuilder builder = RestClient.builder(new HttpHost("localhost", 9200, "https"))
      .setHttpClientConfigCallback(new RestClientBuilder.HttpClientConfigCallback() {
        @Override
        public HttpAsyncClientBuilder customizeHttpClient(HttpAsyncClientBuilder httpClientBuilder) {
          return httpClientBuilder.setDefaultCredentialsProvider(credentialsProvider);
            }
          });
    RestHighLevelClient client = new RestHighLevelClient(builder);
```

#### 4. Request생성 & 검색 요청

```
# matchQuery(”title”, “apple”) ⇒ title에 ‘apple’이 포함된 데이터 추출

//Request 생성
SearchSourceBuilder sourceBuilder = new SearchSourceBuilder();
sourceBuilder.query(QueryBuilders.matchQuery("필드명(검색조건)", "검색어"));

SearchRequest searchRequest = new SearchRequest();
searchRequest.source(sourceBuilder);

//검색 요청
SearchResponse searchResponse = client.search(searchRequest, RequestOptions.DEFAULT);
```

*※ 표준 SQL과의 명칭 비교*

![Elasticsearch VS OpenSearch 특징 비교](./elasticsearch-vs-opensearch-2.png)

reference.

[https://opensearch.org/](https://opensearch.org/)

[http://cloudinsight.net/cloud/elastic%EA%B3%BC-opensearch-%EC%98%A4%ED%94%88%EC%86%8C%EC%8A%A4%EC%99%80-%EC%98%A4%ED%94%88%EC%86%8C%EC%8A%A4/](http://cloudinsight.net/cloud/elastic%EA%B3%BC-opensearch-%EC%98%A4%ED%94%88%EC%86%8C%EC%8A%A4%EC%99%80-%EC%98%A4%ED%94%88%EC%86%8C%EC%8A%A4/)
