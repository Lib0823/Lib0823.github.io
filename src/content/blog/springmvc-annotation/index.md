---
title: '많이 사용되는 주요 @Annotation 정리'
description: 'Annotation 이란?클래스나 메서드에 특별한 의미와 기능을 부여하여 코드량을 줄이고, 유지보수성과 생산성을 높이는 기술이다'
date: 2023-08-19
category: 'Backend'
tags: ['Spring', 'Java', 'Spring MVC']
draft: false
---

> **Annotation 이란?** 클래스나 메서드에 특별한 의미와 기능을 부여하여 코드량을 줄이고, 유지보수성과 생산성을 높이는 기술이다

![많이 사용되는 주요 @Annotation 정리](./annotation-1.png)

### **Spring의 주요 Annotation리스트**

### **@Bean**

@Bean은 개발자가 직접 제어가 불가능한 외부 라이브러리등을 Bean으로 만들려할 때 사용 되는 Annotation이다.

```java
@Configuration
public class ApplicationConfig {
	@Bean(name="myarray")
	public ArrayList<String> array() {
		return new ArrayList<String>();
	}
}
```

@Bean어노테이션에 name이라는 값을 이용하면 자신이 원하는 id로 Bean을 등록할 수 있다.

어노테이션 안에 값을 입력하지 않을 경우 메소드의 이름을 CamelCase로 변경한 것이 Bean의 id가 된다.

### **@Component**

개발자가 직접 작성한 Class를 Spring의 Bean으로 등록할 때 사용하는 Annotation이다.

@Bean과는 다르게 @Component는 name이 아닌 value를 이용해 Bean의 이름을 지정한다.

```java
@Component
public class Student {
    public Student() {
        System.out.println("hi");
    }
}
```

### **@ComponentScan**

@Component와 @Service, @Repository, @Controller, @Configuration이 붙은 클래스 Bean들을 찾아서 Context에 bean등록을 해주는 Annotation이다.

@Component Annotation이 있는 클래스에 대하여 bean 인스턴스를 생성한다.

---

### **@Autowired**

속성(field), setter method, constructor(생성자)에서 사용하며, Type에 따라 알아서 Bean을 주입 해준다.

무조건적인 객체에 대한 의존성을 주입 시키고, 스프링이 자동적으로 값을 할당한다.

Controller 클래스에서 DAO나 Service에 관한 객체들을 주입 시킬 때 많이 사용한다.

```java
@Autowired
private ArrayList<String> array;
```

> ArrayList<String> 타입으로 등록된 Bean 객체를 주입받는다

### **@Inject**

@Autowired 어노테이션과 비슷한 역할을 한다.

### **@Resource**

@Autowired와 마찬가지로 Bean 객체를 주입해주는데 차이점은 Autowired는 타입으로, Resource는 이름으로 연결해준다.

Annotation 사용으로 인해 특정 Framework에 종속적인 어플리케이션을 구성하지 않기 위해서는 @Resource를 사용할 것을 권장한다.

@Resource를 사용하기 위해서는 class path 내에 jsr250-api.jar 파일을 추가해야 한다.

필드, 입력 파라미터가 한 개인 bean property setter method에 적용 가능하다.

---

### **@Configuration**

@Configuration을 클래스에 적용하고 @Bean을 해당 Class의 method에 적용하면 @Autowired로 Bean을 부를 수 있다.

설정파일을 만들거나 Bean을 등록하기 위한 애노테이션이다.

- Bean을 등록할때 싱글톤(singleton)이 되도록 보장해준다.
- 스프링컨테이너에서 Bean을 관리할수있게 됨.

---

### **@Controller**

Spring의 Controller를 의미한다. Spring MVC에서 Controller클래스에 쓰인다.

Controller는 사용자가 화면(View) 단에서 입력이나 어떤 이벤트를 했을 경우, 그 이벤트에 맞는 화면(View)이나 비즈니스 로직(Model)을 실행할 수 있도록 업데이트 해주는 역할을 맡음.

