/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Class from '../source';

/**
 * Log a success message.
 * @param message Success message.
 */
function success(message: string): void {
  console.log(`\x1b[32mSUCCESS\x1b[0m\t${message}`);
}

/**
 * Log a failure message.
 * @param message Success message.
 */
function failure(message: string): void {
  console.log(`\x1b[31mFAILURE\x1b[0m\t${message}`);
}

/**
 * Executes the specified callback and expect exceptions.
 * @param message Optional success message.
 * @param callback Callback to be performed.
 * @param type Optional exception instance type.
 */
export function exception(message: string | undefined, callback: Class.Callable, type?: Class.Constructor): void {
  const trySuccess = (exception: any): void => {
    if (!type || exception instanceof type) {
      success(message || exception.message);
    } else {
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
    } else {
      tryFailure();
    }
  } catch (exception) {
    trySuccess(exception);
  }
}

/**
 * Executes the specified callback and does not expect exceptions.
 * @param callback Callback to be performed.
 * @param message Custom success message.
 */
export function execute(message: string | undefined, callback: Class.Callable): void {
  const trySuccess = (): void => {
    success(message ? message : `Asynchronous callback performed successfully.`);
  };

  const tryFailure = (exception: any) => {
    failure(`Unexpected exception: '${exception.message}'.`);
  };

  try {
    const result = callback();
    if (result instanceof Promise) {
      result.then(trySuccess).catch(tryFailure);
    } else {
      trySuccess();
    }
  } catch (exception) {
    tryFailure(exception);
  }
}

/**
 * Check whether the input value is equals to the expected value or not.
 * @param value Input value.
 * @param expected Expected value.
 */
export function areEqual(value: any, expected: any): void {
  if (value === expected) {
    success(`Equality ok.`);
  } else {
    failure(`Equality failed, expected '${expected}' but received '${value}'.`);
  }
}
