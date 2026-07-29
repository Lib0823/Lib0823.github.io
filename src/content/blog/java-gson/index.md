---
title: 'Gson이란?'
description: 'Gson은 Java 객체를 Json 형식으로 변환하는데 사용할 수 있는 Java 라이브러리 이다.'
date: 2023-09-24
category: 'Language'
tags: ['Java', 'JSON', 'gson']
draft: false
---

> Gson은 Java 객체를 Json 형식으로 변환하는데 사용할 수 있는 Java 라이브러리 이다.

![Gson이란?](./gson-1.png)

Gson은 Google에서 제공하는 java용 Json 라이브러리로, Java 객체를 Json 형식으로 직렬화(serialize), Json 형식의 데이터를 Java 객체로 역직렬화(deserialize)를 간단하게 할 수 있게 해준다.

*Gson을 사용하기 위해서는 라이브러리를 추가해줘야 한다.*

```groovy
# Gradle
dependencies {
  implementation 'com.google.code.gson:gson:2.10.1'
}

# Maven
<dependency>
  <groupId>com.google.code.gson</groupId>
  <artifactId>gson</artifactId>
  <version>2.10.1</version>
</dependency>
```

#### Java 객체 -> Json 형식 직렬화

```java
import com.google.gson.Gson;

public class Main {
    public static void main(String[] args) {
        // 직렬화할 객체 생성
        Person person = new Person("John Doe", 30);

        // Gson 객체 생성
        Gson gson = new Gson();

        // 객체를 JSON 문자열로 직렬화
        String json = gson.toJson(person);

        // JSON 출력
        System.out.println(json);
    }
}

// 직렬화할 클래스 정의
class Person {
    private String name;
    private int age;

    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }
}
```

#### Json 형식 -> Java 객체 역직렬화

```java
import com.google.gson.Gson;

public class Main {
    public static void main(String[] args) {
        // 역직렬화할 JSON 문자열
        String json = "{\"name\":\"John Doe\",\"age\":30}";

        // Gson 객체 생성
        Gson gson = new Gson();

        // JSON 문자열을 객체로 역직렬화
        Person person = gson.fromJson(json, Person.class);

        // 역직렬화된 객체 사용
        System.out.println("이름: " + person.getName());
        System.out.println("나이: " + person.getAge());
    }
}

// 역직렬화할 클래스 정의
class Person {
    private String name;
    private int age;

    // Getter 메서드
    public String getName() {
        return name;
    }

    public int getAge() {
        return age;
    }
}
```

reference.

[https://github.com/google/gson](https://github.com/google/gson)
