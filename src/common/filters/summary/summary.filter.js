module.exports = ngModule => {
  /**
   * summary filter will summarize numbers. 5000 => 5K, 10000000 => 10M
   * @param  {bool/undefined} optFractional if set to true, will assume that quantities are not discrete
   *                                        i.e., 'dollars' should set fractional to true, while
   *                                        'products' should not
   * @param  {number/undefined} optPrecision  floating point precision of returned number
   * @return {string}
   */
  function summary() {
    const units = ['K', 'M', 'B', 'T'];
    return (input, optFractional, optPrecision) => {
      const fractional = (typeof optFractional !== 'undefined' ? optFractional : false);
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
      if (fractional) {
        return input.toFixed(precision);
      }
      return input;
    };
  }

  // inject dependencies here
  summary.$inject = [];

  ngModule.filter('summary', summary);

  if (ON_TEST) {
    require('./summary.filter.spec.js')(ngModule);
  }
};
