'use strict';

(function ($) {

  $(document).ready(function () {

    $.fn.reverse = [].reverse;

    $(document).on('mouseenter.fixedActionBtn', '.fixed-action-btn:not(.click-to-toggle)', function () {

      var $this = $(this);
      openFABMenu($this);
    });

    $(document).on('mouseleave.fixedActionBtn', '.fixed-action-btn:not(.click-to-toggle)', function () {

      var $this = $(this);
      closeFABMenu($this);
    });

    $(document).on('click.fixedActionBtn', '.fixed-action-btn.click-to-toggle > a', function () {

      var $this = $(this);
      var $menu = $this.parent();

      if ($menu.hasClass('active')) {

        closeFABMenu($menu);
      } else {

        openFABMenu($menu);
      }
    });
  });

  $.fn.extend({
    openFAB: function openFAB() {

      openFABMenu($(this));
    },
    closeFAB: function closeFAB() {

      closeFABMenu($(this));
    }
  });

  var openFABMenu = function openFABMenu(btn) {

    var fab = btn;
    if (!fab.hasClass('active')) {

      fab.addClass('active');
      var btnList = document.querySelectorAll('ul .btn-floating');
      btnList.forEach(function (el) {

        el.classList.add('shown');
      });
    }
  };

  var closeFABMenu = function closeFABMenu(btn) {

    var fab = btn;

    fab.removeClass('active');
    var btnList = document.querySelectorAll('ul .btn-floating');
    btnList.forEach(function (el) {

      el.classList.remove('shown');
    });
  };

  $('.fixed-action-btn').on('click', function (e) {

    e.preventDefault();
    toggleFABMenu($('.fixed-action-btn'));

    return false;
  });

  function toggleFABMenu(btn) {

    var elem = btn;

    if (elem.hasClass('active')) {

      closeFABMenu(elem);
    } else {

      openFABMenu(elem);
    }
  }
})(jQuery);