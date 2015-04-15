/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(2)
	var jss = __webpack_require__(1)
	var debug = __webpack_require__(3)
	jss.use(debug)


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * StyleSheets written in javascript.
	 *
	 * @copyright Oleg Slobodskoi 2014
	 * @website https://github.com/jsstyles/jss
	 * @license MIT
	 */

	module.exports = __webpack_require__(4)


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	__webpack_require__(5);

	var Browser = _interopRequire(__webpack_require__(6));

	// Register reactive element.
	if (document.registerReact) {
	    document.registerReact("grape-browser", Browser);
	}

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	/**
	 * Add rule name to the class name for debugging purposes.
	 *
	 * @param {Rule} rule
	 * @api public
	 */
	module.exports = function (rule) {
	    if (!rule.options.named) return
	    var name = rule.options.name
	    rule.className += ' jss:' + name
	    if (rule.options.sheet) {
	        rule.options.sheet.classes[name] = rule.className
	    }
	}


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var StyleSheet = __webpack_require__(7)
	var Rule = __webpack_require__(8)

	exports.StyleSheet = StyleSheet

	exports.Rule = Rule

	exports.plugins = __webpack_require__(9)

	/**
	 * Create a stylesheet.
	 *
	 * @param {Object} rules is selector:style hash.
	 * @param {Object} [named] rules have names if true, class names will be generated.
	 * @param {Object} [attributes] stylesheet element attributes.
	 * @return {StyleSheet}
	 * @api public
	 */
	exports.createStyleSheet = function (rules, named, attributes) {
	    return new StyleSheet(rules, named, attributes)
	}

	/**
	 * Create a rule.
	 *
	 * @param {String} [selector]
	 * @param {Object} style is property:value hash.
	 * @return {Rule}
	 * @api public
	 */
	exports.createRule = function (selector, style) {
	    var rule = new Rule(selector, style)
	    exports.plugins.run(rule)
	    return rule
	}

	/**
	 * Register plugin. Passed function will be invoked with a rule instance.
	 *
	 * @param {Function} fn
	 * @api public
	 */
	exports.use = exports.plugins.use


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	// Setup jss plugins.

	var jss = _interopRequire(__webpack_require__(1));

	var jssExtend = _interopRequire(__webpack_require__(18));

	var jssNested = _interopRequire(__webpack_require__(20));

	var jssCamelCase = _interopRequire(__webpack_require__(19));

	var jssPx = _interopRequire(__webpack_require__(21));

	var jssVendorPrefixer = _interopRequire(__webpack_require__(22));

	jss.use(jssExtend);
	jss.use(jssNested);
	jss.use(jssCamelCase);
	jss.use(jssPx);
	jss.use(jssVendorPrefixer);

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var React = _interopRequire(__webpack_require__(10));

	var useSheet = _interopRequire(__webpack_require__(17));

	var clone = _interopRequire(__webpack_require__(23));

	var cloneDeep = _interopRequire(__webpack_require__(24));

	var find = _interopRequire(__webpack_require__(25));

	var findIndex = _interopRequire(__webpack_require__(26));

	var capitalize = _interopRequire(__webpack_require__(27));

	var browserStyle = _interopRequire(__webpack_require__(11));

	var tabsStyle = _interopRequire(__webpack_require__(12));

	var Tabs = _interopRequire(__webpack_require__(13));

	var Empty = _interopRequire(__webpack_require__(14));

	var services = _interopRequireWildcard(__webpack_require__(15));

	var dataUtils = _interopRequireWildcard(__webpack_require__(16));

	/**
	 * Main component which uses everything else.
	 */
	module.exports = React.createClass({
	  displayName: "Browser",

	  mixins: [useSheet(browserStyle)],

	  getDefaultProps: function getDefaultProps() {
	    return {
	      data: null,
	      height: 300,
	      className: ""
	    };
	  },

	  getInitialState: function getInitialState() {
	    return this.createState(this.props);
	  },

	  componentWillReceiveProps: function componentWillReceiveProps(props) {
	    this.setState(this.createState(props));
	  },

	  createState: function createState(props) {
	    var sections = dataUtils.getSections(props.data, props.serviceId);
	    var tabs = [];

	    if (props.data) {
	      tabs = dataUtils.getTabs(props.data.services, sections, props.serviceId);
	    }

	    return {
	      sections: sections,
	      tabs: tabs,
	      serviceId: props.serviceId
	    };
	  },

	  /**
	   * Select facet.
	   *
	   * @param {String} facet can be service id or "prev" or "next"
	   */
	  selectFacet: function selectFacet(facet) {
	    var tabs = this.state.tabs;

	    var currIndex = findIndex(tabs, function (tab) {
	      return tab.selected;
	    });

	    var newIndex = undefined;
	    var set = false;

	    if (facet == "next") {
	      newIndex = currIndex + 1;
	      if (newIndex < tabs.length) {
	        set = true;
	      }
	    } else if (facet == "prev") {
	      newIndex = currIndex - 1;
	      if (newIndex >= 0) {
	        set = true;
	      }
	    } else {
	      newIndex = findIndex(tabs, function (tab) {
	        return tab.service == facet;
	      });
	      set = true;
	    }

	    if (set) {
	      var service = tabs[newIndex].service;
	      dataUtils.setSelectedTab(tabs, newIndex);
	      var sections = dataUtils.getSections(this.props.data, service);
	      dataUtils.setSelectedSection(sections, service);
	      dataUtils.setFocusedObjectAt(sections, service, 0);
	      this.setState({ tabs: tabs, sections: sections, serviceId: service });
	      this.emit("selectFacet", { service: service });
	    }
	  },

	  focusObject: function focusObject(id) {
	    var sections = this.state.sections;
	    var set = false;

	    if (id == "next" || id == "prev") {
	      var selectedSection = dataUtils.getSelectedSection(sections);
	      var objects = selectedSection ? selectedSection.results : dataUtils.getObjects(sections);
	      var focusedIndex = findIndex(objects, function (object) {
	        return object.focused;
	      });
	      var newObject = undefined;

	      if (id == "next") {
	        newObject = objects[focusedIndex + 1];
	      } else if (id == "prev") {
	        newObject = objects[focusedIndex - 1];
	      }

	      if (newObject) {
	        id = newObject.id;
	        set = true;
	      }
	    } else {
	      set = true;
	    }

	    if (set) {
	      dataUtils.setFocusedObject(sections, id);
	      this.setState({ sections: sections });
	    }
	  },

	  getFocusedObject: function getFocusedObject() {
	    return dataUtils.getFocusedObject(this.state.sections);
	  },

	  selectObject: function selectObject(id) {
	    this.focusObject(id);
	    this.emit("selectObject", { id: id });
	  },

	  /**
	   * Emit DOM event.
	   */
	  emit: function emit(type, data) {
	    var event = new CustomEvent("grape" + capitalize(type), {
	      bubbles: true,
	      cancelable: true,
	      detail: data
	    });
	    this.getDOMNode().dispatchEvent(event);
	    var cb = this.props[type];
	    if (cb) cb(data);
	  },

	  render: function render() {
	    var classes = this.sheet.classes;
	    var sections = this.state.sections;

	    var selectedSection = dataUtils.getSelectedSection(sections);
	    var serviceName = "all";
	    var data = selectedSection ? [selectedSection] : sections;
	    var facet = undefined;
	    var empty = undefined;

	    if (data.length) {
	      facet = React.createElement(services[serviceName], {
	        data: data,
	        focusedObject: this.getFocusedObject(),
	        height: this.props.height - tabsStyle.container.height,
	        focus: this.onFocusObject,
	        select: this.onSelectObject
	      });
	    } else {
	      empty = React.createElement(Empty, null);
	    }

	    var style = {
	      height: "" + this.props.height + "px"
	    };

	    return React.createElement(
	      "div",
	      {
	        className: "" + classes.container + " " + this.props.className,
	        style: style
	      },
	      React.createElement(Tabs, { data: this.state.tabs, select: this.onSelectFacet }),
	      facet,
	      empty
	    );
	  },

	  onFocusObject: function onFocusObject(id) {
	    this.focusObject(id);
	  },

	  onSelectObject: function onSelectObject(id) {
	    this.selectObject(id);
	  },

	  onSelectFaacet: function onSelectFaacet(facet) {
	    this.selectFacet(facet);
	  }
	});

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var Rule = __webpack_require__(8)
	var plugins = __webpack_require__(9)

	/**
	 * StyleSheet abstraction, contains rules, injects stylesheet into dom.
	 *
	 * Options:
	 *
	 *  - `media` style element attribute
	 *  - `title` style element attribute
	 *  - `type` style element attribute
	 *  - `named` true by default - keys are names, selectors will be generated,
	 *    if false - keys are global selectors.
	 *  - `link` link jss Rule instances with DOM CSSRule instances so that styles,
	 *  can be modified dynamically, false by default because it has some performance cost.
	 *
	 * @param {Object} [rules] object with selectors and declarations
	 * @param {Object} [options]
	 * @api public
	 */
	function StyleSheet(rules, options) {
	    this.options = options || {}
	    if (this.options.named == null) this.options.named = true
	    this.element = null
	    this.attached = false
	    this.media = this.options.media
	    this.type = this.options.type
	    this.title = this.options.title
	    this.rules = {}
	    // Only when options.named: true.
	    this.classes = {}
	    this.deployed = false
	    this.linked = false

	    // Don't create element if we are not in a browser environment.
	    if (typeof document != 'undefined') {
	        this.element = this.createElement()
	    }

	    for (var key in rules) {
	        this.createRules(key, rules[key])
	    }
	}

	StyleSheet.ATTRIBUTES = ['title', 'type', 'media']

	module.exports = StyleSheet

	/**
	 * Insert stylesheet element to render tree.
	 *
	 * @api public
	 * @return {StyleSheet}
	 */
	StyleSheet.prototype.attach = function () {
	    if (this.attached) return this

	    if (!this.deployed) {
	        this.deploy()
	        this.deployed = true
	    }

	    document.head.appendChild(this.element)

	    // Before element is attached to the dom rules are not created.
	    if (!this.linked && this.options.link) {
	        this.link()
	        this.linked = true
	    }

	    this.attached = true

	    return this
	}

	/**
	 * Remove stylesheet element from render tree.
	 *
	 * @return {StyleSheet}
	 * @api public
	 */
	StyleSheet.prototype.detach = function () {
	    if (!this.attached) return this

	    this.element.parentNode.removeChild(this.element)
	    this.attached = false

	    return this
	}

	/**
	 * Deploy styles to the element.
	 *
	 * @return {StyleSheet}
	 * @api private
	 */
	StyleSheet.prototype.deploy = function () {
	    this.element.innerHTML = '\n' + this.toString() + '\n'

	    return this
	}

	/**
	 * Find CSSRule objects in the DOM and link them in the corresponding Rule instance.
	 *
	 * @return {StyleSheet}
	 * @api private
	 */
	StyleSheet.prototype.link = function () {
	    var CSSRuleList = this.element.sheet.cssRules
	    var rules = this.rules

	    for (var i = 0; i < CSSRuleList.length; i++) {
	        var CSSRule = CSSRuleList[i]
	        var rule = rules[CSSRule.selectorText]
	        if (rule) rule.CSSRule = CSSRule
	    }

	    return this
	}

	/**
	 * Add a rule to the current stylesheet. Will insert a rule also after the stylesheet
	 * has been rendered first time.
	 *
	 * @param {Object} [key] can be selector or name if `options.named` is true
	 * @param {Object} style property/value hash
	 * @return {Rule}
	 * @api public
	 */
	StyleSheet.prototype.addRule = function (key, style) {
	    var rules = this.createRules(key, style)

	    // Don't insert rule directly if there is no stringified version yet.
	    // It will be inserted all together when .attach is called.
	    if (this.deployed) {
	        var sheet = this.element.sheet
	        for (var i = 0; i < rules.length; i++) {
	            var nextIndex = sheet.cssRules.length
	            var rule = rules[i]
	            sheet.insertRule(rule.toString(), nextIndex)
	            if (this.options.link) rule.CSSRule = sheet.cssRules[nextIndex]
	        }
	    } else {
	        this.deploy()
	    }

	    return rules
	}

	/**
	 * Create rules, will render also after stylesheet was rendered the first time.
	 *
	 * @param {Object} rules key:style hash.
	 * @return {StyleSheet} this
	 * @api public
	 */
	StyleSheet.prototype.addRules = function (rules) {
	    for (var key in rules) {
	        this.addRule(key, rules[key])
	    }

	    return this
	}

	/**
	 * Get a rule.
	 *
	 * @param {String} key can be selector or name if `named` is true.
	 * @return {Rule}
	 * @api public
	 */
	StyleSheet.prototype.getRule = function (key) {
	    return this.rules[key]
	}

	/**
	 * Convert rules to a css string.
	 *
	 * @return {String}
	 * @api public
	 */
	StyleSheet.prototype.toString = function () {
	    var str = ''
	    var rules = this.rules
	    var stringified = {}
	    for (var key in rules) {
	        var rule = rules[key]
	        // We have the same rule referenced twice if using named urles.
	        // By name and by selector.
	        if (stringified[rule.id]) continue
	        if (str) str += '\n'
	        str += rules[key].toString()
	        stringified[rule.id] = true
	    }

	    return str
	}

	/**
	 * Create a rule, will not render after stylesheet was rendered the first time.
	 *
	 * @param {Object} [selector] if you don't pass selector - it will be generated
	 * @param {Object} [style] declarations block
	 * @param {Object} [options] rule options
	 * @return {Array} rule can contain child rules
	 * @api private
	 */
	StyleSheet.prototype.createRules = function (key, style, options) {
	    var rules = []
	    var selector, name

	    if (!options) options = {}
	    var named = this.options.named
	    // Scope options overwrite instance options.
	    if (options.named != null) named = options.named

	    if (named) name = key
	    else selector = key

	    var rule = new Rule(selector, style, {
	        sheet: this,
	        named: named,
	        name: name
	    })
	    rules.push(rule)

	    this.rules[rule.selector] = rule
	    if (name) {
	        this.rules[name] = rule
	        this.classes[name] = rule.className
	    }

	    plugins.run(rule)

	    for (key in rule.children) {
	        rules.push(this.createRules(
	            key,
	            rule.children[key].style,
	            rule.children[key].options
	        ))
	    }

	    return rules
	}

	/**
	 * Create style sheet element.
	 *
	 * @api private
	 * @return {Element}
	 */
	StyleSheet.prototype.createElement = function () {
	    var element = document.createElement('style')

	    StyleSheet.ATTRIBUTES.forEach(function (name) {
	        if (this[name]) element.setAttribute(name, this[name])
	    }, this)

	    return element
	}


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var plugins = __webpack_require__(9)

	var uid = 0

	var toString = Object.prototype.toString

	/**
	 * Rule is selector + style hash.
	 *
	 * @param {String} [selector]
	 * @param {Object} [style] declarations block
	 * @param {Object} [options]
	 * @api public
	 */
	function Rule(selector, style, options) {
	    if (typeof selector == 'object') {
	        options = style
	        style = selector
	        selector = null
	    }

	    this.id = Rule.uid++
	    this.options = options || {}
	    if (this.options.named == null) this.options.named = true

	    if (selector) {
	        this.selector = selector
	        this.isAtRule = selector[0] == '@'
	    } else {
	        this.isAtRule = false
	        this.className = Rule.NAMESPACE_PREFIX + '-' + this.id
	        this.selector = '.' + this.className
	    }

	    this.style = style
	    // Will be set by StyleSheet#link if link option is true.
	    this.CSSRule = null
	    // When at-rule has sub rules.
	    this.rules = null
	    if (this.isAtRule && this.style) this.extractAtRules()
	}

	module.exports = Rule

	/**
	 * Class name prefix when generated.
	 *
	 * @type {String}
	 * @api private
	 */
	Rule.NAMESPACE_PREFIX = 'jss'

	/**
	 * Indentation string for formatting toString output.
	 *
	 * @type {String}
	 * @api private
	 */
	Rule.INDENTATION = '  '

	/**
	 * Unique id, right now just a counter, because there is no need for better uid.
	 *
	 * @type {Number}
	 * @api private
	 */
	Rule.uid = 0

	/**
	 * Get or set a style property.
	 *
	 * @param {String} name
	 * @param {String|Number} [value]
	 * @return {Rule|String|Number}
	 * @api public
	 */
	Rule.prototype.prop = function (name, value) {
	    // Its a setter.
	    if (value != null) {
	        if (!this.style) this.style = {}
	        this.style[name] = value
	        // If linked option in StyleSheet is not passed, CSSRule is not defined.
	        if (this.CSSRule) this.CSSRule.style[name] = value
	        return this
	    }

	    // Its a getter.
	    if (this.style) value = this.style[name]

	    // Read the value from the DOM if its not cached.
	    if (value == null && this.CSSRule) {
	        value = this.CSSRule.style[name]
	        // Cache the value after we have got it from the DOM once.
	        this.style[name] = value
	    }

	    return value
	}

	/**
	 * Add child rule. Required for plugins like "nested".
	 * StyleSheet will render them as a separate rule.
	 *
	 * @param {String} selector
	 * @param {Object} style
	 * @param {Object} [options] rule options
	 * @return {Rule}
	 * @api private
	 */
	Rule.prototype.addChild = function (selector, style, options) {
	    if (!this.children) this.children = {}
	    this.children[selector] = {
	        style: style,
	        options: options
	    }

	    return this
	}

	/**
	 * Add child rule. Required for plugins like "nested".
	 * StyleSheet will render them as a separate rule.
	 *
	 * @param {String} selector
	 * @param {Object} style
	 * @return {Rule}
	 * @api public
	 */
	Rule.prototype.extractAtRules = function () {
	    if (!this.rules) this.rules = {}

	    for (var name in this.style) {
	        var style = this.style[name]
	        // Not a nested rule.
	        if (typeof style == 'string') break
	        var selector = this.options.named ? undefined : name
	        var rule = this.rules[name] = new Rule(selector, style, this.options)
	        plugins.run(rule)
	        delete this.style[name]
	    }

	    return this
	}

	/**
	 * Apply rule to an element inline.
	 *
	 * @param {Element} element
	 * @return {Rule}
	 * @api public
	 */
	Rule.prototype.applyTo = function (element) {
	    for (var prop in this.style) {
	        var value = this.style[prop]
	        if (toString.call(value) == '[object Array]') {
	            for (var i = 0; i < value.length; i++) {
	                element.style[prop] = value[i]
	            }
	        } else {
	            element.style[prop] = value
	        }
	    }

	    return this
	}

	/**
	 * Converts the rule to css string.
	 *
	 * @return {String}
	 * @api public
	 */
	Rule.prototype.toString = function (options) {
	    var style = this.style

	    // At rules like @charset
	    if (this.isAtRule && !this.style && !this.rules) return this.selector + ';'

	    if (!options) options = {}
	    if (options.indentationLevel == null) options.indentationLevel = 0

	    var str = indent(options.indentationLevel, this.selector + ' {')

	    for (var prop in style) {
	        var value = style[prop]
	        // We want to generate multiple style with identical property names.
	        if (toString.call(value) == '[object Array]') {
	            for (var i = 0; i < value.length; i++) {
	                str += '\n' + indent(options.indentationLevel + 1, prop + ': ' + value[i] + ';')
	            }
	        } else {
	            str += '\n' + indent(options.indentationLevel + 1, prop + ': ' + value + ';')
	        }
	    }

	    // We are have an at-rule with nested statements.
	    // https://developer.mozilla.org/en-US/docs/Web/CSS/At-rule
	    for (var name in this.rules) {
	        var ruleStr = this.rules[name].toString({
	            indentationLevel: options.indentationLevel + 1
	        })
	        str += '\n' + indent(options.indentationLevel, ruleStr)
	    }

	    str += '\n' + indent(options.indentationLevel, '}')

	    return str
	}

	/**
	 * Returns JSON representation of the rule.
	 * Nested rules, at-rules and array values are not supported.
	 *
	 * @return {Object}
	 * @api public
	 */
	Rule.prototype.toJSON = function () {
	    var style = {}

	    for (var prop in this.style) {
	        var value = this.style[prop]
	        var type = typeof value
	        if (type == 'string' || type == 'number') {
	            style[prop] = value
	        }
	    }

	    return style
	}

	/**
	 * Indent a string.
	 *
	 * @param {Number} level
	 * @param {String} str
	 * @return {String}
	 */
	function indent(level, str) {
	    var indentStr = ''
	    for (var i = 0; i < level; i++) indentStr += Rule.INDENTATION
	    return indentStr + str
	}


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	/**
	 * Registered plugins.
	 *
	 * @type {Array}
	 * @api public
	 */
	exports.registry = []

	/**
	 * Register plugin. Passed function will be invoked with a rule instance.
	 *
	 * @param {Function} fn
	 * @api public
	 */
	exports.use = function (fn) {
	    exports.registry.push(fn)
	}

	/**
	 * Execute all registered plugins.
	 *
	 * @param {Rule} rule
	 * @api private
	 */
	exports.run = function (rule) {
	    for (var i = 0; i < exports.registry.length; i++) {
	        exports.registry[i](rule)
	    }
	}


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = React;

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var Color = _interopRequire(__webpack_require__(41));

	var colors = _interopRequire(__webpack_require__(35));

	module.exports = {
	  container: {
	    display: "flex",
	    flexDirection: "column",
	    height: "100%",
	    background: colors.white,
	    border: "1px solid " + colors.gainsboroLight,
	    boxShadow: "0px 3px 4px 0 " + Color(colors.grapeTypo).alpha(0.5).hslString()
	  }
	};

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var webColors = _interopRequire(__webpack_require__(36));

	module.exports = {
	  container: {
	    margin: 0,
	    padding: 0,
	    overflowX: "visible",
	    whiteSpace: "nowrap",
	    background: webColors.roomHeaderBackground,
	    height: 27
	  }
	};

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var React = _interopRequire(__webpack_require__(10));

	var useSheet = _interopRequire(__webpack_require__(17));

	var tabsStyle = _interopRequire(__webpack_require__(12));

	var Tab = _interopRequire(__webpack_require__(28));

	/**
	 * Tabs container.
	 */
	module.exports = React.createClass({
	  displayName: "Tabs",

	  mixins: [useSheet(tabsStyle)],

	  render: function render() {
	    var classes = this.sheet.classes;
	    var _props = this.props;
	    var data = _props.data;
	    var select = _props.select;

	    var tabs = data.map(function (item) {
	      return React.createElement(Tab, _extends({}, item, { select: select, key: item.service || "all" }));
	    });

	    return React.createElement(
	      "ul",
	      { className: classes.container },
	      tabs
	    );
	  }
	});

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var React = _interopRequire(__webpack_require__(10));

	var useSheet = _interopRequire(__webpack_require__(17));

	var emptyStyle = _interopRequire(__webpack_require__(29));

	/**
	 * Display information when list is empty
	 */
	module.exports = React.createClass({
	  displayName: "Empty",

	  mixins: [useSheet(emptyStyle)],

	  render: function render() {
	    var classes = this.sheet.classes;

	    return React.createElement(
	      "div",
	      { className: classes.container },
	      React.createElement(
	        "div",
	        { className: classes.info },
	        "Nothing found."
	      )
	    );
	  }
	});

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var All = _interopRequire(__webpack_require__(30));

	exports.all = All;

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	/**
	 * Get sections based data structure.
	 *
	 * {
	 *   label: 'Google drive',
	 *   service: 'googledrive',
	 *   icon: 'file',
	 *   results: [
	 *     {
	 *       id: '10',
	 *       type: 'file',
	 *       highlighted: '1. Tagging+<b>GitHub.mp4</b>',
	 *       info: '/UberGrape/ChatGrape/...',
	 *       date: ...
	 *     }
	 *   ]
	 * }
	 */
	exports.getSections = getSections;

	/**
	 * Get a section which is currently selected.
	 */
	exports.getSelectedSection = getSelectedSection;

	/**
	 * Mark section as selected. Unmark previously selected one.
	 */
	exports.setSelectedSection = setSelectedSection;

	/**
	 * Get currently focused results object.
	 */
	exports.getFocusedObject = getFocusedObject;

	/**
	 * Get all objects from all sections.
	 */
	exports.getObjects = getObjects;

	/**
	 * Mark a result as focused. Unmark previously focused one.
	 */
	exports.setFocusedObjectAt = setFocusedObjectAt;

	/**
	 * Mark a result as focused. Unmark previously focused one.
	 */
	exports.setFocusedObject = setFocusedObject;

	/**
	 * Get data for tabs representation.
	 */
	exports.getTabs = getTabs;

	/**
	 * Mark a tab at specified index as selected, unmark previously selected one.
	 */
	exports.setSelectedTab = setSelectedTab;
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var find = _interopRequire(__webpack_require__(25));

	// Service/icon map.
	// TODO it should be a service implementation detail.
	var serviceIconMap = {
	  github: "github",
	  googledrive: "file",
	  gcal: "calendar",
	  trello: "trello",
	  dropbox: "dropbox"
	};
	function getSections(data, serviceId) {
	  var sections = [];

	  if (!data) {
	    return sections;
	  } // Group by sections.
	  data.results.forEach(function (result) {
	    if (serviceId && result.service != serviceId) return;

	    var section = findService(sections, result.service);

	    // We have no section for this service yet.
	    if (!section) {
	      var service = findService(data.services, result.service);
	      section = {
	        label: service.label,
	        service: result.service,
	        results: [],
	        icon: serviceIconMap[result.service],
	        selected: false
	      };
	      sections.push(section);
	    }

	    section.results.push({
	      id: result.id,
	      type: result.type,
	      highlighted: result.highlighted,
	      info: result.container,
	      date: result.start,
	      focused: false,
	      detail: result.detail
	    });
	  });

	  // Select first result of the first section.
	  if (sections[0]) sections[0].results[0].focused = true;

	  // Find service within in the original results structure or within
	  // sections structure (id == service).
	  function findService(services, id) {
	    return find(services, function (service) {
	      return service.id == id || service.service == id;
	    });
	  }

	  return sections;
	}

	function getSelectedSection(sections) {
	  return find(sections, function (section) {
	    return section.selected;
	  });
	}

	function setSelectedSection(sections, service) {
	  var curr = getSelectedSection(sections);
	  if (curr) curr.selected = false;
	  if (service) {
	    var next = find(sections, function (section) {
	      return section.service == service;
	    });
	    if (next) next.selected = true;
	  }
	}

	function getFocusedObject(sections) {
	  var ret = undefined;

	  sections.some(function (section) {
	    var focused = find(section.results, function (object) {
	      return object.focused;
	    });
	    if (focused) {
	      ret = focused;
	      return true;
	    }
	    return false;
	  });

	  return ret;
	}

	function getObjects(sections) {
	  var objects = [];
	  sections.forEach(function (section) {
	    return objects = objects.concat(section.results);
	  });
	  return objects;
	}

	function setFocusedObjectAt(sections, service, index) {
	  if (!sections.length) {
	    return;
	  } // Take first service when nothing passed.
	  if (!service) service = sections[0].service;
	  unsetFocusedObject(sections);
	  var section = find(sections, function (section) {
	    return section.service == service;
	  });
	  if (section) section.results[index].focused = true;
	}

	function setFocusedObject(sections, id) {
	  unsetFocusedObject(sections);
	  getObjectById(sections, id).focused = true;
	}

	/**
	 * Mark currently focused object as not focused.
	 */
	function unsetFocusedObject(sections) {
	  var prev = getFocusedObject(sections);
	  if (prev) prev.focused = false;
	}

	/**
	 * Get object by id.
	 */
	function getObjectById(sections, id) {
	  var ret = undefined;

	  sections.some(function (section) {
	    var obj = find(section.results, function (object) {
	      return object.id == id;
	    });
	    if (obj) {
	      ret = obj;
	      return true;
	    }
	    return false;
	  });

	  return ret;
	}
	function getTabs(services, sections, selectedServiceId) {
	  if (!services.length) {
	    return [];
	  }var tabs = services.map(function (service) {
	    return {
	      label: service.label,
	      amount: service.count,
	      service: service.id,
	      selected: selectedServiceId == service.id
	    };
	  });

	  var total = 0;
	  tabs.forEach(function (tab) {
	    return total += tab.amount;
	  });

	  tabs.unshift({
	    label: "All",
	    amount: total,
	    selected: !selectedServiceId
	  });

	  return tabs;
	}

	function setSelectedTab(tabs, index) {
	  tabs.forEach(function (tab) {
	    return tab.selected = false;
	  });
	  tabs[index].selected = true;
	}

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var jss = __webpack_require__(1);

	function useSheet(rules, options) {
	  var refs = 0,
	      sheet;

	  function attach() {
	    if (!sheet)
	      sheet = jss.createStyleSheet(rules, options);

	    sheet.attach();
	  }

	  function detach() {
	    sheet.detach();
	  }

	  function ref() {
	    if (refs === 0)
	      attach();

	    refs++;
	    return sheet;
	  }

	  function deref() {
	    refs--;

	    if (refs === 0)
	      detach();
	  }

	  var Mixin = {
	    componentWillMount: function () {
	      this.sheet = ref();
	    },

	    componentWillUnmount: function () {
	      deref();
	      this.sheet = null;
	    },

	    classSet: function (classNames) {
	      var sheet = this.sheet;

	      return Object
	        .keys(classNames)
	        .filter(function (className) {
	          return classNames[className];
	        })
	        .map(function (className) {
	          return sheet.classes[className] || className;
	        })
	        .join(' ');
	    }
	  };

	  // Support React Hot Loader
	  if (false) {
	    Mixin.componentWillUpdate = function () {
	      if (this.sheet !== sheet) {
	        this.sheet.detach();
	        this.sheet = ref();
	      }
	    };
	  }

	  return Mixin;
	}

	module.exports = useSheet;


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var toString = Object.prototype.toString

	/**
	 * Handle `extend` property.
	 *
	 * @param {Rule} rule
	 * @api public
	 */
	module.exports = function (rule) {
	    var style = rule.style

	    if (!style || !style.extend) return

	    var newStyle = {}

	    ;(function extend(style) {
	        if (toString.call(style.extend) == '[object Array]') {
	            for (var i = 0; i < style.extend.length; i++) {
	                extend(style.extend[i])
	            }
	        } else {
	            for (var prop in style.extend) {
	                if (prop == 'extend') extend(style.extend.extend)
	                else newStyle[prop] = style.extend[prop]
	            }
	        }

	        // Copy base style.
	        for (var prop in style) {
	            if (prop != 'extend') newStyle[prop] = style[prop]
	        }
	    }(style))

	    rule.style = newStyle
	}


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var regExp = /([A-Z])/g

	/**
	 * Allow camel cased property names by converting them back to dasherized.
	 *
	 * @param {Rule} rule
	 * @api public
	 */
	module.exports = function (rule) {
	    var style = rule.style

	    if (!style) return

	    rule.style = {}

	    for (var prop in style) {
	        var value = style[prop]
	        prop = prop
	            .replace(regExp, '-$1')
	            .toLowerCase()
	        rule.style[prop] = value
	    }
	}


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var regExp = /&/gi

	/**
	 * Convert nested rules to separate, remove them from original styles.
	 *
	 * @param {Rule} rule
	 * @api private
	 */
	module.exports = function (rule) {
	    var stylesheet = rule.stylesheet
	    var style = rule.style

	    for (var prop in style) {
	        if (prop[0] == '&') {
	            var selector = prop.replace(regExp, rule.selector)
	            rule.addChild(selector, style[prop], {named: false})
	            delete style[prop]
	        }
	    }
	}


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	// Don't automatically add 'px' to these possibly-unitless properties.
	// Borrowed from jquery.
	var cssNumber = {
	    'column-count': true,
	    'fill-opacity': true,
	    'flex': true,
	    'flex-grow': true,
	    'flex-shrink': true,
	    'font-weight': true,
	    'line-height': true,
	    'opacity': true,
	    'order': true,
	    'orphans': true,
	    'widows': true,
	    'z-index': true,
	    'zoom': true
	}

	/**
	 * Add px to numeric values.
	 *
	 * @param {Rule} rule
	 * @api public
	 */
	module.exports = function (rule) {
	    var style = rule.style

	    if (!style) return

	    for (var prop in style) {
	        if (!cssNumber[prop] && typeof style[prop] == 'number') {
	            style[prop] += 'px'
	        }
	    }
	}


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var vendor = __webpack_require__(43)

	/**
	 * Add vendor prefix to a property name when needed.
	 *
	 * @param {Rule} rule
	 * @api public
	 */
	module.exports = function (rule) {
	    var style = rule.style

	    for (var prop in style) {
	        var value = style[prop]

	        var changeProp = false
	        var supportedProp = vendor.supportedProperty(prop)
	        if (supportedProp && supportedProp !== prop) changeProp = true

	        var changeValue = false
	        var supportedValue = vendor.supportedValue(supportedProp, value)
	        if (supportedValue && supportedValue !== value) changeValue = true

	        if (changeProp || changeValue) {
	            if (changeProp) delete style[prop]
	            style[supportedProp] = supportedValue
	        }
	    }
	}


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var baseClone = _interopRequire(__webpack_require__(37));

	var bindCallback = _interopRequire(__webpack_require__(38));

	var isIterateeCall = _interopRequire(__webpack_require__(39));

	/**
	 * Creates a clone of `value`. If `isDeep` is `true` nested objects are cloned,
	 * otherwise they are assigned by reference. If `customizer` is provided it is
	 * invoked to produce the cloned values. If `customizer` returns `undefined`
	 * cloning is handled by the method instead. The `customizer` is bound to
	 * `thisArg` and invoked with two argument; (value [, index|key, object]).
	 *
	 * **Note:** This method is loosely based on the structured clone algorithm.
	 * The enumerable properties of `arguments` objects and objects created by
	 * constructors other than `Object` are cloned to plain `Object` objects. An
	 * empty object is returned for uncloneable values such as functions, DOM nodes,
	 * Maps, Sets, and WeakMaps. See the [HTML5 specification](http://www.w3.org/TR/html5/infrastructure.html#internal-structured-cloning-algorithm)
	 * for more details.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to clone.
	 * @param {boolean} [isDeep] Specify a deep clone.
	 * @param {Function} [customizer] The function to customize cloning values.
	 * @param {*} [thisArg] The `this` binding of `customizer`.
	 * @returns {*} Returns the cloned value.
	 * @example
	 *
	 * var users = [
	 *   { 'user': 'barney' },
	 *   { 'user': 'fred' }
	 * ];
	 *
	 * var shallow = _.clone(users);
	 * shallow[0] === users[0];
	 * // => true
	 *
	 * var deep = _.clone(users, true);
	 * deep[0] === users[0];
	 * // => false
	 *
	 * // using a customizer callback
	 * var el = _.clone(document.body, function(value) {
	 *   if (_.isElement(value)) {
	 *     return value.cloneNode(false);
	 *   }
	 * });
	 *
	 * el === document.body
	 * // => false
	 * el.nodeName
	 * // => BODY
	 * el.childNodes.length;
	 * // => 0
	 */
	function clone(value, isDeep, customizer, thisArg) {
	  if (isDeep && typeof isDeep != "boolean" && isIterateeCall(value, isDeep, customizer)) {
	    isDeep = false;
	  } else if (typeof isDeep == "function") {
	    thisArg = customizer;
	    customizer = isDeep;
	    isDeep = false;
	  }
	  customizer = typeof customizer == "function" && bindCallback(customizer, thisArg, 1);
	  return baseClone(value, isDeep, customizer);
	}

	module.exports = clone;

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var baseClone = _interopRequire(__webpack_require__(37));

	var bindCallback = _interopRequire(__webpack_require__(38));

	/**
	 * Creates a deep clone of `value`. If `customizer` is provided it is invoked
	 * to produce the cloned values. If `customizer` returns `undefined` cloning
	 * is handled by the method instead. The `customizer` is bound to `thisArg`
	 * and invoked with two argument; (value [, index|key, object]).
	 *
	 * **Note:** This method is loosely based on the structured clone algorithm.
	 * The enumerable properties of `arguments` objects and objects created by
	 * constructors other than `Object` are cloned to plain `Object` objects. An
	 * empty object is returned for uncloneable values such as functions, DOM nodes,
	 * Maps, Sets, and WeakMaps. See the [HTML5 specification](http://www.w3.org/TR/html5/infrastructure.html#internal-structured-cloning-algorithm)
	 * for more details.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to deep clone.
	 * @param {Function} [customizer] The function to customize cloning values.
	 * @param {*} [thisArg] The `this` binding of `customizer`.
	 * @returns {*} Returns the deep cloned value.
	 * @example
	 *
	 * var users = [
	 *   { 'user': 'barney' },
	 *   { 'user': 'fred' }
	 * ];
	 *
	 * var deep = _.cloneDeep(users);
	 * deep[0] === users[0];
	 * // => false
	 *
	 * // using a customizer callback
	 * var el = _.cloneDeep(document.body, function(value) {
	 *   if (_.isElement(value)) {
	 *     return value.cloneNode(true);
	 *   }
	 * });
	 *
	 * el === document.body
	 * // => false
	 * el.nodeName
	 * // => BODY
	 * el.childNodes.length;
	 * // => 20
	 */
	function cloneDeep(value, customizer, thisArg) {
	  customizer = typeof customizer == "function" && bindCallback(customizer, thisArg, 1);
	  return baseClone(value, true, customizer);
	}

	module.exports = cloneDeep;

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var baseCallback = _interopRequire(__webpack_require__(31));

	var baseEach = _interopRequire(__webpack_require__(32));

	var baseFind = _interopRequire(__webpack_require__(33));

	var findIndex = _interopRequire(__webpack_require__(26));

	var isArray = _interopRequire(__webpack_require__(34));

	/**
	 * Iterates over elements of `collection`, returning the first element
	 * `predicate` returns truthy for. The predicate is bound to `thisArg` and
	 * invoked with three arguments; (value, index|key, collection).
	 *
	 * If a property name is provided for `predicate` the created `_.property`
	 * style callback returns the property value of the given element.
	 *
	 * If a value is also provided for `thisArg` the created `_.matchesProperty`
	 * style callback returns `true` for elements that have a matching property
	 * value, else `false`.
	 *
	 * If an object is provided for `predicate` the created `_.matches` style
	 * callback returns `true` for elements that have the properties of the given
	 * object, else `false`.
	 *
	 * @static
	 * @memberOf _
	 * @alias detect
	 * @category Collection
	 * @param {Array|Object|string} collection The collection to search.
	 * @param {Function|Object|string} [predicate=_.identity] The function invoked
	 *  per iteration.
	 * @param {*} [thisArg] The `this` binding of `predicate`.
	 * @returns {*} Returns the matched element, else `undefined`.
	 * @example
	 *
	 * var users = [
	 *   { 'user': 'barney',  'age': 36, 'active': true },
	 *   { 'user': 'fred',    'age': 40, 'active': false },
	 *   { 'user': 'pebbles', 'age': 1,  'active': true }
	 * ];
	 *
	 * _.result(_.find(users, function(chr) {
	 *   return chr.age < 40;
	 * }), 'user');
	 * // => 'barney'
	 *
	 * // using the `_.matches` callback shorthand
	 * _.result(_.find(users, { 'age': 1, 'active': true }), 'user');
	 * // => 'pebbles'
	 *
	 * // using the `_.matchesProperty` callback shorthand
	 * _.result(_.find(users, 'active', false), 'user');
	 * // => 'fred'
	 *
	 * // using the `_.property` callback shorthand
	 * _.result(_.find(users, 'active'), 'user');
	 * // => 'barney'
	 */
	function find(collection, predicate, thisArg) {
	  if (isArray(collection)) {
	    var index = findIndex(collection, predicate, thisArg);
	    return index > -1 ? collection[index] : undefined;
	  }
	  predicate = baseCallback(predicate, thisArg, 3);
	  return baseFind(collection, predicate, baseEach);
	}

	module.exports = find;

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var baseCallback = _interopRequire(__webpack_require__(31));

	/**
	 * This method is like `_.find` except that it returns the index of the first
	 * element `predicate` returns truthy for, instead of the element itself.
	 *
	 * If a property name is provided for `predicate` the created `_.property`
	 * style callback returns the property value of the given element.
	 *
	 * If a value is also provided for `thisArg` the created `_.matchesProperty`
	 * style callback returns `true` for elements that have a matching property
	 * value, else `false`.
	 *
	 * If an object is provided for `predicate` the created `_.matches` style
	 * callback returns `true` for elements that have the properties of the given
	 * object, else `false`.
	 *
	 * @static
	 * @memberOf _
	 * @category Array
	 * @param {Array} array The array to search.
	 * @param {Function|Object|string} [predicate=_.identity] The function invoked
	 *  per iteration.
	 * @param {*} [thisArg] The `this` binding of `predicate`.
	 * @returns {number} Returns the index of the found element, else `-1`.
	 * @example
	 *
	 * var users = [
	 *   { 'user': 'barney',  'active': false },
	 *   { 'user': 'fred',    'active': false },
	 *   { 'user': 'pebbles', 'active': true }
	 * ];
	 *
	 * _.findIndex(users, function(chr) {
	 *   return chr.user == 'barney';
	 * });
	 * // => 0
	 *
	 * // using the `_.matches` callback shorthand
	 * _.findIndex(users, { 'user': 'fred', 'active': false });
	 * // => 1
	 *
	 * // using the `_.matchesProperty` callback shorthand
	 * _.findIndex(users, 'active', false);
	 * // => 0
	 *
	 * // using the `_.property` callback shorthand
	 * _.findIndex(users, 'active');
	 * // => 2
	 */
	function findIndex(array, predicate, thisArg) {
	  var index = -1,
	      length = array ? array.length : 0;

	  predicate = baseCallback(predicate, thisArg, 3);
	  while (++index < length) {
	    if (predicate(array[index], index, array)) {
	      return index;
	    }
	  }
	  return -1;
	}

	module.exports = findIndex;

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var baseToString = _interopRequire(__webpack_require__(40));

	/**
	 * Capitalizes the first character of `string`.
	 *
	 * @static
	 * @memberOf _
	 * @category String
	 * @param {string} [string=''] The string to capitalize.
	 * @returns {string} Returns the capitalized string.
	 * @example
	 *
	 * _.capitalize('fred');
	 * // => 'Fred'
	 */
	function capitalize(string) {
	  string = baseToString(string);
	  return string && string.charAt(0).toUpperCase() + string.slice(1);
	}

	module.exports = capitalize;

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var React = _interopRequire(__webpack_require__(10));

	var useSheet = _interopRequire(__webpack_require__(17));

	var tabStyle = _interopRequire(__webpack_require__(42));

	/**
	 * One tab tab.
	 */
	module.exports = React.createClass({
	  displayName: "Tab",

	  mixins: [useSheet(tabStyle)],

	  render: function render() {
	    var classes = this.sheet.classes;
	    var _props = this.props;
	    var amount = _props.amount;
	    var label = _props.label;
	    var selected = _props.selected;

	    if (amount != null) label += " (" + amount + ")";
	    var className = selected ? classes.containerSelected : classes.container;
	    return React.createElement(
	      "li",
	      { className: className, onMouseDown: this.onMouseDown },
	      label
	    );
	  },

	  onMouseDown: function onMouseDown(e) {
	    // Important!!!
	    // Avoids loosing focus and though caret position in editable.
	    e.preventDefault();
	    this.props.select(this.props.service);
	  }
	});

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	module.exports = {
	  container: {
	    display: "flex",
	    height: "100%",
	    alignItems: "center",
	    justifyContent: "center",
	    flex: 9
	  },

	  info: {}
	};

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var React = _interopRequire(__webpack_require__(10));

	var useSheet = _interopRequire(__webpack_require__(17));

	var allStyle = _interopRequire(__webpack_require__(44));

	var List = _interopRequire(__webpack_require__(45));

	var Detail = _interopRequire(__webpack_require__(46));

	/**
	 * All search results.
	 */
	module.exports = React.createClass({
	  displayName: "All",

	  mixins: [useSheet(allStyle)],

	  render: function render() {
	    var classes = this.sheet.classes;
	    var detail = this.refs.detail;

	    var _ref = this;

	    var props = _ref.props;

	    return React.createElement(
	      "div",
	      { className: classes.column },
	      React.createElement(
	        "div",
	        { className: classes.row },
	        React.createElement(List, _extends({}, props, { className: classes.leftColumn })),
	        React.createElement(Detail, {
	          data: props.focusedObject,
	          height: props.height,
	          className: classes.rightColumn,
	          ref: "detail" })
	      )
	    );
	  }
	});

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var baseMatches = _interopRequire(__webpack_require__(47));

	var baseMatchesProperty = _interopRequire(__webpack_require__(48));

	var baseProperty = _interopRequire(__webpack_require__(49));

	var bindCallback = _interopRequire(__webpack_require__(38));

	var identity = _interopRequire(__webpack_require__(50));

	var isBindable = _interopRequire(__webpack_require__(51));

	/**
	 * The base implementation of `_.callback` which supports specifying the
	 * number of arguments to provide to `func`.
	 *
	 * @private
	 * @param {*} [func=_.identity] The value to convert to a callback.
	 * @param {*} [thisArg] The `this` binding of `func`.
	 * @param {number} [argCount] The number of arguments to provide to `func`.
	 * @returns {Function} Returns the callback.
	 */
	function baseCallback(func, thisArg, argCount) {
	  var type = typeof func;
	  if (type == "function") {
	    return typeof thisArg != "undefined" && isBindable(func) ? bindCallback(func, thisArg, argCount) : func;
	  }
	  if (func == null) {
	    return identity;
	  }
	  if (type == "object") {
	    return baseMatches(func);
	  }
	  return typeof thisArg == "undefined" ? baseProperty(func + "") : baseMatchesProperty(func + "", thisArg);
	}

	module.exports = baseCallback;

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var baseForOwn = _interopRequire(__webpack_require__(52));

	var isLength = _interopRequire(__webpack_require__(53));

	var toObject = _interopRequire(__webpack_require__(54));

	/**
	 * The base implementation of `_.forEach` without support for callback
	 * shorthands and `this` binding.
	 *
	 * @private
	 * @param {Array|Object|string} collection The collection to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Array|Object|string} Returns `collection`.
	 */
	function baseEach(collection, iteratee) {
	  var length = collection ? collection.length : 0;
	  if (!isLength(length)) {
	    return baseForOwn(collection, iteratee);
	  }
	  var index = -1,
	      iterable = toObject(collection);

	  while (++index < length) {
	    if (iteratee(iterable[index], index, iterable) === false) {
	      break;
	    }
	  }
	  return collection;
	}

	module.exports = baseEach;

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * The base implementation of `_.find`, `_.findLast`, `_.findKey`, and `_.findLastKey`,
	 * without support for callback shorthands and `this` binding, which iterates
	 * over `collection` using the provided `eachFunc`.
	 *
	 * @private
	 * @param {Array|Object|string} collection The collection to search.
	 * @param {Function} predicate The function invoked per iteration.
	 * @param {Function} eachFunc The function to iterate over `collection`.
	 * @param {boolean} [retKey] Specify returning the key of the found element
	 *  instead of the element itself.
	 * @returns {*} Returns the found element or its key, else `undefined`.
	 */
	"use strict";

	function baseFind(collection, predicate, eachFunc, retKey) {
	  var result;
	  eachFunc(collection, function (value, key, collection) {
	    if (predicate(value, key, collection)) {
	      result = retKey ? key : value;
	      return false;
	    }
	  });
	  return result;
	}

	module.exports = baseFind;

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var isLength = _interopRequire(__webpack_require__(53));

	var isNative = _interopRequire(__webpack_require__(55));

	var isObjectLike = _interopRequire(__webpack_require__(56));

	/** `Object#toString` result references. */
	var arrayTag = "[object Array]";

	/** Used for native method references. */
	var objectProto = Object.prototype;

	/**
	 * Used to resolve the `toStringTag` of values.
	 * See the [ES spec](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.prototype.tostring)
	 * for more details.
	 */
	var objToString = objectProto.toString;

	/* Native method references for those with the same name as other `lodash` methods. */
	var nativeIsArray = isNative(nativeIsArray = Array.isArray) && nativeIsArray;

	/**
	 * Checks if `value` is classified as an `Array` object.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	 * @example
	 *
	 * _.isArray([1, 2, 3]);
	 * // => true
	 *
	 * _.isArray(function() { return arguments; }());
	 * // => false
	 */
	var isArray = nativeIsArray || function (value) {
	  return isObjectLike(value) && isLength(value.length) && objToString.call(value) == arrayTag || false;
	};

	module.exports = isArray;

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	module.exports = {
	  grapeDark: "#542f59",
	  grapeLight: "#7b477b",
	  grapeTypo: "#2b2231",
	  bittersweetDark: "#e9573f",
	  bittersweetLight: "#fc6e51",
	  princeton: "#ff893b",
	  grassDark: "#6d8f52",
	  grassLight: "#9ccb77",
	  aquaLight: "#4fc1e9",
	  aquaDark: "#3bafda",
	  slate: "#37555f",
	  gold: "#e6c647",
	  gainsboroDark: "#888291",
	  gainsboroLight: "#dad6e0",
	  jet: "#212022",
	  silverDark: "#eeecef",
	  silverLight: "#f8f8f8",
	  white: "#ffffff"
	};

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var colors = _interopRequire(__webpack_require__(35));

	module.exports = {
	  link: colors.aquaLight,
	  button: colors.aquaLight,
	  alertInfo: colors.aquaDark,
	  alertSuccess: colors.grassDark,
	  alertWarning: colors.gold,
	  alertDanger: colors.bittersweetDark,
	  roomHeaderBackground: colors.grapeDark,
	  chatBackground: colors.white,
	  chatContent: colors.silverLight,
	  navigationBackground: colors.silverLight,
	  organisationBackground: colors.grapeDark,
	  searchHighlightColor: "#ffeead"
	};

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var arrayCopy = _interopRequire(__webpack_require__(57));

	var arrayEach = _interopRequire(__webpack_require__(58));

	var baseCopy = _interopRequire(__webpack_require__(59));

	var baseForOwn = _interopRequire(__webpack_require__(52));

	var initCloneArray = _interopRequire(__webpack_require__(60));

	var initCloneByTag = _interopRequire(__webpack_require__(61));

	var initCloneObject = _interopRequire(__webpack_require__(62));

	var isArray = _interopRequire(__webpack_require__(34));

	var isObject = _interopRequire(__webpack_require__(63));

	var keys = _interopRequire(__webpack_require__(64));

	/** `Object#toString` result references. */
	var argsTag = "[object Arguments]",
	    arrayTag = "[object Array]",
	    boolTag = "[object Boolean]",
	    dateTag = "[object Date]",
	    errorTag = "[object Error]",
	    funcTag = "[object Function]",
	    mapTag = "[object Map]",
	    numberTag = "[object Number]",
	    objectTag = "[object Object]",
	    regexpTag = "[object RegExp]",
	    setTag = "[object Set]",
	    stringTag = "[object String]",
	    weakMapTag = "[object WeakMap]";

	var arrayBufferTag = "[object ArrayBuffer]",
	    float32Tag = "[object Float32Array]",
	    float64Tag = "[object Float64Array]",
	    int8Tag = "[object Int8Array]",
	    int16Tag = "[object Int16Array]",
	    int32Tag = "[object Int32Array]",
	    uint8Tag = "[object Uint8Array]",
	    uint8ClampedTag = "[object Uint8ClampedArray]",
	    uint16Tag = "[object Uint16Array]",
	    uint32Tag = "[object Uint32Array]";

	/** Used to identify `toStringTag` values supported by `_.clone`. */
	var cloneableTags = {};
	cloneableTags[argsTag] = cloneableTags[arrayTag] = cloneableTags[arrayBufferTag] = cloneableTags[boolTag] = cloneableTags[dateTag] = cloneableTags[float32Tag] = cloneableTags[float64Tag] = cloneableTags[int8Tag] = cloneableTags[int16Tag] = cloneableTags[int32Tag] = cloneableTags[numberTag] = cloneableTags[objectTag] = cloneableTags[regexpTag] = cloneableTags[stringTag] = cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] = cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
	cloneableTags[errorTag] = cloneableTags[funcTag] = cloneableTags[mapTag] = cloneableTags[setTag] = cloneableTags[weakMapTag] = false;

	/** Used for native method references. */
	var objectProto = Object.prototype;

	/**
	 * Used to resolve the `toStringTag` of values.
	 * See the [ES spec](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.prototype.tostring)
	 * for more details.
	 */
	var objToString = objectProto.toString;

	/**
	 * The base implementation of `_.clone` without support for argument juggling
	 * and `this` binding `customizer` functions.
	 *
	 * @private
	 * @param {*} value The value to clone.
	 * @param {boolean} [isDeep] Specify a deep clone.
	 * @param {Function} [customizer] The function to customize cloning values.
	 * @param {string} [key] The key of `value`.
	 * @param {Object} [object] The object `value` belongs to.
	 * @param {Array} [stackA=[]] Tracks traversed source objects.
	 * @param {Array} [stackB=[]] Associates clones with source counterparts.
	 * @returns {*} Returns the cloned value.
	 */
	function baseClone(value, isDeep, customizer, key, object, stackA, stackB) {
	  var result;
	  if (customizer) {
	    result = object ? customizer(value, key, object) : customizer(value);
	  }
	  if (typeof result != "undefined") {
	    return result;
	  }
	  if (!isObject(value)) {
	    return value;
	  }
	  var isArr = isArray(value);
	  if (isArr) {
	    result = initCloneArray(value);
	    if (!isDeep) {
	      return arrayCopy(value, result);
	    }
	  } else {
	    var tag = objToString.call(value),
	        isFunc = tag == funcTag;

	    if (tag == objectTag || tag == argsTag || isFunc && !object) {
	      result = initCloneObject(isFunc ? {} : value);
	      if (!isDeep) {
	        return baseCopy(value, result, keys(value));
	      }
	    } else {
	      return cloneableTags[tag] ? initCloneByTag(value, tag, isDeep) : object ? value : {};
	    }
	  }
	  // Check for circular references and return corresponding clone.
	  stackA || (stackA = []);
	  stackB || (stackB = []);

	  var length = stackA.length;
	  while (length--) {
	    if (stackA[length] == value) {
	      return stackB[length];
	    }
	  }
	  // Add the source value to the stack of traversed objects and associate it with its clone.
	  stackA.push(value);
	  stackB.push(result);

	  // Recursively populate clone (susceptible to call stack limits).
	  (isArr ? arrayEach : baseForOwn)(value, function (subValue, key) {
	    result[key] = baseClone(subValue, isDeep, customizer, key, value, stackA, stackB);
	  });
	  return result;
	}

	module.exports = baseClone;

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var identity = _interopRequire(__webpack_require__(50));

	/**
	 * A specialized version of `baseCallback` which only supports `this` binding
	 * and specifying the number of arguments to provide to `func`.
	 *
	 * @private
	 * @param {Function} func The function to bind.
	 * @param {*} thisArg The `this` binding of `func`.
	 * @param {number} [argCount] The number of arguments to provide to `func`.
	 * @returns {Function} Returns the callback.
	 */
	function bindCallback(func, thisArg, argCount) {
	  if (typeof func != "function") {
	    return identity;
	  }
	  if (typeof thisArg == "undefined") {
	    return func;
	  }
	  switch (argCount) {
	    case 1:
	      return function (value) {
	        return func.call(thisArg, value);
	      };
	    case 3:
	      return function (value, index, collection) {
	        return func.call(thisArg, value, index, collection);
	      };
	    case 4:
	      return function (accumulator, value, index, collection) {
	        return func.call(thisArg, accumulator, value, index, collection);
	      };
	    case 5:
	      return function (value, other, key, object, source) {
	        return func.call(thisArg, value, other, key, object, source);
	      };
	  }
	  return function () {
	    return func.apply(thisArg, arguments);
	  };
	}

	module.exports = bindCallback;

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var isIndex = _interopRequire(__webpack_require__(65));

	var isLength = _interopRequire(__webpack_require__(53));

	var isObject = _interopRequire(__webpack_require__(63));

	/**
	 * Checks if the provided arguments are from an iteratee call.
	 *
	 * @private
	 * @param {*} value The potential iteratee value argument.
	 * @param {*} index The potential iteratee index or key argument.
	 * @param {*} object The potential iteratee object argument.
	 * @returns {boolean} Returns `true` if the arguments are from an iteratee call, else `false`.
	 */
	function isIterateeCall(value, index, object) {
	  if (!isObject(object)) {
	    return false;
	  }
	  var type = typeof index;
	  if (type == "number") {
	    var length = object.length,
	        prereq = isLength(length) && isIndex(index, length);
	  } else {
	    prereq = type == "string" && index in object;
	  }
	  if (prereq) {
	    var other = object[index];
	    return value === value ? value === other : other !== other;
	  }
	  return false;
	}

	module.exports = isIterateeCall;

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Converts `value` to a string if it is not one. An empty string is returned
	 * for `null` or `undefined` values.
	 *
	 * @private
	 * @param {*} value The value to process.
	 * @returns {string} Returns the string.
	 */
	"use strict";

	function baseToString(value) {
	  if (typeof value == "string") {
	    return value;
	  }
	  return value == null ? "" : value + "";
	}

	module.exports = baseToString;

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	/* MIT license */
	var convert = __webpack_require__(74),
	    string = __webpack_require__(85);

	var Color = function(cssString) {
	  if (cssString instanceof Color) return cssString;
	  if (! (this instanceof Color)) return new Color(cssString);

	   this.values = {
	      rgb: [0, 0, 0],
	      hsl: [0, 0, 0],
	      hsv: [0, 0, 0],
	      hwb: [0, 0, 0],
	      cmyk: [0, 0, 0, 0],
	      alpha: 1
	   }

	   // parse Color() argument
	   if (typeof cssString == "string") {
	      var vals = string.getRgba(cssString);
	      if (vals) {
	         this.setValues("rgb", vals);
	      }
	      else if(vals = string.getHsla(cssString)) {
	         this.setValues("hsl", vals);
	      }
	      else if(vals = string.getHwb(cssString)) {
	         this.setValues("hwb", vals);
	      }
	      else {
	        throw new Error("Unable to parse color from string \"" + cssString + "\"");
	      }
	   }
	   else if (typeof cssString == "object") {
	      var vals = cssString;
	      if(vals["r"] !== undefined || vals["red"] !== undefined) {
	         this.setValues("rgb", vals)
	      }
	      else if(vals["l"] !== undefined || vals["lightness"] !== undefined) {
	         this.setValues("hsl", vals)
	      }
	      else if(vals["v"] !== undefined || vals["value"] !== undefined) {
	         this.setValues("hsv", vals)
	      }
	      else if(vals["w"] !== undefined || vals["whiteness"] !== undefined) {
	         this.setValues("hwb", vals)
	      }
	      else if(vals["c"] !== undefined || vals["cyan"] !== undefined) {
	         this.setValues("cmyk", vals)
	      }
	      else {
	        throw new Error("Unable to parse color from object " + JSON.stringify(cssString));
	      }
	   }
	}

	Color.prototype = {
	   rgb: function (vals) {
	      return this.setSpace("rgb", arguments);
	   },
	   hsl: function(vals) {
	      return this.setSpace("hsl", arguments);
	   },
	   hsv: function(vals) {
	      return this.setSpace("hsv", arguments);
	   },
	   hwb: function(vals) {
	      return this.setSpace("hwb", arguments);
	   },
	   cmyk: function(vals) {
	      return this.setSpace("cmyk", arguments);
	   },

	   rgbArray: function() {
	      return this.values.rgb;
	   },
	   hslArray: function() {
	      return this.values.hsl;
	   },
	   hsvArray: function() {
	      return this.values.hsv;
	   },
	   hwbArray: function() {
	      if (this.values.alpha !== 1) {
	        return this.values.hwb.concat([this.values.alpha])
	      }
	      return this.values.hwb;
	   },
	   cmykArray: function() {
	      return this.values.cmyk;
	   },
	   rgbaArray: function() {
	      var rgb = this.values.rgb;
	      return rgb.concat([this.values.alpha]);
	   },
	   hslaArray: function() {
	      var hsl = this.values.hsl;
	      return hsl.concat([this.values.alpha]);
	   },
	   alpha: function(val) {
	      if (val === undefined) {
	         return this.values.alpha;
	      }
	      this.setValues("alpha", val);
	      return this;
	   },

	   red: function(val) {
	      return this.setChannel("rgb", 0, val);
	   },
	   green: function(val) {
	      return this.setChannel("rgb", 1, val);
	   },
	   blue: function(val) {
	      return this.setChannel("rgb", 2, val);
	   },
	   hue: function(val) {
	      return this.setChannel("hsl", 0, val);
	   },
	   saturation: function(val) {
	      return this.setChannel("hsl", 1, val);
	   },
	   lightness: function(val) {
	      return this.setChannel("hsl", 2, val);
	   },
	   saturationv: function(val) {
	      return this.setChannel("hsv", 1, val);
	   },
	   whiteness: function(val) {
	      return this.setChannel("hwb", 1, val);
	   },
	   blackness: function(val) {
	      return this.setChannel("hwb", 2, val);
	   },
	   value: function(val) {
	      return this.setChannel("hsv", 2, val);
	   },
	   cyan: function(val) {
	      return this.setChannel("cmyk", 0, val);
	   },
	   magenta: function(val) {
	      return this.setChannel("cmyk", 1, val);
	   },
	   yellow: function(val) {
	      return this.setChannel("cmyk", 2, val);
	   },
	   black: function(val) {
	      return this.setChannel("cmyk", 3, val);
	   },

	   hexString: function() {
	      return string.hexString(this.values.rgb);
	   },
	   rgbString: function() {
	      return string.rgbString(this.values.rgb, this.values.alpha);
	   },
	   rgbaString: function() {
	      return string.rgbaString(this.values.rgb, this.values.alpha);
	   },
	   percentString: function() {
	      return string.percentString(this.values.rgb, this.values.alpha);
	   },
	   hslString: function() {
	      return string.hslString(this.values.hsl, this.values.alpha);
	   },
	   hslaString: function() {
	      return string.hslaString(this.values.hsl, this.values.alpha);
	   },
	   hwbString: function() {
	      return string.hwbString(this.values.hwb, this.values.alpha);
	   },
	   keyword: function() {
	      return string.keyword(this.values.rgb, this.values.alpha);
	   },

	   rgbNumber: function() {
	      return (this.values.rgb[0] << 16) | (this.values.rgb[1] << 8) | this.values.rgb[2];
	   },

	   luminosity: function() {
	      // http://www.w3.org/TR/WCAG20/#relativeluminancedef
	      var rgb = this.values.rgb;
	      var lum = [];
	      for (var i = 0; i < rgb.length; i++) {
	         var chan = rgb[i] / 255;
	         lum[i] = (chan <= 0.03928) ? chan / 12.92
	                  : Math.pow(((chan + 0.055) / 1.055), 2.4)
	      }
	      return 0.2126 * lum[0] + 0.7152 * lum[1] + 0.0722 * lum[2];
	   },

	   contrast: function(color2) {
	      // http://www.w3.org/TR/WCAG20/#contrast-ratiodef
	      var lum1 = this.luminosity();
	      var lum2 = color2.luminosity();
	      if (lum1 > lum2) {
	         return (lum1 + 0.05) / (lum2 + 0.05)
	      };
	      return (lum2 + 0.05) / (lum1 + 0.05);
	   },

	   level: function(color2) {
	     var contrastRatio = this.contrast(color2);
	     return (contrastRatio >= 7.1)
	       ? 'AAA'
	       : (contrastRatio >= 4.5)
	        ? 'AA'
	        : '';
	   },

	   dark: function() {
	      // YIQ equation from http://24ways.org/2010/calculating-color-contrast
	      var rgb = this.values.rgb,
	          yiq = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
	   	return yiq < 128;
	   },

	   light: function() {
	      return !this.dark();
	   },

	   negate: function() {
	      var rgb = []
	      for (var i = 0; i < 3; i++) {
	         rgb[i] = 255 - this.values.rgb[i];
	      }
	      this.setValues("rgb", rgb);
	      return this;
	   },

	   lighten: function(ratio) {
	      this.values.hsl[2] += this.values.hsl[2] * ratio;
	      this.setValues("hsl", this.values.hsl);
	      return this;
	   },

	   darken: function(ratio) {
	      this.values.hsl[2] -= this.values.hsl[2] * ratio;
	      this.setValues("hsl", this.values.hsl);
	      return this;
	   },

	   saturate: function(ratio) {
	      this.values.hsl[1] += this.values.hsl[1] * ratio;
	      this.setValues("hsl", this.values.hsl);
	      return this;
	   },

	   desaturate: function(ratio) {
	      this.values.hsl[1] -= this.values.hsl[1] * ratio;
	      this.setValues("hsl", this.values.hsl);
	      return this;
	   },

	   whiten: function(ratio) {
	      this.values.hwb[1] += this.values.hwb[1] * ratio;
	      this.setValues("hwb", this.values.hwb);
	      return this;
	   },

	   blacken: function(ratio) {
	      this.values.hwb[2] += this.values.hwb[2] * ratio;
	      this.setValues("hwb", this.values.hwb);
	      return this;
	   },

	   greyscale: function() {
	      var rgb = this.values.rgb;
	      // http://en.wikipedia.org/wiki/Grayscale#Converting_color_to_grayscale
	      var val = rgb[0] * 0.3 + rgb[1] * 0.59 + rgb[2] * 0.11;
	      this.setValues("rgb", [val, val, val]);
	      return this;
	   },

	   clearer: function(ratio) {
	      this.setValues("alpha", this.values.alpha - (this.values.alpha * ratio));
	      return this;
	   },

	   opaquer: function(ratio) {
	      this.setValues("alpha", this.values.alpha + (this.values.alpha * ratio));
	      return this;
	   },

	   rotate: function(degrees) {
	      var hue = this.values.hsl[0];
	      hue = (hue + degrees) % 360;
	      hue = hue < 0 ? 360 + hue : hue;
	      this.values.hsl[0] = hue;
	      this.setValues("hsl", this.values.hsl);
	      return this;
	   },

	   mix: function(color2, weight) {
	      weight = 1 - (weight == null ? 0.5 : weight);

	      // algorithm from Sass's mix(). Ratio of first color in mix is
	      // determined by the alphas of both colors and the weight
	      var t1 = weight * 2 - 1,
	          d = this.alpha() - color2.alpha();

	      var weight1 = (((t1 * d == -1) ? t1 : (t1 + d) / (1 + t1 * d)) + 1) / 2;
	      var weight2 = 1 - weight1;

	      var rgb = this.rgbArray();
	      var rgb2 = color2.rgbArray();

	      for (var i = 0; i < rgb.length; i++) {
	         rgb[i] = rgb[i] * weight1 + rgb2[i] * weight2;
	      }
	      this.setValues("rgb", rgb);

	      var alpha = this.alpha() * weight + color2.alpha() * (1 - weight);
	      this.setValues("alpha", alpha);

	      return this;
	   },

	   toJSON: function() {
	     return this.rgb();
	   },

	   clone: function() {
	     return new Color(this.rgb());
	   }
	}


	Color.prototype.getValues = function(space) {
	   var vals = {};
	   for (var i = 0; i < space.length; i++) {
	      vals[space[i]] = this.values[space][i];
	   }
	   if (this.values.alpha != 1) {
	      vals["a"] = this.values.alpha;
	   }
	   // {r: 255, g: 255, b: 255, a: 0.4}
	   return vals;
	}

	Color.prototype.setValues = function(space, vals) {
	   var spaces = {
	      "rgb": ["red", "green", "blue"],
	      "hsl": ["hue", "saturation", "lightness"],
	      "hsv": ["hue", "saturation", "value"],
	      "hwb": ["hue", "whiteness", "blackness"],
	      "cmyk": ["cyan", "magenta", "yellow", "black"]
	   };

	   var maxes = {
	      "rgb": [255, 255, 255],
	      "hsl": [360, 100, 100],
	      "hsv": [360, 100, 100],
	      "hwb": [360, 100, 100],
	      "cmyk": [100, 100, 100, 100]
	   };

	   var alpha = 1;
	   if (space == "alpha") {
	      alpha = vals;
	   }
	   else if (vals.length) {
	      // [10, 10, 10]
	      this.values[space] = vals.slice(0, space.length);
	      alpha = vals[space.length];
	   }
	   else if (vals[space[0]] !== undefined) {
	      // {r: 10, g: 10, b: 10}
	      for (var i = 0; i < space.length; i++) {
	        this.values[space][i] = vals[space[i]];
	      }
	      alpha = vals.a;
	   }
	   else if (vals[spaces[space][0]] !== undefined) {
	      // {red: 10, green: 10, blue: 10}
	      var chans = spaces[space];
	      for (var i = 0; i < space.length; i++) {
	        this.values[space][i] = vals[chans[i]];
	      }
	      alpha = vals.alpha;
	   }
	   this.values.alpha = Math.max(0, Math.min(1, (alpha !== undefined ? alpha : this.values.alpha) ));
	   if (space == "alpha") {
	      return;
	   }

	   // cap values of the space prior converting all values
	   for (var i = 0; i < space.length; i++) {
	      var capped = Math.max(0, Math.min(maxes[space][i], this.values[space][i]));
	      this.values[space][i] = Math.round(capped);
	   }

	   // convert to all the other color spaces
	   for (var sname in spaces) {
	      if (sname != space) {
	         this.values[sname] = convert[space][sname](this.values[space])
	      }

	      // cap values
	      for (var i = 0; i < sname.length; i++) {
	         var capped = Math.max(0, Math.min(maxes[sname][i], this.values[sname][i]));
	         this.values[sname][i] = Math.round(capped);
	      }
	   }
	   return true;
	}

	Color.prototype.setSpace = function(space, args) {
	   var vals = args[0];
	   if (vals === undefined) {
	      // color.rgb()
	      return this.getValues(space);
	   }
	   // color.rgb(10, 10, 10)
	   if (typeof vals == "number") {
	      vals = Array.prototype.slice.call(args);
	   }
	   this.setValues(space, vals);
	   return this;
	}

	Color.prototype.setChannel = function(space, index, val) {
	   if (val === undefined) {
	      // color.red()
	      return this.values[space][index];
	   }
	   // color.red(100)
	   this.values[space][index] = val;
	   this.setValues(space, this.values[space]);
	   return this;
	}

	module.exports = Color;


