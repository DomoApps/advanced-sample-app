module.exports = ngModule => {
  require('./pill.component.css');
  const d3 = require('d3');
  require('@domoinc/ca-icon-trends-with-text');

  ngModule.component('pill', {
    template: require('./pill.component.html'),
    controller: pillCtrl,
    bindings: {
      // Inputs should use < and @ bindings.
      d3Id: '<',
      chartData: '<',
      pillTitle: '<',
      pillCaption: '<'
      // Outputs should use & bindings.
    }
  });

  function pillCtrl() {
    const ctrl = this;
    let _pill = undefined;
    let _circle = undefined;

    ctrl.$onInit = $onInit;
    ctrl.$onChanges = $onChanges;

    function $onInit() {
      // Called on each controller after all the controllers have been constructed and had their bindings initialized
      // Use this for initialization code.
      _pill = d3.select(ctrl.d3Id + ' svg').insert('g')
        .chart('CAIconTrendsWithText')
        .c({
          width: 317,
          height: 121
        });
      _pill.draw(ctrl.chartData);
      _circle = d3.select(ctrl.d3Id).select(' .iconCircle').node();

      d3.select(_circle.parentNode)
        .insert('g', () => { return _circle; })
        .append(() => { return _circle; });
      ['small', 'large'].forEach(textType => {
        const circleBBox = _circle.getBBox();
        const fontSize = (textType === 'small' ? '12' : '23');
        const xloc = circleBBox.x + (circleBBox.width / 2);
        const yloc = circleBBox.y + ((circleBBox.height / 3) * (textType === 'small' ? 2 : 1));
        d3.select(_circle.parentNode)
          .append('text')
          .attr('class', 'text-' + textType)
          .attr('transform', 'translate(' + xloc + ',' + yloc + ')')
          .attr('text-anchor', 'middle')
          .attr('dy', '.35em')
          .attr('font-size', fontSize);
      });
      _changeText(_circle, ctrl.pillTitle, ctrl.pillCaption);
    }

    function $onChanges(changes) {
      console.log('pill change', changes);
      if (typeof changes.chartData !== 'undefined') {
        _pill.draw(changes.chartData.currentValue);
      }
      if (typeof changes.pillTitle !== 'undefined') {
        _changeText(_circle, changes.pillTitle.currentValue, ctrl.pillCaption);
      }
      if (typeof changes.pillCaption !== 'undefined') {
        _changeText(_circle, ctrl.pillTitle, changes.pillCaption.currentValue);
      }
    }

    function _changeText(circle, pillTitle, pillCaption) {
      d3.select(circle.parentNode).select('.text-large').text(pillTitle);
      d3.select(circle.parentNode).select('.text-small').text(pillCaption);
    }
  }

  // inject dependencies here
  pillCtrl.$inject = [];

  if (ON_TEST) {
    require('./pill.component.spec.js')(ngModule);
  }
};
