/* global browserTrigger */
'use strict';

/*
getNodeTag
getAttrs
processGet
processSet
processDefault
processValidate
processEnum
processRef
*/

var VALIDITY_STATE_PROPERTY = 'validity';

describe('Directive modelSchema', function() {
  var form, scope, orderSchema, $sniffer, $browser, $compile, changeInputValueTo ;

  var formElm, inputElm, /*scope, $compile, $sniffer, $browser, changeInputValueTo,*/ currentSpec;

  beforeEach(module('ng-schema'));

  beforeEach(function() {
    orderSchema =  {
      xx: {type: String, maxlength: 5},
      _id: Number,
      customer: { type: String, maxLength: 10, minlength: 3},
      date: { type: Date, /*default: (new Date()).toISOString(),*/ required: true},
      level: { type: Number, max: 30/*, default: 200*/},
      delivered: {type: Boolean},
      integer: {
        type: Number,
        formatter: function(value) { return parseInt(value, 10);},
        parser: function(value) {return value + 0.36;}
      }
    };
    module(function ($provide) {
      $provide.value('orderSchema', orderSchema);
    });
  });

  beforeEach(inject(function($rootScope, $compile/*, Schema*/, $sniffer) {
    form = angular.element(
      '<form name="form" model-schema="orderSchema" form-data-prefix="order">'+
        '<input id="xx" name="xx" ng-model="order.xx"><br>'+
      '<input id="_id" name="_id" ng-model="order._id" required max="{{order.maxVal}}"  >'+// ng-pattern="/5/"><br>'+
        '<input id="customer" ng-model="order.customer" ngoose-label="class-test" maxLength="20"><br>'+
        '<input id="date" ng-model="order.date"><br>'+
        '<input ng-model="order.level"><br>'+
        '<textarea ng-model="order.comment"></textarea><br>'+
        '<select ng-model="order.type">'+
          '<option>Normal</option>'+
          '<option>Special</option>'+
        '</select><br>'+
        '<input type="checkbox" ng-model="order.delivered"><br>'+
        '<input name="integer" id="integer" ng-model="order.integer"><br>'+
      '</form>'

    );
    scope = $rootScope;
    scope.order = {maxVal: 20};
    $compile(form)(scope);
    scope.$digest();
  }));



  beforeEach(inject(function( _$sniffer_ ) {
    $sniffer = _$sniffer_;
    changeInputValueTo = function(elem, value) {
      elem.value = value.toString();
      browserTrigger(angular.element(elem), $sniffer.hasEvent('input') ? 'input' : 'change');
      browserTrigger(angular.element(elem), 'blur');
    };
  }));



  describe('should compile the INPUT acording with schema', function() {

    it('in xx input', function () {

      var xx = form[0].querySelector('#xx');
      var ngModel = angular.element(xx).controller('ngModel');
      expect(xx.hasAttribute('maxlength')).toBe(true);
      expect(xx.getAttribute('maxlength')).toBe('5');
      //expect(xx.hasAttribute('ng-maxlength')).toBe(true);
      //expect(xx.getAttribute('ng-maxlength')).toBe('5');
      changeInputValueTo(xx, 'abcde');
      expect(ngModel.$viewValue).toEqual('abcde');
      expect(ngModel.$modelValue).toBe('abcde');
      expect(scope.form.xx.$valid).toBe(true);
      expect(scope.form.xx.$error).toEqual({});
      changeInputValueTo(xx, 'abcdef');
      expect(ngModel.$viewValue).toEqual('abcdef');
      expect(ngModel.$modelValue).toBe('abcdef');
      expect(scope.form.xx.$valid).toBe(false);
      expect(scope.form.xx.$error).toEqual({maxlength : true});
      expect(ngModel.$validators.maxlength).toBeDefined();

    });


    it('in _id input', function () {

      var _id = form[0].querySelector('#_id');
      expect(_id).toBeDefined();
      expect(_id.hasAttribute('id')).toBe(true);
      expect(_id.getAttribute('id')).toBe('_id');
      expect(_id.value).toEqual('');
      expect(_id.hasAttribute('type')).toBe(true);
      expect(_id.getAttribute('type')).toBe('number');
      expect(_id.hasAttribute('required')).toBe(true);
      //expect(_id.hasAttribute('max')).toBe(true);
     // expect(_id.getAttribute('max')).toBe('4');


      // For a full list of event types: https://developer.mozilla.org/en-US/docs/Web/API/document.createEvent
      //var event = document.createEvent('HTMLEvents');
      //event.initEvent('blur', true, false);
      //el.dispatchEvent(event);


      var ngModel = angular.element(_id).controller('ngModel');
      //scope.order.maxVal = 9;
      expect(ngModel.$viewValue).toBe(undefined);
      scope.form._id.$setViewValue('15');
      //scope.$digest();
      //changeInputValueTo(_id, 15);
      expect(ngModel.$viewValue).toEqual('15');
      expect(ngModel.$modelValue).toEqual(15);
      expect(scope.order._id).toBe(15);
      //console.log(scope.order._id);
      expect(scope.form._id.$valid).toBe(true);
      expect(scope.form._id.$error).toEqual({});
      //expect(scope.form._id.$error.max).toBeTruthy();

      
      scope.form._id.$setViewValue('6');
      expect(scope.order._id).toEqual(6);
    });

    it('in customer input', function () {
      var customer = form[0].querySelector('#customer');
      expect(customer.hasAttribute('type')).toBe(true);
      expect(customer.getAttribute('type')).toBe('text');
      expect(customer.hasAttribute('maxLength')).toBe(true);
      expect(customer.getAttribute('maxLength')).toBe('20');  //Don't overwrite the form's attribute
      expect(customer.hasAttribute('minLength')).toBe(true);
      expect(customer.getAttribute('minLength')).toBe('3');


    });

    it('in formattter and parser', function() {
      var integer = form[0].querySelector('#integer');
      expect(integer).toBeDefined();
      var ngModel = angular.element(integer).controller('ngModel');
      scope.order.integer = 5.46;
      scope.$digest();
      expect(ngModel.$viewValue).toEqual('5');

      scope.form.integer.$setViewValue('6');
      expect(scope.order.integer).toEqual(6.36);
    });
  });
});
