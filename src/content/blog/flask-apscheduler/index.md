---
title: 'APScheduler'
description: '챗봇 API 개발 시 날씨 데이터를 주기적으로 업데이트 해줘야하기 때문에 사용하게 됨.'
date: 2023-08-20
category: 'Backend'
tags: ['Flask']
draft: false
---

> 챗봇 API 개발 시 날씨 데이터를 주기적으로 업데이트 해줘야하기 때문에 사용하게 됨.

#### APScheduler

- 일정 시간마다 주기적으로 함수를 실행시켜주는 스케줄러이다.

```
pip install Flask-APScheduler
```

```python
from flask import Flask
from flask_apscheduler import APScheduler

app = Flask(__name__)
scheduler = APScheduler()

# 작업으로 실행할 함수
def my_job():
    print('Scheduled job is running!')

# Flask 앱 설정
app.config['SCHEDULER_API_ENABLED'] = True
app.config['JOBS'] = [
    {
        'id': 'my_job',
        'func': my_job,
        'trigger': 'interval',
        'hours': 1
    }
]

# 스케줄러 시작
scheduler.init_app(app)
scheduler.start()
```

*my\_job() 함수를 1시간마다 한 번씩 실행하는 작업을 등록.*

**JOBS** 리스트에 작업을 추가하면 된다. 작업에 대한 정보는 다음과 같이 설정할 수 있다.

- **id**: 작업의 고유 ID
- **func**: 실행할 함수
- **trigger**: 작업의 트리거 유형. **interval**은 일정 시간 간격마다 작업을 실행하는 트리거이다. 이 외에도 특정 날짜/시각 한 번만 실행하는 **date**, cron 표현식처럼 특정 요일/시각을 지정하는 **cron** 트리거도 있다.
- **hours**: 작업을 실행할 간격을 시간 단위로 설정한다.

위 코드에서는 Flask 앱이 실행되면 스케줄러가 자동으로 시작된다. 스케줄러를 중지하려면 **scheduler.shutdown()** 메서드를 호출하면 된다.
