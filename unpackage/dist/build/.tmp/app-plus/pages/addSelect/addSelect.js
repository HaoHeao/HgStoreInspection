(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/addSelect/addSelect"],{"03a6":function(t,e,r){"use strict";var i=r("cd8e"),n=r.n(i);n.a},1520:function(t,e,r){"use strict";var i=function(){var t=this,e=t.$createElement;t._self._c},n=[];r.d(e,"a",function(){return i}),r.d(e,"b",function(){return n})},3046:function(t,e,r){"use strict";(function(t){r("7085");i(r("66fd"));var e=i(r("adf0"));function i(t){return t&&t.__esModule?t:{default:t}}t(e.default)}).call(this,r("6e42")["createPage"])},"3db8":function(t,e,r){"use strict";r.r(e);var i=r("d797"),n=r.n(i);for(var s in i)"default"!==s&&function(t){r.d(e,t,function(){return i[t]})}(s);e["default"]=n.a},adf0:function(t,e,r){"use strict";r.r(e);var i=r("1520"),n=r("3db8");for(var s in n)"default"!==s&&function(t){r.d(e,t,function(){return n[t]})}(s);r("03a6");var a=r("2877"),l=Object(a["a"])(n["default"],i["a"],i["b"],!1,null,"47651388",null);e["default"]=l.exports},cd8e:function(t,e,r){},d797:function(t,e,r){"use strict";(function(t,r){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;getApp();var i={data:function(){return{type:1,isDepartmentListLength:0,isPersonListLength:0}},computed:{departmentList:function(){return this.$store.state.market.addMarket.departmentList},person:function(){return this.$store.state.market.addMarket.person}},onLoad:function(t){this.type=t.type},onShow:function(){1==this.type?t.setNavigationBarTitle({title:"通知部门"}):2==this.type&&t.setNavigationBarTitle({title:"通知人员"}),this.isDepartmentListLength=this.isSelectListLength(this.departmentList);var e=0,r=!0,i=!1,n=void 0;try{for(var s,a=this.person.deptuserlist[Symbol.iterator]();!(r=(s=a.next()).done);r=!0){var l=s.value;e+=this.isSelectListLength(l.userlist)}}catch(o){i=!0,n=o}finally{try{r||null==a.return||a.return()}finally{if(i)throw n}}this.isPersonListLength=this.isSelectListLength(this.person.leaderlist)+e},methods:{reset:function(t){if(1==t){var e=this.departmentList,i=!0,n=!1,s=void 0;try{for(var a,l=e[Symbol.iterator]();!(i=(a=l.next()).done);i=!0){var o=a.value;o.select=!1}}catch(T){n=!0,s=T}finally{try{i||null==l.return||l.return()}finally{if(n)throw s}}console.log(r(e," at pages\\addSelect\\addSelect.vue:100")),this.$store.commit("setAddDepart",e),this.isDepartmentListLength=this.isSelectListLength(e)}else if(2==t){var u=this.person,d=u.leaderlist,c=u.deptuserlist,f=!0,h=!1,v=void 0;try{for(var y,p=d[Symbol.iterator]();!(f=(y=p.next()).done);f=!0){var L=y.value;L.select=!1}}catch(T){h=!0,v=T}finally{try{f||null==p.return||p.return()}finally{if(h)throw v}}var m=!0,g=!1,S=void 0;try{for(var b,w=c[Symbol.iterator]();!(m=(b=w.next()).done);m=!0){var x=b.value,k=!0,D=!1,$=void 0;try{for(var P,A=x.userlist[Symbol.iterator]();!(k=(P=A.next()).done);k=!0){var _=P.value;_.select=!1}}catch(T){D=!0,$=T}finally{try{k||null==A.return||A.return()}finally{if(D)throw $}}}}catch(T){g=!0,S=T}finally{try{m||null==w.return||w.return()}finally{if(g)throw S}}u={leaderlist:d,deptuserlist:c},this.$store.commit("setAddPerson",u);var M=0,B=!0,j=!1,C=void 0;try{for(var J,N=c[Symbol.iterator]();!(B=(J=N.next()).done);B=!0){var O=J.value;M+=this.isSelectListLength(O.userlist)}}catch(T){j=!0,C=T}finally{try{B||null==N.return||N.return()}finally{if(j)throw C}}this.isPersonListLength=this.isSelectListLength(d)+M}},confirm:function(){t.navigateBack({delta:1})},isSelectListLength:function(t){var e=0,r=!0,i=!1,n=void 0;try{for(var s,a=t[Symbol.iterator]();!(r=(s=a.next()).done);r=!0){var l=s.value;1==l.select&&(e+=1)}}catch(o){i=!0,n=o}finally{try{r||null==a.return||a.return()}finally{if(i)throw n}}return e},addCondition:function(t){if(console.log(r(t," at pages\\addSelect\\addSelect.vue:147")),1==t.type){console.log(r(this.$store.state.market.marketDeptList," at pages\\addSelect\\addSelect.vue:149"));var e=this.departmentList;for(var i in e)e[i].deptid==t.item.deptid&&(1==e[i].select?e[i].select=!1:e[i].select=!0);this.$store.commit("setAddDepart",e),this.isDepartmentListLength=this.isSelectListLength(e)}else if(2==t.type){var n=this.person,s=n.leaderlist,a=n.deptuserlist;for(var l in s)s[l].userid==t.item.userid&&(1==s[l].select?s[l].select=!1:s[l].select=!0);var o=!0,u=!1,d=void 0;try{for(var c,f=a[Symbol.iterator]();!(o=(c=f.next()).done);o=!0){var h=c.value;for(var v in h.userlist)h.userlist[v].userid==t.item.userid&&(1==h.userlist[v].select?h.userlist[v].select=!1:h.userlist[v].select=!0)}}catch(w){u=!0,d=w}finally{try{o||null==f.return||f.return()}finally{if(u)throw d}}n={leaderlist:s,deptuserlist:a},this.$store.commit("setAddPerson",n);var y=0,p=!0,L=!1,m=void 0;try{for(var g,S=a[Symbol.iterator]();!(p=(g=S.next()).done);p=!0){var b=g.value;y+=this.isSelectListLength(b.userlist)}}catch(w){L=!0,m=w}finally{try{p||null==S.return||S.return()}finally{if(L)throw m}}this.isPersonListLength=this.isSelectListLength(s)+y}},delCondition:function(t){if(1==t.type){var e=this.departmentList;for(var r in e)e[r].deptid==t.item.deptid&&(e[r].select=!1);this.$store.commit("setAddDepart",e),this.isDepartmentListLength=this.isSelectListLength(e)}}}};e.default=i}).call(this,r("6e42")["default"],r("0de9")["default"])}},[["3046","common/runtime","common/vendor"]]]);