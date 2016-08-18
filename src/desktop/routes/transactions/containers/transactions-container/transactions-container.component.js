module.exports = ngModule => {
  require('./transactions-container.component.css');
  require('@domoinc/ca-icon-trends-with-text');

  ngModule.component('transactionsContainer', {
    template: require('./transactions-container.component.html'),
    controller: transactionsContainerCtrl,
  });

  function transactionsContainerCtrl(
    transactionsAnalyticsFactory,
    $q,
    globalFiltersFactory,
    dateRangeItems,
    granularityItems,
    transactionPillDataFactory,
    summaryFilter
  ) {
    const ctrl = this;

    let _categoryFilter = globalFiltersFactory.getFilter();

    ctrl.$onInit = $onInit;

    ctrl.displayLineChart = displayLineChart;
    ctrl.granularityDropdownSelect = granularityDropdownSelect;
    ctrl.dateRangeDropdownSelect = dateRangeDropdownSelect;

    ctrl.loading = true;

    ctrl.pillData = transactionPillDataFactory.getPillData();
    ctrl.activePillData = ctrl.pillData[0];

    ctrl.dateRangeOptions = dateRangeItems;
    ctrl.dateRangeDropdownSelectedOption = ctrl.dateRangeOptions[0];

    ctrl.granularityOptions = granularityItems;
    ctrl.granularityDropdownSelectedOption = ctrl.granularityOptions[0];

    globalFiltersFactory.onFilterChange(_onCategoryChange);

    function $onInit() {
      _refreshData();
    }

    function _onCategoryChange(e, newCategory) {
      _categoryFilter = newCategory;
      _refreshData();
    }

    function _refreshData() {
      ctrl.loading = true;
      const dateRangeFilter = (typeof ctrl.dateRangeDropdownSelectedOption !== 'undefined' ?
          ctrl.dateRangeDropdownSelectedOption.value : undefined);
      const totalsPromise = transactionsAnalyticsFactory.getTotals(_categoryFilter, dateRangeFilter);
      const chartDataPromise = transactionsAnalyticsFactory
        .getTransactionsPerX(_categoryFilter, ctrl.granularityDropdownSelectedOption, dateRangeFilter);
      return $q.all([totalsPromise, chartDataPromise]).then(data => {
        ctrl.pillData[0].chart = _formatDataForLineChart('Income', data[1], 'total');
        ctrl.pillData[1].chart = _formatDataForLineChart('Products Sold', data[1], 'quantity');
        ctrl.pillData[2].chart = _formatDataForLineChart('Transactions', data[1], 'category');

        ctrl.pillData[0].summary = '$' + summaryFilter(data[0].income, true, 1);
        ctrl.pillData[1].summary = summaryFilter(data[0].productsSold, false, 1);
        ctrl.pillData[2].summary = summaryFilter(data[0].transactionCount, false, 1);

        ctrl.loading = false;
      });
    }

    function granularityDropdownSelect(selectedGranularity) {
      if (ctrl.granularityDropdownSelectedOption !== selectedGranularity) {
        ctrl.granularityDropdownSelectedOption = selectedGranularity;
        _refreshData();
      }
    }

    function dateRangeDropdownSelect(selectedDateRange) {
      if (ctrl.dateRangeDropdownSelectedOption !== selectedDateRange) {
        ctrl.dateRangeDropdownSelectedOption = selectedDateRange;
        _refreshData();
      }
    }

    function displayLineChart(chartId) {
      ctrl.activePillData = ctrl.pillData[chartId];
    }


    function _formatDataForLineChart(title, salesData, columnName) {
      return salesData.map(row => {
        return [row.date, row[columnName], title];
      });
    }
  }

  // inject dependencies here
  transactionsContainerCtrl.$inject = ['transactionsAnalyticsFactory', '$q', 'globalFiltersFactory', 'dateRangeItems', 'granularityItems', 'transactionPillDataFactory', 'summaryFilter'];

  if (ON_TEST) {
    require('./transactions-container.component.spec.js')(ngModule);
  }
};
