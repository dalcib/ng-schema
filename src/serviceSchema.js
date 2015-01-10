'use strict';

angular.module('ng-schema')
  .factory('Schema', function() {
    return Schema;
  });

function Schema(obj, options) {
  if (!(this instanceof Schema)) {
    return new Schema(obj, options);
  }
  this.paths = {};
  this.nested = {};
  this.tree = {};
  if (obj) {
    this.add(obj);
  }
}

Schema.Types = {};
Schema.Types.ObjectId = String;
//Schema.prototype.paths;
//Schema.prototype.tree;

Schema.prototype.add = function add(obj, prefix) {
  prefix = prefix || '';
  var keys = Object.keys(obj);

  for (var i = 0; i < keys.length; ++i) {
    var key = keys[i];

    if (null == obj[key]) {
      throw new Error('Invalid value for schema path `'+ prefix + key +'`');
    }

    if ((obj[key].toString() === '[object Object]') &&
        (!obj[key].constructor || 'Object' === obj[key].constructor.name) &&
        (!obj[key].type || obj[key].type.type)) {
          if (Object.keys(obj[key]).length) {
            // nested object { last: { name: String }}
            this.nested[prefix + key] = true;     /////////
            this.add(obj[key], prefix + key + '.');
          } else {
            this.path(prefix + key, obj[key]); // mixed type
          }
    } else {
          if ((obj[key].constructor.name === 'Function') &&
              (obj[key].toString() !== '[object Object]') &&
              (!obj[key].type))  {
            this.path(prefix + key, {type: obj[key]});
          } else {
            this.path(prefix + key, obj[key]);
          }
    }
  }
};

Schema.prototype.path = function (path, obj) {
  if (obj === undefined) {
    if (this.paths[path]) {return this.paths[path];}
    if (this.subpaths[path]) {return this.subpaths[path];}
  }
  // update the tree
  var subpaths = path.split(/\./),
    last = subpaths.pop(),
    branch = this.tree;

  subpaths.forEach(function(sub, i) {
    if (!branch[sub]) {branch[sub] = {};}
    if ('object' !== typeof branch[sub]) {
      var msg = 'Cannot set nested path `' + path + '`. '+
              'Parent path `'+
              subpaths.slice(0, i).concat([sub]).join('.') +
              '` already set to type ' + branch[sub].name +
              '.';
      throw new Error(msg);
    }
    branch = branch[sub];
  });

  branch[last] = obj;

  /*if (obj.constructor && obj.constructor.name != 'Object')
    obj = { type: obj };*/

  this.paths[path] = obj; //Schema.interpretAsType(path, obj);

  return this;
};


Schema.prototype.eachPath = function (fn) {
  var keys = Object.keys(this.paths),
    len = keys.length;

  for (var i = 0; i < len; ++i) {
    fn(keys[i], this.paths[keys[i]]);
  }

  return this;
};

