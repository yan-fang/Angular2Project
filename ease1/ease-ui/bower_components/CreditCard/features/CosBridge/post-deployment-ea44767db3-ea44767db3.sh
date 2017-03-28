#!/usr/bin/env bash


function run(){
    echo "Post deploy script for CosBridge"
    findPathToEaseUI
    setCosModeToTrue
    addCosBridgeClassToBodyTag
    setBaseUrl
    disableAccountSummaryAPICall
    enableCosCookieAuthentication
    disableEaseTimeout
    enableL3Feedback
}

function findPathToEaseUI(){
    # Path to this script
    DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
    EASE_UI="$DIR/../../../.."
    echo "Path to ease-ui directory is $EASE_UI"
}

function setCosModeToTrue(){
    # Set cosmode variable on index page
    INDEX_PATH="$EASE_UI/index.html"
    sed -i -e "s/\(cosMode = \).*/cosMode = true;/" $INDEX_PATH
    echo "Updated cosmode to true"
}

function addCosBridgeClassToBodyTag(){
    INDEX_PATH="$EASE_UI/index.html"
    sed -i -e "s/\(class=\"\"\).*/class=\"cos-bridge\" >/" $INDEX_PATH
    echo "Added cos-bridge class to body tag"
}

function setBaseUrl(){
    # Set baseurl to current domain
    EASE_PROP="$EASE_UI/dist/utils/constants/easeProperties.js"
    # Both these methods are needed to cover both GNU and non-GNU versions of SED
    sed -i -e '1,/RE/s/\(baseUrl: \).*/baseUrl: "\/api",/' $EASE_PROP
    sed -i -e '0,/RE/s/\(baseUrl: \).*/baseUrl: "\/api",/' $EASE_PROP
    echo "Updated baseUrl to '/api'"
}

function disableAccountSummaryAPICall(){
    APPJS_PATH="$EASE_UI/dist/app.js"
    sed -i -e "s/\(summaryService.set();\).*/\/\/summaryService.set();/" $APPJS_PATH
    echo "Disabled account summary API call"

}

function enableCosCookieAuthentication(){
    EASE_UTILS_PATH="$EASE_UI/dist/utils/utilities/easeUtils.js"


    AUTH_FACTORY_DEPS="}).factory('authenticationFactory', \[\"\$sessionStorage\", \"\$q\", \"EaseConstant\", \"\$rootScope\", \"summaryService\", function(\$sessionStorage, \$q, EaseConstant, \$rootScope, summaryService) {";
    AUTH_FACTORY_DEPS_WITH_APP_COOKIE="}).factory('authenticationFactory', \[\"\$sessionStorage\", \"\$q\", \"EaseConstant\", \"\$rootScope\", \"summaryService\", \"appCookie\", function(\$sessionStorage, \$q, EaseConstant, \$rootScope, summaryService, appCookie) {";
    sed -i -e "s/\($AUTH_FACTORY_DEPS\).*/$AUTH_FACTORY_DEPS_WITH_APP_COOKIE/" $EASE_UTILS_PATH

    UNDEFINED_CHECK="if (typeof sessionData === 'undefined') {"
    C1_CSID_AUTH="var c1Csid = appCookie.read('C1_CSID'); \
    if(c1Csid !== null){\
     \$sessionStorage.isAuthenticated = true; \
    \$sessionStorage.profileReferenceId = c1Csid;\
     \$sessionStorage.loggedIn = true;\
     } \
     \
     $UNDEFINED_CHECK"

    sed -i -e "s/\($UNDEFINED_CHECK\).*/$C1_CSID_AUTH/" $EASE_UTILS_PATH


    echo "Enabled COS cookie authentication"
}

function disableEaseTimeout(){
    APPJS_PATH="$EASE_UI/dist/app.js"
    sed -i -e "s/\(IdleProvider.idle(EaseConstant.kIdleTime);\).*/\/\/IdleProvider.idle(EaseConstant.kIdleTime);/" $APPJS_PATH
    sed -i -e "s/\(IdleProvider.timeout(EaseConstant.kTimeoutTime);\).*/\/\/IdleProvider.timeout(EaseConstant.kTimeoutTime););/" $APPJS_PATH
    echo "Disabled EASE timeout"
}

function enableL3Feedback(){
    EASE_UTILS_PATH="$EASE_UI/dist/utils/utilities/easeUtils.js"

    FIND="return lobObj\[type.toUpperCase()\];"
    REPLACE="return lobObj\['CC'\];"

    sed -i -e "s/\($FIND\).*/$REPLACE/" $EASE_UTILS_PATH

}
run