- 컨트롤러 : @Controller (프레젠테이션 레이어, 웹 요청과 응답을 처리함)
- 로직 처리 : @Service (서비스 레이어, 내부에서 자바 로직을 처리함)
- 외부I/O 처리 : @Repository (퍼시스턴스 레이어, DB나 파일같은 외부 I/O 작업을 처리함)

### **@RestController**

Spring에서 Controller 중 View로 응답하지 않는, Controller를 의미한다.

method의 반환 결과를 JSON 형태로 반환한다.

이 Annotation이 적혀있는 Controller의 method는 HttpResponse로 바로 응답이 가능하다. @ResponseBody 역할을 자동적으로 해주는 Annotation이다.

@Controller + @ResponseBody를 사용하면 @ResponseBody를 모든 메소드에서 적용한다.

- @Controller: API와 view를 동시에 사용하는 경우에 사용한다. 대신 API 서비스로 사용하는 경우는 @ResponseBody를 사용하여 객체를 반환한다. view(화면) return이 주목적이다.
- @RestController: view가 필요없는 API만 지원하는 서비스에서 사용한다. Spring 4.0.1부터 제공 @RequestMapping 메서드가 기본적으로 @ResponseBody 의미를 가정한다. data(json, xml 등) return이 주목적이다.

### **@Service**

**Service Class**에서 쓰인다. 비즈니스 로직을 수행하는 Class라는 것을 나타내는 용도이다.

### **@Repository**

**DAO class**에서 쓰인다. DataBase에 접근하는 method를 가지고 있는 Class에서 쓰인다.

---

### **@Required**

setter method에 적용해주면 Bean 생성시 필수 프로퍼티 임을 알린다.

Required Annotation을 사용하여 optional 하지 않은, 꼭 필요한 속성들을 정의한다.

영향을 받는 bean property를 구성할 시에는 XML 설정 파일에 반드시 property를 채워야 한다.

```html
<!-- Definition for student bean -->
<bean id = "student" class = "com.tutorialspoint.Student">
    <property name = "name" value = "Zara" />
    <property name = "age"  value = "11"/>
</bean>
```

```java
@Required  // 반드시 프로퍼티를 이용하여 값을 주입받도록 정의. 값이 안들어오면 에러나게 함.
public void setNumber(int number){
    this.number = number;
}
```

> **Property(속성) 란 무엇인가?**
> => 일반적으로 DTO(Data Transfer Object) 또는 VO(Value Obejct) 에서 볼 수 있다. => 인스턴스 변수와 getter와 setter로 만들어진 형태

---

### **@Lazy**

지연로딩을 지원한다.

@Component나 @Bean Annotation과 같이 쓰는데 Class가 로드될 때 스프링에서 바로 bean등록을 마치는 것이 아니라 실제로 사용될 때 로딩이 이뤄지게 하는 방법이다.

---

### **@Test**

- @Test가 선언된 메서드는 테스트를 수행하는 메소드가 된다.
- jUnit은 각각의 테스트가 서로 영향을 주지 않고 독립적으로 실행됨을 원칙으로 @Test마다 객체를 생성한다.

**1. jUnit이란?**

- Java에서 독립된 단위테스트(Unit Test)를 지원해주는 프레임워크이다.

**2. 단위테스트(Unit Test)란?**

- 소스코드의 특정 모듈이 의도된 대로 정확히 작동하는지 검증하는 절차이다.
- 모든 함수와 메소드에 대한 테스트 케이스(Test case)를 작성하는 절차를 말한다.
- jUnit은 보이지 않고 숨겨진 단위 테스트를 끌어내어 정형화시켜 단위테스트를 쉽게 해주는 테스트 지원 프레임워크이다.

**3. jUnit 특징**

- 단정(assert) 메서드로 테스트 케이스의 수행 결과를 판별한다.(ex: assertEquals(예상값, 실제값))
- jUnit4부터는 테스트를 지원하는 어노테이션을 제공한다.(@Test @Before @After)
- @Test 메서드가 호출할 때 마다 새로운 인스턴스를 생성하여 독립적인 테스트가 이루어지게 한다.

