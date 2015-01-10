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
        '<input id="_id" name="_id" ng-model="order._id" required max="{{minVal}}" ng-pattern="/5/"><br>'+
        '<input id="customer" ng-model="order.customer" ngoose-label="class-test" maxLength="20"><br>'+
        '<input id="date" ng-model="order.date"><br>'+
        '<input ng-model="order.level"><br>'+
        '<textarea ng-model="order.comment"></textarea><br>'+
        '<select ng-model="order.type">'+
          '<option>Normal</option>'+
          '<option>Special</option>'+
        '</select><br>'+
        '<input type="checkbox" ng-model="order.delivered"><br>'+
        '<input id="integer" ng-model="order.integer"><br>'+
      '</form>'

    );
    scope = $rootScope;
    scope.order = {};
    $compile(form)(scope);
    scope.$digest();
  }));

  //////////////////////////////


 /* function compileInput(inputHtml, mockValidity) {
    inputElm = angular.element(inputHtml);
    if (angular.isObject(mockValidity)) {
      VALIDITY_STATE_PROPERTY = 'ngMockValidity';
      inputElm.prop(VALIDITY_STATE_PROPERTY, mockValidity);
      currentSpec.after(function() {
        VALIDITY_STATE_PROPERTY = 'validity';
      });
    }
    formElm = angular.element('<form name="form"></form>');
    formElm.append(inputElm);
    $compile(formElm)(scope);
    scope.$digest();
  }

  var attrs;
  beforeEach(function() { currentSpec = this; });
  afterEach(function() { currentSpec = null; });
  beforeEach(module(function($compileProvider) {
    $compileProvider.directive('attrCapture', function() {
      return function(scope, element, $attrs) {
        attrs = $attrs;
      };
    });
  }));
*/

  beforeEach(inject(function($injector, _$sniffer_, _$browser_) {
    $sniffer = _$sniffer_;
    $browser = _$browser_;
    $compile = $injector.get('$compile');
    scope = $injector.get('$rootScope');

    changeInputValueTo = function(elem, value) {
      elem.value = value;
      browserTrigger(angular.element(elem), $sniffer.hasEvent('input') ? 'input' : 'change');
      browserTrigger(angular.element(elem), 'blur');
    };
  }));

  afterEach(function() {
    //dealoc(formElm);
  });

  ////////////////////////////

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
      //expect(xx).toBeValid();
      changeInputValueTo(xx, 'abcdef');
      expect(ngModel.$viewValue).toEqual('abcdef');
      expect(ngModel.$modelValue).toBe('abcdef');
      expect(scope.form.xx.$valid).toBe(false);
      //expect(scope.form.xx.$error).toEqual({});
      //expect(xx).toBeInvalid();
      //expect(ngModel.$validators.maxlength).toBeDefined();
      //console.log('asdad',ngModel.$validators, JSON.stringify(xx.ngMaxLength));


    });


    it('in _id input', function () {

      var _id = form[0].querySelector('#_id');
      expect(form[0]).toBeDefined();
      expect(_id.hasAttribute('id')).toBe(true);
      expect(_id.getAttribute('id')).toBe('_id');
      expect(_id.value).toEqual('');
      expect(_id.hasAttribute('type')).toBe(true);
      expect(_id.getAttribute('type')).toBe('number');
      expect(_id.hasAttribute('required')).toBe(true);
      expect(_id.hasAttribute('max')).toBe(true);
      //expect(_id.getAttribute('min')).toBe('9');


      // For a full list of event types: https://developer.mozilla.org/en-US/docs/Web/API/document.createEvent
      //var event = document.createEvent('HTMLEvents');
      //event.initEvent('blur', true, false);
      //el.dispatchEvent(event);


      var ngModel = angular.element(_id).controller('ngModel');
      scope.minVal = 9;
      //expect(ngModel.$viewValue).toBe(undefined);
      //changeInputValueTo(_id, 15);
      //browserTrigger(angular.element(_id), 'blur');

      //expect(ngModel.$viewValue).toEqual('15');
      /*expect(ngModel.$modelValue).toBe('a');
      expect(_id.value).toBe('a');*/
      //ngModel.$validate();
      //expect(scope.form._id.$valid).toBe(true);
      //expect(scope.form._id.$error).toEqual({});
      //expect(scope.form._id.$error.max).toBeTruthy();
      //expect(angular.element(_id)).toBeValid();
      //console.log(scope.form._id.$error);
      /*console.log(scope.form._id.$viewValue);
      console.log(scope.form._id.$modelValue);*/

    });

    it('in customer input', function () {
      var customer = form[0].querySelector('#customer');
      expect(customer.hasAttribute('type')).toBe(true);
      expect(customer.getAttribute('type')).toBe('text');
      expect(customer.hasAttribute('maxLength')).toBe(true);
      expect(customer.getAttribute('maxLength')).toBe('20');  //Don't overwrite the form's attribute
      expect(customer.hasAttribute('minLength')).toBe(true);
      expect(customer.getAttribute('minLength')).toBe('3');

      /*
         element = $compile(template)(scope);
        spyOn(controllerMock, 'search').andCallThrough();
        var ths = element.find('th');

        var input = angular.element(ths[0].children[0]);
        input[0].value = 'blah';
        input.triggerHandler('input');
        expect(controllerMock.search).not.toHaveBeenCalled();
        $timeout.flush();
        expect(controllerMock.search).toHaveBeenCalledWith('blah', 'name');


        scope.searchPredicate = 'lastname';
        scope.$apply();
        expect(controllerMock.search).toHaveBeenCalledWith('blah', 'lastname');
        */

    });

    it('in formattter and parser', function() {
      var integer = form[0].querySelector('#integer');
      expect(integer).toBeDefined();
      var ngModel = angular.element(integer).controller('ngModel');
      scope.order.integer = 5.46;
      scope.$digest();
      expect(ngModel.$viewValue).toEqual('5');


    });
  });
});
