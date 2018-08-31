"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Log a success message.
 * @param message Success message.
 */
function success(message) {
    console.log(`\x1b[32mSUCCESS\x1b[0m\t${message}`);
}
/**
 * Log a failure message.
 * @param message Success message.
 */
function failure(message) {
    console.log(`\x1b[31mFAILURE\x1b[0m\t${message}`);
}
/**
 * Executes the specified callback and expect exceptions.
 * @param message Optional success message.
 * @param callback Callback to be performed.
 * @param type Optional exception instance type.
 */
function exception(message, callback, type) {
    const trySuccess = (exception) => {
        if (!type || exception instanceof type) {
            success(message || exception.message);
        }
        else {
            failure(`Exception type '${exception.name}' is not instance of '${type.name}' type.`);
        }
    };
    const tryFailure = () => {
        failure(`Expected exception was not thrown.`);
    };
    try {
        const result = callback();
        if (result instanceof Promise) {
            result.then(tryFailure).catch(trySuccess);
        }
        else {
            tryFailure();
        }
    }
    catch (exception) {
        trySuccess(exception);
    }
}
exports.exception = exception;
/**
 * Executes the specified callback and does not expect exceptions.
 * @param callback Callback to be performed.
 * @param message Custom success message.
 */
function execute(message, callback) {
    const trySuccess = () => {
        success(message ? message : `Asynchronous callback performed successfully.`);
    };
    const tryFailure = (exception) => {
        failure(`Unexpected exception: '${exception.message}'.`);
    };
    try {
        const result = callback();
        if (result instanceof Promise) {
            result.then(trySuccess).catch(tryFailure);
        }
        else {
            trySuccess();
        }
    }
    catch (exception) {
        tryFailure(exception);
    }
}
exports.execute = execute;
/**
 * Check whether the input value is equals to the expected value or not.
 * @param value Input value.
 * @param expected Expected value.
 */
function areEqual(value, expected) {
    if (value === expected) {
        success(`Equality ok.`);
    }
    else {
        failure(`Equality failed, expected '${expected}' but received '${value}'.`);
    }
}
exports.areEqual = areEqual;
