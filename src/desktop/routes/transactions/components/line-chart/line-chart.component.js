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

  function lineChartCtrl($element) {
    const ctrl = this;
    let _chart = undefined;

    ctrl.$onInit = $onInit;
    ctrl.$onChanges = $onChanges;
    ctrl.$onDestroy = $onDestroy;

    function $onInit() {
      // Called on each controller after all the controllers have been constructed and had their bindings initialized
      // Use this for initialization code.

      // the chart's axes are by default larger than the svg element
      const translateX = 25;
      const translateY = 5;
      _chart = d3.select($element.children()[0])
        .attr('height', 650)
        .attr('width', 528)
        .append('g')
        .attr('transform', 'translate(' + translateX + ',' + translateY + ')')
        .chart('MultiLineChart')
        .c({
          height: 620,
          width: 478,
          strokeWidth: 3,
          xAddAxis: { name: 'Show', value: true },
          xAddGridlines: { name: 'Show', value: true },
          yAddZeroline: { name: 'Hide', value: false },
          singleColor: ctrl.lineColor
        }).a('X Axis', line => {
          // override default accessor, it doesn't accept "quarter" values (ex "2015 Q1")
          return line[0];
        });
      _chart.draw(ctrl.chartData);
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
  lineChartCtrl.$inject = ['$element'];

  if (ON_TEST) {
    require('./line-chart.component.spec.js')(ngModule);
  }
};
