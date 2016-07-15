module.exports = ngModule => {
  /**
   * filter that will revert to a 'default' text when a value is undefined
   *
   * @param {string} def default text
   * @return {string} either the input value or the `def` param
   */
  function defaultFilter() {
    return (value, def) => {
      return (typeof value === 'undefined' ? def : value);
    };
  }

  // inject dependencies here
  defaultFilter.$inject = [];

  ngModule.filter('default', defaultFilter);

  if (ON_TEST) {
    require('./default.filter.spec.js')(ngModule);
  }
};
