module.exports = ngModule => {
  function transactionPillDataFactory($mdColors) {
    const pilldata = [
      {
        text: 'Total Income',
        summary: null,
        chart: null,
        color: $mdColors.getThemeColor('default-domoPrimary-700')
      },
      {
        text: 'Products Sold',
        summary: null,
        chart: null,
        color: $mdColors.getThemeColor('default-domoAccent-A200')
      },
      {
        text: 'Transactions',
        summary: null,
        chart: null,
        color: $mdColors.getThemeColor('default-domoWarn-600')
      }
    ];

    return {
      getPillData,
    };

    function getPillData() {
      return pilldata;
    }
  }

  // inject dependencies here
  transactionPillDataFactory.$inject = ['$mdColors'];

  ngModule.factory('transactionPillDataFactory', transactionPillDataFactory);

  if (ON_TEST) {
    require('./transaction-pill-data-factory.factory.spec.js')(ngModule);
  }
};
