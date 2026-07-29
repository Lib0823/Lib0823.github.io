---
title: 'Session 사용하기'
description: '데이터베이스에서 회원정보를 가져오는 인터페이스'
date: 2023-09-10
category: 'Backend'
tags: ['Spring', 'Session', 'Spring Security']
draft: false
---

### 1. UserDetailService

- 데이터베이스에서 회원정보를 가져오는 인터페이스
- loadUserByUsername() 메소드를 통해 회원 정보를 조회 → 사용자의 정보와 권한을 갖는 UserDetails 인터페이스를 반환

### 2. UserDetails

- 회원 정보를 담는 인터페이스
- 직접 구현하거나 스프링 시큐리티에서 제공하는 User 클래스 사용(구현체)

### 3. MemberService 로그인/로그아웃 구현

- MemberService.java
- UserDetailsService 인터페이스를 구현하고 loadUserByUsername() 메소드 오버라이딩
- Builder 패턴을 이용하여 UserDetail 인터페이스를 구현한 User 객체 생성 후 반환

```java
//implements해놨으니까 추상메소드 구현
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        //DB에 있는 email을 찾아서 잡아온다
        Member member = memberRepository.findByEmail(email);

        if(member == null) {
            //이메일 정보를 추가해서 exception을 날린다. 이거 근데 로그인이 잘못됐다는 예외가 발생한다
            throw new UsernameNotFoundException("해당 사용자가 없습니다." + email);
        }

        return User.builder()
                .username(member.getEmail())//이메일, 아이디 등 어떤 로직으로 로그인을 하던 그 로그인을 할 필드를 넣어준다.
                .password(member.getPassword()) //암호화 되어서 들어가야 함.
                .roles(member.getRole().toString())//역할을 string으로 넣어줘야 한다. -> enum 안됨
                .build();
    }
```

### 4. SecurityConfig 인증 filter 추가

- SecurityConfig.java
- configure(HttpSecurity) 메소드를 통해 로그인 및 로그아웃 URL 지정
- http.formLogin() - http를 통해 들어오는 form 기반 request를 이용하여 Login을 처리
- form 태그에서 사용자의 ID 부분은 default 값으로 “username” 필드

```java
import jakarta.servlet.DispatcherType;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
// 설정 파일로 쓸 수 있다고 알려주는 어노테이션
@Configuration
// 로그인을 하기 위한 설정
@EnableWebSecurity
public class SecurityConfig {

    // 메모리를 미리 올려놔야 하기 때문에 bean 붙이기
    @Bean
    // http 요청에 대한 보안 설정. 페이지 권한, 로그인 페이지, 로그아웃 메소드 설정 예정
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http.formLogin() // 로그인과 관련된 주소
                .loginPage("/member/login")  // 로그인 주소
                .defaultSuccessUrl("/") // 성공 시 이동할 주소
                .usernameParameter("email") // user이름을 email로 사용할 것이기 때문에 field이름을 적어줘야 함  -> username이라 적은 경우엔 안적어도 됨
                .failureUrl("/member/login/error") // 로그인 실패 시 이동할 페이지
                .and()
                .logout()  // 로그아웃과 관련된 정보
                .logoutRequestMatcher(new AntPathRequestMatcher("/member/logout")) // 로그아웃을 누를 때 처리할 내용
                .logoutSuccessUrl("/");

        http.authorizeHttpRequests()  // 인증 여부 확인 -> 스프링 3.0 이하 버전은 authorizeRequests()로 설정
                // 스프링 3.0 이하 버전은 antMatchers(), mvcMatchers(), regexMatchers()으로 사용
                .dispatcherTypeMatchers(DispatcherType.FORWARD).permitAll() // 페이지 이동할 경우 default로 인증이 걸리도록 되어있기 때문에 추가
                .requestMatchers("/css/**", "/js/**").permitAll()  // 모든 사람에게 css 적용
                .requestMatchers("/", "/member/**", "/item/**", "/images/**").permitAll() // 아무나 페이지에 들어올 수 있고, member, item 밑에 있는 애들은 모두 permit 허용
                .requestMatchers("/admin/**").hasRole("ADMIN") // admin인 애들만 admin에 접속 가능
                .anyRequest().authenticated(); // 인증 받기

        http.exceptionHandling()  // 권한이 없는 경우
                .authenticationEntryPoint(new CustomEntryPoint());

        return http.build();
    }

}
```

- AuthenticationManagerBuilder를 통해 AuthenticationManager를 생성하여 인증 처리 수행
- UserDetailsService 인터페이스를 구현하고 loadUserByUsername 메소드를 오버라이딩한 memberService 객체를 이용하여 User 객체를 얻어낸 뒤, 지정된 비밀번호 암호화 방식으로 비밀번호가 일치하는지 검증

