---
title: '기본 사용법'
description: '우선 Flask를 사용하기 위해서는 모듈을 설치하고 import해줘야 한다.'
date: 2023-08-20
category: 'Backend'
tags: ['Flask']
draft: false
---

### **1. flask 모듈 임포트**

- 우선 Flask를 사용하기 위해서는 모듈을 설치하고 import해줘야 한다.

```python
# 터미널에서 실행
pip install flask

# 코드 작성시 선언
from flask import Flask
```

### **2. flask 객체를 app에 할당**

- Flask()라는 Class를 app이라는 객체에 담아 사용한다.
- `__name__`이란 python에서 해당 모듈(파일)의 이름을 나타낸다.
- 즉 Flask클래스에 현재 모듈을 담아서 app객체로 사용한다고 보면 된다.

```python
app = Flask(__name__)
```

### **3. 라우팅(route) 경로 설정**

- SpringBoot의 @Mapping 태그와 동일
- /hello 경로로 오는 요청에 대해서는 hello()메서드가 처리하겠다.

```python
@app.route("/hello") # 라우터 설정(<http://localhost/hello>)의 위치
def hello():
    return  "<h1>Hello World!</h1>"
```

### **4. flask 웹 서버 구동**

- app.run() 함수로 서버 구동 가능
- 함수의 파라미터로는 host, port, debug를 주로 사용
- host : 웹주소(서버 위치)를 입력
  - 개인 PC에서 웹서비스를 구현할 때, host값을 localhost, 127.0.0.1, `0.0.0.0`으로 설정
- port : port 주소를 입력
- debug : True or False (debug모드가 True면 에러 정보를 확인 할 수 있다) - 실사용(배포)시에는 False로 해야함.

```python
# Flask import
from flask import Flask
# app 객체 생성
app = Flask(__name__)
# 라우터 설정
@app.route("/hello")  
def hello():
    return  "<h1>Hello Flask!</h1>"
# 웹 서버 구동
if __name__ == '__main__': # 외부에서 접근한게 아니라면 실행한다.
    app.run(host="127.0.0.1", port=8080)
```

> `__name__`은 현재 모듈(file)의 이름을 담고 있는 내장 변수이다. import로 모듈을 가져온 경우면 해당 스크립트 파일이 한 번 실행되는데 이때 import된 파일에서 `__name__`을 사용하면 import한 모듈의 이름이 나온다. **즉, if `__name__` == `'__main__'`: 은 자신의 현재 모듈이 최초 시작 스크립트 파일인지 검사하는 것 이다.** (외부에서 실행 시 통과하지 않음)
