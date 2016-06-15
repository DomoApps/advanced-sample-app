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
      d3Id: '<'
      // Outputs should use & bindings.
    }
  });

  function lineChartCtrl() {
    const ctrl = this;
    let _chart = undefined;

    ctrl.$onInit = $onInit;
    ctrl.$onChanges = $onChanges;

    function $onInit() {
      // Called on each controller after all the controllers have been constructed and had their bindings initialized
      // Use this for initialization code.

      _chart = d3.select(ctrl.d3Id).insert('svg')
        .attr('height', 650)
        .attr('width', 517.5)
        .append('g')
        .attr('transform', 'translate(25,50)')
        .chart('MultiLineChart')
        .c({
          height: 500,
          width: 467,
          showGradients: { name: 'Hide', value: false },
          xAddAxis: { name: 'Show', value: true },
          xAddGridlines: { name: 'Show', value: true },
          yAddZeroline: { name: 'Hide', value: false }
        }).a('X Axis', line => {
          // override default accessor, it doesn't accept "quarter" values (ex "2015 Q1")
          return line[0];
        });
      _chart.draw(ctrl.chartData);
    }

    function $onChanges(changes) {
      if (typeof changes.chartData !== 'undefined' && typeof _chart !== 'undefined') {
        _chart.draw(ctrl.chartData);
      }
    }
  }

  // inject dependencies here
  lineChartCtrl.$inject = [];

  if (ON_TEST) {
    require('./line-chart.component.spec.js')(ngModule);
  }
};
