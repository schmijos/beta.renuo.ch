/* ===================================================
 * bootstrap-transition.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#transitions
 * ===================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


  /* CSS TRANSITION SUPPORT (http://www.modernizr.com/)
   * ======================================================= */

  $(function () {

    $.support.transition = (function () {

      var transitionEnd = (function () {

        var el = document.createElement('bootstrap')
          , transEndEventNames = {
               'WebkitTransition' : 'webkitTransitionEnd'
            ,  'MozTransition'    : 'transitionend'
            ,  'OTransition'      : 'oTransitionEnd otransitionend'
            ,  'transition'       : 'transitionend'
            }
          , name

        for (name in transEndEventNames){
          if (el.style[name] !== undefined) {
            return transEndEventNames[name]
          }
        }

      }())

      return transitionEnd && {
        end: transitionEnd
      }

    })()

  })

}(window.jQuery);
/* =========================================================
 * bootstrap-modal.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#modals
 * =========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================= */


!function ($) {

  "use strict"; // jshint ;_;


 /* MODAL CLASS DEFINITION
  * ====================== */

  var Modal = function (element, options) {
    this.options = options
    this.$element = $(element)
      .delegate('[data-dismiss="modal"]', 'click.dismiss.modal', $.proxy(this.hide, this))
    this.options.remote && this.$element.find('.modal-body').load(this.options.remote)
  }

  Modal.prototype = {

      constructor: Modal

    , toggle: function () {
        return this[!this.isShown ? 'show' : 'hide']()
      }

    , show: function () {
        var that = this
          , e = $.Event('show')

        this.$element.trigger(e)

        if (this.isShown || e.isDefaultPrevented()) return

        this.isShown = true

        this.escape()

        this.backdrop(function () {
          var transition = $.support.transition && that.$element.hasClass('fade')

          if (!that.$element.parent().length) {
            that.$element.appendTo(document.body) //don't move modals dom position
          }

          that.$element.show()

          if (transition) {
            that.$element[0].offsetWidth // force reflow
          }

          that.$element
            .addClass('in')
            .attr('aria-hidden', false)

          that.enforceFocus()

          transition ?
            that.$element.one($.support.transition.end, function () { that.$element.focus().trigger('shown') }) :
            that.$element.focus().trigger('shown')

        })
      }

    , hide: function (e) {
        e && e.preventDefault()

        var that = this

        e = $.Event('hide')

        this.$element.trigger(e)

        if (!this.isShown || e.isDefaultPrevented()) return

        this.isShown = false

        this.escape()

        $(document).off('focusin.modal')

        this.$element
          .removeClass('in')
          .attr('aria-hidden', true)

        $.support.transition && this.$element.hasClass('fade') ?
          this.hideWithTransition() :
          this.hideModal()
      }

    , enforceFocus: function () {
        var that = this
        $(document).on('focusin.modal', function (e) {
          if (that.$element[0] !== e.target && !that.$element.has(e.target).length) {
            that.$element.focus()
          }
        })
      }

    , escape: function () {
        var that = this
        if (this.isShown && this.options.keyboard) {
          this.$element.on('keyup.dismiss.modal', function ( e ) {
            e.which == 27 && that.hide()
          })
        } else if (!this.isShown) {
          this.$element.off('keyup.dismiss.modal')
        }
      }

    , hideWithTransition: function () {
        var that = this
          , timeout = setTimeout(function () {
              that.$element.off($.support.transition.end)
              that.hideModal()
            }, 500)

        this.$element.one($.support.transition.end, function () {
          clearTimeout(timeout)
          that.hideModal()
        })
      }

    , hideModal: function () {
        var that = this
        this.$element.hide()
        this.backdrop(function () {
          that.removeBackdrop()
          that.$element.trigger('hidden')
        })
      }

    , removeBackdrop: function () {
        this.$backdrop && this.$backdrop.remove()
        this.$backdrop = null
      }

    , backdrop: function (callback) {
        var that = this
          , animate = this.$element.hasClass('fade') ? 'fade' : ''

        if (this.isShown && this.options.backdrop) {
          var doAnimate = $.support.transition && animate

          this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
            .appendTo(document.body)

          this.$backdrop.click(
            this.options.backdrop == 'static' ?
              $.proxy(this.$element[0].focus, this.$element[0])
            : $.proxy(this.hide, this)
          )

          if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

          this.$backdrop.addClass('in')

          if (!callback) return

          doAnimate ?
            this.$backdrop.one($.support.transition.end, callback) :
            callback()

        } else if (!this.isShown && this.$backdrop) {
          this.$backdrop.removeClass('in')

          $.support.transition && this.$element.hasClass('fade')?
            this.$backdrop.one($.support.transition.end, callback) :
            callback()

        } else if (callback) {
          callback()
        }
      }
  }


 /* MODAL PLUGIN DEFINITION
  * ======================= */

  var old = $.fn.modal

  $.fn.modal = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('modal')
        , options = $.extend({}, $.fn.modal.defaults, $this.data(), typeof option == 'object' && option)
      if (!data) $this.data('modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option]()
      else if (options.show) data.show()
    })
  }

  $.fn.modal.defaults = {
      backdrop: true
    , keyboard: true
    , show: true
  }

  $.fn.modal.Constructor = Modal


 /* MODAL NO CONFLICT
  * ================= */

  $.fn.modal.noConflict = function () {
    $.fn.modal = old
    return this
  }


 /* MODAL DATA-API
  * ============== */

  $(document).on('click.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this = $(this)
      , href = $this.attr('href')
      , $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
      , option = $target.data('modal') ? 'toggle' : $.extend({ remote:!/#/.test(href) && href }, $target.data(), $this.data())

    e.preventDefault()

    $target
      .modal(option)
      .one('hide', function () {
        $this.focus()
      })
  })

}(window.jQuery);

/* ============================================================
 * bootstrap-dropdown.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#dropdowns
 * ============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */


!function ($) {

  "use strict"; // jshint ;_;


 /* DROPDOWN CLASS DEFINITION
  * ========================= */

  var toggle = '[data-toggle=dropdown]'
    , Dropdown = function (element) {
        var $el = $(element).on('click.dropdown.data-api', this.toggle)
        $('html').on('click.dropdown.data-api', function () {
          $el.parent().removeClass('open')
        })
      }

  Dropdown.prototype = {

    constructor: Dropdown

  , toggle: function (e) {
      var $this = $(this)
        , $parent
        , isActive

      if ($this.is('.disabled, :disabled')) return

      $parent = getParent($this)

      isActive = $parent.hasClass('open')

      clearMenus()

      if (!isActive) {
        $parent.toggleClass('open')
      }

      $this.focus()

      return false
    }

  , keydown: function (e) {
      var $this
        , $items
        , $active
        , $parent
        , isActive
        , index

      if (!/(38|40|27)/.test(e.keyCode)) return

      $this = $(this)

      e.preventDefault()
      e.stopPropagation()

      if ($this.is('.disabled, :disabled')) return

      $parent = getParent($this)

      isActive = $parent.hasClass('open')

      if (!isActive || (isActive && e.keyCode == 27)) {
        if (e.which == 27) $parent.find(toggle).focus()
        return $this.click()
      }

      $items = $('[role=menu] li:not(.divider):visible a', $parent)

      if (!$items.length) return

      index = $items.index($items.filter(':focus'))

      if (e.keyCode == 38 && index > 0) index--                                        // up
      if (e.keyCode == 40 && index < $items.length - 1) index++                        // down
      if (!~index) index = 0

      $items
        .eq(index)
        .focus()
    }

  }

  function clearMenus() {
    $(toggle).each(function () {
      getParent($(this)).removeClass('open')
    })
  }

  function getParent($this) {
    var selector = $this.attr('data-target')
      , $parent

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    $parent = selector && $(selector)

    if (!$parent || !$parent.length) $parent = $this.parent()

    return $parent
  }


  /* DROPDOWN PLUGIN DEFINITION
   * ========================== */

  var old = $.fn.dropdown

  $.fn.dropdown = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('dropdown')
      if (!data) $this.data('dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.dropdown.Constructor = Dropdown


 /* DROPDOWN NO CONFLICT
  * ==================== */

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old
    return this
  }


  /* APPLY TO STANDARD DROPDOWN ELEMENTS
   * =================================== */

  $(document)
    .on('click.dropdown.data-api', clearMenus)
    .on('click.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    .on('click.dropdown-menu', function (e) { e.stopPropagation() })
    .on('click.dropdown.data-api'  , toggle, Dropdown.prototype.toggle)
    .on('keydown.dropdown.data-api', toggle + ', [role=menu]' , Dropdown.prototype.keydown)

}(window.jQuery);

/* =============================================================
 * bootstrap-scrollspy.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#scrollspy
 * =============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* SCROLLSPY CLASS DEFINITION
  * ========================== */

  function ScrollSpy(element, options) {
    var process = $.proxy(this.process, this)
      , $element = $(element).is('body') ? $(window) : $(element)
      , href
    this.options = $.extend({}, $.fn.scrollspy.defaults, options)
    this.$scrollElement = $element.on('scroll.scroll-spy.data-api', process)
    this.selector = (this.options.target
      || ((href = $(element).attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
      || '') + ' .nav li > a'
    this.$body = $('body')
    this.refresh()
    this.process()
  }

  ScrollSpy.prototype = {

      constructor: ScrollSpy

    , refresh: function () {
        var self = this
          , $targets

        this.offsets = $([])
        this.targets = $([])

        $targets = this.$body
          .find(this.selector)
          .map(function () {
            var $el = $(this)
              , href = $el.data('target') || $el.attr('href')
              , $href = /^#\w/.test(href) && $(href)
            return ( $href
              && $href.length
              && [[ $href.position().top + (!$.isWindow(self.$scrollElement.get(0)) && self.$scrollElement.scrollTop()), href ]] ) || null
          })
          .sort(function (a, b) { return a[0] - b[0] })
          .each(function () {
            self.offsets.push(this[0])
            self.targets.push(this[1])
          })
      }

    , process: function () {
        var scrollTop = this.$scrollElement.scrollTop() + this.options.offset
          , scrollHeight = this.$scrollElement[0].scrollHeight || this.$body[0].scrollHeight
          , maxScroll = scrollHeight - this.$scrollElement.height()
          , offsets = this.offsets
          , targets = this.targets
          , activeTarget = this.activeTarget
          , i

        if (scrollTop >= maxScroll) {
          return activeTarget != (i = targets.last()[0])
            && this.activate ( i )
        }

        for (i = offsets.length; i--;) {
          activeTarget != targets[i]
            && scrollTop >= offsets[i]
            && (!offsets[i + 1] || scrollTop <= offsets[i + 1])
            && this.activate( targets[i] )
        }
      }

    , activate: function (target) {
        var active
          , selector

        this.activeTarget = target

        $(this.selector)
          .parent('.active')
          .removeClass('active')

        selector = this.selector
          + '[data-target="' + target + '"],'
          + this.selector + '[href="' + target + '"]'

        active = $(selector)
          .parent('li')
          .addClass('active')

        if (active.parent('.dropdown-menu').length)  {
          active = active.closest('li.dropdown').addClass('active')
        }

        active.trigger('activate')
      }

  }


 /* SCROLLSPY PLUGIN DEFINITION
  * =========================== */

  var old = $.fn.scrollspy

  $.fn.scrollspy = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('scrollspy')
        , options = typeof option == 'object' && option
      if (!data) $this.data('scrollspy', (data = new ScrollSpy(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.scrollspy.Constructor = ScrollSpy

  $.fn.scrollspy.defaults = {
    offset: 10
  }


 /* SCROLLSPY NO CONFLICT
  * ===================== */

  $.fn.scrollspy.noConflict = function () {
    $.fn.scrollspy = old
    return this
  }


 /* SCROLLSPY DATA-API
  * ================== */

  $(window).on('load', function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this)
      $spy.scrollspy($spy.data())
    })
  })

}(window.jQuery);
/* ========================================================
 * bootstrap-tab.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#tabs
 * ========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* TAB CLASS DEFINITION
  * ==================== */

  var Tab = function (element) {
    this.element = $(element)
  }

  Tab.prototype = {

    constructor: Tab

  , show: function () {
      var $this = this.element
        , $ul = $this.closest('ul:not(.dropdown-menu)')
        , selector = $this.attr('data-target')
        , previous
        , $target
        , e

      if (!selector) {
        selector = $this.attr('href')
        selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
      }

      if ( $this.parent('li').hasClass('active') ) return

      previous = $ul.find('.active:last a')[0]

      e = $.Event('show', {
        relatedTarget: previous
      })

      $this.trigger(e)

      if (e.isDefaultPrevented()) return

      $target = $(selector)

      this.activate($this.parent('li'), $ul)
      this.activate($target, $target.parent(), function () {
        $this.trigger({
          type: 'shown'
        , relatedTarget: previous
        })
      })
    }

  , activate: function ( element, container, callback) {
      var $active = container.find('> .active')
        , transition = callback
            && $.support.transition
            && $active.hasClass('fade')

      function next() {
        $active
          .removeClass('active')
          .find('> .dropdown-menu > .active')
          .removeClass('active')

        element.addClass('active')

        if (transition) {
          element[0].offsetWidth // reflow for transition
          element.addClass('in')
        } else {
          element.removeClass('fade')
        }

        if ( element.parent('.dropdown-menu') ) {
          element.closest('li.dropdown').addClass('active')
        }

        callback && callback()
      }

      transition ?
        $active.one($.support.transition.end, next) :
        next()

      $active.removeClass('in')
    }
  }


 /* TAB PLUGIN DEFINITION
  * ===================== */

  var old = $.fn.tab

  $.fn.tab = function ( option ) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('tab')
      if (!data) $this.data('tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tab.Constructor = Tab


 /* TAB NO CONFLICT
  * =============== */

  $.fn.tab.noConflict = function () {
    $.fn.tab = old
    return this
  }


 /* TAB DATA-API
  * ============ */

  $(document).on('click.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]', function (e) {
    e.preventDefault()
    $(this).tab('show')
  })

}(window.jQuery);
/* ===========================================================
 * bootstrap-tooltip.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#tooltips
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ===========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* TOOLTIP PUBLIC CLASS DEFINITION
  * =============================== */

  var Tooltip = function (element, options) {
    this.init('tooltip', element, options)
  }

  Tooltip.prototype = {

    constructor: Tooltip

  , init: function (type, element, options) {
      var eventIn
        , eventOut
        , triggers
        , trigger
        , i

      this.type = type
      this.$element = $(element)
      this.options = this.getOptions(options)
      this.enabled = true

      triggers = this.options.trigger.split(' ')

      for (i = triggers.length; i--;) {
        trigger = triggers[i]
        if (trigger == 'click') {
          this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
        } else if (trigger != 'manual') {
          eventIn = trigger == 'hover' ? 'mouseenter' : 'focus'
          eventOut = trigger == 'hover' ? 'mouseleave' : 'blur'
          this.$element.on(eventIn + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
          this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
        }
      }

      this.options.selector ?
        (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
        this.fixTitle()
    }

  , getOptions: function (options) {
      options = $.extend({}, $.fn[this.type].defaults, this.$element.data(), options)

      if (options.delay && typeof options.delay == 'number') {
        options.delay = {
          show: options.delay
        , hide: options.delay
        }
      }

      return options
    }

  , enter: function (e) {
      var defaults = $.fn[this.type].defaults
        , options = {}
        , self

      this._options && $.each(this._options, function (key, value) {
        if (defaults[key] != value) options[key] = value
      }, this)

      self = $(e.currentTarget)[this.type](options).data(this.type)

      if (!self.options.delay || !self.options.delay.show) return self.show()

      clearTimeout(this.timeout)
      self.hoverState = 'in'
      this.timeout = setTimeout(function() {
        if (self.hoverState == 'in') self.show()
      }, self.options.delay.show)
    }

  , leave: function (e) {
      var self = $(e.currentTarget)[this.type](this._options).data(this.type)

      if (this.timeout) clearTimeout(this.timeout)
      if (!self.options.delay || !self.options.delay.hide) return self.hide()

      self.hoverState = 'out'
      this.timeout = setTimeout(function() {
        if (self.hoverState == 'out') self.hide()
      }, self.options.delay.hide)
    }

  , show: function () {
      var $tip
        , pos
        , actualWidth
        , actualHeight
        , placement
        , tp
        , e = $.Event('show')

      if (this.hasContent() && this.enabled) {
        this.$element.trigger(e)
        if (e.isDefaultPrevented()) return
        $tip = this.tip()
        this.setContent()

        if (this.options.animation) {
          $tip.addClass('fade')
        }

        placement = typeof this.options.placement == 'function' ?
          this.options.placement.call(this, $tip[0], this.$element[0]) :
          this.options.placement

        $tip
          .detach()
          .css({ top: 0, left: 0, display: 'block' })

        this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)

        pos = this.getPosition()

        actualWidth = $tip[0].offsetWidth
        actualHeight = $tip[0].offsetHeight

        switch (placement) {
          case 'bottom':
            tp = {top: pos.top + pos.height, left: pos.left + pos.width / 2 - actualWidth / 2}
            break
          case 'top':
            tp = {top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2}
            break
          case 'left':
            tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth}
            break
          case 'right':
            tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width}
            break
        }

        this.applyPlacement(tp, placement)
        this.$element.trigger('shown')
      }
    }

  , applyPlacement: function(offset, placement){
      var $tip = this.tip()
        , width = $tip[0].offsetWidth
        , height = $tip[0].offsetHeight
        , actualWidth
        , actualHeight
        , delta
        , replace

      $tip
        .offset(offset)
        .addClass(placement)
        .addClass('in')

      actualWidth = $tip[0].offsetWidth
      actualHeight = $tip[0].offsetHeight

      if (placement == 'top' && actualHeight != height) {
        offset.top = offset.top + height - actualHeight
        replace = true
      }

      if (placement == 'bottom' || placement == 'top') {
        delta = 0

        if (offset.left < 0){
          delta = offset.left * -2
          offset.left = 0
          $tip.offset(offset)
          actualWidth = $tip[0].offsetWidth
          actualHeight = $tip[0].offsetHeight
        }

        this.replaceArrow(delta - width + actualWidth, actualWidth, 'left')
      } else {
        this.replaceArrow(actualHeight - height, actualHeight, 'top')
      }

      if (replace) $tip.offset(offset)
    }

  , replaceArrow: function(delta, dimension, position){
      this
        .arrow()
        .css(position, delta ? (50 * (1 - delta / dimension) + "%") : '')
    }

  , setContent: function () {
      var $tip = this.tip()
        , title = this.getTitle()

      $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
      $tip.removeClass('fade in top bottom left right')
    }

  , hide: function () {
      var that = this
        , $tip = this.tip()
        , e = $.Event('hide')

      this.$element.trigger(e)
      if (e.isDefaultPrevented()) return

      $tip.removeClass('in')

      function removeWithAnimation() {
        var timeout = setTimeout(function () {
          $tip.off($.support.transition.end).detach()
        }, 500)

        $tip.one($.support.transition.end, function () {
          clearTimeout(timeout)
          $tip.detach()
        })
      }

      $.support.transition && this.$tip.hasClass('fade') ?
        removeWithAnimation() :
        $tip.detach()

      this.$element.trigger('hidden')

      return this
    }

  , fixTitle: function () {
      var $e = this.$element
      if ($e.attr('title') || typeof($e.attr('data-original-title')) != 'string') {
        $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
      }
    }

  , hasContent: function () {
      return this.getTitle()
    }

  , getPosition: function () {
      var el = this.$element[0]
      return $.extend({}, (typeof el.getBoundingClientRect == 'function') ? el.getBoundingClientRect() : {
        width: el.offsetWidth
      , height: el.offsetHeight
      }, this.$element.offset())
    }

  , getTitle: function () {
      var title
        , $e = this.$element
        , o = this.options

      title = $e.attr('data-original-title')
        || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

      return title
    }

  , tip: function () {
      return this.$tip = this.$tip || $(this.options.template)
    }

  , arrow: function(){
      return this.$arrow = this.$arrow || this.tip().find(".tooltip-arrow")
    }

  , validate: function () {
      if (!this.$element[0].parentNode) {
        this.hide()
        this.$element = null
        this.options = null
      }
    }

  , enable: function () {
      this.enabled = true
    }

  , disable: function () {
      this.enabled = false
    }

  , toggleEnabled: function () {
      this.enabled = !this.enabled
    }

  , toggle: function (e) {
      var self = e ? $(e.currentTarget)[this.type](this._options).data(this.type) : this
      self.tip().hasClass('in') ? self.hide() : self.show()
    }

  , destroy: function () {
      this.hide().$element.off('.' + this.type).removeData(this.type)
    }

  }


 /* TOOLTIP PLUGIN DEFINITION
  * ========================= */

  var old = $.fn.tooltip

  $.fn.tooltip = function ( option ) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('tooltip')
        , options = typeof option == 'object' && option
      if (!data) $this.data('tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tooltip.Constructor = Tooltip

  $.fn.tooltip.defaults = {
    animation: true
  , placement: 'top'
  , selector: false
  , template: '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
  , trigger: 'hover focus'
  , title: ''
  , delay: 0
  , html: false
  , container: false
  }


 /* TOOLTIP NO CONFLICT
  * =================== */

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old
    return this
  }

}(window.jQuery);

