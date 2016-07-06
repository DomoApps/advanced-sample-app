module.exports = ngModule => {
  require('./pillbox-container.component.css');

  ngModule.component('pillboxContainer', {
    template: require('./pillbox-container.component.html'),
    controller: pillboxContainerCtrl,
    bindings: {
      // Inputs should use < and @ bindings.
      pillData: '<',
      // Outputs should use & bindings.
      onPillClick: '&'
    }
  });

  function pillboxContainerCtrl() {
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
  pillboxContainerCtrl.$inject = [];

  if (ON_TEST) {
    require('./pillbox-container.component.spec.js')(ngModule);
  }
};
