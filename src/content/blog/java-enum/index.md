---
title: 'enum'
description: '흔히 상수를 정의하는 final static ~ 과 같은 방식은 다양한 문제가 발생할 수 있기 때문에 그런 문제점을 보완하기 위해 자바 5버전부터 추가된 것이다.'
date: 2023-08-20
category: 'Language'
tags: ['Java']
draft: false
---

#### enum이란?

흔히 상수를 정의하는 final static ~ 과 같은 방식은 다양한 문제가 발생할 수 있기 때문에 그런 문제점을 보완하기 위해 자바 1.5버전부터 추가된 것이다.

Enum은 열거형이라고 불리며, 서로 연관된 상수들의 집합을 의미한다.

**장점**

1. 코드가 단순해지며, 가독성이 좋다.
2. 인스턴스 생성과 상속을 방지하여 상수값의 타입안정성이 보장된다.
3. enum class를 사용해 새로운 상수들의 타입을 정의함으로 정의한 타입이외의 타입을 가진 데이터 값을 컴파일시 체크한다.
4. 키워드 enum을 사용하기 때문에 구현의 의도가 열거임을 분명하게 알 수 있다.

Ex >

```java
package EnumExample;
public class EnumExample {

	// 기존에 상수를 정의하는 방법
	public static final String MALE = "MALE";
	public static final String FEMALE = "FEMALE";
	public static void main(String[] args) {

		String gender1;
		gender1 = EnumExample.MALE;
		gender1 = EnumExample.FEMALE;

		// MALE, FEMALE이 아닌 상수 값이 할당 될 때 컴파일시 에러가 나지 않음. -> 문제점 발생.
		gender1 = "boy";
		Gender gender2;
		gender2 = Gender.MALE;
		gender2 = Gender.FEMALE;
		
		// 컴파일 시 의도하지 않는 상수 값을 체크할 수 있음. Enum으로 정의한 상수값만 할당 받을 수 있음.
		gender2 = "boy";
	}
}

// enum class를 이용해 Gender라는 새로운 상수들의 타입을 정의한다.
enum Gender {
	MALE,
	FEMALE;
}
```

> 위의 코드에서 보면 gender1은 “boy”라는 값이 잘못 할당되었을 경우 따로 에러가 발생되지 않고 런타임 문제가 발생하게 된다.

> 하지만 밑에서 Gender로 정의한 Enum을 사용한 gender2는 “boy”라는 값을 잘못 할당했을 때 컴파일 에러를 발생 시켜 사전에 체크할 수 있게 된다.

<u>간단한 사용</u>

```java
// enum class
public enum UserRole {
    ADMIN,
    USER
}

// 다른 클래스에서 객체로 생성하여 사용
private UserRole role = UserRole.USER;
```

<u>Exception Class를 따로 만들어두고 객체를 생성해서 생성자를 타겟 해 ExceptionHandler의 역할을 대신함.</u>

```java
// Service Class
@Transactional
public User join(String userName, String password){
    // 입력된 userName이 DB에 저장되어있다면 Error발생
    userEntityRepository.findByUserName(userName).ifPresent(it -> {
        throw new SnsApplicationException(ErrorCode.DUPLICATED_USER_NAME, String.format("%s is duplicated", userName));
    });
    // 회원가입 진행 = user를 등록
    UserEntity userEntity = userEntityRepository.save(UserEntity.of(userName, encoder.encode(password)));
    return User.fromEntity(userEntity);
}

// Exception Class
public class SnsApplicationException extends RuntimeException{
    private ErrorCode errorCode;
    private String message;

    public SnsApplicationException(ErrorCode errorCode){
        this.errorCode = errorCode;
        this.message = null;
    }

    public SnsApplicationException(ErrorCode errorCode, String message){
        this.errorCode = errorCode;
        this.message = message;
    }
    @Override
    public String getMessage() {
        if(message == null){
            return errorCode.getMessage();
        }
        return String.format("%s, %s", errorCode.getMessage(), message);
    }
}

// Enum Class
public enum ErrorCode {

    DUPLICATED_USER_NAME(HttpStatus.CONFLICT, "User name is duplicated"),
    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "User not founded"),
    INVALID_PASSWORD(HttpStatus.UNAUTHORIZED, "Password is invalid"),
    INVALID_TOKEN(HttpStatus.UNAUTHORIZED, "Token is invalid"),
    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "Internal server error")
    ;
    private HttpStatus status;
    private String message;
}
```

[[Java] enum 이란?](https://limkydev.tistory.com/50)
