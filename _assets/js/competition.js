// js for the design hotels page
(function ($, root, undefined) {$(function () {'use strict'; // on ready start

  ////////////////////////////////////////////////////////////////////////////////
  //    Competition form
  ////////////////////////////////////////////////////////////////////////////////


  // setting global variables
  var form = $('.form'); // single form focus
  var unvalidInputs = false; // status for at least one required element missing
  var formInputClass = 'js-form-input';
  var formStepClass = 'js-form-step';
  var formHiddenInputClass = 'js-hidden-inputs';
  var formResultStatementClass = 'js-result-statements';
  var radioButtonClass = 'js-radio-button';
  var inputErrorClass = 'has-error';
  var inputErrorMessageClass = 'input__error-message';
  var errorMessage = {
    'text': 'Fyll inn',
    'email': {
      'blank': 'Fyll inn din e-postadresse',
      'wrong': 'Fyll inn en gyldig e-postadresse'
    },
    'radio': 'Velg ett svar på dette spørsmålet'
  };



  ////////////////////////////////////////////////////////  form on load functions


  // has the competition expired?
  var currentDate = new Date();
  var expiredDate = new Date(form.data('expires'));
  if (currentDate > expiredDate) { // has today's day passed the expired date
    showFormMessage('expired'); // show competition message
  }

  // reset all of the form inputs
  form.trigger("reset");

  // show first step of the entry form
  showFirstStep();

  function showFirstStep() {
    $('.' + formStepClass).hide().first().show(); // hide all and then show the first step
  }



  ///////////////////////////////////////////////////  question choosing functions


  // action for selecting an answer
  $('.js-option-answer').on('click',function(e) {
    e.preventDefault();
    var question = $(this).data('question');
    var chosenValue = $(this).data('value');
    var chosenStatement = $(this).data('statement');
    var questionInput = $('.' + formHiddenInputClass + ' #' + question);
    // save selected answer to hidden form input
    questionInput.val(chosenValue);
    // show selected answer in the final step of form
    var statments = $('.' + formResultStatementClass);
    var thisStatement = statments.find('.js-answer-' + question);
    thisStatement.text(chosenStatement);
    // show the next step and hide current
    var currentStep = $(this).closest('.' + formStepClass);
    var nextStep = currentStep.next('.' + formStepClass);
    currentStep.hide();
    nextStep.show();
    // scroll back to the top on small screen
    if ( window.innerWidth <= 650 ) {
      $('html,body').animate({scrollTop: (form.offset().top - 30)}, 500);
    }
  });

  // choose again functions
  $('.js-reset-choices').on('click',function(e) {
    e.preventDefault();
    showFirstStep();
    $('.' + formHiddenInputClass + ' input').each(function() {
      $(this).val(''); // remove the previous value
    });
  });



  ////////////////////////////////////////////////////////////////  form functions


  form.submit(function(e){
    // reset unvalidInputs status as they need to be checked again
    unvalidInputs = false;
    // check through all form inputs
    checkAllTextInputs();
    checkAllEmailInputs();
    checkAllRadioButtonGroups();
    // is the current form data valid?
    if (unvalidInputs === true) {
      e.preventDefault(); // stop the default submit function
      // scroll to first error
      var firstError = $('.' + formInputClass + '.' + inputErrorClass).first();
      $('html,body').animate({scrollTop: firstError.offset().top}, 500);
    } else {
      // disable submit button so people cant post multiple times accidently
      form.find('button').prop("disabled", true).addClass('is-loading');
    }
  });


  function showFormMessage(messageID) {
    form.addClass('form-message-is-visible'); // set class on entire form for css
    form.find('input, button').prop("disabled", true); // disable all of the form so people cant enter or tab through it
    form.find('a').removeAttr('href'); // remove all links so user cant keyboard nav through them either
    form.find('.message--' + messageID).addClass('is-visible'); // show specific form message
  }



  ///////////////////////////////////////////////////////////////  input functions


  // apply selected style for radio button
  $('.' + radioButtonClass + ' input[type=radio]').on('change',function () {
    var radioGroup = $(this).closest('.' + formInputClass);
    var selectedLabel = $(this).closest('.' + radioButtonClass);
    var selectedClass = 'is-selected';
    // check if it is already selected
    if (!(selectedLabel.hasClass(selectedClass))) {
      radioGroup.find('.' + radioButtonClass + '.' + selectedClass).removeClass(selectedClass);
      selectedLabel.addClass(selectedClass);
    }
  });


  // is this input required for form submission?
  function isInputRequired(formInput, inputErrorMessage){
    if ( typeof $(formInput).data('required') !== 'undefined' ) { // does this input have the required attribute?
      showInputErrorMessage(formInput, inputErrorMessage);
    }
  }


  function showInputErrorMessage(input, inputErrorMessage){
    var inputParentElement = $(input).closest('.' + formInputClass); // find parent container
    var inputErrorElement = inputParentElement.find('.' + inputErrorMessageClass); // look for an existing error message element
    // is there an error message already in this input and does the parent have the class?
    if ( inputParentElement.hasClass(inputErrorClass) && inputErrorElement.length) {
      // find the error message
      var existingInputErrorMessage = inputErrorElement.text();
      // if the messages are not the same, update the element
      if (inputErrorMessage !== existingInputErrorMessage) {
        inputErrorElement.text(inputErrorMessage);
      }
    } else {
      // add in the new element along with the new content
      $(inputParentElement).append('<div class="'+ inputErrorMessageClass + '">' + inputErrorMessage + '</div>'); // add the error message
      $(inputParentElement).addClass(inputErrorClass);
    }
    // if an error is shown that means there is invalid content, set the global status so that the form isn't submitted
    unvalidInputs = true;
    watchInputForCorrectedData(input);
  }


  function removeInputErrorMessage(input) {
    // find the parent and the error elements
    var inputParent = $(input).closest('.' + formInputClass);
    var inputParentErrorClass = inputParent.hasClass(inputErrorClass);
    var inputParentErrorElement = inputParent.find('.' + inputErrorMessageClass);
    // does the input element have an error shown to remove?
    if (inputParentErrorClass && inputParentErrorElement ) {
      inputParent.removeClass(inputErrorClass);
      inputParentErrorElement.remove();
      $(input).off();
    }
  }


  function watchInputForCorrectedData(input) {
    $(input).off(); // remove event hanlder if input is already watched
    // find the type of input as interaction differs
    var inputType = $(input).attr('type');
    // choose method of watching depending on input type
    switch (inputType) {
      case 'text':
        $(input).on('keyup',function() {
          checkAllTextInputs();
        });
        break;
      case 'email':
        $(input).on('keyup',function() {
          checkAllEmailInputs();
        });
      break;
      case 'radio':
        // find the parent option so both can be clicked
        var radioGroup = $(input).closest('.' + formInputClass); // find parent container
        var radioGroupInputs = radioGroup.find('input[type=radio]'); // find all the input options
        $(radioGroupInputs).on('click',function() {
          // any click on a radio button selects, so no need to check if its a valid entry
          removeInputErrorMessage(this);
        });
        break;
      default:
    }
  }


  // check all text inputs in form aren't blank
  function checkAllTextInputs() {
    form.find('input[type=text]').each(function() { // validate all text inputs
      var inputValue = $(this).val();
      if ( inputValue === '' || (/^\s+$/).test(inputValue) ) { // if empty or just whitespace - check if required
        isInputRequired(this, errorMessage.text);
      } else {
        // there is no error with input
        removeInputErrorMessage(this);
      }
    });
  }


  // check all email inputs in form aren't blank and are a valid email format
  function checkAllEmailInputs() {
    form.find('input[type=email]').each(function() {
      var inputValue = $(this).val();
      var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; // this regex formula can test the string against the correct email format of "string@string.string"
      if ( inputValue === '' ) { // if empty or whitespace - check if required
        isInputRequired(this, errorMessage.email.blank);
      } else if (!(emailRegex.test(inputValue))) {
        // reguardless of if its not required the format need to be correct wrong
        showInputErrorMessage(this, errorMessage.email.wrong);
      } else {
        // there is no error with input
        removeInputErrorMessage($(this));
      }
    });
  }


  // find and check that the radio button questions have been answered
  function checkAllRadioButtonGroups() {
    var radioGroups = [];
    // find all groups of radio button inputs
    form.find('input[type=radio]').each(function() {
      var radioGroup = $(this).attr('name');
      if ( radioGroups.indexOf(radioGroup) === -1 ) { // -1 means its not in array
        // if its a new group id, add it to the array
        radioGroups.push(radioGroup);
      }
    });
    // now groups are defined, loop through each to validate
    for (var i = 0; i < radioGroups.length; i++) {
      // find all of the inputs related to this group
      var radioGroupInputs = $('input[type=radio][name=' + radioGroups[i] + ']');
      var radioGroupSelected = false; // set status if an input has been selected
      // if input is selected, change the status for this group
      for (var j = 0; j < radioGroupInputs.length; j++) {
        if (radioGroupInputs[j].checked) {
          radioGroupSelected = true;
        }
      }
      // has no input been selected for this radio group?
      if (!(radioGroupSelected)) {
        // check if this radio group is required
        if ( typeof $(radioGroupInputs[0]).data('required') !== 'undefined' ) {
          showInputErrorMessage(radioGroupInputs[0], errorMessage.radio);
        }
      }
    }
  }

});})(jQuery, this); // on ready end