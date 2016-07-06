module.exports = ngModule => {
  require('./loading-mask.component.css');

  ngModule.component('loadingMask', {
    template: require('./loading-mask.component.html'),
    controller: loadingMaskCtrl,
    bindings: {
      // Inputs should use < and @ bindings.
      loading: '<'
      // Outputs should use & bindings.
    }
  });

  function loadingMaskCtrl($element) {
    const ctrl = this;

    ctrl.$onInit = $onInit;
    ctrl.$onChanges = $onChanges;
    ctrl.cubes = Array(9);

    function $onInit() {
      if (ctrl.loading) {
        $element.addClass('visible');
      }
    }

    function $onChanges(changes) {
      if (typeof changes.loading !== 'undefined') {
        if (changes.loading.currentValue) {
          $element.addClass('visible');
        } else {
          $element.removeClass('visible');
        }
      }
    }
  }

  // inject dependencies here
  loadingMaskCtrl.$inject = ['$element'];

  if (ON_TEST) {
    require('./loading-mask.component.spec.js')(ngModule);
  }
};