/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var colors = _interopRequire(__webpack_require__(35));

	var webColors = _interopRequire(__webpack_require__(36));

	var Color = _interopRequire(__webpack_require__(41));

	var fonts = _interopRequire(__webpack_require__(66));

	var container = {
	  extend: fonts.small,
	  position: "relative",
	  display: "inline-block",
	  padding: "8px 16px 8px",
	  listStyleType: "none",
	  cursor: "pointer",
	  textTransform: "uppercase",
	  fontWeight: "bold",
	  color: Color(colors.white).alpha(0.5).hslString()
	};

	module.exports = {
	  container: {
	    extend: container,
	    "&:hover": {
	      background: Color(webColors.roomHeaderBackground).lighten(0.2).hslString()
	    }
	  },
	  containerSelected: {
	    extend: container,
	    background: colors.grapeLight,
	    color: colors.white,
	    "&:after": {
	      position: "absolute",
	      top: "100%",
	      left: "50%",
	      content: "\" \"",
	      height: 0,
	      width: 0,
	      border: "6px solid transparent",
	      borderTopColor: colors.grapeLight,
	      marginLeft: "-6px"
	    }
	  }
	};

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	/**
	 * Vendor prefix string for the current browser.
	 *
	 * @type {{js: String, css: String}}
	 * @api public
	 */
	exports.prefix = __webpack_require__(67)

	/**
	 * Test if a property is supported, returns property with vendor
	 * prefix if required, otherwise `false`.
	 *
	 * @param {String} prop
	 * @return {String|Boolean}
	 * @api public
	 */
	exports.supportedProperty = __webpack_require__(68)

	/**
	 * Returns prefixed value if needed. Returns `false` if value is not supported.
	 *
	 * @param {String} property
	 * @param {String} value
	 * @return {String|Boolean}
	 * @api public
	 */
	 exports.supportedValue = __webpack_require__(69)


