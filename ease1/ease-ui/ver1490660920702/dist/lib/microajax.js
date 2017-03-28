/*! atomic v1.0.0 | (c) 2015 @toddmotto | https://github.com/toddmotto/atomic
Update: I've added the logic to timeout the http call
*/

!function(t,e){"function"==typeof define&&define.amd?define(e(t)):"object"==typeof exports?module.exports=e:t.atomic=e(t)}(this,function(t){"use strict";var e={},n={contentType:"application/x-www-form-urlencoded"},r=function(t){var e;try{e=JSON.parse(t.responseText)}catch(n){e=t.responseText}return[e,t]},u=function(e,u,o){function s(){a.abort()}var c={success:function(){},error:function(){},always:function(){}},i=t.XMLHttpRequest||ActiveXObject,a=new i("MSXML2.XMLHTTP.3.0");if(n.timeout)var f=setTimeout(s,n.timeout);a.open(e,u,!0),a.setRequestHeader("Content-type",n.contentType),a.setRequestHeader("X-Requested-With","XMLHttpRequest"),n.customerActivityHeader&&a.setRequestHeader("BUS_EVT_ID",n.customerActivityHeader),a.onreadystatechange=function(){var t;n.timeout&&clearTimeout(f),4===a.readyState&&(t=r(a),a.status>=200&&a.status<300?c.success.apply(c,t):c.error.apply(c,t),c.always.apply(c,t))},a.send(o);var p={success:function(t){return c.success=t,p},error:function(t){return c.error=t,p},always:function(t){return c.always=t,p}};return p};return e.get=function(t){return u("GET",t)},e.put=function(t,e){return u("PUT",t,e)},e.post=function(t,e){return u("POST",t,e)},e["delete"]=function(t){return u("DELETE",t)},e.setContentType=function(t){n.contentType=t},e.setTimeout=function(t){n.timeout=t},e.setCustomerActivityHeader=function(t){n.customerActivityHeader=t},e});