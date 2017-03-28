define(["angular"],function(e){function n(n,o,t,a,r,s,l,i,u,c,m,b,d,p,f,g,h,P,y,v,E,S,C){var N=this;o.getFocusForEscapeHatch(),s.updatePubSub(),N.addressBankData=r.core_profileprefs_en_US[s.getBankAddressLabel(y)],N.addressCardData=r.core_profileprefs_en_US[s.getCardAddressLabel(y)],N.messageOptions={iconColor:"#ff0000",isCloseIcon:!1,alertIcon:!0,globalElementId:"globalMessageHolderWithAlert",alertIconAria:"Alert Icon",closeAlert:!0},N.toolTipMsg={position:"top",positionAuto:!0,triggerMessage:""},N.getToolTipOptions=function(e){return N.toolTipMsg.triggerMessage=e.emailAddress,N.toolTipMsg},s.setProfileprefContentData(r),s.findPrimaryEmail(m),e.extend(N,{newImageData:"",currentImageData:"",loadingClass:"",contentDataProfilePrefs:r.core_profileprefs_en_US,contentDataSettings:c,emailList:m,phoneNumberList:b,smallBusinessPhoneList:C,enableShowEmail:m?h[u.features.enableShowEmail]:!1,enableAddEmail:h[u.features.enableAddEmail],enableEditEmail:h[u.features.enableEditEmail],enableShowPhone:b?h[u.features.enableShowPhone]&&s.hasPersonalAccounts:!1,enableShowSmallBusinessPhone:C&&s.getSmallBusinessAccounts().length>0?h[u.features.enableShowSmallBusinessPhone]:!1,enableEditSmallBusinessPhone:h[u.features.enableEditSmallBusinessPhone],enableShowAddress:b?h[u.features.enableShowAddress]:!1,enableEditBankAddress:h[u.features.enableEditBankAddress],enableEditCardAddress:h[u.features.enableEditCardAddress],enableEditPhone:h[u.features.enableEditPhone],enableEditGreetingName:h[u.features.enableEditGreetingName],enableEditPicture:h[u.features.enableEditPicture],phoneContentMessageOptions:N.messageOptions,smallBusinessMessageOptions:N.messageOptions,isEmailInvalid:function(e){return/Failed/i.test(e.contactPointStatus)},editBankAddress:function(){l.pubsubTrackAnalytics({name:"edit address in transite:button"}),N.enableEditBankAddress?i.open(E.bankUrl,"_self"):s.openFeatureUnavailable()},editCardAddress:function(){l.pubsubTrackAnalytics({name:"edit address in eos:button"}),N.enableEditCardAddress?p.go("customerSettings.profile.changeAddress"):s.openFeatureUnavailable()},addEmailEnable:function(){return N.emailList.length<10},displayGreetName:function(){return o.getCustomerSummary().greetingName},displayProfilePic:function(){return o.getProfileImage()},editGreetingName:function(){N.enableEditGreetingName?a(t.get("PersonalInformation","","editGreetName"),{}):s.openFeatureUnavailable()},addEmail:function(){N.enableAddEmail?p.go("customerSettings.profile.addEmail"):s.openFeatureUnavailable()},editEmail:function(e){N.enableEditEmail?s.openEditEmailModal(e):s.openFeatureUnavailable()},editPersonalPhoneNumber:function(e){if(N.enableEditPhone)switch(e.phoneType){case"mobile":p.go("customerSettings.profile.editMobilePhone");break;case"home":p.go("customerSettings.profile.editHomePhone");break;case"work":p.go("customerSettings.profile.editWorkPhone");break;default:return}else s.openFeatureUnavailable()},editSmallBusinessPhoneNumber:function(e){if(N.enableEditSmallBusinessPhone){var n=s.buildPhoneModalObj(e);s.openEditPhoneNumberModal(n)}else s.openFeatureUnavailable()},editSmsSettings:function(e){var n=e.accountReferenceId?N.enableEditSmallBusinessPhone:N.enableEditPhone;if(n){var o={taxonomy:{level1:"ease",level2:"customer profile preferences",level3:"profile",level4:"sms",level5:"",country:"us",language:"english",system:"ease_web"},lob:P.getLobArray().join(" | ")};s.openEditSmsModal(e,o,s.isSmsEnabled(e),!0)}else s.openFeatureUnavailable()},editTcpaSettings:function(e){var n=e.accountReferenceId?N.enableEditSmallBusinessPhone:N.enableEditPhone;if(n){var o={taxonomy:{level1:"ease",level2:"customer profile preferences",level3:"profile",level4:"update "+e.phoneType+" TCPA",level5:"",country:"us",language:"english",system:"ease_web"},lob:P.getLobArray().join(" | ")};s.openEditTcpaSettingsModal(e,void 0,o)}else s.openFeatureUnavailable()},getSmsStatusText:function(e){return s.isSmsEnabled(e)?N.contentDataProfilePrefs["ease.core.profileprefs.phone.sms.enabled"]:N.contentDataProfilePrefs["ease.core.profileprefs.phone.sms.disabled"]},shouldDisplaySmsStatus:function(e){return e.formattedPhoneNumber&&e.hasTcpaConsent},isAddressContentDisplayed:function(){return N.enableShowAddress&&(N.addressCardData||N.addressBankData)}}),S.isEmpty(b.easeDisplayError)||(N.phoneContentMessageOptions.alertContent=b.easeDisplayError.displayMessage),C[0]&&!S.isEmpty(C[0].easeDisplayError)&&(N.smallBusinessMessageOptions.alertContent=C[0].easeDisplayError.displayMessage);var I=f.$on("addEmail",function(e,n,o){s.getEmailList().then(function(e){N.emailList=e,s.findPrimaryEmail(N.emailList),o?f.$emit("deletingEmail"):f.$emit("returningToProfilePage",!0)}),e.stopPropagation()}),j=function(e,n){if(!e.phoneNumber)return!0;var o=e.phoneNumber.replace(/[^\/\d]/g,"");if(/personal/i.test(n)){var t=!1;return S.some(N.smallBusinessPhoneList.phoneNumbers,function(e){var n=e.work.formattedPhoneNumber?e.work.formattedPhoneNumber.replace(/[^\/\d]/g,""):"",a=e.mobile.formattedPhoneNumber?e.mobile.formattedPhoneNumber.replace(/[^\/\d]/g,""):"";return t=o===n||o===a}),t}var a=N.phoneNumberList.work.formattedPhoneNumber?N.phoneNumberList.work.formattedPhoneNumber.replace(/[^\/\d]/g,""):"",r=N.phoneNumberList.mobile.formattedPhoneNumber?N.phoneNumberList.mobile.formattedPhoneNumber.replace(/[^\/\d]/g,""):"",s=N.phoneNumberList.home.formattedPhoneNumber?N.phoneNumberList.home.formattedPhoneNumber.replace(/[^\/\d]/g,""):"";return o===r||o===a||o===s},w=function(){s.getPhoneNumberList("50088").then(function(e){N.phoneNumberList=e,S.isEmpty(e.easeDisplayError)||(N.phoneContentMessageOptions.alertContent=e.easeDisplayError.displayMessage)})},O=function(){s.getSmallBusinessPhoneNumberList("50088").then(function(e){N.smallBusinessPhoneList=e,e.easeDisplayError&&!S.isEmpty(e.easeDisplayError)&&(N.smallBusinessMessageOptions.alertContent=e.easeDisplayError.displayMessage)})},A=f.$on("updatePhoneNumbers",function(e,n){w(),N.enableShowSmallBusinessPhone&&j(n.phoneObj,"personal")&&O(),e.stopPropagation()}),$=f.$on("updateSmallBusinessPhoneNumbers",function(e,n){O(),N.enableShowPhone&&j(n.phoneObj,"business")&&w(),e.stopPropagation()});n.$on("$destroy",function(){I(),A(),$()}),n.$watch(e.bind(N.newImageData,function(){return N.newImageData}),function(e,n){e!==n&&""!==e&&(N.enableEditPicture?(l.pubsubLinkClick({linkName:"add photo"}),s.setProfilePictureData(e,N.currentImageData),a(t.get("PersonalInformation","","editProfilePic"),{})):s.openFeatureUnavailable())})}function o(n,o,t,a,r){var s=this;e.extend(s,{currentImageData:t.getProfilePictureData().currentImageData,loadingClass:"",newImageData:t.getProfilePictureData().newImageData,close:function(){n.$modalCancel()},savePicture:function(e){var l=e.replace("data:image/png;base64,","");a.pubsubButtonClick({buttonName:"crop"}),s.loading="loading",t.postProfilePicture({profilePictureData:l}).then(function(e){t.closeModal(s.loading,n);var a=e.easeDisplayError;a&&"2"===a.severity?o.$broadcast("error",{msgHeader:a.headerMessage?a.headerMessage:r.getAccSummaryI18().errorSnag.snagHeader,msgBody:a.displayMessage?a.displayMessage:r.getAccSummaryI18().errorSnag.snagBody}):document.getElementById("ngProfilePic").focus()},function(){t.closeModal(s.loading,n)})},modalType:"profilePictureModal",modalClass:"icon-check"})}function t(n,o,t,a,r,s){var l=this;o.pubsubTrackAnalytics({name:"greeting name:field"}),e.extend(l,{length:r.kGreetingNameLength,content:a.getProfileprefContentData(),greetingName:t.getCustomerSummary().greetingName,close:function(){o.pubsubTrackAnalytics({taxonomy:{level1:"ease",level2:"personal information",level3:"personal information",level4:"",level5:"",country:"us",language:"english",system:"ease_web"},lob:s.getLobArray().join(" | ")}),n.$modalCancel()},saveGreetName:function(){l.loading="loading",document.getElementById("ngEditGreet").focus(),t.getCustomerSummary().greetingName!==l.greetingName?a.postGreetingName(l.greetingName).then(function(){a.closeModal(l.loading,n)},function(){a.closeModal(l.loading,n)}):a.closeModal(l.loading,n)},modalType:"editGreetNameModal",modalClass:"icon-check"})}function a(e){e.openAddEmailModal()}function r(e,n,o,t,a,r,s,l,i,u,c,m,b,d){e.content=a.getProfileprefContentData();var p=!1,f=function(){p||(o(),p=!0)},g=function(){f(),a.updatePubSub(c)};e.closeEdit=function(){n.$emit("returningToProfilePage"),g()},e.closeAdd=function(){a.updatePubSub(c),m.go(d.states.kProfile)};var h=function(){return{email:"",emailAgain:"",isPrimary:!1,contactPointId:""}},P=function(o,t,a){var r=o.easeDisplayError;r&&r.displayMessage?"1"===r.severity?n.$broadcast("error",{msgHeader:r.headerMessage?r.headerMessage:b.getAccSummaryI18().errorSnag.snagHeader,msgBody:r.displayMessage?r.displayMessage:b.getAccSummaryI18().errorSnag.snagBody}):r.severity>1&&(e.emailValidateMessage.firstInputErrorMessage=r.displayMessage,e.status.firstInputErrorStatus="error"):(n.$emit("addEmail",null,a),e.newEmailObj=h(),t())};e.email=s,e.newEmailObj=h(),e.email&&(e.newEmailObj.email=e.email.emailAddress,e.newEmailObj.contactPointId=e.email.contactPointId,e.newEmailObj.isPrimary=e.email.primaryIndicator,e.newEmailObj.contactPointStatus=e.email.contactPointStatus),e.isInvalidEmail=function(){return/failed/i.test(e.email.contactPointStatus)},e.errorOptions={closeAlert:!0,iconColor:"#D03027",isCloseIcon:!1,alertIcon:!0,alertContent:e.content["ease.core.profileprefs.email.modal.invalid.message"]};var y=function(){t.pubsubTrackAnalytics({name:"save:button",accountAction:"primary email:checkbox"})},v=function(){t.pubsubTrackAnalytics({name:"save:button"})},E=function(){!e.email&&e.newEmailObj.isPrimary?y():e.email&&!e.email.primaryIndicator&&e.newEmailObj.isPrimary?y():v()};e.saveEmail=function(){E(),a.postAddEmail(e.newEmailObj).then(function(n){P(n,e.closeAdd)})},e.editEmail=function(){E(),a.isVerifyState(m.current.name)?(e.newEmailObj.editFlow=!0,n.$emit("addEmail",e.newEmailObj),a.setPrimaryEmailInvalid(!1),f()):a.editEmail(e.newEmailObj).then(function(e){P(e,g)})};var S=function(){t.pubsubTrackAnalytics({name:"confirm:button"}),a.deleteEmail(e.newEmailObj).then(function(e){P(e,g,!0)})},C=function(){var o={title:e.content["ease.core.profileprefs.phone.deleteconfirm.title.label"],alertText:e.content["ease.core.profileprefs.email.deleteconfirm.description"],buttonLabel:e.content["ease.core.profileprefs.phone.deleteconfirm.yes.label"],linkText:e.content["ease.core.profileprefs.email.deleteconfirm.no.label"]},a={buttonFn:S};t.pubsubTrackAnalytics({taxonomy:{level1:"ease",level2:"customer profile preferences",level3:"profile",level4:"edit email",level5:"delete email",country:"us",language:"english",system:"ease_web"},lob:u.getLobArray().join(" | ")}),l.showModal({templateUrl:i.get("PersonalInformation","","confirmationModal"),controller:"PersonalInfoConfirmModalCtrl",inputs:{content:o,callBacks:a,pubSubOnClose:c}}).then(function(e){e.close.then(function(){n.$emit("returningToProfilePage")})})};e.deleteEmail=function(){f(),C()};var N=n.$on("$stateChangeStart",o);e.$on("$destroy",function(){N()});var I="^(?!.*[._@-]{2})[a-z0-9",j="][-a-z0-9_.",w="]*@[-a-z0-9",O="]+(\\.[-a-z0-9]+)?(\\.[a-z]{2,3})?\\.[a-z]{2,3}$";e.accentedCharactersRegEx="\\u00C0-\\u00C2\\u00C7-\\u00CB\\u00CD-\\u00CF\\u00D1\\u00D3\\u00D4\\u00D9-\\u00DB\\u00E0-\\u00E2\\u00E7-\\u00E9\\u00EA\\u00EB\\u00ED-\\u00EF\\u00F1\\u00F3\\u00F4\\u00F9-\\u00FB";var A=new RegExp(I+e.accentedCharactersRegEx+j+e.accentedCharactersRegEx+w+e.accentedCharactersRegEx+O,"i");e.isValidEmail=function(e){return A.test(e.trim())},e.enableSaveBtn=function(){return e.newEmailObj.emailAgain&&e.newEmailObj.email&&e.newEmailObj.email.toLowerCase()===e.newEmailObj.emailAgain.toLowerCase()&&e.isValidEmail(e.newEmailObj.email)&&e.isValidEmail(e.newEmailObj.emailAgain)},e.limit=50,e.emailId="emailInput",e.status={firstInputErrorStatus:"",secondInputErrorStatus:"",isPrimaryStatus:function(){return e.newEmailObj.isPrimary?"primary":""}},e.emailValidateMessage={firstInputErrorMessage:"",secondInputErrorMessage:""},e.emailAgainId="emailAgainInput"}function s(e,n,o,t,a,r,s,l,i,u,c,m,b,d,p,f,g,h,P){e.content=a.getProfileprefContentData(),h(function(){P[0].getElementsByClassName("ease-modal")[0].focus()}),e.checkIfCloseClicked=!0,e.newPhoneNumberObj={isPrimary:!1,phoneNumber:"",phoneType:r.phoneType,hasTcpaConsent:!1,smsStatus:r.smsStatus,isValid:r.isValid,accountReferenceId:r.accountReferenceId,businessPhoneReferenceId:r.businessPhoneReferenceId,isNewNumber:!0},e.status={firstInputErrorStatus:c?"error":""},e.phoneValidateMessage={firstInputErrorMessage:c?c:""};var y=!1,v=function(){b.current.name===d.states.kVerify&&n.$emit("updatePhoneNumbers",{checkIfCloseClicked:e.checkIfCloseClicked,phoneObj:{}}),y||(o(),y=!0)};e.returnToProfilePrefsPage=function(){y||a.isProfileState()?v():b.go(d.states.kProfile),a.updatePubSub(p)},r&&(e.phoneNumberActual=m?m.formattedPhoneNumber:r.formattedPhoneNumber,e.newPhoneNumberObj.phoneNumber=r.formattedPhoneNumber||r.phoneNumber,e.isPrimaryActual=m?m.isPrimary:r.isPrimary,e.newPhoneNumberObj.isPrimary=r.isPrimary,e.newPhoneNumberObj.hasTcpaConsent=m?m.hasTcpaConsent:r.hasTcpaConsent),e.phoneNumberId="phoneInput",e.numberLimit=14;var E=e.newPhoneNumberObj.phoneType;e.numberLabel=e.content["ease.core.profileprefs.phone."+E+".input.label"],e.modalTitle=g?g:e.content["ease.core.profileprefs.phone."+E+".editmodal.title.label"];var S=function(o){var t=o.easeDisplayError;t&&t.displayMessage?"1"===t.severity?n.$broadcast("error",{msgHeader:t.headerMessage?t.headerMessage:f.getAccSummaryI18().errorSnag.snagHeader,msgBody:t.displayMessage?t.displayMessage:f.getAccSummaryI18().errorSnag.snagBody}):t.severity>1&&(e.phoneValidateMessage.firstInputErrorMessage=t.displayMessage,e.status.firstInputErrorStatus="error"):(e.checkIfCloseClicked=!1,e.newPhoneNumberObj.accountReferenceId?n.$emit("updateSmallBusinessPhoneNumbers",{checkIfCloseClicked:e.checkIfCloseClicked,phoneObj:e.newPhoneNumberObj}):n.$emit("updatePhoneNumbers",{checkIfCloseClicked:e.checkIfCloseClicked,phoneObj:e.newPhoneNumberObj}),e.returnToProfilePrefsPage())};e.isPrimaryStatus=function(){return e.newPhoneNumberObj.isPrimary?"primary":""};var C=function(e){a.editPhoneNumber(e).then(S)};e.savePhoneNumber=function(){if(!e.isPrimaryActual&&e.newPhoneNumberObj.isPrimary?t.pubsubTrackAnalytics({name:"save:button",accountAction:"primary number:checkbox"}):t.pubsubTrackAnalytics({name:"save:button"}),e.newPhoneNumberObj.phoneNumber===r.formattedPhoneNumber||m&&e.newPhoneNumberObj.phoneNumber===m.formattedPhoneNumber){var n;n={phoneNumber:e.newPhoneNumberObj.phoneNumber.replace(/[^\/\d]/g,""),phoneType:e.newPhoneNumberObj.phoneType,isPrimary:e.newPhoneNumberObj.isPrimary,accountReferenceId:e.newPhoneNumberObj.accountReferenceId,businessPhoneReferenceId:e.newPhoneNumberObj.businessPhoneReferenceId,isPost:!0,isNewNumber:!1},C(n)}else{e.newPhoneNumberObj.hasTcpaConsent=null;var o=m?m:r;v();var s={taxonomy:{level1:"ease",level2:"customer profile preferences",level3:"profile",level4:"update "+e.newPhoneNumberObj.phoneType+" TCPA",level5:"",country:"us",language:"english",system:"ease_web"},lob:i.getLobArray().join(" | ")};s=p?p:s,a.openEditTcpaSettingsModal(e.newPhoneNumberObj,o,s,p)}};var N=n.$on("$stateChangeStart",o);e.$on("$destroy",function(){N()}),e.enableSaveBtn=function(){return e.newPhoneNumberObj.phoneNumber&&e.newPhoneNumberObj.phoneNumber.length===e.numberLimit};var I=function(){a.deletePhone(e.newPhoneNumberObj).then(S)};e.deletePhoneModal=function(){v(),t.pubsubTrackAnalytics({taxonomy:{level1:"ease",level2:"customer profile preferences",level3:"profile",level4:"edit "+r.phoneType+" number",level5:"delete "+e.newPhoneNumberObj.phoneType+" number",country:"us",language:"english",system:"ease_web"},lob:i.getLobArray().join(" | ")}),s.showModal({templateUrl:l.get("PersonalInformation","","conformation"),controller:"PersonalInfoDeletePhoneModalCtrl",inputs:{confirmHandler:I,labels:{message:e.content["ease.core.profileprefs.phone.deleteconfirm.desc.label"],confirm:e.content["ease.core.profileprefs.phone.deleteconfirm.yes.label"],no:e.content["ease.core.profileprefs.phone.deleteconfirm.no.label"]},pubSubOnClose:p}}).then(function(e){e.close.then(function(){n.$emit("returningToProfilePage")})})}}function l(e,n,o,t,a,r,s,l,i){e.content=a.getProfileprefContentData(),e.labels=t,e.modalTitle=e.content["ease.core.profileprefs.phone.deleteconfirm.title.label"],e.confirmClickHandler=function(){n(),l.go(i.states.kProfile),o(),r.pubsubTrackAnalytics({name:"confirm:button"})},e.noClickHandler=function(){n(),l.go(i.states.kProfile),a.updatePubSub(s)}}function i(e,n,o,t,a,r,s,l,i,u,c,m,b,d){e.newPhoneNumberObj={isPrimary:r.isPrimary,phoneNumber:r.formattedPhoneNumber||r.phoneNumber,phoneType:r.phoneType,hasTcpaConsent:r.hasTcpaConsent,smsStatus:r.smsStatus,isValid:r.isValid,accountReferenceId:r.accountReferenceId,businessPhoneReferenceId:r.businessPhoneReferenceId,isNewNumber:r.isNewNumber},e.content=a.getProfileprefContentData(),e.displayBackLink=void 0!==i;var p=function(t){e.loadingClass=!1;var r=t.easeDisplayError;r&&r.displayMessage?"1"===r.severity?n.$broadcast("error",{msgHeader:r.headerMessage?r.headerMessage:m.getAccSummaryI18().errorSnag.snagHeader,msgBody:r.displayMessage?r.displayMessage:m.getAccSummaryI18().errorSnag.snagBody}):r.severity>1&&e.returnToEditModal(r.displayMessage):(e.checkIfCloseClicked=!1,e.newPhoneNumberObj.accountReferenceId?n.$emit("updateSmallBusinessPhoneNumbers",{checkIfCloseClicked:e.checkIfCloseClicked,phoneObj:e.newPhoneNumberObj}):n.$emit("updatePhoneNumbers",{checkIfCloseClicked:e.checkIfCloseClicked,phoneObj:e.newPhoneNumberObj}),a.isProfileState()?o():b.go(d.states.kProfile),a.updatePubSub(c))};e.isContinueDisabled=function(){return e.newPhoneNumberObj&&(null===e.newPhoneNumberObj.hasTcpaConsent||void 0===e.newPhoneNumberObj.hasTcpaConsent)},e.returnToEditModal=function(n){o();var t={taxonomy:{level1:"ease",level2:"customer profile preferences",level3:"profile",level4:"edit "+e.newPhoneNumberObj.phoneType+" number",level5:"",country:"us",language:"english",system:"ease_web"},lob:u.getLobArray().join(" | ")},r={number:e.newPhoneNumberObj,error:n,originalNumberPreferences:i,pubsubObj:t,pubSubOnClose:c,modalTitle:!1};a.openEditPhoneNumberModal(r)},e.openConfirmExitModal=function(){o();var n={taxonomy:{level1:"ease",level2:"customer profile preferences",level3:"profile",level4:"TCPA closed",level5:"",country:"us",language:"english",system:"ease_web"},lob:u.getLobArray().join(" | ")};n=c?c:n,a.openConfirmTcpaExitModal(e.newPhoneNumberObj,i,n,c)},e.saveTcpaSettings=function(){t.pubsubTrackAnalytics({name:"continue:button"});var s={taxonomy:{level1:"ease",level2:"customer profile preferences",level3:"profile",level4:"sms",level5:"",country:"us",language:"english",system:"ease_web"},lob:u.getLobArray().join(" | ")},l=void 0===i,c=a.isSmsEnabled(r);a.isVerifyState(b.current.name)?(e.checkIfCloseClicked=!1,e.newPhoneNumberObj.accountReferenceId?n.$emit("updateSmallBusinessPhoneNumbers",{checkIfCloseClicked:e.checkIfCloseClicked,phoneObj:e.newPhoneNumberObj}):n.$emit("updatePhoneNumbers",{checkIfCloseClicked:e.checkIfCloseClicked,phoneObj:e.newPhoneNumberObj}),o()):"mobile"!==e.newPhoneNumberObj.phoneType||!l&&!e.newPhoneNumberObj.hasTcpaConsent||!c&&!e.newPhoneNumberObj.hasTcpaConsent?(l||e.newPhoneNumberObj.hasTcpaConsent||(e.newPhoneNumberObj.smsStatus="DIRECT_DISABLE"),a.updatePhoneNumberSettings(e.newPhoneNumberObj,null,p)):(o(),e.newPhoneNumberObj.hasTcpaConsent?a.openEditSmsModal(e.newPhoneNumberObj,s,c,!1,i,l):e.newPhoneNumberObj.hasTcpaConsent||a.openDisableSmsConfirmationModal(e.newPhoneNumberObj,{taxonomy:{level1:"ease",level2:"customer profile preferences",level3:"profile",level4:"update mobile TCPA",level5:"confirm",country:"us",language:"english",system:"ease_web"},lob:u.getLobArray().join(" | ")}))};var f=n.$on("$stateChangeStart",function(){o()});e.$on("$destroy",function(){f()})}function u(e,n,o,t,a,r,s,l,i,u,c,m){e.content=a.getProfileprefContentData(),e.exitTcpaFlow=function(){a.isProfileState()?o():c.go(m.states.kProfile),a.updatePubSub(u)},e.returnToTcpaSettings=function(){o();var e={taxonomy:{level1:"ease",level2:"customer profile preferences",level3:"profile",level4:"update "+r.phoneType+" TCPA",level5:"",country:"us",language:"english",system:"ease_web"},lob:i.getLobArray().join(" | ")};e=u?u:e,a.openEditTcpaSettingsModal(r,l,e,u)};var b=n.$on("$stateChangeStart",function(){o()});e.$on("$destroy",function(){b()})}function c(e,n,o,t,a,r,s,l,i){e.content=a,e.close=function(){t.isProfileState()?o():l.go(i.states.kProfile),t.updatePubSub(s)},e["continue"]=function(e){t.isProfileState()?o():l.go(i.states.kProfile),r[e]()};var u=n.$on("$stateChangeStart",o);e.$on("$destroy",function(){u()})}function m(n,o,t,a,r,s,l,i,u,c,m,b,d,p){function f(e){var o={taxonomy:{level1:"ease",level2:"customer profile preferences",level3:"profile",level4:"edit "+n.smsAlertsObj.phoneType+" number",level5:"",country:"us",language:"english",system:"ease_web"},lob:i.getLobArray().join(" | ")},t={number:n.smsAlertsObj,error:e,originalNumberPreferences:m,pubsubObj:o,pubSubOnClose:null,modalTitle:!1};r.openEditPhoneNumberModal(t)}function g(e){var t=e.easeDisplayError;if("2"===t.severity)f(t.displayMessage);else{var a={phoneNumber:n.smsAlertsObj.phoneNumber};n.smsAlertsObj.accountReferenceId?o.$emit("updateSmallBusinessPhoneNumbers",{phoneObj:a}):o.$emit("updatePhoneNumbers",{phoneObj:a}),r.updatePubSub()}}n.close=function(){r.updatePubSub(),r.isProfileState()?t():b.go(d.states.kProfile)},n.smsAlertsObj=a,n.content=r.getProfileprefContentData();var h=r.getSmsAlertArticleContentData();n.smsAlertDesc=h.article.section.body;var P=function(e){var s=e.easeDisplayError;if(s&&s.displayMessage)t(),"2"===s.severity?f(s.displayMessage):"3"===s.severity&&r.openSmsErrorModal(a,n.content);else{var l={taxonomy:{level1:"ease",level2:"customer profile preferences",level3:"profile",level4:"sms",level5:"success",country:"us",language:"english",system:"ease_web"},lob:i.getLobArray().join(" | ")};r.showSuccessSmsModal(l,a);var u={phoneNumber:n.smsAlertsObj.phoneNumber};n.smsAlertsObj.accountReferenceId?o.$emit("updateSmallBusinessPhoneNumbers",{phoneObj:u}):o.$emit("updatePhoneNumbers",{phoneObj:u}),t()}};n.enableTextSms=function(){if(n.loadingClass=!0,c&&u){var e={taxonomy:{level1:"ease",level2:"customer profile preferences",level3:"profile",level4:"",level5:"",country:"us",language:"english",system:"ease_web"},lob:i.getLobArray().join(" | ")};r.updatePubSub(e),r.isProfileState()?t():b.go(d.states.kProfile)}else r.updatePhoneNumberSettings(n.smsAlertsObj,"REQ_ENABLE",P)},n.disableTextSms=function(){if(u&&c||u&&p){t();var o=e.copy(n.smsAlertsObj);r.openDisableSmsConfirmationModal(o,{taxonomy:{level1:"ease",level2:"customer profile preferences",level3:"profile",level4:"sms",level5:"confirm",country:"us",language:"english",system:"ease_web"},lob:i.getLobArray().join(" | ")})}else r.isProfileState()?t():b.go(d.states.kProfile),r.updatePhoneNumberSettings(n.smsAlertsObj,"DIRECT_DISABLE",g),r.updatePubSub()};var y=n.$on("$stateChangeStart",t);n.$on("$destroy",function(){y()})}function b(e,n,o,t,a,r){e.close=function(){o.isProfileState()?n():a.go(r.states.kProfile)},e.mobileData=t,e.content=o.getProfileprefContentData();var s=e.$on("$stateChangeStart",n);e.$on("$destroy",function(){s()})}function d(e,n,o,t,a,r,s,l,i){e.number=a.formattedPhoneNumber?a.formattedPhoneNumber:a.phoneNumber,e.content=r,e.exitSmsErrorFlow=function(){t.updatePubSub(),t.isProfileState()?o():l.go(i.states.kProfile)},e.backToEditPhone=function(){o();var e={taxonomy:{level1:"ease",level2:"customer profile preferences",level3:"profile",level4:"sms",level5:"",country:"us",language:"english",system:"ease_web"},lob:s.getLobArray().join(" | ")};t.openEditSmsModal(a,e,!1,!1)};var u=n.$on("$stateChangeStart",o);e.$on("$destroy",function(){u()})}return n.$inject=["$scope","EASEUtilsFactory","easeCoreTemplates","EaseModalService","contentDataProfilePref","profileInfoFactory","pubsubService","$window","EaseConstant","contentDataSettings","emailData","phoneNumberData","easeUIModalService","$state","$rootScope","errorContentData","featureToggleData","summaryService","summaryData","ContentConstant","PhysicalAddressLink","_","smallBusinessPhoneData"],o.$inject=["$scope","$rootScope","profileInfoFactory","pubsubService","EASEUtilsFactory"],t.$inject=["$scope","pubsubService","EASEUtilsFactory","profileInfoFactory","EaseConstant","summaryService"],a.$inject=["profileInfoFactory"],r.$inject=["$scope","$rootScope","close","pubsubService","profileInfoFactory","$timeout","email","easeUIModalService","easeCoreTemplates","summaryService","pubSubOnClose","$state","EASEUtilsFactory","EaseConstant"],s.$inject=["$scope","$rootScope","close","pubsubService","profileInfoFactory","number","easeUIModalService","easeCoreTemplates","summaryService","openEditTcpaSettingsModal","error","originalNumberPreferences","$state","EaseConstant","pubSubOnClose","EASEUtilsFactory","modalTitle","$timeout","$document"],l.$inject=["$scope","close","confirmHandler","labels","profileInfoFactory","pubsubService","pubSubOnClose","$state","EaseConstant"],i.$inject=["$scope","$rootScope","close","pubsubService","profileInfoFactory","number","openEditPhoneNumberModal","openConfirmTcpaExitModal","originalNumberPreferences","summaryService","pubSubOnClose","EASEUtilsFactory","$state","EaseConstant"],u.$inject=["$scope","$rootScope","close","pubsubService","profileInfoFactory","number","openEditTcpaSettingsModal","originalNumberPreferences","summaryService","pubSubOnClose","$state","EaseConstant"],c.$inject=["$scope","$rootScope","close","profileInfoFactory","content","callBacks","pubSubOnClose","$state","EaseConstant"],m.$inject=["$scope","$rootScope","close","mobileData","profileInfoFactory","pubsubService","EASEUtilsFactory","summaryService","isSmsEnabled","fromProfile","originalNumberPreferences","$state","EaseConstant","fromTcpaFlow"],b.$inject=["$scope","close","profileInfoFactory","mobileData","$state","EaseConstant"],d.$inject=["$scope","$rootScope","close","profileInfoFactory","mobileData","content","summaryService","$state","EaseConstant"],e.module("personalInformationModule").controller("PersonalInformationController",n).controller("PersonalInformationProfilePicCtrl",o).controller("PersonalInformationEditGreetNameCtrl",t).controller("AddEmailModalController",a).controller("PersonalInfoAddEmailModalCtrl",r).controller("PersonalInfoEditPhoneNumberModalCtrl",s).controller("PersonalInfoDeletePhoneModalCtrl",l).controller("PersonalInfoEditTcpaModalCtrl",i).controller("PersonalInfoConfirmTcpaExitModalCtrl",u).controller("PersonalInfoConfirmModalCtrl",c).controller("PersonalInfoEditSmsCtrl",m).controller("PersonalInfoSuccessSmsCtrl",b).controller("PersonalInfoSmsErrorCtrl",d)});