/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	module.exports = {
	  column: {
	    flex: 9,
	    overflow: "hidden"
	  },
	  row: {
	    display: "flex",
	    flexDirection: "row"
	  },
	  leftColumn: {
	    flex: 6,
	    overflowY: "scroll"
	  },
	  rightColumn: {
	    flex: 4,
	    overflowY: "scroll"
	  }
	};

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var React = _interopRequire(__webpack_require__(10));

	var useSheet = _interopRequire(__webpack_require__(17));

	var cloneDeep = _interopRequire(__webpack_require__(24));

	var assign = _interopRequire(__webpack_require__(70));

	var pick = _interopRequire(__webpack_require__(71));

	var Section = _interopRequire(__webpack_require__(72));

	var listStyle = _interopRequire(__webpack_require__(73));

	/**
	 * List for search results.
	 */
	var List = React.createClass({
	  displayName: "List",

	  mixins: [useSheet(listStyle)],

	  getDefaultProps: function getDefaultProps() {
	    return {
	      height: null,
	      className: "",
	      data: null,
	      focus: null,
	      select: null
	    };
	  },

	  render: function render() {
	    var data = this.props.data;

	    var classes = this.sheet.classes;
	    var sections = undefined;

	    if (data.length) {
	      sections = data.map(function (section) {
	        assign(section, pick(this.props, "focus", "select"));
	        return React.createElement(Section, _extends({}, section, { key: section.service }));
	      }, this);
	    }

	    var style = {
	      height: "" + this.props.height + "px"
	    };

	    return React.createElement(
	      "div",
	      {
	        className: "" + classes.container + " " + this.props.className,
	        style: style
	      },
	      sections
	    );
	  }
	});

	module.exports = List;

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var React = _interopRequire(__webpack_require__(10));

	var useSheet = _interopRequire(__webpack_require__(17));

	var dotpather = _interopRequire(__webpack_require__(86));

	var detailStyle = _interopRequire(__webpack_require__(75));

	var getImageUrl = dotpather("preview.image.url");

	/**
	 * Detail view for objects.
	 */
	module.exports = React.createClass({
	  displayName: "Detail",

	  mixins: [useSheet(detailStyle)],

	  getDefaultProps: function getDefaultProps() {
	    return {
	      height: null,
	      className: "",
	      data: null
	    };
	  },

	  render: function render() {
	    var classes = this.sheet.classes;

	    var data = this.props.data.detail || {};
	    var previewUrl = getImageUrl(data);
	    var previewStyle = undefined;
	    if (previewUrl) {
	      previewStyle = {
	        backgroundImage: "url(" + previewUrl + ")"
	      };
	    }

	    var style = {
	      height: "" + this.props.height + "px"
	    };

	    return React.createElement(
	      "div",
	      { className: "" + classes.container + " " + this.props.className, style: style },
	      React.createElement("div", { className: classes.preview, style: previewStyle }),
	      React.createElement(
	        "div",
	        { className: classes.contentWrapper },
	        React.createElement(
	          "h2",
	          { className: classes.title },
	          data.title
	        ),
	        React.createElement(
	          "h3",
	          { className: classes.subtitle },
	          data.subtitle
	        ),
	        React.createElement(
	          "p",
	          { className: classes.description },
	          data.description
	        )
	      )
	    );
	  }
	});

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var baseIsMatch = _interopRequire(__webpack_require__(76));

	var isStrictComparable = _interopRequire(__webpack_require__(77));

	var keys = _interopRequire(__webpack_require__(64));

	/** Used for native method references. */
	var objectProto = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/**
	 * The base implementation of `_.matches` which does not clone `source`.
	 *
	 * @private
	 * @param {Object} source The object of property values to match.
	 * @returns {Function} Returns the new function.
	 */
	function baseMatches(source) {
	  var props = keys(source),
	      length = props.length;

	  if (length == 1) {
	    var key = props[0],
	        value = source[key];

	    if (isStrictComparable(value)) {
	      return function (object) {
	        return object != null && object[key] === value && hasOwnProperty.call(object, key);
	      };
	    }
	  }
	  var values = Array(length),
	      strictCompareFlags = Array(length);

	  while (length--) {
	    value = source[props[length]];
	    values[length] = value;
	    strictCompareFlags[length] = isStrictComparable(value);
	  }
	  return function (object) {
	    return baseIsMatch(object, props, values, strictCompareFlags);
	  };
	}

	module.exports = baseMatches;

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var baseIsEqual = _interopRequire(__webpack_require__(78));

	var isStrictComparable = _interopRequire(__webpack_require__(77));

	/**
	 * The base implementation of `_.matchesProperty` which does not coerce `key`
	 * to a string.
	 *
	 * @private
	 * @param {string} key The key of the property to get.
	 * @param {*} value The value to compare.
	 * @returns {Function} Returns the new function.
	 */
	function baseMatchesProperty(key, value) {
	  if (isStrictComparable(value)) {
	    return function (object) {
	      return object != null && object[key] === value;
	    };
	  }
	  return function (object) {
	    return object != null && baseIsEqual(value, object[key], null, true);
	  };
	}

	module.exports = baseMatchesProperty;

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * The base implementation of `_.property` which does not coerce `key` to a string.
	 *
	 * @private
	 * @param {string} key The key of the property to get.
	 * @returns {Function} Returns the new function.
	 */
	"use strict";

	function baseProperty(key) {
	  return function (object) {
	    return object == null ? undefined : object[key];
	  };
	}

	module.exports = baseProperty;

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * This method returns the first argument provided to it.
	 *
	 * @static
	 * @memberOf _
	 * @category Utility
	 * @param {*} value Any value.
	 * @returns {*} Returns `value`.
	 * @example
	 *
	 * var object = { 'user': 'fred' };
	 *
	 * _.identity(object) === object;
	 * // => true
	 */
	"use strict";

	function identity(value) {
	  return value;
	}

	module.exports = identity;

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var baseSetData = _interopRequire(__webpack_require__(79));

	var isNative = _interopRequire(__webpack_require__(55));

	var support = _interopRequire(__webpack_require__(80));

	/** Used to detect named functions. */
	var reFuncName = /^\s*function[ \n\r\t]+\w/;

	/** Used to detect functions containing a `this` reference. */
	var reThis = /\bthis\b/;

	/** Used to resolve the decompiled source of functions. */
	var fnToString = Function.prototype.toString;

	/**
	 * Checks if `func` is eligible for `this` binding.
	 *
	 * @private
	 * @param {Function} func The function to check.
	 * @returns {boolean} Returns `true` if `func` is eligible, else `false`.
	 */
	function isBindable(func) {
	  var result = !(support.funcNames ? func.name : support.funcDecomp);

	  if (!result) {
	    var source = fnToString.call(func);
	    if (!support.funcNames) {
	      result = !reFuncName.test(source);
	    }
	    if (!result) {
	      // Check if `func` references the `this` keyword and store the result.
	      result = reThis.test(source) || isNative(func);
	      baseSetData(func, result);
	    }
	  }
	  return result;
	}

	module.exports = isBindable;

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var baseFor = _interopRequire(__webpack_require__(81));

	var keys = _interopRequire(__webpack_require__(64));

	/**
	 * The base implementation of `_.forOwn` without support for callback
	 * shorthands and `this` binding.
	 *
	 * @private
	 * @param {Object} object The object to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Object} Returns `object`.
	 */
	function baseForOwn(object, iteratee) {
	  return baseFor(object, iteratee, keys);
	}

	module.exports = baseForOwn;

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Used as the maximum length of an array-like value.
	 * See the [ES spec](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-number.max_safe_integer)
	 * for more details.
	 */
	"use strict";

	var MAX_SAFE_INTEGER = Math.pow(2, 53) - 1;

	/**
	 * Checks if `value` is a valid array-like length.
	 *
	 * **Note:** This function is based on ES `ToLength`. See the
	 * [ES spec](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength)
	 * for more details.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
	 */
	function isLength(value) {
	  return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
	}

	module.exports = isLength;

