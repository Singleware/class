/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
export { Callable, Constructor, ClassDecorator, MemberDecorator } from './types';
export { Exception } from './exception';
/**
 * Declarations.
 */
import { Helper } from './helper';
import { Callable, ClassDecorator, MemberDecorator } from './types';
/**
 * Default null class for security reasons.
 */
export import Null = Helper.Null;
/**
 * Decorates the specified class to ensure its access rules at runtime.
 * @returns Returns the decorator method.
 */
export declare const Describe: () => ClassDecorator;
/**
 * Decorates the specified class member to be public at runtime.
 * @returns Returns the decorator method.
 */
export declare const Public: () => MemberDecorator;
/**
 * Decorates the specified class member to be protected at runtime.
 * @returns Returns the decorator method.
 */
export declare const Protected: () => MemberDecorator;
/**
 * Decorates the specified class member to be private at runtime.
 * @returns Returns the decorator method.
 */
export declare const Private: () => MemberDecorator;
/**
 * Decorates the specified class member to be an enumerable property at runtime.
 * @returns Returns the decorator method.
 */
export declare const Property: () => MemberDecorator;
/**
 * Performs the specified callback using the specified context rules.
 * @param context Context instance.
 * @param callback Callback to be performed.
 * @param parameters Calling parameters.
 * @returns Returns the same result of the performed callback.
 * @throws Throws the same error of the performed callback.
 */
export declare const perform: <T extends Object>(context: T, callback: Callable<any>, ...parameters: any[]) => Promise<any>;
/**
 * Resolves the given wrapped context to the original context.
 * @param context Context to be resolved.
 * @returns Returns the original context.
 */
export declare const resolve: <T extends Object>(context: T) => T;
