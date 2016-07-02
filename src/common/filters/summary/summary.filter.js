module.exports = ngModule => {
  function summary() {
    const units = ['k', 'M', 'B', 'T'];
    return (input, optPrecision) => {
      const precision = (typeof optPrecision !== 'undefined' ? optPrecision : 0);
      if (typeof input === 'undefined' || isNaN(input)) {
        return input;
      }
      for (let i = units.length - 1; i >= 0; i--) {
        const decimal = Math.pow(1000, i + 1);

        if (input <= -decimal || input >= decimal) {
          return (input / decimal).toFixed(precision) + units[i];
        }
      }
      return input.toFixed(precision);
    };
  }

  // inject dependencies here
  summary.$inject = [];

  ngModule.filter('summary', summary);

  if (ON_TEST) {
    require('./summary.filter.spec.js')(ngModule);
  }
};
