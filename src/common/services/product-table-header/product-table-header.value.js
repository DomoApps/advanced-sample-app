module.exports = ngModule => {
  const headerInfo = [
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

  ngModule.value('productTableHeader', headerInfo);

  if (ON_TEST) {
    require('./product-table-header.factory.spec.js')(ngModule);
  }
};
