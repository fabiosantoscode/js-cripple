(function (globalObj) {
    'use strict';
    var find = function (needle, haystack) {
        return haystack.indexOf(needle) !== -1;
    };
    
    var disable = function (object, attr) {
        try {
            delete object[attr];
        } catch(e) {
            object[attr] = undefined;
        }
    };

    var swap = function (old, new_, force) {
        if (old || force === true) {
            old = new_;
        }
    };

    globalObj.cripple = function (tags) {
        var es = find('es1', tags) ? 1:
                 find('es3', tags) ? 3:
                 find('es4', tags) ? 4:  // ???
                 find('es5', tags) ? 5:
                 find('es6', tags) ? 6:
                 undefined;
        var ie = find('ie6', tags) ? 6:
                 find('ie7', tags) ? 7:
                 find('ie8', tags) ? 8:
                 find('ie9', tags) ? 9:
                 undefined;
        
        // Event Handling
        (function () {
            var elmProto = Element.prototype
            if (ie && ie < 8) {
                var ael = elmProto.addEventListener;
                var rel = elmProto.removeEventListener;
                var events = [];
                
                elmProto.attachEvent = function (evt, cb) {
                    var evtname = [].slice.call(evt, 2, Infinity);  // remove the "on" part
                    events.push(cb);
                    ael.call(this, evtname, function (e) {
                        window.event = e;
                        cb.call(this);  // TODO figure out what to do with return false
                        window.event = null;
                    }, false);
                };

                elmProto.detachEvent = function (evt, func) {
                    var evtname = [].slice.call(evt, 2, Infinity);  // remove the "on" part
                    for (var i = 0, len = events.length; i < len; i++) if (events === func) {
                        break;
                    }
                    rel.call(this, evtname, 
                }

                disable(elmProto, 'addEventListener');
                disable(elmProto, 'removeEventListener');
            }
            // TODO gold mine of bugs for each IE version with javascript.
        }());

        // String prototype
        (function () {
            var stringProto = String.prototype;
            if (es && es < 3) {
                disable(stringProto, 'replace');
                disable(stringProto, 'concat');
                disable(stringProto, 'search');
                disable(stringProto, 'split');
                disable(stringProto, 'slice');
                disable(stringProto, 'match');
                disable(stringProto, 'localeCompare');
                disable(stringProto, 'toLocaleLowerCase');
                disable(stringProto, 'toLocaleUpperCase');
            }
            if (es && es < 5) {
                disable(stringProto, 'trim');
            }
            if (es && es < 6) {
                disable(stringProto, 'contains');
                disable(stringProto, 'endsWith');
                disable(stringProto, 'startsWith');
            }
        }());
        
        // Array prototype
        (function () {
            var arrayProto = Array.prototype;
            // TODO Array#sort has a few quirks
            if (es && es < 3) {
                disable(arrayProto, 'pop');
                disable(arrayProto, 'push');
                disable(arrayProto, 'shift');
                disable(arrayProto, 'unshift');
                disable(arrayProto, 'splice');
                disable(arrayProto, 'concat');
                disable(arrayProto, 'slice');
            }
            if (es && es < 5) {
                // Really useful stuff:
                disable(arrayProto, 'indexOf');
                disable(arrayProto, 'lastIndexOf');
                
                disable(arrayProto, 'forEach');
                disable(arrayProto, 'every');
                disable(arrayProto, 'some');
                disable(arrayProto, 'filter');
                disable(arrayProto, 'map');
                disable(arrayProto, 'reduce');
                disable(arrayProto, 'reduceRight');
            }
        }());
        
        // Function prototype
        (function () {
            var functionProto = Function.prototype;
            if (es && es < 3) {
                disable(arrayProto, 'apply');
                disable(arrayProto, 'call');
            }
            if (es && es < 5) {
                // Really useful stuff:
                disable(arrayProto, 'bind');
            }
        }());
        
        // RegExp prototype
        (function () {
            var regexpProto = RegExp.prototype;
            if (es && es < 3) {
                disable(regexpProto, 'exec');
                disable(regexpProto, 'test');
            }
        }());

        // Object prototype
        (function () {
            var objectProto = Object.prototype;
            if (es && es < 3) {
                disable(objectProto, 'hasOwnProperty');
                disable(objectProto, 'isPrototypeOf');
                disable(objectProto, 'propertyIsEnumerable');
                disable(objectProto, 'toLocaleString');
            }
            if (es && es < 5) {
                disable(Object, 'keys');
                disable(Object, 'create');
                disable(Object, 'defineProperty');
                disable(Object, 'defineProperties');
                disable(Object, 'getOwnPropertyDescriptor');
                disable(Object, 'getOwnPropertyNames');
                disable(Object, 'getPrototypeOf');
                disable(Object, 'preventExtensions');
                disable(Object, 'isExtensible');
                disable(Object, 'seal');
                disable(Object, 'isSealed');
                disable(Object, 'freeze');
                disable(Object, 'isFrozen');
            }
            if (es && es < 6) {
                disable(Object, 'is');
                disable(Object, 'is');
                disable(Object, 'is');
                disable(Object, 'is');
                disable(Object, 'is');
                
            }
            // TODO __proto__
        }());

        // JSON
        if (es < 5) {
            disable(globalObj, 'JSON');
        }

        // Date prototype
        (function () {
            var dateProto = Date.prototype;
            if (es && es < 3) {
                disable(dateProto, 'toTimeString');
            }
            if (es && es < 5) {
                disable(dateProto, 'now');
                disable(dateProto, 'toISOString');
            }
            // TODO Date.toDateString docs were inconclusive about when it came up
        }());

    };
}(window));
