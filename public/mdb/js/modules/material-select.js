'use strict';

(function ($) {

  var toggleEntryFromArray = function toggleEntryFromArray(entriesArray, entryIndex, select) {

    var index = entriesArray.indexOf(entryIndex);
    var notAdded = index === -1;

    if (notAdded) {

      entriesArray.push(entryIndex);
    } else {

      entriesArray.splice(index, 1);
    }

    select.siblings('ul.dropdown-content').find('li:not(.optgroup)').eq(entryIndex).toggleClass('active');

    select.find('option').eq(entryIndex).prop('selected', notAdded);
    setValueToInput(entriesArray, select);

    return notAdded;
  };

  var setValueToInput = function setValueToInput(entriesArray, select) {

    var value = '';

    for (var count = entriesArray.length, i = 0; i < count; i++) {

      var text = select.find('option').eq(entriesArray[i]).text();

      if (i === 0) {

        value += text;
      } else {

        value += ', ' + text;
      }
    }

    if (value === '') {

      value = select.find('option:disabled').eq(0).text();
    }

    select.siblings('input.select-dropdown').val(value);
  };

  var guid = function guid() {

    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c === 'x' ? r : r & 0x3 | 0x8).toString(16);
    });
    return uuid;
  };

  var applySeachInList = function applySeachInList() {

    var $this = $(this);
    var ul = $this.closest('ul');
    var searchValue = $this.val();
    var opts = ul.find('li span.filtrable');

    opts.each(function () {

      var $option = $(this);
      if (typeof this.outerHTML === 'string') {

        var liValue = this.textContent.toLowerCase();

        if (liValue.indexOf(searchValue.toLowerCase()) === -1) {

          $option.hide().parent().hide();
        } else {

          $option.show().parent().show();
        }
      }
    });
  };

  var setSearchableOption = function setSearchableOption($select, options) {

    var placeholder = $select.attr('searchable');
    var element = $('<span class="search-wrap ml-2"><div class="md-form mt-0"><input type="text" class="search form-control" placeholder="' + placeholder + '"></div></span>');

    options.append(element);
    element.find('.search').keyup(applySeachInList);
  };

  $.fn.material_select = function (callback) {

    $(this).each(function () {

      var $select = $(this);

      if ($select.hasClass('browser-default')) {
        return;
      }

      var multiple = Boolean($select.attr('multiple'));
      var lastID = $select.data('select-id');

      if (lastID) {

        $select.parent().find('span.caret').remove();
        $select.parent().find('input').remove();

        $select.unwrap();
        $('ul#select-options-' + lastID).remove();
      }

      if (callback === 'destroy') {

        $select.data('select-id', null).removeClass('initialized');
        return;
      }

      var uniqueID = guid();
      $select.data('select-id', uniqueID);

      var wrapper = $('<div class="select-wrapper"></div>');
      wrapper.addClass($select.attr('class'));

      var options = $('<ul id="select-options-' + uniqueID + '" class="dropdown-content select-dropdown ' + (multiple ? 'multiple-select-dropdown' : '') + '"></ul>');
      var selectChildren = $select.children('option, optgroup');
      var valuesSelected = [];

      var label = $select.find('option:selected').html() || $select.find('option:first').html() || '';
      var searchable = Boolean($select.attr('searchable'));

      var optionsHover = false;

      if (searchable) {
        setSearchableOption($select, options);
      }

      var appendOptionWithIcon = function appendOptionWithIcon(options, option, type) {

        var disabledClass = option.is(':disabled') ? 'disabled ' : '';
        var optgroupClass = type === 'optgroup-option' ? 'optgroup-option ' : '';

        var iconUrl = option.data('icon');
        var classes = option.attr('class');
        if (iconUrl) {

          var classString = '';
          if (classes) {

            classString = ' class="' + classes + '"';
          }

          if (type === 'multiple') {

            options.append($('<li class="' + disabledClass + '"><img alt="" src="' + icon_url + '"' + classString + '><span class="filtrable"><input class="form-check-input" type="checkbox"' + disabledClass + '/><label></label>' + option.html() + '</span></li>'));
          } else {

            options.append($('<li class="' + disabledClass + optgroupClass + '"><img alt="" src="' + iconUrl + '"' + classString + '><span class="filtrable">' + option.html() + '</span></li>'));
          }

          return true;
        }

        if (type === 'multiple') {

          options.append($('<li class="' + disabledClass + '"><span class="filtrable"><input class="form-check-input" type="checkbox"' + disabledClass + '/><label></label>' + option.html() + '</span></li>'));
        } else {

          options.append($('<li class="' + disabledClass + optgroupClass + '"><span class="filtrable">' + option.html() + '</span></li>'));
        }
      };

      if (selectChildren.length) {

        selectChildren.each(function () {

          var $this = $(this);
          if ($this.is('option')) {

            if (multiple) {

              appendOptionWithIcon(options, $this, 'multiple');
            } else {

              appendOptionWithIcon(options, $this);
            }
          } else if ($this.is('optgroup')) {

            var selectOptions = $this.children('option');
            options.append($('<li class="optgroup"><span>' + $this.attr('label') + '</span></li>'));

            selectOptions.each(function () {

              appendOptionWithIcon(options, $(this), 'optgroup-option');
            });
          }
        });
      }

      var hasOptgroup = Boolean($select.find('optgroup').length);

      var saveSelect = $select.parent().find('button.btn-save');
      var setSaveOption = function setSaveOption() {
        options.append(saveSelect);
      };
      if (saveSelect.length) {
        setSaveOption();
        saveSelect.on('click', function () {
          $('input.select-dropdown').trigger('close');
        });
      }

      options.find('li:not(.optgroup)').each(function (i) {

        $(this).click(function (e) {

          var $this = $(this);

          if (!$this.hasClass('disabled') && !$this.hasClass('optgroup')) {

            var selected = true;

            if (multiple) {

              $('input[type="checkbox"]', this).prop('checked', function (i, v) {
                return !v;
              });

              if (searchable) {

                if (hasOptgroup) {

                  selected = toggleEntryFromArray(valuesSelected, $this.index() - $this.prevAll('.optgroup').length - 1, $select);
                } else {

                  selected = toggleEntryFromArray(valuesSelected, $this.index() - 1, $select);
                }
              } else if (hasOptgroup) {

                selected = toggleEntryFromArray(valuesSelected, $this.index() - $this.prevAll('.optgroup').length, $select);
              } else {

                selected = toggleEntryFromArray(valuesSelected, $this.index(), $select);
              }

              $newSelect.trigger('focus');
            } else {

              options.find('li').removeClass('active');
              $this.toggleClass('active');
              $newSelect.val($this.text());
            }

            activateOption(options, $this);
            $select.find('option').eq(i).prop('selected', selected);
            $select.trigger('change');

            if (typeof callback !== 'undefined') {

              callback();
            }
          }

          e.stopPropagation();
        });
      });

      $select.wrap(wrapper);
      var dropdownIcon = $('<span class="caret">&#9660;</span>');
      if ($select.is(':disabled')) {

        dropdownIcon.addClass('disabled');
      }

      var sanitizedLabelHtml = label.replace(/"/g, '&quot;');

      var $newSelect = $('<input type="text" class="select-dropdown" readonly="true" ' + ($select.is(':disabled') ? 'disabled' : '') + ' data-activates="select-options-' + uniqueID + '" value="' + sanitizedLabelHtml + '"/>');
      $select.before($newSelect);
      $newSelect.before(dropdownIcon);

      $newSelect.after(options);
      if (!$select.is(':disabled')) {

        $newSelect.dropdown({
          hover: false,
          closeOnClick: false
        });
      }

      if ($select.attr('tabindex')) {

        $($newSelect[0]).attr('tabindex', $select.attr('tabindex'));
      }

      $select.addClass('initialized');

      $newSelect.on({
        focus: function focus() {

          var $this = $(this);
          if ($('ul.select-dropdown').not(options[0]).is(':visible')) {

            $('input.select-dropdown').trigger('close');
          }

          if (!options.is(':visible')) {

            $this.trigger('open', ['focus']);

            var _label = $this.val();
            var selectedOption = options.find('li').filter(function () {

              return $(this).text().toLowerCase() === _label.toLowerCase();
            })[0];

            activateOption(options, selectedOption);
          }
        },
        click: function click(e) {

          e.stopPropagation();
        }
      });

      $newSelect.on('blur', function () {

        if (!multiple && !searchable) {

          $(this).trigger('close');
        }

        options.find('li.selected').removeClass('selected');
      });

      if (!multiple && searchable) {

        options.find('li').on('click', function () {

          $newSelect.trigger('close');
        });
      }

      options.hover(function () {

        optionsHover = true;
      }, function () {

        optionsHover = false;
      });

      options.on('mousedown', function (e) {

        if ($('.modal-content').find(options).length) {

          if (this.scrollHeight > this.offsetHeight) {

            e.preventDefault();
          }
        }
      });

      $(window).on({
        click: function click() {

          (multiple || searchable) && (optionsHover || $newSelect.trigger('close'));
        }
      });

      if (multiple) {

        $select.find('option:selected:not(:disabled)').each(function () {

          var index = $(this).index();

          toggleEntryFromArray(valuesSelected, index, $select);
          options.find('li').eq(index).find(':checkbox').prop('checked', true);
        });
      }

      var activateOption = function activateOption(collection, newOption) {

        if (newOption) {

          collection.find('li.selected').removeClass('selected');

          var option = $(newOption);
          option.addClass('selected');
        }
      };

      var filterQuery = [];
      var onKeyDown = function onKeyDown(e) {

        var isTab = e.which === 9;
        var isEsc = e.which === 27;
        var isEnter = e.which === 13;
        var isArrowUp = e.which === 38;
        var isArrowDown = e.which === 40;

        if (isTab) {
          $newSelect.trigger('close');
          return;
        }

        if (isArrowDown && !options.is(':visible')) {
          $newSelect.trigger('open');
          return;
        }

        if (isEnter && !options.is(':visible')) {
          return;
        }

        e.preventDefault();

        // CASE WHEN USER TYPE LETTERS
        var letter = String.fromCharCode(e.which).toLowerCase();
        var nonLetters = [9, 13, 27, 38, 40];

        var isLetterSearchable = letter && nonLetters.indexOf(e.which) === -1;

        if (isLetterSearchable) {

          filterQuery.push(letter);

          var string = filterQuery.join('');
          var _newOption = options.find('li').filter(function () {

            return $(this).text().toLowerCase().indexOf(string) === 0;
          })[0];

          if (_newOption) {

            activateOption(options, _newOption);
          }
        }

        if (isEnter) {

          var activeOption = options.find('li.selected:not(.disabled)')[0];
          if (activeOption) {

            $(activeOption).trigger('click');
            if (!multiple) {

              $newSelect.trigger('close');
            }
          }
        }

        if (isArrowDown) {

          if (options.find('li.selected').length) {

            newOption = options.find('li.selected').next('li:not(.disabled)')[0];
          } else {

            newOption = options.find('li:not(.disabled)')[0];
          }
          activateOption(options, newOption);
        }

        if (isEsc) {

          $newSelect.trigger('close');
        }

        if (isArrowUp) {

          newOption = options.find('li.selected').prev('li:not(.disabled)')[0];
          if (newOption) {

            activateOption(options, newOption);
          }
        }

        setTimeout(function () {

          filterQuery = [];
        }, 1000);
      };

      $newSelect.on('keydown', onKeyDown);
    });
  };
})(jQuery);

jQuery('select').siblings('input.select-dropdown').on('mousedown', function (e) {
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    if (e.clientX >= e.target.clientWidth || e.clientY >= e.target.clientHeight) {
      e.preventDefault();
    }
  }
});
