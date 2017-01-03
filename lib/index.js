"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof2 = require("babel-runtime/helpers/typeof");

var _typeof3 = _interopRequireDefault(_typeof2);

var _keys = require("babel-runtime/core-js/object/keys");

var _keys2 = _interopRequireDefault(_keys);

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require("object.observe/dist/object-observe-lite");

var callOnchange = function callOnchange(ctx, oldCtx, target, name, val) {
    if (ctx && ctx.onChange && typeof ctx.onChange === "function") {
        ctx.onChange((0, _utils.getObject)(ctx), (0, _utils.getObject)(target), name, val);
    }
};

var callOnChangeLegacy = function callOnChangeLegacy(ctx) {

    return function (changeArray) {
        if (ctx && ctx.onChange && typeof ctx.onChange === "function") {
            changeArray.forEach(function (changeObj) {
                ctx.onChange(ctx, changeObj.object, changeObj.name, changeObj.object[changeObj.name]);
            });
        }
    };
};

var proxyHandler = function proxyHandler(ctx) {
    return {
        get: function get(target, prop, receiver) {
            try {
                return (0, _utils.isObject)(target[prop]) && "___value" in target[prop] ? target[prop].___value : target[prop];
            } catch (e) {
                return;
            }
        },

        set: function set(target, name, value) {
            var oldVal = (0, _utils.getObject)(ctx);

            if (Array.isArray(value)) {
                target[name] = value;
                callOnchange(ctx, oldVal, target, name, value);
                return target;
            }

            if ((0, _utils.isObject)(value) && !Array.isArray(value)) {
                (0, _keys2.default)(value).forEach(function (key) {
                    target[name] = new Proxy(ObservuI(value, {}), proxyHandler);
                });
            }

            if (Array.isArray(value)) {
                target[name] = new Proxy(value, proxyHandler);
            }

            if (!(0, _utils.isObject)(value)) {
                target[name] = new Proxy({
                    ___value: value
                }, proxyHandler);
            }

            callOnchange(ctx, oldVal, target, name, value);
        }
    };
};

var ObservuI = function ObservuI(state, that, originalState) {
    if ((0, _utils.isObject)(state) && !Array.isArray(state)) {
        (0, _keys2.default)(state).forEach(function (key) {
            that[key] = new Proxy(ObservuI(state[key], {}, originalState), proxyHandler(originalState));
        });
    }

    if (Array.isArray(state)) {
        return new Proxy(state, proxyHandler(originalState));
    }

    if (!(0, _utils.isObject)(state)) {
        return new Proxy({
            ___value: state
        }, proxyHandler(originalState));
    }

    return that;
};

var ObservuILegacy = function ObservuILegacy(state, that, originalState, callOnChangeLegacy) {

    if ((0, _utils.isObject)(state)) {
        (0, _keys2.default)(state).forEach(function (key) {
            if ((0, _typeof3.default)(state[key]) === "object") {
                that[key] = Object.observe(ObservuILegacy(state[key], {}, originalState, callOnChangeLegacy), callOnChangeLegacy);
            } else {
                that[key] = state[key];
            }
        });
    }

    if (!(0, _utils.isObject)(state)) {
        return state;
    }

    return that;
};

var Observu = function Observu(state) {
    var isProxyAvailable = typeof Proxy === "function";
    var newState = {};

    if (!isProxyAvailable) {
        callOnChangeLegacy = callOnChangeLegacy(newState);
    }

    var observableState = isProxyAvailable ? ObservuI(state, newState, newState) : Object.observe(ObservuILegacy(state, newState, newState, callOnChangeLegacy), callOnChangeLegacy);
    return observableState;
};

exports.default = Observu;