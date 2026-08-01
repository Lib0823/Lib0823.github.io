---
title: 'Bean & POJO (Plain Old Java Object)'
description: '스프링 컨테이너(IoC)에 의해 관리되는 자바 객체(POJO)를 빈(Bean)이라고 한다.'
date: 2023-08-19
category: 'Backend'
tags: ['Spring', 'pojo', 'bean']
draft: false
---

#### **스프링 빈이란?**

스프링 컨테이너(IoC)에 의해 관리되는 자바 객체(POJO)를 빈(Bean)이라고 한다.

- 스프링 컨테이너는 스프링 빈의 생명 주기를 관리하며, 생성된 스프링 빈들에게 추가적인 기능을 제공하는 역할을 한다. IoC와 DI의 원리가 스프링 컨테이너에 적용된다.

#### **Component**

컴포넌트 스캔은 @Component를 명시하여 빈을 추가하는 방법이다. 클래스 위에 @Component를 붙이면 스프링이 알아서 스프링 컨테이너에 빈을 등록한다.

### **컴포넌트 스캔의 대상**

@Component 외에 @Controller, @Service, @Repository, @Configuration는 @Component의 상속을 받고 있으므로 모두 컴포넌트 스캔의 대상이다.

- @Controller
  - 스프링 MVC 컨트롤러로 인식된다.
- @Repository
  - 스프링 데이터 접근 계층으로 인식하고 해당 계층에서 발생하는 예외는 모두 DataAccessException으로 변환한다.
- @Service
  - 특별한 처리는 하지 않으나, 개발자들이 핵심 비즈니스 계층을 인식하는데 도움을 준다.
- @Configuration
  - 스프링 설정 정보로 인식하고 스프링 빈이 싱글톤을 유지하도록 추가 처리를 한다. (물론 스프링 빈 스코프가 싱글톤이 아니라면 추가 처리를 하지 않음.)

#### **@Bean vs @Component**

- @Bean
  - 개발자가 컨트롤이 불가능한 외부 라이브러리들을 Bean으로 등록하고 싶은 경우에 사용된다.
  - 메소드 또는 어노테이션 단위에 붙일 수 있다.
- @Component
  - 개발자가 직접 컨트롤이 가능한 클래스들의 경우에 사용된다.
  - 클래스 또는 인터페이스 단위에 붙일 수 있다.

#### POJO (Plain Old Java Object)

**POJO**란 Plain Old Java Object의 약자로 다른 클래스나 인터페이스를 상속/implements 받아 메서드가 추가된 클래스가 아닌 일반적으로 우리가 알고 있는 getter, setter 같이 기본적인 기능만 가진 자바 객체를 말한다.

```java
public class User {
    private int id;
    private String name;
    private String email;

    public int getId() {
    	return id;
    }
    public String getName() {
    	return name;
    }
    public String getEmail() {
    	return email;
    }

    public void setId(int id) {
    	this.id = id;
    }
    public void setName(String name) {
    	this.name = name;
    }
    public void setEmail(String email) {
    	this.email = email;
    }
}
```

- 자바를 이용해 비즈니스 서비스를 개발할 때 비즈니스 로직 뿐만 아니라 트랜잭션, 보안 등 로우레벨의 로직까지 작성해야하는 부담감을 없애고자 EJB(Enterprise Java Beans)를 만들게 되었다.
- EJB를 사용하면서 로우레벨의 로직 개발에 대한 수고를 덜 수 있었지만, 한 두가지 기능을 사용하기 위해 거대한 EJB를 상속받거나 implements 하게 되어 가벼운 서비스조차도 무겁게 만들어졌고, 다른 기능으로 대체하기 위해선 전체 코드를 수정해야 하는 문제점이 발생하였다.
- JAVA의 기본 개념인 객체지향에 집중하고, 특정 클래스나 라이브러리에 종속되지 않는 POJO 구성으로 코드를 작성한다면 이런 문제점을 해결할 수 있을 것이라고 생각했다.
- 따라서 Spring은 POJO 방식을 기반으로 한 웹 프레임워크이고, **IoC와 DI, AOP** 등 Spring의 주요 기술을 활용해 POJO 기반의 구성을 이루게 되었다.

#### EX>

- POJO 기반으로 작성한 예제이다.

```java
@Component
public class ExampleListener {

  @JmsListener(destination = "myDestination")
  public void processOrder(String message) {
    System.out.println(message);
  }
}
```

위 예제는 JmsListener를 상속받지 않고 어노테이션을 통해 객체를 주입받은 상황이다.

이런식으로 코드를 작성하게 되면 해당 클래스와의 결합도가 낮아져 다른 솔루션으로 변경하고 할 경우 @JmsListener를 @(다른 솔루션)으로 코드를 수정만 하면 가능하므로 유지 보수에 있어 좀 더 유용하게 활용할 수 있다.
