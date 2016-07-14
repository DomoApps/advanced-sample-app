module.exports = ngModule => {
  require('./line-chart.component.css');
  const d3 = require('d3');
  require('@domoinc/multi-line-chart');

  ngModule.component('lineChart', {
    template: require('./line-chart.component.html'),
    controller: lineChartCtrl,
    bindings: {
      // Inputs should use < and @ bindings.
      chartData: '<',
      lineColor: '<'
      // Outputs should use & bindings.
    }
  });

  function lineChartCtrl($element, $timeout) {
    const ctrl = this;
    let _chart = undefined;
    const _svgHeight = 650;
    const _svgWidth = 528;
    const _lineChartHeight = 620;
    const _lineChartWidth = 478;
    // the chart's axes are by default larger than the svg element
    const _translateX = 25;
    const _translateY = 5;

    ctrl.$onInit = $onInit;
    ctrl.$postLink = $postLink;
    ctrl.$onChanges = $onChanges;
    ctrl.$onDestroy = $onDestroy;

    function $onInit() {
      // Called on each controller after all the controllers have been constructed and had their bindings initialized
      // Use this for initialization code.
    }

    function $postLink() {
      _chart = d3.select($element.children()[0])
        .attr('height', _svgHeight)
        .attr('width', _svgWidth)
        .append('g')
        // offset the chart so we can see the axes
        .attr('transform', 'translate(' + _translateX + ',' + _translateY + ')')
        .chart('MultiLineChart')
        .c({
          height: _lineChartHeight,
          width: _lineChartWidth,
          strokeWidth: 3,
          xAddAxis: { name: 'Show', value: true },
          xAddGridlines: { name: 'Show', value: true },
          yAddZeroline: { name: 'Hide', value: false },
          singleColor: ctrl.lineColor
        }).a('X Axis', line => {
          // override default accessor, it doesn't accept "quarter" values (ex "2015 Q1")
          return line[0];
        });
      /**
       * wrap chart drawing in a timeout
       *
       * for some reason the DOM is not painted when $postLink is run, which messes with d3
       *
       * by running a timeout(fn, 0) we add our _chart.draw to the end of the event queue,
       * after the first layout paint
       */
      $timeout(() => {
        _chart.draw(ctrl.chartData);
      }, 0, false);
    }

    function $onChanges(changes) {
      if (typeof changes.chartData !== 'undefined' || typeof changes.lineColor !== 'undefined') {
        if (typeof changes.lineColor !== 'undefined') {
          _chart.c({ singleColor: ctrl.lineColor });
        }
        _chart.draw(ctrl.chartData);
      }
    }

    function $onDestroy() {
      _chart = d3.select($element.children()[0]).remove();
    }
  }

  // inject dependencies here
  lineChartCtrl.$inject = ['$element', '$timeout'];

  if (ON_TEST) {
    require('./line-chart.component.spec.js')(ngModule);
  }
};
