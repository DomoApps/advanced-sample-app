module.exports = ngModule => {
  require('./transactions-container.component.css');

  ngModule.component('transactionsContainer', {
    template: require('./transactions-container.component.html'),
    controller: transactionsContainerCtrl,
    bindings: {
      // Inputs should use < and @ bindings.
      // Outputs should use & bindings.
    }
  });

  function transactionsContainerCtrl(transactionsAnalyticsService) {
    const ctrl = this;

    ctrl.$onInit = $onInit;
    ctrl.loading = true;
    ctrl.transactionCount = undefined;
    ctrl.productsSold = undefined;
    ctrl.income = undefined;

    function $onInit() {
      // Called on each controller after all the controllers have been constructed and had their bindings initialized
      // Use this for initialization code.
      transactionsAnalyticsService.getTotals().then(totals => {
        ctrl.loading = false;
        ctrl.transactionCount = totals.transactionCount;
        ctrl.productsSold = totals.productsSold;
        ctrl.income = totals.income;
      });
      transactionsAnalyticsService.getTopSellingItem();
      //transactionsAnalyticsService.getTopGrossingItem();
    }
  }

  // inject dependencies here
  transactionsContainerCtrl.$inject = ['transactionsAnalyticsService'];

  if (ON_TEST) {
    require('./transactions-container.component.spec.js')(ngModule);
  }
};
