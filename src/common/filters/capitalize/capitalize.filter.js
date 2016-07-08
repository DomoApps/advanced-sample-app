module.exports = ngModule => {
  function capitalize() {
    return (value) => {
      if (typeof value !== 'string') {
        return value;
      }
      return value.replace(/\w\S*/g, text => {
        return text.charAt(0).toUpperCase() + text.substr(1).toLowerCase();
      });
    };
  }

  // inject dependencies here
  capitalize.$inject = [];

  ngModule.filter('capitalize', capitalize);

  if (ON_TEST) {
    require('./capitalize.filter.spec.js')(ngModule);
  }
};
