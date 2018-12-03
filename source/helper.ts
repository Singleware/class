/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import { Callable, Constructor, ClassDecorator, MemberDecorator } from './types';
import { Exception } from './exception';

/**
 * Provide decorators and methods to protect classes at runtime.
 */
export namespace Helper {
  /**
   * Map to access the original proxy context.
   */
  const contextMap = new WeakMap<Object, Object>();

  /**
   * Map to access a context vault.
   */
  const vaultMap = new WeakMap<Object, any>();

  /**
   * Set list for locked classes.
   */
  const lockedSet = new WeakSet<Function | Constructor>();

  /**
   * Set list for wrapped members.
   */
  const memberSet = new WeakSet<Function>();

  /**
   * Set list for wrapped types.
   */
  const typeSet = new WeakSet<Constructor>();

  /**
   * Calling type to determine the current access rules.
   */
  let callingType!: Constructor;

  /**
   * Resolves the given proxy to its original context.
   * @param proxy Proxy to be resolved.
   * @returns Returns the resolved proxy context.
   */
  function getOriginalContext<T extends Object>(proxy: T): T {
    return <T>(contextMap.get(proxy) || proxy);
  }

  /**
   * Determines whether the specified type is derived from base type.
   * @param type Class type.
   * @param base Base class type.
   * @returns Returns true when the specified type is derived from base type, false otherwise.
   */
  function isDerived(type: Constructor, base: Constructor): boolean {
    while ((type = <Constructor>Reflect.getPrototypeOf(type)) && type.prototype) {
      if (type.prototype.constructor === base.prototype.constructor) {
        return true;
      }
    }
    return false;
  }

  /**
   * Determines whether the specified property is member of the given class type.
   * @param type Class type.
   * @param property Property name.
   * @returns Returns true when the specified property is a member, false otherwise.
   */
  function isMember<T extends Object>(type: Constructor<T>, property: string | symbol): boolean {
    do {
      if (Reflect.getOwnPropertyDescriptor(type.prototype, property) || Reflect.getOwnPropertyDescriptor(type, property)) {
        return true;
      }
    } while ((type = <Constructor>Reflect.getPrototypeOf(type)) && type.prototype && typeSet.has(type.prototype.constructor));
    return false;
  }

  /**
   * Wraps the specified context to ensure its access rules automatically in each method call.
   * @param type Class type.
   * @param context Class context.
   * @returns Returns the new generated proxy to the original context.
   */
  function wrapContext<T extends Object>(type: Constructor<T>, context: T): T {
    const proxy = new Proxy(context, {
      get: (target: T, property: string | symbol, receiver: any): any => {
        let value: any;
        if (!isMember(type, property)) {
          if ((value = Reflect.get(target, property, getOriginalContext(receiver))) && value instanceof Function) {
            return function(this: T, ...parameters: any[]): any {
              return value.apply(getOriginalContext(this), parameters);
            };
          }
        } else {
          if ((value = performCall(type, target, Reflect.get, [target, property, receiver])) && memberSet.has(value)) {
            return function(this: T, ...parameters: any[]): any {
              return performCall(type, this, value, parameters);
            };
          }
        }
        return value;
      },
      set: (target: T, property: string | symbol, value: any, receiver: any): boolean => {
        if (!isMember(type, property)) {
          return Reflect.set(target, property, value, getOriginalContext(receiver));
        } else {
          return performCall(type, target, Reflect.set, [target, property, value, receiver]);
        }
      }
    });
    contextMap.set(proxy, context);
    return proxy;
  }

  /**
   * Perform the specified callback with the given parameters.
   * @param type Calling class type.
   * @param context Calling context.
   * @param callback Calling member.
   * @param parameters Calling parameters.
   * @returns Returns the same result of the performed callback.
   * @throws Throws the same error of the performed callback.
   */
  function performCall<T extends Object>(type: Constructor<T>, context: T | undefined, callback: Function, parameters: any[]): any {
    const originalCalling = callingType;
    const currentContext = context ? wrapContext(type, getOriginalContext(context)) : context;
    try {
      callingType = type;
      return callback.apply(currentContext, parameters);
    } catch (exception) {
      throw exception;
    } finally {
      callingType = originalCalling;
    }
  }

