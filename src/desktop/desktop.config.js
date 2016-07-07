module.exports = config;

function config($urlRouterProvider, $mdThemingProvider, $mdIconProvider) {
  $urlRouterProvider.otherwise('/');
  const customPrimary =
    {
      '50': '#ffffff', // changed, background color for toolbar
      '500': '#72B0D7',   // changed, color of the label and choices in select
      '600': '#72B0D7',   // changed, color of the selected choice in select
      '700': '#80c25d',   // changed, (not a default!) color of little in-stock indicator
    };
  const customPrimaryPalette = $mdThemingProvider.extendPalette('blue', customPrimary);
  $mdThemingProvider.definePalette('domo-primary', customPrimaryPalette);

  const customAccent =
    {
      'A200': '#72B0D7' // changed, accent color for tabs
    };
  const customAccentPalette = $mdThemingProvider.extendPalette('blue', customAccent);
  $mdThemingProvider.definePalette('domo-accent', customAccentPalette);

  const customWarn =
    {
      '700': '#e4584f' // changed, warn of little in-stock indicator
    };
  const customWarnPalette = $mdThemingProvider.extendPalette('red', customWarn);
  $mdThemingProvider.definePalette('domo-warn', customWarnPalette);

  const customBackground = {
    '50': '#FFF', // changed (background color)
    '200': '#eee', // changed, background color of selected autocomplete items
    'A100': '#fff' // changed, background color of autocomplete
  };
  const customBackgroundPalette = $mdThemingProvider.extendPalette('grey', customBackground);
  $mdThemingProvider.definePalette('domo-background', customBackgroundPalette);

  $mdThemingProvider.theme('default')
    .primaryPalette('domo-primary', {
      'hue-1': '50'
    })
    .accentPalette('domo-accent')
    .warnPalette('domo-warn')
    .backgroundPalette('domo-background', {
      'default': '50'
    });

  $mdIconProvider.defaultFontSet('iconbits');
}

config.$inject = ['$urlRouterProvider', '$mdThemingProvider', '$mdIconProvider'];
