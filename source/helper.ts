/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import { Callable, ClassDecorator, MemberDecorator, ClassConstructor } from './types';
import { Entry } from './entry';
import { Trace } from './trace';

/**
 * Provide decorators and methods to protect classes at runtime.
 */
export namespace Helper {
  /**
   * Safe place to map all class instances data.
   */
  const vault: WeakMap<Object, any> = new WeakMap();

  /**
   * Safe place to map all entries of pending asynchronous functions.
   */
  const waiting: WeakMap<Object, Entry> = new WeakMap();

  /**
   * First call entry.
   */
  const head: Entry = {
    name: 'anonymous',
    context: void 0,
    prototype: void 0
  };

  /**
   * Safe place to put all function call entries.
   */
  var stack: Entry = head;

  /**
   * Check whether the current context is valid or not.
   */
  function contextValidate(): void {
    if (!stack.context || !stack.prototype) {
      throw new Error(`There is no current context.`);
    }
    if (stack.context === stack.prototype) {
      throw new Error('There is no resolved context, please call update() method.');
    }
  }

  /**
   * Restores the current stack for the given context.
   * @param context Method context.
   * @returns Returns true when the context was restored, false otherwise.
   */
  function contextRestore(context: any): boolean {
    if (!waiting.has(context)) {
      return false;
    }
    stack = <Entry>waiting.get(context);
    waiting.delete(context);
    return true;
  }

  /**
   * Resolves the current stack for the given context.
   * @param context Method context.
   * @param prototype Method prototype.
   * @returns Returns true when the context was resolved, false otherwise.
   */
  function contextResolve(context: any, prototype: any): boolean {
    if (stack.context !== prototype) {
      return false;
    }
    stack.context = context;
    return true;
  }

  /**
   * Insert the specified call entry into the next node of call stack.
   * @param entry Entry instance.
   * @returns Returns the inserted entry.
   */
  function insertEntry(entry: Entry): Entry {
    if ((entry.next = stack.next)) {
      (<Entry>stack.next).previous = entry;
    }
    stack.next = entry;
    return entry;
  }

  /**
   * Removes the specified call entry from the call stack.
   * @param entry Entry instance.
   * @returns Returns the removed entry.
   */
  function removeEntry(entry: Entry): Entry {
    const previous = <Entry>entry.previous;
    const next = <Entry>entry.next;
    if ((previous.next = next)) {
      next.previous = previous;
    }
    return entry;
  }

  /**
   * Calls asynchronously the specified callback setting the call entry to ensure its access rules.
   * @param entry Call entry.
   * @param callback Method callback.
   * @param parameters Method parameters.
   * @returns Returns the promise of the called method.
   */
  async function asyncWrappedCall(entry: Entry, callback: Callable, ...parameters: any[]): Promise<any> {
    try {
      stack = insertEntry(entry);
      const promise = callback.call(entry.context, ...parameters);
      const previous = <Entry>entry.previous;
      const result = await promise;
      if (previous.context === entry.context) {
        waiting.set(entry.context, previous);
      } else {
        waiting.delete(entry.context);
      }
      return result;
    } catch (exception) {
      throw exception;
    } finally {
      stack = <Entry>removeEntry(entry).previous;
    }
  }

  /**
   * Calls synchronously the specified callback setting the call entry to ensure its access rules.
   * @param entry Call entry.
   * @param callback Method callback.
   * @param parameters Method parameters.
   * @returns Returns the same value of the called method.
   */
  function syncWrappedCall(entry: Entry, callback: Callable, ...parameters: any[]): any {
    try {
      stack = insertEntry(entry);
      return callback.call(entry.context, ...parameters);
    } catch (exception) {
      throw exception;
    } finally {
      stack = <Entry>removeEntry(entry).previous;
    }
  }

  /**
   * Performs the specified callback setting the call entry to ensure its access rules.
   * @param context Method context.
   * @param prototype Method prototype.
   * @param callback Method callback.
   * @param parameters Method parameters.
   * @returns Returns the same value from the called method.
   * @throws Throws the same exception from the called method.
   */
  function wrappedCall(context: any, prototype: any, callback: Callable, ...parameters: any[]): any {
    const entry = { name: callback.name, context: context, prototype: prototype, previous: stack, next: void 0 };
    if (callback.constructor.name === 'AsyncFunction') {
      const saved = stack;
      const promise = asyncWrappedCall(entry, callback, ...parameters);
      stack = saved;
      return promise;
    } else {
      return syncWrappedCall(entry, callback, ...parameters);
    }
  }

