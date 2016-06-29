module.exports = ngModule => {
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
