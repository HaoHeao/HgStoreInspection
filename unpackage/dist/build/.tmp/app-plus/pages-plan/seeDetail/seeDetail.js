(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages-plan/seeDetail/seeDetail"],{"08a7":function(e,t,n){"use strict";(function(e){n("7085");i(n("66fd"));var t=i(n("6ae1"));function i(e){return e&&e.__esModule?e:{default:e}}e(t.default)}).call(this,n("6e42")["createPage"])},"0bce":function(e,t,n){"use strict";(function(e,i){function a(e,t){return s(e)||l(e,t)||o()}function o(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}function l(e,t){var n=[],i=!0,a=!1,o=void 0;try{for(var l,s=e[Symbol.iterator]();!(i=(l=s.next()).done);i=!0)if(n.push(l.value),t&&n.length===t)break}catch(r){a=!0,o=r}finally{try{i||null==s["return"]||s["return"]()}finally{if(a)throw o}}return n}function s(e){if(Array.isArray(e))return e}Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r=getApp().$vm,u=function(){return n.e("components/haoheao-scroll/haoheao-scroll").then(n.bind(null,"efb2"))},c=function(){return n.e("components/uni-popup/uni-popup").then(n.bind(null,"3406"))},p=n("65f1"),f=p.request,d={components:{haoheaoScroll:u,popup:c},data:function(){return{infoDetail:[],usernumber:e.getStorageSync("userinfo").usernumber,userid:e.getStorageSync("userinfo").userid,deptList:[],seeImgList:[],reason:"",solve:"",imgList:[],underList:[],underListArr:[],trueUnder:[],underLastIndex:"",nowUnder:[],selectIdList:[],selectInputtxt:"",btnClickReply:!0,detailLookList:[],showMoreType:1,postThereTrue:!1,status:0}},methods:{copy:function(e){r.copy(e)},getDetail:function(t,n){var o=this;f.getPlanDetail(t).then(function(t){var l=a(t,2),s=l[0],r=l[1];if(console.log(i("巡检单详细信息",s,t," at pages-plan\\seeDetail\\seeDetail.vue:265")),null==s&&r.data.success){o.infoDetail=r.data.data.planinspectionset,o.infoDetail.sdate1=o.infoDetail.sdate.slice(0,10).replace(/-/g,"."),o.infoDetail.edate1=o.infoDetail.edate.slice(0,10).replace(/-/g,"."),o.infoDetail.itemdeptlist=[],o.infoDetail.itempersonlist=[];var u=!0,c=!1,f=void 0;try{for(var d,h=o.infoDetail.planinspectionappenduser[Symbol.iterator]();!(u=(d=h.next()).done);u=!0){var v=d.value;1==v.appendtype?o.infoDetail.itemdeptlist.push(v.itemname):2==v.appendtype&&o.infoDetail.itempersonlist.push(v.itemname)}}catch(s){c=!0,f=s}finally{try{u||null==h.return||h.return()}finally{if(c)throw f}}p.timerDateString(o.infoDetail.planinspectionquestion,o);var g=o.infoDetail.content.replace(/<.*?>/gi,"");o.infoDetail.content=g,console.log(i("巡检单详细信息2",o.infoDetail," at pages-plan\\seeDetail\\seeDetail.vue:290")),n&&n()}else e.showToast({icon:"none",duration:2500,title:"查找失败:"+s.errMsg})})},lookReplay:function(t){if(console.log(i("进入反馈",t," at pages-plan\\seeDetail\\seeDetail.vue:308")),0==t.status)e.navigateTo({url:"../viewQuestion/viewQuestion?data="+JSON.stringify(t)+"&id="+t.planid+"&reply_id="+t.planquestionid+"&postThereTrue="+this.postThereTrue+"&previs=false&replyIs=true"});else if(1==t.status){if(!t.planinspectionfeedback.length)return void e.showToast({icon:"none",title:"此问题已解决,无反馈信息",duration:2e3});e.navigateTo({url:"../viewQuestion/viewQuestion?data="+JSON.stringify(t)+"&id="+t.planid+"&reply_id="+t.planquestionid+"&postThereTrue="+this.postThereTrue+"&previs=false&replyIs=false"})}},onPullDown:function(e){this.getDetail(this.detail_id,e),console.log(i("下拉刷新"," at pages-plan\\seeDetail\\seeDetail.vue:336"))},reply:function(){console.log(i(this.option," at pages-plan\\seeDetail\\seeDetail.vue:340")),console.log(i(this.infoDetail," at pages-plan\\seeDetail\\seeDetail.vue:341"));var t=!!this.infoDetail.planinspectionitem.length&&this.infoDetail.planinspectionitem;console.log(i(t," at pages-plan\\seeDetail\\seeDetail.vue:343")),e.navigateTo({url:"../addQuestion/addQuestion?id="+this.option.id+"&itemIs="+t})},seePicture:function(e,t){p.seePicture(e,t)},confirmQuestion:function(t){var n=this;e.showModal({title:"确认该问题已解决？",success:function(o){o.confirm&&f.confirmPlanQuestion({usernumber:n.usernumber,planquestionid:t.planquestionid}).then(function(t){var o=a(t,2),l=o[0],s=o[1];console.log(i("确认巡检返回:",l,s," at pages-plan\\seeDetail\\seeDetail.vue:364")),n.getDetail(n.detail_id),null!=!l?s.data.success?e.showToast({icon:"none",title:"问题已确认解决！"}):e.showToast({icon:"none",title:s.data.errmsg}):e.showToast({icon:"none",title:l.errmsg})})}})}},onLoad:function(e){console.log(i("巡检详细onLoad option:",e," at pages-plan\\seeDetail\\seeDetail.vue:394")),this.option=e,this.detail_id=e.id},onShow:function(){console.log(i("seeDetail onShow"," at pages-plan\\seeDetail\\seeDetail.vue:399")),this.getDetail(this.detail_id)}};t.default=d}).call(this,n("6e42")["default"],n("0de9")["default"])},"4fb9":function(e,t,n){"use strict";var i=n("9436"),a=n.n(i);a.a},6320:function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement;e._self._c},a=[];n.d(t,"a",function(){return i}),n.d(t,"b",function(){return a})},"6ae1":function(e,t,n){"use strict";n.r(t);var i=n("6320"),a=n("90f7");for(var o in a)"default"!==o&&function(e){n.d(t,e,function(){return a[e]})}(o);n("e857"),n("4fb9");var l=n("2877"),s=Object(l["a"])(a["default"],i["a"],i["b"],!1,null,"675774a4",null);t["default"]=s.exports},"6bd4":function(e,t,n){},"90f7":function(e,t,n){"use strict";n.r(t);var i=n("0bce"),a=n.n(i);for(var o in i)"default"!==o&&function(e){n.d(t,e,function(){return i[e]})}(o);t["default"]=a.a},9436:function(e,t,n){},e857:function(e,t,n){"use strict";var i=n("6bd4"),a=n.n(i);a.a}},[["08a7","common/runtime","common/vendor"]]]);