---

### **@RequestMapping**

요청 URL을 어떤 method가 처리할지 mapping해주는 Annotation이다.

Controller나 Controller의 method에 적용한다.

요청을 받는 형식인 GET, POST, PATCH, PUT, DELETE 를 정의하기도 한다.

요청 받는 형식을 정의하지 않는다면, 자동적으로 GET으로 설정된다.

```
@RequestMapping("/list")
@RequestMapping({"/home", "/about"})

@RequestMapping("/admin", method=RequestMethod.GET)
```

```java
@Controller
// 1) Class Level
//모든 메서드에 적용되는 경우 “/home”로 들어오는 모든 요청에 대한 처리를 해당 클래스에서 한다는 것을 의미
@RequestMapping("/home")
public class HomeController {
    /* an HTTP GET for /home */
    @RequestMapping(method = RequestMethod.GET)
    public String getAllEmployees(Model model) {
        ...
    }
    /*
    2) Handler Level
    요청 url에 대해 해당 메서드에서 처리해야 되는 경우
    “/home/employees” POST 요청에 대한 처리를 addEmployee()에서 한다는 것을 의미한다.
    value: 해당 url로 요청이 들어오면 이 메서드가 수행된다.
    method: 요청 method를 명시한다. 없으면 모든 http method 형식에 대해 수행된다.
    */
    /* an HTTP POST for /home/employees */
    @RequestMapping(value = "/employees", method = RequestMethod.POST)
    public String addEmployee(Employee employee) {
        ...
    }
}
```

> @RequestMapping에 대한 모든 매핑 정보는 Spring에서 제공하는 HandlerMapping Class가 가지고 있다.

### **@GetMapping**

@RequestMapping(Method=RequestMethod.GET)과 같다. @PostMapping, @PutMapping, @PatchMapping, @DeleteMapping 등 도 있다.

---

### **@CookieValue**

쿠키 값을 parameter로 전달 받을 수 있는 방법이다.

해당 쿠키가 존재하지 않으면 400 에러를 발생시킨다.

속성으로 required가 있는데 default는 true다. false를 적용하면 해당 쿠키 값이 없을 때 null로 받고 에러를 발생시키지 않는다.

```java
// 쿠키의 key가 auth에 해당하는 값을 가져옴
public String view(@CookieValue(value="auth")String auth){...};
```

### **@SessionAttributes**

Session에 data를 넣을 때 쓰는 Annotation이다.

@SessionAttributes("name")이라고 하면 Model에 key값이 "name"으로 있는 값은 자동으로 세션에도 저장되게 한다.

### **@ModelAttribute**

view에서 전달해주는 parameter를 Class(VO/DTO)의 멤버 변수로 binding 해주는 Annotation이다.

binding 기준은 <input name="id" /> 처럼 어떤 태그의 name값이 해당 Class의 멤버 변수명과 일치해야하고 setmethod명도 일치해야한다.

```java
class Person{

String id;

public void setId(String id){ this.id = id;}
public String getId(){ return this.id; }
}

@Controller
@RequestMapping("/person/*")
public class PersonController{
	@RequestMapping(value = "/info", method=RequestMethod.GET)
    	//view에서 myMEM으로 던져준 데이터에 담긴 id 변수를 Person타입의 person이라는 객체명으로 바인딩.
	public void show(@ModelAttribute("myMEM") Person person, Model model)
	{ model.addAttribute(service.read(person.getId())); }
}
```

---

### **@Valid**

유효성 검증이 필요한 객체임을 지정한다.

@Valid로 시작하는 어노테이션이 있을 경우에 유효성 검사를 진행한다.

### **@Validated**

입력 파라미터의 유효성 검증은 컨트롤러에서 최대한 처리하고 넘겨주는 것이 좋다. 하지만 개발을 하다보면 불가피하게 다른 곳에서 파라미터를 검증해야 할 수 있다.

