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
      $q.all([transactionsAnalyticsService.getTotals(),
        transactionsAnalyticsService.getTopSellingItem()]).then(data => {
          ctrl.loading = false;
          ctrl.transactionCount = data[0].transactionCount;
          ctrl.productsSold = data[0].productsSold;
          ctrl.income = data[0].income;
        }, error => {
          console.log(error);
        });
      //transactionsAnalyticsService.getTopGrossingItem();
    }
  }

  // inject dependencies here
  transactionsContainerCtrl.$inject = ['transactionsAnalyticsService', '$q'];

  if (ON_TEST) {
    require('./transactions-container.component.spec.js')(ngModule);
  }
};
