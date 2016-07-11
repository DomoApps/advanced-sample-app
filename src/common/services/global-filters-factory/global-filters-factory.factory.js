module.exports = ngModule => {
  /**
   * a simple wrapper for da-events to facilitate global filter changes
   */
  function globalFiltersFactory(daEvents, SAMPLE_APP) {
    // Private variables
    let _filter = SAMPLE_APP.DEFAULT_CATEGORY;

    // Public API here
    const service = {
      setFilter,
      getFilter,
      onFilterChange
    };

    return service;

    //// Functions ////
    function setFilter(newFilter) {
      if ((typeof newFilter === 'string') && (newFilter !== _filter)) {
        _filter = newFilter;
        daEvents.trigger(SAMPLE_APP.E_CAT_FILTER_CHANGE, newFilter);
        return newFilter;
      }
    }

    function getFilter() {
      return _filter;
    }

    function onFilterChange(callback) {
      daEvents.on(SAMPLE_APP.E_CAT_FILTER_CHANGE, callback);
    }
  }

  // inject dependencies here
  globalFiltersFactory.$inject = ['daEvents', 'SAMPLE_APP'];

  ngModule.factory('globalFiltersFactory', globalFiltersFactory);

  if (ON_TEST) {
    require('./global-filters-factory.factory.spec.js')(ngModule);
  }
};
