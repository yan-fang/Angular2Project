define([], function() {

  function show(element) {
    element.css('display', 'inline-block');
  }

  function hide(element) {
    element.css('display', 'none');
  }

  function each(elements, callback) {
    var element = elements.first();
    callback(element);

    while (true) {
      element = element.next();
      if (element.length === 0) {
        break;
      }
      callback(element);
    }
  }

  function autoLoanCarouselController($element, $timeout) {

    var carousel,
      carouselItemsParent,
      carouselItems,
      carouselItemCount,
      carouselPosition = 0,
      carouselCurrent = 1,
      carouselItemsShown = 1,
      deviceMobile = '425',
      deviceTablet = '1024',
      previousButton = $element.find('button').first(),
      nextButton = previousButton.next(),
      carouselWrapperWidth;

    var initVariables = function() {
      carousel = $element.children();
      carouselItems = $element.find('article');
      carouselItemsParent = carouselItems.parent();
      carouselItemCount = carouselItems.length;
      carouselWrapperWidth = carousel.width() * carouselItemCount;
    };

    /*  CHECK CURRENT POSITION -
     HIDES ARROWS IF POSITION IS AT THE BEGINNING OR END  */
    var checkPosition = function() {
      if (carouselCurrent <= carouselItemsShown) {
        carouselCurrent = carouselItemsShown;
        hide(previousButton);
        show(nextButton);
      } else if (carouselCurrent >= carouselItemCount) {
        carouselCurrent = carouselItemCount;
        hide(nextButton);
        show(previousButton);
      }
    };


    // RESET POSITION, CAROUSEL WITH & CURRENT POSITION
    var resetPosition = function() {
      carouselItemsParent.css('width', carouselWrapperWidth + 'px');
      carouselItemsParent.css('left', '0px');
      carouselCurrent = carouselItemsShown;
      carouselPosition = 0;
      checkPosition();
    };

    var clickPreviousButton = function() {
      carouselCurrent = carouselCurrent - 1;
      carouselPosition = carouselPosition + carouselItems.width();
      carouselItemsParent.css('left', carouselPosition + 'px');
      show(nextButton);
      checkPosition();
    };

    var clickNextButton = function() {
      carouselCurrent = carouselCurrent + 1;
      carouselPosition = carouselPosition - carouselItems.width();
      carouselItemsParent.css('left', carouselPosition + 'px');
      show(previousButton);
      checkPosition();
    };

    previousButton.on('click', clickPreviousButton);
    nextButton.on('click', clickNextButton);



    /* ON RESIZE */
    var browserSizeUpdate = function() {
      var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
        mobileCheck = width <= deviceMobile,
        tabletCheck = width > deviceMobile && width <= deviceTablet,
        desktopCheck = width > deviceTablet;

      if (mobileCheck) {
        carouselItemsShown = 1;
      } else if (tabletCheck) {
        carouselItemsShown = 2;
      } else if (desktopCheck) {
        carouselItemsShown = 3;
      }

      carouselItems.css('width', (carousel.width() - 120)/carouselItemsShown + 'px');

      resetPosition();
    };


    /* INITIALIZE */
    var initCarousel = function() {
      initVariables();
      browserSizeUpdate();
    };

    $timeout(function() {
      initCarousel();
    });

    window.addEventListener('resize', browserSizeUpdate);
  }

  return autoLoanCarouselController;
});

