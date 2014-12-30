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
        var es = find('es3', tags) ? 3:
                 find('es5', tags) ? 5:
                 find('es6', tags) ? 6:
                 undefined;
        var ie = find('ie7', tags) ? 7:
                 find('ie8', tags) ? 8:
                 find('ie9', tags) ? 9:
                 find('ie10', tags) ? 10:
                 find('ie11', tags) ? 11:
                 undefined;

        if (es === undefined && ie !== undefined) {
            es = ie < 9 ?
                3 :  // ES3 in IE7 and 8 (although 8 implements some es5)
                5;   // ES5 in IE9
        }

        if (es === undefined && ie === undefined) {
            throw new Error('"tags" should include esX or ieY, X being 3, 5, or 6, and Y being between 7 and 11');
        }

        // Event Handling
        (function () {
            var elmProto = Element.prototype
            if (ie && ie < 9) {
                var ael = elmProto.addEventListener;
                var rel = elmProto.removeEventListener;
                var events = [];

                elmProto.attachEvent = function (evt, cb) {
                    events.push({ evt: evt, cb: cb });
                    ael.call(this, evt.replace(/^on/, ''), function (e) {
                        window.event = e;
                        try {
                            var ret = cb.call(this);
                        } catch(e) {
                            console.error(e);
                        }
                        window.event = null;
                        return ret;
                    }, false);
                };

                elmProto.detachEvent = function (evt, func) {
                    for (var i = 0, len = events.length; i < len; i++) {
                        if (events[i].cb === func && events[i].evt === evt) {
                            break;
                        }
                    }
                    if (events[i].cb !== func || events[i].evt !== evt) { return; }
                    rel.call(this, events[i].evt.replace(/^on/, ''), events[i].cb);
                }

                disable(elmProto, 'addEventListener');
                disable(elmProto, 'removeEventListener');
            }
            // TODO event button numbers
            // TODO can't fire some events on hidden elements
            // TODO gold mine of bugs for each IE version with javascript.
        }());

        // Element stuff
        (function () {
            var elmProto = Element.prototype

            // Remove "height" and "width" (and other) getters from rects. These are chrome/firefox specific
            for (var rectProp in DOMRectReadOnly.prototype) {
                if (['top', 'bottom', 'left', 'right'].indexOf(rectProp) < 0) {
                    disable(DOMRectReadOnly.prototype, rectProp);
                }
            }

            // TODO when did this come along? disable(elmProto, 'classList');
            if (ie && ie < 8) {
                disable(elmProto, 'removeEventListener');
            }
            // TODO gold mine of bugs for each IE version with javascript.
        }());

        // String prototype
        (function () {
            var stringProto = String.prototype;
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
            if (es && es < 5) {
                // Really useful stuff:
                disable(functionProto, 'bind');
            }
        }());
        
        // RegExp prototype
        (function () {
            var regexpProto = RegExp.prototype;
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
                disable(Object, 'defineProperties');
                disable(Object, 'getPrototypeOf');
                disable(Object, 'preventExtensions');
                disable(Object, 'isExtensible');
                disable(Object, 'seal');
                disable(Object, 'isSealed');
                disable(Object, 'freeze');
                disable(Object, 'isFrozen');
                disable(Object, 'getOwnPropertyNames');
                if (!ie || ie < 8) {
                    // IE8 implements these, don't disable them
                    disable(Object, 'defineProperty');
                    disable(Object, 'getOwnPropertyDescriptor');
                }
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
        if (es < 5 && ( !ie || ie < 8 /* Because IE8 implements this */)) {
            disable(globalObj, 'JSON');
        }

        // Date prototype
        (function () {
            var dateProto = Date.prototype;
            if (es && es < 3) {
                disable(dateProto, 'toTimeString');
            }
            if (es && es < 5) {
                disable(Date, 'now');
                disable(dateProto, 'toISOString');
            }
            // TODO Date.toDateString docs were inconclusive about when it came up
        }());

        // TODO getComputedStyle
        // TODO focus()ing elements which are hidden throws an error
    };
}(window));
