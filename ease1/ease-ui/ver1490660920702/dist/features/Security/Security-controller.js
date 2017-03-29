define(["angular"],function(e){"use strict";function a(a,r,t,s,n,o,l,c,u,i,g,y,m,d){function p(){o.pubsubTrackAnalytics({taxonomy:{level1:"ease",level2:"customer profile preferences",level3:"security",level4:"change password",level5:"",country:"us",language:"english",system:"ease_web"},lob:l.getLobArray().join(" | ")}),r.go("security.changePassword")}function f(){o.pubsubTrackAnalytics({taxonomy:{level1:"ease",level2:"customer profile preferences",level3:"security",level4:"change username",level5:"",country:"us",language:"english",system:"ease_web"},lob:l.getLobArray().join(" | ")}),r.go("security.changeUsername")}var C=this;o.pubsubTrackAnalytics({taxonomy:{level1:"ease",level2:"customer profile preferences",level3:"security",level4:"",level5:"",country:"us",language:"english",system:"ease_web"},lob:l.getLobArray().join(" | ")});var S=g.$on("updatedUserName",function(e,a){C.username=a,i=a,e.stopPropagation()});m.$on("$destroy",function(){S()}),e.extend(C,{headerContent:a[t.kCoreGlobalDropdown+d.currentLocale.replace("-","_")],content:a[t.kCoreSecurityPrefs+d.currentLocale.replace("-","_")],openChangePasswordModal:p,openChangeUsernameModal:f,enableChangePasswordToggle:n[s.features.enableChangePassword],enableChangeUsernameToggle:n[s.features.enableChangeUsername],featureToggleCIC:c[s.features.showCICLinkFeature],openCIC:function(e){u.open(e,"_blank")},username:y.getUserName()})}function r(e,a,r,t,s,n,o,l,c,u,i){var g=l[n.features.enableEditPassword];g?e.showModal({templateUrl:t.get("Security","","changePassword"),controller:"ChangePasswordModalController",inputs:{securityContentData:a[s.kCoreSecurityPrefs+i.currentLocale.replace("-","_")]}}).then(function(e){e.close.then(function(){r.go("security"),u.$emit("returningToSecurityPage")})}):(o.displayErrorHadler(n.defaultErrorMessage.msgHeader,a.common_snag_en_US["core.common.snag.featureoff.short.label"]),r.go("security")),c.getEncryptionKeyFromServer()}function t(e,a,r,t,s,n,o,l,c,u,i,g){var y=l[n.features.enableEditUsername];y?e.showModal({templateUrl:t.get("Security","","changeUsername"),controller:"ChangeUsernameModalController",inputs:{securityContentData:a[s.kCoreSecurityPrefs+g.currentLocale.replace("-","_")],username:u.getUserName()}}).then(function(e){e.close.then(function(){i.$emit("returningToSecurityPage"),r.go("security")})}):(o.displayErrorHadler(n.defaultErrorMessage.msgHeader,a.common_snag_en_US["core.common.snag.featureoff.short.label"]),r.go("security"))}function s(a,r,t,s,n,o,l,c,u,i,g,y){function m(){o.pubsubTrackAnalytics({taxonomy:{level1:"ease",level2:"customer profile preferences",level3:"security",level4:"change username",level5:"success",country:"us",language:"english",system:"ease_web"},lob:l.getLobArray().join(" | ")}),c.showModal({templateUrl:u.get("Security","","success"),controller:"ChangeUsernameModalController",inputs:{securityContentData:t,username:s}}).then(function(e){e.close.then(function(){o.pubsubTrackAnalytics({taxonomy:{level1:"ease",level2:"customer profile preferences",level3:"security",level4:"",level5:"",country:"us",language:"english",system:"ease_web"},lob:l.getLobArray().join(" | ")}),i.go("security"),g.$emit("returningToSecurityPage")})})}y.getEncryptionKeyFromServer(),e.extend(a,{content:t,close:r,user:{username:s},submitChangeUsername:function(e){a.loadingCSSClassName="loading",n.updateUsername(e).then(function(t){var n=t.easeDisplayError;n&&"1"===n.severity?g.$broadcast("error",{msgHeader:n.headerMessage?n.headerMessage:EASEUtilsFactory.getAccSummaryI18().errorSnag.snagHeader,msgBody:n.displayMessage?n.displayMessage:EASEUtilsFactory.getAccSummaryI18().errorSnag.snagBody}):(r(),s=e.username,a.$emit("updatedUserName",s),m(),a.loadingCSSClassName="")})["catch"](function(){a.loadingCSSClassName="",r()})}});var d=g.$on("$stateChangeStart",function(){r()});a.$on("$destroy",function(){d()}),a.successMessage=t["ease.core.security.usernamesuccess.description.label"]}function n(e,a,r,t,s,n,o,l,c,u,i){function g(){c.pubsubTrackAnalytics({taxonomy:{level1:"ease",level2:"customer profile preferences",level3:"security",level4:"change password",level5:"success",country:"us",language:"english",system:"ease_web"},lob:u.getLobArray().join(" | ")}),s.showModal({templateUrl:n.get("Security","","success"),controller:"ChangePasswordModalController",inputs:{securityContentData:r}}).then(function(e){e.close.then(function(){c.pubsubTrackAnalytics({taxonomy:{level1:"ease",level2:"customer profile preferences",level3:"security",level4:"",level5:"",country:"us",language:"english",system:"ease_web"},lob:u.getLobArray().join(" | ")}),o.go("security"),i.$emit("returningToSecurityPage")})})}function y(r){d||(e.loadingCSSClassName="loading",d=!0,t.changePassword(r).then(function(r){var t=r.easeDisplayError;t&&"1"===t.severity?i.$broadcast("error",{msgHeader:t.headerMessage?t.headerMessage:l.getAccSummaryI18().errorSnag.snagHeader,msgBody:t.displayMessage?t.displayMessage:l.getAccSummaryI18().errorSnag.snagBody}):(e.loadingCSSClassName="",d=!1,a(),g())})["catch"](function(){e.loadingCSSClassName="",d=!1,a()}))}var m=i.$on("$stateChangeStart",function(){a()});e.$on("$destroy",function(){m()});var d=!1;e.content=r,e.close=a,e.submitChangePassword=y,e.successMessage=r["ease.core.security.passwordsuccess.description.label"]}var o=e.module("SecurityModule");o.controller("SecurityController",a).controller("ChangePasswordController",r).controller("ChangePasswordModalController",n).controller("ChangeUsernameController",t).controller("ChangeUsernameModalController",s),a.$inject=["contentData","$state","ContentConstant","EaseConstant","featureToggleData","pubsubService","summaryService","featureToggleDataCIC","$window","username","$rootScope","SecurityFactory","$scope","languagePreferencesFactory"],r.$inject=["easeUIModalService","contentData","$state","easeTemplates","ContentConstant","EaseConstant","easeExceptionsService","featureToggleData","encryptionFactory","$rootScope","languagePreferencesFactory"],t.$inject=["easeUIModalService","contentData","$state","easeTemplates","ContentConstant","EaseConstant","easeExceptionsService","featureToggleData","username","SecurityFactory","$rootScope","languagePreferencesFactory"],s.$inject=["$scope","close","securityContentData","username","SecurityFactory","pubsubService","summaryService","easeUIModalService","easeTemplates","$state","$rootScope","encryptionFactory"],n.$inject=["$scope","close","securityContentData","SecurityFactory","easeUIModalService","easeTemplates","$state","EASEUtilsFactory","pubsubService","summaryService","$rootScope"]});