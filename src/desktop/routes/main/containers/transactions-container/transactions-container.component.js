module.exports = ngModule => {
  // todo: ask andrew if there are better ways
  // todo: split into components
  require('./transactions-container.component.css');
  const d3 = require('d3');
  require('@domoinc/multi-line-chart');
  require('@domoinc/ca-icon-trends-with-text');
  require('@domoinc/ca-stats-circle');
  const SummaryNumber = require('@domoinc/summary-number');

  ngModule.component('transactionsContainer', {
    template: require('./transactions-container.component.html'),
    controller: transactionsContainerCtrl,
    bindings: {
      // Inputs should use < and @ bindings.
      categoryFilter: '<' // a string of the category to filter by
      // Outputs should use & bindings.
    }
  });

  function transactionsContainerCtrl(transactionsAnalyticsService, $q, daEvents, daFilters) {
    const ctrl = this;

    const _listeners = [];
    let _categoryFilter = undefined;
    let _grainFilter = undefined;
    let _dateRangeFilter = undefined;

    // todo: split into private vars
    ctrl.$onInit = $onInit;
    ctrl.$onDestroy = $onDestroy;
    ctrl.onPillClick = onPillClick;
    ctrl.granularityDropdownSelect = granularityDropdownSelect;
    ctrl.dateRangeDropdownSelect = dateRangeDropdownSelect;
    ctrl.onStartDatepickerChange = onStartDatepickerChange;
    ctrl.onEndDatepickerChange = onEndDatepickerChange;
    ctrl.loading = true;
    ctrl.transactionCountLineChartData = undefined;
    ctrl.productsSoldLineChartData = undefined;
    ctrl.incomeLineChartData = undefined;
    ctrl.totalincome = undefined;
    ctrl.productsSold = undefined;
    ctrl.transactionCount = undefined;
    ctrl.salesChart = undefined;
    ctrl.widgetData = undefined;
    ctrl.customStartDate = undefined;
    ctrl.customEndDate = undefined;
    ctrl.earliestTransaction = undefined;
    ctrl.latestTransaction = undefined;
    ctrl.activePill = 'totalIncomePill';
    ctrl.pills = [];
    ctrl.granularityDropdownItems = [
      {
        name: 'Month',
        value: 'month'
      },
      {
        name: 'Week',
        value: 'week'
      },
      {
        name: 'Quarter',
        value: 'quarter'
      }
    ];
    ctrl.granularityDropdownSelectedItem = ctrl.granularityDropdownItems[0];
    ctrl.dateRangeDropdownItems = [
      {
        // todo: set to be null?
        name: 'All Time',
        value: 'all'
      },
      {
        name: 'Last Year',
        value: 'year'
      },
      {
        name: 'This Quarter Last Year',
        value: 'quarter'
      },
      {
        name: 'Custom',
        value: 'custom'
      }
    ];
    ctrl.dateRangeDropdownSelectedItem = ctrl.dateRangeDropdownItems[0];


    function $onInit() {
      // Called on each controller after all the controllers have been constructed and had their bindings initialized
      // Use this for initialization code.
      daFilters.getSelectedOptions().then(options => {
        _categoryFilter = (options[0].selections[0] === 'All' ? undefined : [options[0].selections[0]]);
        _grainFilter = ctrl.granularityDropdownSelectedItem.value;
        _dateRangeFilter = ctrl.dateRangeDropdownSelectedItem.value;
        return refreshData(_categoryFilter, _grainFilter, _dateRangeFilter);
      }).then(() => {
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

      _listeners.push(daEvents.on('daFilters:update', onFilterUpdate));
    }

    function $onDestroy() {
      _listeners.forEach(deregister => {
        deregister();
      });
    }

    function onFilterUpdate() {
      ctrl.loading = true;
      daFilters.getSelectedOptions().then(options => {
        // check to make sure it's not the 'all' category
        // todo: set this as an application constant?
        console.log('filters! triggered: ', options);
        _categoryFilter = (options[0].selections[0] === 'All' ? undefined : [options[0].selections[0]]);
        _grainFilter = ctrl.granularityDropdownSelectedItem.value;
        _dateRangeFilter = ctrl.dateRangeDropdownSelectedItem.value;
        if (_dateRangeFilter === 'custom') {
          console.log('startdate', ctrl.customStartDate);
          _dateRangeFilter = { start: ctrl.customStartDate, end: ctrl.customEndDate };
        }
        // redraw all the charts
        refreshData(_categoryFilter, _grainFilter, _dateRangeFilter).then(() => {
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
    }

    function refreshData(categoryFilter, grainFilter, dateRangeFilter) {
      const formattedRangeFilter = dateRangeFilter === 'all' ? undefined : dateRangeFilter;
      return $q.all([transactionsAnalyticsService.getTotals(categoryFilter, formattedRangeFilter),
        transactionsAnalyticsService.getTransactionsPerX(grainFilter, categoryFilter, formattedRangeFilter),
        transactionsAnalyticsService.getEarliestTransaction(),
        transactionsAnalyticsService.getLatestTransaction()]).then(data => {
          ctrl.productsSoldLineChartData = formatDataForLineChart('Products Sold', data[1], 'quantity');
          ctrl.incomeLineChartData = formatDataForLineChart('Income', data[1], 'total');
          ctrl.transactionCountLineChartData = formatDataForLineChart('Transactions', data[1], 'category');
          ctrl.totalIncome = data[0].income;
          ctrl.productsSold = data[0].productsSold;
          ctrl.transactionCount = data[0].transactionCount;
          ctrl.earliestTransaction = data[2][0].date;
          ctrl.latestTransaction = data[3][0].date;
        });
    }

    function onStartDatepickerChange() {
      if (typeof ctrl.customEndDate !== 'undefined') {
        onFilterUpdate();
      }
    }

    function onEndDatepickerChange() {
      if (typeof ctrl.customStartDate !== 'undefined') {
        onFilterUpdate();
      }
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

    function granularityDropdownSelect(item) {
      ctrl.granularityDropdownSelectedItem = item;
      onFilterUpdate();
    }

    function dateRangeDropdownSelect(item) {
      ctrl.dateRangeDropdownSelectedItem = item;
      // don't run the update if we still need to choose a custom time
      if (item.value !== 'custom') {
        onFilterUpdate();
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
        }).a('X Axis', line => {
          // override default accessor, it doesn't accept "quarter" values (ex "2015 Q1")
          return line[0];
        });
    }

    function formatDataForLineChart(title, salesData, columnName) {
      return salesData.map(row => {
        console.log('row', row);
        console.log('title', title);
        console.log('columnName', columnName);
        return [row.date, row[columnName], title];
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
