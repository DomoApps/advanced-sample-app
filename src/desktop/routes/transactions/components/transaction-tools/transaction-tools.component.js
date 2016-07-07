module.exports = ngModule => {
  require('./transaction-tools.component.css');

  ngModule.component('transactionTools', {
    template: require('./transaction-tools.component.html'),
    controller: transactionToolsCtrl,
    bindings: {
      // Inputs should use < and @ bindings.
      // Outputs should use & bindings.
      onGranularityDropdownSelect: '&',
      onDateRangeDropdownSelect: '&',
    }
  });

  function transactionToolsCtrl() {
    const ctrl = this;

    ctrl.$onInit = $onInit;
    ctrl.granularityDropdownSelect = granularityDropdownSelect;
    ctrl.dateRangeDropdownSelect = dateRangeDropdownSelect;

    ctrl.granularityDropdownItems = ['month', 'week', 'quarter'];
    ctrl.granularityDropdownSelectedItem = ctrl.granularityDropdownItems[0];
    ctrl.dateRangeDropdownItems = [
      {
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
      }
    ];
    ctrl.dateRangeDropdownSelectedItem = ctrl.dateRangeDropdownItems[0];

    function $onInit() {
      // Called on each controller after all the controllers have been constructed and had their bindings initialized
      // Use this for initialization code.

      // call these so parent knows which values are the defaults
      // otherwise when the user selects an already selected value in the transaction tools
      // a refresh will occur when one should not
      ctrl.onGranularityDropdownSelect({ value: ctrl.granularityDropdownSelectedItem });
      ctrl.onDateRangeDropdownSelect({ value: ctrl.dateRangeDropdownSelectedItem });
    }

    function granularityDropdownSelect() {
      ctrl.onGranularityDropdownSelect({ value: ctrl.granularityDropdownSelectedItem });
    }

    function dateRangeDropdownSelect() {
      ctrl.onDateRangeDropdownSelect({ value: ctrl.dateRangeDropdownSelectedItem });
    }
  }

  // inject dependencies here
  transactionToolsCtrl.$inject = [];

  if (ON_TEST) {
    require('./transaction-tools.component.spec.js')(ngModule);
  }
};
