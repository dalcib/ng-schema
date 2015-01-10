(function () {

'use scrict';

angular.module('ng-schema',[]);


/*global Schema, compileField */
'use strict';

angular.module('ng-schema')
.directive('modelSchema', modelSchema);

function modelSchema($injector, $compile, Schema) {
  var directive = {
    restrict: 'A',
    compile: function (tElement, tAttr) {
      return {
        post: link
      };
    }
  };
  return directive;

  function link(scope, element, attrs) {

    var schemaName = splitAttrSchema(attrs.modelSchema);
    var valueSchema = $injector.get(schemaName.name);
    var preSchema = {};
    if (schemaName.prefix) {
      preSchema[schemaName.prefix] = valueSchema;
    } else {
      preSchema = valueSchema;
    }
    var schema = new Schema(preSchema);
    var fields = element[0].querySelectorAll('*[ng-model]');

    for (var ini = 0; ini < fields.length; ini++) {
      var nodeAttrs = getAttrs(fields[ini]);

      var ngModel = angular.element(fields[ini]).controller('ngModel');
      var fieldName = nodeAttrs['ng-model'].split('.');
      fieldName = fieldName[fieldName.length-1];
      var path = schema.paths[nodeAttrs['ng-model']];

      var compiledField = compileField($compile, path, fields[ini], scope, ngModel);

      /*for (var pathAttr in path) {
        if (path.hasOwnProperty(pathAttr)) {
          pathAttr = pathAttr.toLowerCase();
          var notCompiled = ['select', 'sparse', 'index', 'unique', 'expires', 'auto',
                             'set', 'get', 'virtual','formatter', 'parser', 'validate'];
          if (notCompiled.indexOf(pathAttr) === -1) {
            setAttr(fields[ini], pathAttr, path[pathAttr],  ngModel, scope);
          }
        }
      }
      if (!fields[ini].hasAttribute('name') ) {
        fields[ini].setAttribute('name', fields[ini].getAttribute('ng-model') );
      }
      var compiledField = $compile(angular.element(fields[ini]))(scope);*/

      var compiledNgModel = angular.element(compiledField).controller('ngModel');
      for (var pathNgModel in path) {
        if (path.hasOwnProperty(pathNgModel)) {
          pathNgModel = pathNgModel.toLowerCase();
          var toSetNgModel = ['formatter', 'parser', 'validate', 'trim', 'uppercase', 'lowercase', 'default'];
          if (toSetNgModel.indexOf(pathNgModel) > -1) {
            setNgModel(compiledField, pathNgModel, path[pathNgModel],  compiledNgModel, scope);
          }
          setObject(path, scope, schemaName.prefix, fieldName);
        }
      }
    }

  }
}

function compileField($compile, path, field, scope, ngModel) {
  for (var pathAttr in path) {
        if (path.hasOwnProperty(pathAttr)) {
          pathAttr = pathAttr.toLowerCase();
          var notCompiled = ['select', 'sparse', 'index', 'unique', 'expires', 'auto',
                             'set', 'get', 'virtual','formatter', 'parser', 'validate'];
          if (notCompiled.indexOf(pathAttr) === -1) {
            setAttr(field, pathAttr, path[pathAttr],  ngModel, scope);
          }
        }
      }
      if (!field.hasAttribute('name') ) {
        field.setAttribute('name', field.getAttribute('ng-model') );
      }
      var compiledField = $compile(angular.element(field))(scope);

    return compiledField;
}

//function linkField() {}

/*function ajustJSONSchema(pathAttr) {
  switch (pathAttr) {
    case 'match': return 'pattern';
    case 'minimum': return 'min';
    case 'maximum': return 'max';
    default: return pathAttr;
  }
}*/

function setNgModel(field, pathAttr, pathNgModelValue, ngModel) {
  switch (pathAttr) {
    case 'formatter':
      ngModel.$formatters.push(pathNgModelValue);
      break;
    case 'parser':
      ngModel.$parsers.push(pathNgModelValue);
      break;
    case 'validate':
      processValidate(pathNgModelValue, ngModel);
      break;
    case 'default':
      /*var defaultValue;
      if (pathNgModelValue === 'true') {pathNgModelValue = true;}
      if (pathNgModelValue === 'false') {pathNgModelValue = false;}
      if (typeof pathNgModelValue === 'function') {
        defaultValue = pathNgModelValue();
      } else {
        defaultValue = pathNgModelValue;
      }
      field.value = defaultValue;
      //console.log('nnnnnnn txtarez', field, ngModel.$viewValue, defaultValue, ngModel);*/
      break;
    case 'trim':
      //process(field, pathAttr, pathNgModelValue, ngModel);
      break;
    case 'uppercase':
      //process(field, pathAttr, pathNgModelValue, ngModel);
      break;
    case 'lowercase':
      //process(field, pathAttr, pathNgModelValue, ngModel);
      break;
    default:
      break;
  }
}

function setAttr(field, pathAttr, pathAttrValue, ngModel) {
  if (!field.hasAttribute(pathAttr) ) {
    switch (pathAttr) {
    case 'type':
      processType(field, pathAttrValue);
      break;
    case 'enum':
      processEnum(field, pathAttr, pathAttrValue, ngModel);
      break;
    case 'ref':
      processRef(field, pathAttr, pathAttrValue, ngModel);
      break;
    case 'required':
      field.required = true;
      break;
    case 'match':
      processPattern(field, pathAttrValue);
      break;
    case 'pattern':
      processPattern(field, pathAttrValue);
      break;
    case 'minlength':
      field.setAttribute(pathAttr, pathAttrValue);
     // field.setAttribute('ng-'+pathAttr, pathAttrValue);
      break;
    case 'maxlength':
        field.setAttribute(pathAttr, pathAttrValue);
        //field.setAttribute('ng-'+pathAttr, pathAttrValue);
      break;
    case 'default':
      processDefault(field, pathAttr, pathAttrValue, ngModel);
        break;
    default:
      field.setAttribute(pathAttr, pathAttrValue);
      break;
    }
  }
}

function processType(field, schemaType) {
  var tagType;
  if (['text', 'number', 'date', 'month', 'time', 'week', 'checkbox', 'radio', 'email',
       'url', 'search', 'password'].indexOf(schemaType) > -1 ) {
    tagType = schemaType;
  } else {
    switch (schemaType) {
      case String:
        tagType = 'text';
        break;
      case 'string':
        tagType = 'text';
        break;
      case Number:
        tagType = 'number';
        break;
      case 'integer':
        field.setAttribute('step', 1);
        tagType = 'number';
        break;
      case Date:
        tagType = 'date';
        break;
      case Boolean:
        tagType = 'checkbox';
        break;
      case Schema.Types.ObjectId:
        tagType = 'text';
        break;
      default:
        tagType = 'text';
        break;
    }
  }
  field.setAttribute('type', tagType);
}

function processValidate(pathAttrValue, ngModel) {
  var lenKeys = Object.keys(ngModel.$validators).length;
  if ('function' === typeof pathAttrValue) {
    ngModel.$validators['schema-validator'+lenKeys] = pathAttrValue;
  }
  if ('RegExp' === pathAttrValue.constructor.name) {
    var validateRegexSchema = function(regexp, value) {
      return ngModel.$isEmpty(value) || regexp.test(value);
    };
    ngModel.$validators.validateRegexSchema = validateRegexSchema;
  }
  if (angular.isArray(pathAttrValue)) {
    pathAttrValue.forEach(function(arg){
      lenKeys = Object.keys(ngModel.$validators).length;
      if ('function' === typeof arg) {
        ngModel.$validators['schema-validator'+lenKeys] = pathAttrValue;
      }
      if ('Object' === arg.constructor.name && arg.validator) {
        ngModel.$validators['schema-validator'+lenKeys] = arg.validator;
      } else {
        var msg = 'Invalid validator. Received (' + typeof arg + ') ' + arg;
        throw new Error(msg);
      }
    });
  }
}

function processPattern(field, pathAttrValue) {
  var pattern, regexp, match;
  if (angular.isString(pathAttrValue)) {
    regexp = new RegExp(pathAttrValue);
    pattern = pathAttrValue;
  } else {
    match = pathAttrValue.toString().match(/^\/(.*)\/([gim]*)$/);
    if (match) {
      regexp = pathAttrValue;
      pattern = match[1];
    }
  }
  field.setAttribute('pattern', pattern);
  //field.setAttribute('ng-pattern', regexp);
}

function processDefault(field, pathAttr, pathAttrValue, ngModel) {
  var defaultValue;
  if (typeof pathAttrValue === 'function') {
    defaultValue = pathAttrValue();
  } else {
    defaultValue = pathAttrValue;
  }
  field.setAttribute('value', defaultValue);
  //var model = field.getAttribute('ng-model');
  //field.setAttribute('ng-init', model+'=\''+defaultValue+'\'');
  if (field.type === 'radiobox') {
    //TODO
    var value = field.value;
  }
  if (field.type === 'checkbox' && typeof defaultValue === 'boolean') {
    field.defaultChecked =  defaultValue;
    //console.log('type checkbox', field);
  }
  if (getNodeTag(field) === 'textarea') {
    field.defaultValue =  defaultValue;
  }
  if (getNodeTag(field) === 'select') {
    //var options = field.querySelectorAll('option');
    var options = field.options;
    //console.log( field.options);
    for (var i = 0, l = options.length; i < l; i++) {
      if (options[i].value === defaultValue) {
        options[i].selected = true;
      }
    }
  }
    ngModel.$setViewValue(defaultValue);
    //console.log('type txtarez', field, ngModel.$viewValue, defaultValue);

}


function processEnum(field, pathAttr, pathAttrValue, ngModel) {
  var enumValidator = function(value) {
    var enumValues = pathAttrValue;
    return (enumValues.indexOf(value) > -1);
  };
  ngModel.validators.enumValidator = enumValidator;
  var tag = getNodeTag(field);
  if (tag === 'select' && field.querySelectorAll('option').length === 0 ) {
    pathAttrValue.forEach(function(option){
      var opt = document.createElement('');
      opt.textContent = option;
      opt.setAttribute('value', option);
      field.appendChild(opt);
    });
  }
  if (tag === 'input' && field.hasAttribute('list') === false) {
    var fieldName = field.getAttribute('ng-model');
    field.setAttribute('list', 'list-'+fieldName);
    var datalist = document.createElement('datalist');
    datalist.setAttribute('id','list'+fieldName);
    pathAttrValue.forEach(function(option){
      var opt = document.createElement('');
      opt.textContent = option;
      opt.setAttribute('value', option);
      datalist.appendChild(opt);
    });
    field.insertAdjacentElement('afterEnd',datalist);
  }

}

function processRef(field, pathAttr, pathAttrValue, ngModel) {

}

function setObject(path, scope, prefix, fieldName) {
  var _scope;
  if (prefix && angular.isObject(scope[prefix])) {
    //console.log(prefix, scope[prefix], scope.$id);
    _scope = scope[prefix];
  } else {
    //console.log(prefix, scope, scope.$id);
    _scope = scope;
  }
  if (path.default) {
    var defaultValue;
    if (typeof path.default === 'function') {
      defaultValue = path.default();
    } else {
      defaultValue = path.default;
    }
    _scope[fieldName] = defaultValue;
    var xxxx = _scope[fieldName];
    //console.log(prefix, path.default, fieldName, xxxx);

  }
  var descriptors = {};
  if (path.set) {descriptors.set = path.set;}
  if (path.get) {descriptors.get = path.get;}
  if (path.virtual) {descriptors.enumerable = true;}
  if (descriptors.set || descriptors.get || descriptors.enumerable) {
    if (angular.isObject(scope[prefix])) {
      //console.log(fieldName);
      Object.defineProperty(_scope, fieldName, descriptors);
    }
  }
}

function getAttrs(elem) {   //tested
  var attrs = {}; //[];
  var elemAttrs = elem.attributes;
  for (var i = 0; i < elemAttrs.length; i++) {
    var attr = elemAttrs[i];
    var prop = attr.nodeName;
    var value = attr.value;
    if (prop !== 'class') {
      attrs[prop] = value;
      //attrs.push(obj);
    }
  }
  return attrs;
}

function getNodeTag(elem) {
  var tag;
  var nodeName = elem.nodeName.toLowerCase();
  switch (nodeName) {
  case 'select':
    tag = nodeName;
    break;
  case 'textarea':
    tag = nodeName;
    break;
  default:
    tag = elem.type;
    break;
  }
  return tag;
}

/*var patterns = {
  email: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
  url: /[-a-zA-Z0-9@:%._+~#=]{2,256}.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/,
  number: /^[-+]?[0-9]*\.?[0-9]+$/,
  date: /^\d{4}-\d{2}-\d{2}$/,
  empty: /^\s*$/
};*/

function splitAttrSchema(schemaName) {   ///tested
  var prefix, name;
  var splitedSchema = schemaName.split(':');
  if (splitedSchema.length > 1) {
    prefix = splitedSchema[1];
    name = splitedSchema[0];
  } else {
    name = schemaName;
  }
  return {name: name, prefix: prefix};
}




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

})();
