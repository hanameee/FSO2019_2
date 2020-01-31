## Part 3 - [Programming a server with NodeJS and Express](https://fullstackopen.com/en/part3)

---

### [a) Node.js and Express](https://fullstackopen.com/en/part3/node_js_and_express)

#### Representational State Transfer (aka. REST)

REST의 진정한 의미보다는 REST가 web application 에서 보통 어떻게 이해되는지에 집중해서 알아볼 것.
모든 resource는 그 resource의 고유한 address인 associated URL을 가진다.

우리의 convention은 아래와 같다
`[rootURL]/[resourceType]/[resourceUniqueIdentifier]`

ex) rootURL이 *www.example.com/api* 인 경우
특정 note의 URL =  *www.example.com/api/notes/10*
모든 note들의 URL =  *www.example.com/api/notes*

Resource들에 대해 다양한 operation을 실행할 수 있는데, 이 operation은 HTTP verb에 의해 결정된다.

| URL      | verb   | functionality                                                |
| :------- | :----- | :----------------------------------------------------------- |
| notes/10 | GET    | fetches a single resource                                    |
| notes    | GET    | fetches all resources in the collection                      |
| notes    | POST   | creates a new resource based on the request data             |
| notes/10 | DELETE | removes the identified resource                              |
| notes/10 | PUT    | replaces the entire identified resource with the request data |
| notes/10 | PATCH  | replaces a part of the identified resource with the request data |

GET, POST, DELETE, PUT, PATCH

#### Spread 연산자의 다양한 용례 [설명 출처](https://velog.io/@ashnamuh/자바스크립트-rest-spread-문법과-destructuring)

지금까지 많이 사용했던 spread 연산자는 `객체` 에 사용되었던 spread 연산자!

```react
const obj1 = {a: 1, b: 2}
const obj2 = {c: 3}
console.log({...obj1, ...obj2}) // {a: 1, b: 2, c: 3}
// 객체 합치기에 사용

const copiedObj = {...obj1}
console.log(copiedObj) // {a: 1, b: 2}
// 객체 복사에 사용

const obj3 = {...obj1, b: 'b'}
console.log(obj3) // {a: 1, b: 'b'}
// 기존 객체의 값을 수정해서 새로운 객체 만들기에 사용.
```

그런데 spread 연산자는 iterable (배열, 문자열 등) 을 분해해서 개별요소로 만들기 위해 사용할 수도 있다.

```react
const arr = ['a', 'b', 'c']
console.log(arr) // ['a', 'b', 'c']
console.log(...arr) // 'a' 'b' 'c'

const arr2 = [1, 2, 3]
console.log([...arr, ...arr2]) // ['a', 'b', 'c', 1, 2, 3]
// 배열 합치기에 사용할 수 있습니다.

const copiedArr = [...arr]
console.log(copiedArr) // ['a', 'b', 'c']
// 배열 복사에도 사용할 수 있습니다.
```

#### HTTP request types 에 대해

- **GET, HEAD HTTP request는 "safe" 하다** : 서버에 어떠한 side effect도 미치지 않는다
- **POST를 제외한 모든 HTTP request는 "idempotent" 하다** : GET, HEAD, PUT 그리고 DELETE 요청의 경우 n번 연속해서 요쳥해도 같은 결과를 가진다.
- **POST HTTP request는 safe 하지도, idempotent 하지도 않다 **: server에 side effect을 초래하며 (새로운 note 생성 - not safe) 요청이 n번 반복될 경우 n개의 동일한 note가 생긴다. (not idempotent)

#### Middleware

Middleware 이란?  ***request* 와 *response* 객체를 handling 하기 위한 함수**이다.

우리는 POST 요청을 처리하기 위해 `body-parser` middleware을 사용했었다.
`body-parser` 은 (1) request object에 저장된 raw data를 가지고, (2) JS object로 parse 한 후 (3) 이를 request object의 `body`라는 새로운 property에 할당하는 역할을 해 주었다.

```react
const bodyParser = require("body-parser");
const app = express();
// use를 통해 middleware를 express app에 사용등록할 수 있다.
// 여러개의 middleware 사용 시, 각 middleware 들은 이렇게 사용등록된 순서되로 실행된다.
app.use(bodyParser.json());
```

Custom Middleware을 만들어보자!

```react
const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  // request.body는 bodyParser에 의해 할당되므로 bodyParser을 use한 다음에 requestLogger을 사용해야한다!
  console.log('Body:  ', request.body)
  console.log('---')
  // 다음 middleware 으로의 control
  next()
}
```

만약 Route의 event handler이 호출되기 전에 middleware을 사용하고 싶다면, routes 전에 middleware 함수를 사용해야 한다!
만약 route 이후에 middleware을 define 하면, 어떤 route handler도 HTTP request를 handle하지 않았을 때에만 호출되는 middleware이라는 뜻이다. 

#### Morgan

Morgan 은 Logging을 도와주는 middleware 으로, `npm install morgan` 으로 설치하며 아래와 같이 사용한다.

```react
const morgan = require("morgan");
...
const app = express();
..
app.use(morgan("tiny")); //나는 tiny option을 사용했지만, 다양한 option이 존재한다.
```

[morgan middleware 공식 문서](https://github.com/expressjs/morgan)

---

### b) [Deploying app to internet](https://fullstackopen.com/en/part3/deploying_app_to_internet)

#### CORS (Cross Origin Resource Sharing) [참고 링크](https://velog.io/@wlsdud2194/cors)

클라이언트와 서버의 오리진이 다를 때 발생하는 이슈.

1. 왜 발생하는가?

   same-origin policy 때문에 >  더 알아보기

2. 어떻게 해결하는가?

   1) 서버에서 cross-origin HTTP 요청을 허가 해주기 OR
   2) (리액트 개발 환경에서는) webpack-dev-server proxy 기능을 사용하기 [참고 링크](https://velog.io/@ground4ekd/nodejs-cra-proxy)