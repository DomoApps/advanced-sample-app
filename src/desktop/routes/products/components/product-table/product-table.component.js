module.exports = ngModule => {
  require('./product-table.component.css');

  ngModule.component('productTable', {
    template: require('./product-table.component.html'),
    controller: productTableCtrl,
    bindings: {
      // Inputs should use < and @ bindings.
      products: '<'
      // Outputs should use & bindings.
    }
  });

  function productTableCtrl() {
    const ctrl = this;

    ctrl.$onInit = $onInit;
    ctrl.orderBy = orderBy;
    ctrl.orderByProperty = 'inStock';
    ctrl.reverseOrder = false;

    ctrl.headings = [
      [
        {
          width: 25,
          title: 'In Stock',
          key: 'inStock'
        },
        {
          width: 75,
          title: 'Name',
          key: 'name'
        }
      ],
      [
        {
          width: 33,
          title: 'Price',
          key: 'price'
        },
        {
          width: 33,
          title: 'Category',
          key: 'category'
        },
        {
          width: 33,
          title: 'Quantity',
          key: 'quantity'
        }
      ]
    ];

    function $onInit() {
      // Called on each controller after all the controllers have been constructed and had their bindings initialized
      // Use this for initialization code.
    }

    function orderBy(property) {
      ctrl.reverseOrder = (ctrl.orderByProperty === property) ? !ctrl.reverseOrder : false;
      ctrl.orderByProperty = property;
    }
  }

  // inject dependencies here
  productTableCtrl.$inject = [];

  if (ON_TEST) {
    require('./product-table.component.spec.js')(ngModule);
  }
};