Spring에서는 이를 위해 AOP 기반으로 메소드의 요청을 가로채서 유효성 검증을 진행해주는 @Validated를 제공하고 있다.

다음과 같이 클래스에 @Validated를 붙여주고, 유효성을 검증할 메소드의 파라미터에 @Valid를 붙여주면 유효성 검증이 진행된다.

```java
@Service
@Validated
public class UserService {
	public void addUser(@Valid AddUserRequest addUserRequest) {
		...
	}
}
```

### **@InitBinder**

@Valid 애노테이션으로 유효성 검증이 필요하다고 한 객체를 가져오기전에 수행해야할 method를 지정한다.

---

### **@RequestAttribute**

Request객체에 설정되어 있는 속성 값을 가져올 수 있다.

```java
@GetMapping("/sample")
public String sample(@RequestAttribute String id){
    System.out.println(id);
    return id;
}
```

### **@RequestHeader**

Request의 header값을 가져올 수 있다. 메소드의 파라미터에 사용한다.

```
//ko-KR,ko;q=0.8,en-US;q=0.6
@RequestHeader(value="Accept-Language")String acceptLanguage 로 사용
```

### **@RequestBody**

요청이 온 데이터(JSON이나 XML형식)를 바로 Class나 model로 매핑하기 위한 Annotation이다.

POST나 PUT, PATCH로 요청을 받을때에, 요청에서 넘어온 body 값들을 자바 타입으로 파싱해준다.

HTTP POST 요청에 대해 request body에 있는 request message에서 값을 얻어와 매핑한다. RequestData를 바로 Model이나 클래스로 매핑한다.

이를테면 JSON 이나 XML같은 데이터를 적절한 messageConverter로 읽을 때 사용하거나 POJO 형태의 데이터 전체로 받는 경우에 사용한다.

```java
@RequestMapping(value = "/book", method = RequestMethod.POST)
public ResponseEntity<?> someMethod(@RequestBody Book book) {
// we can use the variable named book which has Book model type.
try {
   service.insertBook(book);
} catch(Exception e) {
    e.printStackTrace();
}

// return some response here
}
```

### **@RequestParam**

request의 parameter에서 가져오는 것이다.

HTTP GET 요청에 대해 매칭되는 request parameter 값이 자동으로 들어간다. url 뒤에 붙는 parameter 값을 가져올 때 사용한다.

http://localhost:8080/home?index=1&page=2

```java
@GetMapping("/home")
public String show(@RequestParam("page") int pageNum) {
}
```

> 위의 경우 GET /home?index=1&page=2와 같이 uri가 전달될 때 page parameter를 받아온다. @RequestParam 어노테이션의 괄호 안의 문자열이 전달 인자 이름(실제 값을 표시)이다.

```java
@RequestMapping(value = "/search/movie", method = RequestMethod.GET)
public ResponseEntity<?> someMethod(@RequestParam String moviename) {
// request URI would be like '/search/movie?moviename=thepurge'
try {
   List<Movie> movies = service.searchByMoviename(moviename);
} catch(Exception e) {
   e.printStackTrace();
}
// return some response here
}
```

> @ModelAttribute와 @RequestParam의 다른 점은 RequestParam은 파라미터를 1:1로 받는 반면, ModelAttribute는 도메인 모델이나 DTO 같은 모델을 받는 타입이다.

---

### **@ExceptionHandler(ExceptionClassName.class)**

@Controller, @RestController가 적용된 Bean내에서 발생하는 예외를 잡아서 하나의 메서드에서 처리해주는 기능을 한다.

```java
@RestController
public class MyRestController {
...
...
	@ExceptionHandler(NullPointerException.class)
	public Object nullex(Exception e) {
		System.err.println(e.getClass());
		return "myService";
	}
}
```

### **@ControllerAdvice**

@ExceptionHandler가 하나의 클래스에 대한 것이라면, @ControllerAdvice는 모든 @Controller 즉, 전역에서 발생할 수 있는 예외를 잡아 처리해주는 annotation이다.