  /**
   * Wraps the specified callback to be a public member.
   * @param type Class type.
   * @param property Property key.
   * @param callback Original member callback.
   * @returns Returns the wrapped callback.
   */
  function publicWrapper<T extends Object>(type: Constructor<T>, property: string | symbol, callback: Function): Function {
    const member = function(this: T, ...parameters: any[]): any {
      return performCall(type, this, callback, parameters);
    };
    memberSet.add(member);
    return member;
  }

  /**
   * Wraps the specified callback to be a protected member.
   * @param type Class type.
   * @param property Property key.
   * @param callback Original member callback.
   * @returns Returns the wrapped callback.
   * @throws Throws an error when the current calling type isn't the same type or instance of expected type.
   */
  function protectedWrapper<T extends Object>(type: Constructor<T>, property: string | symbol, callback: Function): Function {
    const member = function(this: T, ...parameters: any[]): any {
      if (!callingType || (callingType !== type && !isDerived(type, callingType) && !isDerived(callingType, type))) {
        throw new Exception(`Access to the protected member '${<string>property}' has been denied.`);
      }
      return performCall(type, this, callback, parameters);
    };
    memberSet.add(member);
    return member;
  }

  /**
   * Wraps the specified callback to be a private member.
   * @param type Class type.
   * @param property Property key.
   * @param callback Original member callback.
   * @returns Returns the wrapped callback.
   * @throws Throws an error when the current calling type isn't the same type of the expected type.
   */
  function privateWrapper<T extends Object>(type: Constructor<T>, property: string | symbol, callback: Function): Function {
    const member = function(this: T, ...parameters: any[]): any {
      if (callingType !== type) {
        throw new Exception(`Access to the private member '${<string>property}' has been denied.`);
      }
      return performCall(type, this, callback, parameters);
    };
    memberSet.add(member);
    return member;
  }

  /**
   * Locks the specified class constructor to returns its instance in a wrapped context.
   * @param type Class Type.
   * @returns Returns the locked class type.
   */
  function lockClass<T extends Object>(type: Constructor<T>): Constructor<T> {
    if (!lockedSet.has(type.prototype.constructor)) {
      const basePrototype = (<Constructor>Reflect.getPrototypeOf(type)).prototype;
      if (!basePrototype) {
        console.warn(`For security and compatibility reasons the class '${type.name}' must extends the default class Null.`);
      } else if (!typeSet.has(basePrototype.constructor)) {
        class ClassLocker extends basePrototype.constructor {
          constructor(...parameters: any[]) {
            return wrapContext<any>(type.prototype.constructor, super(...parameters));
          }
        }
        Reflect.setPrototypeOf(type, ClassLocker);
      }
      lockedSet.add(type.prototype.constructor);
    }
    return type;
  }

  /**
   * Wraps the specified class type.
   * @param type Class type.
   * @returns Returns the wrapped class type.
   * @throws Throws an error when the class was already wrapped.
   */
  function wrapClass<T extends Object>(type: Constructor<T>): Constructor<T> {
    if (typeSet.has(type.prototype.constructor)) {
      throw new Exception(`Access to the class has been denied.`);
    }
    typeSet.add(type.prototype.constructor);
    return new Proxy<Constructor<T>>(lockClass(type), {
      construct: (target: Constructor<T>, parameters: any[], derived: any): T => {
        const currentType = target.prototype.constructor;
        const derivedType = derived.prototype.constructor;
        const context = performCall(currentType, void 0, Reflect.construct, [target, parameters, derived]);
        return currentType !== derivedType ? wrapContext(callingType, getOriginalContext(context)) : getOriginalContext(context);
      }
    });
  }

