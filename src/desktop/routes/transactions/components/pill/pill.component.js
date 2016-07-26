module.exports = ngModule => {
  const d3 = require('d3');
  require('@domoinc/ca-icon-trends-with-text');

  ngModule.component('pill', {
    template: '<svg><svg>',
    controller: pillCtrl,
    bindings: {
      // Inputs should use < and @ bindings.
      chartData: '<',
      pillTitle: '<',
      pillCaption: '<',
      pillColor: '<',
      isActive: '<',
      // Outputs should use & bindings.
      onClick: '&'
    }
  });

  function pillCtrl($element, $timeout) {
    const ctrl = this;
    let _pill = undefined;
    let _circle = undefined;
    const _grayColor = '#bbb';

    const _centerOffset = '.35em'; // y offset to center text in pill
    const _textSizes = {
      small: '12',
      large: '23'
    };
    const _pillWidth = 480;
    const _pillHeight = 121;

    ctrl.$onInit = $onInit;
    ctrl.$postLink = $postLink;
    ctrl.$onChanges = $onChanges;
    ctrl.$onDestroy = $onDestroy;
    ctrl.pillClicked = pillClicked;

    function $onInit() {
      // Called on each controller after all the controllers have been constructed and had their bindings initialized
      // Use this for initialization code.
    }

    function $postLink() {
      const chartOptions = {
        width: _pillWidth,
        height: _pillHeight
      };
      // merge color options object with chartOptions
      Object.assign(chartOptions, _getColors());
      _pill = d3.select($element.children()[0]).insert('g')
        .chart('CAIconTrendsWithText')
        .c(chartOptions);

      /**
       * wrap chart drawing in a timeout
       *
       * for some reason the DOM is not painted when $postLink is run, which messes with
       * `getBBox()` and d3 in general
       *
       * by running a timeout(fn, 0) we add our _chart.draw to the end of the event queue,
       * after the first layout paint
       */
      $timeout(() => {
        _pill.draw(ctrl.chartData);
        _circle = d3.select($element.children()[0]).select(' .iconCircle').node();

        // create a <g> parent of _circle
        d3.select(_circle.parentNode)
          .insert('g', () => { return _circle; })
          .append(() => { return _circle; });

        const circleBBox = _circle.getBBox();
        const xloc = circleBBox.x + (circleBBox.width / 2);
        const yloc = circleBBox.y + (circleBBox.height / 2);
        ['small', 'large'].forEach(textType => {
          // add text inside the parent <g> and size them
          // to fit inside the circle
          const fontSize = (textType === 'small' ? _textSizes.small : _textSizes.large);
          const alignemtnBaseline = (textType === 'small' ? 'hanging' : 'alphabetic');
          d3.select(_circle.parentNode)
            .append('text')
            .attr('class', 'text-' + textType)
            .attr('transform', 'translate(' + xloc + ',' + (textType === 'small' ? yloc : yloc - 10) + ')') // align large text a little higher
            .attr('text-anchor', 'middle')
            .attr('alignment-baseline', alignemtnBaseline)
            .attr('dy', _centerOffset)
            .attr('font-size', fontSize);
        });
        _changeText(_circle, ctrl.pillTitle, ctrl.pillCaption);
      }, 0, false);
    }

    function $onChanges(changes) {
      if (typeof changes.chartData !== 'undefined') {
        _pill.draw(changes.chartData.currentValue);
      }
      if (typeof changes.pillTitle !== 'undefined') {
        _changeText(_circle, changes.pillTitle.currentValue, ctrl.pillCaption);
      }
      if (typeof changes.pillCaption !== 'undefined') {
        _changeText(_circle, ctrl.pillTitle, changes.pillCaption.currentValue);
      }
      if (typeof changes.isActive !== 'undefined') {
        _pill.c(_getColors());
        _pill.draw(ctrl.chartData);
      }
    }

    function $onDestroy() {
      // free up memory
      _pill = d3.select($element.children()[0]).remove();
    }

    function pillClicked() {
      ctrl.onClick();
    }

    function _changeText(circle, pillTitle, pillCaption) {
      d3.select(circle.parentNode).select('.text-large').text(pillTitle);
      d3.select(circle.parentNode).select('.text-small').text(pillCaption);
    }

    function _getColors() {
      if (ctrl.isActive) {
        return {
          generalFillBadColor: ctrl.pillColor,
          generalFillGoodColor: ctrl.pillColor,
          generalFillNeutralColor: ctrl.pillColor,
          generalStrokeBadColor: ctrl.pillColor,
          generalStrokeGoodColor: ctrl.pillColor,
          generalStrokeNeutralColor: ctrl.pillColor
        };
      }
      return {
        generalFillBadColor: _grayColor,
        generalFillGoodColor: _grayColor,
        generalFillNeutralColor: _grayColor,
        generalStrokeBadColor: _grayColor,
        generalStrokeGoodColor: _grayColor,
        generalStrokeNeutralColor: _grayColor
      };
    }
  }

  // inject dependencies here
  pillCtrl.$inject = ['$element', '$timeout'];

  if (ON_TEST) {
    require('./pill.component.spec.js')(ngModule);
  }
};