  /**
   * Creates a new member with getter and setter to manage and hide class properties.
   * @param property Property name.
   * @param value Property value.
   * @returns Returns the created property descriptor.
   */
  function createMember(property: PropertyKey, value: any): PropertyDescriptor {
    let data;
    return {
      get: function(): any {
        return (data = vault.get(this)) ? data[property] : value;
      },
      set: function(value: any) {
        if (!(data = vault.get(this))) {
          vault.set(this, (data = {}));
        }
        data[property] = value;
      }
    };
  }

  /**
   * Wraps the specified property with the given callback to ensure its access rules at runtime.
   * @param wrapper Wrapper callback.
   * @param prototype Property prototype.
   * @param property Property name.
   * @param descriptor Property descriptor.
   * @returns Returns the specified property descriptor.
   */
  function wrapMember(wrapper: Callable, prototype: any, property: PropertyKey, descriptor: PropertyDescriptor): PropertyDescriptor {
    descriptor.enumerable = false;
    descriptor.configurable = false;
    if (descriptor.value instanceof Function) {
      descriptor.writable = false;
      wrapper('value', prototype, property, descriptor);
    } else {
      if (descriptor.set instanceof Function) {
        wrapper('set', prototype, property, descriptor);
      }
      if (descriptor.get instanceof Function) {
        descriptor.enumerable = true;
        wrapper('get', prototype, property, descriptor);
      }
    }
    return descriptor;
  }

  /**
   * Wrapper to set the specified property descriptor as public member at runtime.
   * @param type Property type.
   * @param prototype Property prototype.
   * @param property Property name.
   * @param descriptor Property descriptor.
   */
  function wrapAsPublic(type: string, prototype: any, property: PropertyKey, descriptor: PropertyDescriptor): void {
    const callback = (<any>descriptor)[type];
    (<any>descriptor)[type] = function callAsPublic(this: any, ...parameters: any[]): any {
      contextRestore(this) || contextResolve(this, prototype);
      return wrappedCall(this, prototype, callback, ...parameters);
    };
  }

  /**
   * Wrapper to set the specified property descriptor as protected member at runtime.
   * @param type Property type.
   * @param prototype Property prototype.
   * @param property Property name.
   * @param descriptor Property descriptor.
   * @throws Throws a type error when the access to the wrapped method is denied.
   */
  function wrapAsProtected(type: string, prototype: any, property: PropertyKey, descriptor: PropertyDescriptor): void {
    const callback = (<any>descriptor)[type];
    (<any>descriptor)[type] = function callAsProtected(this: any, ...parameters: any[]): any {
      contextRestore(this) || contextResolve(this, prototype);
      const constructor = prototype.constructor;
      if (!stack.context || (!(stack.context instanceof constructor) && !(stack.context.constructor instanceof constructor))) {
        throw new TypeError(`Access to protected member '${property as string}' has been denied.`);
      }
      return wrappedCall(this, prototype, callback, ...parameters);
    };
  }

  /**
   * Wrapper to set the specified property descriptor as private member at runtime.
   * @param type Property type.
   * @param prototype Property prototype.
   * @param property Property name.
   * @param descriptor Property descriptor.
   * @throws Throws a type error when the access to the wrapped method is denied.
   */
  function wrapAsPrivate(type: string, prototype: any, property: PropertyKey, descriptor: PropertyDescriptor): void {
    const callback = (<any>descriptor)[type];
    (<any>descriptor)[type] = function callAsPrivate(this: any, ...parameters: any[]): any {
      contextRestore(this) || contextResolve(this, prototype);
      if (!stack.prototype || (stack.prototype !== prototype && stack.prototype.constructor !== prototype)) {
        throw new TypeError(`Access to private member '${property as string}' has been denied.`);
      }
      return wrappedCall(this, prototype, callback, ...parameters);
    };
  }

  /**
   * Decorates the specified class to ensure its access rules at runtime.
   * @returns Returns the decorator method.
   */
  export function Describe(): ClassDecorator {
    return <T extends Object>(type: ClassConstructor<T>): ClassConstructor<T> => {
      return new Proxy(type, {
        construct: <T extends Object>(type: ClassConstructor<T>, parameters: IArguments, target: any): T => {
          return wrappedCall(type.prototype, type.prototype, Reflect.construct, type, parameters, target);
        }
      });
    };
  }