/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var isObject = _interopRequire(__webpack_require__(63));

	/**
	 * Converts `value` to an object if it is not one.
	 *
	 * @private
	 * @param {*} value The value to process.
	 * @returns {Object} Returns the object.
	 */
	function toObject(value) {
	  return isObject(value) ? value : Object(value);
	}

	module.exports = toObject;

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var escapeRegExp = _interopRequire(__webpack_require__(82));

	var isObjectLike = _interopRequire(__webpack_require__(56));

	/** `Object#toString` result references. */
	var funcTag = "[object Function]";

	/** Used to detect host constructors (Safari > 5). */
	var reHostCtor = /^\[object .+?Constructor\]$/;

	/** Used for native method references. */
	var objectProto = Object.prototype;

	/** Used to resolve the decompiled source of functions. */
	var fnToString = Function.prototype.toString;

	/**
	 * Used to resolve the `toStringTag` of values.
	 * See the [ES spec](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.prototype.tostring)
	 * for more details.
	 */
	var objToString = objectProto.toString;

	/** Used to detect if a method is native. */
	var reNative = RegExp("^" + escapeRegExp(objToString).replace(/toString|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$");

	/**
	 * Checks if `value` is a native function.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a native function, else `false`.
	 * @example
	 *
	 * _.isNative(Array.prototype.push);
	 * // => true
	 *
	 * _.isNative(_);
	 * // => false
	 */
	function isNative(value) {
	  if (value == null) {
	    return false;
	  }
	  if (objToString.call(value) == funcTag) {
	    return reNative.test(fnToString.call(value));
	  }
	  return isObjectLike(value) && reHostCtor.test(value) || false;
	}

	module.exports = isNative;

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Checks if `value` is object-like.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 */
	"use strict";

	function isObjectLike(value) {
	  return value && typeof value == "object" || false;
	}

	module.exports = isObjectLike;

/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copies the values of `source` to `array`.
	 *
	 * @private
	 * @param {Array} source The array to copy values from.
	 * @param {Array} [array=[]] The array to copy values to.
	 * @returns {Array} Returns `array`.
	 */
	"use strict";

	function arrayCopy(source, array) {
	  var index = -1,
	      length = source.length;

	  array || (array = Array(length));
	  while (++index < length) {
	    array[index] = source[index];
	  }
	  return array;
	}

	module.exports = arrayCopy;

/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * A specialized version of `_.forEach` for arrays without support for callback
	 * shorthands or `this` binding.
	 *
	 * @private
	 * @param {Array} array The array to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Array} Returns `array`.
	 */
	"use strict";

	function arrayEach(array, iteratee) {
	  var index = -1,
	      length = array.length;

	  while (++index < length) {
	    if (iteratee(array[index], index, array) === false) {
	      break;
	    }
	  }
	  return array;
	}

	module.exports = arrayEach;

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copies the properties of `source` to `object`.
	 *
	 * @private
	 * @param {Object} source The object to copy properties from.
	 * @param {Object} [object={}] The object to copy properties to.
	 * @param {Array} props The property names to copy.
	 * @returns {Object} Returns `object`.
	 */
	"use strict";

	function baseCopy(source, object, props) {
	  if (!props) {
	    props = object;
	    object = {};
	  }
	  var index = -1,
	      length = props.length;

	  while (++index < length) {
	    var key = props[index];
	    object[key] = source[key];
	  }
	  return object;
	}

	module.exports = baseCopy;

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	/** Used for native method references. */
	"use strict";

	var objectProto = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/**
	 * Initializes an array clone.
	 *
	 * @private
	 * @param {Array} array The array to clone.
	 * @returns {Array} Returns the initialized clone.
	 */
	function initCloneArray(array) {
	  var length = array.length,
	      result = new array.constructor(length);

	  // Add array properties assigned by `RegExp#exec`.
	  if (length && typeof array[0] == "string" && hasOwnProperty.call(array, "index")) {
	    result.index = array.index;
	    result.input = array.input;
	  }
	  return result;
	}

	module.exports = initCloneArray;

/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var bufferClone = _interopRequire(__webpack_require__(84));

	/** `Object#toString` result references. */
	var boolTag = "[object Boolean]",
	    dateTag = "[object Date]",
	    numberTag = "[object Number]",
	    regexpTag = "[object RegExp]",
	    stringTag = "[object String]";

	var arrayBufferTag = "[object ArrayBuffer]",
	    float32Tag = "[object Float32Array]",
	    float64Tag = "[object Float64Array]",
	    int8Tag = "[object Int8Array]",
	    int16Tag = "[object Int16Array]",
	    int32Tag = "[object Int32Array]",
	    uint8Tag = "[object Uint8Array]",
	    uint8ClampedTag = "[object Uint8ClampedArray]",
	    uint16Tag = "[object Uint16Array]",
	    uint32Tag = "[object Uint32Array]";

	/** Used to match `RegExp` flags from their coerced string values. */
	var reFlags = /\w*$/;

	/**
	 * Initializes an object clone based on its `toStringTag`.
	 *
	 * **Note:** This function only supports cloning values with tags of
	 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
	 *
	 *
	 * @private
	 * @param {Object} object The object to clone.
	 * @param {string} tag The `toStringTag` of the object to clone.
	 * @param {boolean} [isDeep] Specify a deep clone.
	 * @returns {Object} Returns the initialized clone.
	 */
	function initCloneByTag(object, tag, isDeep) {
	  var Ctor = object.constructor;
	  switch (tag) {
	    case arrayBufferTag:
	      return bufferClone(object);

	    case boolTag:
	    case dateTag:
	      return new Ctor(+object);

	    case float32Tag:case float64Tag:
	    case int8Tag:case int16Tag:case int32Tag:
	    case uint8Tag:case uint8ClampedTag:case uint16Tag:case uint32Tag:
	      var buffer = object.buffer;
	      return new Ctor(isDeep ? bufferClone(buffer) : buffer, object.byteOffset, object.length);

	    case numberTag:
	    case stringTag:
	      return new Ctor(object);

	    case regexpTag:
	      var result = new Ctor(object.source, reFlags.exec(object));
	      result.lastIndex = object.lastIndex;
	  }
	  return result;
	}

	module.exports = initCloneByTag;

/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Initializes an object clone.
	 *
	 * @private
	 * @param {Object} object The object to clone.
	 * @returns {Object} Returns the initialized clone.
	 */
	"use strict";

	function initCloneObject(object) {
	  var Ctor = object.constructor;
	  if (!(typeof Ctor == "function" && Ctor instanceof Ctor)) {
	    Ctor = Object;
	  }
	  return new Ctor();
	}

	module.exports = initCloneObject;

/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Checks if `value` is the language type of `Object`.
	 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	 *
	 * **Note:** See the [ES5 spec](https://es5.github.io/#x8) for more details.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
	 * @example
	 *
	 * _.isObject({});
	 * // => true
	 *
	 * _.isObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isObject(1);
	 * // => false
	 */
	"use strict";

	function isObject(value) {
	  // Avoid a V8 JIT bug in Chrome 19-20.
	  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
	  var type = typeof value;
	  return type == "function" || value && type == "object" || false;
	}

	module.exports = isObject;

/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var isLength = _interopRequire(__webpack_require__(53));

	var isNative = _interopRequire(__webpack_require__(55));

	var isObject = _interopRequire(__webpack_require__(63));

	var shimKeys = _interopRequire(__webpack_require__(83));

	/* Native method references for those with the same name as other `lodash` methods. */
	var nativeKeys = isNative(nativeKeys = Object.keys) && nativeKeys;

	/**
	 * Creates an array of the own enumerable property names of `object`.
	 *
	 * **Note:** Non-object values are coerced to objects. See the
	 * [ES spec](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.keys)
	 * for more details.
	 *
	 * @static
	 * @memberOf _
	 * @category Object
	 * @param {Object} object The object to inspect.
	 * @returns {Array} Returns the array of property names.
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 *   this.b = 2;
	 * }
	 *
	 * Foo.prototype.c = 3;
	 *
	 * _.keys(new Foo);
	 * // => ['a', 'b'] (iteration order is not guaranteed)
	 *
	 * _.keys('hi');
	 * // => ['0', '1']
	 */
	var keys = !nativeKeys ? shimKeys : function (object) {
	  if (object) {
	    var Ctor = object.constructor,
	        length = object.length;
	  }
	  if (typeof Ctor == "function" && Ctor.prototype === object || typeof object != "function" && (length && isLength(length))) {
	    return shimKeys(object);
	  }
	  return isObject(object) ? nativeKeys(object) : [];
	};

	module.exports = keys;

/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Used as the maximum length of an array-like value.
	 * See the [ES spec](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-number.max_safe_integer)
	 * for more details.
	 */
	"use strict";

	var MAX_SAFE_INTEGER = Math.pow(2, 53) - 1;

	/**
	 * Checks if `value` is a valid array-like index.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
	 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
	 */
	function isIndex(value, length) {
	  value = +value;
	  length = length == null ? MAX_SAFE_INTEGER : length;
	  return value > -1 && value % 1 == 0 && value < length;
	}

	module.exports = isIndex;

/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var base = 13;

	function calc(fontSize, lineHeight) {
	  return {
	    fontSize: base * fontSize + "px",
	    lineHeight: base * lineHeight + "px"
	  };
	}

	module.exports = {
	  small: calc(0.75, 0.875),
	  big: calc(1.25, 1.5),
	  bigger: calc(1.6, 1.8),
	  biggest: calc(2, 2.2),
	  normal: calc(1, 1.5)
	};

/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	/**
	 * Export javascript style and css style vendor prefixes.
	 * Based on "transform" support test.
	 */

	var jsCssMap = {
	    Webkit: '-webkit-',
	    Moz: '-moz-',
	    // IE did it wrong again ...
	    ms: '-ms-',
	    O: '-o-'
	}

	var style = document.createElement('p').style
	var testProp = 'Transform'

	for (var js in jsCssMap) {
	    if ((js + testProp) in style) {
	        exports.js = js
	        exports.css = jsCssMap[js]
	        break
	    }
	}


/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var prefix = __webpack_require__(67)
	var camelize = __webpack_require__(87)

	var el = document.createElement('p')

	/**
	 * We test every property on vendor prefix requirement.
	 * Once tested, result is cached. It gives us up to 70% perf boost.
	 * http://jsperf.com/element-style-object-access-vs-plain-object
	 *
	 * Prefill cache with known css properties to reduce amount of
	 * properties we need to feature test at runtime.
	 * http://davidwalsh.name/vendor-prefix
	 */
	var cache = (function() {
	    var computed = window.getComputedStyle(document.documentElement, '')
	    var cache = {}

	    for (var key in computed) {
	        cache[computed[key]] = computed[key]
	    }

	    return cache
	}())

	/**
	 * Test if a property is supported, returns supported property with vendor
	 * prefix if required. Returns `false` if not supported.
	 *
	 * @param {String} prop dash separated
	 * @return {String|Boolean}
	 * @api public
	 */
	module.exports = function (prop) {
	    // We have not tested this prop yet, lets do the test.
	    if (cache[prop] != null) return cache[prop]

	    // Camelization is required because we can't test using
	    // css syntax for e.g. in FF.
	    // Test if property is supported as it is.
	    if (camelize(prop) in el.style) {
	        cache[prop] = prop
	    // Test if property is supported with vendor prefix.
	    } else if ((prefix.js + camelize('-' + prop)) in el.style) {
	        cache[prop] = prefix.css + prop
	    } else {
	        cache[prop] = false
	    }

	    return cache[prop]
	}


/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var prefix = __webpack_require__(67)

	var cache = {}

	var el = document.createElement('p')

	/**
	 * Returns prefixed value if needed. Returns `false` if value is not supported.
	 *
	 * @param {String} property
	 * @param {String} value
	 * @return {String|Boolean}
	 * @api public
	 */
	module.exports = function (property, value) {
	    if (typeof value != 'string' || !isNaN(parseInt(value, 10))) return value

	    var cacheKey = property + value

	    if (cache[cacheKey] != null) return cache[cacheKey]

	    // Test value as it is.
	    el.style[property] = value

	    // Value is supported as it is.
	    if (el.style[property] == value) {
	        cache[cacheKey] = value
	    } else {
	        // Test value with vendor prefix.
	        value = prefix.css + value
	        el.style[property] = value

	        // Value is supported with vendor prefix.
	        if (el.style[property] == value) cache[cacheKey] = value
	    }

	    if (!cache[cacheKey]) cache[cacheKey] = false

	    return cache[cacheKey]
	}


/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var baseAssign = _interopRequire(__webpack_require__(88));

	var createAssigner = _interopRequire(__webpack_require__(89));

	/**
	 * Assigns own enumerable properties of source object(s) to the destination
	 * object. Subsequent sources overwrite property assignments of previous sources.
	 * If `customizer` is provided it is invoked to produce the assigned values.
	 * The `customizer` is bound to `thisArg` and invoked with five arguments;
	 * (objectValue, sourceValue, key, object, source).
	 *
	 * @static
	 * @memberOf _
	 * @alias extend
	 * @category Object
	 * @param {Object} object The destination object.
	 * @param {...Object} [sources] The source objects.
	 * @param {Function} [customizer] The function to customize assigning values.
	 * @param {*} [thisArg] The `this` binding of `customizer`.
	 * @returns {Object} Returns `object`.
	 * @example
	 *
	 * _.assign({ 'user': 'barney' }, { 'age': 40 }, { 'user': 'fred' });
	 * // => { 'user': 'fred', 'age': 40 }
	 *
	 * // using a customizer callback
	 * var defaults = _.partialRight(_.assign, function(value, other) {
	 *   return typeof value == 'undefined' ? other : value;
	 * });
	 *
	 * defaults({ 'user': 'barney' }, { 'age': 36 }, { 'user': 'fred' });
	 * // => { 'user': 'barney', 'age': 36 }
	 */
	var assign = createAssigner(baseAssign);

	module.exports = assign;

/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var baseFlatten = _interopRequire(__webpack_require__(90));

	var bindCallback = _interopRequire(__webpack_require__(38));

	var pickByArray = _interopRequire(__webpack_require__(91));

	var pickByCallback = _interopRequire(__webpack_require__(92));

	/**
	 * Creates an object composed of the picked `object` properties. Property
	 * names may be specified as individual arguments or as arrays of property
	 * names. If `predicate` is provided it is invoked for each property of `object`
	 * picking the properties `predicate` returns truthy for. The predicate is
	 * bound to `thisArg` and invoked with three arguments; (value, key, object).
	 *
	 * @static
	 * @memberOf _
	 * @category Object
	 * @param {Object} object The source object.
	 * @param {Function|...(string|string[])} [predicate] The function invoked per
	 *  iteration or property names to pick, specified as individual property
	 *  names or arrays of property names.
	 * @param {*} [thisArg] The `this` binding of `predicate`.
	 * @returns {Object} Returns the new object.
	 * @example
	 *
	 * var object = { 'user': 'fred', 'age': 40 };
	 *
	 * _.pick(object, 'user');
	 * // => { 'user': 'fred' }
	 *
	 * _.pick(object, _.isString);
	 * // => { 'user': 'fred' }
	 */
	function pick(object, predicate, thisArg) {
	  if (object == null) {
	    return {};
	  }
	  return typeof predicate == "function" ? pickByCallback(object, bindCallback(predicate, thisArg, 3)) : pickByArray(object, baseFlatten(arguments, false, false, 1));
	}

	module.exports = pick;

/***/ },
/* 72 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var React = _interopRequire(__webpack_require__(10));

	var useSheet = _interopRequire(__webpack_require__(17));

	var assign = _interopRequire(__webpack_require__(70));

	var pick = _interopRequire(__webpack_require__(71));

	var sectionStyle = _interopRequire(__webpack_require__(93));

	var Object = _interopRequire(__webpack_require__(94));

	/**
	 * One list section which has a title and list objects.
	 */
	var Section = React.createClass({
	  displayName: "Section",

	  mixins: [useSheet(sectionStyle)],

	  render: function render() {
	    var classes = this.sheet.classes;
	    var _props = this.props;
	    var results = _props.results;
	    var label = _props.label;

	    var objects = results.map(function (result) {
	      assign(result, pick(this.props, "focus", "select", "icon"));
	      return React.createElement(Object, result);
	    }, this);

	    return React.createElement(
	      "section",
	      null,
	      React.createElement(
	        "header",
	        { className: classes.header },
	        label
	      ),
	      objects
	    );
	  }
	});

	module.exports = Section;

/***/ },
/* 73 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	module.exports = {
	  container: {}
	};

/***/ },
/* 74 */
/***/ function(module, exports, __webpack_require__) {

	var conversions = __webpack_require__(95);

	var convert = function() {
	   return new Converter();
	}

	for (var func in conversions) {
	  // export Raw versions
	  convert[func + "Raw"] =  (function(func) {
	    // accept array or plain args
	    return function(arg) {
	      if (typeof arg == "number")
	        arg = Array.prototype.slice.call(arguments);
	      return conversions[func](arg);
	    }
	  })(func);

	  var pair = /(\w+)2(\w+)/.exec(func),
	      from = pair[1],
	      to = pair[2];

	  // export rgb2hsl and ["rgb"]["hsl"]
	  convert[from] = convert[from] || {};

	  convert[from][to] = convert[func] = (function(func) { 
	    return function(arg) {
	      if (typeof arg == "number")
	        arg = Array.prototype.slice.call(arguments);
	      
	      var val = conversions[func](arg);
	      if (typeof val == "string" || val === undefined)
	        return val; // keyword

	      for (var i = 0; i < val.length; i++)
	        val[i] = Math.round(val[i]);
	      return val;
	    }
	  })(func);
	}


	/* Converter does lazy conversion and caching */
	var Converter = function() {
	   this.convs = {};
	};

	/* Either get the values for a space or
	  set the values for a space, depending on args */
	Converter.prototype.routeSpace = function(space, args) {
	   var values = args[0];
	   if (values === undefined) {
	      // color.rgb()
	      return this.getValues(space);
	   }
	   // color.rgb(10, 10, 10)
	   if (typeof values == "number") {
	      values = Array.prototype.slice.call(args);        
	   }

	   return this.setValues(space, values);
	};
	  
	/* Set the values for a space, invalidating cache */
	Converter.prototype.setValues = function(space, values) {
	   this.space = space;
	   this.convs = {};
	   this.convs[space] = values;
	   return this;
	};

	/* Get the values for a space. If there's already
	  a conversion for the space, fetch it, otherwise
	  compute it */
	Converter.prototype.getValues = function(space) {
	   var vals = this.convs[space];
	   if (!vals) {
	      var fspace = this.space,
	          from = this.convs[fspace];
	      vals = convert[fspace][space](from);

	      this.convs[space] = vals;
	   }
	  return vals;
	};

	["rgb", "hsl", "hsv", "cmyk", "keyword"].forEach(function(space) {
	   Converter.prototype[space] = function(vals) {
	      return this.routeSpace(space, arguments);
	   }
	});

	module.exports = convert;

/***/ },
/* 75 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	module.exports = {
	  container: {
	    height: "100%"
	  },
	  preview: {
	    background: "no-repeat cover",
	    height: 150
	  },
	  contentWrapper: {
	    padding: 15
	  },
	  title: {
	    margin: 0
	  },
	  subtitle: {},
	  description: {
	    margin: 0
	  }
	};

/***/ },
/* 76 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var baseIsEqual = _interopRequire(__webpack_require__(78));

	/** Used for native method references. */
	var objectProto = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/**
	 * The base implementation of `_.isMatch` without support for callback
	 * shorthands or `this` binding.
	 *
	 * @private
	 * @param {Object} object The object to inspect.
	 * @param {Array} props The source property names to match.
	 * @param {Array} values The source values to match.
	 * @param {Array} strictCompareFlags Strict comparison flags for source values.
	 * @param {Function} [customizer] The function to customize comparing objects.
	 * @returns {boolean} Returns `true` if `object` is a match, else `false`.
	 */
	function baseIsMatch(object, props, values, strictCompareFlags, customizer) {
	  var length = props.length;
	  if (object == null) {
	    return !length;
	  }
	  var index = -1,
	      noCustomizer = !customizer;

	  while (++index < length) {
	    if (noCustomizer && strictCompareFlags[index] ? values[index] !== object[props[index]] : !hasOwnProperty.call(object, props[index])) {
	      return false;
	    }
	  }
	  index = -1;
	  while (++index < length) {
	    var key = props[index];
	    if (noCustomizer && strictCompareFlags[index]) {
	      var result = hasOwnProperty.call(object, key);
	    } else {
	      var objValue = object[key],
	          srcValue = values[index];

	      result = customizer ? customizer(objValue, srcValue, key) : undefined;
	      if (typeof result == "undefined") {
	        result = baseIsEqual(srcValue, objValue, customizer, true);
	      }
	    }
	    if (!result) {
	      return false;
	    }
	  }
	  return true;
	}

	module.exports = baseIsMatch;

