module.exports = ngModule => {
  require('./search-bar.component.css');

  ngModule.component('searchBar', {
    template: require('./search-bar.component.html'),
    controller: searchBarCtrl,
    bindings: {
      // Inputs should use < and @ bindings.
      items: '<',
      filterFunction: '<',
      // Outputs should use & bindings.
      onSearchTextUpdate: '&'
    }
  });

  function searchBarCtrl() {
    const ctrl = this;

    ctrl.$onInit = $onInit;
    ctrl.searchText = '';
    ctrl.onSelectedItemChange = onSelectedItemChange;
    ctrl.onSearchTextChange = onSearchTextChange;

    function $onInit() {
      // Called on each controller after all the controllers have been constructed and had their bindings initialized
      // Use this for initialization code.
    }

    function onSelectedItemChange() {
      // checking to make sure user hasn't cleared search bar
      if (typeof ctrl.selectedItem !== 'undefined') {
        ctrl.onSearchTextUpdate({ searchText: ctrl.searchText });
      }
    }

    function onSearchTextChange() {
      ctrl.onSearchTextUpdate({ searchText: ctrl.searchText });
    }
  }

  // inject dependencies here
  searchBarCtrl.$inject = [];

  if (ON_TEST) {
    require('./search-bar.component.spec.js')(ngModule);
  }
};
