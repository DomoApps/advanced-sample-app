module.exports = config;

function config($urlRouterProvider, $mdThemingProvider, $mdIconProvider) {
  $urlRouterProvider.otherwise('/');
  const customPrimary =
    {
      '50': '#ffffff', // white background color for toolbar
      '500': '#72b0d7',   // blue color of the label and choices in select
      '600': '#72b0d7',   // blue color of the selected choice in select
      '700': '#80c25d',   // green color of little in-stock indicator
    };
  const customPrimaryPalette = $mdThemingProvider.extendPalette('blue', customPrimary);
  $mdThemingProvider.definePalette('domo-primary', customPrimaryPalette);

  const customAccent =
    {
      'A200': '#72b0d7' // blue accent color for tabs
    };
  const customAccentPalette = $mdThemingProvider.extendPalette('blue', customAccent);
  $mdThemingProvider.definePalette('domo-accent', customAccentPalette);

  const customWarn =
    {
      '600': '#fbad56', // orange pill
      '700': '#e4584f' // red warn of little in-stock indicator
    };
  const customWarnPalette = $mdThemingProvider.extendPalette('red', customWarn);
  $mdThemingProvider.definePalette('domo-warn', customWarnPalette);

  const customBackground = {
    '50': '#fff', // white (background color)
    '200': '#eee', // gray background color of selected autocomplete items
    'A100': '#fff' // white background color of autocomplete
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