  /**
   * Decorates the specified property to be public at runtime.
   * @returns Returns the decorator method.
   */
  export function Public(): MemberDecorator {
    return (prototype: any, property: PropertyKey, descriptor?: PropertyDescriptor): PropertyDescriptor => {
      return wrapMember(wrapAsPublic, prototype, property, descriptor || createMember(property, prototype[property]));
    };
  }

  /**
   * Decorates the specified property to be protected at runtime.
   * @returns Returns the decorator method.
   */
  export function Protected(): MemberDecorator {
    return (prototype: any, property: PropertyKey, descriptor?: PropertyDescriptor): PropertyDescriptor => {
      return wrapMember(wrapAsProtected, prototype, property, descriptor || createMember(property, prototype[property]));
    };
  }

  /**
   * Decorates the specified property to be private at runtime.
   * @returns Returns the decorator method.
   */
  export function Private(): MemberDecorator {
    return (prototype: any, property: PropertyKey, descriptor?: PropertyDescriptor): PropertyDescriptor => {
      return wrapMember(wrapAsPrivate, prototype, property, descriptor || createMember(property, prototype[property]));
    };
  }

  /**
   * Gets the current information about the call stack.
   * @returns Returns an array containing the stack information.
   */
  export function trace(): Trace[] {
    const stack = [];
    let current = head;
    while (current) {
      stack.push({
        context: current.prototype ? current.prototype.constructor.name : 'global',
        method: current.name
      });
      current = <Entry>current.next;
    }
    return stack;
  }

  /**
   * Updates the specified instance into the current context.
   * @param instance Context instance.
   */
  export function update<T extends Object>(instance: T): void {
    if (stack.context === stack.prototype) {
      if (Object.getPrototypeOf(instance) !== stack.prototype) {
        throw new Error(`The specified instance must be of type "${stack.prototype.constructor.name}"`);
      }
      stack.context = instance;
    }
  }

  /**
   * Calls the specified callback with the given parameters exposing only public members.
   * @param callback Method callback.
   * @param parameters Method parameters.
   * @returns Returns the same value from the called method.
   * @throws Throws the same exception from the called method.
   */
  export function call(callback: Callable, ...parameters: any[]): any {
    return wrappedCall(void 0, void 0, callback, ...parameters);
  }

  /**
   * Binds the specified property descriptor to be called with the current access rules.
   * @param descriptor Property descriptor.
   * @returns Returns a new wrapped property descriptor.
   * @throws Throws an error when the specified property was not found.
   */
  export function bindDescriptor(descriptor: PropertyDescriptor): PropertyDescriptor {
    const modified = <PropertyDescriptor>{ ...descriptor };
    if (modified.value) {
      modified.value = bindCallback(modified.value);
    } else {
      if (modified.get) {
        modified.get = bindCallback(modified.get);
      }
      if (modified.set) {
        modified.set = bindCallback(modified.set);
      }
    }
    return modified;
  }

  /**
   * Binds the specified callback to be called with the current access rules.
   * @param callback Method callback.
   * @returns Returns the same value of the called method.
   * @throws Throws an error when the current context is not defined.
   */
  export function bindCallback(callback: Callable): Callable {
    contextValidate();
    const context = stack.context;
    const prototype = stack.prototype;
    return function(...parameters: any[]) {
      return wrappedCall(context, prototype, callback, ...parameters);
    };
  }

  /**
   * Binds the specified promise to be called with the current access rules.
   * @param promise Promise object.
   * @returns Returns the asynchronous method to calls the wrapped promise.
   * @throws Throws an error when the current context is not defined.
   */
  export function bindPromise<T>(promise: Promise<T>): Promise<T> {
    contextValidate();
    const saved = stack;
    promise.finally(() => {
      stack = saved;
    });
    return promise;
  }

  /**
   * Binds the specified callback, property descriptor or promise to be called with the current access rules.
   * @param input Method callback, property descriptor or promise.
   * @returns Returns the wrapped input.
   * @throws Throws an error when the current context is not defined.
   */
  export function bind<T extends Object>(input: T): any {
    if (input instanceof Function) {
      return bindCallback(<any>input);
    } else if (input instanceof Promise) {
      return bindPromise(<any>input);
    } else if (input instanceof Object) {
      return bindDescriptor(<any>input);
    } else {
      throw new TypeError(`Unsupported bind input format, use: Function, Promise or Descriptor object.`);
    }
  }
}
