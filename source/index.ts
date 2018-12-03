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
export const Describe = (): ClassDecorator => Helper.Describe();

/**
 * Decorates the specified class member to be public at runtime.
 * @returns Returns the decorator method.
 */
export const Public = (): MemberDecorator => Helper.Public();

/**
 * Decorates the specified class member to be protected at runtime.
 * @returns Returns the decorator method.
 */
export const Protected = (): MemberDecorator => Helper.Protected();

/**
 * Decorates the specified class member to be private at runtime.
 * @returns Returns the decorator method.
 */
export const Private = (): MemberDecorator => Helper.Private();

/**
 * Performs the specified callback using the specified context rules.
 * @param context Context instance.
 * @param callback Callback to be performed.
 * @param parameters Calling parameters.
 * @returns Returns the same result of the performed callback.
 * @throws Throws the same error of the performed callback.
 */
export const perform = async <T extends Object>(context: T, callback: Callable, ...parameters: any[]): Promise<any> =>
  Helper.perform(context, callback, ...parameters);

/**
 * Resolves the given wrapped context to the original context.
 * @param context Context to be resolved.
 * @returns Returns the original context.
 */
export const resolve = <T extends Object>(context: T): T => Helper.resolve(context);
