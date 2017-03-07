define([
  'angular'
], function(angular) {
  'use strict';
  var globalFooterModule = angular.module('GlobalFooterModule', []);

  globalFooterModule.directive('footerSubmenu', ['$document',function($document) {
    return {
      restrict: 'A',
      secope:{
        footerSubmenu: '='
      },
      link: function(scope, element, attrs) {
        var addMyClass = function(classToAdd){
          var myClasses = ['footerHover', 'footerClick'];
          for (var cCl in myClasses){
            if (myClasses[cCl] === classToAdd){
              element.addClass(classToAdd);
            }else{
              element.removeClass(myClasses[cCl]);
            }
          }
        };

        function togglePopup(onlyIfOpen) {
          if(!element.hasClass('footerClick')) {
            if (!onlyIfOpen) {
              angular.element($document[0].querySelectorAll('li.has-children')).removeClass('footerClick');
              addMyClass('footerClick');
              var el = element.find('ul').children()[0];
              el.firstChild.focus();
            }
          } else {
            element.removeClass('footerClick');
          }
        }

        element.bind('click', function(event) {
          togglePopup();
        });

        element.bind('focus', function(event) {
          if(attrs.footerSubmenu == 'false') {
            angular.element($document[0].querySelectorAll('li.has-children')).removeClass('footerClick');
          }
        });

        element.bind('keyup',function(evt){
          if(evt.which === 13 || evt.which === 48) {
            togglePopup();
          } else if (evt.which === 27) {
            togglePopup(true);
          }
        });
      }
    };
  }]);

  globalFooterModule.controller('GlobalFooterController',['$scope', '$rootScope', 'EaseConstantFactory',
    'EASEUtilsFactory', 'EaseLocalizeService', 'appCookie',
    'ContentConstant', 'EaseConstant', 'featureToggleFactory', '$window', '$timeout','customerPlatformDetailsFactory', '$state',
    function($scope, $rootScope, EaseConstantFactory, EASEUtilsFactory, EaseLocalizeService,
      appCookie, ContentConstant, EaseConstant, featureToggleFactory, $window,
      $timeout,	customerPlatformDetailsFactory, $state) {
      var vm = this;
      var data = {
         "norton":"/EASE/images/CORE/Footer/norton.jpg",
         "fdic":"/EASE/images/CORE/Footer/fdic.jpg",
         "core_global_footer_disclaimer":{
            "article":{
               "section":{
                  "body":"<p><strong>Securities and services are: Not FDIC insured &#8226; Not bank guaranteed &#8226; May lose value &#8226; Not a deposit &#8226; Not Insured by any Federal Government Agency</strong><br />Banking, Credit Card, Auto Finance, and Home Loan products and services are offered by the Capital One family of companies, including Capital One Bank (USA), N.A. and Capital One, N.A., NMLS ID 453156, Members FDIC. Equal Housing Lender.<br />All entities are separate but affiliated legal entities of Capital One Financial Corporation, each is responsible for its own products and services.<br />Securities are offered by Capital One Investing, LLC, a registered broker-dealer and Member <a href=\"http://www.finra.org/\" target=\"_blank\">FINRA</a>/<a href=\"http://www.sipc.org/\" target=\"_blank\">SIPC</a>. Advisory services are provided by Capital One Advisors, LLC, an SEC registered investment advisor. Insurance products are offered through Capital One Agency LLC. All are subsidiaries of Capital One Financial Corporation.</p>"
               }
            }
         },
         "house":"/EASE/images/CORE/Footer/house.jpg",
         "core_global_footer_en_US":{
            "ease.core.footer.aboutus.label":"ABOUT US",
            "ease.core.footer.aboutus.investing.link":"http://www.capitaloneinvestingforgood.com/",
            "ease.core.footer.products.link":"https://www.capitalone.com/",
            "ease.core.footer.feedback.label":"FEEDBACK",
            "ease.core.footer.careers.label":"CAREERS",
            "ease.core.footer.disclosures.link":"https://www.capitalone.com/legal/disclosures/",
            "ease.core.footer.aboutus.abtcapone.label":"About Capital One",
            "ease.core.footer.accessibility.label":"ACCESSIBILITY",
            "ease.core.footer.help.label":"HELP",
            "ease.core.footer.aboutus.press.link":"http://press.capitalone.com/phoenix.zhtml?c=251626&p=irol-overview",
            "ease.core.footer.contactus.label":"CONTACT US",
            "ease.core.footer.norton.link":"https://sealinfo.verisign.com/splash?form_file=fdf/splash.fdf&lang=en&dn=services.capitalone.com",
            "ease.core.footer.accessibility.link":"https://www.capitalone.com/about/accessibility-commitment/",
            "ease.core.footer.siteinfo.label":"This site provides information about and access to financial services offered by the Capital One family of companies, including Capital One Bank (USA), N.A. and Capital One, N.A., Members FDIC. See your account agreement for information about the Capital One company servicing your individual accounts. Capital One does not provide, endorse, nor guarantee and is not liable for third party products, services, educational tools, or other information available throughout this site.",
            "ease.core.footer.legal.wolfsberg.link":"https://www.capitalone.com/media/doc/corporate/wolfsberg.pdf",
            "ease.core.footer.legal.ingtrademark.link":"https://www.capitalone.com/legal/ing-trademark-disclaimer/",
            "ease.core.footer.legal.patriotact.link":"https://www.capitalone.com/media/doc/corporate/foreign-bank-account-certification-Capital-One.pdf",
            "ease.core.footer.security.label":"SECURITY",
            "ease.core.footer.aboutus.investing.label":"Investing for Good",
            "ease.core.footer.beta.terms.link":"https://www.capitalone.com/sneakpeek/terms-conditions/",
            "ease.core.footer.fullsite.label":"FULL SITE",
            "ease.core.footer.terms.label":"TERMS & CONDITIONS",
            "ease.core.footer.legal.wolfsberg.label":"Wolfsberg Questionnaire",
            "ease.core.footer.disclosures.label":"Read additional important disclosures.",
            "ease.core.footer.terms.link":"https://www.capitalone.com/corporate/terms/",
            "ease.core.footer.legal.reliefact.label":"Servicemembers Civil Relief Act",
            "ease.core.footer.lender.aria.label":"Equal Housing Lender",
            "ease.core.footer.legal.patriotact.label":"Patriot Act Cert",
            "ease.core.footer.products.label":"PRODUCTS",
            "ease.core.footer.legal.subpoena.label":"Subpoena Policy",
            "ease.core.footer.security.link":"https://www.capitalone.com/identity-protection/commitment/",
            "ease.core.footer.help.link":"https://www.capitalone.com/support/",
            "ease.core.footer.contactus.link":"https://www.capitalone.com/contact/",
            "ease.core.footer.legal.reliefact.link":"https://www.capitalone.com/about/military/",
            "ease.core.footer.legal.subpoena.link":"https://www.capitalone.com/legal/subpoena-policy/",
            "ease.core.footer.privacy.label":"PRIVACY",
            "ease.core.footer.aboutus.investors.label":"Investors",
            "ease.core.footer.norton.aria.label":"Norton",
            "ease.core.footer.legal.addldisclosures.link":"https://www.capitalone.com/legal/disclosures/",
            "ease.core.footer.aboutus.press.label":"Press",
            "ease.core.footer.aria.label":"footer",
            "ease.core.footer.legal.ingtrademark.label":"ING Trademark Disclaimer",
            "ease.core.footer.aboutus.investors.link":"http://phx.corporate-ir.net/phoenix.zhtml?c=70667&p=irol-irhome",
            "ease.core.footer.aboutus.abtcapone.link":"https://www.capitalone.com/about/",
            "ease.core.footer.legal.label":"LEGAL",
            "ease.core.footer.copyright.label":"Capital One is a federally registered trademark. All rights reserved.",
            "ease.core.footer.privacy.link":"https://www.capitalone.com/identity-protection/privacy/",
            "ease.core.footer.fdic.link":"https://www.fdic.gov/",
            "ease.core.footer.legal.addldisclosures.label":"Additional Disclosures",
            "ease.core.footer.careers.link":"http://www.capitalonecareers.com/",
            "ease.core.footer.fdic.aria.label":"Member FDIC"
         }
      };
      vm.isFeedbackButtonDisplay = false;

      featureToggleFactory.initializeFeatureToggleData(EaseConstant.features.usabillaFeature).
        then(function(toggledata){
          vm.isFeedbackButtonDisplay = toggledata[EaseConstant.features.usabillaFeature];
      });

      customerPlatformDetailsFactory.initializeCustomerPlatform().then(function (data) {
        vm.isFullSiteLink = data.customerPlatform.indexOf('EASEM') === -1 &&  data.customerPlatform.indexOf('EASEW') > -1;
        if(vm.isFullSiteLink) {
          vm.fullSiteUrl = data.fullsiteUrl;
        }
        vm.termsAndCondition = data.customerPlatform.indexOf('EASEM') === -1 &&
          data.customerPlatform.indexOf('EASEW') === -1 &&
          data.customerPlatform.indexOf('EASE') > -1;
      });

      vm.contentDataGlobalFooter = data[ContentConstant.kCoreGlobalFooter + ContentConstant.kLanguagePreferences];
      vm.house = 'https://content.capitalone.com' + data[ContentConstant.kCoreGlobalFooterHouseImg];
      vm.norton = 'https://content.capitalone.com' + data[ContentConstant.kCoreGlobalFooterNortonImg];
      vm.fdic = 'https://content.capitalone.com' + data[ContentConstant.kCoreGlobalFooterFdicImg];
      vm.disclaimer = data[ContentConstant.kCoreGlobalFooterArticle].article.section.body;

      $scope.service = EASEUtilsFactory;
      $scope.$watch('service.IsFooterDisplayValue', function(newVal) {
        vm.IsDisplayFooter = newVal;
      });

      angular.extend(vm, {
          displayFooter: function () {
            if($state.current.name === "migrate") {
              return '';
            } else {
              return '/ease-ui/dist/features/GlobalFooter/html/GlobalFooter-index.html';
            }
          },
          termsAndConditionLink: function () {
            if (vm.contentDataGlobalFooter !== undefined) {
              if (vm.termsAndCondition) {
                return vm.contentDataGlobalFooter['ease.core.footer.beta.terms.link'];
              }
              else {
                return vm.contentDataGlobalFooter['ease.core.footer.terms.link'];
              }
          }
          }
        ,
       createCookie: function() {
          appCookie.create('easeBetaOptOut', 'true');
        appCookie.erase('C1_TARGET');
        appCookie.erase('C1_DEEPLINK');  
       },
        currentYear: new Date().getFullYear(),
        openFeedback: function() {
          'usabilla_live' in $window && $window.usabilla_live('click');
        }
      });
    }])

  return globalFooterModule;
});
