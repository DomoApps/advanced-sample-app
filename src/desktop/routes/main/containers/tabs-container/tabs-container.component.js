module.exports = ngModule => {
  require('./tabs-container.component.css');

  ngModule.component('tabsContainer', {
    template: require('./tabs-container.component.html'),
    controller: tabsContainerCtrl,
    bindings: {
      // Inputs should use < and @ bindings.
      // Outputs should use & bindings.
    }
  });

  function tabsContainerCtrl($state) {
    const ctrl = this;

    ctrl.$onInit = $onInit;
    ctrl.goToPage = goToPage;

    $state.go('products');

    function $onInit() {
      // Called on each controller after all the controllers have been constructed and had their bindings initialized
      // Use this for initialization code.
    }

    function goToPage(page) {
      $state.go(page);
    }
  }

  // inject dependencies here
  tabsContainerCtrl.$inject = ['$state', 'transactionsAnalyticsService'];

  if (ON_TEST) {
    require('./tabs-container.component.spec.js')(ngModule);
  }
};
