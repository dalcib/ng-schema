/* global browserTrigger */
'use strict';

describe('Process modelSchema', function() {
  var form, scope, testSchema;

  beforeEach(module('ng-schema'));

  beforeEach(function() {
    testSchema =  {
      _string: { type: String, default: 'xyz'},
      _select: { type: String, default: 'Normal'},
      _stringTextArea: { type: String, default: 'tyu'},
      _number: { type: Number, default: 259},
      _boolean: { type: Boolean, default: true},
      _function: {default: function() { return 'abc';}}
    };
    module(function ($provide) {
      $provide.value('testSchema', testSchema);
    });
  });

  beforeEach(inject(function($rootScope, $compile/*, Schema*/) {
    form = angular.element(
      '<form name="teste" model-schema="testSchema" form-data-prefix="base">'+
      '<input id="stringInput" ng-model="base._string"><br>'+
      '<input id="numberInput" ng-model="base._number"><br>'+
      '<input id="booleanInput" ng-model="base._boolean"><br>'+
      '<input id="functionInput" ng-model="base._function"><br>'+
      '<textarea id="stringTextarea" ng-model="base._stringTextArea"></textarea><br>'+
      '<select id="stringSelect" ng-model="base._select">'+
        '<option>Normal</option>'+
        '<option>Special</option>'+
        '</select><br>'+
      '<input id="booleanCheckbox" type="checkbox" ng-model="base._boolean"><br>'+
      '</form>'

    );
    scope = $rootScope;
    scope.base = {};
    $compile(form)(scope);

  }));

  describe('should define default value for', function() {

    it('string', function() {
      var stringInput = form[0].querySelector('#stringInput');
      var ngModel = angular.element(stringInput).controller('ngModel');
      scope.$digest();
      expect(stringInput.value).toEqual('xyz');
      //expect(scope.base._string).toEqual('xyz');
      //console.log('string',stringInput, ngModel.$modelValue, ngModel.$viewValue, scope.base._string);
    });

    it('number', function() {
      var numberInput = form[0].querySelector('#numberInput');
      var ngModel = angular.element(numberInput).controller('ngModel');
      scope.$digest();
      expect(ngModel.$modelValue).toEqual(259);
      expect(ngModel.$viewValue).toEqual('259');
      expect(numberInput.value).toEqual('259');
      expect(numberInput.hasAttribute('value')).toBe(true);
      expect(numberInput.getAttribute('value')).toBe('259');
      //console.log('number',numberInput, ngModel.$modelValue, ngModel.$viewValue, scope.base._number);
    });

    it('boolean', function() {
      var booleanInput = form[0].querySelector('#booleanInput');
      var ngModel = angular.element(booleanInput).controller('ngModel');
      expect(booleanInput.value).toEqual('true');
      expect(ngModel.$modelValue).toEqual(true);
      expect(ngModel.$viewValue).toEqual(true);
      //console.log(booleanInput, ngModel.$modelValue, ngModel.$viewValue, scope.base._boolean);
    });

    it('textarea', function() {
      var stringTextarea = form[0].querySelector('#stringTextarea');
      var ngModel = angular.element(stringTextarea).controller('ngModel');
      expect(stringTextarea.value).toEqual('tyu');
      expect(ngModel.$modelValue).toEqual('tyu');
      expect(ngModel.$viewValue).toEqual('tyu');
      //console.log(stringTextarea,  scope.base._stringTextArea);
    });

    it('select', function() {
      var stringSelect = form[0].querySelector('#stringSelect');
      var ngModel = angular.element(stringSelect).controller('ngModel');
      //expect(stringSelect.selected).toEqual('Normal');
      expect(ngModel.$modelValue).toEqual('Normal');
      expect(ngModel.$viewValue).toEqual('Normal');
    });
  });

});
