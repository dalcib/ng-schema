'use strict';

var app = angular.module('app', ['ng-schema']);



app.factory('mySchema', function() {
  return {
    _id: Number,
    customer: { type: String, maxlength: 10,  minlength: 3, default:'xXxXxXxX', required:true},
    date: { type: Date, default: new Date()},
    level: { type: Number, max: 30, default: 200},
    delivered: {type: Boolean, default:true},
    test: {type: String, minlength:2, maxlength:5, pattern:/abcd/, default:'qqqqqqqq'},
    comment: {type: String, default: 'asdfas asdfasdf asdf'},
    type: {type: String, enum:['Normal', 'Special']}
  };
});


app.controller('OrderCtrl', function () {

});



