module.exports = ngModule => {
  const ranges = [
    {
      name: 'All Time',
      value: 'all'
    },
    {
      name: 'Last Year',
      value: 'year'
    },
    {
      name: 'This Quarter Last Year',
      value: 'quarter'
    }
  ];

  ngModule.value('dateRangeItems', ranges);

  if (ON_TEST) {
    require('./date-range-items.value.spec.js')(ngModule);
  }
};
