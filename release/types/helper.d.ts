/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import { ClassDecorator, MemberDecorator, Callable } from './types';
/**
 * Provide decorators and methods to protect classes at runtime.
 */
export declare namespace Helper {
    /**
     * Decorates the specified class to ensure its access rules at runtime.
     * @returns Returns the decorator method.
     */
    function Describe(): ClassDecorator;
    /**
     * Decorates the specified member to be public at runtime.
     * @returns Returns the decorator method.
     */
    function Public(): MemberDecorator;
    /**
     * Decorates the specified member to be protected at runtime.
     * @returns Returns the decorator method.
     */
    function Protected(): MemberDecorator;
    /**
     * Decorates the specified member to be private at runtime.
     * @returns Returns the decorator method.
     */
    function Private(): MemberDecorator;
    /**
     * Performs the specified callback using previously saved caller for the specified context.
     * @param context Context instance.
     * @param callback Callback to be performed.
     * @param args Callback arguments.
     * @returns Returns the same return of the performed callback.
     * @throws Throws an error when there is no previous caller to be restored.
     */
    function perform(context: Object, callback: Callable, ...args: any[]): Promise<any>;
}
