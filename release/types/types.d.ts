/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */

/**
 * Type declaration for callable members.
 */
export type Callable<T = any> = (...args: any[]) => T;

/**
 * Type declaration for class constructors.
 */
export type Constructor<T extends Object = any> = new (...args: any[]) => T;

/**
 * Type declaration for class decorators.
 */
export type ClassDecorator = <T extends Object>(type: Constructor<T>) => any;

/**
 * Type declaration for member decorators.
 */
export type MemberDecorator = (scope: Object | Function, property: PropertyKey, descriptor?: PropertyDescriptor) => any;
