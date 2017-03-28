window._tfsc = window._tfsc || {};
_tfsc['staging'] = (function () {
                        if (location.host.match(/.*\.kdc\.capitalone\.com/) != null ||
                            location.host.match(/.*\.cloud.capitalone.com/) != null ||
                            location.host.match(/.*\.clouddqtext.capitalone.com/) != null ||
                            location.host.match(/servicesbeta\.capitalone\.com/) != null ||
                            location.host.match(/servicesbeta1\.capitalone\.com/) != null ||
                            location.host.match(/servicesbeta2\.capitalone\.com/) != null){
                            return [location.host];
                        } else {
                            return [];
                        }
                    })();
_tfsc['production'] = ["myaccounts.capitalone.com","myaccounts-verify.capitalone.com","services.capitalone.com","services1.capitalone.com","services2.capitalone.com"];

_tfsc['STAGING_URL'] = "d2j8jkom7xmn9n.cloudfront.net/psp/cap1enterprise-v1-001/247px.js";
_tfsc['PRODUCTION_URL'] = "d1af033869koo7.cloudfront.net/psp/cap1enterprise-v1-001/247px.js";
_tfsc['CUSTOM_TRACK_URL'] = "d34xv0c5kwdgb0.cloudfront.net/psp/cap1enterprise-v1-001/cpxt.js";
_tfsc['COOKIE_NAME'] = 'sn.pxpath';

 _tfsc.j=function(b){var e=b+'=';var a=document.cookie.split(';');for(var d=0;d<a.length;d++){var f=a[d];while(f.charAt(0)==' '){f=f.substring(1,f.length)}
if(f.indexOf(e)==0){return f.substring(e.length,f.length)}}
return null};_tfsc.getPath=function(){var d=_tfsc.j(_tfsc.COOKIE_NAME);var e=/^(d1af033869koo7\.cloudfront\.net|d2j8jkom7xmn9n\.cloudfront\.net|sd-qa\.s3\.amazonaws\.com|dev-sd\.s3\.amazonaws\.com|d34xv0c5kwdgb0\.cloudfront\.net)\/.*/i;if(null!=d&&e.test(d)){return d}
for(var b=0;b<_tfsc.staging.length;b++){if(location.host==_tfsc.staging[b]){return _tfsc.STAGING_URL}}
for(var a=0;a<_tfsc.production.length;a++){if(location.host==_tfsc.production[a]){return _tfsc.PRODUCTION_URL}}
var c=encodeURIComponent(window.location.href.substring(0,100));return _tfsc.CUSTOM_TRACK_URL+'?msg=DOMAIN_CONFIG_NOT_FOUND&pageUrl='+c};(function(){var c=document.createElement('script');c.type='text/javascript';c.async=true;c.src=document.location.protocol+'//'+_tfsc.getPath();var a=document.getElementsByTagName('script')[0];a.parentNode.insertBefore(c,a)})();