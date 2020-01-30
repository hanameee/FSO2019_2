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

