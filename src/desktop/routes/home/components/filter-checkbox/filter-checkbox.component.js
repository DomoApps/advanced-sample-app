module.exports = ngModule => {
  require('./filter-checkbox.component.css');

  ngModule.component('filterCheckbox', {
    template: require('./filter-checkbox.component.html'),
    controller: filterCheckboxCtrl,
    bindings: {
      // Inputs should use < and @ bindings.
      // Outputs should use & bindings.
      onUpdate: '&'
    }
  });

  function filterCheckboxCtrl() {
    const ctrl = this;

    ctrl.$onInit = $onInit;
    ctrl.hideOutOfStock = false;
    ctrl.onCheckboxClick = onCheckboxClick;

    function $onInit() {
      // Called on each controller after all the controllers have been constructed and had their bindings initialized
      // Use this for initialization code.
    }

    function onCheckboxClick() {
      // push the update to our parent
      ctrl.onUpdate({ hideOutOfStock: ctrl.hideOutOfStock });
    }
  }

  // inject dependencies here
  filterCheckboxCtrl.$inject = [];

  if (ON_TEST) {
    require('./filter-checkbox.component.spec.js')(ngModule);
  }
};
