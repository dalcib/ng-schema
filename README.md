# ng-schema

ng-schema allows to use [Mongoose](http://mongoosejs.com/) Schemas in [Angular](http://angular.org/) forms.

It isn't a form generator. 
You build your form normaly and associate to a schema, and all valitations will be ready to use.

## Motivation

The program uses a declarative way to express the user interface and application behavior.
Thus, the business rules are defined in the View in HTML form.
Is not good because these rules are mixed with the presentation layer.

## D.R.Y.

Using Mongoose Schemas to define the Business Rules, it is not needed to repeat the validations rules in each form.
All rules are in one place, in an Angular service.

## Overview

```js
angular.module('app').factory('mySchema', function() {
return {
_id: String,
customer: { type: String, minlength: 5, required, match:/^[a-zA-Z ]*$/},
date: { type: Date, default: (new Date()).toISOString()},
level: { type: Number, max: 3, default: 2},
delivered: {type: Boolean},
priority: {type: String, enum: ['high', 'medium', 'low']},
comment: {type: String, maxlength: 200}
};
});
```
```html
<form model-schema="mySchema:order">
ID:       <input ng-model="order._id"><br>
Customer: <input ng-model="order.customer"><br>
Date:     <input ng-model="order.date"><br>
Level:    <input ng-model="order.level"><br>
Delivered:<input ng-model="order.delivered"><br>
Priority: <select ng-model="order.priority"><br>
Comment:  <textarea ng-model="order.comment"></textarea><br>
<form>
```
It is the same as:

```html
<form model-schema="mySchema:order">
ID:       <input ng-model="order._id" name="_id"><br>
Customer: <input ng-model="order.customer" ng-minlength="5" required ng-pattern="^[a-zA-Z ]*$"  name="customer"><br>
Date:     <input ng-model="order.date" type="date" ng-init="{{date}}"  name="date"><br>
Level:    <input ng-model="order.level" type="number" max="3" name="level"><br>
Delivered:<input ng-model="order.delivered" type="checkbox"  name="delivered"><br>
Priority: <select ng-model="order.priority">
<options>high</options>
<options>medium</options>
<options>low</options>
</select><br>
Comment:  <textarea ng-model="order.comment" ng-maxlength="200"></textarea><br>
<form>
```

##Documentation

####Types
- ``String``, ``Number``, ``Boolean``, ``Date``
or
- 'text', 'string', number', 'integer', 'date', 'month', 'time', 'week', 'checkbox', 'radio', 'email', 'url', 'search', 'password'

####Constraints
- ``min``, ``max``, ``maxlength``, ``minlength``, ``required``, ``match`` (or ``pattern``)

####Helpers
- ``enum``, ``default``

####Html Attributes
The schema can be used to define elements atributes like:
``name``, ``title``, ``disable``, ``readonly``, ``step``, ``placeholder``

####Assessors and Modifiers
- ``get``, ``set``, ``validate``, ``virtual``  (default in Mongoose)
- ``formatter``, ``parser``  (for use in Angular forms)

```js
angular.module('app').factory('mySchema', function() {
  return {
    field: { 
      type: String,
      formatter: function(value) {return value.replace('_', ''); },
      parser: function(value) {return '_'+value;}
    },
    valid: {
      type: Number,
      validate: function(value) { 
        value = parseInt(modelValue, 10);
        return (value < 10);
      },
    },
    firstName: String,
    lastName: String,
    fullName: { 
      type: String,
      get: function() {return this.firstName + ' ' + this.lastName;},
      set: function(name) {
        var words = name.toString().split(' ');
        this.firstName = words[0] || '';
        this.lastName = words[1] || '';
      }
    }
  }
});
```


### Notes

- If a attribute is defined in the form, it won't be overwritten for the schema value. So, the rules can be customised in a specific form, if it is needed.
- Both HTML5 constraints and Angular constraints are defined. If there is the ``maxlength`` in the schema, the attributes ``ng-maxlegth`` and ``maxlength`` are defined. If necessary, use the attribute ``novalidate`` in the form to stop HTML5 validation.
- The Mongoose schema is extended to accept string Types, formatters, parsers and pattern.
- The attributes ``label``, ``description`` and ``format`` can be used to help in another directives.

## TODO
- More tests
- ``enum``
- ``ref`` - populate
- JSON-Schemas