module.exports = ngModule => {
  require('./home.component.css');

  ngModule.component('home', {
    template: require('./home.component.html'),
    controller: homeCtrl,
    bindings: {
      // Inputs should use < and @ bindings.
      // Outputs should use & bindings.
    }
  });

  function homeCtrl() {
    const ctrl = this;

    ctrl.$onInit = $onInit;

    function $onInit() {
      // Called on each controller after all the controllers have been constructed and had their bindings initialized
      // Use this for initialization code.
    }
  }

  // inject dependencies here
  homeCtrl.$inject = [];

  if (ON_TEST) {
    require('./home.component.spec.js')(ngModule);
  }
};
