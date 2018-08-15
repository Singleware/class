/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import { Callable, ClassDecorator, MemberDecorator } from './types';
import { Trace } from './trace';
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
     * Decorates the specified property to be public at runtime.
     * @returns Returns the decorator method.
     */
    function Public(): MemberDecorator;
    /**
     * Decorates the specified property to be protected at runtime.
     * @returns Returns the decorator method.
     */
    function Protected(): MemberDecorator;
    /**
     * Decorates the specified property to be private at runtime.
     * @returns Returns the decorator method.
     */
    function Private(): MemberDecorator;
    /**
     * Gets the current information about the call stack.
     * @returns Returns an array containing the stack information.
     */
    function trace(): Trace[];
    /**
     * Updates the specified instance into the current context.
     * @param instance Context instance.
     */
    function update<T extends Object>(instance: T): void;
    /**
     * Calls the specified callback with the given parameters exposing only public members.
     * @param callback Method callback.
     * @param parameters Method parameters.
     * @returns Returns the same value from the called method.
     * @throws Throws the same exception from the called method.
     */
    function call(callback: Callable, ...parameters: any[]): any;
    /**
     * Binds the specified property descriptor to be called with the current access rules.
     * @param descriptor Property descriptor.
     * @returns Returns a new wrapped property descriptor.
     * @throws Throws an error when the specified property was not found.
     */
    function bindDescriptor(descriptor: PropertyDescriptor): PropertyDescriptor;
    /**
     * Binds the specified callback to be called with the current access rules.
     * @param callback Method callback.
     * @returns Returns the same value of the called method.
     * @throws Throws an error when the current context is not defined.
     */
    function bindCallback(callback: Callable): Callable;
    /**
     * Binds the specified promise to be called with the current access rules.
     * @param promise Promise object.
     * @returns Returns the asynchronous method to calls the wrapped promise.
     * @throws Throws an error when the current context is not defined.
     */
    function bindPromise<T>(promise: Promise<T>): Promise<T>;
    /**
     * Binds the specified callback, property descriptor or promise to be called with the current access rules.
     * @param input Method callback, property descriptor or promise.
     * @returns Returns the wrapped input.
     * @throws Throws an error when the current context is not defined.
     */
    function bind<T extends Object>(input: T): any;
}