/***/ },
/* 77 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var isObject = _interopRequire(__webpack_require__(63));

	/**
	 * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` if suitable for strict
	 *  equality comparisons, else `false`.
	 */
	function isStrictComparable(value) {
	  return value === value && (value === 0 ? 1 / value > 0 : !isObject(value));
	}

	module.exports = isStrictComparable;

/***/ },
/* 78 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var baseIsEqualDeep = _interopRequire(__webpack_require__(96));

	/**
	 * The base implementation of `_.isEqual` without support for `this` binding
	 * `customizer` functions.
	 *
	 * @private
	 * @param {*} value The value to compare.
	 * @param {*} other The other value to compare.
	 * @param {Function} [customizer] The function to customize comparing values.
	 * @param {boolean} [isWhere] Specify performing partial comparisons.
	 * @param {Array} [stackA] Tracks traversed `value` objects.
	 * @param {Array} [stackB] Tracks traversed `other` objects.
	 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
	 */
	function baseIsEqual(value, other, customizer, isWhere, stackA, stackB) {
	  // Exit early for identical values.
	  if (value === other) {
	    // Treat `+0` vs. `-0` as not equal.
	    return value !== 0 || 1 / value == 1 / other;
	  }
	  var valType = typeof value,
	      othType = typeof other;

	  // Exit early for unlike primitive values.
	  if (valType != "function" && valType != "object" && othType != "function" && othType != "object" || value == null || other == null) {
	    // Return `false` unless both values are `NaN`.
	    return value !== value && other !== other;
	  }
	  return baseIsEqualDeep(value, other, baseIsEqual, customizer, isWhere, stackA, stackB);
	}

	module.exports = baseIsEqual;

/***/ },
/* 79 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var identity = _interopRequire(__webpack_require__(50));

	var metaMap = _interopRequire(__webpack_require__(97));

	/**
	 * The base implementation of `setData` without support for hot loop detection.
	 *
	 * @private
	 * @param {Function} func The function to associate metadata with.
	 * @param {*} data The metadata.
	 * @returns {Function} Returns `func`.
	 */
	var baseSetData = !metaMap ? identity : function (func, data) {
	  metaMap.set(func, data);
	  return func;
	};

	module.exports = baseSetData;

/***/ },
/* 80 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var isNative = _interopRequire(__webpack_require__(55));

	var root = _interopRequire(__webpack_require__(98));

	/** Used to detect functions containing a `this` reference. */
	var reThis = /\bthis\b/;

	/** Used for native method references. */
	var objectProto = Object.prototype;

	/** Used to detect DOM support. */
	var document = (document = root.window) && document.document;

	/** Native method references. */
	var propertyIsEnumerable = objectProto.propertyIsEnumerable;

	/**
	 * An object environment feature flags.
	 *
	 * @static
	 * @memberOf _
	 * @type Object
	 */
	var support = {};

	(function (x) {

	  /**
	   * Detect if functions can be decompiled by `Function#toString`
	   * (all but Firefox OS certified apps, older Opera mobile browsers, and
	   * the PlayStation 3; forced `false` for Windows 8 apps).
	   *
	   * @memberOf _.support
	   * @type boolean
	   */
	  support.funcDecomp = !isNative(root.WinRTError) && reThis.test(function () {
	    return this;
	  });

	  /**
	   * Detect if `Function#name` is supported (all but IE).
	   *
	   * @memberOf _.support
	   * @type boolean
	   */
	  support.funcNames = typeof Function.name == "string";

	  /**
	   * Detect if the DOM is supported.
	   *
	   * @memberOf _.support
	   * @type boolean
	   */
	  try {
	    support.dom = document.createDocumentFragment().nodeType === 11;
	  } catch (e) {
	    support.dom = false;
	  }

	  /**
	   * Detect if `arguments` object indexes are non-enumerable.
	   *
	   * In Firefox < 4, IE < 9, PhantomJS, and Safari < 5.1 `arguments` object
	   * indexes are non-enumerable. Chrome < 25 and Node.js < 0.11.0 treat
	   * `arguments` object indexes as non-enumerable and fail `hasOwnProperty`
	   * checks for indexes that exceed their function's formal parameters with
	   * associated values of `0`.
	   *
	   * @memberOf _.support
	   * @type boolean
	   */
	  try {
	    support.nonEnumArgs = !propertyIsEnumerable.call(arguments, 1);
	  } catch (e) {
	    support.nonEnumArgs = true;
	  }
	})(0, 0);

	module.exports = support;

/***/ },
/* 81 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var toObject = _interopRequire(__webpack_require__(54));

	/**
	 * The base implementation of `baseForIn` and `baseForOwn` which iterates
	 * over `object` properties returned by `keysFunc` invoking `iteratee` for
	 * each property. Iterator functions may exit iteration early by explicitly
	 * returning `false`.
	 *
	 * @private
	 * @param {Object} object The object to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @param {Function} keysFunc The function to get the keys of `object`.
	 * @returns {Object} Returns `object`.
	 */
	function baseFor(object, iteratee, keysFunc) {
	  var index = -1,
	      iterable = toObject(object),
	      props = keysFunc(object),
	      length = props.length;

	  while (++index < length) {
	    var key = props[index];
	    if (iteratee(iterable[key], key, iterable) === false) {
	      break;
	    }
	  }
	  return object;
	}

	module.exports = baseFor;

/***/ },
/* 82 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var baseToString = _interopRequire(__webpack_require__(40));

	/**
	 * Used to match `RegExp` special characters.
	 * See this [article on `RegExp` characters](http://www.regular-expressions.info/characters.html#special)
	 * for more details.
	 */
	var reRegExpChars = /[.*+?^${}()|[\]\/\\]/g,
	    reHasRegExpChars = RegExp(reRegExpChars.source);

	/**
	 * Escapes the `RegExp` special characters "\", "^", "$", ".", "|", "?", "*",
	 * "+", "(", ")", "[", "]", "{" and "}" in `string`.
	 *
	 * @static
	 * @memberOf _
	 * @category String
	 * @param {string} [string=''] The string to escape.
	 * @returns {string} Returns the escaped string.
	 * @example
	 *
	 * _.escapeRegExp('[lodash](https://lodash.com/)');
	 * // => '\[lodash\]\(https://lodash\.com/\)'
	 */
	function escapeRegExp(string) {
	  string = baseToString(string);
	  return string && reHasRegExpChars.test(string) ? string.replace(reRegExpChars, "\\$&") : string;
	}

	module.exports = escapeRegExp;

/***/ },
/* 83 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var isArguments = _interopRequire(__webpack_require__(99));

	var isArray = _interopRequire(__webpack_require__(34));

	var isIndex = _interopRequire(__webpack_require__(65));

	var isLength = _interopRequire(__webpack_require__(53));

	var keysIn = _interopRequire(__webpack_require__(100));

	var support = _interopRequire(__webpack_require__(80));

	/** Used for native method references. */
	var objectProto = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/**
	 * A fallback implementation of `Object.keys` which creates an array of the
	 * own enumerable property names of `object`.
	 *
	 * @private
	 * @param {Object} object The object to inspect.
	 * @returns {Array} Returns the array of property names.
	 */
	function shimKeys(object) {
	  var props = keysIn(object),
	      propsLength = props.length,
	      length = propsLength && object.length;

	  var allowIndexes = length && isLength(length) && (isArray(object) || support.nonEnumArgs && isArguments(object));

	  var index = -1,
	      result = [];

	  while (++index < propsLength) {
	    var key = props[index];
	    if (allowIndexes && isIndex(key, length) || hasOwnProperty.call(object, key)) {
	      result.push(key);
	    }
	  }
	  return result;
	}

	module.exports = shimKeys;

