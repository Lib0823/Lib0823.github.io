---
title: '에러 노트'
description: '에러 코드'
date: 2023-08-20
category: 'Backend'
tags: ['Spring', 'error', 'Debugging', 'spring boot']
draft: false
---

![에러 노트](./image-1.png)

### SpringBoot 개발 중 발생한 에러를 정리하는 곳입니다.

#### Mybatis Mapping 에러

**에러 코드**

*- IndexOutOfBoundsException*

**발생 원인**

*- mybatis의 select 데이터랑 resultType 클래스의 field가 제대로 매핑되지 않음.*

**해결 방법**

*- <u>select 데이터 이름과 dto 클래스 필드명을 일치시켜야 한다. 하나라도 맞지 않으면 안됨.</u>*

#### Dto 캐스팅 에러

**에러 코드**

*- nested exception is java.lang.ClassCastException: java.lang.String cannot be cast to kr.co.weeds.wbs.board.model.dto.PrivacyContentDto] with root cause*

**발생 원인**

*- String -> Dto 캐스팅 문제 발생*

**해결 방법**

*- <u>정확한 이유는 모르겠지만 Controller에서 Service 메서드를 호출해 반환받는 값을 바로 return해주니 형변환 문제가 발생했다. => 해결 방법은 Service Logic의 반환값을 바로 return 하지 말고 객체로 받아서 return하면 된다.</u>*

#### SpringBoot / Jdk 버전 에러

**에러 코드**

*- No matching variant of org.springframework.boot:spring-boot-gradle-plugin:3.0.1 was found. The consumer was configured to find a runtime of a library compatible with Java 11, packaged as a jar, and its dependencies declared externally, as well as attribute 'org.gradle.plugin.api-version' with value '7.6' but:*

**발생 원인**

