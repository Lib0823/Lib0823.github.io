---
title: 'ChatBot-API'
description: 'goormIDE 컨테이너 환경에서 개발 진행.'
date: 2023-08-20
category: 'Backend'
tags: ['Flask']
draft: false
---

#### **챗봇 [ GPT-3.5 ]**

- goormIDE 컨테이너 환경에서 개발 진행.

#### <u>application.py</u>

```python
from utils import Api_key
from data import get_data
from learning import model_training

from flask import Flask, request, jsonify, render_template
from flask_apscheduler import APScheduler
import sys
import openai

# key
openai.api_key = Api_key.openAI_key

application = Flask(__name__)
scheduler = APScheduler()

# Flask 앱 설정
application.config['SCHEDULER_API_ENABLED'] = True
application.config['JOBS'] = [
    {
        'id': 'weather_update',
        'func': get_data.process_weather,
        'trigger': 'interval',
        'hours': 0.5
    }
]

# API mapping(POST) - basic
@application.route("/", methods=['POST'])
def chatbot_basic():
    try:    
        request_data = request.get_json()
        user_input = request_data['user_input']

        # DB 학습 데이터 받아옴
        col_name = "basic"
        learn_data = get_data.get_data(col_name)

        response = model_training(learn_data + [{"user": user_input, "ai": ""}])
        return jsonify({"basic": response})
    except:
        return jsonify({"error": "네트워크에 문제가 발생했습니다. 다시 시도해주세요."})

# API mapping(POST) - pae
@application.route("/pae", methods=['POST'])
def chatbot_pae():
    try:    
        request_data = request.get_json()
        user_input = request_data['user_input']

        # DB 학습 데이터 받아옴
        col_name = "pae"
        learn_data = get_data.get_data(col_name)

        response = model_training(learn_data + [{"user": user_input, "ai": ""}])
        return jsonify({"pae": response})
    except:
        return jsonify({"error": "네트워크에 문제가 발생했습니다. 다시 시도해주세요."})

# API mapping(POST) - pae (consult)
@application.route("/pae/consult", methods=['POST'])
def chatbot_pae_consult():
    try:    
        request_data = request.get_json()
        user_input = request_data['user_input']

        # DB 학습 데이터 받아옴
        col_name = "pae_consult"
        learn_data = get_data.get_data(col_name)

        response = model_training(learn_data + [{"user": user_input, "ai": ""}])
        return jsonify({"pae_consult": response})
    except:
        return jsonify({"error": "네트워크에 문제가 발생했습니다. 다시 시도해주세요."})

# API mapping(POST) - working mate
@application.route("/wm", methods=['POST'])
def chatbot_wm():
    try:    
        request_data = request.get_json()
        user_input = request_data['user_input']

        # DB 학습 데이터 받아옴
        col_name = "wm"
        learn_data = get_data.get_data(col_name)

        response = model_training(learn_data + [{"user": user_input, "ai": ""}])
        return jsonify({"wm": response})
    except:
        return jsonify({"error": "네트워크에 문제가 발생했습니다. 다시 시도해주세요."})

# API mapping(POST) - working mate (exercise)
@application.route("/wm/exercise", methods=['POST'])
def chatbot_wm_exercise():
    try:    
        request_data = request.get_json()
        user_input = request_data['user_input']

        # DB 학습 데이터 받아옴
        col_name = "wm_exercise"
        learn_data = get_data.get_data(col_name)

        response = model_training(learn_data + [{"user": user_input, "ai": ""}])
        return jsonify({"wm_exercise": response})
    except:
        return jsonify({"error": "네트워크에 문제가 발생했습니다. 다시 시도해주세요."})

# API mapping(POST) - miracle step
@application.route("/ms", methods=['POST'])
def chatbot_ms():
    try:    
        request_data = request.get_json()
        user_input = request_data['user_input']

        # DB 학습 데이터 받아옴
        col_name = "ms"
        learn_data = get_data.get_data(col_name)

        response = model_training(learn_data + [{"user": user_input, "ai": ""}])
        return jsonify({"ms": response})
    except:
        return jsonify({"error": "네트워크에 문제가 발생했습니다. 다시 시도해주세요."})

# API mapping(POST) - piuda
@application.route("/piuda", methods=['POST'])
def chatbot_piuda():
    try:    
        request_data = request.get_json()
        user_input = request_data['user_input']

        # DB 학습 데이터 받아옴
        col_name = "piuda"
        learn_data = get_data.get_data(col_name)

        response = model_training(learn_data + [{"user": user_input, "ai": ""}])
        return jsonify({"piuda": response})
    except:
        return jsonify({"error": "네트워크에 문제가 발생했습니다. 다시 시도해주세요."})

    

# 도움말 및 설명
@application.route("/help")
def chatbot_help():
    return render_template('help.html')

# 앱 실행
if __name__ == "__main__":
    # 스케줄러 시작 (run()은 블로킹 호출이라, 반드시 그 전에 먼저 시작해야 한다)
    scheduler.init_app(application)
    scheduler.start()

    application.debug = True
    application.run(host='0.0.0.0', port=int(sys.argv[1]))
```

#### <u>chatbot\_data.json</u>

```
[
    {"user" : "안녕하세요", "ai" : "안녕하세요. 무엇을 도와드릴까요?"},
    {"user" : "관리자 연락처", "ai" : "010-5545-5462"},
    {"user" : "기능이 정상적으로 실행되지 않아", "ai" : "애플리케이션을 종료했다 다시 접속해보세요!"}
    
]
```

*이전 버전에선 간단하게 json파일로 데이터를 관리 -> 현재 MongoDB로 데이터 이전*

### 외부에서 chatbotAPI 호출

#### <u>main.py</u>

```python
import requests
import json

url = 'https://chatbot-api.run.goorm.site/'
headers = {'Content-Type': 'application/json'}
data = {'user_input': '안녕'} # 사용자 입력 값

response = requests.post(url, headers=headers, data=json.dumps(data))
print(response.json())
```

*주의 사항) header에 json타입 명시, data를 json타입으로 dumps()하여 body에 담아 전달.*

**Github**

[https://github.com/Lib0823/Chatbot\_restAPI-GPT2.git](https://github.com/Lib0823/Chatbot_restAPI-GPT2.git)

**구름 IDE**

[goormIDE - A Powerful Cloud IDE Service](https://ide.goorm.io/)