/***/ },
/* 84 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var constant = _interopRequire(__webpack_require__(101));

	var isNative = _interopRequire(__webpack_require__(55));

	var root = _interopRequire(__webpack_require__(98));

	/** Native method references. */
	var ArrayBuffer = isNative(ArrayBuffer = root.ArrayBuffer) && ArrayBuffer,
	    bufferSlice = isNative(bufferSlice = ArrayBuffer && new ArrayBuffer(0).slice) && bufferSlice,
	    floor = Math.floor,
	    Uint8Array = isNative(Uint8Array = root.Uint8Array) && Uint8Array;

	/** Used to clone array buffers. */
	var Float64Array = (function () {
	  // Safari 5 errors when using an array buffer to initialize a typed array
	  // where the array buffer's `byteLength` is not a multiple of the typed
	  // array's `BYTES_PER_ELEMENT`.
	  try {
	    var func = isNative(func = root.Float64Array) && func,
	        result = new func(new ArrayBuffer(10), 0, 1) && func;
	  } catch (e) {}
	  return result;
	})();

	/** Used as the size, in bytes, of each `Float64Array` element. */
	var FLOAT64_BYTES_PER_ELEMENT = Float64Array ? Float64Array.BYTES_PER_ELEMENT : 0;

	/**
	 * Creates a clone of the given array buffer.
	 *
	 * @private
	 * @param {ArrayBuffer} buffer The array buffer to clone.
	 * @returns {ArrayBuffer} Returns the cloned array buffer.
	 */
	function bufferClone(buffer) {
	  return bufferSlice.call(buffer, 0);
	}
	if (!bufferSlice) {
	  // PhantomJS has `ArrayBuffer` and `Uint8Array` but not `Float64Array`.
	  bufferClone = !(ArrayBuffer && Uint8Array) ? constant(null) : function (buffer) {
	    var byteLength = buffer.byteLength,
	        floatLength = Float64Array ? floor(byteLength / FLOAT64_BYTES_PER_ELEMENT) : 0,
	        offset = floatLength * FLOAT64_BYTES_PER_ELEMENT,
	        result = new ArrayBuffer(byteLength);

	    if (floatLength) {
	      var view = new Float64Array(result, 0, floatLength);
	      view.set(new Float64Array(buffer, 0, floatLength));
	    }
	    if (byteLength != offset) {
	      view = new Uint8Array(result, offset);
	      view.set(new Uint8Array(buffer, offset));
	    }
	    return result;
	  };
	}

	module.exports = bufferClone;

/***/ },
/* 85 */
/***/ function(module, exports, __webpack_require__) {

	/* MIT license */
	var colorNames = __webpack_require__(109);

	module.exports = {
	   getRgba: getRgba,
	   getHsla: getHsla,
	   getRgb: getRgb,
	   getHsl: getHsl,
	   getHwb: getHwb,
	   getAlpha: getAlpha,

	   hexString: hexString,
	   rgbString: rgbString,
	   rgbaString: rgbaString,
	   percentString: percentString,
	   percentaString: percentaString,
	   hslString: hslString,
	   hslaString: hslaString,
	   hwbString: hwbString,
	   keyword: keyword
	}

	function getRgba(string) {
	   if (!string) {
	      return;
	   }
	   var abbr =  /^#([a-fA-F0-9]{3})$/,
	       hex =  /^#([a-fA-F0-9]{6})$/,
	       rgba = /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d\.]+)\s*)?\)$/,
	       per = /^rgba?\(\s*([\d\.]+)\%\s*,\s*([\d\.]+)\%\s*,\s*([\d\.]+)\%\s*(?:,\s*([\d\.]+)\s*)?\)$/,
	       keyword = /(\D+)/;

	   var rgb = [0, 0, 0],
	       a = 1,
	       match = string.match(abbr);
	   if (match) {
	      match = match[1];
	      for (var i = 0; i < rgb.length; i++) {
	         rgb[i] = parseInt(match[i] + match[i], 16);
	      }
	   }
	   else if (match = string.match(hex)) {
	      match = match[1];
	      for (var i = 0; i < rgb.length; i++) {
	         rgb[i] = parseInt(match.slice(i * 2, i * 2 + 2), 16);
	      }
	   }
	   else if (match = string.match(rgba)) {
	      for (var i = 0; i < rgb.length; i++) {
	         rgb[i] = parseInt(match[i + 1]);
	      }
	      a = parseFloat(match[4]);
	   }
	   else if (match = string.match(per)) {
	      for (var i = 0; i < rgb.length; i++) {
	         rgb[i] = Math.round(parseFloat(match[i + 1]) * 2.55);
	      }
	      a = parseFloat(match[4]);
	   }
	   else if (match = string.match(keyword)) {
	      if (match[1] == "transparent") {
	         return [0, 0, 0, 0];
	      }
	      rgb = colorNames[match[1]];
	      if (!rgb) {
	         return;
	      }
	   }

	   for (var i = 0; i < rgb.length; i++) {
	      rgb[i] = scale(rgb[i], 0, 255);
	   }
	   if (!a && a != 0) {
	      a = 1;
	   }
	   else {
	      a = scale(a, 0, 1);
	   }
	   rgb[3] = a;
	   return rgb;
	}

	function getHsla(string) {
	   if (!string) {
	      return;
	   }
	   var hsl = /^hsla?\(\s*(\d+)(?:deg)?\s*,\s*([\d\.]+)%\s*,\s*([\d\.]+)%\s*(?:,\s*([\d\.]+)\s*)?\)/;
	   var match = string.match(hsl);
	   if (match) {
	      var h = scale(parseInt(match[1]), 0, 360),
	          s = scale(parseFloat(match[2]), 0, 100),
	          l = scale(parseFloat(match[3]), 0, 100),
	          a = scale(parseFloat(match[4]) || 1, 0, 1);
	      return [h, s, l, a];
	   }
	}

	function getHwb(string) {
	   if (!string) {
	      return;
	   }
	   var hwb = /^hwb\(\s*(\d+)(?:deg)?\s*,\s*([\d\.]+)%\s*,\s*([\d\.]+)%\s*(?:,\s*([\d\.]+)\s*)?\)/;
	   var match = string.match(hwb);
	   if (match) {
	      var h = scale(parseInt(match[1]), 0, 360),
	          w = scale(parseFloat(match[2]), 0, 100),
	          b = scale(parseFloat(match[3]), 0, 100),
	          a = scale(parseFloat(match[4]) || 1, 0, 1);
	      return [h, w, b, a];
	   }
	}

	function getRgb(string) {
	   var rgba = getRgba(string);
	   return rgba && rgba.slice(0, 3);
	}

	function getHsl(string) {
	  var hsla = getHsla(string);
	  return hsla && hsla.slice(0, 3);
	}

	function getAlpha(string) {
	   var vals = getRgba(string);
	   if (vals) {
	      return vals[3];
	   }
	   else if (vals = getHsla(string)) {
	      return vals[3];
	   }
	   else if (vals = getHwb(string)) {
	      return vals[3];
	   }
	}

	// generators
	function hexString(rgb) {
	   return "#" + hexDouble(rgb[0]) + hexDouble(rgb[1])
	              + hexDouble(rgb[2]);
	}

	function rgbString(rgba, alpha) {
	   if (alpha < 1 || (rgba[3] && rgba[3] < 1)) {
	      return rgbaString(rgba, alpha);
	   }
	   return "rgb(" + rgba[0] + ", " + rgba[1] + ", " + rgba[2] + ")";
	}

	function rgbaString(rgba, alpha) {
	   if (alpha === undefined) {
	      alpha = (rgba[3] !== undefined ? rgba[3] : 1);
	   }
	   return "rgba(" + rgba[0] + ", " + rgba[1] + ", " + rgba[2]
	           + ", " + alpha + ")";
	}

	function percentString(rgba, alpha) {
	   if (alpha < 1 || (rgba[3] && rgba[3] < 1)) {
	      return percentaString(rgba, alpha);
	   }
	   var r = Math.round(rgba[0]/255 * 100),
	       g = Math.round(rgba[1]/255 * 100),
	       b = Math.round(rgba[2]/255 * 100);

	   return "rgb(" + r + "%, " + g + "%, " + b + "%)";
	}

	function percentaString(rgba, alpha) {
	   var r = Math.round(rgba[0]/255 * 100),
	       g = Math.round(rgba[1]/255 * 100),
	       b = Math.round(rgba[2]/255 * 100);
	   return "rgba(" + r + "%, " + g + "%, " + b + "%, " + (alpha || rgba[3] || 1) + ")";
	}

	function hslString(hsla, alpha) {
	   if (alpha < 1 || (hsla[3] && hsla[3] < 1)) {
	      return hslaString(hsla, alpha);
	   }
	   return "hsl(" + hsla[0] + ", " + hsla[1] + "%, " + hsla[2] + "%)";
	}

	function hslaString(hsla, alpha) {
	   if (alpha === undefined) {
	      alpha = (hsla[3] !== undefined ? hsla[3] : 1);
	   }
	   return "hsla(" + hsla[0] + ", " + hsla[1] + "%, " + hsla[2] + "%, "
	           + alpha + ")";
	}

	// hwb is a bit different than rgb(a) & hsl(a) since there is no alpha specific syntax
	// (hwb have alpha optional & 1 is default value)
	function hwbString(hwb, alpha) {
	   if (alpha === undefined) {
	      alpha = (hwb[3] !== undefined ? hwb[3] : 1);
	   }
	   return "hwb(" + hwb[0] + ", " + hwb[1] + "%, " + hwb[2] + "%"
	           + (alpha !== undefined && alpha !== 1 ? ", " + alpha : "") + ")";
	}

	function keyword(rgb) {
	  return reverseNames[rgb.slice(0, 3)];
	}

	// helpers
	function scale(num, min, max) {
	   return Math.min(Math.max(min, num), max);
	}

	function hexDouble(num) {
	  var str = num.toString(16).toUpperCase();
	  return (str.length < 2) ? "0" + str : str;
	}


	//create a list of reverse color names
	var reverseNames = {};
	for (var name in colorNames) {
	   reverseNames[colorNames[name]] = name;
	}

/***/ },
/* 86 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = dotpath

	function dotpath(str) {
	  var parts = ('' + str).split('.')
	    , len = parts.length
	  
	  return function parse(obj) {
	    var testKey
	    
	    for(var i = 0; i < len; ++i) {
	      testKey = parts[i]

	      if(!obj) return

	      obj = obj[testKey]
	    }

	    return obj
	  }
	}


/***/ },
/* 87 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var regExp = /[-\s]+(.)?/g

	/**
	 * Convert dash separated strings to camel cased.
	 *
	 * @param {String} str
	 * @return {String}
	 */
	module.exports = function(str) {
	    return str.replace(regExp, toUpper)
	}

	function toUpper(match, c) {
	    return c ? c.toUpperCase() : ''
	}



/***/ },
/* 88 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var baseCopy = _interopRequire(__webpack_require__(59));

	var keys = _interopRequire(__webpack_require__(64));

	/**
	 * The base implementation of `_.assign` without support for argument juggling,
	 * multiple sources, and `this` binding `customizer` functions.
	 *
	 * @private
	 * @param {Object} object The destination object.
	 * @param {Object} source The source object.
	 * @param {Function} [customizer] The function to customize assigning values.
	 * @returns {Object} Returns the destination object.
	 */
	function baseAssign(object, source, customizer) {
	  var props = keys(source);
	  if (!customizer) {
	    return baseCopy(source, object, props);
	  }
	  var index = -1,
	      length = props.length;

	  while (++index < length) {
	    var key = props[index],
	        value = object[key],
	        result = customizer(value, source[key], key, object, source);

	    if ((result === result ? result !== value : value === value) || typeof value == "undefined" && !(key in object)) {
	      object[key] = result;
	    }
	  }
	  return object;
	}

	module.exports = baseAssign;

/***/ },
/* 89 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var bindCallback = _interopRequire(__webpack_require__(38));

	var isIterateeCall = _interopRequire(__webpack_require__(39));

	/**
	 * Creates a function that assigns properties of source object(s) to a given
	 * destination object.
	 *
	 * @private
	 * @param {Function} assigner The function to assign values.
	 * @returns {Function} Returns the new assigner function.
	 */
	function createAssigner(assigner) {
	  return function () {
	    var args = arguments,
	        length = args.length,
	        object = args[0];

	    if (length < 2 || object == null) {
	      return object;
	    }
	    var customizer = args[length - 2],
	        thisArg = args[length - 1],
	        guard = args[3];

	    if (length > 3 && typeof customizer == "function") {
	      customizer = bindCallback(customizer, thisArg, 5);
	      length -= 2;
	    } else {
	      customizer = length > 2 && typeof thisArg == "function" ? thisArg : null;
	      length -= customizer ? 1 : 0;
	    }
	    if (guard && isIterateeCall(args[1], args[2], guard)) {
	      customizer = length == 3 ? null : customizer;
	      length = 2;
	    }
	    var index = 0;
	    while (++index < length) {
	      var source = args[index];
	      if (source) {
	        assigner(object, source, customizer);
	      }
	    }
	    return object;
	  };
	}

	module.exports = createAssigner;

/***/ },
/* 90 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var isArguments = _interopRequire(__webpack_require__(99));

	var isArray = _interopRequire(__webpack_require__(34));

	var isLength = _interopRequire(__webpack_require__(53));

	var isObjectLike = _interopRequire(__webpack_require__(56));

	/**
	 * The base implementation of `_.flatten` with added support for restricting
	 * flattening and specifying the start index.
	 *
	 * @private
	 * @param {Array} array The array to flatten.
	 * @param {boolean} isDeep Specify a deep flatten.
	 * @param {boolean} isStrict Restrict flattening to arrays and `arguments` objects.
	 * @param {number} fromIndex The index to start from.
	 * @returns {Array} Returns the new flattened array.
	 */
	function baseFlatten(array, isDeep, isStrict, fromIndex) {
	  var index = fromIndex - 1,
	      length = array.length,
	      resIndex = -1,
	      result = [];

	  while (++index < length) {
	    var value = array[index];

	    if (isObjectLike(value) && isLength(value.length) && (isArray(value) || isArguments(value))) {
	      if (isDeep) {
	        // Recursively flatten arrays (susceptible to call stack limits).
	        value = baseFlatten(value, isDeep, isStrict, 0);
	      }
	      var valIndex = -1,
	          valLength = value.length;

	      result.length += valLength;
	      while (++valIndex < valLength) {
	        result[++resIndex] = value[valIndex];
	      }
	    } else if (!isStrict) {
	      result[++resIndex] = value;
	    }
	  }
	  return result;
	}

	module.exports = baseFlatten;

/***/ },
/* 91 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var toObject = _interopRequire(__webpack_require__(54));

	/**
	 * A specialized version of `_.pick` that picks `object` properties specified
	 * by the `props` array.
	 *
	 * @private
	 * @param {Object} object The source object.
	 * @param {string[]} props The property names to pick.
	 * @returns {Object} Returns the new object.
	 */
	function pickByArray(object, props) {
	  object = toObject(object);

	  var index = -1,
	      length = props.length,
	      result = {};

	  while (++index < length) {
	    var key = props[index];
	    if (key in object) {
	      result[key] = object[key];
	    }
	  }
	  return result;
	}

	module.exports = pickByArray;

/***/ },
/* 92 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var baseForIn = _interopRequire(__webpack_require__(102));

	/**
	 * A specialized version of `_.pick` that picks `object` properties `predicate`
	 * returns truthy for.
	 *
	 * @private
	 * @param {Object} object The source object.
	 * @param {Function} predicate The function invoked per iteration.
	 * @returns {Object} Returns the new object.
	 */
	function pickByCallback(object, predicate) {
	  var result = {};
	  baseForIn(object, function (value, key, object) {
	    if (predicate(value, key, object)) {
	      result[key] = value;
	    }
	  });
	  return result;
	}

	module.exports = pickByCallback;

/***/ },
/* 93 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var colors = _interopRequire(__webpack_require__(35));

	var fonts = _interopRequire(__webpack_require__(66));

	module.exports = {
	  header: {
	    extend: fonts.small,
	    background: colors.silverDark,
	    padding: "10px 8px 4px 8px",
	    textTransform: "uppercase",
	    color: colors.gainsboroDark
	  }
	};

/***/ },
/* 94 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var React = _interopRequire(__webpack_require__(10));

	var useSheet = _interopRequire(__webpack_require__(17));

	var objectStyle = _interopRequire(__webpack_require__(103));

	/**
	 * One result for the list section.
	 */
	var Object = React.createClass({
	  displayName: "Object",

	  mixins: [useSheet(objectStyle)],

	  render: function render() {
	    var classes = this.sheet.classes;
	    var _props = this.props;
	    var id = _props.id;
	    var focused = _props.focused;
	    var icon = _props.icon;
	    var info = _props.info;
	    var highlighted = _props.highlighted;

	    var containerClassName = focused ? classes.containerFocused : classes.container;
	    var date = undefined;
	    if (this.props.date) {
	      date = React.createElement(
	        "span",
	        { className: classes.date },
	        this.getLocaleDateString()
	      );
	    }
	    // TODO: use svg icons, don't use global selectors.
	    var iconClassNames = "fa fa-" + icon + " " + classes.icon;
	    return React.createElement(
	      "div",
	      { onMouseDown: this.onMouseDown, onMouseOver: this.onMouseOver, className: containerClassName, key: id },
	      React.createElement("span", { className: iconClassNames }),
	      React.createElement("span", { className: classes.name, dangerouslySetInnerHTML: { __html: highlighted } }),
	      React.createElement(
	        "span",
	        { className: classes.info },
	        info
	      ),
	      date
	    );
	  },

	  getLocaleDateString: function getLocaleDateString() {
	    // TODO We need to centralize current locale constant.
	    return this.props.date.toLocaleString("en-US", {
	      day: "numeric",
	      month: "short",
	      year: "numeric",
	      hour: "numeric",
	      minute: "numeric"
	    });
	  },

	  onMouseOver: function onMouseOver() {
	    this.props.focus(this.props.id);
	  },

	  onMouseDown: function onMouseDown(e) {
	    // Important!!!
	    // Avoids loosing focus and though caret position in editable.
	    e.preventDefault();
	    this.props.select(this.props.id);
	  }
	});

	module.exports = Object;

