module.exports = ngModule => {
  require('./pills-container.component.css');

  ngModule.component('pillsContainer', {
    template: require('./pills-container.component.html'),
    controller: pillsContainerCtrl,
    bindings: {
      // Inputs should use < and @ bindings.
      pillData: '<',
      // Outputs should use & bindings.
      onPillClick: '&'
    }
  });

  function pillsContainerCtrl() {
    const ctrl = this;

    ctrl.$onInit = $onInit;
    ctrl.switchPills = switchPills;
    ctrl.activePill = 0;

    function $onInit() {
      // Called on each controller after all the controllers have been constructed and had their bindings initialized
      // Use this for initialization code.
    }

    function switchPills(pill) {
      ctrl.activePill = pill;
      ctrl.onPillClick({ pill });
    }
  }

  // inject dependencies here
  pillsContainerCtrl.$inject = [];

  if (ON_TEST) {
    require('./pills-container.component.spec.js')(ngModule);
  }
};
