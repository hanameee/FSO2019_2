(this.webpackJsonppart1=this.webpackJsonppart1||[]).push([[0],{14:function(e,t,n){e.exports=n(36)},36:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),u=n(13),l=n.n(u),c=n(3),o=function(e){var t=e.people,n=e.filter,a=e.setFilter,u=t.map((function(e){return e.name.toLowerCase()})).filter((function(e){return e.includes(n.toLowerCase())})),l=0!==u.length?u.map((function(e,t){return r.a.createElement("p",{key:t},e)})):r.a.createElement("p",null,r.a.createElement("b",null,"no result found"));return r.a.createElement("div",null,"filter shown with:",r.a.createElement("input",{value:n,onChange:function(e){return a(e.target.value)}}),n?l:r.a.createElement("p",null,r.a.createElement("b",null,"please enter filter!")))};var i=function(e){var t=e.newName,n=e.setNewName,a=e.newNumber,u=e.setNewNumber,l=e.handleOnSubmit;return r.a.createElement("form",{onSubmit:l},r.a.createElement("div",null,"name:",r.a.createElement("input",{value:t,onChange:function(e){return n(e.target.value)}}),r.a.createElement("div",null,"number:"," ",r.a.createElement("input",{value:a,onChange:function(e){return u(e.target.value)}}))),r.a.createElement("div",null,r.a.createElement("button",{type:"submit"},"add")))},m=n(2),p=n.n(m),f=function(){return p.a.get("api/people").then((function(e){return e.data}))},d=function(e){return p.a.post("api/people",e).then((function(e){return e.data}))},b=function(e,t){return console.log(e,t),p.a.put("".concat("api/people","/").concat(e),t).then((function(e){return e.data}))},s=function(e){return p.a.delete("".concat("api/people","/").concat(e))};var E=function(e){var t=e.people,n=e.setPeople;return t.map((function(e){return r.a.createElement(r.a.Fragment,null,r.a.createElement("p",{key:e.name},r.a.createElement("b",null,"name : "),e.name," ",r.a.createElement("b",null,"number : "),e.number?e.number:""," ",r.a.createElement("button",{onClick:function(){return function(e){window.confirm("Delete ".concat(e.name,"?"))&&s(e.id).then((function(a){return n(t.filter((function(t){return t.id!==e.id})))}))}(e)}},"delete")))}))},h=function(){var e=Object(a.useState)([]),t=Object(c.a)(e,2),n=t[0],u=t[1],l=Object(a.useState)(""),m=Object(c.a)(l,2),p=m[0],s=m[1],h=Object(a.useState)(""),v=Object(c.a)(h,2),w=v[0],g=v[1],N=Object(a.useState)(""),O=Object(c.a)(N,2),j=O[0],k=O[1];Object(a.useEffect)((function(){f().then((function(e){return u(e)}))}),[]);return r.a.createElement("div",null,r.a.createElement("h2",null,"Phonebook"),r.a.createElement(o,{people:n,filter:p,setFilter:s}),r.a.createElement("h3",null,"Add a new"),r.a.createElement(i,{newName:w,setNewName:g,newNumber:j,setNewNumber:k,handleOnSubmit:function(e){e.preventDefault();var t={name:w,number:j},a=n.find((function(e){return e.name===w}));void 0===a?(d(t).then((function(e){return u(n.concat(e))})),g(""),k("")):window.confirm("".concat(a.name," is already added to phonebook. Replace the old number with a new one?"))&&(console.log(a,"targetPerson"),b(a.id,t).then((function(e){return u(n.map((function(t){return t.id!==e.id?t:e})))})))}}),r.a.createElement("h3",null,"Numbers"),r.a.createElement(E,{people:n,setPeople:u}))};l.a.render(r.a.createElement(h,null),document.getElementById("root"))}},[[14,1,2]]]);
//# sourceMappingURL=main.ebdb9f87.chunk.js.map