/***/ },
/* 95 */
/***/ function(module, exports, __webpack_require__) {

	/* MIT license */

	module.exports = {
	  rgb2hsl: rgb2hsl,
	  rgb2hsv: rgb2hsv,
	  rgb2hwb: rgb2hwb,
	  rgb2cmyk: rgb2cmyk,
	  rgb2keyword: rgb2keyword,
	  rgb2xyz: rgb2xyz,
	  rgb2lab: rgb2lab,
	  rgb2lch: rgb2lch,

	  hsl2rgb: hsl2rgb,
	  hsl2hsv: hsl2hsv,
	  hsl2hwb: hsl2hwb,
	  hsl2cmyk: hsl2cmyk,
	  hsl2keyword: hsl2keyword,

	  hsv2rgb: hsv2rgb,
	  hsv2hsl: hsv2hsl,
	  hsv2hwb: hsv2hwb,
	  hsv2cmyk: hsv2cmyk,
	  hsv2keyword: hsv2keyword,

	  hwb2rgb: hwb2rgb,
	  hwb2hsl: hwb2hsl,
	  hwb2hsv: hwb2hsv,
	  hwb2cmyk: hwb2cmyk,
	  hwb2keyword: hwb2keyword,

	  cmyk2rgb: cmyk2rgb,
	  cmyk2hsl: cmyk2hsl,
	  cmyk2hsv: cmyk2hsv,
	  cmyk2hwb: cmyk2hwb,
	  cmyk2keyword: cmyk2keyword,

	  keyword2rgb: keyword2rgb,
	  keyword2hsl: keyword2hsl,
	  keyword2hsv: keyword2hsv,
	  keyword2hwb: keyword2hwb,
	  keyword2cmyk: keyword2cmyk,
	  keyword2lab: keyword2lab,
	  keyword2xyz: keyword2xyz,

	  xyz2rgb: xyz2rgb,
	  xyz2lab: xyz2lab,
	  xyz2lch: xyz2lch,

	  lab2xyz: lab2xyz,
	  lab2rgb: lab2rgb,
	  lab2lch: lab2lch,

	  lch2lab: lch2lab,
	  lch2xyz: lch2xyz,
	  lch2rgb: lch2rgb
	}


	function rgb2hsl(rgb) {
	  var r = rgb[0]/255,
	      g = rgb[1]/255,
	      b = rgb[2]/255,
	      min = Math.min(r, g, b),
	      max = Math.max(r, g, b),
	      delta = max - min,
	      h, s, l;

	  if (max == min)
	    h = 0;
	  else if (r == max)
	    h = (g - b) / delta;
	  else if (g == max)
	    h = 2 + (b - r) / delta;
	  else if (b == max)
	    h = 4 + (r - g)/ delta;

	  h = Math.min(h * 60, 360);

	  if (h < 0)
	    h += 360;

	  l = (min + max) / 2;

	  if (max == min)
	    s = 0;
	  else if (l <= 0.5)
	    s = delta / (max + min);
	  else
	    s = delta / (2 - max - min);

	  return [h, s * 100, l * 100];
	}

	function rgb2hsv(rgb) {
	  var r = rgb[0],
	      g = rgb[1],
	      b = rgb[2],
	      min = Math.min(r, g, b),
	      max = Math.max(r, g, b),
	      delta = max - min,
	      h, s, v;

	  if (max == 0)
	    s = 0;
	  else
	    s = (delta/max * 1000)/10;

	  if (max == min)
	    h = 0;
	  else if (r == max)
	    h = (g - b) / delta;
	  else if (g == max)
	    h = 2 + (b - r) / delta;
	  else if (b == max)
	    h = 4 + (r - g) / delta;

	  h = Math.min(h * 60, 360);

	  if (h < 0)
	    h += 360;

	  v = ((max / 255) * 1000) / 10;

	  return [h, s, v];
	}

	function rgb2hwb(rgb) {
	  var r = rgb[0],
	      g = rgb[1],
	      b = rgb[2],
	      h = rgb2hsl(rgb)[0],
	      w = 1/255 * Math.min(r, Math.min(g, b)),
	      b = 1 - 1/255 * Math.max(r, Math.max(g, b));

	  return [h, w * 100, b * 100];
	}

	function rgb2cmyk(rgb) {
	  var r = rgb[0] / 255,
	      g = rgb[1] / 255,
	      b = rgb[2] / 255,
	      c, m, y, k;

	  k = Math.min(1 - r, 1 - g, 1 - b);
	  c = (1 - r - k) / (1 - k) || 0;
	  m = (1 - g - k) / (1 - k) || 0;
	  y = (1 - b - k) / (1 - k) || 0;
	  return [c * 100, m * 100, y * 100, k * 100];
	}

	function rgb2keyword(rgb) {
	  return reverseKeywords[JSON.stringify(rgb)];
	}

	function rgb2xyz(rgb) {
	  var r = rgb[0] / 255,
	      g = rgb[1] / 255,
	      b = rgb[2] / 255;

	  // assume sRGB
	  r = r > 0.04045 ? Math.pow(((r + 0.055) / 1.055), 2.4) : (r / 12.92);
	  g = g > 0.04045 ? Math.pow(((g + 0.055) / 1.055), 2.4) : (g / 12.92);
	  b = b > 0.04045 ? Math.pow(((b + 0.055) / 1.055), 2.4) : (b / 12.92);

	  var x = (r * 0.4124) + (g * 0.3576) + (b * 0.1805);
	  var y = (r * 0.2126) + (g * 0.7152) + (b * 0.0722);
	  var z = (r * 0.0193) + (g * 0.1192) + (b * 0.9505);

	  return [x * 100, y *100, z * 100];
	}

	function rgb2lab(rgb) {
	  var xyz = rgb2xyz(rgb),
	        x = xyz[0],
	        y = xyz[1],
	        z = xyz[2],
	        l, a, b;

	  x /= 95.047;
	  y /= 100;
	  z /= 108.883;

	  x = x > 0.008856 ? Math.pow(x, 1/3) : (7.787 * x) + (16 / 116);
	  y = y > 0.008856 ? Math.pow(y, 1/3) : (7.787 * y) + (16 / 116);
	  z = z > 0.008856 ? Math.pow(z, 1/3) : (7.787 * z) + (16 / 116);

	  l = (116 * y) - 16;
	  a = 500 * (x - y);
	  b = 200 * (y - z);

	  return [l, a, b];
	}

	function rgb2lch(args) {
	  return lab2lch(rgb2lab(args));
	}

	function hsl2rgb(hsl) {
	  var h = hsl[0] / 360,
	      s = hsl[1] / 100,
	      l = hsl[2] / 100,
	      t1, t2, t3, rgb, val;

	  if (s == 0) {
	    val = l * 255;
	    return [val, val, val];
	  }

	  if (l < 0.5)
	    t2 = l * (1 + s);
	  else
	    t2 = l + s - l * s;
	  t1 = 2 * l - t2;

	  rgb = [0, 0, 0];
	  for (var i = 0; i < 3; i++) {
	    t3 = h + 1 / 3 * - (i - 1);
	    t3 < 0 && t3++;
	    t3 > 1 && t3--;

	    if (6 * t3 < 1)
	      val = t1 + (t2 - t1) * 6 * t3;
	    else if (2 * t3 < 1)
	      val = t2;
	    else if (3 * t3 < 2)
	      val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
	    else
	      val = t1;

	    rgb[i] = val * 255;
	  }

	  return rgb;
	}

	function hsl2hsv(hsl) {
	  var h = hsl[0],
	      s = hsl[1] / 100,
	      l = hsl[2] / 100,
	      sv, v;
	  l *= 2;
	  s *= (l <= 1) ? l : 2 - l;
	  v = (l + s) / 2;
	  sv = (2 * s) / (l + s);
	  return [h, sv * 100, v * 100];
	}

	function hsl2hwb(args) {
	  return rgb2hwb(hsl2rgb(args));
	}

	function hsl2cmyk(args) {
	  return rgb2cmyk(hsl2rgb(args));
	}

	function hsl2keyword(args) {
	  return rgb2keyword(hsl2rgb(args));
	}


	function hsv2rgb(hsv) {
	  var h = hsv[0] / 60,
	      s = hsv[1] / 100,
	      v = hsv[2] / 100,
	      hi = Math.floor(h) % 6;

	  var f = h - Math.floor(h),
	      p = 255 * v * (1 - s),
	      q = 255 * v * (1 - (s * f)),
	      t = 255 * v * (1 - (s * (1 - f))),
	      v = 255 * v;

	  switch(hi) {
	    case 0:
	      return [v, t, p];
	    case 1:
	      return [q, v, p];
	    case 2:
	      return [p, v, t];
	    case 3:
	      return [p, q, v];
	    case 4:
	      return [t, p, v];
	    case 5:
	      return [v, p, q];
	  }
	}

	function hsv2hsl(hsv) {
	  var h = hsv[0],
	      s = hsv[1] / 100,
	      v = hsv[2] / 100,
	      sl, l;

	  l = (2 - s) * v;
	  sl = s * v;
	  sl /= (l <= 1) ? l : 2 - l;
	  sl = sl || 0;
	  l /= 2;
	  return [h, sl * 100, l * 100];
	}

	function hsv2hwb(args) {
	  return rgb2hwb(hsv2rgb(args))
	}

	function hsv2cmyk(args) {
	  return rgb2cmyk(hsv2rgb(args));
	}

	function hsv2keyword(args) {
	  return rgb2keyword(hsv2rgb(args));
	}

	// http://dev.w3.org/csswg/css-color/#hwb-to-rgb
	function hwb2rgb(hwb) {
	  var h = hwb[0] / 360,
	      wh = hwb[1] / 100,
	      bl = hwb[2] / 100,
	      ratio = wh + bl,
	      i, v, f, n;

	  // wh + bl cant be > 1
	  if (ratio > 1) {
	    wh /= ratio;
	    bl /= ratio;
	  }

	  i = Math.floor(6 * h);
	  v = 1 - bl;
	  f = 6 * h - i;
	  if ((i & 0x01) != 0) {
	    f = 1 - f;
	  }
	  n = wh + f * (v - wh);  // linear interpolation

	  switch (i) {
	    default:
	    case 6:
	    case 0: r = v; g = n; b = wh; break;
	    case 1: r = n; g = v; b = wh; break;
	    case 2: r = wh; g = v; b = n; break;
	    case 3: r = wh; g = n; b = v; break;
	    case 4: r = n; g = wh; b = v; break;
	    case 5: r = v; g = wh; b = n; break;
	  }

	  return [r * 255, g * 255, b * 255];
	}

	function hwb2hsl(args) {
	  return rgb2hsl(hwb2rgb(args));
	}

	function hwb2hsv(args) {
	  return rgb2hsv(hwb2rgb(args));
	}

	function hwb2cmyk(args) {
	  return rgb2cmyk(hwb2rgb(args));
	}

	function hwb2keyword(args) {
	  return rgb2keyword(hwb2rgb(args));
	}

	function cmyk2rgb(cmyk) {
	  var c = cmyk[0] / 100,
	      m = cmyk[1] / 100,
	      y = cmyk[2] / 100,
	      k = cmyk[3] / 100,
	      r, g, b;

	  r = 1 - Math.min(1, c * (1 - k) + k);
	  g = 1 - Math.min(1, m * (1 - k) + k);
	  b = 1 - Math.min(1, y * (1 - k) + k);
	  return [r * 255, g * 255, b * 255];
	}

	function cmyk2hsl(args) {
	  return rgb2hsl(cmyk2rgb(args));
	}

	function cmyk2hsv(args) {
	  return rgb2hsv(cmyk2rgb(args));
	}

	function cmyk2hwb(args) {
	  return rgb2hwb(cmyk2rgb(args));
	}

	function cmyk2keyword(args) {
	  return rgb2keyword(cmyk2rgb(args));
	}


	function xyz2rgb(xyz) {
	  var x = xyz[0] / 100,
	      y = xyz[1] / 100,
	      z = xyz[2] / 100,
	      r, g, b;

	  r = (x * 3.2406) + (y * -1.5372) + (z * -0.4986);
	  g = (x * -0.9689) + (y * 1.8758) + (z * 0.0415);
	  b = (x * 0.0557) + (y * -0.2040) + (z * 1.0570);

	  // assume sRGB
	  r = r > 0.0031308 ? ((1.055 * Math.pow(r, 1.0 / 2.4)) - 0.055)
	    : r = (r * 12.92);

	  g = g > 0.0031308 ? ((1.055 * Math.pow(g, 1.0 / 2.4)) - 0.055)
	    : g = (g * 12.92);

	  b = b > 0.0031308 ? ((1.055 * Math.pow(b, 1.0 / 2.4)) - 0.055)
	    : b = (b * 12.92);

	  r = Math.min(Math.max(0, r), 1);
	  g = Math.min(Math.max(0, g), 1);
	  b = Math.min(Math.max(0, b), 1);

	  return [r * 255, g * 255, b * 255];
	}

	function xyz2lab(xyz) {
	  var x = xyz[0],
	      y = xyz[1],
	      z = xyz[2],
	      l, a, b;

	  x /= 95.047;
	  y /= 100;
	  z /= 108.883;

	  x = x > 0.008856 ? Math.pow(x, 1/3) : (7.787 * x) + (16 / 116);
	  y = y > 0.008856 ? Math.pow(y, 1/3) : (7.787 * y) + (16 / 116);
	  z = z > 0.008856 ? Math.pow(z, 1/3) : (7.787 * z) + (16 / 116);

	  l = (116 * y) - 16;
	  a = 500 * (x - y);
	  b = 200 * (y - z);

	  return [l, a, b];
	}

	function xyz2lch(args) {
	  return lab2lch(xyz2lab(args));
	}

	function lab2xyz(lab) {
	  var l = lab[0],
	      a = lab[1],
	      b = lab[2],
	      x, y, z, y2;

	  if (l <= 8) {
	    y = (l * 100) / 903.3;
	    y2 = (7.787 * (y / 100)) + (16 / 116);
	  } else {
	    y = 100 * Math.pow((l + 16) / 116, 3);
	    y2 = Math.pow(y / 100, 1/3);
	  }

	  x = x / 95.047 <= 0.008856 ? x = (95.047 * ((a / 500) + y2 - (16 / 116))) / 7.787 : 95.047 * Math.pow((a / 500) + y2, 3);

	  z = z / 108.883 <= 0.008859 ? z = (108.883 * (y2 - (b / 200) - (16 / 116))) / 7.787 : 108.883 * Math.pow(y2 - (b / 200), 3);

	  return [x, y, z];
	}

	function lab2lch(lab) {
	  var l = lab[0],
	      a = lab[1],
	      b = lab[2],
	      hr, h, c;

	  hr = Math.atan2(b, a);
	  h = hr * 360 / 2 / Math.PI;
	  if (h < 0) {
	    h += 360;
	  }
	  c = Math.sqrt(a * a + b * b);
	  return [l, c, h];
	}

	function lab2rgb(args) {
	  return xyz2rgb(lab2xyz(args));
	}

	function lch2lab(lch) {
	  var l = lch[0],
	      c = lch[1],
	      h = lch[2],
	      a, b, hr;

	  hr = h / 360 * 2 * Math.PI;
	  a = c * Math.cos(hr);
	  b = c * Math.sin(hr);
	  return [l, a, b];
	}

	function lch2xyz(args) {
	  return lab2xyz(lch2lab(args));
	}

	function lch2rgb(args) {
	  return lab2rgb(lch2lab(args));
	}

	function keyword2rgb(keyword) {
	  return cssKeywords[keyword];
	}

	function keyword2hsl(args) {
	  return rgb2hsl(keyword2rgb(args));
	}

	function keyword2hsv(args) {
	  return rgb2hsv(keyword2rgb(args));
	}

	function keyword2hwb(args) {
	  return rgb2hwb(keyword2rgb(args));
	}

	function keyword2cmyk(args) {
	  return rgb2cmyk(keyword2rgb(args));
	}

	function keyword2lab(args) {
	  return rgb2lab(keyword2rgb(args));
	}

	function keyword2xyz(args) {
	  return rgb2xyz(keyword2rgb(args));
	}

	var cssKeywords = {
	  aliceblue:  [240,248,255],
	  antiquewhite: [250,235,215],
	  aqua: [0,255,255],
	  aquamarine: [127,255,212],
	  azure:  [240,255,255],
	  beige:  [245,245,220],
	  bisque: [255,228,196],
	  black:  [0,0,0],
	  blanchedalmond: [255,235,205],
	  blue: [0,0,255],
	  blueviolet: [138,43,226],
	  brown:  [165,42,42],
	  burlywood:  [222,184,135],
	  cadetblue:  [95,158,160],
	  chartreuse: [127,255,0],
	  chocolate:  [210,105,30],
	  coral:  [255,127,80],
	  cornflowerblue: [100,149,237],
	  cornsilk: [255,248,220],
	  crimson:  [220,20,60],
	  cyan: [0,255,255],
	  darkblue: [0,0,139],
	  darkcyan: [0,139,139],
	  darkgoldenrod:  [184,134,11],
	  darkgray: [169,169,169],
	  darkgreen:  [0,100,0],
	  darkgrey: [169,169,169],
	  darkkhaki:  [189,183,107],
	  darkmagenta:  [139,0,139],
	  darkolivegreen: [85,107,47],
	  darkorange: [255,140,0],
	  darkorchid: [153,50,204],
	  darkred:  [139,0,0],
	  darksalmon: [233,150,122],
	  darkseagreen: [143,188,143],
	  darkslateblue:  [72,61,139],
	  darkslategray:  [47,79,79],
	  darkslategrey:  [47,79,79],
	  darkturquoise:  [0,206,209],
	  darkviolet: [148,0,211],
	  deeppink: [255,20,147],
	  deepskyblue:  [0,191,255],
	  dimgray:  [105,105,105],
	  dimgrey:  [105,105,105],
	  dodgerblue: [30,144,255],
	  firebrick:  [178,34,34],
	  floralwhite:  [255,250,240],
	  forestgreen:  [34,139,34],
	  fuchsia:  [255,0,255],
	  gainsboro:  [220,220,220],
	  ghostwhite: [248,248,255],
	  gold: [255,215,0],
	  goldenrod:  [218,165,32],
	  gray: [128,128,128],
	  green:  [0,128,0],
	  greenyellow:  [173,255,47],
	  grey: [128,128,128],
	  honeydew: [240,255,240],
	  hotpink:  [255,105,180],
	  indianred:  [205,92,92],
	  indigo: [75,0,130],
	  ivory:  [255,255,240],
	  khaki:  [240,230,140],
	  lavender: [230,230,250],
	  lavenderblush:  [255,240,245],
	  lawngreen:  [124,252,0],
	  lemonchiffon: [255,250,205],
	  lightblue:  [173,216,230],
	  lightcoral: [240,128,128],
	  lightcyan:  [224,255,255],
	  lightgoldenrodyellow: [250,250,210],
	  lightgray:  [211,211,211],
	  lightgreen: [144,238,144],
	  lightgrey:  [211,211,211],
	  lightpink:  [255,182,193],
	  lightsalmon:  [255,160,122],
	  lightseagreen:  [32,178,170],
	  lightskyblue: [135,206,250],
	  lightslategray: [119,136,153],
	  lightslategrey: [119,136,153],
	  lightsteelblue: [176,196,222],
	  lightyellow:  [255,255,224],
	  lime: [0,255,0],
	  limegreen:  [50,205,50],
	  linen:  [250,240,230],
	  magenta:  [255,0,255],
	  maroon: [128,0,0],
	  mediumaquamarine: [102,205,170],
	  mediumblue: [0,0,205],
	  mediumorchid: [186,85,211],
	  mediumpurple: [147,112,219],
	  mediumseagreen: [60,179,113],
	  mediumslateblue:  [123,104,238],
	  mediumspringgreen:  [0,250,154],
	  mediumturquoise:  [72,209,204],
	  mediumvioletred:  [199,21,133],
	  midnightblue: [25,25,112],
	  mintcream:  [245,255,250],
	  mistyrose:  [255,228,225],
	  moccasin: [255,228,181],
	  navajowhite:  [255,222,173],
	  navy: [0,0,128],
	  oldlace:  [253,245,230],
	  olive:  [128,128,0],
	  olivedrab:  [107,142,35],
	  orange: [255,165,0],
	  orangered:  [255,69,0],
	  orchid: [218,112,214],
	  palegoldenrod:  [238,232,170],
	  palegreen:  [152,251,152],
	  paleturquoise:  [175,238,238],
	  palevioletred:  [219,112,147],
	  papayawhip: [255,239,213],
	  peachpuff:  [255,218,185],
	  peru: [205,133,63],
	  pink: [255,192,203],
	  plum: [221,160,221],
	  powderblue: [176,224,230],
	  purple: [128,0,128],
	  rebeccapurple: [102, 51, 153],
	  red:  [255,0,0],
	  rosybrown:  [188,143,143],
	  royalblue:  [65,105,225],
	  saddlebrown:  [139,69,19],
	  salmon: [250,128,114],
	  sandybrown: [244,164,96],
	  seagreen: [46,139,87],
	  seashell: [255,245,238],
	  sienna: [160,82,45],
	  silver: [192,192,192],
	  skyblue:  [135,206,235],
	  slateblue:  [106,90,205],
	  slategray:  [112,128,144],
	  slategrey:  [112,128,144],
	  snow: [255,250,250],
	  springgreen:  [0,255,127],
	  steelblue:  [70,130,180],
	  tan:  [210,180,140],
	  teal: [0,128,128],
	  thistle:  [216,191,216],
	  tomato: [255,99,71],
	  turquoise:  [64,224,208],
	  violet: [238,130,238],
	  wheat:  [245,222,179],
	  white:  [255,255,255],
	  whitesmoke: [245,245,245],
	  yellow: [255,255,0],
	  yellowgreen:  [154,205,50]
	};

	var reverseKeywords = {};
	for (var key in cssKeywords) {
	  reverseKeywords[JSON.stringify(cssKeywords[key])] = key;
	}


/***/ },
/* 96 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var equalArrays = _interopRequire(__webpack_require__(104));

	var equalByTag = _interopRequire(__webpack_require__(105));

	var equalObjects = _interopRequire(__webpack_require__(106));

	var isArray = _interopRequire(__webpack_require__(34));

	var isTypedArray = _interopRequire(__webpack_require__(107));

	/** `Object#toString` result references. */
	var argsTag = "[object Arguments]",
	    arrayTag = "[object Array]",
	    objectTag = "[object Object]";

	/** Used for native method references. */
	var objectProto = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/**
	 * Used to resolve the `toStringTag` of values.
	 * See the [ES spec](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.prototype.tostring)
	 * for more details.
	 */
	var objToString = objectProto.toString;

	/**
	 * A specialized version of `baseIsEqual` for arrays and objects which performs
	 * deep comparisons and tracks traversed objects enabling objects with circular
	 * references to be compared.
	 *
	 * @private
	 * @param {Object} object The object to compare.
	 * @param {Object} other The other object to compare.
	 * @param {Function} equalFunc The function to determine equivalents of values.
	 * @param {Function} [customizer] The function to customize comparing objects.
	 * @param {boolean} [isWhere] Specify performing partial comparisons.
	 * @param {Array} [stackA=[]] Tracks traversed `value` objects.
	 * @param {Array} [stackB=[]] Tracks traversed `other` objects.
	 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
	 */
	function baseIsEqualDeep(object, other, equalFunc, customizer, isWhere, stackA, stackB) {
	  var objIsArr = isArray(object),
	      othIsArr = isArray(other),
	      objTag = arrayTag,
	      othTag = arrayTag;

	  if (!objIsArr) {
	    objTag = objToString.call(object);
	    if (objTag == argsTag) {
	      objTag = objectTag;
	    } else if (objTag != objectTag) {
	      objIsArr = isTypedArray(object);
	    }
	  }
	  if (!othIsArr) {
	    othTag = objToString.call(other);
	    if (othTag == argsTag) {
	      othTag = objectTag;
	    } else if (othTag != objectTag) {
	      othIsArr = isTypedArray(other);
	    }
	  }
	  var objIsObj = objTag == objectTag,
	      othIsObj = othTag == objectTag,
	      isSameTag = objTag == othTag;

	  if (isSameTag && !(objIsArr || objIsObj)) {
	    return equalByTag(object, other, objTag);
	  }
	  var valWrapped = objIsObj && hasOwnProperty.call(object, "__wrapped__"),
	      othWrapped = othIsObj && hasOwnProperty.call(other, "__wrapped__");

	  if (valWrapped || othWrapped) {
	    return equalFunc(valWrapped ? object.value() : object, othWrapped ? other.value() : other, customizer, isWhere, stackA, stackB);
	  }
	  if (!isSameTag) {
	    return false;
	  }
	  // Assume cyclic values are equal.
	  // For more information on detecting circular references see https://es5.github.io/#JO.
	  stackA || (stackA = []);
	  stackB || (stackB = []);

	  var length = stackA.length;
	  while (length--) {
	    if (stackA[length] == object) {
	      return stackB[length] == other;
	    }
	  }
	  // Add `object` and `other` to the stack of traversed objects.
	  stackA.push(object);
	  stackB.push(other);

	  var result = (objIsArr ? equalArrays : equalObjects)(object, other, equalFunc, customizer, isWhere, stackA, stackB);

	  stackA.pop();
	  stackB.pop();

	  return result;
	}

	module.exports = baseIsEqualDeep;

/***/ },
/* 97 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var isNative = _interopRequire(__webpack_require__(55));

	var root = _interopRequire(__webpack_require__(98));

	/** Native method references. */
	var WeakMap = isNative(WeakMap = root.WeakMap) && WeakMap;

	/** Used to store function metadata. */
	var metaMap = WeakMap && new WeakMap();

	module.exports = metaMap;

