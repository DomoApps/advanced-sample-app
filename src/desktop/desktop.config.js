module.exports = config;

function config($urlRouterProvider, $mdThemingProvider, $mdIconProvider) {
  $urlRouterProvider.otherwise('/');
  const customPrimary = {
    '50': '#ffffff', // changed, background color for toolbar
    '100': '#ffffff',
    '200': '#111',
    '300': '#222',
    '400': '#333',
    '500': '#72B0D7',   // changed, color of the label and choices in select
    '600': '#72B0D7',   // changed, color of the selected choice in select
    '700': '#80c25d',   // changed, (not a default!) color of little in-stock indicator
    '800': '#fff',
    '900': '#950008',
    'A100': '#ff959a',
    'A200': '#ffaeb3',
    'A400': '#ffc8cb',
    'A700': '#7b0006'
  };
  $mdThemingProvider
      .definePalette('customPrimary',
                      customPrimary);

  const customAccent = {
    '50': '#000a08',
    '100': '#00231d',
    '200': '#003d31',
    '300': '#005646',
    '400': '#00705a',
    '500': '#00896f',
    '600': '#00bc97',
    '700': '#00d6ac',
    '800': '#00efc0',
    '900': '#0affcf',
    'A100': '#00bc97',
    'A200': '#72B0D7', // changed, accent color for tabs
    'A400': '#00896f',
    'A700': '#23ffd4',
  };
  $mdThemingProvider
      .definePalette('customAccent',
                      customAccent);

  const customWarn = {
    '50': '#ffb280',
    '100': '#ffa266',
    '200': '#ff934d',
    '300': '#ff8333',
    '400': '#ff741a',
    '500': '#ff6400',
    '600': '#e65a00',
    '700': '#e4584f', // changed, warn of little in-stock indicator
    '800': '#b34600',
    '900': '#993c00',
    'A100': '#ffc199',
    'A200': '#ffd1b3',
    'A400': '#ffe0cc',
    'A700': '#803200'
  };
  $mdThemingProvider
      .definePalette('customWarn',
                      customWarn);

  const customBackground = {
    '50': '#FFF', // changed (background color)
    '100': '#666666',
    '200': '#eee', // changed, background color of selected autocomplete items
    '300': '#4d4d4d',
    '400': '#404040',
    '500': '#333',
    '600': '#262626',
    '700': '#1a1a1a',
    '800': '#0d0d0d',
    '900': '#000000',
    'A100': '#fff', // changed, background color of autocomplete
    'A200': '#8c8c8c',
    'A400': '#999999',
    'A700': '#000000'
  };
  $mdThemingProvider
      .definePalette('customBackground',
                      customBackground);

  $mdThemingProvider.theme('default')
    .primaryPalette('customPrimary', {
      'hue-1': '50'
    })
    .accentPalette('customAccent')
    .warnPalette('customWarn')
    .backgroundPalette('customBackground', {
      'default': '50'
    });

  $mdIconProvider.defaultFontSet('iconbits');
}

config.$inject = ['$urlRouterProvider', '$mdThemingProvider', '$mdIconProvider'];
