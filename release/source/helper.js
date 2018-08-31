"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const exception_1 = require("./exception");
/**
 * Provide decorators and methods to protect classes at runtime.
 */
var Helper;
(function (Helper) {
    /**
     * All proxies.
     */
    const allProxies = new WeakMap();
    /**
     * All classes.
     */
    const allClasses = new WeakMap();
    /**
     * All saved callers.
     */
    const allSavedCallers = new WeakMap();
    /**
     * All instances types.
     */
    const allTrustedInstances = new WeakMap();
    /**
     * All instances data.
     */
    const allInstancesData = new WeakMap();
    /**
     * All public members.
     */
    const allPublicMembers = new WeakMap();
    /**
     * All protected members.
     */
    const allProtectedMembers = new WeakMap();
    /**
     * All private members.
     */
    const allPrivateMembers = new WeakMap();
    /**
     * Final class type.
     */
    const finalType = Reflect.getPrototypeOf(Function);
    /**
     * Active class type.
     */
    var activeCaller = {};
    /**
     * Register the specified class instance as trusted for the specified class type.
     * @param instance Class instance.
     * @param type Class type.
     * @returns Returns the specified instance.
     */
    function addTrustedInstance(instance, type) {
        allTrustedInstances.set(instance, type);
        return instance;
    }
    /**
     * Check whether the specified instance is trusted for the specified class type.
     * @param instance Class instance.
     * @param type Class type.
     * @returns Returns true when the specified instance is trusted for the given class type, false otherwise.
     */
    function isTrustedInstance(instance, type) {
        return allTrustedInstances.get(instance) === type;
    }
    /**
     * Register the specified caller for the specified context.
     * @param context Context instance.
     * @param caller Context caller.
     * @returns Returns the specified context.
     */
    function registerCaller(context, caller) {
        allSavedCallers.set(context, caller);
        return context;
    }
    /**
     * Resolves the previous saved caller for the specified context.
     * @param context Context instance.
     * @returns Returns the previously saved caller or undefined when there is no caller.
     */
    function resolveCaller(context) {
        return allSavedCallers.get(context);
    }
    /**
     * Unregister the current caller for the specified context.
     * @param context Context instance.
     * @returns Returns the specified context.
     */
    function removeCaller(context) {
        allSavedCallers.delete(context);
        return context;
    }
    /**
     * Register the specified context with the specified handlers.
     * @param context Context instance.
     * @param handlers Handler to the generated proxy.
     * @returns Returns the generated proxy.
     */
    function registerContext(context, handlers) {
        const resolved = resolveContext(context);
        const proxy = new Proxy(resolved, handlers);
        allProxies.set(proxy, resolved);
        return proxy;
    }
    /**
     * Resolves a context proxy into the original context.
     * @param context Proxy context.
     * @returns Returns the original context.
     */
    function resolveContext(context) {
        return allProxies.get(context) || context;
    }
    /**
     * Register the resolved class type for the specified class type.
     * @param type Class type.
     * @returns Returns the specified class.
     */
    function registerClass(type) {
        allClasses.set(resolveContext(type), type);
        return type;
    }
    /**
     * Gets the class type for the specified instance.
     * @param instance Context instance.
     * @returns Returns the class type for the specified instance.
     */
    function getClass(instance) {
        return resolveContext(Reflect.getPrototypeOf(instance).constructor);
    }
    /**
     * Gets the base class of the specified class type.
     * @param type Class type.
     * @returns Returns the base class of the specified class type.
     */
    function getBaseClass(type) {
        return resolveContext(Reflect.getPrototypeOf(type));
    }
    /**
     * Check whether the specified class type is registered or not.
     * @param type Class type.
     * @returns Returns true when the class is registered, false otherwise.
     */
    function isClassType(type) {
        return allClasses.has(resolveContext(type));
    }
    /**
     * Register the specified member.
     * @param table Member table.
     * @param property Member property name.
     * @param callback Member callback.
     * @param wrapper Member callback wrapper.
     * @returns Returns the specified callback wrapper.
     * @throws Throws an error when the specified member is already registered.
     */
    function addMember(table, property, callback, wrapper) {
        if (isPublic(wrapper) || isProtected(wrapper) || isPrivate(wrapper)) {
            throw new exception_1.Exception(`Member '${property}' is already registered.`);
        }
        table.set(wrapper, callback);
        return wrapper;
    }
    /**
     * Check whether the specified callback is a public member or not.
     * @param callback Callback to be verified.
     * @returns Returns true when the callback is a public member, false otherwise.
     */
    function isPublic(callback) {
        return allPublicMembers.has(callback);
    }
    /**
     * Check whether the specified callback is a protected member or not.
     * @param callback Callback to be verified.
     * @returns Returns true when the callback is a protected member, false otherwise.
     */
    function isProtected(callback) {
        return allProtectedMembers.has(callback);
    }
    /**
     * Check whether the specified callback is a private member or not.
     * @param callback Callback to be verified.
     * @returns Returns true when the callback is a private member, false otherwise.
     */
    function isPrivate(callback) {
        return allPrivateMembers.has(callback);
    }
    /**
     * Check whether the specified class type is derived from the specified base class.
     * @param type Class type.
     * @param base Base class type.
     * @returns Returns true when the specified class type is derived from the base class type, false otherwise.
     */
    function isDerivedFrom(type, base) {
        while ((type = getBaseClass(type)) && type !== finalType) {
            if (type === base) {
                return true;
            }
        }
        return false;
    }
    /**
     * Resolves the specified callback setting up the rules for next calls based on the current caller.
     * @param context Current context.
     * @param caller Current caller class.
     * @param callback Callback.
     * @param args Callback arguments.
     * @returns Returns the same value obtained from the performed callback.
     */
    function resolveCallback(context, caller, callback, ...args) {
        const savedCaller = activeCaller;
        try {
            activeCaller = resolveContext(caller);
            const result = callback.apply(context, args);
            if (context && result instanceof Promise) {
                registerCaller(context, caller);
                result.finally(() => removeCaller(context));
            }
            return result;
        }
        catch (exception) {
            throw exception;
        }
        finally {
            activeCaller = savedCaller;
        }
    }
    /**
     * Resolves the specified getter setting up the rules for next calls based on the current caller.
     * @param context Getter context.
     * @param prototype Getter prototype.
     * @param callback Getter callback.
     * @param value Determines whether the getter value must be resolved to a value or not.
     * @returns Returns the getter value or the wrapped getter callback.
     */
    function resolveGetter(table, context, prototype, callback, value) {
        if (value) {
            return resolveCallback(context, prototype, table.get(callback));
        }
        else {
            return function (...args) {
                return resolveCallback(context, prototype, table.get(callback), ...args);
            };
        }
    }
    /**
     * Resolves the specified setter setting up the rules for next calls based on the current caller.
     * @param context Setter context.
     * @param prototype Setter prototype.
     * @param callback Setter callback.
     * @param value Value to be set.
     * @returns Returns true when the setter is performed, false otherwise.
     */
    function resolveSetter(table, context, prototype, callback, value) {
        resolveCallback(context, prototype, table.get(callback), value);
        return true;
    }
    /**
     * Get the specified property looking at internal members.
     * @param context Context instance.
     * @param scope Context scope.
     * @param property Property name.
     * @param receiver Receiver.
     * @param instance Determines whether the context is an instance or not.
     * @returns Returns the property found or undefined when the property does not exists.
     * @throws Throws an error when the property found is an internal base member.
     */
    function internalGetter(context, scope, property, receiver, instance) {
        const primary = instance ? getClass(context) : context;
        let prototype = instance ? Reflect.getPrototypeOf(context) : context;
        let type = primary;
        let descriptor;
        do {
            if ((descriptor = Reflect.getOwnPropertyDescriptor(prototype, property))) {
                const member = (descriptor.get || descriptor.value);
                const getter = descriptor.get !== void 0;
                if (isPublic(member)) {
                    return resolveGetter(allPublicMembers, internalWrapper(context, type, instance), type, member, getter);
                }
                else if (isProtected(member)) {
                    return resolveGetter(allProtectedMembers, internalWrapper(context, type, instance), type, member, getter);
                }
                else if (isPrivate(member)) {
                    if (type !== primary && type !== scope && activeCaller !== type) {
                        throw new exception_1.Exception(`Access to the private member '${property}' has been denied.`);
                    }
                    else {
                        return resolveGetter(allPrivateMembers, internalWrapper(context, type, instance), type, member, getter);
                    }
                }
                break;
            }
            prototype = Reflect.getPrototypeOf(prototype);
        } while ((type = getBaseClass(type)) !== finalType);
        return Reflect.get(context, property, receiver);
    }
    /**
     * Set the specified value into the given property looking at internal members.
     * @param context Context instance.
     * @param scope Context scope.
     * @param property Property to be changed.
     * @param value New value.
     * @param receiver Receiver.
     * @param instance Determines whether the context is an instance or not.
     * @returns Returns true when the property was changed, false otherwise.
     * @throws Throws an error when the property found is an internal base member.
     */
    function internalSetter(context, scope, property, value, receiver, instance) {
        const primary = instance ? getClass(context) : context;
        let prototype = instance ? Reflect.getPrototypeOf(context) : context;
        let type = primary;
        let descriptor;
        do {
            if ((descriptor = Reflect.getOwnPropertyDescriptor(prototype, property))) {
                const member = descriptor.set;
                if (isPublic(member)) {
                    return resolveSetter(allPublicMembers, internalWrapper(context, type, instance), type, member, value);
                }
                else if (isProtected(member)) {
                    return resolveSetter(allProtectedMembers, internalWrapper(context, type, instance), type, member, value);
                }
                else if (isPrivate(member)) {
                    if (type !== primary && type !== scope && activeCaller !== type) {
                        throw new exception_1.Exception(`Access to the private member '${property}' has been denied.`);
                    }
                    else {
                        return resolveSetter(allPrivateMembers, internalWrapper(context, type, instance), type, member, value);
                    }
                }
                break;
            }
            prototype = Reflect.getPrototypeOf(prototype);
        } while ((type = getBaseClass(type)) !== finalType);
        return Reflect.set(context, property, value, receiver);
    }
    /**
     * Get the specified property looking at external members.
     * @param context Context instance.
     * @param property Property name.
     * @param receiver Receiver.
     * @param instance Determines whether the context is an instance or not.
     * @returns Returns the property found or undefined when the property does not exists.
     * @throws Throws an error when the property fund is an internal member.
     */
    function externalGetter(context, property, receiver, instance) {
        let type = instance ? getClass(context) : context;
        let prototype = instance ? Reflect.getPrototypeOf(context) : context;
        let descriptor;
        do {
            if ((descriptor = Reflect.getOwnPropertyDescriptor(prototype, property))) {
                const member = (descriptor.get || descriptor.value);
                const getter = descriptor.get !== void 0;
                if (isPublic(member)) {
                    return resolveGetter(allPublicMembers, internalWrapper(context, type, instance), type, member, getter);
                }
                else if (isProtected(member)) {
                    if (activeCaller !== type && !isDerivedFrom(activeCaller, type)) {
                        throw new exception_1.Exception(`Access to the protected member '${property}' has been denied.`);
                    }
                    else {
                        return resolveGetter(allProtectedMembers, internalWrapper(context, type, instance), type, member, getter);
                    }
                }
                else if (isPrivate(member)) {
                    if (activeCaller !== type) {
                        throw new exception_1.Exception(`Access to the private member '${property}' has been denied.`);
                    }
                    else {
                        return resolveGetter(allPrivateMembers, internalWrapper(context, type, instance), type, member, getter);
                    }
                }
                break;
            }
            prototype = Reflect.getPrototypeOf(prototype);
        } while ((type = getBaseClass(type)) !== finalType);
        return Reflect.get(context, property, receiver);
    }
    /**
     * Set the specified value into the given property looking at external members.
     * @param context Context instance.
     * @param property Property to be changed.
     * @param value New value.
     * @param receiver Receiver.
     * @param instance Determines whether the context is an instance or not.
     * @returns Returns true when the property was changed, false otherwise.
     * @throws Throws an error when the property found is an internal member.
     */
    function externalSetter(context, property, value, receiver, instance) {
        let type = instance ? getClass(context) : context;
        let prototype = instance ? Reflect.getPrototypeOf(context) : context;
        let descriptor;
        do {
            if ((descriptor = Reflect.getOwnPropertyDescriptor(prototype, property))) {
                const member = descriptor.set;
                if (isPublic(member)) {
                    return resolveSetter(allPublicMembers, internalWrapper(context, type, instance), type, member, value);
                }
                else if (isProtected(member)) {
                    if (activeCaller !== type && !isDerivedFrom(activeCaller, type)) {
                        throw new exception_1.Exception(`Access to the protected member '${property}' has been denied.`);
                    }
                    else {
                        return resolveSetter(allProtectedMembers, internalWrapper(context, type, instance), type, member, value);
                    }
                }
                else if (isPrivate(member)) {
                    if (activeCaller !== type) {
                        throw new exception_1.Exception(`Access to the private member '${property}' has been denied.`);
                    }
                    else {
                        return resolveSetter(allPrivateMembers, internalWrapper(context, type, instance), type, member, value);
                    }
                }
                break;
            }
            prototype = Reflect.getPrototypeOf(prototype);
        } while ((type = getBaseClass(type)) !== finalType);
        return Reflect.set(context, property, value, receiver);
    }
    /**
     * Wraps the specified context to be an internal context.
     * @param context Context instance.
     * @param scope Context scope.
     * @param instance Determines whether the context is an instance or not.
     * @returns Returns the wrapped context.
     */
    function internalWrapper(context, scope, instance) {
        return registerContext(context, {
            get: (target, property, receiver) => {
                return internalGetter(target, scope, property, receiver, instance);
            },
            set: (target, property, value, receiver) => {
                return internalSetter(target, scope, property, value, receiver, instance);
            }
        });
    }
    /**
     * Wraps the specified context to be an external context.
     * @param context Context instance.
     * @param instance Determines whether the context is an instance or not.
     * @returns Returns the wrapped context.
     */
    function externalWrapper(context, instance) {
        return registerContext(context, {
            get: (target, property, receiver) => {
                return externalGetter(target, property, receiver, instance);
            },
            set: (target, property, value, receiver) => {
                return externalSetter(target, property, value, receiver, instance);
            }
        });
    }
    /**
     * Wrapper to make the specified member as public at runtime.
     * @param type Member class type.
     * @param property Member Property name.
     * @param callback Member callback.
     * @returns Returns the wrapped callback.
     */
    function publicWrapper(type, property, callback) {
        return addMember(allPublicMembers, property, callback, function (...args) {
            if (activeCaller !== type) {
                return callback.call(internalWrapper(this, type, true), ...args);
            }
            return callback.call(this, ...args);
        });
    }
    /**
     * Wrapper to make the specified member protected at runtime.
     * @param type Member class type.
     * @param property Member Property name.
     * @param callback Member callback.
     * @returns Returns the wrapped callback.
     * @throws Throws an error when the caller is not a type or instance as the member of the specified class.
     */
    function protectedWrapper(type, property, callback) {
        return addMember(allProtectedMembers, property, callback, function (...args) {
            if (activeCaller === type || isTrustedInstance(this, type)) {
                return callback.call(this, ...args);
            }
            else if (isDerivedFrom(activeCaller, type) || isDerivedFrom(type, activeCaller)) {
                return callback.call(internalWrapper(this, type, true), ...args);
            }
            else {
                throw new exception_1.Exception(`Access to the protected member '${property}' has been denied.`);
            }
        });
    }
    /**
     * Wrapper to make the specified member private at runtime.
     * @param type Member class type.
     * @param property Member property name.
     * @param callback Member callback.
     * @returns Returns the wrapped callback.
     * @throws Throws an error when the caller is not of the same type as the member of the specified class.
     */
    function privateWrapper(type, property, callback) {
        return addMember(allPrivateMembers, property, callback, function (...args) {
            if (activeCaller !== type && !isTrustedInstance(this, type)) {
                throw new exception_1.Exception(`Access to the private member '${property}' has been denied.`);
            }
            return callback.call(this, ...args);
        });
    }
    /**
     * Wraps the specified property to ensure its rules at runtime.
     * @param scope Property scope.
     * @param property Property name.
     * @returns Returns the wrapped descriptor.
     */
    function wrapProperty(scope, property) {
        let value = scope.hasOwnProperty(property) ? scope[property] : void 0;
        return {
            get: function () {
                const data = allInstancesData.get(resolveContext(this));
                return data ? data[property] : value;
            },
            set: function (value) {
                const context = resolveContext(this);
                let data = allInstancesData.get(context);
                if (!data) {
                    allInstancesData.set(context, (data = {}));
                }
                data[property] = value;
            }
        };
    }
    /**
     * Wraps the specified member to ensure its access rules at runtime.
     * @param scope Member scope.
     * @param property Member property name.
     * @param descriptor Member descriptor.
     * @param wrapper Member wrapper.
     * @returns Returns the wrapped descriptor.
     * @throws Throws an error when the class is already registered.
     */
    function wrapMember(scope, property, descriptor, wrapper) {
        const type = scope instanceof Function ? scope : scope.constructor;
        if (isClassType(type)) {
            throw new exception_1.Exception(`Access to the class has been denied.`);
        }
        if (descriptor.value instanceof Function) {
            descriptor.value = wrapper(type, property, descriptor.value);
        }
        else {
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
     * Wraps the specified class to ensure its access rules at runtime.
     * @param type Class type.
     * @returns Returns the wrapped class.
     */
    function wrapClass(type) {
        return registerContext(type, {
            construct: (target, args, derived) => {
                const resolved = resolveContext(derived);
                const instance = addTrustedInstance(resolveCallback(void 0, target, Reflect.construct, target, args, derived), target);
                return target === resolved ? externalWrapper(instance, true) : internalWrapper(instance, resolved, true);
            },
            get: (target, property, receiver) => {
                return externalGetter(target, property, receiver, false);
            },
            set: (target, property, value, receiver) => {
                return externalSetter(target, property, value, receiver, false);
            }
        });
    }
    /**
     * Decorates the specified class to ensure its access rules at runtime.
     * @returns Returns the decorator method.
     */
    function Describe() {
        return (type) => {
            return registerClass(wrapClass(type));
        };
    }
    Helper.Describe = Describe;
    /**
     * Decorates the specified member to be public at runtime.
     * @returns Returns the decorator method.
     */
    function Public() {
        return (scope, property, descriptor) => {
            return wrapMember(scope, property, descriptor || wrapProperty(scope, property), publicWrapper);
        };
    }
    Helper.Public = Public;
    /**
     * Decorates the specified member to be protected at runtime.
     * @returns Returns the decorator method.
     */
    function Protected() {
        return (scope, property, descriptor) => {
            return wrapMember(scope, property, descriptor || wrapProperty(scope, property), protectedWrapper);
        };
    }
    Helper.Protected = Protected;
    /**
     * Decorates the specified member to be private at runtime.
     * @returns Returns the decorator method.
     */
    function Private() {
        return (scope, property, descriptor) => {
            return wrapMember(scope, property, descriptor || wrapProperty(scope, property), privateWrapper);
        };
    }
    Helper.Private = Private;
    /**
     * Performs the specified callback using previously saved caller for the specified context.
     * @param context Context instance.
     * @param callback Callback to be performed.
     * @param args Callback arguments.
     * @returns Returns the same return of the performed callback.
     * @throws Throws an error when there is no previous caller to be restored.
     */
    async function perform(context, callback, ...args) {
        const caller = resolveCaller(context);
        if (!caller) {
            throw new exception_1.Exception(`There is no stored caller to be restored.`);
        }
        return await resolveCallback(context, caller, callback, ...args);
    }
    Helper.perform = perform;
})(Helper = exports.Helper || (exports.Helper = {}));
