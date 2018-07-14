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
export type ClassConstructor<T> = new (...parameters: any[]) => T;

/**
 * Type declaration for class decorators.
 */
export type ClassDecorator = <T extends Object>(type: ClassConstructor<T>) => any;

/**
 * Type declaration for member decorators.
 */
export type MemberDecorator = (prototype: any, property: PropertyKey, descriptor?: PropertyDescriptor) => any;
