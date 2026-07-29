---
title: '타임리프(thymeleaf)란?'
description: '타임리프는 스프링 부트에서 공식적으로 지원하는 View 템플릿이다.'
date: 2023-08-20
category: 'Backend'
tags: ['Spring', 'Thymeleaf']
draft: false
---

![타임리프(thymeleaf)란?](./thymeleaf-1.png)

#### **Thymeleaf**

- 타임리프는 스프링 부트에서 공식적으로 지원하는 View 템플릿이다.
- JSP와 달리 Thymeleaf 문서는 html 확장자를 갖고 있어 JSP처럼 Servlet이 문서를 표현하는 방식이 아니기 때문에 서버 없이도 동작 가능하다.
- 즉, **'템플릿 엔진'**의 일종으로 html 태그에 속성을 추가해 페이지에 동적으로 값을 추가하거나 처리할 수 있다.

> 타임리프를 통해 속성을 대체할 수 있다.

**Ex>**

```
<input type="text" value="test" th:value="${item}"> 
<!--th:value 타임리프의 문법을 이용해 value 설정-->
```

- input 태그는 **th:value**를 통해 item이라는 변수에 값이 존재하면 해당 값을 세팅해준다.
- th:value가 처리되면 기존에 적혀있던 value="test"는 서버 사이드 렌더링 과정에서 항상 대체된다. (value="test"는 Thymeleaf 없이 html 파일을 브라우저로 직접 열었을 때만 보이는 값이다.)
- (= th:xxx가 붙은 부분은 **서버 사이드에서 렌더링** 되어 기존 것을 대체하고, th:xxx이 없으면 xxx 속성이 그대로 사용)

#### 템플릿 엔진?

지정된 템플릿 양식과 데이터가 합쳐져 html 문서를 출력하는 소프트웨어.

- 서버에서 DB 또는 API 등을 통해 가져온 데이터를 미리 정의된 템플릿에 넣어 html을 그려내 클라이언트에 전달해준다.
- 즉, html 코드에서 고정적으로 사용되는 부분은 템플릿으로 만들어두고 동적으로 생성되는 부분만 템플릿 특정 장소에 끼워넣는 방식으로 동작할 수 있게 해준다.

**장점**

- 코드 양 ↓, 재사용성 ↑, 유지보수에 용이
