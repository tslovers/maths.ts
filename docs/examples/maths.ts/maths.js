var mathsts =
    /******/ (function (modules) { // webpackBootstrap
    /******/ 	// The module cache
    /******/
    var installedModules = {};
    /******/
    /******/ 	// The require function
    /******/
    function __webpack_require__(moduleId) {
        /******/
        /******/ 		// Check if module is in cache
        /******/
        if (installedModules[moduleId]) {
            /******/
            return installedModules[moduleId].exports;
            /******/
        }
        /******/ 		// Create a new module (and put it into the cache)
        /******/
        var module = installedModules[moduleId] = {
            /******/            i: moduleId,
            /******/            l: false,
            /******/            exports: {}
            /******/
        };
        /******/
        /******/ 		// Execute the module function
        /******/
        modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
        /******/
        /******/ 		// Flag the module as loaded
        /******/
        module.l = true;
        /******/
        /******/ 		// Return the exports of the module
        /******/
        return module.exports;
        /******/
    }

    /******/
    /******/
    /******/ 	// expose the modules object (__webpack_modules__)
    /******/
    __webpack_require__.m = modules;
    /******/
    /******/ 	// expose the module cache
    /******/
    __webpack_require__.c = installedModules;
    /******/
    /******/ 	// define getter function for harmony exports
    /******/
    __webpack_require__.d = function (exports, name, getter) {
        /******/
        if (!__webpack_require__.o(exports, name)) {
            /******/
            Object.defineProperty(exports, name, {
                /******/                configurable: false,
                /******/                enumerable: true,
                /******/                get: getter
                /******/
            });
            /******/
        }
        /******/
    };
    /******/
    /******/ 	// getDefaultExport function for compatibility with non-harmony modules
    /******/
    __webpack_require__.n = function (module) {
        /******/
        var getter = module && module.__esModule ?
            /******/            function getDefault() {
                return module['default'];
            } :
            /******/            function getModuleExports() {
                return module;
            };
        /******/
        __webpack_require__.d(getter, 'a', getter);
        /******/
        return getter;
        /******/
    };
    /******/
    /******/ 	// Object.prototype.hasOwnProperty.call
    /******/
    __webpack_require__.o = function (object, property) {
        return Object.prototype.hasOwnProperty.call(object, property);
    };
    /******/
    /******/ 	// __webpack_public_path__
    /******/
    __webpack_require__.p = "";
    /******/
    /******/ 	// Load entry module and return exports
    /******/
    return __webpack_require__(__webpack_require__.s = 1);
    /******/
})
/************************************************************************/
/******/([
    /* 0 */
    /***/ (function (module, exports, __webpack_require__) {

        "use strict";

        Object.defineProperty(exports, "__esModule", {value: true});
        function graphSearch(graph, source, destination, outFunction, inFunction, logger) {
            var list = {
                vertexes: [{
                    vertex: graph.vertexes[source],
                    id: graph.vertexes[source].id,
                    trail: [graph.vertexes[source].id],
                    cost: 0,
                    depth: 0
                }],
                status: graph.vertexes.map(function () {
                    return VertexStatus.NOT_VISITED;
                }),
                push: inFunction,
                next: outFunction
            };
            if (logger)
                return lgs(list, destination, logger);
            else
                return gs(list, destination);
        }

        exports.graphSearch = graphSearch;
        var VertexStatus;
        (function (VertexStatus) {
            VertexStatus[VertexStatus["NOT_VISITED"] = 0] = "NOT_VISITED";
            VertexStatus[VertexStatus["IN_QUEUE"] = 1] = "IN_QUEUE";
            VertexStatus[VertexStatus["VISITED"] = 2] = "VISITED";
        })(VertexStatus || (VertexStatus = {}));
        function gs(list, destination) {
            while (list.vertexes.length) {
                var v = list.next();
                list.status[v.id] = VertexStatus.VISITED;
                if (v.id === destination)
                    return true;
                v.vertex.edges.forEach(function (e) {
                    if (list.status[e.destination.id] === VertexStatus.NOT_VISITED) {
                        list.status[e.destination.id] = VertexStatus.IN_QUEUE;
                        list.push({
                            vertex: e.destination,
                            id: e.destination.id,
                            trail: null,
                            cost: null,
                            depth: null
                        });
                    }
                });
            }
            return false;
        }

        function lgs(list, destination, logger) {
            logger.push({
                stepName: 'Starting search of ' + destination + ' from ' + list.vertexes[0].vertex.id,
                stepInfo: {idVertexList: getInfo(list)}
            });
            var _loop_1 = function () {
                var v = list.next();
                list.status[v.id] = VertexStatus.VISITED;
                logger.push({
                    stepName: 'Current node: ' + v.id + (v.id === destination ? ' -> its goal!' : ''),
                    stepInfo: {
                        addedVertexes: [],
                        ignoredVertexes: []
                    }
                });
                if (v.id === destination) {
                    logger[logger.length - 1].stepInfo.idVertexList = getInfo(list);
                    logger.push({
                        stepName: 'Solution',
                        stepInfo: {
                            trail: v.trail,
                            cost: v.cost,
                            depth: v.depth
                        }
                    });
                    return {value: true};
                }
                v.vertex.edges.forEach(function (e) {
                    if (list.status[e.destination.id] !== VertexStatus.VISITED) {
                        list.status[e.destination.id] = VertexStatus.IN_QUEUE;
                        logger[logger.length - 1].stepInfo.addedVertexes.push(e.destination.id);
                        var trail = v.trail.map(function (i) {
                            return i;
                        });
                        trail.push(e.destination.id);
                        list.push({
                            vertex: e.destination,
                            id: e.destination.id,
                            trail: trail,
                            cost: v.cost + e.weight,
                            depth: v.depth + 1
                        });
                    }
                    else
                        logger[logger.length - 1].stepInfo.ignoredVertexes.push(e.destination.id);
                });
                logger[logger.length - 1].stepInfo.idVertexList = getInfo(list);
            };
            while (list.vertexes.length) {
                var state_1 = _loop_1();
                if (typeof state_1 === "object")
                    return state_1.value;
            }
            return false;
        }

        function getInfo(list) {
            return list.vertexes.map(function (i) {
                return {
                    id: i.id,
                    trail: i.trail.map(function (i) {
                        return i;
                    }),
                    cost: i.cost,
                    depth: i.depth
                };
            });
        }

//# sourceMappingURL=graphSearch.js.map

        /***/
    }),
    /* 1 */
    /***/ (function (module, exports, __webpack_require__) {

        "use strict";

        function __export(m) {
            for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
        }

        Object.defineProperty(exports, "__esModule", {value: true});
        __export(__webpack_require__(2));
        __export(__webpack_require__(5));
        __export(__webpack_require__(8));
//# sourceMappingURL=maths.js.map

        /***/
    }),
    /* 2 */
    /***/ (function (module, exports, __webpack_require__) {

        "use strict";

        function __export(m) {
            for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
        }

        Object.defineProperty(exports, "__esModule", {value: true});
        __export(__webpack_require__(3));
//# sourceMappingURL=index.js.map

        /***/
    }),
    /* 3 */
    /***/ (function (module, exports, __webpack_require__) {

        "use strict";

        Object.defineProperty(exports, "__esModule", {value: true});
        var Error_1 = __webpack_require__(4);
        exports.numberPattern = /((\d+)(\.\d+)?)|(\.\d+)/;
        exports.symbolPattern = /[a-z]\w*/i;
        var operators = {
            '+': {
                priority: 0,
                params: 2,
                fn: function (nodeA, nodeB, scope) {
                    var a = nodeA.getNumberValue(scope), b = nodeB.getNumberValue(scope);
                    if (a !== undefined && b !== undefined)
                        return a + b;
                    return undefined;
                }
            },
            '-': {
                priority: 0,
                params: 2,
                fn: function (nodeA, nodeB, scope) {
                    var a = nodeA.getNumberValue(scope), b = nodeB.getNumberValue(scope);
                    if (a !== undefined && b !== undefined)
                        return a - b;
                    return undefined;
                }
            },
            '*': {
                priority: 1,
                params: 2,
                fn: function (nodeA, nodeB, scope) {
                    var a = nodeA.getNumberValue(scope), b = nodeB.getNumberValue(scope);
                    if (a !== undefined && b !== undefined)
                        return a * b;
                    return undefined;
                }
            },
            '/': {
                priority: 1,
                params: 2,
                fn: function (nodeA, nodeB, scope) {
                    var a = nodeA.getNumberValue(scope), b = nodeB.getNumberValue(scope);
                    if (a !== undefined && b !== undefined)
                        return a / b;
                    return undefined;
                }
            },
            '^': {
                priority: 2,
                params: 2,
                fn: function (nodeA, nodeB, scope) {
                    var a = nodeA.getNumberValue(scope), b = nodeB.getNumberValue(scope);
                    if (a !== undefined && b !== undefined)
                        return Math.pow(a, b);
                    return undefined;
                }
            },
            '!': {
                priority: 3,
                params: 1,
                fn: function (node, scope) {
                    var aux;
                    if ((aux = node.getNumberValue(scope)) !== undefined)
                        return fact(aux);
                    return aux;
                    function fact(i) {
                        if (i < 0 || Math.floor(i) === i)
                            throw new Error_1.InputError('At this moment we are only capable to calculate positive integers[0, inf).');
                        if (i < 2)
                            return 1;
                        return i * fact(i - 1);
                    }
                }
            }
        };
        var functions = {
            sin: {
                fn: function (node, scope) {
                    var aux;
                    if ((aux = node.getNumberValue(scope)) !== undefined)
                        return Math.sin(aux);
                    return aux;
                }
            },
            cos: {
                fn: function (node, scope) {
                    var aux;
                    if ((aux = node.getNumberValue(scope)) !== undefined)
                        return Math.cos(aux);
                    return aux;
                }
            },
            tan: {
                fn: function (node, scope) {
                    var aux;
                    if ((aux = node.getNumberValue(scope)) !== undefined)
                        return Math.tan(aux);
                    return aux;
                }
            },
            asin: {
                fn: function (node, scope) {
                    var aux;
                    if ((aux = node.getNumberValue(scope)) !== undefined)
                        return Math.asin(aux);
                    return aux;
                }
            },
            acos: {
                fn: function (node, scope) {
                    var aux;
                    if ((aux = node.getNumberValue(scope)) !== undefined)
                        return Math.acos(aux);
                    return aux;
                }
            },
            atan: {
                fn: function (node, scope) {
                    var aux;
                    if ((aux = node.getNumberValue(scope)) !== undefined)
                        return Math.atan(aux);
                    return aux;
                }
            },
            log: {
                fn: function (node, scope) {
                    var aux;
                    if ((aux = node.getNumberValue(scope)) !== undefined)
                        return Math.log(aux);
                    return aux;
                }
            }
        };
        var constants = {
            e: Math.E,
            pi: Math.PI
        };
        constants.E = constants.e;
        constants.PI = constants.pi;
        var Node = (function () {
            function Node(s, parent) {
                this.parent = parent;
                if (typeof s === 'number') {
                    this.name = s;
                    this.type = NodeType.Constant;
                    return;
                }
                if (!(s instanceof Node) && typeof s !== 'string' && s.length === 1)
                    s = s[0];
                if (s instanceof Node) {
                    this.name = typeof s.name === 'number' ? s.name : s.name.toString();
                    this.parent = s.parent;
                    this.type = s.type;
                    if (s.children !== undefined)
                        this.children = s.children.map(Node.newNode);
                }
                else if (typeof s === 'string')
                    this.buildTree(this.separate(Node.formatString(s)));
                else if (s.length === 0)
                    throw new Error_1.InputError('There is something wrong about your input: ' +
                        (this.parent ? this.parent.toString() : 'unknown') + '.');
                else
                    this.buildTree(s);
            }

            Node.prototype.childString = function (n) {
                var child = this.children[n];
                var thisP = Node.scope.operators[this.name].priority;
                var childP = Node.scope.operators[child.name] !== undefined ? Node.scope.operators[child.name].priority : Infinity;
                if (childP !== undefined && thisP >= childP && thisP === 2)
                    return '( ' + child.toString() + ' )';
                return child.toString();
            };
            Node.prototype.separate = function (s, children) {
                if (children === void 0) {
                    children = [];
                }
                var i = 0, j = s[0] === '(' ? 1 : 0;
                if (s.length === 0)
                    return children;
                if (Node.isAlpha(s[i]))
                    i = s.match(exports.symbolPattern)[0].length;
                else if (Node.isNumeric(s[i]) || s[i] === '.')
                    i = s.match(exports.numberPattern)[0].length;
                else if (Node.scope.operators[s[i]] !== undefined)
                    i++;
                else if (s[i] === ')')
                    throw new Error_1.InputError('There is a extra closing bracket.');
                if (s[i] === '(' && (Node.isAlpha(s[0]) || i === 0)) {
                    i++;
                    var flag = true;
                    for (var k = 0; i < s.length && flag; i++)
                        if (s[i] === '(')
                            k++;
                        else if (s[i] === ')' && k > 0)
                            k--;
                        else if (s[i] === ')')
                            flag = false;
                    if (flag)
                        throw new Error_1.InputError('There is a unclosed bracket');
                }
                children.push(s.substring(j, i - j));
                return this.separate(s.substring(i, s.length), children);
            };
            Node.prototype.buildTree = function (elements) {
                if (elements.length === 0)
                    throw new Error_1.InputError('Node cannot be built because of wrong input: ' +
                        (this.parent ? this.parent.toString() : 'unknown') + '.');
                if (elements.length === 1) {
                    if (elements[0][0] === '(' ||
                        (elements[0].search(/-?[a-z]\w*\(.*\)/i) < 0 &&
                        elements[0].search(/\/|\*|\+|-|\^/i) >= 0 &&
                        elements[0].search(/-/i) !== 0))
                        this.buildTree(this.separate(Node.formatString(elements[0])));
                    else {
                        this.name = elements[0];
                        if (elements[0].search(exports.symbolPattern) >= 0) {
                            if (elements[0].search(/[()]/) >= 0) {
                                this.type = NodeType.Function;
                                if (elements[0].search(/sqrt\(/) === 0) {
                                    this.buildTree(this.separate(elements[0].replace('sqrt', '(') + '^(1/2))'));
                                }
                                else {
                                    this.name = elements[0].match(exports.symbolPattern)[0];
                                    this.children = [new Node(elements[0].substring(this.name.length, elements[0].length), this)];
                                }
                            }
                            else {
                                this.type = NodeType.Symbol;
                                this.name = elements[0];
                            }
                        }
                        else if (elements[0].search(exports.numberPattern) >= 0) {
                            this.type = NodeType.Constant;
                            this.name = Number(elements[0]);
                        }
                        else
                            throw new Error_1.InputError('WTF?');
                    }
                }
                else {
                    var curOp = -1;
                    for (var i = 0; i < elements.length; i++) {
                        if (Node.scope.operators[elements[i]] !== undefined &&
                            (curOp < 0 || Node.scope.operators[elements[i]].priority < Node.scope.operators[elements[curOp]].priority))
                            curOp = i;
                    }
                    if (curOp < 0)
                        throw new Error_1.InputError('Node cannot be built because of wrong input: ' +
                            (this.parent ? this.parent.toString() : elements) + '.');
                    this.type = NodeType.BinaryOperator;
                    this.name = elements[curOp];
                    this.children = [
                        new Node(elements.slice(0, curOp), this),
                        new Node(elements.slice(curOp + 1, elements.length), this)
                    ];
                }
            };
            Node.prototype.clone = function () {
                return new Node(this.toString());
            };
            Node.prototype.getNumberValue = function (scope) {
                if (this.type === NodeType.Constant && typeof this.name === 'number')
                    return this.name;
                else if (this.type === NodeType.Symbol && Node.scope.constants[this.name] !== undefined)
                    return Node.scope.constants[this.name];
                else if (this.type === NodeType.BinaryOperator)
                    return Node.scope.operators[this.name].fn(this.children[0], this.children[1], scope);
                else if (this.type === NodeType.Function)
                    return Node.scope.functions[this.name].fn(this.children[0], scope);
                else if (this.type === NodeType.Symbol && scope !== undefined && scope[this.name] !== undefined)
                    return scope[this.name];
                return undefined;
            };
            Node.prototype.replace = function (scope) {
                if (this.type === NodeType.Symbol && scope[this.name] !== undefined) {
                    this.name = scope[this.name] + '';
                    var match = void 0;
                    if ((match = this.name.match(exports.symbolPattern)) && match[0] === this.name)
                        this.type = NodeType.Symbol;
                    else if ((match = this.name.match(exports.numberPattern)) && match[0] === this.name)
                        this.type = NodeType.Constant;
                    else
                        throw new Error_1.InputError("The replacements must be a symbol or a number");
                }
                else if (this.type === NodeType.BinaryOperator) {
                    this.children[0].replace(scope);
                    this.children[1].replace(scope);
                }
                else if (this.type === NodeType.Function)
                    this.children[0].replace(scope);
            };
            Node.prototype.toString = function () {
                var out = '';
                if (this.type === NodeType.BinaryOperator)
                    out += this.childString(0) + ' ' + this.name + ' ' + this.childString(1);
                else if (this.type === NodeType.Function)
                    out += this.name + '( ' + this.children[0] + ' )';
                else
                    out += this.name;
                return out;
            };
            Node.prototype.detailedChildrenString = function (scope) {
                var out = this.name + ': ' + NodeType[this.type] + ' --- Value: ' + this.getNumberValue(scope) + '\n';
                if (this.type === NodeType.BinaryOperator) {
                    out += 'Children: [' + this.children[0] + ', ' + this.children[1] + ']\n';
                    out += this.children[0].detailedChildrenString(scope);
                    out += this.children[1].detailedChildrenString(scope);
                }
                else if (this.type === NodeType.Function) {
                    out += 'Child: ' + this.children[0] + '\n';
                    out += this.children[0].detailedChildrenString(scope);
                }
                return out;
            };
            Node.isAlpha = function (c) {
                return c.length === 1 && c.search(/[a-z]|[A-Z]/i) >= 0;
            };
            Node.isNumeric = function (c) {
                return c.length === 1 && c.search(/[0-9]/i) >= 0;
            };
            Node.isAlphaNumeric = function (c) {
                return c.length === 1 && c.search(/\w/i) >= 0;
            };
            Node.formatString = function (s) {
                s = s.replace(/\( */g, '(');
                s = s.replace(/ *\)/g, ')');
                s = s.replace(/ *\+ */g, '+');
                s = s.replace(/ *\* */g, '*');
                s = s.replace(/ *- */g, '-');
                s = s.replace(/ *\/ */g, '/');
                s = s.replace(/ *\^ */g, '^');
                s = s.replace(/ +/g, '*');
                s = s.replace(/--/g, '');
                if (s[0] === '-')
                    s = '0' + s;
                if (s.length === 0 || s.search(/\( *\)/) >= 0)
                    throw new Error_1.InputError('There cannot be empty expressions on input.');
                if (s.search(/(([*+\/^-])([*+\/^])+)|(\(([*+\/^])+)|(([*+\/^-])+\))/) >= 0)
                    throw new Error('There are two operators that does not suppose to be together: ' + s + '.');
                return s;
            };
            Node.setConstant = function (c, v, rational) {
                if (rational === void 0) {
                    rational = true;
                }
                Node.scope.constants[c] = v;
                if (rational)
                    Node.scope.irrationals[c] = true;
            };
            Node.setFunction = function (f, fn) {
                Node.scope.functions[f] = {
                    fn: fn
                };
            };
            Node.newNode = function (s) {
                return new Node(s);
            };
            return Node;
        }());
        Node.scope = {
            functions: functions,
            constants: constants,
            operators: operators,
            irrationals: {e: true, E: true, pi: true, PI: true}
        };
        exports.Node = Node;
        var NodeType;
        (function (NodeType) {
            NodeType[NodeType["Function"] = 0] = "Function";
            NodeType[NodeType["BinaryOperator"] = 1] = "BinaryOperator";
            NodeType[NodeType["Constant"] = 2] = "Constant";
            NodeType[NodeType["Symbol"] = 3] = "Symbol";
        })(NodeType = exports.NodeType || (exports.NodeType = {}));
//# sourceMappingURL=Node.js.map

        /***/
    }),
    /* 4 */
    /***/ (function (module, exports, __webpack_require__) {

        "use strict";

        var __extends = (this && this.__extends) || (function () {
                var extendStatics = Object.setPrototypeOf ||
                    ({__proto__: []} instanceof Array && function (d, b) {
                        d.__proto__ = b;
                    }) ||
                    function (d, b) {
                        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
                    };
                return function (d, b) {
                    extendStatics(d, b);
                    function __() {
                        this.constructor = d;
                    }

                    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
                };
            })();
        Object.defineProperty(exports, "__esModule", {value: true});
        var InputError = (function (_super) {
            __extends(InputError, _super);
            function InputError(message) {
                if (message === void 0) {
                    message = 'There is something wrong with the input.';
                }
                return _super.call(this, message) || this;
            }

            return InputError;
        }(Error));
        exports.InputError = InputError;
        var DuplicatedKeyError = (function (_super) {
            __extends(DuplicatedKeyError, _super);
            function DuplicatedKeyError(m) {
                if (m === void 0) {
                    m = 'You are trying to add an already existing key.';
                }
                return _super.call(this, m) || this;
            }

            return DuplicatedKeyError;
        }(Error));
        exports.DuplicatedKeyError = DuplicatedKeyError;
//# sourceMappingURL=Error.js.map

        /***/
    }),
    /* 5 */
    /***/ (function (module, exports, __webpack_require__) {

        "use strict";

        function __export(m) {
            for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
        }

        Object.defineProperty(exports, "__esModule", {value: true});
        var graph = __webpack_require__(6);
        exports.graph = graph;
        __export(__webpack_require__(7));
//# sourceMappingURL=index.js.map

        /***/
    }),
    /* 6 */
    /***/ (function (module, exports, __webpack_require__) {

        "use strict";

        Object.defineProperty(exports, "__esModule", {value: true});
        var Edge = (function () {
            function Edge(source, destination, weight, info) {
                this.source = source;
                this._destination = destination;
                if (typeof weight === 'number')
                    this._weight = weight;
                else
                    this.setWeightFunction(weight);
                this.info = info;
            }

            Object.defineProperty(Edge.prototype, "source", {
                get: function () {
                    return this._source;
                },
                set: function (value) {
                    this._source = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Edge.prototype, "destination", {
                get: function () {
                    return this._destination;
                },
                set: function (value) {
                    this._destination = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Edge.prototype, "weight", {
                get: function () {
                    if (this.weightFunction)
                        return this.weightFunction(this.source, this.destination);
                    else if (this._weight === undefined)
                        return 1;
                    else
                        return this._weight;
                },
                set: function (w) {
                    this._weight = w;
                },
                enumerable: true,
                configurable: true
            });
            Edge.prototype.setWeightFunction = function (f) {
                this.weightFunction = f;
            };
            Edge.prototype.removeWeightFunction = function () {
                this.weightFunction = undefined;
            };
            Edge.prototype.toString = function () {
                return '(' + this.source.name + ', ' + this.destination.name +
                    (this.weight !== undefined ? ', ' + this.weight : '') + ')';
            };
            return Edge;
        }());
        exports.Edge = Edge;
        var Vertex = (function () {
            function Vertex(id, name, info) {
                this.id = id;
                this._name = name;
                this.info = info;
                this._edges = [];
            }

            Vertex.prototype.addEdge = function (e) {
                for (var i = 0; i < this._edges.length; i++)
                    if (this.edges[i].source.equals(e.source) && this.edges[i].destination === e.destination) {
                        if (this.edges[i].weight && e.weight && this.edges[i].weight > e.weight)
                            this.edges[i] = e;
                        return;
                    }
                this.edges.push(e);
            };
            Object.defineProperty(Vertex.prototype, "edges", {
                get: function () {
                    return this._edges;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vertex.prototype, "name", {
                get: function () {
                    if (this._name)
                        return this._name;
                    return this.id + '';
                },
                set: function (value) {
                    this._name = value;
                },
                enumerable: true,
                configurable: true
            });
            Vertex.prototype.getNeighborHood = function () {
                return this.edges.map(function (e) {
                    return e.destination;
                });
            };
            Vertex.prototype.equals = function (v) {
                return v._edges === this._edges && this._name === v._name;
            };
            Vertex.prototype.toString = function () {
                return this.name + (this.edges.length ? ': ' : '') + this.edges.join(', ');
            };
            return Vertex;
        }());
        exports.Vertex = Vertex;
        var Graph = (function () {
            function Graph(nVertexes, directed) {
                if (directed === void 0) {
                    directed = false;
                }
                this._vertexes = [];
                this.directed = directed;
                for (var i = 0; i < nVertexes; i++)
                    this.addVertex();
            }

            Graph.prototype.addVertex = function (name, info) {
                this.vertexes.push(new Vertex(this.vertexes.length, name, info));
            };
            Graph.prototype.addEdge = function (from, to, weight, info) {
                this.vertexes[from].addEdge(new Edge(this.vertexes[from], this.vertexes[to], weight, info));
                if (!this.directed)
                    this.vertexes[to].addEdge(new Edge(this.vertexes[to], this.vertexes[from], weight, info));
            };
            Graph.prototype.heuristicValue = function (s, d) {
                if (this._heuristic)
                    return this._heuristic(this.vertexes[s], this.vertexes[d]);
                return 0;
            };
            Graph.prototype.setHeuristic = function (h) {
                this._heuristic = h;
            };
            Object.defineProperty(Graph.prototype, "vertexes", {
                get: function () {
                    return this._vertexes;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Graph.prototype, "edges", {
                get: function () {
                    var es = [];
                    this.vertexes.forEach(function (v) {
                        return v.edges.forEach(function (e) {
                            return es.push(e);
                        });
                    });
                    return es;
                },
                enumerable: true,
                configurable: true
            });
            Graph.prototype.toString = function () {
                if (this._vertexes.length <= 0)
                    return 'Empty graphs';
                return 'Graph:\n\t' + this.vertexes.join('\n\t');
            };
            return Graph;
        }());
        exports.Graph = Graph;
//# sourceMappingURL=graph.js.map

        /***/
    }),
    /* 7 */
    /***/ (function (module, exports, __webpack_require__) {

        "use strict";

        Object.defineProperty(exports, "__esModule", {value: true});
        var BitSet = (function () {
            function BitSet(size, buffer) {
                if (size === void 0) {
                    size = 1;
                }
                this._numOn = 0;
                this._size = 0;
                if (buffer)
                    this.setFromBuffer(buffer, size);
                else
                    this.setSize(size);
            }

            BitSet.prototype.check = function (idx) {
                return (this._buffer[elemIdx(idx)] & (1 << bitPlace(idx))) !== 0;
            };
            BitSet.prototype.get = function (idx) {
                return (this._buffer[elemIdx(idx)] & (1 << bitPlace(idx))) !== 0;
            };
            BitSet.prototype.set = function (idx, val) {
                var existing = this.check(idx);
                if (val === existing)
                    return;
                if (val) {
                    this._buffer[elemIdx(idx)] |= 1 << bitPlace(idx);
                }
                else {
                    this._buffer[elemIdx(idx)] &= ~(1 << bitPlace(idx));
                }
                this._numOn += val ? 1 : -1;
            };
            BitSet.prototype.setAll = function (val) {
                if (val) {
                    var numOverhang = this._size % PER_ELEM_BITS;
                    if (numOverhang === 0) {
                        fill(this._buffer, FULL_ELEM);
                    }
                    else {
                        fill(this._buffer, FULL_ELEM, this._buffer.length - 1);
                        this._buffer[this._buffer.length - 1] = (1 << numOverhang) - 1;
                    }
                    this._numOn = this._size;
                }
                else {
                    fill(this._buffer, 0);
                    this._numOn = 0;
                }
            };
            BitSet.prototype.numOn = function () {
                return this._numOn;
            };
            BitSet.prototype.numOff = function () {
                return this.size() - this.numOn();
            };
            BitSet.prototype.size = function () {
                return this._size;
            };
            BitSet.prototype.any = function () {
                return this.numOn() > 0;
            };
            BitSet.prototype.all = function () {
                return this.numOn() === this.size();
            };
            BitSet.prototype.none = function () {
                return !this.any();
            };
            BitSet.prototype.setSize = function (newSize) {
                if (newSize === this._size)
                    return;
                this._size = newSize;
                var oldBuf = this._buffer;
                var newBuf = this._buffer = new Uint32Array(numElemsNeeded(newSize));
                if (oldBuf) {
                    if (newBuf.length < oldBuf.length) {
                        newBuf.set(oldBuf.subarray(0, newBuf.length));
                        var numOverhang = newSize % PER_ELEM_BITS;
                        if (numOverhang > 0) {
                            newBuf[newBuf.length - 1] &= (1 << numOverhang) - 1;
                        }
                        this._numOn = numOn(newBuf, newSize);
                    }
                    else {
                        newBuf.set(oldBuf);
                    }
                }
                else {
                    this._numOn = 0;
                }
            };
            Object.defineProperty(BitSet.prototype, "buffer", {
                get: function () {
                    return this._buffer.buffer;
                },
                enumerable: true,
                configurable: true
            });
            BitSet.prototype.setFromBuffer = function (buffer, size) {
                this._buffer = new Uint32Array(buffer);
                this._size = size;
                this._numOn = numOn(this._buffer, size);
            };
            return BitSet;
        }());
        exports.BitSet = BitSet;
        var PER_ELEM_BITS = 8 * Uint32Array.BYTES_PER_ELEMENT;
        var FULL_ELEM = 0xFFFFFFFF;

        function elemIdx(bitIdx) {
            return Math.floor(bitIdx / PER_ELEM_BITS);
        }

        function bitPlace(bitIdx) {
            return bitIdx % PER_ELEM_BITS;
        }

        function numElemsNeeded(size) {
            return Math.ceil(size / PER_ELEM_BITS);
        }

        function numOn(buf, size) {
            var sum = 0;
            var numElems = numElemsNeeded(size);
            var numOverhang = size % PER_ELEM_BITS;
            for (var i = 0; i < numElems; i++) {
                if (i === numElems - 1 && numOverhang > 0) {
                    sum += popcount(buf[i], numOverhang);
                }
                else {
                    sum += popcount(buf[i]);
                }
            }
            return sum;
        }

        function popcount(anInt, topBitPlaceToStart) {
            if (topBitPlaceToStart !== undefined) {
                anInt &= (1 << topBitPlaceToStart) - 1;
            }
            anInt -= anInt >> 1 & 0x55555555;
            anInt = (anInt & 0x33333333) + (anInt >> 2 & 0x33333333);
            anInt = anInt + (anInt >> 4) & 0x0f0f0f0f;
            anInt += anInt >> 8;
            anInt += anInt >> 16;
            return anInt & 0x7f;
        }

        function fill(arr, val, len) {
            if (len === void 0) {
                len = arr.length;
            }
            if (arr.fill) {
                arr.fill(val, 0, len);
                return;
            }
            for (var i = 0; i < len; i++) {
                arr[i] = val;
            }
        }

//# sourceMappingURL=BitSet.js.map

        /***/
    }),
    /* 8 */
    /***/ (function (module, exports, __webpack_require__) {

        "use strict";

        Object.defineProperty(exports, "__esModule", {value: true});
        var graphs = __webpack_require__(9);
        exports.graphs = graphs;
//# sourceMappingURL=index.js.map

        /***/
    }),
    /* 9 */
    /***/ (function (module, exports, __webpack_require__) {

        "use strict";

        function __export(m) {
            for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
        }

        Object.defineProperty(exports, "__esModule", {value: true});
        __export(__webpack_require__(10));
        __export(__webpack_require__(11));
        __export(__webpack_require__(12));
        __export(__webpack_require__(13));
        __export(__webpack_require__(14));
        __export(__webpack_require__(15));
//# sourceMappingURL=index.js.map

        /***/
    }),
    /* 10 */
    /***/ (function (module, exports, __webpack_require__) {

        "use strict";

        Object.defineProperty(exports, "__esModule", {value: true});
        var graphSearch_1 = __webpack_require__(0);

        function bfs(graph, source, destination, log) {
            return graphSearch_1.graphSearch(graph, source, destination, shift, push, log);
        }

        exports.bfs = bfs;
        function shift() {
            return this.vertexes.shift();
        }

        function push(i) {
            this.vertexes.push(i);
        }

//# sourceMappingURL=bfs.js.map

        /***/
    }),
    /* 11 */
    /***/ (function (module, exports, __webpack_require__) {

        "use strict";

        Object.defineProperty(exports, "__esModule", {value: true});
        var graphSearch_1 = __webpack_require__(0);

        function dfs(graph, source, destination, log) {
            return graphSearch_1.graphSearch(graph, source, destination, pop, push, log);
        }

        exports.dfs = dfs;
        function pop() {
            return this.vertexes.pop();
        }

        function push(i) {
            this.vertexes.push(i);
        }

//# sourceMappingURL=dfs.js.map

        /***/
    }),
    /* 12 */
    /***/ (function (module, exports, __webpack_require__) {

        "use strict";

        Object.defineProperty(exports, "__esModule", {value: true});
        var graphSearch_1 = __webpack_require__(0);
        var MAX_ITERATION_LIMIT = 100;
        var i;

        function idfs(graph, source, destination, log) {
            var found;
            for (i = 0; i < MAX_ITERATION_LIMIT && !found; i++) {
                if (log !== undefined)
                    log.push({
                        stepName: 'Iterative DFS - Depth: ' + i,
                        stepInfo: {}
                    });
                found = graphSearch_1.graphSearch(graph, source, destination, pop, push, log);
            }
            return found;
        }

        exports.idfs = idfs;
        function pop() {
            return this.vertexes.pop();
        }

        function push(e) {
            if (e.depth < i)
                this.vertexes.push(e);
        }

//# sourceMappingURL=idfs.js.map

        /***/
    }),
    /* 13 */
    /***/ (function (module, exports, __webpack_require__) {

        "use strict";

        Object.defineProperty(exports, "__esModule", {value: true});
        var graphSearch_1 = __webpack_require__(0);

        function ucs(graph, source, destination, log) {
            if (log === undefined)
                log = [];
            return graphSearch_1.graphSearch(graph, source, destination, shift, push, log);
        }

        exports.ucs = ucs;
        function shift() {
            return this.vertexes.shift();
        }

        function push(e) {
            var i;
            for (i = 0; i < this.vertexes.length; i++)
                if (this.vertexes[i].cost > e.cost)
                    break;
            this.vertexes.splice(i, 0, e);
        }

//# sourceMappingURL=ucs.js.map

        /***/
    }),
    /* 14 */
    /***/ (function (module, exports, __webpack_require__) {

        "use strict";

        Object.defineProperty(exports, "__esModule", {value: true});
        var graphSearch_1 = __webpack_require__(0);

        function aStar(graph, source, destination, log) {
            if (log === undefined)
                log = [];
            return graphSearch_1.graphSearch(graph, source, destination, shift, push, log);
            function push(e) {
                var i;
                for (i = 0; i < this.vertexes.length; i++)
                    if (graph.heuristicValue(this.vertexes[i].id, destination) + this.vertexes[i].cost
                        > graph.heuristicValue(e.id, destination) + e.cost)
                        break;
                this.vertexes.splice(i, 0, e);
            }
        }

        exports.aStar = aStar;
        function shift() {
            return this.vertexes.shift();
        }

//# sourceMappingURL=aStar.js.map

        /***/
    }),
    /* 15 */
    /***/ (function (module, exports, __webpack_require__) {

        "use strict";

        Object.defineProperty(exports, "__esModule", {value: true});
        var graphSearch_1 = __webpack_require__(0);

        function greedySearch(graph, source, destination, log) {
            if (log === undefined)
                log = [];
            return graphSearch_1.graphSearch(graph, source, destination, shift, push, log);
            function push(e) {
                var i;
                for (i = 0; i < this.vertexes.length; i++)
                    if (graph.heuristicValue(this.vertexes[i].id, destination) > graph.heuristicValue(e.id, destination))
                        break;
                this.vertexes.splice(i, 0, e);
            }
        }

        exports.greedySearch = greedySearch;
        function shift() {
            return this.vertexes.shift();
        }

//# sourceMappingURL=greedy.js.map

        /***/
    })
    /******/]);
//# sourceMappingURL=maths.js.map