  /**
   * Wraps the specified member with the given wrapper function.
   * @param target Member target.
   * @param property Property key.
   * @param descriptor Property descriptor.
   * @param wrapper Wrapper function.
   * @returns Returns the wrapped property descriptor.
   * @throws Throws an error when the class was already wrapped.
   */
  function wrapMember(target: Object, property: string | symbol, descriptor: PropertyDescriptor, wrapper: Function): PropertyDescriptor {
    const type = <Constructor>(target instanceof Function ? target : target.constructor).prototype.constructor;
    if (typeSet.has(type)) {
      throw new Exception(`Access to the class has been denied.`);
    }
    if (descriptor.value instanceof Function) {
      descriptor.value = wrapper(type, property, descriptor.value);
    } else {
      if (descriptor.get instanceof Function) {
        descriptor.get = wrapper(type, property, descriptor.get);
      }
      if (descriptor.set instanceof Function) {
        descriptor.set = wrapper(type, property, descriptor.set);
      }
    }
    return descriptor;
  }

  /**
   * Creates a new getter and setter member for the specified property.
   * @param target Member target.
   * @param property Property name.
   * @returns Returns the new member property descriptor.
   */
  function createMember(target: Object, property: string | symbol): PropertyDescriptor {
    const initial = target.hasOwnProperty(property) ? (<any>target)[property] : void 0;
    let vault;
    return <PropertyDescriptor>{
      get: function(): any {
        const context = getOriginalContext(this);
        if (!(vault = vaultMap.get(context))) {
          vaultMap.set(context, (vault = {}));
        }
        return property in vault ? vault[property] : (vault[property] = initial);
      },
      set: function(value: any): any {
        const context = getOriginalContext(this);
        if (!(vault = vaultMap.get(context))) {
          vaultMap.set(context, (vault = {}));
        }
        vault[property] = value;
      }
    };
  }

  /**
   * Default class for security and compatibility reasons.
   */
  export class Null {}

  /**
   * Decorates the specified class to ensure its access rules at runtime.
   * @returns Returns the decorator method.
   */
  export function Describe(): ClassDecorator {
    return <T extends Object>(target: Constructor<T>): Constructor<T> => {
      return wrapClass(target);
    };
  }

  /**
   * Decorates the specified class member to be public at runtime.
   * @returns Returns the decorator method.
   */
  export function Public(): MemberDecorator {
    return <T>(target: Object, property: string | symbol, descriptor?: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> => {
      return wrapMember(target, property, descriptor || createMember(target, property), publicWrapper);
    };
  }

  /**
   * Decorates the specified class member to be protected at runtime.
   * @returns Returns the decorator method.
   */
  export function Protected(): MemberDecorator {
    return <T>(target: Object, property: string | symbol, descriptor?: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> => {
      return wrapMember(target, property, descriptor || createMember(target, property), protectedWrapper);
    };
  }

  /**
   * Decorates the specified class member to be private at runtime.
   * @returns Returns the decorator method.
   */
  export function Private(): MemberDecorator {
    return <T>(target: Object, property: string | symbol, descriptor?: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> => {
      return wrapMember(target, property, descriptor || createMember(target, property), privateWrapper);
    };
  }

  /**
   * Performs the specified callback using the specified context rules.
   * @param context Context instance.
   * @param callback Callback to be performed.
   * @param parameters Calling parameters.
   * @returns Returns the same result of the performed callback.
   * @throws Throws an error when the provided context isn't valid or the same error of the performed callback.
   */
  export async function perform<T extends Object>(context: T, callback: Callable, ...parameters: any[]): Promise<any> {
    if (!contextMap.has(context)) {
      throw new Exception(`The provided context isn't a valid context.`);
    }
    const originalContext = getOriginalContext(context);
    const originalType = <Constructor>Reflect.getPrototypeOf(originalContext).constructor;
    return await performCall(originalType, originalContext, callback, parameters);
  }

  /**
   * Resolves the given wrapped context to the original context.
   * @param context Context to be resolved.
   * @returns Returns the original context.
   */
  export function resolve<T extends Object>(context: T): T {
    return getOriginalContext(context);
  }
}
