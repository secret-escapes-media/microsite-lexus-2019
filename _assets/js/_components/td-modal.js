var tdModal          = $('.js-td-modal'),
    tdModalLaunchBtn = $('.js-open-td-modal'),
    tdModalCloseBtn  = $('.js-close-td-modal');

// opens modal
function tdModalOpen(event){
  if (event) {
    event.preventDefault();
  }
  // disable scrolling on background content
  $('body').addClass('disable-scroll');
  // open modal
  tdModal.fadeIn('250', function(){
    $(this).removeClass('is-closed').addClass('is-open');
  });
}

// closes modal
function tdModalClose(event){
  event.preventDefault();
  // enable scrolling
  $('body').removeClass('disable-scroll');
  // close modal with fade
  tdModal.fadeOut('250', function(){
    $(this).removeClass('is-open').addClass('is-closed');
  });
}


// launches modal when offer is clicked
tdModalLaunchBtn.on('click', function(event) {
  tdModalOpen(event);
});

// launches modal from url queryString
var tdModalQueryString = 'open-td-modal';
if (getQueryStringByName(tdModalQueryString)) {
  tdModalOpen(null);
}

// closes modal on close icon click
tdModalCloseBtn.on('click', function(event) {
  tdModalClose(event);
});

// closes modal on escape key press
$(document).keyup(function(event) {
   if (event.keyCode == 27) {
     tdModalClose(event);
    }
});