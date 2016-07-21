module.exports = ngModule => {
  const granularities = ['month', 'week', 'quarter'];

  ngModule.value('granularityItems', granularities);

  if (ON_TEST) {
    require('./granularity-items.factory.spec.js')(ngModule);
  }
};
