module.exports = ngModule => {
  require('./transaction-tools.component.css');

  ngModule.component('transactionTools', {
    template: require('./transaction-tools.component.html'),
    controller: transactionToolsCtrl,
    bindings: {
      // Inputs should use < and @ bindings.
      dateRangeOptions: '<',
      granularityOptions: '<',
      selectedDateRange: '<',
      selectedGranularity: '<',
      // Outputs should use & bindings.
      onGranularityDropdownSelect: '&',
      onDateRangeDropdownSelect: '&',
    }
  });

  function transactionToolsCtrl() {
    const ctrl = this;

    ctrl.granularityDropdownSelect = granularityDropdownSelect;
    ctrl.dateRangeDropdownSelect = dateRangeDropdownSelect;


    function granularityDropdownSelect() {
      ctrl.onGranularityDropdownSelect({ value: ctrl.selectedGranularity });
    }

    function dateRangeDropdownSelect() {
      ctrl.onDateRangeDropdownSelect({ value: ctrl.selectedDateRange });
    }
  }

  // inject dependencies here
  transactionToolsCtrl.$inject = [];

  if (ON_TEST) {
    require('./transaction-tools.component.spec.js')(ngModule);
  }
};
