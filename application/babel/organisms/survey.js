var survey = {
  //  INITIALIZE
  init: function() {
    $(document).off('keydown')
    $('.wrapper').removeClass('start').addClass('questions')
    $('#present li').removeAttr('class')
    surveyListeners()
    this.questionsPush()
    this.navigate($('#navigation li:first-child a').attr('href'))
    setTimeout(function() {
      $('#present').remove()
    }, 500)
  },
  //  ALL QUESTIONS
  allQuestions: [],
  //  QUESTIONS PUSH
  questionsPush: function() {
    for (i = 0; i < $('#navigation li').length; i++) {
      var name = $('#navigation li:nth-child('+(i+1)+') a').attr('href')
      this.allQuestions.push(name.split('#')[1])
    }
  },
  //  CHANGE HASH
  changeHash: function(hash) {
    window.location.hash = hash
  },
  //  NAVIGATE
  navigate: function(target) {
    if(!$('.wrapper').hasClass('submiting')) {
      if(target == 'previous' && $('#navigation li:first-child').hasClass('current')) return
      if(target == 'next' && $('#navigation li:last-child').hasClass('current')) {
        this.submit()
        return
      }

      if(target == 'previous')
        target = $('#navigation .current').prev().find('a').attr('href')
      else if(target == 'next') {
        target = $('#navigation .current').next().find('a').attr('href')
        if($('.wrapper').hasClass('impressionNow')
        && $('#questions > li[data-name="impressionNow"] input:checked').val() == 'Nope') {
          target = '#value'
        }
      }

      var item = $('#navigation a[href="'+target+'"]').parent()
      var question = $('#questions > li[data-name="'+target.split('#')[1]+'"]')

      $('#navigation li').removeAttr('class')
      item.addClass('current')
      item.prevAll().addClass('achieved')
      item.nextAll().removeClass('achieved')

      $('#questions > li').removeAttr('class')
      question.addClass('current')

      var index = item.index() + 1
      $('#currentQuestion li').removeAttr('class')
      $('#currentQuestion li:nth-child('+index+')').addClass('current')

      $('.wrapper').removeClass(this.allQuestions.join(' ')).addClass(target.split('#')[1])

      //  BLUR AND FOCUS
      $('*').blur()
      if(question.find('input[type=text], textarea').length) {
        setTimeout(function() {
          if(question.find('input[type=text], textarea').length == 1)
            question.find('input[type=text], textarea').focus()
          else
            question.find('.field:first-child').find('input[type=text], textarea').focus()
        }, 500)
      }

      this.changeHash(target)
    }
  },
  //  SUBMIT
  submit: function() {
    if(!$('.wrapper').hasClass('submiting')) {
      iterationCount()
      $('#callback li:nth-child(1)').addClass('current')
      $('#questions > li').removeClass('current')
      $('.wrapper').addClass('submiting')

      //  SEND REQUEST HERE
      var status = 'success'
      this.callback(status)
    }
  },
  //  CALLBACK
  callback: function(status) {
    var that = this
    $('.wrapper').addClass('callback')
    iterationClear()

    setTimeout(function() {
      if(status == 'success') {
        $('.wrapper').addClass('success')
        history.pushState('', document.title, window.location.pathname)

        $('#land .text li').removeClass('current')
        setTimeout(function() {
          $('#land .text li:nth-child(2)').addClass('current')
          setTimeout(function() {
            $('#land .text li').removeClass('current')
            setTimeout(function() {
              $('#land .text li:nth-child(3)').addClass('current')
            }, 150)
          }, 4000)
        }, 150)

        setTimeout(function() {
          $(document).off('keydown')
          $('#survey, #nucubuc, #callback').remove()
          $('.wrapper').removeClass('submiting questions ' + that.allQuestions.join(' '))
        }, 2000)
      } else {
        $('.wrapper').addClass('error')
        $('#callback li').removeClass('current')
        $('#callback li:nth-child(2)').addClass('current')
        setTimeout(function() {
          $('.wrapper').removeClass('submiting callback error')
          $('#callback li').removeClass('current')
          $('#questions > li:last-child').addClass('current')
        }, 4000)
      }
    }, 1500)
  }
}

//  SURVEY LISTENERS
function surveyListeners() {
  $('#navigation a').on('click', function(e) {
    var target = $(this).attr('href')
    survey.navigate(target)
    e.preventDefault()
  })

  //  PREVIOUS
  $('#previous').on('click', function(e) {
    survey.navigate('previous')
    e.preventDefault()
  })

  //  NEXT
  $('#next').on('click', function(e) {
    survey.navigate('next')
    e.preventDefault()
  })

  //  KEYS
  $(document).keydown(function(event) {
    var tabKey = 9
    if(event.keyCode == tabKey) {
      if(event.shiftKey) survey.navigate('previous')
      else if(!$('#navigation li:last-child').hasClass('current')) survey.navigate('next')
      event.preventDefault()
    }
  })
}
