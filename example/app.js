'use strict';

var app = angular.module('app', ['ng-schema']);

app.factory('miSchema', function() {
  return {
      _id: String,
      customer: { type: String, /*maxLength: 10,*/ default:'wqewqe'},
    date: { type: Date, default: new Date('2014-12-20')},
      level: { type: Number, max: 3, default: 2},
      delivered: {type: Boolean, default:true},
    comment: {type: String, default: 'asdfas asdfasdf asdf'}
  };
});


app.factory('mySchema', function() {
  return {
      _id: Number,
    customer: { type: String, maxlength: 10,  minlength: 3, default:'xXxXxXxX', required:true},
      date: { type: Date, default: new Date()},
      level: { type: Number, max: 30, default: 200},
    delivered: {type: Boolean, default:true},
    xx: {type: String, minlength:2, maxlength:5, pattern:/.{3,4}/, default:'qqqqqqqq'},
    comment: {type: String, default: 'asdfas asdfasdf asdf'}
  };
});


app.controller('OrderCtrl', function () {

  /*this.schema = {
      _id: String,
      customer: { type: String, maxLength: 10},
      date: { type: Date, default: Date.now},
      level: { type: Number, max: 3, default: 2},
      delivered: {type: Boolean}
  };*/
  this._id = 123;
  //this.customer = 'Dalci';
  //this.date = Date.now();
  this.itens = [{_id: 567, product: {name: 'teste'}}];
  /*console.log({
    _id: String,
    customer: { type: String, maxLength: 10},
    date: { type: Date, default: Date.now()},
    level: { type: Number, max: 3},
    delivered: {type: Boolean}
  });*/

});


app.controller('SrderCtrl', function ($scope) {
  $scope.srder = {};
  /*$scope.srder.schema = {
      _id: String,
      customer: { type: String, maxLength: 10},
      date: { type: Date, default: Date.now},
      level: { type: Number, max: 3, default: 2},
      delivered: {type: Boolean}
  };*/
  $scope.srder._id = 123;
  //$scope.srder.customer = 'Dalci';
});


/*(function() {
  var field = document.querySelector('#xxx');
  document.querySelector('#xxx').addEventListener('keyup', function() {
    console.log('Validates: ', field.validity);
  }, false);
})();*/
