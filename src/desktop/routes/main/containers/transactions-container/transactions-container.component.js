module.exports = ngModule => {
  // todo: ask andrew if there are better ways
  require('./transactions-container.component.css');
  const d3 = require('d3');
  //const SummaryNumber = require('@domoinc/summary-number');
  require('@domoinc/multi-line-chart');
  require('@domoinc/ca-stats-center-icon');
  require('@domoinc/ca-icon-trends-with-text');
  require('@domoinc/ca-stats-circle');
  require('@domoinc/single-line-text');
  const SummaryNumber = require('@domoinc/summary-number');

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
    ctrl.onPillClick = onPillClick;
    ctrl.loading = true;
    ctrl.transactionCountLineChartData = undefined;
    ctrl.productsSoldLineChartData = undefined;
    ctrl.incomeLineChartData = undefined;
    ctrl.salesChart = undefined;
    ctrl.widgetData = undefined;

    // const summary = new SummaryNumber();

    function $onInit() {
      // Called on each controller after all the controllers have been constructed and had their bindings initialized
      // Use this for initialization code.
      $q.all([transactionsAnalyticsService.getTotals(),
        transactionsAnalyticsService.getGrossProfitPerMonth(),
        transactionsAnalyticsService.getItemsSoldPerMonth(),
        transactionsAnalyticsService.getTransactionCountPerMonth()]).then(data => {
          ctrl.loading = false;
          // draw sales chart
          ctrl.salesChart = d3.select('#vis')
            .insert('svg')
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
            });
          ctrl.productsSoldLineChartData = formatDataForLineChart('Products Sold', data[2], 'quantity');
          ctrl.incomeLineChartData = formatDataForLineChart('Income', data[1], 'total');
          ctrl.transactionCountLineChartData = formatDataForLineChart('Transactions', data[3], 'quantity');
          ctrl.salesChart.draw(ctrl.incomeLineChartData);

          const summaryNumber = new SummaryNumber();
          drawPill('$' + summaryNumber.summaryNumber(data[0].income),
            ctrl.incomeLineChartData, 'Total Income', '#totalIncomePill');
          drawPill(summaryNumber.summaryNumber(data[0].productsSold),
            ctrl.productsSoldLineChartData, 'Products Sold', '#productsSoldPill');
          drawPill(summaryNumber.summaryNumber(data[0].transactionCount),
            ctrl.transactionCountLineChartData, 'Transactions', '#transactionPill');
        }, error => {
          console.log('error retrieving db results!');
          console.log(error);
        });
    }

    function onPillClick(pill) {
      // don't really want to use a switch statement
      const chartRedraws = {
        totalIncomePill: () => {
          ctrl.salesChart.draw(ctrl.incomeLineChartData);
        },
        productsSoldPill: () => {
          ctrl.salesChart.draw(ctrl.productsSoldLineChartData);
        },
        transactionPill: () => {
          ctrl.salesChart.draw(ctrl.transactionCountLineChartData);
        }
      };
      if (typeof chartRedraws[pill] !== 'undefined') {
        chartRedraws[pill]();
      } else {
        console.log('Missing one of the chart redraw functions!');
      }
    }

    function formatDataForLineChart(title, salesData, columnName) {
      return salesData.map(row => {
        console.log('row', row);
        console.log('title', title);
        console.log('columnName', columnName);
        return [row.CalendarMonth, row[columnName], title];
      });
    }

    function drawPill(displayTotal, lineChartData, label, id) {
      const pill = d3.select(id)
        .insert('g')
        .chart('CAIconTrendsWithText')
        .c({
          width: 317,
          height: 121
        });
      // todo: switch
      pill.draw(lineChartData);

      const circle = d3.select(id + ' .iconCircle').node();
      // create a parent g
      d3.select(circle.parentNode)
        .insert('g', () => { return circle; })
        .append(() => { return circle; });
      const circleBBox = circle.getBBox();
      d3.select(circle.parentNode)
        .append('text')
        .attr('transform', 'translate(' + (circleBBox.x + (circleBBox.width / 2))
          + ',' + (circleBBox.y + (circleBBox.height / 3)) + ')')
        .attr('text-anchor', 'middle')
        .attr('dy', '.35em')
        .attr('font-size', '23')
        .text(displayTotal);
      d3.select(circle.parentNode)
        .append('text')
        .attr('transform', 'translate(' + (circleBBox.x + (circleBBox.width / 2))
          + ',' + (circleBBox.y + ((circleBBox.height / 3) * 2)) + ')')
        .attr('text-anchor', 'middle')
        .attr('dy', '.35em')
        .attr('font-size', '12')
        .text(label);
    }
  }

  // inject dependencies here
  transactionsContainerCtrl.$inject = ['transactionsAnalyticsService', '$q'];

  if (ON_TEST) {
    require('./transactions-container.component.spec.js')(ngModule);
  }
};