Class 위에 ControllerAdvice를 붙이고 어떤 예외를 잡아낼 것인지는 각 메소드 상단에 @ExceptionHandler(예외클래스명.class)를 붙여서 기술한다.

```java
@RestControllerAdvice
public class MyAdvice {
	@ExceptionHandler(CustomException.class)
	public String custom() {
		return "hello custom";
	}
}
```

---

### **@ResponseStatus**

사용자에게 원하는 response code와 reason을 return해주는 Annotation이다.

@ResponseStatus(value = HttpStatus.NOT\_FOUND, reason = "my page URL changed..") => 예외처리 함수 앞에 사용한다.

---

### **@Transactional**

데이터베이스 트랜잭션을 설정하고 싶은 method에 Annotation을 적용하면 method 내부에서 일어나는 데이터베이스 로직이 전부 성공하게되거나 데이터베이스 접근중 하나라도 실패하면 다시 롤백할 수 있게 해주는 Annotation이다.

@Transactional(readOnly=true, rollbackFor=Exception.class)에서 readOnly는 읽기전용임을 알리고 rollbackFor는 해당 Exception이 생기면 롤백하라는 뜻이다.

@Transactional(noRollbackFor=Exception.class)는 해당 Exception이 나타나도 롤백하지 말라는 뜻이다.

@Transactional(timeout = 10)은 10초안에 해당 로직을 수행하지 못하면 롤백하라는 뜻이다.

메소드 내에서 Exception이 발생하면 해당 메소드에서 이루어진 모든 DB 작업을 초기화한다. save 메소드를 통해서 10개를 등록해야 하는데 5번째에서 Exception이 발생하면 앞에 저장된 4개 까지 모두 롤백

정확히 얘기하면, 이미 넣은걸 롤백시키는건 아니며, 모든 처리가 정상적으로 됐을때만 DB에 커밋하며 그렇지 않은 경우엔 커밋하지 않는 것이다.

비지니스 로직과 트랜잭션 관리는 대부분 Service에서 관리한다.

따라서 일반적으로 DB 데이터를 등록/수정/삭제 하는 Service 메소드는 @Transactional를 필수적으로 가져간다.

---

### **@Scheduled**

특정 메소드에 @Scheduled 어노테이션을 선언하면 설정한 값에 따라 주기적으로 해당 메소드를 실행시킬 수 있다.

정해진 시간에 실행해야하는 경우에 사용한다.

```java
@Scheduled(cron = "0 0 07 * * ?")
```

초 분 시 일 월 요일 년(선택)에 해당하는 값을 지정하며, 설정한 시점에 해당 메서드가 호출된다.

[Spring ,java - 스케줄링 사용법 (@Scheduled) 어노테이션, 크론 (cron) 표현식](https://m.blog.naver.com/dufwjdrkdgur/221426709905)

---

### **@Getter**

Class 내 모든 필드의 Getter method를 자동 생성한다.

```java
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class gocoder {
	private String name;

	/*
	자동으로 겟터, 셋터 메소드가 생성됩니다. 개발자는 가만있으면 됩니다.
	*/
}
```

### **@Setter**

Class 내 모든 필드의 Setter method를 자동 생성한다.

Controller에서 @RequestBody로 외부에서 데이터를 받는 경우엔 기본생성자 + set method를 통해서만 값이 할당된다. 그래서 이때만 setter를 허용한다. Entity Class에는 Setter를 설정하면 안된다. 차라리 DTO 클래스를 생성해서 DTO 타입으로 받도록 하자

### **@ToString**

Class 내 모든 필드의 toString method를 자동 생성한다.

@ToString(exclude = "password")특정 필드를 toString() 결과에서 제외한다. `클래스명(필드1이름=필드1값, 필드2이름=필드2값, …)` 식으로 출력된다.

[[Spring] Annotation 정리](https://velog.io/@gillog/Spring-Annotation-%EC%A0%95%EB%A6%AC)