```java
@Bean
    public PasswordEncoder passwordEncoder() {

        return new BCryptPasswordEncoder();// 단방향 암호화 객체 생성
    }
```

### 5. 로그인 페이지

```html
<!-- 앞으로 우리가 사용할 기본 템플릿 -->
<!DOCTYPE html>
<html lang="en"
      xmlns:th="http://www.thymeleaf.org"
      xmlns:layout="http://www.ultraq.net.nz/thymeleaf/layout"
      layout:decorate="~{layouts/layout1}">

<!-- 사용자 CSS 추가 -->
<th:block layout:fragment="css">
      <style>
            /* 에러가 나오면 빨간색으로 표시하겠다는 말임 */
            .error {
                  color: #bd2130;
            }
      </style>
</th:block>

<div layout:fragment="content">

      <!-- post로 날아가기 때문에 이 정보들을 들고 controller로 날아갈 수 있는 것 -->
      <form role="form" method="post" action="/member/login">
            <div class="form-group">
                  <!-- 우리가 username이 아닌 email로 로그인을 하기 때문에 이건 userparameter로 security에 적어줘야 한다  -->
                  <label th:for="email">이메일주소</label>
                  <input type="email" name="email" class="form-control" placeholder="이메일을 입력해주세요">
            </div>
            <div class="form-group">
                  <!-- default는 password. 이거 바꾸면 이것도 security에 적어줘야 한다 -->
                  <label th:for="password">비밀번호</label>
                  <input type="password" name="password" id="password" class="form-control" placeholder="비밀번호 입력">
            </div>
            <p th:if="${loginErrorMsg}" class="error" th:text="${loginErrorMsg}"></p>
            <button class="btn btn-primary">로그인</button>
            <button type="button" class="btn btn-primary" onClick="location.href='/member/new'">회원가입</button>
            <input type="hidden" th:name="${_csrf.parameterName}" th:value="${_csrf.token}">
      </form>

</div>

</html>
```

### 6. thymeleaf-extras-springsecurity6 의존성 추가

- 로그인한 상태에서는 로그아웃만 노출, 상품 등록 메뉴는 관리자로 로그인 했을 때만 노출되도록 인증 및 권한에 따라 설정 변경을 도와주는 라이브러리

```
implementation 'org.thymeleaf.extras:thymeleaf-extras-springsecurity6:3.1.1.RELEASE'
```

### 7. header Navbar 부분 수정

```html
<!DOCTYPE html>
<html lang="en"
      xmlns:th="http://www.thymeleaf.org"
      xmlns:sec="http://www.thymeleaf.org/extras/spring-security">

<!-- 부트스트랩 이용함 -->
<div th:fragment="header">
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container-fluid">
            <a class="navbar-brand" href="/">Woojin's Shop</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <!-- 상품등록 -->
                    <li class="nav-item" sec:authorize="hasAnyAuthority('ROLE_ADMIN')">
                        <a class="nav-link active" aria-current="page" href="/admin/item/new" >상품등록</a></li>
                    <!-- 상품관리 -->
                    <li class="nav-item" sec:authorize="hasAnyAuthority('ROLE_ADMIN')">
                        <a class="nav-link active" aria-current="page" href="/admin/items">상품관리</a></li>
                    <!-- 장바구니 -->
                    <li class="nav-item" sec:authorize="isAuthenticated()">
                        <a class="nav-link active" aria-current="page" href="/cart">장바구니</a></li>
                    <!-- 구매이력 -->
                    <li class="nav-item" sec:authorize="isAuthenticated()">
                        <a class="nav-link active" aria-current="page" href="/orders">구매이력</a></li>
                    <!-- 게시판 -->
                    <li class="nav-item" sec:authorize="isAuthenticated()">
                        <a class="nav-link active" aria-current="page" href="/board">게시판</a></li>
                    <!-- 로그인 -->
                    <li class="nav-item" sec:authorize="isAnonymous()">
                        <a class="nav-link active" aria-current="page" href="/member/login">로그인</a></li>
                    <!-- 로그아웃 -->
                    <li class="nav-item" sec:authorize="isAuthenticated()">
                        <a class="nav-link active" aria-current="page" href="/member/logout">로그아웃</a></li>
                </ul>
                <form class="d-flex" role="search">
                    <input class="form-control me-2" type="search" placeholder="Search"
                           aria-label="Search">
                    <button class="btn btn-outline-success" type="submit">Search</button>
                </form>
            </div>
        </div>
    </nav>
</div>

</html>
```
