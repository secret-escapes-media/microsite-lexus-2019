// js for the design hotels page
(function ($, root, undefined) {$(function () {'use strict'; // on ready start


///////////////////////////////////////
//      image sliders
///////////////////////////////////////

  // global classes
  var sliderVisibleClass = 'is-visible'
  var sliderNotVisibleClass = 'is-not-visible'

  // replace img elements with div to control aspect ratio. no js gets a normal image
  $('.js-slider-image').each(function() {
    var imageSrc = $(this).attr('src');
    var newDiv = '<div class="js-slider-image slider__image" style="background-image: url(' + imageSrc + ')"></div>';
    $(this).after(newDiv).remove();
  })

  // add classes to show hide images in each slider
  $('.js-slider').each(function() {
    // find elements
    var imagesWrap = $(this).find('.slider__images');
    var images = imagesWrap.children('.slider__image')
    // loop through each image and apply class, keeping the first visible
    for (var i = 0; i < images.length; i++) {
      if (i === 0) {
        $(images[i]).addClass(sliderVisibleClass);
      } else {
        $(images[i]).addClass(sliderNotVisibleClass);
      }
    }
  });

  // left button click
  $('.js-slider-nav').on('click',function(event) {
    event.preventDefault();
    // find elements and data
    var imageClass = '.slider__image';
    var navDirection = $(this).data('slider-nav-direction');
    var currentSlider = $(this).closest('.js-slider');
    var currentImage = currentSlider.find('.' + sliderVisibleClass);
    var nextImage = currentImage.next(imageClass);
    var prevImage = currentImage.prev(imageClass);
    var firstImage = currentSlider.find(imageClass + ':first');
    var lastImage = currentSlider.find(imageClass + ':last');

    function showNextImage() {
      if (nextImage.length === 0) {
        // if there is no image, go back to the start
        firstImage.removeClass(sliderNotVisibleClass).addClass(sliderVisibleClass)
      } else {
        nextImage.removeClass(sliderNotVisibleClass).addClass(sliderVisibleClass)
      }
      currentImage.removeClass(sliderVisibleClass).addClass(sliderNotVisibleClass)
    }

    function showPrevImage() {
      if (prevImage.length === 0) {
        // if there is no image, go back to the end
        lastImage.removeClass(sliderNotVisibleClass).addClass(sliderVisibleClass)
      } else {
        prevImage.removeClass(sliderNotVisibleClass).addClass(sliderVisibleClass)
      }
      currentImage.removeClass(sliderVisibleClass).addClass(sliderNotVisibleClass)
    }

    // checks which button has been clicked and runs function
    switch (navDirection) {
      case 'next':
        showNextImage();
        break;
      case 'prev':
        showPrevImage();
        break;
    }
  })

});})(jQuery, this); // on ready end