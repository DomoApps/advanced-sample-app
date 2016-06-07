module.exports = ngModule => {
  // todo: ask andrew if there are better ways
  // todo: split into components
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

  function transactionsContainerCtrl(transactionsAnalyticsService, $q, daEvents, daFilters) {
    const ctrl = this;

    const _listeners = [];
    let _categoryFilter = undefined;

    ctrl.$onInit = $onInit;
    ctrl.$onDestroy = $onDestroy;
    ctrl.onPillClick = onPillClick;
    ctrl.loading = true;
    ctrl.transactionCountLineChartData = undefined;
    ctrl.productsSoldLineChartData = undefined;
    ctrl.incomeLineChartData = undefined;
    ctrl.totalincome = undefined;
    ctrl.productsSold = undefined;
    ctrl.transactionCount = undefined;
    ctrl.salesChart = undefined;
    ctrl.widgetData = undefined;
    ctrl.activePill = 'totalIncomePill';
    ctrl.pills = [];

    // const summary = new SummaryNumber();

    function $onInit() {
      // Called on each controller after all the controllers have been constructed and had their bindings initialized
      // Use this for initialization code.
      refreshData(_categoryFilter).then(() => {
        ctrl.loading = false;
        // draw sales chart

        ctrl.salesChart = createSalesChart(d3.select('#vis'));
        ctrl.salesChart.draw(ctrl.incomeLineChartData);

        const summaryNumber = new SummaryNumber();
        ctrl.pills[0] = createPill(d3.select('#totalIncomePill'));
        ctrl.pills[1] = createPill(d3.select('#productsSoldPill'));
        ctrl.pills[2] = createPill(d3.select('#transactionPill'));
        drawPill(ctrl.pills[0], ctrl.incomeLineChartData, '$' + summaryNumber.summaryNumber(ctrl.totalIncome), 'Total Income');
        drawPill(ctrl.pills[1], ctrl.productsSoldLineChartData, summaryNumber.summaryNumber(ctrl.productsSold), 'Products Sold');
        drawPill(ctrl.pills[2], ctrl.transactionCountLineChartData, summaryNumber.summaryNumber(ctrl.transactionCount), 'Transactions');
      }, error => {
        console.log('error retrieving db results!');
        console.log(error);
      });

      _listeners.push(daEvents.on('daFilters:update', () => {
        ctrl.loading = true;
        daFilters.getSelectedOptions().then(options => {
          // check to make sure it's not the 'all' category
          // todo: set this as an application constant?
          console.log('filters! triggered: ', options[0].selections[0]);
          _categoryFilter = (options[0].selections[0] === 'All' ? undefined : [options[0].selections[0]]);
            // redraw all the charts
          refreshData(_categoryFilter).then(() => {
            const summaryNumber = new SummaryNumber();
            ctrl.loading = false;
            onPillClick(ctrl.activePill);
            drawPill(ctrl.pills[0], ctrl.incomeLineChartData, '$' + summaryNumber.summaryNumber(ctrl.totalIncome), 'Total Income');
            drawPill(ctrl.pills[1], ctrl.productsSoldLineChartData, summaryNumber.summaryNumber(ctrl.productsSold), 'Products Sold');
            drawPill(ctrl.pills[2], ctrl.transactionCountLineChartData, summaryNumber.summaryNumber(ctrl.transactionCount), 'Transactions');
          }, error => {
            console.error(error);
          });
        });
      }));
    }

    function $onDestroy() {
      _listeners.forEach(deregister => {
        deregister();
      });
    }

    function refreshData(filter) {
      console.log('filters! refreshing data: ', filter);
      return $q.all([transactionsAnalyticsService.getTotals(filter),
        transactionsAnalyticsService.getGrossProfitPerMonth(filter),
        transactionsAnalyticsService.getItemsSoldPerMonth(filter),
        transactionsAnalyticsService.getTransactionCountPerMonth(filter)]).then(data => {
          ctrl.productsSoldLineChartData = formatDataForLineChart('Products Sold', data[2], 'quantity');
          ctrl.incomeLineChartData = formatDataForLineChart('Income', data[1], 'total');
          ctrl.transactionCountLineChartData = formatDataForLineChart('Transactions', data[3], 'quantity');
          ctrl.totalIncome = data[0].income;
          ctrl.productsSold = data[0].productsSold;
          ctrl.transactionCount = data[0].transactionCount;
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
        ctrl.activePill = pill;
      } else {
        console.log('Missing one of the chart redraw functions!');
      }
    }

    function createSalesChart(d3Object) {
      return d3Object.insert('svg')
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
    }

    function formatDataForLineChart(title, salesData, columnName) {
      return salesData.map(row => {
        console.log('row', row);
        console.log('title', title);
        console.log('columnName', columnName);
        return [row.CalendarMonth, row[columnName], title];
      });
    }

    function drawPill(pill, chartData, text, caption) {
      pill.chart.draw(chartData);
      pill.d3Object.select('.text-large').text(text);
      pill.d3Object.select('.text-small').text(caption);
    }

    function createPill(d3Object) {
      const pill = d3Object.insert('g')
        .chart('CAIconTrendsWithText')
        .c({
          width: 317,
          height: 121
        });
      // todo: switch
      pill.draw();
      const circle = d3Object.select(' .iconCircle').node();
      addPillText(circle, 'large');
      addPillText(circle, 'small');
      return { chart: pill, d3Object };
    }

    function addPillText(circle, textType) {
      d3.select(circle.parentNode)
        .insert('g', () => { return circle; })
        .append(() => { return circle; });
      const circleBBox = circle.getBBox();
      const fontSize = (textType === 'small' ? '12' : '23');
      const xloc = circleBBox.x + (circleBBox.width / 2);
      const yloc = circleBBox.y + ((circleBBox.height / 3) * (textType === 'small' ? 2 : 1));
      d3.select(circle.parentNode)
        .append('text')
        .attr('class', 'text-' + textType)
        .attr('transform', 'translate(' + xloc + ',' + yloc + ')')
        .attr('text-anchor', 'middle')
        .attr('dy', '.35em')
        .attr('font-size', fontSize);
    }
  }

  // inject dependencies here
  transactionsContainerCtrl.$inject = ['transactionsAnalyticsService', '$q', 'daEvents', 'daFilters'];

  if (ON_TEST) {
    require('./transactions-container.component.spec.js')(ngModule);
  }
};
