module.exports = ngModule => {
  require('./date-range-picker.component.css');

  ngModule.component('dateRangePicker', {
    template: require('./date-range-picker.component.html'),
    controller: dateRangePickerCtrl,
    bindings: {
      // Inputs should use < and @ bindings.
      minDate: '<',
      maxDate: '<',
      // Outputs should use & bindings.
      onStartDatepickerChange: '&',
      onEndDatepickerChange: '&'
    }
  });

  function dateRangePickerCtrl() {
    const ctrl = this;

    ctrl.$onInit = $onInit;
    ctrl.$onChanges = $onChanges;
    ctrl.startDatepickerChange = startDatepickerChange;
    ctrl.endDatepickerChange = endDatepickerChange;
    // set default start date to a week ago
    ctrl.startDate = new Date();
    ctrl.startDate.setDate(ctrl.startDate.getDate() - 7);
    ctrl.endDate = new Date();
    ctrl.startDatepickerMaxDate = ctrl.endDate;
    ctrl.endDatepickerMinDate = ctrl.startDate;

    function $onInit() {
      // Called on each controller after all the controllers have been constructed and had their bindings initialized
      // Use this for initialization code.
      // assume the data is proper
      // start date and end date must be equal to bounds, if they are set
      // if not set, no start and end date bounds, keep defaults
      if (typeof ctrl.minDate !== 'undefined') {
        ctrl.startDate = ctrl.minDate;
      }
      if (typeof ctrl.maxDate !== 'undefined') {
        ctrl.endDate = ctrl.maxDate;
      }
      _setNewBounds();
    }

    function $onChanges(changes) {
      // if it's either the min or max dates
      // make sure we're still in bounds
      // if not, set it equal to the new bounds
      if (typeof changes.maxDate !== 'undefined') {
        if (ctrl.endDate > changes.maxDate.currentValue || ctrl.endDate < changes.minDate.currentValue) {
          ctrl.endDate = changes.maxDate.currentValue;
        }
      }
      if (typeof changes.minDate !== 'undefined') {
        if (ctrl.startDate < changes.minDate.currentValue || ctrl.startDate > changes.maxDate.currentValue) {
          ctrl.startDate = changes.minDate.currentValue;
        }
      }
      _setNewBounds();
      // don't propagate changes in selected dates
    }

    function _setNewBounds() {
      // check the current value for the start datepicker, set end datepicker bounds equal to that date
      ctrl.endDatepickerMinDate = ctrl.startDate;
      // check the current value for the end datepicker, sent start datepicker bounds equal to that date
      ctrl.startDatepickerMaxDate = ctrl.endDate;
    }

    function startDatepickerChange() {
      // make sure to set new bounds on the endDatepicker
      _setNewBounds();
      // notify parent component of startdatepicker change
      ctrl.onStartDatepickerChange({ newDate: ctrl.startDate });
    }

    function endDatepickerChange() {
      // make sure to set new bounds on the startdatepicker
      _setNewBounds();
      // notify parent component of enddatepicker change
      ctrl.onEndDatepickerChange({ newDate: ctrl.endDate });
    }
  }

  // inject dependencies here
  dateRangePickerCtrl.$inject = [];

  if (ON_TEST) {
    require('./date-range-picker.component.spec.js')(ngModule);
  }
};
