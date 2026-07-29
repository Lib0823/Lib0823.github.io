---
title: '애플리케이션 배포 시 주의해야 하는 코드'
description: '분명 로컬 환경에서는 문제없었는데 서버에 올라가면 버그가 생긴 경우가 한 번쯤 있을 것이다..'
date: 2025-03-28
category: 'Language'
tags: ['Java', 'system property']
draft: false
---

> 분명 로컬 환경에서는 문제없었는데 서버에 올라가면 버그가 생긴 경우가 한 번쯤 있을 것이다..

![애플리케이션 배포 시 주의해야 하는 코드](./image-1.png)

IDE를 통해 로컬에서 실행하는 것과 서버에 배포하여 WAS로 실행하는 것에는 환경적인 차이로 다르게 동작하기도 하고 한 쪽에서 되는게 다른 쪽에서는 안되는 경우도 종종 발생한다.

<u>실제 Java기반 서비스를 개발/운영하며 이러한 문제로 고생한 경험을 바탕으로 주의해야 될 부분들을 정리한 내용이</u>다.

### 1. 해시 알고리즘

MessageDigest를 사용하여 getInstance로 특정 알고리즘을 사용하여 해시값을 생성하는 경우

```
// 이슈 발생 가능
MessageDigest digest = MessageDigest.getInstance("SHA256");

// 안정적인 코드
MessageDigest digest = MessageDigest.getInstance("SHA-256");
```

**주의 사항 :**

- 로컬 환경에서는 알고리즘을 “SHA256”으로 사용해도 동작할 수 있지만 서버에서는 인식하지 못하기 때문에 “SHA-256”으로 사용해야 한다.

**원인 :**

- Java의 MessageDigest에서 지원하는 표준 알고리즘 명칭은 "SHA-???”인데 특정 자바 버전에서 별칭으로 “SHA???”을 사용하기도 하며 provider 등의 버전 차이로 발생하기도 한다.

---

### 2. FileSystem(Disk)에 파일 저장/조회

보통 DB에 데이터를 저장하지만 파일 업로드 기능 등을 위해 파일 시스템에 저장하는 경우

```
// 이슈 발생 가능
String content = "Hello, Java!";
Path path = Paths.get("/test/example.txt");
Files.write(path, content.getBytes());

// 안정적인 코드
String content = "Cross-platform!";
String home = System.getProperty("user.home");  // 운영체제별 홈 디렉토리 자동 인식
Path path = Paths.get(home, "test", "example.txt");
Files.write(path, content.getBytes());
```

**주의 사항 :**

- 로컬 PC의 경로와 애플리케이션 배포 시 서버의 경로가 다르기 때문에 이 점을 고려하여 system property를 사용하거나 동적으로 경로를 잘 작성해야 한다.

**원인 :**

- 로컬 환경과 서버의 운영체제나 배포 위치 등의 차이로 인해 경로를 정상적으로 인식하지 못하는 현상이 발생할 수 있다.

---

### 3. 한글 인코딩(Encoding) 깨짐

종종 필요에 따라 코드 일부를 한글로 작성했을 때 한글이 깨지는 경우

```
// 이슈 발생 가능
String input = "한글입니다.";
byte[] bytes = input.getBytes();

// 안정적인 코드
String input = "한글입니다.";
byte[] bytes = input.getBytes(StandardCharsets.UTF_8);
```

**주의 사항 :**

- 로컬에서는 UTF-8이 기본 인코딩이지만, 서버(JVM) 설정에 따라 MS949, ISO-8859-1 등으로 인코딩되어 깨질 수 있다.
- 특히 파일 입출력, 외부 API 호출, DB 저장 시 인코딩 문제가 빈번하게 발생한다.

**원인 :**

- JVM 기본 charset이 OS 환경에 따라 달라질 수 있다. `System.getProperty("file.encoding")` 확인

---

### 4. TimeZone / Locale 다르게 동작함

날짜, 시간 등을 처리하는 로직에서 실제 시간과 맞지 않게 동작하는 경우

```
// 안정적인 코드
TimeZone.setDefault(TimeZone.getTimeZone("Asia/Seoul"));
Locale.setDefault(Locale.KOREA);
```

**주의 사항 :**

- 날짜를 DB에 저장하거나 포맷할 때 반드시 TimeZone을 명시하는 것이 안전하다.
- 특히 <u>로그인 세션 만료 시간</u>이나 <u>스케줄러 동작 시각</u>이 어긋나는 경우가 많이 발생한다.

**원인 :**

- 로컬은 Asia/Seoul로 설정되어 있지만 서버는 UTC로 설정되어 날짜/시간이 다르게 저장된다.
- 날짜 포맷이 영어가 아닌 한국어로 출력되어 API 응답 형식이 달라진다.

> 이 외에도 다양한 경우가 있지만 가장 흔하게 발생하며 실제 경험한 내용을 위주로 정리하였습니다.