/* ===========================================================
 * bootstrap-popover.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#popovers
 * ===========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* POPOVER PUBLIC CLASS DEFINITION
  * =============================== */

  var Popover = function (element, options) {
    this.init('popover', element, options)
  }


  /* NOTE: POPOVER EXTENDS BOOTSTRAP-TOOLTIP.js
     ========================================== */

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype, {

    constructor: Popover

  , setContent: function () {
      var $tip = this.tip()
        , title = this.getTitle()
        , content = this.getContent()

      $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
      $tip.find('.popover-content')[this.options.html ? 'html' : 'text'](content)

      $tip.removeClass('fade top bottom left right in')
    }

  , hasContent: function () {
      return this.getTitle() || this.getContent()
    }

  , getContent: function () {
      var content
        , $e = this.$element
        , o = this.options

      content = (typeof o.content == 'function' ? o.content.call($e[0]) :  o.content)
        || $e.attr('data-content')

      return content
    }

  , tip: function () {
      if (!this.$tip) {
        this.$tip = $(this.options.template)
      }
      return this.$tip
    }

  , destroy: function () {
      this.hide().$element.off('.' + this.type).removeData(this.type)
    }

  })


 /* POPOVER PLUGIN DEFINITION
  * ======================= */

  var old = $.fn.popover

  $.fn.popover = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('popover')
        , options = typeof option == 'object' && option
      if (!data) $this.data('popover', (data = new Popover(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.popover.Constructor = Popover

  $.fn.popover.defaults = $.extend({} , $.fn.tooltip.defaults, {
    placement: 'right'
  , trigger: 'click'
  , content: ''
  , template: '<div class="popover"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  })


 /* POPOVER NO CONFLICT
  * =================== */

  $.fn.popover.noConflict = function () {
    $.fn.popover = old
    return this
  }

}(window.jQuery);

/* ==========================================================
 * bootstrap-affix.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#affix
 * ==========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* AFFIX CLASS DEFINITION
  * ====================== */

  var Affix = function (element, options) {
    this.options = $.extend({}, $.fn.affix.defaults, options)
    this.$window = $(window)
      .on('scroll.affix.data-api', $.proxy(this.checkPosition, this))
      .on('click.affix.data-api',  $.proxy(function () { setTimeout($.proxy(this.checkPosition, this), 1) }, this))
    this.$element = $(element)
    this.checkPosition()
  }

  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return

    var scrollHeight = $(document).height()
      , scrollTop = this.$window.scrollTop()
      , position = this.$element.offset()
      , offset = this.options.offset
      , offsetBottom = offset.bottom
      , offsetTop = offset.top
      , reset = 'affix affix-top affix-bottom'
      , affix

    if (typeof offset != 'object') offsetBottom = offsetTop = offset
    if (typeof offsetTop == 'function') offsetTop = offset.top()
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom()

    affix = this.unpin != null && (scrollTop + this.unpin <= position.top) ?
      false    : offsetBottom != null && (position.top + this.$element.height() >= scrollHeight - offsetBottom) ?
      'bottom' : offsetTop != null && scrollTop <= offsetTop ?
      'top'    : false

    if (this.affixed === affix) return

    this.affixed = affix
    this.unpin = affix == 'bottom' ? position.top - scrollTop : null

    this.$element.removeClass(reset).addClass('affix' + (affix ? '-' + affix : ''))
  }


 /* AFFIX PLUGIN DEFINITION
  * ======================= */

  var old = $.fn.affix

  $.fn.affix = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('affix')
        , options = typeof option == 'object' && option
      if (!data) $this.data('affix', (data = new Affix(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.affix.Constructor = Affix

  $.fn.affix.defaults = {
    offset: 0
  }


 /* AFFIX NO CONFLICT
  * ================= */

  $.fn.affix.noConflict = function () {
    $.fn.affix = old
    return this
  }


 /* AFFIX DATA-API
  * ============== */

  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {
      var $spy = $(this)
        , data = $spy.data()

      data.offset = data.offset || {}

      data.offsetBottom && (data.offset.bottom = data.offsetBottom)
      data.offsetTop && (data.offset.top = data.offsetTop)

      $spy.affix(data)
    })
  })


}(window.jQuery);
/* ==========================================================
 * bootstrap-alert.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#alerts
 * ==========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* ALERT CLASS DEFINITION
  * ====================== */

  var dismiss = '[data-dismiss="alert"]'
    , Alert = function (el) {
        $(el).on('click', dismiss, this.close)
      }

  Alert.prototype.close = function (e) {
    var $this = $(this)
      , selector = $this.attr('data-target')
      , $parent

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    $parent = $(selector)

    e && e.preventDefault()

    $parent.length || ($parent = $this.hasClass('alert') ? $this : $this.parent())

    $parent.trigger(e = $.Event('close'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      $parent
        .trigger('closed')
        .remove()
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent.on($.support.transition.end, removeElement) :
      removeElement()
  }


 /* ALERT PLUGIN DEFINITION
  * ======================= */

  var old = $.fn.alert

  $.fn.alert = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('alert')
      if (!data) $this.data('alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.alert.Constructor = Alert


 /* ALERT NO CONFLICT
  * ================= */

  $.fn.alert.noConflict = function () {
    $.fn.alert = old
    return this
  }


 /* ALERT DATA-API
  * ============== */

  $(document).on('click.alert.data-api', dismiss, Alert.prototype.close)

}(window.jQuery);
<!DOCTYPE html>
<!--

Hello future GitHubber! I bet you're here to remove those nasty inline styles,
DRY up these templates and make 'em nice and re-usable, right?

Please, don't. https://github.com/styleguide/templates/2.0

-->
<html>
  <head>
    <meta http-equiv="Content-type" content="text/html; charset=utf-8">
    <title>Unicorn! &middot; GitHub</title>
    <style type="text/css" media="screen">
      body {
        background: #f1f1f1;
        font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
        text-rendering: optimizeLegibility;
        margin: 0; }

      .container { margin: 50px auto 40px auto; width: 600px; text-align: center; }

      a { color: #4183c4; text-decoration: none; }
      a:visited { color: #4183c4 }
      a:hover { text-decoration: none; }

      h1 { letter-spacing: -1px; line-height: 60px; font-size: 60px; font-weight: 100; margin: 0px; text-shadow: 0 1px 0 #fff; }
      p { color: rgba(0, 0, 0, 0.5); margin: 10px 0 10px; font-size: 18px; font-weight: 200; line-height: 1.6em;}

      ul { list-style: none; margin: 25px 0; padding: 0; }
      li { display: table-cell; font-weight: bold; width: 1%; }
      #logo {
        margin-top: 35px;
      }
      #suggestions {
        margin-top: 35px;
        color: #ccc;
      }
      #suggestions a {
        color: #666666;
        font-weight: 200;
        font-size: 14px;
        margin: 0 10px;
      }

    </style>
  </head>
  <body>

    <div class="container">
      <p>
        <img width="200" src="data:image/png;base64,
iVBORw0KGgoAAAANSUhEUgAAAZAAAAGZCAMAAACQbpc2AAADAFBMVEWEBz6FAD6FAD6GAD+MAEGOAEOKAEGOAEOGAD+IAECOAEOOAUOOAEOOAEOOAEOOAEOOAEOOAEOCACyOAEQAAACKAEJpoJ2KADqu0eSKAD2BAD+KAD6AxCNqwoX1Ziawo9LYnGuwhL7aiwaIyYudst6DlrnhcWvCcVvlbE9PvsL2u3uYmdCZum9Rns7clUYsreOYp2nuj37kiZLUfqhvxafqfmrNWEjA22uz1Vu6lsiRAArWhLfgdoONnF36rWrzpz/ajy/LbqR8pdWDVXx8faN6m0+6hE3+1pmHP2mTy1b4k1p/ueFlj7vMfzyBs1v/2GfLpFL5rQD+7teQABj4n0/rpCz6r1Z8apP+4rrfw1iV0JyLUkqQACTDnah5AACtaEt9zcGNhleJbU5lsOFRvE5FuOPS4WLSt7+8ajvXcJpcyNvhztSwUkTGgZz9uDSxRnPZwsnTkqy7jpsPt/AxyvnAeJMAxPnMiqPJYIyzf4/KqrPedaK5bIsQwfTo2t72hUepPWvn6mO8VoXrgbDRaJXle6r75FzZm7S2TnyTNUXv5eiDAA6j0WmKyWv51liRAACjP0OZNVuwa4L+uQAcw/SiNGH57mIxxPKmU3DgpL2sX3rutc3/vh9gu1D3tNEAtvOSKVAmxfagRmbnrcWZJVaTJET2qsv84eyk04PzcEb71OX0u9OUzHD1nsR+1PhtwFUBvfQ5x/RizvdQy/VZzPWaz3b8uST+wFWDABqKAC6m03uGx2X+xGKBxmL2iWDQjb777/Nt0Pf+xmlCyPT+v032hVv+yXD3lGx2wlr99/hJyvX1gFV20vf1e1DCaqr6xdz+wlzJe7T2jmWFACT3i7v+0IP9u0R8xF7Oh7r+zHn/+WLHc7CQGUP3vtePEUT0i7qHADORIUyEAC2BAACf0Hr3j73zhLX7x96RGkrMgbePFEiRDUeOA0P4wNiVAEaPBkTzh7f9yeCPCkSLADmRAESYAEf+/f6CAET4xdz4wtnzibiKAEH/9GH///+OAEP4w9pHeYEoAAAAFXRSTlP9+PLorFm9i97MnGlJOnoNKxwBAwB644ahAACClklEQVR42uydf0xUZ77/rQLyS4TBk4Yh2XTdxLrurr3qVcyuRdzvt7CSRYSrLMS7S/R6WZqy9Mem2dt+myLG2E4VOnXipLWYGnXStTXx/lOUq/QSgwgxWpEgFccTkE0cYZyJZ2YcyeDj9/15nvODmQG1OpR1t+8znBlmEPW85vPz+ZwzM+b9A8o0b85c7J5K/SMCMc2bG/cDkL8jZc5LmTnvByB/N8qcl/lM4rynVf+QQGYHEp5WA/nHA2LKnBfv9yQDy9OpfzQg4JHKmCftByB/H8o0gYc/5In/AchjKTMz1uYxL83vlxhL/wHIY/HALbY4MhICjDH/M09tGQIg04gjIw0HzhQ7HJlpIY+kuCVPwlNrIAAynUQSslNxFwvXB6xzU2YF/JJTYu7A0xvTpxnInIAnLoMi8RPIZOKRKD1tJnDITrPVEfLP+QHI4/WcMmf5A+ZUHNMngQFlpCRIwOF2SOb1FZJ/5twfgDx2TR3ye2bj0eOwEDAy01MSQoEAAw7ZbKnoX292xD29PKYTCL27Uz1MYoE42Mp3+4PEQsBInsUCMA5Jdihmtn5n/1hl0PX0ViEAMr0571yzn7FQIAk+5pFRmMTDjNS0OA6DSYrT4ZTMLL+xf2xsp9s/4yn2WNNpIXMyKM/ySCDiSXz4MRQuijQ3PT4tLjHkGRkZdkIOJwuZg9b1jf3gQR7r6W1kTScQpFjPxKOwDgAIUzyzQOQRYMydkzI7YZbidDkcTkUKQWazOeitXF9hBw5SZciZOi9T6GnkMp0uKymQkDHHAxzMLwcSM+eZJqWhskhOMivDDscIC5ohyW+x1lTm56+v2DkGGlz9FSEnynRdgPKUlezTCSTe4zGnZfsVtmWT34kljAmJgAbBSEuYyQIjLngnkLBUgkJFY6PdbgcKaExTfz48Fnxaanx8fGp6hlY1fvcU7p8SSEY288NAnP6XtlpgI7MncFq8Ao+Pm+kPBEacTsBglfkVjWQRYSB0Ho2S7ElOfoZ5SMycmJySnvndmWQCyT8fECghEGKMyf4tW/fLTKGeeXR/ak7yMx5kUk7UfCFrPrwTBzGZYCDMjx/nAm7UJ7OSU+cK5/XoPOaiWP3nA5IpIjqAbNq69SXcmTPCDwPhSPBTBU7GYcmvsE/KQosgQSdjjKcJsux0yrLiBh/PTJ2J6dHsIwHW+s8IZI6faUC2boHTQoUd5q0y4uDSQgwVeKiyYueDYWgpFv1CpGBMQg4mSRJz4puRgH9mcnyGFuVND6lWM+MCqdMHxDRtiQjGp2YSEYVZtkIWOC3jONCDlFCA4Yg6zVJ+xdhDcYgahCmoEXkGVlNZWWN1MkqLJRlQPNkJaZif06mYJsvn5swKZGdMs8uanozdhCAiERDHfgB5yS97jNyX3qcev4TjGwrmNz6chojoXtnBzKGa/IqKnTvtY2P2nTsbKyrWV1qAKCQ7XDAUQMkwahsio24kXq7G+f2epOkM6nNS00X8nJbeIoB4CQi0CU4rBU+qKVgivYZ3eGUFcDwKD7tVAg6ZQg2JPyce7axYn29FNe/m3suclJwyJwO2EiVk14nkJOmfMW1AZgf8ocS0dEIyHZUIB8L2b91PcV2hxrmJv5L+jAcZmCPE1o89Eg6o0mzBj0eHGsEFUCoZvJfT6UXu5Q/NSkpOS0mdk56eQUqfk4oWALJranb6zXOnEUjIT9mhFJf6/TsuHHYGuQkIEdnEhImQfZjBQ3GaKxsfFQdKQgt+fFJrIktpXF/p50wU/J+BJeDxM958CYVwDHifUmJM4hXRtAHhh8QpBzxJQPK9hnfR7NUsZP9+nvrOQhRBtJ8FHrJsflTzgNaDx8N+nDPJl4kJoLhDEtUqQgwsFIDiSp9OINl+5pWC+CcGPAlzvm8kpkSPZADZryZaJl4xInOteGTzGMsnHv0TEIgQjyj5Fkq9FIfDAS4K/n63V0Z6zJCOMTatHgtAkjyKZC2qZsGQ0+OPywCS7zvNEkBwQy3i5LVICp51St+Bh70SPPLDn7QXFzeiyRItNaBYmRkiK5GBQUK/0lJdJDPMrCRN5+j8jLQAgDQ1lVR7g4ocCM2e+71Fd2KfHJB42svFwzpKgAzENVnYR7/dbhzIyfNdazCKB0Rp785JA4q9sWL9+spKi5ehfvRb0cFvrK0J4u+d3pmVGRlw1sG8pt7akupg0KkEZsZ/f9Edea8BhCQy37iApCiCR/3KMV1IZyd2V+slyYn4Ea0HV5MiNwazRlgSUmXBAy4rfVqB4L+vSI6S8q4C2/wahBK/JyH9+/JbwjmhUhc4hM9KTkeEdZo5j6pj4wwk34qKJBpHRaUZgz/48cdTv6qdl2urqRM2zR6LCkMGE6mxld4r7bXNPxCUFQ+D38o0fT+FCIDIbJNmITzPSvJIDgRo4rG1qn9c59AczN/ZH+mt8s0wD3r+iQQcnAcUmN4RiRncjzuD1SByr7QDfktyugOzUr8PIzFpQLbs1+RAiEevPVQ5BtVvXRt27GE3DlhCmLdiqAa9FXj0BLI3AofKQ/IkmmAg0wqEYqgTYQRE7pRfnm9FcPfQQOHUB3eMAfEFKhXIMQQR4IEPk/k7fu3++sjWiES1hoGo0ux0mCvxw/A8IohDD44d/WHwKIi0A8fl2hrw0AxE6LGWDU1PDEQsS3iV4Hxb+b1797oKSuZLZCShFCpKvhcg7CURQVaupSDCmEMNIFtXRjbXZVkcf+H8K1jQInorKC4acVw1XR6X79p7oStXOjpOFyMPJrW341UVRiOncfnyaqvgIXmSI0aGv5ue3Lpm0G9AeaZIbKOtoAtISq/ASJjbH0iKSXA3PRSIIoAc21q1EomvU3NY9tZj9ZHNEU7L0tjPDQbfar0VHFeoVkfSXFvbvnNcRcKhgMrp06cuXqQVYA6jkf4I12IMaTMuf3JaMjQ7LX5Ohuk7M8ESzpOupMzQFopkybnRdrm87c69e+XNRU4qkGJjJCbTg4EozLlfBVJFlYhby7D27x6LBgIiEsPrqD3MliCZB+GALpPw5odxUOs9SnZV3LM1EkFDRUF4SlWegJAHPVexqGV6ZCgmeJuUJwfCnVYIRCy1NlvTabyXmppqeAcuBkaSiXaM6YFZFpIsDUj9VkR1p1ri7T5GKVa9PRIIbCi0Hu5KcqjmcfE4VyNh6NfE/Zi4x00vE8EL7MIFdyUrDHK7FS6v4nZLErHxhBJStIXGR5vb8MfAQuiAJVHzKGjdWNtks9lK8qySU0Jjx+2R0shIniRKxKHufWAd4kSSdQwbgIwdQ1TnEQQkWhtoiWlllIUoblTTlRILSdw87HBCqheiw32xcUIdP86tSLMjfOlWVY2Q6aUleKIiCTE8gRV5rxtN4FBSSvojjXjBPuYmBubEAAhvd/sl2Ii7prq6usYVlKSgdXFNUIGRJFLH8UkGGSbP60U+ISOEgAeA1I8hqushvTOHEi1YSTgQ77PZI4qMtXO1M3/61KliO0X1i7CUSLVjK2sva48QojrEjWWxIyg7QTgISQztRovV4nCIJyTJjTEJLJ9IibNT52qrjJPi4ItqofQnDOszxs8byCwIcRx5JbaSIgmG4mFPYiS0BkVWPHnrBOuFZB6EpL7fADKWcxIhvaovIoaAx8HDA8MIJBaRbBWfLraTnTRe1HScfxlQeFDhAI7rQI5z8wAOpC9OHHtmrSkqWrx49Wrhw6DFi4uqayyMDgagYBDpmYQUbUU+OiUWnOLNWG3MiIGF6E0M5oXlopNRndfc3lt+xbYRySAZyeNHEoRtP/ULMydzaAGUhceOcR7H6vtXbt3MHKKN/hWF9FYYSDiQ4RNvHjo84II153MQHcU8PFzUJXCoTODL9LiCn+ZMDAGHhKZyTdFigAChKIFLdY0TUGAp3gBfkU/N0BkY4t+nJiEP4EueMQAiGq8hxtD53bixuQllO1WJNl64hx7fSExkeqEHdIcSPahCAISYdNoB5CUViP1oFQzkZNSQz3DPO7cPfdTiYsh4QaT4Cn8FceQUtjABB5+qE1lVI32PO/gwAWV1kQU+KsgqF7dr4YXvoqksLrLCUshQ/AGE+cS4NAypAoKhzIzU2bM8yOAZH4+IERAK7JT9Vjc1NbV3tN1D/tvWa8s7EHR6Kd16nMLdJHxhaJKGNjUJ0OolGPTVNx5I/Vd2JFo5/eGVukxA7t749KPrLuYgIlfs3G+dIgHJzmIDSCO9BEcFFFEqW1zpJd9sLVrdLnjwndgmglLEDQXug09D0pBqUtzstLSUlJS0tOQEnBpB43xUV2I5JxZAoEyxbopGY3Wz7VT5ZZTtVJJQV57JIU/osYxkrhqcJHS0Jw4hTngsof1rEcl1IFU5gHLUHtY6sQggN27d/hRxhBPppRd2nlI1tvOUbinFO4vVuKI7MIOGg4bnrdWLEUzCdVm9TWQo1RYwUZCMSRKw8DV5be9H/Hcib8ZaSsyAiMkCxBE0GmttBaUdvV2EpA1deSWoSI9Tk2CIIY4DmfjEcbzMy3QVCBol4yykqp5DCW8uMoUDuX/r9qHhZwWRfsNAisGDK8p7CSoQYBTVSHx+vmhDmZqGRSOZDMriaqukQqFCxdiwAsyCCpB44mMHhA5QyK8TuVN+uhxI0Eo5XlIjKeyxCneTOS6VWwgtlUfxyEz0UEg3gIwZQKggzFENxDj1ww0ge765DyKfZJG34zWk/TQ6Iqe5fYxXZFQBjOexbCs5avIXA4ahaCrERduinZeDoDCFZoe5cIcYw6qLPJI7lBGjGKIlv0wncqqtq7y3vPQO7zf6mZtJ/u8aSUwmxKVZjORJnHj9FkWIDqRqPBBiEdHKqqAyZPj6PgABkfdaRtycSH8xgACJfYwwRDDRoZQtzn/++fzFi8vKhKlMJI1LNJzIKF9tlUEFUvfOmqLVq1cEFf7fjB0QE09SmUqkpABICnoLCgpO5QUVJMSK9F1bwCaktX5GksiWo6t03UAgWoxaqwKZdHKXgNwnjd7+S88wIyIqkGJxX1xs8CiGxnswPBzvvjQqZWUbNmyo49qwQWeiP7sB1QnHEkEFWKproOoinjavPjIisRhMdM2IrOP8TCXSbLN1lKMYsZXMd0hOairI0ndpARu5tNsbHUWIPV6AgWhCXYgVEAJSMTGQfGEhH98XuvFOj4sRPgFkbCfngb1wYMU7kWMRj0njynHuxzbUHSH96Ec/OoKDX0ZmAhhnL3195sy58+ePcOEVqlSwTSLgOFITxNranBgDMXEi3GvV5K2upb4WnGYQ37L5eY6g020U7o8+VeLms3AM7i4iXjEjxYJQF9o7j00GBKqUCEiLCmT0m2sHkWqhN/xcB5EYO63viYi9385pPDCslAGGKmKh62KZrg1cZCiiBUZbNA78nhWSmztmU0yBCBuhOCJL1E/AQD8LSohi1SUdtpLKoFeW1Jrk0adK4OktzGvUIkbzTGaWcTxQF9bvBxCnFD0+ypNbi6S42cjAwVt3CQilWlkgjb4WiMBVGW6LwNiLBZgHhJUN9P4/r9GguBId6R8eUlYTDeLB3CLHijEQk07EyXg2IaOCss7vxQzERRs1t1jokdMt4bLQXsfsghjmMHjMRIbNI3onNsLByxAAwbM7JwTSKCler3vEt/fLu6Mqkdd3ueitM5Lb0VHcAdnHNB4CDIhMRIWCCXBwHTlft+G48GBim0hEQTWWOtKRuvP4Eg+FaiS3m0YeYw5EeHdGRJhbcRISR/X806X3IBoUoqUDGEnCI6y4G4nUlk5aKjf6oOCBGlQ4LEGDA0GSBSB+yaplu1FJljubjTx7+MtvAITrm30URpyhGg4EBkJ7bAKHweRUFJWyc+fPnQOPcxvKLhqKhgKnRRAA7kFa4Qh63XyACIo5EOo/wQoYNbaq8/I2NjfbLtP8AxLg0nbe3HrUmkSMijrZ5s7NcESiDW/wIIfVaWz7V9JUw7HNfnPlpKdHtbx10BdyfaoBGb3xqStLARHz8x3CQPgdoNAWrjAqFwvPQefPFZZxY4kWmABEoQ6i7gE0FgIH6rRYTc3PmLjCNhMRRappbmpqtp0uKCmnZiM3Eortj1iTiNV6OKZOOCLxzzV4KIyt6+zUeBCQ/noYyxZ/MH+SJCvoOPHKWyeG/Z/eABA19339hIsRkeeugAN6v7pO020iJNjlnoHOnQENUllkqIdRFJ7TTOJ8YVlZO+/IA4p4EnvDNlZY/UEJ5kHypE4REJN6zJiMNcQmWEhpqY17LTKS2hJkXW6m1iQPP4kQYXdd5zoMMdPFjU06Dzc4GTzwCECq9nce2+QPvUhAqqLWxGukbG/bG0MuZgBBqrWHqhE5ZO0AkTEeSMKgRFMhHl9/faYwV/VdG8rGZ2Aai/OqCnNz8RR8FsSfFUYBrVhRY3UoEtXsXsbFW++xBmJ0GpMCPPu1gIjNVtrVa0NcJ+FREXPzwj2BLgb3QCDpfC4Rh3sTUzx06oeI52BNjox0TLvtr+pfCyAWv7SOL91GJVl+ZLz33h464DtkAIHTGmFe1USKyWNFIYmCkvv1pa8v5ZLBnDpdVld30Yj1ZYARIc1ScAcYCwHBinMYUFepS4xeRViH7rGmCAhsBEU2OQPJCSJNtnJqxV8sKC8tLT9la7aQz3y4kdBQiTjyFNUpBzFp3hABXeDgewEEVQiZkoMDWWuPOgX9wNAb9/44dKDlk9s6EGRafyGnpZCJFI/RpA+2SCphtpJ76RLHQUQ2HCnEXqNx/sFCrJAIAsQYSCiU9LHxSp86IPw4z+YnJUsyiNTa2su72sqvtDfbSmxNG8HD7UTe5H/gFRPFNIvM1qlA0HiL4GEwAZB6eCwEG7aJxrHs2EXGdMvQH++9NnSg5z0A0XX31sGBEWEixXbw0LZoWxG3XMIhdLHuRxvAgzayDZ52IQlGq6QWQtAYj+PIChkLh4AAChCLUigQBwcwdUCISIqHTz74OZGSZthHeUFtbVOzVVJkhmyLMj0znb0weW/Ro8Bj9XEgtCiC/I13L/GkJt1x1a8UQDZzIPBgkY2TA7teuffK0IETYUDQ973Oo0jNleLiK0Lgoe6joZw9m4s91FF2BPbBlVsIGoSjcMNlodrVPNc1tAK9CoVLs4xopU8tEFGQUHqKmcYmIGmykZqaixySjH8eOioyDjKMZLJReVqcIo/V19fXaWEwqvR56dkGj0gkVX3AsoWxlwhIPVqNkY0TOeuDe++2hAOBbuwBEW4iGhCNRhQT8MgVYMbz2HCOC/kUL82R70aFEpynAQ5SUAg+C7YSQYWfrjq1QOiImgWRaipHYMcb86odfE6jhoZSYCQUSQwjiR5hgHNbByDrnGgkhuZyHm7yV9HqW3uMuzZLpwCS0x/ROGEDB9vufYAph7+EARm9fcjnddMSu04jnMt4LLmLNDTgcV5ElUJYB6lM9BrPEA0OiDYhmj+nFtIKUg2yqxGJsCCiM0388ximFggkJo2Y4sb6Cy4WZrUwPHCwoDOvpL28gK+3uymSJMNIMqP/sMix+ggIw8zZMykWjxu9J+LRh20CrXPgxWNVAII6MaJx4ujZgwXMA+zEnwAkjMibqNfdSmhRbySOKFvReeQib8rltlJ47sw53M6cQlABDUEHOAQRvncEgYNZFxIpNcBTviVLFFWEnfiTqFCeciA0i5dA/VpqbEFMdsA6lOpmhHhab+ftRjLXmakEYIK+CWZKCAhahl5m2YSiRFbIh4HIhFBegscSQI6tjGycUJJ1r+2jUM+bEUBuHELSQ+V67xXaJpTO5IrgQSWGeHSOasRzhXiE8j1aQIBZKInVLMRjVWhhqVQcYCLMJJREA4VTDESE9uQAg9wK3hBiUGOj7Thw8KEU0W7UjMQUZSAKs/SR0DpBMYkb8IFQp3qLYrIZ0UUA6YwAsh5A3kYVdDArEgiIvHnCRcUhaEzCpCMcyml6r5/WeIBI4RVYCgyFbxHCAGfQauCoO798wYLl43JhFUnAzzPOKQYi0l8Pg7yY0qguQiyhZgofgKChFGo3Up0UZSQiglBIJyHJIqbAIoOHhsPYNC6b2GYVSF/E6Hs+gLx2707XvgFMOUQCOZTlBmvzc70qEXE/OZQzOLy53FbOcH19JRc0IGISAWUhHMMKbioQqKxac+HCmh07FhgJmFUCEjoE2RRMpxoIua0U9ONpPKiJ1Nzc3HTxcrPopIiT4JiXjMQ/O5O/Q4wUSzOQVoQGRcytWxDiDRlcxG4d9bf6OJDW3ZGNk8ET7+Jv3NMyQGu4EUSweMh9FteV8dtEKqRjzk3lLDBAubgXwgsRSBxmx0LdfdUtX3N1zarlsC986VpoDdJSjXqN7ikFYvTjQ3xgS1NBga23jSO5U16bx8gdSeFz2ZmoQchAWvugF8lAeLpr8CAE4kZfAspLCOkCiL1hZXiS5WSK7wP8fW/1PPvx6N0IIKhFZOGzoIdS4WEjlywGXS1hIRoPHQsHQ2hWmK06HfDo7l51rk4ULbjpguNiCmWcCaaYjQE9PP11gggMBEIrpZSaWzARclvVyEKgkMdP7xCTfqEfMpDW1ta+VoSQSB7RdoL9FuTIAFJPQHLCY7rkePZwmwDClwwjkHx8XeZ5VpgmYXLpDMRLx6+5ztAWqXPq5tB5AMLym8vO1dGDOohnxwIL9iuYpFC5TtnWVAMR3d8AEakBEa6S3rbSAltzR2/vqdqmoqCTL5tL+ly2uFgcN5BWiIcQGf6qNRzFOgDqNLisY1twL4AcjQCCxZCPuwjIieyD1yKBiDY8asMwGmFUDCy82XtWPFKJiNtEWmgdH1WWLasThrIKWg4uBpNzCx1BcluBBEFkCoEY3V8QsapELpbYyru6Sgt6OxBWyEKwwW9pMxBYTOdrt0QDIYRwyUwhHvh2HBDHS4aNUHK8jrsuamP9rSoyyUIZAiBvnFA+0pcMjS78p4PZXgoik8gwlN5FHEEueOCRISDZACaRWBYuNMylbil4kFZdENoBKPBfEDcSjJ0QkTi8H6cYiNH9BZGNRIRcVomtt7y8vLe2aaOXeZ0Sho1hs3wGQjtrkb3YysWTXvFdn2CicdmEJNjQpi3inoD8T31kJwtlCIi82SMP05JhdFgfRstXJzA5FXTfoSvQWfThDW24XKh7sIkEG1kqsrAdFwyteXn5ecEEOwyeEJFkIjKlQIz0V3IGHUSkqbb8Dpq/aP2i92uVnLgUxEZRkjBx8kIiRfQtIKB5LHJfXAaNVgLCNo+zl3XcXFqp855DQAxVovn+ewDperNn2I8FkSif9V7PsNctIYg8RIsIx9e5ILMIZAwkZZzHGd2DReHQU7CXdftYsGDBf+24sGbVGbXXIohInMiUA6G/Io2ISHIeShGbrR0jje3NtRurJRoTmm9rsi2mwS1uJAnJiOjkorjWKcyrui8KKfo9txCU8poP26L6r7VEoApUDNkrQ1QXonUCS8iKBgKfdTjbi0qk4GFAci+dBZFFAHKWAxG7wuPtun1ADwj2ggcoLMRsHWnhDrCBmRCSM5gmVYlkTjEQY0AIbR0r6kP040tKNmKUPOjEE5hLQdnezBvAFEn45QBePNnaSrcX8VhhRMewEbEjIF6mhpZ1wlZaO3kFUh85k3Vg6I8A8jkqjoFoIDSAcn3YG7JWCj0PPffcc4sWLYo0kLMkAOGmohEpvHjxUlg8mZSJGj9W8WXeBRCwLODmco4jWWHm2W8ciEw1EDH6i3EUDMvxXqPVOiwF6WxdR14HT4DLm2y8AQzxC5ichAjIFiZzhxWtPgv1Gh0gAgl/tXs3dbGi128B5DUA+eLNnsHrtGQYoVGsHA5jHC8rm2RWlc0c1kqQMbjknuXCIxFLBJTTp7ATdAwoYVzCeKxZXodEa8ca/njHAk6EPFedIAIb4bnWVAMxLhaqOGW3WMkEGmtRra1cNFLacFaiRdQkALIZNAjJOrIP5zqgiZRIvyjW6OG+s2r3/pwJh+QGh17BX/LFn04MiiXD6NpwmAGvkFN2kmRviNMJOWqAhagIHrn06JKujtOChrFFYsFuOaVgy/mhP1O3/GXQ0LTjiDAblPB18FqCCH1m0NQDMan9eEimJX6ntRoBBVVJgd7bQgNYEc1IHOeTpBe5gQCOuo2TqODh3ICDbnBX9a24XsBE13QHEPQWYQgHdr0eDYRavm5qX3oV2eUaNHQA2+AwIyzM+vxzyzkQ7rGIiIjwi8SDSakQkCVLyH0RhjWXLvE4YmjNAg0PIVkR9HqR2sxEsmmaYiDiLBv048UM3UY6PZRajRd7S47rvS00gBXVRiwvEpAtzEkGAomYYkBRK3iFnBbUByBV9Z3IekmRdaELrSwBhC+IREX1Lz/KQvLgkrMHek4MjdeJHgzXDR444HKHYCuumueXa0AEkrOL+P1DoCwlKgTi6pKl2EcQMTLhl5fXraC5Ofh2ajVOORDRj9fODVXLdltpeUkJpoS4yldTo83N3/mIIw3rkPJq8QQ32nRTQXTxgp6REp8cyzl20o6IHg1EbgGQttuv9wzSSW3RwrCD4s3eNTB4cM9bb7z99h+F3n77jbf2HBxuAZcBGcaiEBTH84gqFNs5FNxHKxLKWTKQVReuXr2wdCmgiC0Ky4JVOwjJQh+ISKLVaJpaIEZBImttFAjrI+j6llwpL+3qaitdbHZibVMhG6FuCXIs1ISEIxwKYbEwOQsG4hUZMhnI2FpKslbaJwPyzSGfa4D3TqLbWQOugY9febcN3jNCXW3vvvb2Wx9nDw1d9w4OuryAwmAolwQTgvJwJstxt+YqKKwBFUEjmglKkyMLdlx4eYHDhzelelrm1AIxxlGcBpHaEgz/lhY0l5Q0X7bZcCWwEYmJbAs7CzXhQULgCLsHK9//2eLTq0YYSH1fJ0ZK10bN9WpA7sMzMT5MGqV9A4M9ewSBO+OlY/ngtd/vY0NDPkQWJ4KKZIXz4kj0bWIsuBWuWvV14ctXhS7oW7StILJTJrZj20A2uS0pzYTAa5pKIMY5JFobBbO/iOW9sI7S8g4bOo0Hgrvmr+brVoxWbN1qBmxAETfKhwc//O2/gpjCy8aTnTn9K5Fn4TInkwK5dvudHkqzbk1gIQDyFrGIshCDy50PXnvj4K6hAdegS3GHKMyrZjI5lVX4Kly15lLhEp0F7g0uXGGmsorWsLa7WpjC0G2ND7/oFh7HGggk5uNFGwVqKm8rP267jI52Owr34V0fLjplq6XT25m6TLi54eQEanUw+d9/8VOst4PZOnJj9npkvrjiyaQW0nUN6S0MIdpCvkEMGeTtrsmksep65fcHuZ3IxMRZs+Cs0MRUXl4CC1lyYVXh18uu6rqg3chGwiSsZA0RepW1hBS3x5MUTwgyVZnwMPZAqCDBhC6fMyXZCsrLT9HJiNX+oPnDN0ppSt62mNwWScE6CIg0YNOke6zffPbTdYMobKhqwartyr7WtRgBWtkfDcTVQ0BGyRJkRrV6dJY1yLsr0EOggMkbHw3tcg8OKyOSOaSayURMCl9+uRB3a7iBhMlA8s7291/dtm3bq+9v3w4YOhVCMtLiY16PBx8+YVhIehrOrYk5EHFpKEmmK7fQyBa1UfKK6Kx63/Pvivz3sm2j6rbIUjZzHuFUNjHXv/3us5+uRa7FvVpnlb3vZN/K/pUYkosO6qIOuYtJRcqzbo9G1SHZyuAu1I58e7ihtL32lm9oABFeUWAmK3g0CbcUerjkwhJQWXp1aeElMhBDO9T7d7a5fAOQ2GUPH972/naNCpC8fzirZSDLH2Cz4tLiU1PxkRiJEg3UxRiIUZAo3qBoo9DIFuSo3thULv7PMJImuC1BxM2NpMGAgj2qwuF//wWAoBqBEcFC6nM6sbPTpBzJHgHkNfxeWAZmTAavI4pEtXtdjH0QefCxTcrkg7cPDvW4XF70gsyS5rnCoVxdxvdXzwLKeK1aJYxkm28g242cEqIdCz0LLsy191XDWN7f68rOYnSBFFIgNGcqXJZRkLj1q39hsK8mj2ZOS/SRlFpbnoyKBPI6GQIJOOhUyECGfQdeABCQoUSs9Wg94krDWM5+dfK9ym4AkWThj764dR9n36KPeAhEwoD8CU2ufW1dbVxd0J0HchGu67U9PSfkQa9bdsNzaUgMLEuvLrlELP7fJTKQ7qvdawSPNcsFj8MtXkpvDbkJDMuCvWS79pKxcG3fxuhCHCHJ48fcbeyDukEE/XhRaWM+CIU7rxSbLtps5eQ07vC5LTSDuXAHIyEaKhREkGF4rHFAdq9sPdmXM3ZS7S72r6zv15uLijQ49BYO4RfX7uKckL3X3a5Pbt8fjUiyMGR6bfQWNDo6evfujdtffPH5520gY2CJZvLuG74h96DCRuC5gCTcTLqX0X5Z9xKKIERkFXZ4sFwYyN6WETaROJVs30DLQLZ/+DA0zCQqFP1J2qiUiRRrIPitvCCBUwIKvW7H2lVvyWVMNpIK5gOIomhG8iKRgAgKst0ReCwDCJ4jt1VPia8AMi62V4Ycvo8w5/I5asJbNz79+EQ2e/3+7dFb41pZw1mHxy0ljo4CzTVo9O5t4qJiCWciPNfv/UMhIFHkcCQwkO6llxBHgOXSsu5uGMjLC7qJyLLlHM/2KB7RxsKys3y+Z7P9noAnO45wkFQUJvFNzICIFRLmlxTJKNohW1NpKZKsK8i8Ck5ZJcXJVxL1Vgpg0BcFjpbffPbnz/6VgGD9SmTClGidVDsnRn3YjwUqp4uietstfvivvTnQ07Pv0I3bd0dH1SmH68quqC7wXWxAAzC3gAVUJmQCJN6hbBVJzXKDCExDYClc0s21fFU3oVi69Go3to98XvYw4VQSL2CIK87qEmMHqsAkRkBEQZLtCcna7ANUixQYzd87pQUduBAEDARnxSHb0ozEASMh0fT18Ie/1YCg29WwGzbSVzXWAChCdpDReMDQUGVQmjVKx//ujU/2ZP9haN97X96+ISxkzx9cryPiTyLicgtUdCigYiARVpIlkIQMJDeXcSw3lxQu5TxePgJDgaUsXUYGciHbzR5B/lmzU9PnqpcPy5gTnzY7LiEpcVZiYmJSQnJaPF4iJjEBYhQk4lTEZlDh51CXdrTTyW8F7XlMBqwSUSQaRgLRUmHW8AsA8pOTMBZ8PnFOTisMx17fYExk7YbvEjzosjOKmyblENW5Q7rxzaG/7Btu2fvmoftch977FGgeKFABlPu3CUo0kreHYSVe+Fcze17wWPLtUrr79leAIgzkHL9bRnjgsQYU9kiaGYdP6ctIxYePzwz51cueIaBgj4f0agY5mxgBMYkBIX7im2YiTTjTqpcuk1KNFuSz8y+in5KnuS2UgBYYCRiw4Q9/Bx4viG8srfUrWxtac/qrGhqqNEdVtdv4xGEIJiKCCAnp7+37X3566NCn/Ft8h/jxSIIDg6WImIKdjqQNVqIM0jy42bFAAFnC95rHWla3qlvX1Zvv60AkbPpdtPz0KX0h7D1+9ackCjFathwIZMfRyGcsgBgFCUpELFVBzdgwilJbm1fDgjixZ3V5Fy6maRO9LRIlwC8yeCy3jwzkP082bGEOtnn32O6TDa31/TkNR/Xmu/1v9QYPZYS5UPh1gYcQosc3N27c+Eb77hF5wFLIfY3CUO6EI4Hj8u0adjG3GkqW/kpg0TzWqjoYii4NiMQoYnv82OOIT8hEAhS8IqnBXuEFi29AVZbbi8n5dPit2AAhY0v2MJp9oDWrZmg1P9EKOKx56kXp9N6W6DeCBxv+JQzkz0iyyH2xdTn9cFm4lnXO0a+MgrA+R7tMFvr0AyOy70AbVSKQTgEcHkd3yXvd0JgYSN7o6RkcBnzyW0teJyBL/xdfOP7d3WeWd09gIR7PMwm8Co9PS06ii2Ey6UGJlzsbJHxs+DDKFAhdl8M+n1t8GIUpBkD0FRKJzz5IXovFalHEmSQ1ec22AlEW3xG9LWHjbhn5oFtpgYFQTG+wMHgsDmS3fazqq69gFjqReuKB4Dk8sPfj68Ounn13uuCzYiIYisFER/LuW7taBmXyW9ZVSzkQYFkGHvBY4GLoJmIIjc8mxSMsa8qIT57pB5MJWCichVEwGj2x7XsHQm6mTXPNiN1n2ip0/X4JMCBmrd7IV9tPt6mXSTmO3pZKBNW7MJDPPvvsJw0/5xMqOf31JwlI/d/+lhPWxeKubiSbHbq297oL1eGdL4hIDJnc/rwrDMkr+4Z8B2DBWdLzHAiw3IS6l54BF9pUIO/4mM/LP24k/IrK6SlJEXWiMuINEYvBvYRCB4EvNIap+N+O3ySmgmMCRHxGDxUT2ElKjX5eD9Kuy3rZTpdJCTqNdwwiCIWQhqMvUghpyOm3H22gy8Lm/I1PkRolugwezPfJbVytt8d1YOitz2/AacVM5Lvuf2GYCf1j//gRinemeAesyxFDlpxdcpO0BHfd2gYgV92D21pGpOSMiM83TombaRiGMqKwZwdafMO8vXUVrs4QuvRXfwxRF/IwEUmOGZA0GAitjdNSOyiQmqPL9tJqHQhSrP/733/+jELI0c3MgRJ+N1CcbAAK+//89a9GF6sy6KC3GDUTR1GgDykHhvZ8eRuBI7ZM4Lq6xiFpe9s35KKz5EQGLICcXcrvuvVt28jVV3u8I6G4eLrQdebcjPT42QnPUE7FWZBhZKN9wg5v4ywEDAPH1R//7D9e+MXvfnNg2HX4/e2Hs90SnVkdAyDaNX+2bMp2eiV1FVEvEzu6SpEC99I1ORYxUBNSqK34GS8Lj9JUyr8cbajvr284Sd7KnvPXv/6VRnu1gO4ePoHBH1Ggt/QcaDn8ye27MJKYapTMhGjo0f0EorvCzDU6kCXLburqptuFlgs33/cNeEcCbvOsWbNmZjOkWzyb8pJh+GAYrr3vvwMWBgwDx8/+Awfgdy2/bGGMPdsychh3/FoXM2L0mc/O7H85CiJykHEiWpV4saOW1nYLjqMs+VAyDOSXv4WBgMhPjjZYgOnnR0/Spd5bgYWQ1OdA9eqVeplLzP2IAn1fy/UB359uUWcxtoKZwHMZSN7dg+USRTaPLNCA/ErHIfbfvr/925vowF9/1j0yMiKuueHlLLI0wwALQaNb34R+Ru/HF37zoTKsuCEFw7cSjaDGBkhKAB1Gx8+/Orol2+lEQWLYiK29tLS3g64027wYQ/J0AgWJ2rzggRCy9ujPqVvcIOLHylaEdVV2O04sDDmJxzvf4PBrBfon73x0/Q8fvXcDdXnMkVy78bmB5M5rB4cw5yXBSF6/efPbm9xjhTO5Sju+CtUy4PNlZWX7fD7BAobRTWZEAhWdhkDy4//87Ne//vMLv/k3l3qWe2JaAgv4JbqqaSyAxPHPLfrq6FdHN8NGWLCo2RjZwumIl2lxtybIUCZaQQ4xGg4LBiI8Fo1iWxqOHqWOiX13627Rczccluv6x9f0Ihxgbt/48r0/fTzyzqH7sdfd0Wt3KZioIb7rbd8J+C2z9c1vv715k1OZSN92X3jn/W17Dx92HUZ18ep2clLELEIEQyD59f+n7vxjmzrTfK/+oBTaaQsdZLmeqkLAHwgQSIO0C6jSTJI/UoVKV4quItGUDZOb7TZd1FKSAEOCMg2IH2EUJUpufiBBfm1BMcwmDR3ZrFZNlX82qNpo5Ei30mDHdkh85tiOk+PA2Fg93O/zvufkTXychuTYDvuYTTzT2ZT4c57fz/u8N8q27rpxI79Ymk/mX3lz0/rEo8T0y6sAstlwUdxL07BYxwDk22+P2TzYmomz7Ny1s7T9z//7QxxTDf398m/+hfGIKMV7wINk2234dA0IPDoRoWsqxK532rEohn64lozOzo7ae3riTzOKhLuSM6g5ehK2r4jIj9oLkuRNfqR/zD5tzZqllN/u2kVIoB6lW3PgPw6Chy6PXsCdzBvnpt/ZBCAmiIi7CG3vAwiQoCrioRTx8r+yntVvfvPhP6HVvgUz8h/++UNmshRUecGDWazbt+HTORAyWuTRkY38MwdCJZOQ4m0XvUFRJRllVd5MItFcyReNEz5Jddb+5Tt87PhjwKJHXuItxIgEJHaV0VeoRumBshs3DjcIHnTMCUR++foLj9atGAiynyQgr9DGV9s+6AcR2Qc6kQdgAgEI/gX7H/5MZ0MpI1Q5D81i3b5MQ8C3SSgvRPD7xz8CyR9o4t0TggM5pfEwQsmMxBEGAwlY8D/YKhj1KV7pv7+DHnAoqZgIxyJi48U8cm5s/Su+wpfnoEaxF7HY4nVbG9jkyIYVAsHWvsU3ZGxGVsgGS3aDBpN9NInILg94oIqsnY6G0n8tF25hPHSLtRsWjDSEhNcV/3AVSG5f/Qe6T0eiOd6sSxKSLzonOmVrFGYLotNYWle4FaPvi7Dk9Of8FV/xGDLvWVQoL64V06ZpFGHWrxAIGSjMTSTFWLAsAKLL7ss2Ft9G/n6Zeu2/4TPyjIdsayhi/nzeYu1D5xARGgNCnp0uXPtnQvI+eMjebtqanHWJk+EK8LyEZgPOoC4Ps/U3UhJBJTUUIx5mwUr7YbDAQ7MNew5yHthcCZnmTN5aRaZOn/+LfHJCWCwNiCCChIROLHyoe3bIvzIexVAPxqNft1jv2x6EIkgMIVxJyFqhzHv7I1YWpuGStREgYakiU5JPnE5f0Nn7V05EMEmpKgKG/o143Niq6wdJvjOoOfOX169/+aU5xLxsR+DmlQPZiOFI7I8Qm2BfmFMZkIfzQJCQWDEeuuVDHvsKHoX5e6tOngQOjgQW61sAUT0AoguzVn/4w//9X+wCsBPgsUYSZ6kiC7goTeye8MlRtZqICGFIlvb1gk1pf/8uslqcx8n+ww0yD3ffeJNfh7ox8YiryEqB0BpFrS4pdsxAPAkAWYAERCKKWMXxL5xH7smqk/39QLH3pGaxKA3hMbOQP0JIQZgDWVPhroTXRr+ckKWE86sfdSRGLktTAY/Sv/xlVz89jKV7hYLMrdMvEKWYFwdKVgyEr8wQp0z5ThNeOQEOINGoPERCovAzJODxG26vcm/0nwSO/v6dO8lw7b8KDUGiTuX320kCxQl6jSsbsu/d4Up0s+Wy+EJ+ciT0ErLYq6RgAntV07z117uo/dO/a5euIOz4NGDwgSDsB331EW02XikQVNrZ1huUN0WlF0Csx6AhDxkR/nrfpnrYiQUwebBFYem5zuP/0FfUsSCUh2Dvxu4kIFAQj5NnIGuMJOzu0wrBnwX9PsXZ+xdGIyUWPf5ajCWnqqt/16+3nrzRfOPG1q03ILnFpCCLLtwkJBvpIt0VAYGBWkdBLjrzr9L6NN6b4hryu4caCV1HkJB42IkFJCDMYO2BvSLZ+yumIOUIk6EiCLNClFYmK4hUTyXFNRcEXLBb3Gxd6Z7oDEbnkJFoPJa0X4LIj4d2VbVW5RyC2cLzuPW/6aHcUygbNmHzSdA3Vgxk4zsAokRVz/QLoElqspEBQS4BBYFwLPhKRBIPaPgBChKhGRPSD1KNd/+9n1usb29vQ/JyzPoAlTDCIKBcVtnBtecACBNSEhb/NoGILVr9HeeBb9o7oxzSvx/o76oq/duhXf2t/WVbf1sKP9KPHCTVJuy3YX9WFPbya74pw8yXbA/mVNozzoFwJ8JgkOh2a3en7YGC/ZFqCK/E3n4IoOyEgpxkFuvbq/tBBUQ8/6a7dQDioZeCfQ3PCw/Yrac3eVLyJYIt1fnVdxCBwwjl0KEDmpIcaO2qKQOWG83w67/NIR57nAptIDFswl5hT13EuFLh4W1O7LWmZfwCiBU2i4tQFSQk1GaPsBY6KDAi//Xve4lLOVBc3VZG1u0YVEml0gvx4AriczwXBitZSX7CbQAeOeJsAwodShIV/B8wlO7CN3oz3NXVfIDHWaguUtzbn1vMFIQl2EYiKwPyFm+/7im5+pHV43n0DpSEO3WoDTIRXYSqfEThL4XFTngQTUHeZd+hGyBStpO+7fvIZlOP3eZESEF83rbwc2OwNCWJ3+TBlkOVg85aAiGQCCJQjh93lZUxHgfAY6Bi4MCPf9vV35/D4t7+k1WHkaTzy083m51+p7oJBzJ8D3EtwiNskGNhL4+z7j00yu+sHuqAYK66n8u73GI1k2rAZt3YBiJA8rvL1sjvuJZAQeRo+/OlILqSwJF85rRKQWfj3+aJCG2hNwe2372//btD3H/cHR4YPAD7RTz+BnsFg7VXtiri9hezQFC34vHSkXu39l22hh5Mz9FNnrqKpCJyLOEhi5Wnh1j/+f/K+vtryGIxaS3T3tzevW8f6Qj5FJ+r8vnjQeEWchIQiUaloBfhL8QA5b3t298Dju+Ix3t3798vAI/3TvbnHPqxlAc13GBtYfd8mweyXgdSjtmQh8dUq/KApZyaF7l379a9h/RaIPeQIrL/l5p+ArHzg3dP4jss1kOuIlWwXYtk97+plrVPCVMKyltUSDmnRiUlGiQiRjl06BBXlkPb7w5+s/1HWLB+hL0Hyvqb+yFFaIMIBTELhHtwNJiqmo+AyK3dx9RoAkt3+LkuDwKtfcce3mIcBJD3UddSons1IPt/tb8f75q3sVwFRMq72Fshx2w4iP4cpISplSQwohOxqH/9Dp99asE/2X73++1krkrBA1EveJzkPIQHMQ+ELZ6RAKSGVOQeIblss9poaBFcVJxu3Hfv6j3IQ/zBi2sITh50AkhNDQH5YGd/DVksPYncNkzvheyOsPuHn1eJw7eDiDUqRWzRHdsPHDCyYAry3g8/MBw5eAwLAKW/Bv78BuMhchCTQCBYjsyG3JB8lly9xQRK8dGDhBViUz96/+ERCHTk1rZbuobss9JZqZPAQEi2fVBGQEqu6on91SODJUREh4Iee7TnOfQgC3w7VX9t0BHr3/dU3C9lUlCAL2WlObs0ItyTHCigZ7Asp6u/ueZkf9XeXK2NnqAkPQ0b5XQghUXNXV2tzGjBaxCU3fsgu3c/vHXrSElBOUnJNqgH6citfagTOnM1HjXbbjeTyToCICSMyPdHOBH6shspyPPo0RebLRAhzx6N5nw/OFxRU0VSU5rzntAR0Nhe1l8FErBV+FpT1X84VCyL+9zSCESJ5rd2tdaUw2TpL01gq2CxbpGSkMniGrI7gfPoAMLl222kIGUL0hUQKTnCC5MA8jsVZzefS48uJPx0iIhY5aA1uhVhFcl7wnjBsRx4rwA0qpoBogZEmoFjT26DDTwMHn2zeSA4alPW1drKIi36w3lwMPSHCf/PpCO7H6gEpFkDsh9/P3IhC+TqwyN6CWyfDYebn2sFYeK+SfkI9TSLf8sYMKF3Bw68t710uArS3MV4NDc3VwFHUXGxrOjzDBsNPEwBoTCruRVESjiBW9yPLwAjhJz7RwnZCSCaDympApASArLNmNhDQaLd9ucrR18ySfzCISuKYvkrYQAHqEpBqS5lqJhwAZq9h3MLC4PzQw3Tr6IoK04Evp0GIMVF0BAiAgjkNkpKYKR03YAj4cIMF/gcs0rO3GZ6VIDiCIDUMBdytQRfk2Sf1ec48fwrCFVSkCR+MuFD79qZM3h/eKCri1z6gb/gkAHG2nPKmolIDTxL2eEiuaFY1nHQSDUirPn67rr1+FxXAUTcNcyS8khZBYAMkB8BhyMl39+FlDMpg7S2NqOKVlYCv09e3SpF87s4kKqScgDpOkLO5cjeW8lEPlLZden/EyQeH6J7R1HlUfDpDxe8d+C7H+E7dhWUDlRBiEVr2Z68XLWh0CYBhwCiO5DN1AGheMtkYshtVtdAK17N5UdICa7eKin44ftv7t4fruiCjsJmdpWXQD+4K3lItZO9GpByAOlvZQ7/annztqsijwQiUpCL/xMURHMkP31MRJy+soqB4eGBVlTaqyCwHmVlew7nFeVbC3HaQJIjxuv1eNf2rQ3T0+tMAeGlXYqzBiAg0tVaojlyslwFf/rhB0S8JQSD02AvDMVHy+A6SBCeNVeV8QjsVmtzya2rukBbLqvRxfsUn282cO1nQERy5oNIKwn7UKAWWxoaGgqd0YgsB0OqEFp4Ah6bQYPmGtar8ABvmQKyDkC08x0VAxB8ab4PJAuDK/2NiIj3JXyoZcGmcmFA8IKtu1txH/yYlJc15xWSBwkLHLHZp8+12PuGOup9qlScOzBAOsJ4cP04XGTFKJeaJNNz6/RVGmzyJ4GMxIQP4TM/XEUaywYgZRUVw63Ng3AWQLCEIDW5rKLa0kXClKSmlVAxhw/vQ3aOrFzrTlm1NiLEEicPwhd7nuuUJGbvu9LtlFTpYNHAAFxjxQCXii7InvwGZPNJazbe0g4ivrGBzoMg4np5kYKsrmNIIjXkVeCJ2LmfzGdF8wB3GZCFICDcluU5i4tqGA/+peYIT1LgfWDoYOfIyt07FvWJ0Wo6m3Ox42Js6eGD+HNg0GLuvs8kqwcfR1Hp9oKCu4i2EE4yMLDmhzsborIcWsDj9U2/wFa5V16co+lRRQGQ11YPRFQXIVRQr4CSlr+7fxjfEfUNlJeL4BfC4l5YovKBrqoy1YnkHqIxqSpHIYw0ZD6HuXr1Ho5HJ4L6WZD4aKC9u7dn1giCBJ9EbHR0NPYc1CDds5/4lQg9oAXv0djP1gO7ckoBhiEpO5x/sFgVjiSxhRY+0KnQkEeWo05sdMACRlNAuFfnp6DKhkFiuGR/+QC9qSA9HRgeLNfl/kArAnE8LwiC8xrksi5ColM5cnU+uecM4fqttLM6rlmra9VHu+2zYcNMDoTWabjtJOHRtUfCb3QPoY1aM1iACsqPmORFIkJI8JkMIAs5iFBLliQZEgQHJrbigw35uVG0qd42U+0VToRGHXKHSSoG8dEPD9wvBxNAEaIHHa0VrV1liYN7kNyDCaPS2txawtWIawcymfLDxbJHu7sen/OJ3qMd4UDYQMN9/frX47+u7uhubGzsjPR2nLq29lnLaIdLVlFEKYUzhE+9jzzx/v1hCH9OkRnmq4WIuoqLi53O4uLCgw0NxVJu3p7WomL5NXNA+AloDoTs5vDwfbygIHhTcmQbWSgI/jL0dGgCLiCR15BH1RbBpIZ7Hc2udVX15zslL7+hMDxrb/JPVMdj8SQc7q/vTE6dr51zubw2i2NCbjrRY1/7RlY88PUjS5AWSJYPQsBiEBVgCl/gXjmTAZaW5Obm5ufn5hYVHT68pwz52p4GmSyWGSDCZkEotrjPhD8LgyiF/OMHVzEsvW3btnf3c3kXsrN1oKLMlt86L130p7mqdZjg4U1VTVcNTnjJPObFfdyNuF8V5wEW4Yhfv/NkZuZ8i9eiSD7VoXZgQdZsYO1NFvm7C9joQyYDPAgJWa4D8CVw8lz44znARDPcsBq+aJBiLHNA+Gyv0JHB+1ygKXDu7Km/CvmA5Fe/+tV//ef+ndy/HW5AtaVCR7J/J7kWHgSTbWsug1dinXS4jxNR3AgdW8gDOL6enJqavFDrtyiKZHP0Hu8ZncVh6bWPs0hi1897FRZ5akQGvynYvn3Xrl0Fg/hYhAwslC7ML06vMwVEVE+EH8kvvb9ABirg1BHBQrZtO7IfBmx4/sHIP9zFHUoFSAyQ3hAMzdM3Fx2U2X4A7CU75cKmsj68E/lh7Prk1MyTyU/nvMFI0OOSj1+bDTwvNEjik1/5g6yiNHj3LkPCLfaw/qwKJsM6D5qAT7xlHgg7UiiIOK2H798nw6kLM5nkU7jxpLc8V9qTq5EZqMCfgf0f/Mf+neVlrZCy1maY04hNppg3cLweC2ZGAgvz9fAd4HgydtpvI1Ptr742O7p6GvEM8Ihdn6r1BlUl5Cy9SzLIvxAaYUIgAksFTEJkesNq+yHGUSBdcKY2F0rC9FRQSfq3E5PhisN7wEeLu2BJB0sewqz9xx9JV1pxgEVC55bzcHQ8HrLHxG9rn5x68mQGPCIw1K5G7AUyoRyxzKT+dy5ItgjqjPkgwZloQASUxbqC8Swc8yQFMQ2EjuwIiUiFzrxSECERVAy6Ci5lmr6W7Rzogs42D1MdEkpSgTSFmv/XAojpJzqd3UM/wbmLp+/JzPiTmcnzfmwFkV3mdgHhvsP5AYpRe9oWb9FD86lXYXHON998Q0AEF8NHQx8GHz95yzwQfmZKXSiy0hDMKx2EGKkkIeE2FOl9OVUXmFNn8UY0EiIFCc9edPhs1iu4t2UBj5kZ0o+z3gjxOD46GjZX6+ho57QRzCHrSRuRO2PMjfgadoAIQUlNhcswbQ3YwiyWWSDCrwsJSWqDWlR6VyDRvIrgkmRAB7eVDIp4oxXqG0rMXYsFemj16Gdi9Sg9ek8gM+N1EiZiZbh9cz4AGNqj/GQv1m9VBtKYsE/OtMCNhDzOUuDQoBh0hcsw5q1DKl+PlRYgb786zT27sFtqYXF+nsZEYFnSfKEYWa4HHBX0uEj0Wbu7nZ36yn0uMfyeRGTsczx+UCKzPIhItYrggQHpTt94CzR57MJcIkRu5Ptvvmc8llKV+4eL6UTA3DtvmgUiIq13eL4uJCTLzgZnft5hQEmSlKpCkRiI6PFGMNpip3so6EpobOERFubO1DgUZPJT4uHqEMniqmu94EAFgThdARNMZ3cSRus8N1p530MEFYOqHC5WFTEst0ogmzcn3XiEYn6SBDGkf7DBml+Ul1NaDiwCxaDR1Qs0AzQOLruwAAuXGXm7MTpLFms+nCT9GJ/qRT5olbRSMBV7ueA9lVRWqCKnjiLhwQ9391bje/r8Otdj5Ic54CGgCCrzPILa+rjNq79PnZrAm5chooaCsqw6UUdz+vJz8/IO5+TklJKkUhWdCDdYKPPSRYSS8xydiRF7R+8ACBTkNCmIVlghGFTsvX7d7g6PzmK9tXuFgZa92wHHDm3r7rWPppHI1zN1PmsEdXCpgOFIjSWvQVHENOkqgaAzRa0ucbkC1vq9Q37EKJGgjK5+1FkMLhCVrJjRfAkopThwh51Y9hjd4cnvkMI1OvMRFlOQul5rJMgOgcYBw44SI+LgJ2NjM3W/Pl7ddMoeW2G9/MQEm/0a7ZhI77GgyTE99v3+hx++TwmlNLeBZh7Ig2wyBeSXL294/U0+u8KFLsVVl5KQ4vPBye/QbJdIkoxY8p0wWP6LeNB7Pc4OtsZiJK6b5a+FgrA9TVTwnZyZmpoCjbpPL7WoR72VPWC0Qi9yvYUZLdyokM4hSXp+xi5xo7XjBwigLMICJjuUQp9KoiWFJkzW2y8+oi3/gDIvG/UE0ehNPMWFiIOFDLKXMQIbpgSJTqQjJcRdXzBYeA2RDRIWa3ymxRIJ4TbJ0Zj7zvjUDHRjsu7850Gv92iCFbVWLOFPvVbEvoHqo2k994BkZGYKykwuu+CHeRFACooarJI+vfhLcyeooBEvPpp+pL6wYeMbr73+i7c2bdr05ptvpDBaCixWtKE4N8cQXVCFJ1lVeMTbQeMCjQ8mPgYN4dORxI1TTshyYJwZQYlxnAGarDvd6/fKXm91zyqLWpMt9O8MVNen96RWLDyOBFZho50/LBbCkRct1ocesO3S7PkQ8hpzCWz5f+ST5KCyJYH7sF9cACSEJc7Up7QWNxQiI1kq5MNLQLlfijX0kr/FPooc3WVrHAINSF9YuBCWg3gVZrGoxDgDHF8F/Taf1dHWHlhlUSt257wFVjJQ6bLCiaS3yDipG60//QnDG0JyiqwHFVlV03M+ZLPw453OhoPFUZsiyxKJLGnfPYo1Wow+pZyblyOiilRURDG0vNMpy15EsyDQYZn4gvMQPv1rVlSsQ/6LuaP2O+w/zZyW/AlZcTTiCqpV4eA/uNaFjv1xlz/Ng8TzRsvamVMAJJxKwY6ixsLCCJs/EQbLDBCKeYnIC8Fo7o4dRbn5shOdYZKDB/l3QEKoCzdeQBEFZBkoTFGQgchRCdU+utPLD49OItLCGEMwSelWxNKIuAotkbMt/mgwaIlW2pG0m8iqz1tcp/pOuZzpPhvkfsKrjIpaGMzPLSLJxTNcKMaBxNaZ1QPZTK6cR1Y4C1VAzAtycnZA8kjoTU5OQcHiMI9/XZrK4De5hZLs9cG7UrLmYrd0kgsZCgsg5DJq8Qsq3ktjMFfjp63eaGPI0kLOw0yFcXyqxSu5TziibWnFQcoHo+WF0YrINmfxQQgmShVJVlTDuPWqgUC5XsedPBC63ihYjJhOWEfhtfgrSb5ZksrgDx2FkuRvvAYekI6JJk1B4NNFvQ426kIEFivoPz85Mzb1ud838cnHDj9qWj32mJkO39hpS/2pi45EY9oPo0w+qZNslGqQT4XIshJSFwlr3JoAwuu7r67nech62dOQW0C2Ea9kJjqY5ancLego9kmONoxesS5F5wRTkEVBlv2JbrEQ9F4YH6tr8XdOfPJTk9N1ajZwEbtpzJj6OqwbOhUN8avZ0+rX+V95aRFFXjNR1su4ZumdDetfe33TG1t8xc4dGpEkKGCRUle+wZ/FUAr+qbhTra/G6BWviU+0adfZscKJKGTNsBgrYmmZmbzQ6yUeQ40qjrHPnkJ8ZNKwqN1yKMq4pjcZmYKVTUlEjL+bBYJ14q9MJ9jlVypiXbSk8nOAREAxyDIGLOdytNMfPRGI6ddCHv2EKwiPekWQhbKJDRbL+9XkBcmC0goOW2J+CzdKHj9lEshZi5JgNYJ0A3E/GcNYUCglj8S0uo54mNaQt0HkUYKt/J1jLaloYRHsFpdUmgLRtMVABa+84jm5vq2HAiUOpNI/pAN5PBuff9SoUxhVVLiQs3Wcx2OcI5Oka6Oz1WbiI5bhtNB0myudca+gje5hytvaHr20qGtrKlMXc9YkQbk4mlewiAiEY0lCY8CSg/PzftupsDAWgbYz4v66eS8Ln87rWCFb74UW2KuPycV86bChzBjoaDIDxM5+ciaAQMLjT6gcauQxPbfx7UU8zGXq8CNJrXRVIOE0Urr6JKdSkOeMWv1NPbMLw5teSgpFGiIKJ09qmQup/dyP3hXxGGmL+ptQgeruCJj6zBC+zel396RfRYRfF9qBfcf8/kjzQMTleOqWxa10K5AYhcCkFMIRLLT42y6OsqqHmDzQLRbSkLgwK3AhCHpJIa2d9U0jbBFllJbNxezBtpip4HSKJTiZAEJR9Qz98IU0sLr61XVsJWLagFCu/9rcXGJxKx1lxB2pkKQ2X8DR4PR3X4wvTrNH3XDWugwJnw4Xgt6tNpHXDWZ4fTHRiXOho9fQHjFBhPwT2SxusjKgImMXhM1CMDT3wsbX+UOdPiAggkbhO48YEYFELm7ohJosLQvra9EGl6XtYjj5Tq9w3xVCIdIQ4dM17+ixzeFiYuZC6iVbz2gAcbJJIIiFVBFlpV1FhF9PvLiB53CIrtIGRBThNzxKulpUlqJU381JCUN396CRl1/Y4Ig0tceTcQCIbrAgBEQ0QzTNx9TWZ5zHUKMVqx6eoi++aiCibtlikVkekgkVweBSIkTq8dqmN8Wt6WkEIo66zyX3blGqAZPOoh05qTWFVTuLGya83ceRQDwNG//+I+ImbcoL5wsn41q04mMBL1uvV99Jx6zQWzKnIQBCD3FEysyim/A4j+LoVCc+Nk4j/UC42v3iJV1JhARZI6TYl4tKY0GBzgXvcnbk5TZGDzZM+Bsr292pp3LDsxyGyAt5ZEqFLMZecp3RL+rCSf36EzTBVd8RM9e4YJ2voEoakhkVoUYnVUp45SpTQEhJ3l4/N70lZavQ5ixkhfjOfJLGziBmHQoLHS5rd2W7PYBAN576JCsjIfJC8ZExn64k5s4RDBb0eiVYmdEe1UWxr6nMkOqW6XfqImYHb4VUhDbsZw4IhBb5b6BD1gYJRTygImP3nSZOv99vwUHAHvcsNVuXXlEhXMhILC6CLK72GAfs/pjHWJ9N+BBe4UyPy18ZiJsqAbJmvU38mLRXtHgOxccZMgVEeJLXXhRIDFgUSFCRE762psoT7ahzQDdS4RA+XchIXAw48MkzkuhEI6IsZrGQhcCF+F2rrmWJSvLYJW80M7tuMDY3MzN5NhrRBn42ZwqIUJI333iHkCwtkuPM0EgfYIwud6VafIRriGhPcbfI5k14euXprKdy8FBnVHK2BzARYTMZr7q1+SIlknavLh4oVKqDooGeSSBQEh3JkkxojH2EH/NfTniQJaJeblNo5j2IUi+XTrTcKSvE+qans+0u2VwjAzaez7NIfirjZ8ats6qvfudwRoEIJC+iHp9IyUTGmC77dA2ybNQr8nTovFA41B+bXJ00L0fjIm3mzkPD6bIgTsrUQsEYqTifm8NNOlkAArtFSNZtUGlth4EJTx0Qwj4LkMfGqJec4qLWG2bffzpXL6ky5uXsvarJXeTQEFYp8ylseUSm3DpXESBB0T2zQISW4KLJV8FkLhmK7DpHEdMzjXYSEBFk6cUHcroLgTT9dKa+E0dE3LMnHD6zJQ8CQj7K6m3LBA7d6AoVyTgQMR5ETDa8M/0IVPi1lSSSv4M76OUlTECET9eDlCfcpwuN+/icQ8ZAKarubV4aTjCvIRSY2nr5T8pIQYvVy0hHyItkHIhQE8im19945aUEX3WjWyxyISvVkJsLXAj/bbhEfBPnzlDMCwVp95u/PQFOHYIHOCO5enJ1FNdNZQ8IIdGu0Nv0i3VvrN/4EoiEZOc5owuJx5dz6tynCxeisOqlR/Z1Hv09kkIrHegY7fDL1h4CYjLKYhZFcmUizBKBIrXBxGhcdoAQE1Y/E/vhZW/bCDVjkzar9qX+cJCpCxcigiBugD1eh9dZP/HxULcXCwChIBf9Pn8TaxeaTAzZ85u5tbQUZ+Gp0rzIG1kFIqhg3lSz+JR0J636GpoN/6zNeiyykCl+kC2iepxNX7Z1fHmOknQ/FRTDKGd58VSbfno5kMxddgU1F3aXVbSyBsR4CY8PaVyST3f3kT1appg1K4JeVnngP2nkMcsJE7iq2E0HrUyHqkR8HghzRxnKDXl9RhHr3tcAyMt0ebQnemWRT4/FwzdT+3jRoXpMCiKGSLWeG5wRqc6VOZuvHgYrcG0ugiPt6QMiUdk4Q0B4weyslV+Sl3Ug4q5c1RPtHlkEhBZzD8V/ZgnMEGunx0TpnY3IRXjCj2iYTrAzvejwd9abt/p4eHUgfpaIZCzw5V1P4dazCUTsAMRKEhExkdueHdEaHUIWPZfxcN/Q0E3GQ8RY9HtgUxPxaEPNBC3C+OxxR6ejaTQt5p1HWbTGbpmV4ub+LTxYhIqsyz4Q4ULq8TECyII7aQwOpD2+CEw4HHYvytqo4aZt2rjS7ep0deOcFeXo3haEvukBQuV9qODPz9EHYm43zmKv3omgu24LiYs9sw3kZe7TP+ZAREdwyJ20ckQfdHPbY8bfQ69jIXzGVY5WJ3hcCyAl9MqWYDoSOW1jx0wtfuDPH1aP99282RdYHRM9lkPkyzdpbM42kM20BoXn6XoMi/Vj4GEoa422deubLo4HjKZXH2+Q6n9/rmMi4nN02ImHNWKdowM+ZgUD0XxDBOZ7l7vQJ/y0b2hk5OZsHExWVaDhNovHWdkEIlYyCiDEw90jquoi82j3ayWLWLgRd+QlKYioK4a6612dUVflU/iPi1FP1GeeB4RFDbzfshwQiNvdN4RH6ib0BGqyYq/Oh1YpN8wyEHE3KzdZPKwKHL9Cbxc7EDhnlwuNjfntPOFFwaIovMuSzWep724PxEdHj/slGC5zPARzHpFaQortGSaBwu7ATbjBob4wkKzcVVGRlJxIloEIn86dOkvzZqtx8MNYhx9t8od8+CCYN8GIlU4kHic1R05oY2VFxe9weNtOuAPYdN3htzmq7fgfpqm/qmGPLKshPI/CLfcjyJX6nrrjsVUEc0ExfpI9IGIho8yXZAzh5HGHKBkuAuKiveI8Gek42uHmMXGMLweY/FTlp/QsbZWYWAmMzrpPSS5XLzvgY1KEbafUUwBZVoCk74srsFyxZ9aS+MLdINTJzTYQcSeSgj19pOMXJ/Dd2BeByaqXZBfth2M73vxtPYh+Y0/D17EcYBJnbROKSh69cjQwC7Gf6J6olyuviRHtdOTp/KyDIqKsZQQPg7vy9+RM4uEVFgSwn1Bsb8giEJx8o03kulfHDaX0jVJC4y5KNSEHXacCMXYm2mGZPj95586dySfAcbbWr0ZYF53uVI/beyqlo47u47QbNn1VP+7TZVsoKPKQZ+jcuC81kX/vg9165hqmKDC+nm0g4n4RuMorUJCg2Ee2WOJI8VTJ46rGjtEwrZKT/b2nz9ZN1V04/7nFGwwRU1cbLbq+2NTb2HG83S6mUNNmsfgSFcrUn12+vmT9jBV53LFnrPJDKDWM0I7FrAMRi8glR9Pjx01HMbOuHYkyElFdss/V3T6K6Hf0uMvm8dt6W3pVvzdE5sqDM4h2/BNaVRYPsEm7tFZhdRdCW21WZOzutOF8KgL5Pvcz98F4L3otgFAzhEsIRuvMl0fPsBQkHEtJpKcp6gpZvNXY4h4LXGx0JCSF7p1W2Jiw118ZZiYKF7ewW1zSXfPjaSGql4gtVmTtxhuPfsy6/8DzbLMUFPd6FZopzT4Qcb0ITI7Le0549BQGOdBTiWsQjro6Ltpn+9ynGl0uS4gWCikWl6utXY+oBIt0K8hZ8FDZxvkVbUz+9YOJLx+T5gfcsWcyjpDa5wCI2olkRHh0o8SBxN5+vKnRdTRYfeLaqP1idbeKxMMVbazGoTeAyGRRXG+uSitr4WJ0YbLaMnGGiMBsxZ6tZjZO2w+2rDEQxaZeER59CSQxjP7ae9pPVFZWnmpHunGt/eLFiz32gCHATb+C8CIsTFb7yoDgRHXvA04E+dUzwBdAXltTIOyY/3KzcuQcYizXCITd4bj2lnnwTLbx9DSdnN1K24/Yz/spzszTmWDqwa1AQ6bXrYFTnwfiiTYOpVKQ+GjyHp84E2Tp+nuOI7MGS++3sGWnKyRKpRBBZHkfwpuGlIesYdiLKIsVseLGxdInTPczzHemWEMSCsKCrPjKVwlFbJ2wWoLIclEW7+K+lXUg4ioL6qobqu58rQnZ7LWROK8qCgVZmU8X6TcdLNE2SwgbkLrvIvKQOdta1LIwJffzCtJTG46tFY+Yph+ivh9SrGjLrGaxokXVdq+Ih84oNKJMwibM5tao2ptYWkEggUsYg1orHvF5/RhnqyrJhbSFV1ObJJ78oQMTLHj++VoWFoQkQlumX8EoYdaBIMwSCjIUN97e4cATuVb31k5yHnpBHCKvbm5xcoYsniLzdQaIJJep9uKYiDiTkC0gwmYJBQnHkpd71XbH18pcXdeyZr2pKizWKlIZdmBbts7xLoN7mX7IpyINyf5c1vTcz3iQOtq2vgY4oB60hlkX5AVcQfyr2zUeBlvy05KzbeTnHHtM3O4g2iFZn+2dM3gQocG1rjWwWDTB8zXbUr7Yo1PQywYsVqcixNTHQ63HS/0U0cKlMaC1AbIpoSuI8RbfC9RzWgMcdC+l4MHvJuIuPR5b9WkGFjd3csc+FF7yQAIJir24Agw+PftAqIkrkvTk56qWronIMo1YXODgRSwUw00pCLdFPLOMPHCIO2hSJPXznUl+iCqbQMQckE+rYhnWdZ61WHqyCISVY9x0ia7AoZ9j0zxIbPVdeR4502a1EVGzS+3T0VKnSlZ2gYjrvRXbXOoy753Ps2ixQIPd9/1EaMfiiFeNRKImHo/JKf6DWH5o9OtGny5mTrI8l5XwTRj6IPyhOsui/qzA4LpxZ1woh+DhVfRqGyI+M1v86oLMFfloKTfd6bBUIZN2QYsLEbJey8LViikbhWHskqZHMhuqAb9hpEE4nhCPkNb17zCVZc6Pu8re1KMc4lJMny3C08IsAhHX3/vqtU568iN1wefF6p1sGKrrdyZnhKVa6M/HTnsjGg9/t6ljDTBHdOZODM5CRZZxIVkH8jZNATENNiaF6EV/ZXHBYmXaidtJNYw0eLw7dcmv6Dwa0ZgyO2zXwsxfBFsruIoYmOnDLXxHU/aBQEGwk+Sx8W+HvxxOqGXUYgEHd+KpadBlSRdaNH8ewti2GR7cBM/HB+x3FqfAjTNAEVQWs30sWijIF1x/DXfasGVhmcMBv0E0BIFk7zFz2qblH0GPowlj26YXNYxRFVfUUvEQph6xF0NyWQYCBeFVE6NLvzNVm8hcjAUcYZFvpMIx9uTTFr+qcPWIOsUt4KbWNuob74JWpMIGMy0sFg96swdEhFiUFBoTVygInhNPNGN1rFgctaqZpWjAWD35tNZrCYaYfVEcLe3pmGqJT/KarzbLnBzI6NMUusUCj6wBEWdDIiGa/dHNqZBJWm+IrDBTlfXJpRwH0cA1lC1eb5BFRLLsogvF4mnblmwL8SRT1Q7mGy1WVJTeswmEkvQ5/aTOkDu5cVYXzFRWiEOMqKynpoFLKMemzl7q9VsUtiBb9vgX3ctg3mZRKiJ2iSSX6PkihyBvp2cVCCnIummKXoylNlJuXDUuezNjsUg9UsMYmxzHhbm9Ua+NaYcihVz+DhrujqdtomjeZkWU6BWx/kjM47GN49xiZQ+I6BViT8X8Tp/FyltrobH/DAguzZ5JCWOs7uzp2qDXb40oIXazuNURbWqPwXukcaSIsvCQUBGyWYKW3nrhFiuLQEQ3HTFvqlmlSTSVM7RtEh9Kajt1+vPeqN+bUJhyBOWI19Vb2ZOuEVWRGzKLRKKo8CJD8SQF4ec9sXNxDYC8PB/zItpI+nsjg5IzE2Ml8YBVxz2C5y/1Wvxe3MGuhBgNj9dl7Thhn00XDjEGxzVABFriV+QKwu4qpt5Utk0WGoW2+UsMRgxjTHzZZAb1Q8S3F07XRrDfPBJkqhHySJ6og65liBl2nafJZlHJl0RGW447T6EgfJUyH3vPNhAkhUrIekW0BoSCULKafoslfm0u/Jr1WhzBUjkMOvejeolGexi3roczcpMOn6OGMHvNf3XhQfQ1sW9lGwhWamDTItV5xepd8RiRxfKkd9ekqO8JHGMXvpJwII7bqYhHki0uh9p2vN2dqXH6uH7Z2/wpPsT786TEAXVmsbIHRGxwkFDnNVqsMEpssFgdsfR/HOPCWE2Onf084U8EFa4aMlTD1dt0oie+Uhor+x9PTmE/WUTVIl/vlZ/gpcSp0rE6TFOIGCurGgKXLhuHlPhjPHYhI/cFxsXg9DhwWKAcPL71aKphH4WlWqFuhPti7pVsauCtdeHWZ8O87ihOlfKFAdkDInbOiFFXw3yGX1FQ7c6QA0Eht+6S1cvSjYjsibr8pBphfi3Din9s4GbfyjY18J2KJHgiH+NpJK/JDRYcvliUlV0g5NIT2lxlPDmdHcPT2zSaoZNQdMv6eckfCrLSiM3l5Jf5wFCtkIZYRjiELytwInz5EiSERtUQnUaaFAoi1jJlEQi59OktfLZBt1ii5kmrrxRYrHBmMhA8h5/7bXwwNOSSQGN1qiGG2+IjOM35zE5E7N9mNmvE/nTeo1+gbgmmG0xceWTGpfPWrciNRFZ41pKgzT+ZiLBgrs5KfhblRiS/evyadpmPGYljR+rN8AqcCD/6w1dNDsW1RqFhhXJWgcCl0+yFcagyzoJerz/td0Lg0dSnFqyaejhw/fSoGRoi0BpiawFW7ESURPDcLFNdfsNcKMRceraBbNZc+scGi8UtC1yIHyOb6ffo4PEEUwssI5f81lNPA2lK/uLYWjsSCMeeTVFFJoL9RV/0cYPFb+YXN1VkCYhw6ey+kBSdfujvVIu30Z5eixVza1Mktf4gK1cFHeJ29nQRmV0+/oWL5Bsh5oF82cdwsFY6eNAhhGwDoc4UK7wTDkNryg7VldO+zRuGkLlzbYqEmuTxtBpFEOGLGpafPeGz1ByIx9kxX81hZV7eCckmEFF4pyTE2EyngxQWJw7ept2jEw8v5+HqbWddwOwSEY9Gi+5EQqpUNyb6IJA5xLxZB7IRvXT0lFMdt2M+3dHtTvPHRavhxzUeEdnRcS39m1HicU5keSCij0snTj6dnBF7O1DGgoJkFwiy9Hfm+G21EGwfNQC5lOZDIaR2dMoD/oM+goirEt48A4MsT0fYAdvl/i6LvHrQf5oB0RnRAGnWgWDYRG8VCoslOv3jtf40F3p56Q5bwinatUZPkLnKhLjPIdaKL78BmA3vclG8l2CyeF8KwkbeswdE9NIVNZjaYtEO3mBbZu52Ih6S19eesUVOo8fRlF2+eCKOyBGQWu7RCYiYsM4iEOyb0W595DFWzHDQqM6Z3tbUwkXLkr+FNitnRrCF8AwZ4WXVlV8FxCRk7Z3Sr1IXm3qzC2R9SosljrVcmE5voZcUhC5JCYEH9mRmjAftyXF8Zsx0Uy2qr50PsxJy3fi8xrBGSPaAiPlRLFYRFstwiKIpkO6QF+VKi8KO3NDIdOYk3NhmOPJs7MqIcTlIxHZhjJ+Cp7Ii9uZmGQiNx23hMVbqExJIQy6mN8aa1GecwcMNHhmUQPXRL/CYLaOwi8KsiOXs/CAKu8Il60BeAZD5rDCc4tOrs8fSHPLy3xiHMtyjGeWBDc8T4uqmnwkxML8o4t6z6NuSR+GnCrMMhOqKqqpPm4ykWls79XUgnt6QlxpxEfjztgzzAJB27/9v7+x+mli3P56jiPIqL5Km9M/4/T16SwwxAglB3IYYlWDgqiQkpSSmAaKJxPv2rrdc9aLcgtM2yGT6RqfTHWqzx993Pc88XdApu9VB2pr9mLOP5+y9sZ3PrPf1rCVetVK+Rb4XWxbqfu9Tob+4MHVrQDivSBeIlMZyVfW+Hl/ctEUnFW2kgwdM+rdZ9aJGIhJvAYT9XpwtKldxkH5rQDivSIWy5hoLxeVvX26EB+cqpcdr+oM7pePq7yWCWtNukfxH9h6bAlHrgOTxgweneW8PCOcVc7qcLnHYzCM6/3DDAiK36Z1ozw5EG0P+tzJJhDUN0s93o5oCubrWmsjw3sLbA8ID5FArdLX/cK63ijRdPs+FPK8ur9M5ULSzocW1nbMbbhB1DYiMRjKzLCLX1pJVIMKnNgYFcntAuLlBjChSGssN5OOFnMXr6cGxz484U9UealoSrXBrB9R79fti9Y3IxjLf8r4GiOwn5cP7um8PCDc3qDD9sJk4n2Iby97a0tL89s5ZoupdQNToMZxi1jD8YLKIYf5A8pvcrKSBfkQWkeYfSiV3+Vh3sCOvA0BQCZEXI6TGcrU4JQ62F3fLyehGNL2/iAyK91uWIo2qTq4IJtGyuBX1m9wsNaEbjlZLIAFbHM4q3iIQvpduU/FWLnpurLnRqqJkVKONB7rh39jHrjWvMaFbWZu6maR7g8B/80ASB0GfLk1kKf9vQMiw1fptdcSYgA4AGeYlki4tWz37Mb+1oRm60jApzaK6iPcrfY0nRzdrn12UDn78BiShWFY2nEEBtAJyv2arM9YZINBYskGONRaLx14oWtYNPSUPuCB+vFkB4aObG6HZT9UbjEF5m5whnZbDi+s+lgJi35u2pLvBFv3WgLDGMv2puOsaW/7sx7NyGjBqyYw8G+UTQ096yTOiv4MtiEtKUrHYzOHng+rNIqliO5YuJxa6nEj3XtKRBwVhQGDROwNkuKBqUw0aq1raCUXNiBHN2OGFlzOzszMvl4PppK6FE14ERCZNrjl6Fntv4j9uWEjOniYN0gFcfLsWCFoUsTOQk1i3DYQ11su6xmJvMZVOpaLRzbl1/C1xPh9sv9I0HZ7WrwsIxSA5+7pTxAYJck9vVkL+D0BYZzXP9sqZcda0fCA1vn5wi0B4E0JqY7ZRY5XmtXIkkFlekSwgPnF0AZbOtoMZ6CwPaXfS1HSmmiMROz0+Vas36Watxgz7X3UWgMhIvXBXZFppMlZHgEBjEQ/TH4nLSJbfqqWkHYlZKO0I7+vT7N723kHpIg9FpqOF8ZddrPpgkULFas5EyEj84gYNSeJtwMyhQ5T9rCZA5EisSj+KdRyC3C4QXnsrZzfQh+WqzoaJpZDrYuLzp51X+7GYZu8+Q7I8X9r+RSPC7U94AUfuDd61mjMROz24Tdr7qX4v1HK8/JqPe/l7ZZBe0Zporu4AkEm6d8tRCMSZV3iepJJhITafdt4/eZLWkppZ3thHEFJNzF9XPqw65/qprHKUNJJE9KeP3CcmU02IzNwokfx3PGraBnrIN1/cTWJitj86GsZqlDPpCJBJR2PVp4pX6/Y8bSK2JR7xz2vl4LO17e2lcNqXStMO4IsdBcS9GUycC/yPa9rRaDKbc91iUjAZnAaSBiZFI7bCzRY3saSVEuvFE22FjYi7KUlUDK1higO4CnKrQPBnjtZ49xe5hCr5o/uNYkzMhCwt7a79KCHX+xl7PH2pDWoovbh2d97O3vb23o68ONtUUZNJV9ctJgST8dG7lUIDEZHI4RfEcw8Y5XGbjvDjV0VeMxRvygO+LnWrQKCv+ioikWRSrvdyP1YYka3MxiXmn+WRYUpUtxfDm7t+VE3yTXGclbBdMhy0/JpWtoLhpb0zgHOXgqkwleM6nGQyOXSXFRcrLQoabqhCKa9H4d4HJxjdYQhZt8IDjNp/QH0NtwiE5aOfNhvpul3TRb1AbUktrUV1ZEioDJ3YXhOe1V4onUwny8VcrYggpNn+1WfIB6e1gG1QCjIdDcgJY+7ODjXGhT1vgWS6wjRc6/o8z+KipIhcUAO5+7cwRIjufcph3T6QCREBZXUE4nYmae/H6+9jfleTubi/UQYp0eu/baUN4yRbRKrcPQ4Iympn0cpkkmXLMKxyOpr06ymTMoWKCG99EK8qD0VgJOODBSUkvNCS29s8VmCOhGuXg2m6xqqfnsstx/TJJibx6W4XCDfHGYGN5dn19dnNZHTlE5lqFhA5MetCmJSCpjvZJlNrTL/j0tOS/QQXy+dhPXb29raXXiHBYqaKmU1ouqtqQU4Kcw9FICTD04Upl4jEb2asogRCilladbfVV/vrSTjw4W4fCEL0u9aU4bNhO+i8fDJXz1eE0ifio+NdEogS4ajDwy0hlPEKP8ktbh/TtlU6+C8sKA6kjdRGuHpZRqj3Bwtt+IJYA5LxgQoTkQ+P7ZpHIO8cIDAi7rxMlW069VXj1+0C4Qshpu2HJ4WDV/HVQimv+sqyIvlLNlVVQOsOaa1h6Wy+tJfNLIqL5fmqPPkfcLL2NpO1SGYR/yw3E8n0ndJYbiITMq3HU3lwDr3x4L23ppiaEW5aFJU2/U3a5HjwVoHwHc8N8RaKi+kHz5RJX4TG2lhmk5oIp+tAzHLwQLz1zCMZ3C6dXQ0Gq7TTe83SIlFkvdhuqr2DpBeaexl98DKcY+bKXFP2DERm/M1AJN4UiEqcFO51Cgh6sZyc++HLhRWxeX/n+EL6iFtlEx67UrbwsNRqCPc6G5iX2OZxs7s2Vfx7Qc0mfLxxmS4Zc7fstX4fr+EVwYj3c0pjd2V8s9Lsrog0ITU2bp0AMlqRK0KWMxnIMQeFpLFyOrsjQmJsedyb/avBxbOL5p5QvrSz70/SNR9W07Ct/9ZbMwnDVrfsOg9S83bg3tGboAxTYyDCn80sDOAjdApIf8GgcHglE9PL6/wpq6VnUcOEiyNSF7JDoKwKfI2L5AFrsUnzDqszS1MiAq3Qxv7rSSSS2M8SqRvP0SFknq4GqR0h7r4B/myV0Q4A4WF+iMXhXWUWdjMsx9JiGGmgkkAgMbGTusYy/ZTLYoW1t6hSJGht5FMnspameq8a2iDu5vMmwGt9Dcd/EALsMaXFw9fwHZSSbra/Xji9tbFOAcGbOJWj+sA/y4//WXiyIi2dapkxxahxGbnnS0tRZdJde8sT2wrPBU4CLi+ds/o4viruymwmuEQqd5f+S3MN8hb1TdV8wy7v1eutA6FxeUzYrbHwpnYKyGCFWuMgIfF/HjMQ2VSWc0bQlPLimSYvAWlocEBal1Dkj4+PP3xAYhHdjUtr23vHZ/CCnZ8mRQqhsDIhpBdaVcx4hC47e56BqEIcAXFP+HDC9M4AmYCAOLEwRhjtZiQQtun18shFlVTYCTu9mObQuA4Hi7tOT7/RQHA0N9JJ2hgHl4dtERbpCYwOghBoLKGmObHYcpk75QLpxPPem+3VGuOT8nojEJp1iU6YMmV6OyAhfENHiC/Oy0z5MpC1tFFveZg/TlQvA2kY24s4/sMX2vix+mbLh8Siaeh0xCzR3bVEokoisjFfomQYhofI+xciGG61DoCOKmN6z8LzoGR8sxUBxN1worHGulUg/BaSgaMAJFi21iENdSDJOpC/lzbPLs4W6yqrGJAj5bjO8OXbt6PT1fc2FklkTWwdOcmK/EpWN7RoWNw9PwuhAA/L9OZc3ILmGxct2i5kXH3I0+28eL3nX1eztgNkjoFwSockyCZd2hkgNFHcgkYQQOY2csG4sJwNQPBrJ7O583ktozcPQi4+fv8mR4nmkAeWA5bKekriy2K4zx5QlJY2S1VSXe9Pj3jFQOvGJJwsdKpHq85TGuycsksKCI/sVoMuRzoBhA0nXCkCspAs06DeOpDt9IlMwpH0vN4Irh2H1dJZnzTQLOo0SjSrFbMKWDIYyWS0lFRxulbcKyEWeXUmrLvvL6f/B1dg2mndo0RHygFy7PX6Q1MgbNKFRuMEQgeAwNlXjWMhX5IkpVRVoYW/mBPam2hBOqLhxaL4NrottjLz94QpxCjRWpZzHcvx+Ozj3Uw55RDZOkhcHCwJXXgWrpzL3aWTLYE8lN21qIKv82QJb82SDGTBAcLyIwWEvb9OALlfBxJP6fBxuVqY2NkPmKbfURbxcDQSKxsogyBYLMM8X46m4Ezu02w+xSO6eShs8ExwwyEShXTkt50Y8Qksf5u7S5H1letuVjwBYRFAt2RR5WMagCgBgeh2EMhgHci603PDXyCkZfEoqaeM8ovPk2WzmM35sGZor3Tli4CHrnGIosco04EDjMuO2TnR8O/k630TYpok8qlt3Xl0CnzegVRVVlMl9Q9d7SYQEJ613xEg/QykgICdfX0yv0lDDSfF+Twfssple+vV9o8rBv0DebFAp07RdJ4eoMCVTkYaA3tyn1vcomTHV0gINKdHIFwNRJhRd6UP8wzLER87J52NzgBx0hO6vAe566unpDkydJbs4MDaoyy7d9C4Zgg9oXL22JWwWp6/Edv4DeEn7ys/Ge4WJY3ZhLS6pg0gkFNPQNiLQj2EgdB35b9JzQ1yA1sngTxwgOAsJ524kK8baScqjyS6585wEtXGYIryIKaueJgBmn2meKw8WVgQWstIU5zOoNmEtFwKACCQXY9eFmfRFJB0+G8Cwu+VbIThD9YRIDTknTKfpF7mMta6BMJdpLqtllaIVJK7DxEVhlWYiFrS5IKr5CE01uaTlbgdMGVoz96C32xTMcjQkIHkPdp03jFFt/FR+mFYqoppjXQSCL6wXI789yxSWVkVF3IXkMEqyNX4Ib8I8lKGL7JAqpmbRCSOf2Zi2gy0VoqMyKWqujAirU0IdRlAghmIt16gqpPWZCD1hUaUxXJaKTlt0jEgcnTDwvo/y5FDlZ3g2DCXM4QC5zsK1ct2UsxWglpbz6Qcmw4XQeL4e3YzqqP8ehgpZwEE2Xeep2BwIqu1jWMgZ1VvowTdQFh4aL093z7oJBD5Ui/P/BMJHTqeIDtaeM7oEIKPo9YZVoWPxQvbcMmDEKyXi3Jme62IOwRUTZoLZ5KRcjSQmSMRMdJ1IHmoQqPQlqaeoPFdbNQRN3gzIbLbpaYKIp+PXQNn0EHaeQkRdnghNJdZVhV1TuKGoylKTM2JOyPVKnCcre0lquqlI89dJ57xCAUX5kkyW86UM5vrc7vAEcnsLu9mUsv+nOP3ckc9l9NbuuXs9h56HX4qHam7NellQQOqGF1NtZsqkGnrNBAqkULT25kF123oxEEoqpsG3Wf7nKAa4PFa6NllAcEeOdkvECyf2CfGxsv4+suQnowRjmTyMUgtbPiFUScbopIydo0HfLbchcWBYTzvbXy2rMRk+wOWAFIXuFN1e0iWBDoORKjouUwQ1lulFpnI8auoZtCNT3SIzi9tFlLouebsD7r7U2nkxhHFaCemiVAfZ66cMiKRWGaTGlbIndbZy5KUIz6T8xOtNplw6iR+7NGEyLbd+wJIdDle5YwKDEjOdjLQHQdCjU8wAhhc1GxGVmIN8zTSgZP0E5zgEnqvWAkgzCrKQAVADDMpfreg2dlIOROaJdsucjK2KUu+PEdMM/mrt5YQ0za5Vc7ThhJxr3G0ZolcFviqlONbkc6xWW47GIc4PTGH4WRxXdht14iT4+3FUHA/GNpcQj2WxJxTEXB5YUEkENmmvh7KnKTsTHDmUIiHyOtTivFy4ymAZLk81cqoc/odQLxuxFhFr8u9msz24suKEJ3mzovcDwtIZyN12RMz+2S5eW6ieoFbUAc7B3k06l5Nj1LYK5JdVG701YrUBbwbjaQ2/OiY4HB9NqNntVD+UuXuefqkHW094ZTVsz6C7jFQl0P1/4JNH3YaswCE1C7P6eVCSGdzWc4lyFlMRofNaL4t8yKRaLgvSMEURqKfxNYFkJTtj+A6w+NMxJ9ZXhc4FJB1P0wolxihsuDR8C6nNj8fAcl7me5IYQjVKgdGnNut4Is7buDxxjV3tCNAWCXA/3YKQImlayb8wON1t/Y/TZtqSvxKUi/aZQ2V24A1JwNDBpIN6LwDhrSESOKNtAFkAqkdmQiU7WFeTIiKCwdHCqIe8rKUFzyoEYtwcJ9Yh4CwF5PTnQlAZ0vZg3a/tRCQopwbQomwlF2OlXUDNp5xOCprIyW6hvjhAAjXQ1o5HTx/xfuaRFJOoyMVURDYK4EHObz1FvKxLgBCFUOqqsOqH346m3/SxmB3FhDNlP0gALCQidjB8G6yLE37FSBQY0JjsX0FEC6UtlguI/W9xzCEHBBn70RleFh4buW90geSj3daMcdDmDoOZFTWSGvZnc+l42dp6lFve3jMa5+4rUAnrvvt2cPDw9lgNAKjwkQcjzhwWRMenxIQ+v7ttPHh8EAcbxpL5EcKY1T1KgaMnQ9kzxWPKeFldB7IPafRRttdmw8ldY1UffsCYpvZ0PJjnLCWii0fkr0IZ8ohquAqJqTNIulw4kqhCI2LXHdoXaACdo+X2uD0OgvqrdokvYRmeesL8XiRBg+26J0HIr8xiJSTSU0vb7X7nasQEADJxTJP6MSokhVGtyziwkw0vC5Q0IF9CcdSVJ3K7/HD2fK1CWS4wOUQL9WQvFyITiMFH5CaptU5iD/gXzn2oybioi4AMl5TRAwja2Tm2xWQD1SchuCHFl7Oza7MUOIhldxdIRAz5Whwbv1Q6awZCEgIlfSD+URVqnOxwaYlEL6SUCzSnTbK9XrpyFJOVp9wZLLp90fYK6p40NWIbgDySIyc4TEWy4ftVhxO0VslfV4hDLsxA5olFpghTbVilTM2VNnM3Ozs3GPZKY/JQTBPUtmd0+0QBtLS5+CL0d40FmwIAqAhim3E+rW3IsF7SWF1ARAZiPD9YzacLQXEZ8oh8eKEkzoRrWXCcwgOAydb1pMMHfyVCpIJul0C6ZPusmjtZaPespfUQPpSVJC9NPUSDyGaI4/oHTS1VbVXFEe+Hd0ARLlZqpmvleXkvDuaxFVTOtmJNAGxMVgroyUzWe2v1fdBzC7df76vm1nhKSRC+KssS8DTNPl2SOvMSUr2HuOTedRYaPOBaqJ2yFxAf6FrdR5IKnYNEMeqc8MI7oK0HhlC4xLVQFnSJhGf8+X0VNE8ib45Ojp6u7q6ev7OJ7oWq6iBUDuwzOVR8ZprpS17MJTXW8p701iyw2HAcaWzPrkmnEPCrgDCLf9Owo0K1/nW+0kp/UONNKrbZ0NXFzTNWur1i+9fyYX5ir4aO+vX0ZGFOnrorD6wDeaHH0I7ceGcsOkeNZas395XF7NQchZHJXm7A4hU09x0SIO9Di+YyDWJOuqBlc9JtcOlHF8tFgjsfxO1OdqDHajBZZ0X10I02HRCqarX5NZMtN6pyHc+43lPPhYO5Xqyw4+G2GqyxzvRPUDGWEJkE1bLzeMQELiP3LCFxvmY4dw8XAxp2psjCMg5eFiBIll02S1BsbrsVcMoOWq3aTcM4QFNHjUWdZBNj0vPDYcNCL0a3QJEiIhdn6yXii5Tuw0lpv9VQPb9lwVkVmosSpOfbW9k/W++neI8tcFDoxZSNFiXd/MygdHejU/2OGQ7gpgm4SWPpUxIP6Z2XJUQS1yB7h4gSHEP2pUCm5Fl4WJW89fgEIWpdywgdJbR4Ui1+Zx/r5SY15Lp/TcvXjwPBGBmdNEpn3j1ZKkEHlKVoazNJqSd0c6PvYSF8jVQJgSvgRggzkc4F10EhD7N2FC/xUQ2SUGgZynf7MudkYAg9ZFjAUEtxMhZ6K0xooslmtq/ue9Pp9OaofujIWxGl41Ye2c/nJKE0lgT7QVJUhS9pHqlSZO2a0w4CnxqQlK7Cggh4QwKef3BWZHA/ZzPNyiu/Nnx9o9LAuKcTUSFtT4qc5GdqJbOdpaCthFIJ/eX8mfEYw8Nv6W80ORyfh6/l62GTIjrDeteTAj1tTs+hlZEG9zIVR6DCHe6DQjmtHLAjvBC23h8SK9+/POP4zzdQFfaCjP550sfaBB3kQVE1KYKD/oKqls0v7a5r/msrc15zL8GoAR6GnzbyGDJxyLazy1qEGxjy6VqdCUT4qlBTl5Xg9MrnCzm0U/vY9cBcbJ46hh6ZndOPO3DT58xnAFU8JjzGHxV3k1AQKBzdHEdEUcUaE2Y6P6KvrHkJEfoHsnOgdy4hj6izbQv9PHcCQVIb3CqonXQqm5AelyfL8egIm9Cdol5DFCE3oVAJuT1St7eUUZSiqQEUUn802e86NUSbEMSE4AwnQJZkxMtPBuXpSlKY1nTwwGLW6+cGcrgSFbnFcosfx05PKjhhkOx1rMgVTEELa4eTTr5WOgq4Qkq1D5JKd5uBOLc5uNzkoplQjPrXPg7XHlml5OLpWNxH8TWI77k7vLLl4+Xg5pO7QFw7hkIDwLKJ368SqaQ6qZHgnrpW/DgtZlt5XoN6uv1UJzCOm55tnww4GzTweN/1PjSnUCUiPAxUlrGWp5ZiaMwG1+fW0hFMXH8IPHlG1Rx0Uhixw6VpjJ0Mxcmug8JGKGyGgdlHWBspl9/C7Xx9ej0/F0KPLiFto1Oa2lCqOHk1++xse0ae/RohHlME48uBcJW5DISO5pJpnZDoWA5sxFI+ay9Et24xaOPibrty5m5uWDApC/X7x76JxdX7aI9qPzu9OvR92+rL7a0gMlrGtu5raNMSDzvJUpX0c/dSc5ugwdFQl0LRPWkNaywSxl+LaaViyldL/vJgNAA5BS7vOgSFWsXB0SOI73NGVlSVxh/SWn53Ovnz5+/3g9gDkrRSVeMtQMEYz9UFAKn16OAID2A10C5k6Sv6DN0LxAxU8+yXSeH0q5xUjQRc4PHOYV1pihx01FJxUK/iH6zGFRayiszAif5VdIvclwaxYl+O2teyua1OfYDWch1L1enpIDg5naxlkNVkBYeSB53SF91MxCehuQ6xRMRc0NfnVOQHqFUBohQuVyXJelRaYCMNP6phOhyPMMWyv2oIREUs1kaEcTZo/E2BETtdt8UGsuDi6Vqt1gFAhPi8HhA/lV3A1G5PPcJpDeC8xeYoCE6/1JJZ9rG4eOMYQqLMDBcUNni/fmDBN3r2Vvaivr1pnw5W9G6q5IXS/zi+B92eRGUq6+I+IN4dDuQCfIzbfcxIuH5g/wXiuygiQ3qA8aJz4UyelE+4JFhRRKrbPfDi4uvdrHSVjev4dEvTFZbiRMMLvCgsaqnnHfPCVdbGspKH/HueiB4BkSkQUhM3/uvHz+efvuGrrKjFxqW0+zOzNAeQ0xfqq9+Zw+tSDmsJNZZKBxuHlx+aF2dklNR43kvHpbQs2L6kEjG1GwYd/z4HgBCz2nILtTshvP66dsj1De+rj6ntkuznMGJ+lKGWtz7UIbUdSQ4PBrIzQMGpG0FCo31y1GhY0DOhQFxFOW9Sq1gDdE37QkgpLXGHriWc2na1vsXL168rsmpFEVnFy4dZyULbEhbZ8quAN9ku3eJkOn1r//qbei6Qaf6v/Ik+gqFOyNUsO0RIHIbVaABiWn60jiarbSQq74zNtUejoI9ytqiDadXT8pVAB54iDm8qvPq4XSlT7wQvQNEFEcGAw1rBYtZHDPXRAPRBhDRrtMOjkL/WJs8xMs8xXtXvPCQ1z+sEeHYD9GP7ikgcu3QqFj12PohC0XAqclrWYBGxe4ffsTaoh2TnvWLyfM/rbCqrK8gH+BBq2Pojx4dodpPjwGRSCaHBwMtidQs2RKLx+eGMGVZlowDrUKlYj+4P0Y/+SdH3T3+lSCkeqECdLpuIAXbGhYvDlHpPSD04KSlnvp3HgXbKcS6RWSqULlzp2YTk9qdgcGhsQkqTP5cV35OZN450ds2D6dazNcNVAmfPm1PApFrBYcKVu16GrZVuQsNoDKzAxW7pmCQgro79PDh+NjIyNjY+ENVJ/658ozs//l5Abk4cOJBum4g/W+uv/QsEJncaghKpuq/QKPyv1EoAY6rB61KwRIaCgpq4N7kVbrcSdC2gEiTjrG1P2s+vqtq8Wu1HlxkM3seyCMnKJm65CZV5CnY/+u795A1gPjdyODdmmVBQ/WPjuH/AYNJQWLyF+uXagvsz6mrar2nYXWf29vH/ggg9CWG7hQKlhAKuF33743eHxwcvD96bwQ0rhpIEoHJ8ZGREaGhwMLTizBlqab3z/lfU1dH7ywfePD92j8BCH2Nh0OYZlSANpruG2kwMu5mIvUbLzhUntcMWLyAqV3vqq6uzt+kaybf/vhTgEh3a3x4aGhoeJyeNJ/mN2w8sHC3/zwWAnLxE+KhvN3TVdyOKl65rvaHAGFJYAn4nak5LibnTN5Q1rZ41NWVTeajGxQWA7lZJji39aXI3Z6SzQ3tC0j1snjgMqdd5yGH/v9ZQG7v8EqE3AkLSDs4qko8jo7e6dql7L8lPKz/gPzy4TsIbbtYWEf2QTlXpyjaBLKN2ej/gHjgMVxQG0MQg7SHA9rqXGqr8xeWli021u//A+KBh5oC+VIsDW9HW+VZWz3dorUyjMMWBv0/IB6AyDXRBnYytJfFgvH4WtdW7zXf1dox8Zj4D8ivHp5OhCxWWwvUsa3vVGmrty/stGlerYiNUgLhPyC/djipSGne1stC6CbRh7rx+PZu3/F1uVhjDXUBj14GQiFhpSYvppPL29qWn3+TOL6/20oHrmqrWqE23Hl91dtAVJkLvaotmuMgHcDx3cHx9emWMh58Kg/GO27PexyIai7WYyG26K1xfH/6GjiKjbXl+xPdwaN3gaj2+xzvJmt+GAc8q3Pg0JQt5+El08OPuoRHzwJBBILRP0phcW9cU1NOODDeBqZ8qwkOq9A33hXmo5eBTNASSbnXI3TIHpYbB9ZSnwscGAD1Yj/tUzj4VKbvdY149C4QZdBxv5dXxblxVOHoAgc1fq++0dO+bCOOqYI1iGXo3cOjR4GoK45y22g839zPzVMXvjAd3/96b8PRLboaxSoPusd69DAQ5WCBx4IyIC7TcfxRRuVHp2/fvS5rtqvDvgZtNfSoe6xH7wJB0daWE5NhQNSQQZef+5VwfD2FriLTkW3SWW/fH+8y8ehJIBPC4Z0Sa/GNdbdBh66qkmN1LoTj6XPSVWYTHFbfWNeJR08CAY9pwePETM5Kg+7WVcBBluPNvubWVaSsClb/CH5Ut4lHLwJBRvF/okGyqGfmFA8WDri5X2HJoapgOfxpv2m6cExJHF3lW/UuEPC4Ax6yKEU8GoQDUQfaSI6gqrJpLUd+lduU290qHb0HZIJ5IEKXPDgGPBDCcXr67a/3+2nUAs1mN1Qqdl/XSkfvAbnMY4F4sHDkIRxE45wMR9qfdVsO0d8aGBzrZhw9BoTsueKxrHiAhhSOc0Fjy0dObrHpHbnKndHx7lVWvQcE8UfAmlI84O+ChuNWIVcFTXUtDdn8PXDvYbfj6CUg0DPDMv4wRZtiKS9VFdyqc7Li7/fLaV8RNJoLRw2mo/tx9BAQhHD3LMHD0GHP4z/ypKo+fDw9Ojpfffdch91gGi7heABd1Y1hYO8CoQvxBRmf1zIzZD5gOD5+OTp/+9eL13ZaC7CmcglHoG+Y7m/2Ao6eATJJ40HlnGAtNofZ5qSqYDXePYdLpdl8Kd4lHPbAUK8IRw8BQX1wQObb9Y3gSvzHMQzH6rv3W4E0YnGm4Yo5CnfujzzqGeHoGSCUTrwj6lG5XHT58+ePX94ChqmlfbmsW1Hxzd5pqKpeEo5eAYKHeq9WEDyK1rOD7Xfv921N89kMo6lX1T803hNuVc8BwRO9T+acgASC4UoM8xiLgJG7BsaUBRowHD2mqnoFCGWvBoQ5l0TSAYMlo6ndIBpjRKPnhKMXgOCZDk9fGnfG+dvmwyIKgX5BY6I3aXQ7EIjH5H2KBlufKaKB8QSkqSZ6UFP1BBAa9/CgYrfkUSOzYd8dHJYzCLqghf3PBILnOmpbUEStRSPQPzoy2aNWvGeATDwavosxKRVr+loWgCFEA4qqd614rwDBsqH+fjEnpc+6FkZhWonGHyAbXQ6k3jHFPFhLCRiBgfvDD/8c0eh+IMJbGv5f5SoLshmQDMAQemrijxGN7gcyQSl3x+llwahYGLD1h8LobiB42GMDcHqVXBCLwIPBIZq99UdZjR4BQtPQkFKsOQYDLPogGFJ0/iij0StAHo31A0MF/6nd7YdcjDuc/mQY3QxkYhRbhh4MDI4CxaRi0eNBeFvn/wFV4uhjKc2vWAAAAABJRU5ErkJggg==">
      </p>

      <p><strong>This page is taking way too long to load.</strong></p>
      <p>Sorry about that. Please try refreshing and contact us if the problem persists.</p>
      <div id="suggestions">
        <a href="https://github.com/contact">Contact Support</a> &mdash;
        <a href="https://status.github.com">GitHub Status</a> &mdash;
        <a href="https://twitter.com/githubstatus">@githubstatus</a>
      </div>

      <div id="logo">
      <a href="/"><img width="100" height="44" title="" alt="" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAABYCAYAAACwPrjdAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAb5wAAG+cBhbHcEAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAB+iSURBVHic7Z15fB3Fle+/1Vq8YTsOYMJmS90tbAyYxYNZQowJDIRsQCDMMISdhGyEkAkvk4WMM2RhIGFgJiSQgQQ+vAAJWYCEhAcMz+w4YBYDim1VlQT24LAZgzdsWV3zR3VbfVt9762+V1eSM/p9Pm3rdtdyurpO1alzTp0Sxhi2JaxcuXLcpk2b9jfGbHzrrbeenzNnTu9w05RFZ2dna+vYsQ8SIQCMQAgQ2Av7vxAIIzDmuTAITh8+akcWpNIbAS/+KRjQbvFlWBqG/p6Npqe50RUMFrTWR0ZGXA5mHxDNCMHkd03ZJJV+1BOc5/t+13DTmGD8+PHelr7ooOSzitxUBgwgxKaho2ybwBjKNVkKQlRPMxjwqicZXixevLhFqe7LIsO9YPanlKnHAEdEhqeUUqOj8F8HRpRIM+IZZPKUKV81mIuoPKpsZxA3dHV1zxsqukbRMIwyiCu01h0YvuaYXHie+YmUckxDiRpFozHKIK6IIhZgxSgnGJhhPO+sxlE0iiHAKIM4Q3BQ4SwRcxtByiiGDKMM4oLOzs7tAL9wRsHswaemGLZs2TKiPvI2hhHVdiOWQZqaJuyIg7ovBzsONi2jGFKMMogLZsyY3gOsK55TdA42LUWxefNm948cDY0+fxvCKIM4wgBLimYS8FwDaGkYzBAZvP7aYGqTLgpjJDMIRnBTwSxbokjc3BBiCmDjxo3Oo6AYog+9DWF0BnFFh+9fi+BB1/QCrujoaHumkTQ1AKMMUhtGZxDAeHAusNIh6eNjxrQuaDRBLli7dm2RUXCUQdIQI2sGGfHOir7vdy1dunS/5paWn4L4aE6SCMNlK1euuHj+/PlbXMrsUvo+AXszwFtUCIwR9K8LVBj4Bxalef78+UYq7ZhajDJIGsaZQYak3UY8gwDMnDnzDeA4pdT7jRBzMWZ/8N7B8CchogeCMHg+DN1NJsKwA4KdBj4ZsPSbXCfpLsSMMsgIxjbBIAmCILgfuH8Iq6xVBB1V89aOETWDjPQ1yPBCNJ5BRtW8AzCi1iD/OxnEc/sIwjS+846qeWvF0Kzd/ncyiCFyS1Zz5x3VYtWO0RlkBMCJQYYIowxSC4ZIuVHXIl0qLYApgAgD/43BIEgqPT4M/A2DUVZZmG1nabxs2bKJLS0tO/f29q6aMWPG2uGmpwBKgi0sXLhQTJw4UQCMGzdOtLa2ijAMexk4WA3KDLJs2Ypdmps3zzTG28HzzMtCiBWrV69+uWiQD+Ea1UQq3QocDLw/vkKs52zCZGsBDXQDXcAvwsBf7FCuF5d7XHzdGgb+guR5l9anCGPOQwiRrAkislFChIBIeEJc4vv+H5K8nZ2d27WOHXvfgEoNewHbObx2L4bOTFSS+DLCINZ1BH7u/hOpdITb7NAZBv5eyQ+t9R4RnEnEPkKwt4HpqXLeAlYYzN2R5103o719mUP5A2mT+ncI3lf6PoBAYEo7dnOTN6Wtre0d17KVUh8wiD+6pDWYszqC4IYS2pRejR10K0JATxD47VvzSTkLz/usMcwVMBOYmJMtQnAfkbh+8+aNt8+aNWtztXqqziBS6V2BzwPnVSF8IrBvfAFcJJV+ArgG2+k3SKWbgV2xH70NeB/wESixSZR2KmN2B3F4EgRkYAKIw4PQZ8zU9N3W1lYPU3zTVQotCPbN7+UCAW/XUXYMKypIKQMjmi4W8AmgCZE7lE4GJgvE3k2R+bLU+sFIiIv2aG//U6EqBRPIs/HkVNjc3NywuVYIUbeIL2XPMYi+CxHe0ZiqK3cPw9EIc3TrmHFvdGn9jQ7fv6ZShrIMIpXeDrgCOBNoKU46AAfG1xVS6beBXYCmKnmy7ziiFm0FYLm2KsQkKfX1CO90gSkm8hrmecY81KX1BdU+dA5tTmhqamqcMBrl9GeDk+7QwPZS6RcQzKptGWe2F4YfS6kP27BhwnmzZ++0Pi9VLgdLpf8GeBr4JLUzRxqTgd2pzhwD4OHVvKDu6+trNHNV+jKude+K4GxqXw+2xh/6+ir0pAlzbpfXXvMauVqrp+yJwKxBoODU8RPWL1q+fPkOeY8HMIhU+gTgUewaYzhQ0mimjtCPw8wgQwvB2VLqBcNNRhHkBn8TYjgkhr28puZfLly4cMAgVcIgUumDgZ8zOLNGrRg0EWvLlu0b29iVreBD/6EFF0vZnefQWQKvAG3NzW80bBCIiHIkmGGLhXvErrtPvyJ7cyuBUuk24HfAuCEkKg+lH8TR6p2HHXeMGtvYQ2BpLwiBMDct7elpq5TIuHvMFl6DGNPk3uZiZHkyC8z5XVqfmL6X5uB/A3LlsCFGqYi1bS/ShwOTmqPokoopCgw6DV2k52NYv7dn+A6ptbIHIJWeBxxfQ3nrsYv5bhr1YkXWIJkRaRtZpA8+DP+gtd6n/HP3NvW8oot097LL+KENK4MYmNGl1GnJ72QG+U6BMjYB/wJMAyaGgX9AGPg+VlM1D/ivOujbArxaR/7SwgYnPpUB+rC0bca+f/pqJGql34uMqDCLeA3rhKZp2Gf8dYCqpwCBdzEx8zZLpd8DvNcx79PAyWHgy+yDMPDXAg8BR0mlzwB+iJu1ej1wC3A3cF8Y+G+lH3oFhqTsiNTW1vZOT0/PgDXVlr5oKdZYWQ2vhIH/Hsfqs6ilo2zGcBuIhUJEC9esWfPi5MmTp+F5J2H4EjC1agn91X9YKTU1CIK6BpziM0gB5Dv81NJubyK4Shhz35o1a/40Z86c3u7u7p36+piHiM4BcUyx4ozf1dUzt6OjbVEz8CHc1JUbgVPymCOLMPBvjK3m1zmUuz4M/E86pKsJeW4SUutoCMa5gjUILYhODsIg656jgH/t6nrxTuH1PYb7Lscm8E7GDlRZ0hr39kN+IpN4rMnjlPb29hfTd9vb218BbgN+I7W+FsM5RUr1PHMisMgDjnbMc3EY+M6+P2HgX4/VilXDVKn0zuUfFxAH8iyzeTDOuvYhWaAa+K0nzAFBMIA5tqKjY/qfMeJkrLjnWK45pUx9DevETYXKzv1ervkNhktXrnhxXpY5MugLff9cgbjcnS4wmI+BXYO4iBoAvy5SQYx/d0y3Xw1lj3S4fuiVHYH/Md8vFS3zEIbt9wjEVwrQcIiUclKB9MOOfBe0XLwahv5XXQN1rFmz+utgXi5ASrBs2YpdPMBFxl4HVOLScqjqzRujLIMU0dnjPOKPqIMZnWcEgE2bNl6LFXddIKB5/+zNIobCoiji+VDnMWqF8s6ZM6cXI3LEzfJoato03YO86B4D0BkGfuFGDQP/TdwYK881uZEYChGrIZ1w1qxZ68C4iK4WXjSAQRqMut7bFNLJFMPmsa3XAgX2GjXt7gEuG51q6sDxhqp3OyStQENDRqTGzyDuAdAKf2gBtzonNmIAgxSclRuIaMhmEIBZu+222sCdzhUIpnmAy8J7hlR6QlGCgAA35hqU3YgFGnxELdKLIoqiZ13TCswujaQliyIiVpTbvq4KlNrcVDxEVS1sggh3BvGAA2qgx3WzUvmI7HX4YpVDgYVg7WjgKN3b2+ts2zDwrgE3G9Cm/Wiut2y3/Ka2PenGuK+lRcwgSx3TXxbbNpwgld4BuNQh6WqsAbJu5I9IA+EuYtTlTNewWcquQ5wX6o2PDlkrhsFZ0Ximp0DyaR7W+u2Cg4FvuSSM96//HNjNIfl9YeCX3RTVEJ29GFFarFrhOosMnEEaaMyrZ/9OUoRTqho1YE3FtLHTvDDwnwb+n2OGr0ml75NKz8l7KJUWUulTsLOSiwHSAJc51l0dziOSo5xb4zSe5K4jb1UIcA2k0DrwVuN8sYqgTmfFmr6NEKJAHAEzKRGZvg24+qscCTwhlV4KyPgaB3Rgo0ns6k4AN1eNfGJMIw4TGhEdJEajxYwhFWNMM0YMTdSxmt4riqIdC2Rd1wwQBv7DUukHgMMLELdnfNWKd4CvVUtUj7NiBQwFg4wkJiyFMesLdK+xRYpuNsY480d9zoq1Mn4Bh0/eTm+Y+jrWpXuocFUY+C8NYX1pNFTOLVRH4zHwHTz+4pp5y5Yt2w8qNYOHoWCQtVsZJAz8R4Dza6y0KFYB33NLWsRZcWTaLapg6DU5xjgzSNTU5GLoTZddl2tQARV8jWpeUcAuZN4o2TQfBv412K23jcTrwN9m930MJQpoxv4qZxBhPGcGaYqiojNIfa4mrh4Itc7ugqPc04rn8+JifRn4WU2VV8crWOZ4wTVDMbcINy2WEEMQvHqkuHPkdCTT5C5iGeM1LE6BqMcOUkPAjCVLXpmADZvrVoUxzw1gkDDwozDwzwbmM7hnjt8B7BMG/kg4hdZV1VdogVobhv4ItmY7UDnCHFqk7LrtIA3cqzNhwrqjgTGu6YUxS8rGRg0D/wHgWOrfI/4s8Hdh4B8fBv5rNeQfdGdFY5x9v8b29PQMNLS5ETMyZpCckTaKIucZBMGxFOqMhVxNhtRZ0SBOL5B884YNE8sziFR6NtYFpMiqf2t24KfAB8LA3y8M/F/WUEYNcHNWFJjXXUvs7RUVdjtumwiC4HXc96G8R+t8w3AePC+qxak1BecZqKmnp8c5XoCU3SdRIHKPgHtnz95pfbnYvM3A/8Ueb+CK5cBXgN3CwO8IA/+cMPBdLfTl4TXALcIIZ+9hz4sOq7ESJ7pF448Syys/ApxF3Sji6s7OzqoBOKTs/mgU4TwYRvkDmuv3bunri55a3t39vmoJlVLvB3OtK12WNvMrKH/C1H5A+bhKpXgaODwM/Blh4F8WBv5/FyFkMOHqrCiEO4MYzKdrJGdkiFhl2kQg3PeUCOa2jBl7u5QyV37v7OxsVar7KoS5A+G0/2dQYGBnLzL3dyl10apVq8Znny9fvnwHpbovMYh7CtLVO6al5Q4oH1E891CYHKwCPhgGvrtMWxCmAavYiOj1AlrCA6TUC8Kw/1CfFIRS6jiDd2YYtNcSeG8YEf0CxGW4DipwJMJ7Sil9rzHikb4+78mWlr49I2OOHTNm7IcNpq0GIgYj7E+zQFy2fsPGb0ulHsOIB4QQ4wzRDK+p+RiDcV6Up8j6zbRp096E+hnkzkYyR2G4qg2FeK3gTvd/llofgj2jfaUxpt1DBAYOBbEHmDxFhlMNjXA0yyC3/CAIVkilH8U9JhrALAOzEOaCpuY+bORj962Tjqi1uFYQhyM43LgezVKuftO3NeheOQZxPXdhVa1UOKMBzoq9ra2PtW7avIUiZ3IYjib2UBYDO8WIC6GZQtnGE4hbDaYIgwwq6rKDNAqCX4VBuNVOV24NstyxuI/VT9HgwdVZcdZuu60GHmwwOSMeTU3iVwzvib/1uJo0ApuJopI9T+UYxPXMu9lS6UPqo6kyCoWoKeCLJTC310RQueIGwpXuRh/FXbZN2tra/kKBIAaDjpHmOyf4YhiGJV4e9TIIwP1S6c/UTlVlGFPoCLYiDT6IDDJQVCgwEg4bgwA0N3mfwfrHDQNGkIhl+Hno+z/O3i73cZ7BHjnsgrHAj6TSXVLp66TSp8eH8QwWCljS3Rs8CIIVIB6rjaQMcnYeOsd3MsPLIG1tbX/BiLMbTEMu6gwcN2gwsGTDhgnn5T3L/Thh4L8DfLVgPSFwDnAj0C2V7pFKXyOVPi4+Mbc2FDMUFmtw03cuhQKJla01L3yN28wnhpdBAMKw/XcYt3gDDtXdAaxxSVnGUOhWC9yF+7bjiuU0CeYVOuU2xjXAf9RR93Ts2eq3A2/Ee9m/JJV2jQUMFAvaULTBwzDsNJjPFclTBsOxM84VTuWHob/ACE6l5k5nXjaCE609yLgOOjW/eyT4PcY7gkKOl1mY7waB/9FKcZErOSsa7JbYR2onYCtasXvZfwD8WSr92QJ5G+r81hEENxjBh6nPKTPvwJaRouZ1Rofv3+wJ3ifcI92Adez/Mcbs2eH7v7G3hJOfV71q3jBsexwT7WEwF2NY7Zit18CtmOjQMAi+ThUtXq4dQCo9Bbu78AvAYG+5HAdcLZX+EHB2GPgVRwDPGOPq+l9rg3f4/l3d3d2z+4z5CoaTcQs88QqGWzyPn/u+/2TO87eANwHbhbZ69xqDZZ6EgZzEkSwiWOnBGCMw1kV8qyhaUn5RtWn8LvOklLOEaDrPYI7CnnGfRMjcguEFbGDyxUKYB4MweD5TzGIQK2NyTPyPgTjGgMBgjBE5QdwMYlEqCrsxYBJNpjEYPJu3CfESQBiGbwPfXrly5Q82btwy2/P69jVC7IthP2BvYAOYHoHoNobneluabthz+nRn+53Iuu9Lpb8ELGBoAkq/hj2xamGFNJ6UsmXz5s1m48aNBmDt2rVm/vz56U6W/rteeMu7u98romgWMFXAVIQQwohVRphVwphVfZ738h7t7c9TMDL7tgyt9WRgJ8/zXso7lOivFSUMIpX+PvCPQ0zDy8DM+Ai3UYxiRKEZtkZhvw4YDnXfLsA/Y7f6jmIUIwrJIv146mOOCPdYsXm4QCq9Vx35RzGKhiBZpH+jQJ5NWB30L7AhRl8FXgsDv08qPRbYAbvR6kjgVNyOV2vGRnc8oVIiqfQHsTGCpwJLgEXVIjNKpXfHRqY/APCBPwNPAYtdtwBLpd+FjVR/KLAvdq/+fcBjYeBvjtPsiz3uoQl4MQz8XG8EqfS7gd9jB6dHwsDPFWml0pMo9XW7OamrKGIJYS627Q4C2oFFwP8HHowPOsrLNz/Otz+wF/AStu2eAu6O7WXZPMdg29pLXa9g9w0tCQM/dyCNw9l+JP75lzjCDlLpZ7ARO18ADiuXP057Hv3BDO8OA//unDTTsP3soPiaio3X+xhwbRiUKlxEl1THAn8oV2kGNwHnFwnZE2urfk31zfIvh4Gfqz2KtWo3YU/kzeK2mKZXMnkmYk94LbcPOcLGBf5mGPi9Fej/AnA5uTFu2YCN0vKoVPrHQLK56sYw8M8sU97n6bcvbQJ2zuugUukZlEbenxIGfmGNV9x2N9Lf+bKIYhpeTeV5N/CfVHZG7QQ+Ecd2TteXbocs+rDHfX8qDPyS8wLjzn1N/PPZMPD3i+930t/pfxoGftnTaqXSd9MfQvdbYVC6h0cqfQJ2K3ilOAPXAF9I+oSHDczggh8AZxSNZxUG/l3AiQ5Jd4lH6jz8iHzmAPg4cEH6hlT6QKy7TKVN+h7wT8AiqXRH9qFUepJU+lfAVeQzB8B4IO+QzErq5rNSf48B/r5CWtcycyGVPgA7cpdjDugf5ZM8+2MDbVTz1J6FbbsiNq0m7Hd8Tir9ccc8ae3k2VLpMwrUtxVS6UuB31DKHBuBrAX909C/bdgD2hzK3wh8o5ZzCmErk6xwSDpgH0rc2dOd6EbslHsI9oWXA5ek0k8AfosVpxK8Ft/7HvBHSsP+7A/cKpVuylT9I0oZuye+dxZWHMz6caXbJrczx4EwsgcRnZmXljrV1rG4+2tKTzG+CzuYHIPVVt6fydOMbd/0sRVLsTPo32PD0/5X6lkLcKVUOh2jOU33w9hB6l+wYZ+SZ+/GtvmBZfKJMvfB+v3tTXVsLUMqfSQ2XkKCZ4EjgCnYJcEJlH7P46XS54KV/dscKnsgT94siIeB3HO7U9gLeDRzL727cTXwuTDw1wPEo9D0jFz6DUoNfTcD56bTxIf7/BLbSGA77eeIj62WSh+GXT8luBM4NQz8dal7F8c2ozzxrNxof1bOvblS6Zlh4Fc7yKjoDPJ/6P+2EfCPYeBfmXp+j1T637DtlViTz6c0FsHPgM+Egb8pde+7UulPYsXXViyT/BC75sziv8PAvyn5IZU+CMuAM7CD87VS6QPDwK9kT8oyyHjgtjjfurwMacRMf1Xq1lPAURmx9vY4ePsTWKPoj7CDL158oxqqEuIAl5ioeaJM+hTeZlIdJQ5y1538lkrvCnwplf6OMPBPzS7swsB/HfhbIL0guyRet0Dp+e5LgBPyPkYY+FeEgZ+MqBVnEKl0C/CJ+OcG4J7U4zyxoeYZRCq9E1Z8THBNhjkA604UBv4lYeC/GnekBanHj4aBf3aGOZJ8/4mdRRO8P17QV6Q7DPxFwGn0M+T+9IvBLjNIMkjPBH5Srp5MGX+HHXgTfCFvzRff+xCwZxj4F4aBvxosg7g4ls1zSFMWccdzidCX53aSHlknAY/EmpI8zKWfyXqpYFuJR60vZsqeLZXeBfvhEiyodAJWGeSN9h/BTucA92IXiwlOk0pX8+otMoMcjHXpAasI+I5Dng5K11PVvLmvoHQfiVPsrDDwn8CKWwmqhe1JM8j3sIZlgFOk0i4RZ9J0PREHaS9H27Iw8HX6noebk97UWPtSGPHIeS12Kq6GvAAQd2LViwlmA3dLpZ+NZcs00rLp82HgVzzRNG6stKp3b0pFjD6s3O6CamuQtHj1u/hKZqVdYUBQ5exIXIRB0u/wQlZjVAbptttEFSfVWMx9PKdOl5kvHZNrdk6+cjPIa9i1UHJMx5WxIiIPSRnp2WORA20lcGUQgP+QSl8ay+9OkErvh+1g1dYeYD/KU9mbsWjzEQbucpwN3CuVvjJekELpR3Y9nDS9xXIf+j8YQE+NtoeSziyVfg/wgfinAX4fBv4GSkfSM2uopxzSDOIaXyDdkbqqrAsSpNvYNdAHlHo/7xXbaZwQBv5DWGUBWC3gbVLpSgeVzkz93ZN9KJX+vlR6mVR6ebzpT0qllVRaS6U/34wdKVzOEwSrCfiyVPphrJjwKtZj9U0sV++INbzshrXOFzmB6sG40wxAGPhL4r3v52Jl3yTio8BqZcYDn8pkc42HlE63hfIq3WqoNIOcRr9R9k8pm80t9CsDjpdKTwoDP9Gw1TODpEXCAQHVyiCtvnf14J6S+jtxN3eZQdKOsG+FgW+k0i4zSHL/cuAw7MDpY5UJWbV0kvZNYFr8d17wuJ2APcrQuc4D3CPsWTRhj2r7NnahdBvWqrww/vtqrPxa9Hi2Wyo9jBfkP8GqLc8ncSW3OCdemKbdrtNq3kpIp+uk9Ejqdqn0OIoj25mz4lWCe2BrIO1xwMk11JWH9Du4uvCkI/nvHBsYq2FG6u9Ox3qgVHNa7QSBAQwSmxvOoH9GOEEqfWGZ/OnyZ+Y8X44VvRZh1b9pdHth4C/HqreGE0uw6r+qCAN/Yxj4PwT+IXXbo98FJMG+1fy7pNJHUaolyzKIh3too9wRMFZtpgeLr0ml10il12Bl6rTh6swy5ZWU6YC0qBpIpV1iX2X3dJS1WMNWS3+63IRBKs4g8Zo03aZJvUVmkETr9HEgEYH/lVIxL0mbfq9jpdIl8aZjLd7BYeAfzECXq62ak09h1wDDgV6sq0hZTZFUer+UCjbBw5nfY7CjQKIKFMCCcvJtrNZMN8garIvDKizDJviWVLqsuBZ/8CzSdWZtH+OByakrbaB8r1Q6LFdXATxOqUbwCmnPrh8AqXSLVHpMHCEzPVBeKJXOPec+brvv0f+e72BFbhdchNWYgRVpb6iSvpLa+En61fot5JssbqO/b4+jsnYuPSg8Ggb+Ci+u6BmGfh8IWFn5tDDwywZxk0ofjBXfskfDZbU+nXHnvjx17yTgpmzniK3td1J6qu83U3tSPkv/hwmwoY3SMw1S6ebY0PbB+NaAkS4Wz9JeAE9iF+bZKy0uJjaRmmeQWLGRFjnmAvdlFSzSRp95GEiOeDg/Ve8uwGNS6YPTg0zs7Hc7pY6ll4WBn+wOHNCh47baSyr9W0pVzt8PA//ZnHxVZ5DUu16NdZzNIhHHNFYlneBCqfQl6YRSaSGV/iqlxyNcAqktt2HgXx27W5RzzBtsrAE+HQZ+3ssBWzvY7diR9pzYV+t6rBIgfYR0d3yBHdnOoH9hdirwUan0Y1gxYF+sF2d68foc1noKWPWvVPpn9G8BOBRYKpV+CLvVNMQy1+7AAzmkJx/yhJh2sCrj4/JUrlLpy+m32Zwmlf5mTpnXSqU3Y8U+gR3hfpCTLnmHW6TSZ2ENomDtDS9JpZ/AtsMcrAdBUyrPIqn0DfTPerthXTDekko/jR0ssqP0i8ClZcg4Sir9Ara9sn1qMThFUqnqwoNV3uxH6Zooje9i+0HSJ74hlT4T62rzBtYLIK29fDjxBM4e4vnv2M5Q0X4wCLgD2KsSc8T0bMR+rMSd40Ss5/FPKF3ofT4R0eI8xwHLUs8nYjV1X8S6l6SZ4yngYzlqzQuwHsQJ3oXVmizAWsSzHSXvQ6b32NxVwR6RXn9Nxx5/lx2Jj8PK3CdiZfiDy5SVxklYV5sE47BG308DB1Iq3iX4LNaTIF3/5Jim7Ds/BMzLeCqk822PXRekmSPCrhcOzbgvufpiDUA8Y55EqdFbZJ7PxSqTEuyGteJfSClz3EnKgTfvjMLF2EXliVjX5MGK3fo6cCUwO7THsbkYrwgD/4/YxWueu8s64Lww8P+QyfMMdnSs5I5gsB7Kh+QZFMPAXxcG/unYkaecm/mb5Fv/hbThjdIHRl5XjpAw8J+nVDlwZgW6E+R17my5b4eBfyp2Ri0XHONxUireMPDfCQP/AqzouKxMnjewu0CPCN3Oun8T6+SYMMY/FbAvRdjZt5cKfTFuw7IhnGLV+jHYNcjzmbIMdp/QN8m4FQ0I2pBFbITZHzsl740dSSfG16TU/+OxHfYtbId6E2uEexo7Sj8XVth3UQ3xQvkI7Cg+Ji739ynZt1y+qcDfxPTvgW2IxcCTYeA7HaQTL0r3xo5C+2DtP8+R2jQU+4ElGpI18dWWKua5Ssa3eI2TqFY3Yb2fA0qjlKSv9WFqD4fje7RjxcsQ653wRBj4f66SZwq27faJaXoyDPyeCumbyUTLGQRHV2dIpQ/HzpQ61tCWSzcJO4sKbDvkbuP4H7UI7r2G6awiAAAAAElFTkSuQmCC" /></a>
      </div>
    </div>
  </body>
</html>

/* =============================================================
 * bootstrap-collapse.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#collapse
 * =============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */


!function ($) {

  "use strict"; // jshint ;_;


 /* COLLAPSE PUBLIC CLASS DEFINITION
  * ================================ */

  var Collapse = function (element, options) {
    this.$element = $(element)
    this.options = $.extend({}, $.fn.collapse.defaults, options)

    if (this.options.parent) {
      this.$parent = $(this.options.parent)
    }

    this.options.toggle && this.toggle()
  }

  Collapse.prototype = {

    constructor: Collapse

  , dimension: function () {
      var hasWidth = this.$element.hasClass('width')
      return hasWidth ? 'width' : 'height'
    }

  , show: function () {
      var dimension
        , scroll
        , actives
        , hasData

      if (this.transitioning || this.$element.hasClass('in')) return

      dimension = this.dimension()
      scroll = $.camelCase(['scroll', dimension].join('-'))
      actives = this.$parent && this.$parent.find('> .accordion-group > .in')

      if (actives && actives.length) {
        hasData = actives.data('collapse')
        if (hasData && hasData.transitioning) return
        actives.collapse('hide')
        hasData || actives.data('collapse', null)
      }

      this.$element[dimension](0)
      this.transition('addClass', $.Event('show'), 'shown')
      $.support.transition && this.$element[dimension](this.$element[0][scroll])
    }

  , hide: function () {
      var dimension
      if (this.transitioning || !this.$element.hasClass('in')) return
      dimension = this.dimension()
      this.reset(this.$element[dimension]())
      this.transition('removeClass', $.Event('hide'), 'hidden')
      this.$element[dimension](0)
    }

  , reset: function (size) {
      var dimension = this.dimension()

      this.$element
        .removeClass('collapse')
        [dimension](size || 'auto')
        [0].offsetWidth

      this.$element[size !== null ? 'addClass' : 'removeClass']('collapse')

      return this
    }

  , transition: function (method, startEvent, completeEvent) {
      var that = this
        , complete = function () {
            if (startEvent.type == 'show') that.reset()
            that.transitioning = 0
            that.$element.trigger(completeEvent)
          }

      this.$element.trigger(startEvent)

      if (startEvent.isDefaultPrevented()) return

      this.transitioning = 1

      this.$element[method]('in')

      $.support.transition && this.$element.hasClass('collapse') ?
        this.$element.one($.support.transition.end, complete) :
        complete()
    }

  , toggle: function () {
      this[this.$element.hasClass('in') ? 'hide' : 'show']()
    }

  }


 /* COLLAPSE PLUGIN DEFINITION
  * ========================== */

  var old = $.fn.collapse

  $.fn.collapse = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('collapse')
        , options = $.extend({}, $.fn.collapse.defaults, $this.data(), typeof option == 'object' && option)
      if (!data) $this.data('collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.collapse.defaults = {
    toggle: true
  }

  $.fn.collapse.Constructor = Collapse


 /* COLLAPSE NO CONFLICT
  * ==================== */

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old
    return this
  }


 /* COLLAPSE DATA-API
  * ================= */

  $(document).on('click.collapse.data-api', '[data-toggle=collapse]', function (e) {
    var $this = $(this), href
      , target = $this.attr('data-target')
        || e.preventDefault()
        || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') //strip for ie7
      , option = $(target).data('collapse') ? 'toggle' : $this.data()
    $this[$(target).hasClass('in') ? 'addClass' : 'removeClass']('collapsed')
    $(target).collapse(option)
  })

}(window.jQuery);
/* ==========================================================
 * bootstrap-carousel.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#carousel
 * ==========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* CAROUSEL CLASS DEFINITION
  * ========================= */

  var Carousel = function (element, options) {
    this.$element = $(element)
    this.$indicators = this.$element.find('.carousel-indicators')
    this.options = options
    this.options.pause == 'hover' && this.$element
      .on('mouseenter', $.proxy(this.pause, this))
      .on('mouseleave', $.proxy(this.cycle, this))
  }

  Carousel.prototype = {

    cycle: function (e) {
      if (!e) this.paused = false
      if (this.interval) clearInterval(this.interval);
      this.options.interval
        && !this.paused
        && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))
      return this
    }

  , getActiveIndex: function () {
      this.$active = this.$element.find('.item.active')
      this.$items = this.$active.parent().children()
      return this.$items.index(this.$active)
    }

  , to: function (pos) {
      var activeIndex = this.getActiveIndex()
        , that = this

      if (pos > (this.$items.length - 1) || pos < 0) return

      if (this.sliding) {
        return this.$element.one('slid', function () {
          that.to(pos)
        })
      }

      if (activeIndex == pos) {
        return this.pause().cycle()
      }

      return this.slide(pos > activeIndex ? 'next' : 'prev', $(this.$items[pos]))
    }

  , pause: function (e) {
      if (!e) this.paused = true
      if (this.$element.find('.next, .prev').length && $.support.transition.end) {
        this.$element.trigger($.support.transition.end)
        this.cycle(true)
      }
      clearInterval(this.interval)
      this.interval = null
      return this
    }

  , next: function () {
      if (this.sliding) return
      return this.slide('next')
    }

  , prev: function () {
      if (this.sliding) return
      return this.slide('prev')
    }

  , slide: function (type, next) {
      var $active = this.$element.find('.item.active')
        , $next = next || $active[type]()
        , isCycling = this.interval
        , direction = type == 'next' ? 'left' : 'right'
        , fallback  = type == 'next' ? 'first' : 'last'
        , that = this
        , e

      this.sliding = true

      isCycling && this.pause()

      $next = $next.length ? $next : this.$element.find('.item')[fallback]()

      e = $.Event('slide', {
        relatedTarget: $next[0]
      , direction: direction
      })

      if ($next.hasClass('active')) return

      if (this.$indicators.length) {
        this.$indicators.find('.active').removeClass('active')
        this.$element.one('slid', function () {
          var $nextIndicator = $(that.$indicators.children()[that.getActiveIndex()])
          $nextIndicator && $nextIndicator.addClass('active')
        })
      }

      if ($.support.transition && this.$element.hasClass('slide')) {
        this.$element.trigger(e)
        if (e.isDefaultPrevented()) return
        $next.addClass(type)
        $next[0].offsetWidth // force reflow
        $active.addClass(direction)
        $next.addClass(direction)
        this.$element.one($.support.transition.end, function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () { that.$element.trigger('slid') }, 0)
        })
      } else {
        this.$element.trigger(e)
        if (e.isDefaultPrevented()) return
        $active.removeClass('active')
        $next.addClass('active')
        this.sliding = false
        this.$element.trigger('slid')
      }

      isCycling && this.cycle()

      return this
    }

  }


 /* CAROUSEL PLUGIN DEFINITION
  * ========================== */

  var old = $.fn.carousel

  $.fn.carousel = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('carousel')
        , options = $.extend({}, $.fn.carousel.defaults, typeof option == 'object' && option)
        , action = typeof option == 'string' ? option : options.slide
      if (!data) $this.data('carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (action) data[action]()
      else if (options.interval) data.pause().cycle()
    })
  }

  $.fn.carousel.defaults = {
    interval: 5000
  , pause: 'hover'
  }

  $.fn.carousel.Constructor = Carousel


 /* CAROUSEL NO CONFLICT
  * ==================== */

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old
    return this
  }

 /* CAROUSEL DATA-API
  * ================= */

  $(document).on('click.carousel.data-api', '[data-slide], [data-slide-to]', function (e) {
    var $this = $(this), href
      , $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
      , options = $.extend({}, $target.data(), $this.data())
      , slideIndex

    $target.carousel(options)

    if (slideIndex = $this.attr('data-slide-to')) {
      $target.data('carousel').pause().to(slideIndex).cycle()
    }

    e.preventDefault()
  })

}(window.jQuery);
/* =============================================================
 * bootstrap-typeahead.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#typeahead
 * =============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */


!function($){

  "use strict"; // jshint ;_;


 /* TYPEAHEAD PUBLIC CLASS DEFINITION
  * ================================= */

  var Typeahead = function (element, options) {
    this.$element = $(element)
    this.options = $.extend({}, $.fn.typeahead.defaults, options)
    this.matcher = this.options.matcher || this.matcher
    this.sorter = this.options.sorter || this.sorter
    this.highlighter = this.options.highlighter || this.highlighter
    this.updater = this.options.updater || this.updater
    this.source = this.options.source
    this.$menu = $(this.options.menu)
    this.shown = false
    this.listen()
  }

  Typeahead.prototype = {

    constructor: Typeahead

  , select: function () {
      var val = this.$menu.find('.active').attr('data-value')
      this.$element
        .val(this.updater(val))
        .change()
      return this.hide()
    }

  , updater: function (item) {
      return item
    }

  , show: function () {
      var pos = $.extend({}, this.$element.position(), {
        height: this.$element[0].offsetHeight
      })

      this.$menu
        .insertAfter(this.$element)
        .css({
          top: pos.top + pos.height
        , left: pos.left
        })
        .show()

      this.shown = true
      return this
    }

  , hide: function () {
      this.$menu.hide()
      this.shown = false
      return this
    }

  , lookup: function (event) {
      var items

      this.query = this.$element.val()

      if (!this.query || this.query.length < this.options.minLength) {
        return this.shown ? this.hide() : this
      }

      items = $.isFunction(this.source) ? this.source(this.query, $.proxy(this.process, this)) : this.source

      return items ? this.process(items) : this
    }

  , process: function (items) {
      var that = this

      items = $.grep(items, function (item) {
        return that.matcher(item)
      })

      items = this.sorter(items)

      if (!items.length) {
        return this.shown ? this.hide() : this
      }

      return this.render(items.slice(0, this.options.items)).show()
    }

  , matcher: function (item) {
      return ~item.toLowerCase().indexOf(this.query.toLowerCase())
    }

  , sorter: function (items) {
      var beginswith = []
        , caseSensitive = []
        , caseInsensitive = []
        , item

      while (item = items.shift()) {
        if (!item.toLowerCase().indexOf(this.query.toLowerCase())) beginswith.push(item)
        else if (~item.indexOf(this.query)) caseSensitive.push(item)
        else caseInsensitive.push(item)
      }

      return beginswith.concat(caseSensitive, caseInsensitive)
    }

  , highlighter: function (item) {
      var query = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&')
      return item.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
        return '<strong>' + match + '</strong>'
      })
    }

  , render: function (items) {
      var that = this

      items = $(items).map(function (i, item) {
        i = $(that.options.item).attr('data-value', item)
        i.find('a').html(that.highlighter(item))
        return i[0]
      })

      items.first().addClass('active')
      this.$menu.html(items)
      return this
    }

  , next: function (event) {
      var active = this.$menu.find('.active').removeClass('active')
        , next = active.next()

      if (!next.length) {
        next = $(this.$menu.find('li')[0])
      }

      next.addClass('active')
    }

  , prev: function (event) {
      var active = this.$menu.find('.active').removeClass('active')
        , prev = active.prev()

      if (!prev.length) {
        prev = this.$menu.find('li').last()
      }

      prev.addClass('active')
    }

  , listen: function () {
      this.$element
        .on('focus',    $.proxy(this.focus, this))
        .on('blur',     $.proxy(this.blur, this))
        .on('keypress', $.proxy(this.keypress, this))
        .on('keyup',    $.proxy(this.keyup, this))

      if (this.eventSupported('keydown')) {
        this.$element.on('keydown', $.proxy(this.keydown, this))
      }

      this.$menu
        .on('click', $.proxy(this.click, this))
        .on('mouseenter', 'li', $.proxy(this.mouseenter, this))
        .on('mouseleave', 'li', $.proxy(this.mouseleave, this))
    }

  , eventSupported: function(eventName) {
      var isSupported = eventName in this.$element
      if (!isSupported) {
        this.$element.setAttribute(eventName, 'return;')
        isSupported = typeof this.$element[eventName] === 'function'
      }
      return isSupported
    }

  , move: function (e) {
      if (!this.shown) return

      switch(e.keyCode) {
        case 9: // tab
        case 13: // enter
        case 27: // escape
          e.preventDefault()
          break

        case 38: // up arrow
          e.preventDefault()
          this.prev()
          break

        case 40: // down arrow
          e.preventDefault()
          this.next()
          break
      }

      e.stopPropagation()
    }

  , keydown: function (e) {
      this.suppressKeyPressRepeat = ~$.inArray(e.keyCode, [40,38,9,13,27])
      this.move(e)
    }

  , keypress: function (e) {
      if (this.suppressKeyPressRepeat) return
      this.move(e)
    }

  , keyup: function (e) {
      switch(e.keyCode) {
        case 40: // down arrow
        case 38: // up arrow
        case 16: // shift
        case 17: // ctrl
        case 18: // alt
          break

        case 9: // tab
        case 13: // enter
          if (!this.shown) return
          this.select()
          break

        case 27: // escape
          if (!this.shown) return
          this.hide()
          break

        default:
          this.lookup()
      }

      e.stopPropagation()
      e.preventDefault()
  }

  , focus: function (e) {
      this.focused = true
    }

  , blur: function (e) {
      this.focused = false
      if (!this.mousedover && this.shown) this.hide()
    }

  , click: function (e) {
      e.stopPropagation()
      e.preventDefault()
      this.select()
      this.$element.focus()
    }

  , mouseenter: function (e) {
      this.mousedover = true
      this.$menu.find('.active').removeClass('active')
      $(e.currentTarget).addClass('active')
    }

  , mouseleave: function (e) {
      this.mousedover = false
      if (!this.focused && this.shown) this.hide()
    }

  }


  /* TYPEAHEAD PLUGIN DEFINITION
   * =========================== */

  var old = $.fn.typeahead

  $.fn.typeahead = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('typeahead')
        , options = typeof option == 'object' && option
      if (!data) $this.data('typeahead', (data = new Typeahead(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.typeahead.defaults = {
    source: []
  , items: 8
  , menu: '<ul class="typeahead dropdown-menu"></ul>'
  , item: '<li><a href="#"></a></li>'
  , minLength: 1
  }

  $.fn.typeahead.Constructor = Typeahead


 /* TYPEAHEAD NO CONFLICT
  * =================== */

  $.fn.typeahead.noConflict = function () {
    $.fn.typeahead = old
    return this
  }


 /* TYPEAHEAD DATA-API
  * ================== */

  $(document).on('focus.typeahead.data-api', '[data-provide="typeahead"]', function (e) {
    var $this = $(this)
    if ($this.data('typeahead')) return
    $this.typeahead($this.data())
  })

}(window.jQuery);
