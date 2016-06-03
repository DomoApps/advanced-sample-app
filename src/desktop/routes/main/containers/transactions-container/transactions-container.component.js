module.exports = ngModule => {
  // todo: ask andrew if there are better ways
  require('./transactions-container.component.css');
  const d3 = require('d3');
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

    function $onInit() {
      // Called on each controller after all the controllers have been constructed and had their bindings initialized
      // Use this for initialization code.
      $q.all([transactionsAnalyticsService.getTotals()/*,
        transactionsAnalyticsService.getTopSellingItem()*/]).then(data => {
          ctrl.loading = false;
          ctrl.transactionCount = data[0].transactionCount;
          ctrl.productsSold = data[0].productsSold;
          ctrl.income = data[0].income;
        }, error => {
          console.log('error retrieving db results!');
          console.log(error);
        });

      transactionsAnalyticsService.getSalesAmountPerMonth().then(data => {
        const salesChart = d3.select('#vis')
          .append('svg')
          .attr('height', 500)
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
      const fixedData = [];
      for (let i = 0; i < salesData.length; i++) {
        // todo: remove this patch!
        const toAdd = salesData[i];
        console.log(toAdd);
        let added = false;
        for (let q = 0; q < fixedData.length; q++) {
          console.log(toAdd.CalendarMonth, fixedData[q].CalendarMonth);
          if (toAdd.CalendarMonth === fixedData[q].CalendarMonth) {
            fixedData[q].total += toAdd.total;
            console.log('found a match!', fixedData[q], toAdd);
            added = true;
            break;
          }
        }
        if (!added) {
          fixedData.push(toAdd);
        }
      }
      console.log(fixedData);
      for (let i = 0; i < fixedData.length; i++) {
        toReturn.push([fixedData[i].CalendarMonth, fixedData[i].total, 'Sales']);
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
