/* global getAttrs, setAttr */
'use strict';

describe('getAttrs ', function() {

  var form, id, customer, date, type, delivered, level, comment, elemInputA, elemInputB, elemInputC, elemInputD;
  beforeEach(function() {
    id = angular.element('<input id="_id" ng-model="order._id" required maxLength="15">');
    customer = angular.element('<input id="customer" ng-model="order.customer" ngoose-label="class-test">');
    date = angular.element('<input id="date" ng-model="order.date">');
    type = angular.element( '<select id="type" ng-model="order.type"><option>N</option><option>S</option></select>');
    comment = angular.element('<textarea id="comment" ng-model="order.comment"></textarea>');
    level = angular.element('<input id="level" ng-model="order.level" class="test">');
    var _delivered ='<input id="delivered" type="checkbox" ng-model="order.delivered"';
    _delivered +='required maxLength="15" min="3" patterns="/a/">';
    delivered = angular.element(_delivered);
    elemInputA = angular.element('<input>');
    elemInputB = angular.element('<input>');
    elemInputC = angular.element('<input>');
    elemInputD = angular.element('<input min="4">');
    //id = id[0];
    /*form = angular.element(
      '<form name="teste" form-schema="orderSchema:order">'+
      '<input id="_id" ng-model="order._id" required maxLength="15"><br>'+
      '<input id="customer" ng-model="order.customer" ngoose-label="class-test"><br>'+
      '<input id="date" ng-model="order.date"><br>'+
      '<input id="level" ng-model="order.level"><br>'+
      '<textarea id="comment" ng-model="order.comment"></textarea><br>'+
      '<select id="type" ng-model="order.type">'+
      '<option>Normal</option>'+
      '<option>Special</option>'+
      '</select><br>'+
      '<input id="delivered" type="checkbox" ng-model="order.delivered"><br>'+
      '</form>'
    );
    var scope = $rootScope;
    $compile(form)(scope);
    scope.$digest();*/
  });

  describe('should get all', function() {

    it('attribuites', function() {
      expect(getAttrs(id[0])).toEqual({
        id: '_id', 'ng-model': 'order._id', required: '',  maxlength: '15'
      });
      expect(getAttrs(customer[0])).toEqual({
        id : 'customer', 'ng-model' : 'order.customer', 'ngoose-label':'class-test'
      });
      expect(getAttrs(date[0])).toEqual({id: 'date', 'ng-model': 'order.date'});
      expect(getAttrs(type[0])).toEqual({id: 'type', 'ng-model': 'order.type'});
      expect(getAttrs(delivered[0])).toEqual({
        id: 'delivered',
        type: 'checkbox',
        'ng-model' : 'order.delivered',
        required: '',
        maxlength: '15',
        min: '3',
        patterns: '/a/'
      });
    });
  });

  describe('shouldn\'t get', function() {
    it('class\'s attribuites', function() {
      expect(getAttrs(level[0])).toEqual({id : 'level', 'ng-model' : 'order.level'});
    });
  });

  describe('should set', function() {
    it('attributes', function() {
      setAttr(id[0],'min','6');
      expect(getAttrs(id[0])).toEqual({
        id: '_id', 'ng-model': 'order._id', required: '',  maxlength: '15', min: '6'
      });
      setAttr(elemInputA[0],'id','elemInput');
      setAttr(elemInputA[0],'required','');
      setAttr(elemInputA[0],'type','url');
      setAttr(elemInputA[0],'ng-model','order.elem-input');
      expect(getAttrs(elemInputA[0])).toEqual({
        id: 'elemInput', required: '', type:'url', 'ng-model': 'order.elem-input'
      });
      elemInputC[0].required = true;
      expect(getAttrs(elemInputC[0])).toEqual({required: ''});
      setAttr(elemInputD[0],'min','6');
      expect(getAttrs(elemInputD[0])).toEqual({min: '4'});
    });
  });

});
