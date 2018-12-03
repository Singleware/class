/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */

/**
 * Type declaration for callable members.
 */
export type Callable<T = any> = (...parameters: any[]) => T;

/**
 * Type declaration for class constructors.
 */
export type Constructor<T extends Object = any> = new (...parameters: any[]) => T;

/**
 * Type declaration for class decorators.
 */
export type ClassDecorator = <T extends Object>(type: Constructor<T>) => any;

/**
 * Type declaration for member decorators.
 */
export type MemberDecorator = <T>(target: Object, property: string | symbol, descriptor?: TypedPropertyDescriptor<T>) => any;
