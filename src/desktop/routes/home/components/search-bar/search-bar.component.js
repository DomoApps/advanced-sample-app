module.exports = ngModule => {
  require('./search-bar.component.css');

  ngModule.component('searchBar', {
    template: require('./search-bar.component.html'),
    controller: searchBarCtrl,
    bindings: {
      // Inputs should use < and @ bindings.
      // Outputs should use & bindings.
      onTextChange: '&'
    }
  });

  function searchBarCtrl() {
    const ctrl = this;

    ctrl.$onInit = $onInit;
    ctrl.searchText = '';
    ctrl.onInput = onInput;

    function $onInit() {
      // Called on each controller after all the controllers have been constructed and had their bindings initialized
      // Use this for initialization code.
    }

    function onInput() {
      // propagate text to parent
      ctrl.onTextChange({ newSearchText: ctrl.searchText });
    }
  }

  // inject dependencies here
  searchBarCtrl.$inject = [];

  if (ON_TEST) {
    require('./search-bar.component.spec.js')(ngModule);
  }
};
