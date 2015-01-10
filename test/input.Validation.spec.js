/* global browserTrigger */
'use strict';

describe('Directive modelSchema', function() {

  var schema, formElm, inputElm, scope, $compile, $sniffer, $browser, changeInputValueTo, currentSpec, compileInput;
  var VALIDITY_STATE_PROPERTY = 'validity';

  beforeEach(module('ng-schema'));

  beforeEach(function() {
    var orderSchema =  {
      _id: Number,
      customer: { type: String, maxLength: 10, minlength: 3},
      date: { type: Date, default: (new Date()).toISOString(), required: true},
      level: { type: Number, max: 30, default: 200},
      delivered: {type: Boolean},
      integer: {
        type: Number,
        formatter: function(value) { return parseInt(value, 10);},
        parser: function(value) {return value + 0.36;}
      }
    };
    module(function ($provide) {
      $provide.value('schema', orderSchema);
    });
  });


  var form;
  beforeEach(inject(function($rootScope, $compile, $sniffer) {
    /*compileInput = function(inputHtml) {
      console.log(inputHtml);
    };*/
    form = angular.element(
      '<form name="form" model-schema="schema" form-data-prefix="order">'+
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
    //};

    compileInput = function(inputHtml) {
      console.log(inputHtml);
      inputElm = angular.element(inputHtml);
      scope = $rootScope;
      formElm = angular.element('<form name="form" model-schema="schema"></form>');
      formElm.append(inputElm);
      $compile(formElm)(scope);
      scope.$digest();
    };


    changeInputValueTo = function(elem, value) {
      elem.value = value;
      browserTrigger(angular.element(elem), $sniffer.hasEvent('input') ? 'input' : 'change');
      browserTrigger(angular.element(elem), 'blur');
    };
  }));

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


  beforeEach(inject(function( _$sniffer_) {

  }));

  afterEach(function() {
    //dealoc(formElm);
  });

  describe('input type number', function() {


    //compileInputx('<input ng-model="field" name="field"/>');

  });


});

/*describe('input', function() {
  var schema, formElm, inputElm, scope, $compile, $sniffer, $browser, changeInputValueTo, currentSpec;

  function compileInput(inputHtml) {
    inputElm = angular.element(inputHtml);
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

  beforeEach(inject(function($injector, _$sniffer_, _$browser_, $provide) {
    $sniffer = _$sniffer_;
    $browser = _$browser_;
    $compile = $injector.get('$compile');
    scope = $injector.get('$rootScope');
    $provide.factory('schema', function(arg){ return {schema: arg};});

    changeInputValueTo = function(value) {
      inputElm.val(value);
      browserTrigger(inputElm, $sniffer.hasEvent('input') ? 'input' : 'change');
    };
  }));

  afterEach(function() {
    //aloc(formElm);
  });


  it('should bind to a model', function() {
//    module(function ($provide) { $provide.value('schema', {
//      Schema:  { field: Number}
//    });});
    compileInput('<input type="text" ng-model="name" name="alias" ng-change="change()" />');

    scope.$apply('name = "misko"');

    expect(inputElm.val()).toBe('misko');
  });
});*/
