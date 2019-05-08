// general js for the project that wouldn't be a reuseable component

// cahe buster for impression pixel
var axel = Math.random() + "";
var a = parseInt(axel * 10000000000000);
// loop through all and replace
$('.js-tracking-timestamp').each(function() {
  // identify what link reference to use, href or src
  var elementLinkType;
  if ($(this).attr('href')) {
    elementLinkType = 'href';
  } else if ($(this).attr('src')) {
    elementLinkType = 'src';
  }
  var pixelLink = $(this).attr(elementLinkType); // capture link
  var newPixelLink = pixelLink.replace(/\[timestamp\]/g, a); // replace timestamp with randomly generated number
  $(this).attr(elementLinkType, newPixelLink); // write to element
});