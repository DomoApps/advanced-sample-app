module.exports = ngModule => {
  // todo: ask andrew if there are better ways
  require('./transactions-container.component.css');
  const d3 = require('d3');
  const SummaryNumber = require('@domoinc/summary-number');
  require('@domoinc/multi-line');

  ngModule.component('transactionsContainer', {
    template: require('./transactions-container.component.html'),
    controller: transactionsContainerCtrl,
    bindings: {
      // Inputs should use < and @ bindings.
      // Outputs should use & bindings.
    }
  });

  function transactionsContainerCtrl(transactionsAnalyticsService, $q) {
    const ctrl = this;

    ctrl.$onInit = $onInit;
    ctrl.loading = true;
    ctrl.transactionCount = undefined;
    ctrl.productsSold = undefined;
    ctrl.income = undefined;

    const summary = new SummaryNumber();

    function $onInit() {
      // Called on each controller after all the controllers have been constructed and had their bindings initialized
      // Use this for initialization code.
      $q.all([transactionsAnalyticsService.getTotals()/*,
        transactionsAnalyticsService.getTopSellingItem()*/]).then(data => {
          ctrl.loading = false;
          ctrl.transactionCount = summary.summaryNumber(data[0].transactionCount);
          ctrl.productsSold = summary.summaryNumber(data[0].productsSold);
          ctrl.income = summary.summaryNumber(data[0].income);
          console.log(data[0].income);
        }, error => {
          console.log('error retrieving db results!');
          console.log(error);
        });

      $q.all([transactionsAnalyticsService.getGrossProfitPerMonth(),
        transactionsAnalyticsService.getItemsSoldPerMonth()]).then(data => {
          console.log(data);
          const salesChart = d3.select('#vis')
            .append('svg')
            .attr('height', 600)
            .attr('width', 517.5)
            .chart('MultiLine')
            .c({
              height: 500,
              width: 517.5,
              showGradients: true
            });
          salesChart.draw(formatSalesData(data));
        });
      //transactionsAnalyticsService.getTopGrossingItem();
    }

    function formatSalesData(salesData) {
      const toReturn = [];
      for (let i = 0; i < salesData[0].length; i++) {
        toReturn.push([salesData[0][i].CalendarMonth, salesData[0][i].total, 'Sales']);
      }
      for (let i = 0; i < salesData[1].length; i++) {
        toReturn.push([salesData[1][i].CalendarMonth, salesData[1][i].quantity, 'Quantity']);
      }
      return toReturn;
    }
  }

  // inject dependencies here
  transactionsContainerCtrl.$inject = ['transactionsAnalyticsService', '$q'];

  if (ON_TEST) {
    require('./transactions-container.component.spec.js')(ngModule);
  }
};
