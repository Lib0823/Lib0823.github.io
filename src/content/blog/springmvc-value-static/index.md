---
title: '@Value로 Static 변수에 값 주입할 수 있을까?'
description: 'Spring에서 @Value 어노테이션은 application.properties와 같이 프로퍼티에 정의된 값을 주입하는데 사용된다.'
date: 2024-12-10
category: 'Backend'
tags: ['Spring', 'Value', 'Spring Framework']
draft: false
---

> Spring에서 @Value 어노테이션은 application.properties와 같이 프로퍼티에 정의된 값을 주입하는데 사용된다.

![@Value로 Static 변수에 값 주입할 수 있을까?](./value-static-1.png)

#### @Value 어노테이션 사용 방법

.properties

```
app.name=MyApplication
app.version=1.0.0
```

.java

```java
@Component
public class AppConfig {
    @Value("${app.name:default}")
    private String appName;

    @Value("${app.version:0}")
    private String appVersion;
}
```

보통 이렇게 @Value 형식에 맞춰 properties 값을 주입하여 주면 간단히 사용할 수 있지만 한 가지 주의할 점이 있다.

@Value로 값을 주입할 <u>변수가 static으로 선언하면 값을 주입할 수 없어 변수는 Null 값을 가지게 된다</u>.

### 왜 static 변수에는 값을 주입할 수 없을까?

원인 => *Spring의 라이프 사이클과 static 필드의 특성 때문이다.*

**1. Spring의 의존성 주입 방식**

• @Value는 Spring 컨테이너가 빈의 인스턴스를 생성하고 난 뒤, 해당 인스턴스의 필드에 값을 주입한다.

• static 필드는 클래스 레벨에서 관리되며 특정 인스턴스에 속하지 않는다.

• 즉, Spring이 빈을 생성해도 static 필드는 컨테이너가 관리하는 범위를 벗어나 있다.

**2. static 필드의 특성**

• static 필드는 클래스 로드 시점에 메모리에 할당되며, Spring 컨테이너와는 별개로 존재한다.

• Spring 컨테이너는 인스턴스 수준에서 동작하기 때문에 @Value와 같은 주입 메커니즘이 static 필드에 적용되지 않는다.

이러한 이유로 static 변수에 직접적으로 값을 주입할 수는 없다. 그렇기 때문에 setter나 Environment를 활용하여 값을 주입할 수 있다.

#### 해결 방법1 : setter에 추가

```java
private static String SSO_YN;

    @Value("${sso.yn:N}")
    public void setSsoYn(String ssoYn) {
        SSO_YN = ssoYn;
    }
```

해결 방법2 : Spring의 Environment 객체 활용

```java
@Configuration
public class Config {
    private static String appName;

    @Autowired
    public void setEnvironment(Environment environment) {
        appName = environment.getProperty("app.name");
    }
}
```

- 끝 -
