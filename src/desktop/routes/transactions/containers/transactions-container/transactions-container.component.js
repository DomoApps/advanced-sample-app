module.exports = ngModule => {
  require('./transactions-container.component.css');
  require('@domoinc/ca-icon-trends-with-text');

  ngModule.component('transactionsContainer', {
    template: require('./transactions-container.component.html'),
    controller: transactionsContainerCtrl,
    bindings: {
      // Inputs should use < and @ bindings.
      // Outputs should use & bindings.
    }
  });

  function transactionsContainerCtrl(transactionsAnalyticsFactory,
      $q,
      $mdColors,
      globalFiltersFactory,
      summaryFilter) {
    const ctrl = this;

    let _categoryFilter = globalFiltersFactory.getFilter();

    ctrl.$onInit = $onInit;
    ctrl.displayLineChart = displayLineChart;
    ctrl.granularityDropdownSelect = granularityDropdownSelect;
    ctrl.dateRangeDropdownSelect = dateRangeDropdownSelect;

    ctrl.loading = true;
    ctrl.pillData = [
      {
        text: 'Total Income',
        summary: null,
        chart: null,
        color: $mdColors.getThemeColor('default-domoPrimary-700')
      },
      {
        text: 'Products Sold',
        summary: null,
        chart: null,
        color: $mdColors.getThemeColor('default-domoAccent-A200')
      },
      {
        text: 'Transactions',
        summary: null,
        chart: null,
        color: $mdColors.getThemeColor('default-domoWarn-700')
      }];
    ctrl.activePillData = ctrl.pillData[0];

    ctrl.granularityDropdownSelectedItem = undefined;
    ctrl.dateRangeDropdownSelectedItem = undefined;

    globalFiltersFactory.onFilterChange(_onCategoryChange);

    function $onInit() {
      // Called on each controller after all the controllers have been constructed and had their bindings initialized
      // Use this for initialization code.
    }

    function _onCategoryChange(e, newCategory) {
      _categoryFilter = newCategory;
      _refreshData();
    }

    function _refreshData() {
      ctrl.loading = true;
      const dateRangeFilter = (typeof ctrl.dateRangeDropdownSelectedItem !== 'undefined' ?
          ctrl.dateRangeDropdownSelectedItem.value : undefined);
      return $q.all([transactionsAnalyticsFactory.getTotals(_categoryFilter, dateRangeFilter),
        transactionsAnalyticsFactory.getTransactionsPerX(_categoryFilter, ctrl.granularityDropdownSelectedItem, dateRangeFilter)]).then(data => {
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
      if (ctrl.granularityDropdownSelectedItem !== selectedGranularity) {
        ctrl.granularityDropdownSelectedItem = selectedGranularity;
        _refreshData();
      }
    }

    function dateRangeDropdownSelect(selectedDateRange) {
      if (ctrl.dateRangeDropdownSelectedItem !== selectedDateRange) {
        ctrl.dateRangeDropdownSelectedItem = selectedDateRange;
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
  transactionsContainerCtrl.$inject = ['transactionsAnalyticsFactory', '$q', '$mdColors', 'globalFiltersFactory', 'summaryFilter'];

  if (ON_TEST) {
    require('./transactions-container.component.spec.js')(ngModule);
  }
};
