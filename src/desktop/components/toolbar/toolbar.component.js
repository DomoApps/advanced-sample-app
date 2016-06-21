module.exports = ngModule => {
  require('./toolbar.component.css');

  ngModule.component('toolbar', {
    template: require('./toolbar.component.html'),
    controller: toolbarCtrl,
    bindings: {
      // Inputs should use < and @ bindings.
      toolbarText: '@',
      sidenavId: '@'
      // Outputs should use & bindings.
    },
    transclude: true
  });

  function toolbarCtrl() {
    const ctrl = this;

    ctrl.$onInit = $onInit;

    function $onInit() {
      // Called on each controller after all the controllers have been constructed and had their bindings initialized
      // Use this for initialization code.
    }
  }

  // inject dependencies here
  toolbarCtrl.$inject = [];

  if (ON_TEST) {
    require('./toolbar.component.spec.js')(ngModule);
  }
};
