---
title: 'JwtToken 사용하기'
description: 'Jwt Token 로그인'
date: 2023-09-10
category: 'Backend'
tags: ['Spring', 'Spring Security', 'jwt']
draft: false
---

![JwtToken 사용하기](./jwttoken-1.png)

> Jwt Token 로그인

#### **Use Case Specification** (명세서)

1. 우선 login, join을 제외한 페이지를 전부 막는다.
2. 사용자가 login하면 id, pw를 검증하고 Token을 생성하여 발급한다.
3. 발급 받은 Token 권한에 따라 해당 페이지를 접근할 수 있다.

[https://github.com/Lib0823/SpringSecurity-JWT\_study.git](https://github.com/Lib0823/SpringSecurity-JWT_study.git)

**[build.gradle]**

```groovy
implementation 'io.jsonwebtoken:jjwt:0.9.1'
implementation 'javax.xml.bind:jaxb-api:2.3.0'
implementation 'org.springframework.boot:spring-boot-starter-security'
```

### SourceCode & Explanation

> **configuration**

### AuthenticationConfig

- Security 사용을 선언 및 설정
- 모든 요청을 받아 필터링하는 securityFilterChain을 세팅하여 등록함

```java
package com.example.test.configuration;
import com.example.test.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
@Configuration // 설정파일 선언
@EnableWebSecurity // security사용 선언
@RequiredArgsConstructor
public class AuthenticationConfig {

    // @EnableWebSecurity를 선언함으로 써 모든 api 요청을 security가 관리하게 됨.
    private final UserService userService;

    @Value("${jwt.secret}")
    private String secretKey;

    // api 요청이 들어오면 검사하는 security의 FilterChain설정.
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        return httpSecurity
                .httpBasic().disable()
                .csrf().disable()
                .cors().and()
                .authorizeHttpRequests()
                .requestMatchers("/api/v1/users/login", "/api/v1/users/join").permitAll() // 인증 필요없음
                .requestMatchers(HttpMethod.POST, "/api/v1/home/user").hasRole("USER") // USER 권한 있어야함
                .requestMatchers(HttpMethod.POST, "/api/v1/home/admin").hasRole("ADMIN") // ADMIN 권한 있어야함
                .requestMatchers(HttpMethod.POST, "/api/v1/**").authenticated() // 인증 있어야함
                .and()
                .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS) // jwt 사용하는 경우 사용
                .and()
                .addFilterBefore(new JwtFilter(userService, secretKey), UsernamePasswordAuthenticationFilter.class) // FilterChain 앞에 JwtFilter 추가
                .build();
    }
}
```

### JwtFilter

- securityFilterChain 앞에서 처리하는 Custom Filter
- Token 확인, 접근제한, 권한부여, Detail추가 등의 선처리 역할

```java
package com.example.test.configuration;
import com.example.test.service.UserService;
import com.example.test.utils.JwtUtil;
import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import java.util.List;
@RequiredArgsConstructor
@Slf4j
public class JwtFilter extends OncePerRequestFilter {
    private final UserService userService;
    private final String secretKey;
    // 인증받기 위한 내부Filter - 여기를 통해야 들어갈 수 있다.
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        // request에서 토큰 추출
        final String authorization = request.getHeader(HttpHeaders.AUTHORIZATION);
        log.info("authorization : {}", authorization);
        // Token이 없다면 그냥 반환시킴
        if(authorization == null){
            log.error("[접근불가] authorization이 없습니다.");
            filterChain.doFilter(request, response);
            return;
        }
        // Token 꺼내기
        String token = authorization;
        // Token Expired 되었는지 여부
        if(JwtUtil.isExpired(token, secretKey)){
            log.error("token이 만료 되었습니다.");
            filterChain.doFilter(request, response);
            return;
        }
        // UserName Token에서 꺼내기
        String userName = JwtUtil.getUserName(token, secretKey);
        log.info("userName:{}", userName);
        // 권한 부여
        UsernamePasswordAuthenticationToken authenticationToken;
        if(userName.equals("admin")) {
            // id가 admin이면 관리자(ADMIN) 권한 부여
            authenticationToken = new UsernamePasswordAuthenticationToken
                    (userName, null, List.of(new SimpleGrantedAuthority("ROLE_ADMIN")));
        }else {
            // 아니라면 일반 사용자(USER)권한 부여
            authenticationToken = new UsernamePasswordAuthenticationToken
                    (userName, null, List.of(new SimpleGrantedAuthority("ROLE_USER")));
        }
        log.info("Role : {}", authenticationToken.getAuthorities());
        // Detail을 넣어줍니다.
        authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        SecurityContextHolder.getContext().setAuthentication(authenticationToken);
        filterChain.doFilter(request, response);
    }
}
```

---

> **controller**

### UserController

- login 페이지 mapping, 요청 값 리턴

```java
package com.example.test.controller;
import com.example.test.domain.LoginRequest;
import com.example.test.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    // login 버튼 클릭 시 id, pw를 받으며 호출됨.
    // dto로 (id,pw)값을 태워서 service의 login메서드 호출
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest dto) {
        return ResponseEntity.ok().body(userService.login(dto.getUserName(), dto.getPassword()));
    }
    @PostMapping("/join")
    public ResponseEntity<String> join() {
        return ResponseEntity.ok().body("회원가입 완료");
    }
}
```

### HomeController

- user, admin 페이지 mapping, 요청 값 리턴
- USER, ADMIN 페이지 권한 설정

```java
package com.example.test.controller;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
@RestController
@RequestMapping("/api/v1/home")
public class HomeController {
    @PostMapping("/user")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public String userPage() {
        return "userPage";
    }
    // ADMIN 권한을 가져야 접근 가능
    @PostMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public String adminPage() {
        return "adminPage";
    }
}
```

### ReviewController

- reviews 페이지 mapping, 요청 값 리턴

```java
package com.example.test.controller;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
@RestController
@RequestMapping("/api/v1/reviews")
public class ReviewController {
    @PostMapping
    public ResponseEntity<String> writeReview(Authentication authentication) {
        return ResponseEntity.ok().body(authentication.getName() + "님의 리뷰 등록이 완료되었습니다.");
    }
}
```

---

> **domain**

### LoginRequest

- login 매핑 시 Request값을 받는 dto

```java
package com.example.test.domain;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
@AllArgsConstructor
@NoArgsConstructor
@Getter
public class LoginRequest {
    private String userName;
    private String password;
}
```

---

> **service**

### UserService

- UserController에서 service작업을 처리하기 위해 호출하는 클래스
- login메서드로 값을 전달받아 JwtUtil을 호출하여 Token을 생성해옴

```java
package com.example.test.service;
import com.example.test.utils.JwtUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
@Service
@Slf4j
public class UserService {
    @Value("${jwt.secret}")
    private String secretKey;
    // Token 유효 시간 설정
    private Long expiredMs = 1000 * 60 * 60l;
    // Controller에서 받아온 id와 선언해둔 secretKey, expiredMs를 태워
    // util의 createJwt메서드를 호출하여 토큰을 만들어옴
    public String login(String userName, String password) {
        // 인증과정 생략
        log.info("userName:{}, password:{}", userName, password);
        return JwtUtil.createJwt(userName, secretKey, expiredMs);
    }
}
```

---

> **utils**

### JwtUtil

- Jwt을 사용할때 필요한 부가 작업 메서드로 구현
- Token 생성, 만료, 값 추출 등의 작업

```java
package com.example.test.utils;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import java.util.Date;
public class JwtUtil {
    // Token에서 UserName 꺼내오기
    public static String getUserName(String token, String secretKey) {
        return Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token)
                .getBody().get("userName", String.class);
    }
    // Token 만료 여부 판단
    public static boolean isExpired(String token, String secretKey) {
        return Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token)
                .getBody().getExpiration().before(new Date());
    }
    // Token 생성
    public static String createJwt(String userName, String secretKey, Long expiredMs) {
        Claims claims = Jwts.claims(); // username을 저장할 map?
        claims.put("userName", userName);
        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expiredMs))
                .signWith(SignatureAlgorithm.HS256, secretKey)
                .compact();
    }
}
```

---

#### 총 정리

1. configuration에서 security세팅 및 적용하고

2. controller에서 service의 함수 호출

3. service가 utils에서 토큰 만듬

4. service에서 controller로 다시 return한다.
