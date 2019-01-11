'use strict';

(function ($) {

  $(document).on('click.card', '.card', function (e) {

    var $reveal = $(this).find('.card-reveal');

    if ($reveal.length) {

      var $clicked = $(e.target);
      var isTitle = $clicked.is('.card-reveal .card-title');
      var isTitleIcon = $clicked.is('.card-reveal .card-title i');
      var isActivator = $clicked.is('.card .activator');
      var isActivatorIcon = $clicked.is('.card .activator i');

      if (isTitle || isTitleIcon) {

        $reveal.removeClass('show');
      } else if (isActivator || isActivatorIcon) {

        $reveal.addClass('show');
      }
    }
  });

  $('.rotate-btn').on('click', function () {

    var cardId = $(this).attr('data-card');
    $('#' + cardId).toggleClass('flipped');
  });

  $('.card-share > a').on('click', function (e) {

    e.preventDefault();

    $(this).toggleClass('share-expanded').parent().find('div').toggleClass('social-reveal-active');
  });
})(jQuery);