*- Spring Boot 3.0.x부터는 jdk-17 이상의 버전을 사용해야 함. ‘[https://start.spring.io/](https://start.spring.io/)’에서 변경 가능하다!!*

**해결 방법**

*-<u>build.gradle의 스프링 부트 버전을 3.0.1에서 → 2.7.7로 변경 후 실행</u>*

#### Jvm 버전 에러

**에러 코드**

*- Cause: error: invalid source release: 17*

**발생 원인**

*- Java 버전 변경 시 발생하는 오류*

**해결 방법**

*-<u>JVM 버전 명시하는 부분들을 찾아서 확인 및 변경하면 된다 File > Project Structure • Project > SDK • Project > Language level • Module > Sources > Language level • Module > Dependencies > Module SDK File > Settings • Build, Execution, Deployment > Compiler > Java Compiler > Project bytecode version • Build, Execution, Deployment > Build Tools > Gradle > Gradle JVM</u>*

#### object mapper 에러

**에러 코드**

*- ObjectMapper 클래스 사용 불가*

**발생 원인**

*- dependencies에 해당 라이브러리 추가(implementation)해주지 않음*

**해결 방법**

*- <u>build.gradle파일의 dependencies안에 implementation 'com.fasterxml.jackson.core:jackson-databind:2.12.3' 해당 코드 추가</u>*

#### Aspect 에러

**에러 코드**

*- @Aspect (aop) Annotation 사용 불가*

**발생 원인**

*- dependencies에 해당 라이브러리 추가(implementation)해주지 않음*

**해결 방법**

*- <u>build.gradle파일의 dependencies안에 implementation 'org.springframework.boot:spring-boot-starter-aop' 해당 코드 추가</u>*

#### 한글 인코딩 에러

**에러 코드**

*- error: unmappable character (0xED) for encoding x-windows-949*

**발생 원인**

*- 한글 인코딩 문제 (windows의 기본 인코딩은 949로 되어있음)*

**해결 방법**

*- <u>1. intellij의 상단메뉴에서 File → Setting → File encodings의 encoding을 모두 UTF-8로 맞춤 2. intellij의 상단메뉴에서 Help → Edit Custom VM Options 파일의 마지막에 -Dfile.encoding=UTF-8 추가</u>*

#### strategy 에러

**에러 코드**

*- Failed to start bean 'documentationPluginsBootstrapper'; nested exception is java.lang.NullPointerException*

**발생 원인**

*- Spring boot 2.6버전 이후에 spring.mvc.pathmatch.matching-strategy 값이 ant\_path\_matcher에서 path\_pattern\_parser로 변경되면서 몇몇 라이브러리(swagger포함)에 오류가 발생한다고 한다.*

**해결 방법**

*- <u>src → main → resources → `application.properties` 파일에 ‘spring.mvc.pathmatch.matching-strategy = ANT\_PATH\_MATCHER’ 추가하면 됨.</u>*

#### lombok 에러

**에러 코드**

*- Lombok Annotation 사용 불가*

**발생 원인**

*- annotation Processor 미설정*

**해결 방법**

*- <u>1. Preferences -> Build,Execution,Deployment -> Compiler -> Annotation Processors설정에서 Enable Annotation processing 체크박스를 활성화 2. build.gradle 파일에서 dependencies{annotationProcessor('org.projectlombok:lombok:')} 추가</u>*

#### stack overflow 에러

**에러 코드**

*- StackOverflowError (JPA)*

**발생 원인**

*- ToString 으로 결과를 찍어줄 때 넘침.*

**해결 방법**

*- <u>다른 Entity를 참조한 속성에게 @ToString.Exclude 어노테이션 지정하여 ToString에서 제외해주면 된다.</u>*

#### db 접속 에러

**에러 코드**

*- HibernateException : Access to DialectResolutionInfo cannot be null when ‘hibernate.dialect’ not set ~*

**발생 원인**

*- DB(mysql)접속 문제로 발생하는 에러*

**해결 방법**

*- <u>Terminal창에서 MySQL서버 재실행</u>*

#### lazy 로딩 에러

**에러 코드**

*- LazyInitializationException: failed to lazily ~ - no Session*

**발생 원인**

*- Lazy로딩이 제대로 이루어지지 않음*

**해결 방법**

*- <u>@Transactional어노테이션 붙여줌</u>*

#### entity 연관관계 에러

**에러 코드**

*- object references on unsaved transient instance - save the transient instance before ~*

**발생 원인**

*- 값(객체) 들이 저장되지 않은 상태에서 연관관계(set~)를 지정해 줄 수 없다.*

**해결 방법**

*- <u>값을 저장할 Entity Class에서 연관관계를 지정한 해당 속성에 cascade옵션 부여 ex> @ManyToOne(cascade = CascadeType.PERSIST) ⇒ 해당 Entity에 값이 insert될 때 관계를 가지는 Entity도 같이 insert시킨다.</u>*

#### applicationd running 에러

**에러 코드**

*- • Process finished with exit code 0 (스프링부트 실행 시 서버가 돌지 않고 종료됨)*

**발생 원인**

*- Application이 실행은 되었는데 톰켓에 올라가지 못하여 발생.*

**해결 방법**

*- <u>추가 → dependencies { implementation 'org.springframework.boot:spring-boot-starter-web' }</u>*

#### spring annotation 에러

**에러 코드**

*- @Mapping (GetMapping, PostMapping ~)어노테이션 import가 안됨.*

**발생 원인**

*- dependencies에 해당 라이브러리 추가(implementation)해주지 않음*

**해결 방법**

*- <u>build.gradle파일의 dependencies안에 implementation 'org.springframework.boot:spring-boot-starter-web' 해당 코드 추가</u>*

#### view 페이지 에러

**에러 코드**

*- Controller에서 view를 @Mapping했을 때 view페이지를 찾을 수 없음.*

**발생 원인**

*- dependencies에 해당 라이브러리 추가(implementation)해주지 않음*

**해결 방법**

*- <u>build.gradle파일의 dependencies안에 implementation 'org.springframework.boot:spring-boot-starter-thymeleaf' 해당 코드 추가</u>*

#### debug 모드 에러

**에러 코드**

*- To display the conditions report re-run your application with 'debug' enabled*

**발생 원인**

*- 설정(configuration)문제*

**해결 방법**

*- <u>run -> edit configuration에 들어가서 enable debug output 를 체크하고 저장한 뒤 다시 실행</u>*

#### jpa url 에러

**에러 코드**

*- org.springframework.boot.autoconfigure.jdbc.DataSourceProperties$DataSourceBeanCreationException: Failed to determine a suitable driver class*

**발생 원인**

*- JPA에서 DB에 자동으로 연결하는데 연결할 url이 없다.*

**해결 방법**

*- <u>Application파일에 @SpringBootApplication(exclude = DataSourceAutoConfiguration.class) 추가</u>*
