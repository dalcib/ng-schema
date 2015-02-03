'use strict';
describe('Set attributes by functions', function() {
  var form, scope, testSchema, field, valid, firstName, lastName, fullName, xxx, $sniffer, changeInputValueTo;

  beforeEach(module('ng-schema'));

  beforeEach(function() {
    testSchema =  {
      field: { type: String,
                formatter: function(value) {
                  value = value || '';
                  value = value.replace('_', '');
                  return value;
                },
                parser: function(value) {return '_'+value;}
             },
      xxx: {type: Number, max: 5},
      valid: {
                type: Number,
                validate: function(modelValue, viewValue) {
                  var value = modelValue || viewValue;
                  value = parseInt(modelValue, 10);
                  //console.log(modelValue, viewValue, value);
                  return (value < 10);
                },
            },
      firstName: String,
      lastName: String,
      fullName: { type: String,
                  get: function() {
                    return this.firstName + ' ' + this.lastName;
                  },
                 set: function(name) {
                    var words = name.toString().split(' ');
                    this.firstName = words[0] || '';
                    this.lastName = words[1] || '';
                  }
              }
    };
    module(function ($provide) {
      $provide.value('testSchema', testSchema);
    });
  });

  beforeEach(inject(function($rootScope, $compile) {
    form = angular.element(
      '<form name="teste" model-schema="testSchema" form-data-prefix="base">'+
      '<input id="field" name="field" ng-model="base.field"><br>'+
      '<input id="valid" name="valid" ng-model="base.valid"><br>'+
      '<input id="xxx" name="xxx" ng-model="base.xxx"><br>'+
      '<input id="firstName" name="firstName" ng-model="base.firstName"><br>'+
      '<input id="lastName" name="lastName" ng-model="base.lastName"><br>'+
      '<input id="fullName" name="fullName" ng-model="base.fullName"><br>'+
      '</form>'

    );
    scope = $rootScope;
    scope.base = {};
    $compile(form)(scope);
    scope.$digest();

    field = form[0].querySelector('#field');
    valid = form[0].querySelector('#valid');
    firstName = form[0].querySelector('#firstName');
    lastName = form[0].querySelector('#lastName');
    fullName = form[0].querySelector('#fullName');
    xxx = form[0].querySelector('#xxx');
  }));


  it('should set formatters', function() {
    //changeInputValueTo(field, '_3');
    var ngModel = angular.element(field).controller('ngModel');
    scope.base.field = '_3';
    scope.$digest();
    expect(ngModel.$viewValue).toEqual('3');
  });

  it('should set parsers', function() {
    var ngModel = angular.element(field).controller('ngModel');
    scope.teste.field.$setViewValue('3');
    expect(scope.base.field).toEqual('_3');
  });

  it('should set validators when true by view', function() {
    var ngModel = angular.element(xxx).controller('ngModel');
    //ngModel.$setViewValue('8', 'blur');
    //ngModel.$setModelValue('3');   XXXXXXXXXXXXXXXXXXXX
    //scope.teste.valid.$setViewValue('3', 'blur'); // XXXXXXXXXXXX
    //scope.teste.valid.$setModelValue('3');  XXXXXXX

    /*console.log(scope.base.xxx,  ngModel.$modelValue, ngModel.$viewValue);
    console.log(scope.teste.xxx.$modelValue);
    console.log(scope.teste.xxx.$viewValue);
    console.log(scope.teste.xxx.$error);
    console.log(scope.teste.xxx.$valid);
    console.log(scope.teste.xxx.$invalid);*/

    expect(scope.teste.$pristine).toBe(true);
    expect(scope.teste.xxx.$pristine).toBe(true);
    expect(scope.teste.$dirty).toBe(false);
    expect(scope.teste.xxx.$dirty).toBe(false);

    scope.base.xxx = 3;
    scope.$digest();

    expect(scope.teste.xxx.$valid).toBe(true);

    expect(ngModel.$viewValue).toEqual('3');
    expect(ngModel.$modelValue).toEqual(3);
    expect(scope.base.xxx).toEqual(3);
    expect(scope.teste.xxx.$viewValue).toEqual('3');
    expect(scope.teste.xxx.$modelValue).toEqual(3);


    expect(xxx.hasAttributes('type')).toBe(true);
    expect(xxx.getAttribute('type')).toBe('number');

  });

  it('should set validators when true by model', function() {
    var ngModel = angular.element(valid).controller('ngModel');
    scope.base.valid = 3;
    scope.$digest();
    expect(scope.teste.valid.$valid).toBe(true);
  });

  it('should set validators when false by view', function() {
    var ngModel = angular.element(valid).controller('ngModel');
    scope.teste.valid.$setViewValue('13');
    expect(scope.teste.valid.$valid).toBe(false);
  });

  it('should set validators when false by model', function() {
    var ngModel = angular.element(valid).controller('ngModel');
    scope.base.valid = 13;
    scope.$digest();
    expect(scope.teste.valid.$valid).toBe(false);
  });

  it('should set setters', function() {
    scope.base.fullName = 'DALCI BAGOLIN';
    expect(scope.base.firstName).toBe('DALCI');
    expect(scope.base.lastName).toBe('BAGOLIN');
  });

  it('should set getters', function() {
    scope.base.firstName = 'Dalci';
    scope.base.lastName = 'Bagolin';
    expect(scope.base.fullName).toBe('Dalci Bagolin');
  });

  it('should set virtuals', function() {

  });

});