/***/ },
/* 98 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module, global) {/** Used to determine if values are of the language type `Object`. */
	"use strict";

	var objectTypes = {
	  "function": true,
	  object: true
	};

	/** Detect free variable `exports`. */
	var freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports;

	/** Detect free variable `module`. */
	var freeModule = objectTypes[typeof module] && module && !module.nodeType && module;

	/** Detect free variable `global` from Node.js. */
	var freeGlobal = freeExports && freeModule && typeof global == "object" && global;

	/** Detect free variable `window`. */
	var freeWindow = objectTypes[typeof window] && window;

	/**
	 * Used as a reference to the global object.
	 *
	 * The `this` value is used if it is the global object to avoid Greasemonkey's
	 * restricted `window` object, otherwise the `window` object is used.
	 */
	var root = freeGlobal || freeWindow !== (undefined && undefined.window) && freeWindow || undefined;

	module.exports = root;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(108)(module), (function() { return this; }())))

/***/ },
/* 99 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var isLength = _interopRequire(__webpack_require__(53));

	var isObjectLike = _interopRequire(__webpack_require__(56));

	/** `Object#toString` result references. */
	var argsTag = "[object Arguments]";

	/** Used for native method references. */
	var objectProto = Object.prototype;

	/**
	 * Used to resolve the `toStringTag` of values.
	 * See the [ES spec](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.prototype.tostring)
	 * for more details.
	 */
	var objToString = objectProto.toString;

	/**
	 * Checks if `value` is classified as an `arguments` object.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	 * @example
	 *
	 * _.isArguments(function() { return arguments; }());
	 * // => true
	 *
	 * _.isArguments([1, 2, 3]);
	 * // => false
	 */
	function isArguments(value) {
	  var length = isObjectLike(value) ? value.length : undefined;
	  return isLength(length) && objToString.call(value) == argsTag || false;
	}

	module.exports = isArguments;

/***/ },
/* 100 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var isArguments = _interopRequire(__webpack_require__(99));

	var isArray = _interopRequire(__webpack_require__(34));

	var isIndex = _interopRequire(__webpack_require__(65));

	var isLength = _interopRequire(__webpack_require__(53));

	var isObject = _interopRequire(__webpack_require__(63));

	var support = _interopRequire(__webpack_require__(80));

	/** Used for native method references. */
	var objectProto = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/**
	 * Creates an array of the own and inherited enumerable property names of `object`.
	 *
	 * **Note:** Non-object values are coerced to objects.
	 *
	 * @static
	 * @memberOf _
	 * @category Object
	 * @param {Object} object The object to inspect.
	 * @returns {Array} Returns the array of property names.
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 *   this.b = 2;
	 * }
	 *
	 * Foo.prototype.c = 3;
	 *
	 * _.keysIn(new Foo);
	 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
	 */
	function keysIn(object) {
	  if (object == null) {
	    return [];
	  }
	  if (!isObject(object)) {
	    object = Object(object);
	  }
	  var length = object.length;
	  length = length && isLength(length) && (isArray(object) || support.nonEnumArgs && isArguments(object)) && length || 0;

	  var Ctor = object.constructor,
	      index = -1,
	      isProto = typeof Ctor == "function" && Ctor.prototype === object,
	      result = Array(length),
	      skipIndexes = length > 0;

	  while (++index < length) {
	    result[index] = index + "";
	  }
	  for (var key in object) {
	    if (!(skipIndexes && isIndex(key, length)) && !(key == "constructor" && (isProto || !hasOwnProperty.call(object, key)))) {
	      result.push(key);
	    }
	  }
	  return result;
	}

	module.exports = keysIn;

/***/ },
/* 101 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Creates a function that returns `value`.
	 *
	 * @static
	 * @memberOf _
	 * @category Utility
	 * @param {*} value The value to return from the new function.
	 * @returns {Function} Returns the new function.
	 * @example
	 *
	 * var object = { 'user': 'fred' };
	 * var getter = _.constant(object);
	 *
	 * getter() === object;
	 * // => true
	 */
	"use strict";

	function constant(value) {
	  return function () {
	    return value;
	  };
	}

	module.exports = constant;

/***/ },
/* 102 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var baseFor = _interopRequire(__webpack_require__(81));

	var keysIn = _interopRequire(__webpack_require__(100));

	/**
	 * The base implementation of `_.forIn` without support for callback
	 * shorthands and `this` binding.
	 *
	 * @private
	 * @param {Object} object The object to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Object} Returns `object`.
	 */
	function baseForIn(object, iteratee) {
	  return baseFor(object, iteratee, keysIn);
	}

	module.exports = baseForIn;

/***/ },
/* 103 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var colors = _interopRequire(__webpack_require__(35));

	var fonts = _interopRequire(__webpack_require__(66));

	var utils = _interopRequire(__webpack_require__(110));

	var container = {
	  padding: "5px 7px",
	  color: colors.grapeTypo,
	  cursor: "pointer"
	};

	module.exports = {
	  container: {
	    extend: [container, utils.ellipsis, fonts.normal]
	  },
	  containerFocused: {
	    extend: [container, utils.ellipsis, fonts.normal],
	    color: colors.white,
	    background: colors.grapeLight
	  },
	  name: {},
	  info: {
	    color: colors.gainsboroLight,
	    fontSize: 10,
	    marginLeft: 7
	  },
	  date: {
	    extend: fonts.small,
	    padding: "0 8px",
	    textTransform: "uppercase"
	  },
	  icon: {
	    color: colors.gainsboroDark,
	    paddingRight: 5
	  }
	};

/***/ },
/* 104 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * A specialized version of `baseIsEqualDeep` for arrays with support for
	 * partial deep comparisons.
	 *
	 * @private
	 * @param {Array} array The array to compare.
	 * @param {Array} other The other array to compare.
	 * @param {Function} equalFunc The function to determine equivalents of values.
	 * @param {Function} [customizer] The function to customize comparing arrays.
	 * @param {boolean} [isWhere] Specify performing partial comparisons.
	 * @param {Array} [stackA] Tracks traversed `value` objects.
	 * @param {Array} [stackB] Tracks traversed `other` objects.
	 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
	 */
	"use strict";

	function equalArrays(array, other, equalFunc, customizer, isWhere, stackA, stackB) {
	  var index = -1,
	      arrLength = array.length,
	      othLength = other.length,
	      result = true;

	  if (arrLength != othLength && !(isWhere && othLength > arrLength)) {
	    return false;
	  }
	  // Deep compare the contents, ignoring non-numeric properties.
	  while (result && ++index < arrLength) {
	    var arrValue = array[index],
	        othValue = other[index];

	    result = undefined;
	    if (customizer) {
	      result = isWhere ? customizer(othValue, arrValue, index) : customizer(arrValue, othValue, index);
	    }
	    if (typeof result == "undefined") {
	      // Recursively compare arrays (susceptible to call stack limits).
	      if (isWhere) {
	        var othIndex = othLength;
	        while (othIndex--) {
	          othValue = other[othIndex];
	          result = arrValue && arrValue === othValue || equalFunc(arrValue, othValue, customizer, isWhere, stackA, stackB);
	          if (result) {
	            break;
	          }
	        }
	      } else {
	        result = arrValue && arrValue === othValue || equalFunc(arrValue, othValue, customizer, isWhere, stackA, stackB);
	      }
	    }
	  }
	  return !!result;
	}

	module.exports = equalArrays;

/***/ },
/* 105 */
/***/ function(module, exports, __webpack_require__) {

	/** `Object#toString` result references. */
	"use strict";

	var boolTag = "[object Boolean]",
	    dateTag = "[object Date]",
	    errorTag = "[object Error]",
	    numberTag = "[object Number]",
	    regexpTag = "[object RegExp]",
	    stringTag = "[object String]";

	/**
	 * A specialized version of `baseIsEqualDeep` for comparing objects of
	 * the same `toStringTag`.
	 *
	 * **Note:** This function only supports comparing values with tags of
	 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
	 *
	 * @private
	 * @param {Object} value The object to compare.
	 * @param {Object} other The other object to compare.
	 * @param {string} tag The `toStringTag` of the objects to compare.
	 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
	 */
	function equalByTag(object, other, tag) {
	  switch (tag) {
	    case boolTag:
	    case dateTag:
	      // Coerce dates and booleans to numbers, dates to milliseconds and booleans
	      // to `1` or `0` treating invalid dates coerced to `NaN` as not equal.
	      return +object == +other;

	    case errorTag:
	      return object.name == other.name && object.message == other.message;

	    case numberTag:
	      // Treat `NaN` vs. `NaN` as equal.
	      return object != +object ? other != +other
	      // But, treat `-0` vs. `+0` as not equal.
	      : object == 0 ? 1 / object == 1 / other : object == +other;

	    case regexpTag:
	    case stringTag:
	      // Coerce regexes to strings and treat strings primitives and string
	      // objects as equal. See https://es5.github.io/#x15.10.6.4 for more details.
	      return object == other + "";
	  }
	  return false;
	}

	module.exports = equalByTag;

/***/ },
/* 106 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var keys = _interopRequire(__webpack_require__(64));

	/** Used for native method references. */
	var objectProto = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/**
	 * A specialized version of `baseIsEqualDeep` for objects with support for
	 * partial deep comparisons.
	 *
	 * @private
	 * @param {Object} object The object to compare.
	 * @param {Object} other The other object to compare.
	 * @param {Function} equalFunc The function to determine equivalents of values.
	 * @param {Function} [customizer] The function to customize comparing values.
	 * @param {boolean} [isWhere] Specify performing partial comparisons.
	 * @param {Array} [stackA] Tracks traversed `value` objects.
	 * @param {Array} [stackB] Tracks traversed `other` objects.
	 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
	 */
	function equalObjects(object, other, equalFunc, customizer, isWhere, stackA, stackB) {
	  var objProps = keys(object),
	      objLength = objProps.length,
	      othProps = keys(other),
	      othLength = othProps.length;

	  if (objLength != othLength && !isWhere) {
	    return false;
	  }
	  var hasCtor,
	      index = -1;

	  while (++index < objLength) {
	    var key = objProps[index],
	        result = hasOwnProperty.call(other, key);

	    if (result) {
	      var objValue = object[key],
	          othValue = other[key];

	      result = undefined;
	      if (customizer) {
	        result = isWhere ? customizer(othValue, objValue, key) : customizer(objValue, othValue, key);
	      }
	      if (typeof result == "undefined") {
	        // Recursively compare objects (susceptible to call stack limits).
	        result = objValue && objValue === othValue || equalFunc(objValue, othValue, customizer, isWhere, stackA, stackB);
	      }
	    }
	    if (!result) {
	      return false;
	    }
	    hasCtor || (hasCtor = key == "constructor");
	  }
	  if (!hasCtor) {
	    var objCtor = object.constructor,
	        othCtor = other.constructor;

	    // Non `Object` object instances with different constructors are not equal.
	    if (objCtor != othCtor && ("constructor" in object && "constructor" in other) && !(typeof objCtor == "function" && objCtor instanceof objCtor && typeof othCtor == "function" && othCtor instanceof othCtor)) {
	      return false;
	    }
	  }
	  return true;
	}

	module.exports = equalObjects;

/***/ },
/* 107 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var isLength = _interopRequire(__webpack_require__(53));

	var isObjectLike = _interopRequire(__webpack_require__(56));

	/** `Object#toString` result references. */
	var argsTag = "[object Arguments]",
	    arrayTag = "[object Array]",
	    boolTag = "[object Boolean]",
	    dateTag = "[object Date]",
	    errorTag = "[object Error]",
	    funcTag = "[object Function]",
	    mapTag = "[object Map]",
	    numberTag = "[object Number]",
	    objectTag = "[object Object]",
	    regexpTag = "[object RegExp]",
	    setTag = "[object Set]",
	    stringTag = "[object String]",
	    weakMapTag = "[object WeakMap]";

	var arrayBufferTag = "[object ArrayBuffer]",
	    float32Tag = "[object Float32Array]",
	    float64Tag = "[object Float64Array]",
	    int8Tag = "[object Int8Array]",
	    int16Tag = "[object Int16Array]",
	    int32Tag = "[object Int32Array]",
	    uint8Tag = "[object Uint8Array]",
	    uint8ClampedTag = "[object Uint8ClampedArray]",
	    uint16Tag = "[object Uint16Array]",
	    uint32Tag = "[object Uint32Array]";

	/** Used to identify `toStringTag` values of typed arrays. */
	var typedArrayTags = {};
	typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
	typedArrayTags[argsTag] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;

	/** Used for native method references. */
	var objectProto = Object.prototype;

	/**
	 * Used to resolve the `toStringTag` of values.
	 * See the [ES spec](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.prototype.tostring)
	 * for more details.
	 */
	var objToString = objectProto.toString;

	/**
	 * Checks if `value` is classified as a typed array.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	 * @example
	 *
	 * _.isTypedArray(new Uint8Array);
	 * // => true
	 *
	 * _.isTypedArray([]);
	 * // => false
	 */
	function isTypedArray(value) {
	    return isObjectLike(value) && isLength(value.length) && typedArrayTags[objToString.call(value)] || false;
	}

	module.exports = isTypedArray;

/***/ },
/* 108 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },
/* 109 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
		"aliceblue": [
			240,
			248,
			255
		],
		"antiquewhite": [
			250,
			235,
			215
		],
		"aqua": [
			0,
			255,
			255
		],
		"aquamarine": [
			127,
			255,
			212
		],
		"azure": [
			240,
			255,
			255
		],
		"beige": [
			245,
			245,
			220
		],
		"bisque": [
			255,
			228,
			196
		],
		"black": [
			0,
			0,
			0
		],
		"blanchedalmond": [
			255,
			235,
			205
		],
		"blue": [
			0,
			0,
			255
		],
		"blueviolet": [
			138,
			43,
			226
		],
		"brown": [
			165,
			42,
			42
		],
		"burlywood": [
			222,
			184,
			135
		],
		"cadetblue": [
			95,
			158,
			160
		],
		"chartreuse": [
			127,
			255,
			0
		],
		"chocolate": [
			210,
			105,
			30
		],
		"coral": [
			255,
			127,
			80
		],
		"cornflowerblue": [
			100,
			149,
			237
		],
		"cornsilk": [
			255,
			248,
			220
		],
		"crimson": [
			220,
			20,
			60
		],
		"cyan": [
			0,
			255,
			255
		],
		"darkblue": [
			0,
			0,
			139
		],
		"darkcyan": [
			0,
			139,
			139
		],
		"darkgoldenrod": [
			184,
			134,
			11
		],
		"darkgray": [
			169,
			169,
			169
		],
		"darkgreen": [
			0,
			100,
			0
		],
		"darkgrey": [
			169,
			169,
			169
		],
		"darkkhaki": [
			189,
			183,
			107
		],
		"darkmagenta": [
			139,
			0,
			139
		],
		"darkolivegreen": [
			85,
			107,
			47
		],
		"darkorange": [
			255,
			140,
			0
		],
		"darkorchid": [
			153,
			50,
			204
		],
		"darkred": [
			139,
			0,
			0
		],
		"darksalmon": [
			233,
			150,
			122
		],
		"darkseagreen": [
			143,
			188,
			143
		],
		"darkslateblue": [
			72,
			61,
			139
		],
		"darkslategray": [
			47,
			79,
			79
		],
		"darkslategrey": [
			47,
			79,
			79
		],
		"darkturquoise": [
			0,
			206,
			209
		],
		"darkviolet": [
			148,
			0,
			211
		],
		"deeppink": [
			255,
			20,
			147
		],
		"deepskyblue": [
			0,
			191,
			255
		],
		"dimgray": [
			105,
			105,
			105
		],
		"dimgrey": [
			105,
			105,
			105
		],
		"dodgerblue": [
			30,
			144,
			255
		],
		"firebrick": [
			178,
			34,
			34
		],
		"floralwhite": [
			255,
			250,
			240
		],
		"forestgreen": [
			34,
			139,
			34
		],
		"fuchsia": [
			255,
			0,
			255
		],
		"gainsboro": [
			220,
			220,
			220
		],
		"ghostwhite": [
			248,
			248,
			255
		],
		"gold": [
			255,
			215,
			0
		],
		"goldenrod": [
			218,
			165,
			32
		],
		"gray": [
			128,
			128,
			128
		],
		"green": [
			0,
			128,
			0
		],
		"greenyellow": [
			173,
			255,
			47
		],
		"grey": [
			128,
			128,
			128
		],
		"honeydew": [
			240,
			255,
			240
		],
		"hotpink": [
			255,
			105,
			180
		],
		"indianred": [
			205,
			92,
			92
		],
		"indigo": [
			75,
			0,
			130
		],
		"ivory": [
			255,
			255,
			240
		],
		"khaki": [
			240,
			230,
			140
		],
		"lavender": [
			230,
			230,
			250
		],
		"lavenderblush": [
			255,
			240,
			245
		],
		"lawngreen": [
			124,
			252,
			0
		],
		"lemonchiffon": [
			255,
			250,
			205
		],
		"lightblue": [
			173,
			216,
			230
		],
		"lightcoral": [
			240,
			128,
			128
		],
		"lightcyan": [
			224,
			255,
			255
		],
		"lightgoldenrodyellow": [
			250,
			250,
			210
		],
		"lightgray": [
			211,
			211,
			211
		],
		"lightgreen": [
			144,
			238,
			144
		],
		"lightgrey": [
			211,
			211,
			211
		],
		"lightpink": [
			255,
			182,
			193
		],
		"lightsalmon": [
			255,
			160,
			122
		],
		"lightseagreen": [
			32,
			178,
			170
		],
		"lightskyblue": [
			135,
			206,
			250
		],
		"lightslategray": [
			119,
			136,
			153
		],
		"lightslategrey": [
			119,
			136,
			153
		],
		"lightsteelblue": [
			176,
			196,
			222
		],
		"lightyellow": [
			255,
			255,
			224
		],
		"lime": [
			0,
			255,
			0
		],
		"limegreen": [
			50,
			205,
			50
		],
		"linen": [
			250,
			240,
			230
		],
		"magenta": [
			255,
			0,
			255
		],
		"maroon": [
			128,
			0,
			0
		],
		"mediumaquamarine": [
			102,
			205,
			170
		],
		"mediumblue": [
			0,
			0,
			205
		],
		"mediumorchid": [
			186,
			85,
			211
		],
		"mediumpurple": [
			147,
			112,
			219
		],
		"mediumseagreen": [
			60,
			179,
			113
		],
		"mediumslateblue": [
			123,
			104,
			238
		],
		"mediumspringgreen": [
			0,
			250,
			154
		],
		"mediumturquoise": [
			72,
			209,
			204
		],
		"mediumvioletred": [
			199,
			21,
			133
		],
		"midnightblue": [
			25,
			25,
			112
		],
		"mintcream": [
			245,
			255,
			250
		],
		"mistyrose": [
			255,
			228,
			225
		],
		"moccasin": [
			255,
			228,
			181
		],
		"navajowhite": [
			255,
			222,
			173
		],
		"navy": [
			0,
			0,
			128
		],
		"oldlace": [
			253,
			245,
			230
		],
		"olive": [
			128,
			128,
			0
		],
		"olivedrab": [
			107,
			142,
			35
		],
		"orange": [
			255,
			165,
			0
		],
		"orangered": [
			255,
			69,
			0
		],
		"orchid": [
			218,
			112,
			214
		],
		"palegoldenrod": [
			238,
			232,
			170
		],
		"palegreen": [
			152,
			251,
			152
		],
		"paleturquoise": [
			175,
			238,
			238
		],
		"palevioletred": [
			219,
			112,
			147
		],
		"papayawhip": [
			255,
			239,
			213
		],
		"peachpuff": [
			255,
			218,
			185
		],
		"peru": [
			205,
			133,
			63
		],
		"pink": [
			255,
			192,
			203
		],
		"plum": [
			221,
			160,
			221
		],
		"powderblue": [
			176,
			224,
			230
		],
		"purple": [
			128,
			0,
			128
		],
		"rebeccapurple": [
			102,
			51,
			153
		],
		"red": [
			255,
			0,
			0
		],
		"rosybrown": [
			188,
			143,
			143
		],
		"royalblue": [
			65,
			105,
			225
		],
		"saddlebrown": [
			139,
			69,
			19
		],
		"salmon": [
			250,
			128,
			114
		],
		"sandybrown": [
			244,
			164,
			96
		],
		"seagreen": [
			46,
			139,
			87
		],
		"seashell": [
			255,
			245,
			238
		],
		"sienna": [
			160,
			82,
			45
		],
		"silver": [
			192,
			192,
			192
		],
		"skyblue": [
			135,
			206,
			235
		],
		"slateblue": [
			106,
			90,
			205
		],
		"slategray": [
			112,
			128,
			144
		],
		"slategrey": [
			112,
			128,
			144
		],
		"snow": [
			255,
			250,
			250
		],
		"springgreen": [
			0,
			255,
			127
		],
		"steelblue": [
			70,
			130,
			180
		],
		"tan": [
			210,
			180,
			140
		],
		"teal": [
			0,
			128,
			128
		],
		"thistle": [
			216,
			191,
			216
		],
		"tomato": [
			255,
			99,
			71
		],
		"turquoise": [
			64,
			224,
			208
		],
		"violet": [
			238,
			130,
			238
		],
		"wheat": [
			245,
			222,
			179
		],
		"white": [
			255,
			255,
			255
		],
		"whitesmoke": [
			245,
			245,
			245
		],
		"yellow": [
			255,
			255,
			0
		],
		"yellowgreen": [
			154,
			205,
			50
		]
	}

/***/ },
/* 110 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	module.exports = {
	  clearfix: {
	    zoom: 1,
	    "&:after, &:before": {
	      content: "\"\"",
	      display: "table"
	    },
	    "&:after": {
	      clear: "both"
	    }
	  },
	  ellipsis: {
	    textOverflow: "ellipsis",
	    whiteSpace: "nowrap",
	    overflow: "hidden",
	    display: "block"
	  }
	};

/***/ }
/******/ ]);