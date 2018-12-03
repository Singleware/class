"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 *
 * Test access rules and calling order in inheritance.
 */
const Class = require("../source");
const Tester = require("./helper");
// Tests
console.log('Inheritance');
/**
 * Test scenario A
 */
Tester.execute(`Call overridden methods from base to derived and goes to base again.`, () => {
    let Base = class Base extends Class.Null {
        methodA() {
            this.methodB();
        }
        methodB() {
            throw new Error(`Method does not overwritten.`);
        }
        methodE() { }
    };
    __decorate([
        Class.Public()
    ], Base.prototype, "methodA", null);
    __decorate([
        Class.Protected()
    ], Base.prototype, "methodB", null);
    __decorate([
        Class.Protected()
    ], Base.prototype, "methodE", null);
    Base = __decorate([
        Class.Describe()
    ], Base);
    let Middle = class Middle extends Base {
        methodB() {
            this.methodC();
        }
        methodC() {
            throw new Error(`Method does not overwritten.`);
        }
        methodD() {
            this.methodE();
        }
    };
    __decorate([
        Class.Protected()
    ], Middle.prototype, "methodB", null);
    __decorate([
        Class.Protected()
    ], Middle.prototype, "methodC", null);
    __decorate([
        Class.Protected()
    ], Middle.prototype, "methodD", null);
    Middle = __decorate([
        Class.Describe()
    ], Middle);
    let Derived = class Derived extends Middle {
        methodC() {
            super.methodD();
        }
    };
    __decorate([
        Class.Protected()
    ], Derived.prototype, "methodC", null);
    Derived = __decorate([
        Class.Describe()
    ], Derived);
    new Derived().methodA();
});
/**
 * Test scenario B
 */
Tester.execute(`Access inherited public and protected properties.`, () => {
    let Base = class Base extends Class.Null {
        constructor() {
            super(...arguments);
            this.propertyA = 10;
            this.baseValue = 1;
        }
    };
    __decorate([
        Class.Protected()
    ], Base.prototype, "propertyA", void 0);
    __decorate([
        Class.Public()
    ], Base.prototype, "baseValue", void 0);
    Base = __decorate([
        Class.Describe()
    ], Base);
    let Middle = class Middle extends Base {
        constructor() {
            super(...arguments);
            this.propertyB = 20;
            this.middleValue = 2;
        }
    };
    __decorate([
        Class.Protected()
    ], Middle.prototype, "propertyB", void 0);
    __decorate([
        Class.Public()
    ], Middle.prototype, "middleValue", void 0);
    Middle = __decorate([
        Class.Describe()
    ], Middle);
    let Derived = class Derived extends Middle {
        get derivedValue() {
            return this.propertyA + this.propertyB;
        }
    };
    __decorate([
        Class.Public()
    ], Derived.prototype, "derivedValue", null);
    Derived = __decorate([
        Class.Describe()
    ], Derived);
    const instance = new Derived();
    Tester.areEqual(instance.baseValue, 1);
    Tester.areEqual(instance.middleValue, 2);
    Tester.areEqual(instance.derivedValue, 30);
});
/**
 * Test scenario C
 */
Tester.execute(`Access inherited method that call private methods and properties.`, () => {
    let Base = class Base extends Class.Null {
        methodB() { }
        methodA() {
            this.methodB();
            this.propertyC = 10;
        }
    };
    __decorate([
        Class.Private()
    ], Base.prototype, "methodB", null);
    __decorate([
        Class.Private()
    ], Base.prototype, "propertyC", void 0);
    __decorate([
        Class.Public()
    ], Base.prototype, "methodA", null);
    Base = __decorate([
        Class.Describe()
    ], Base);
    let Derived = class Derived extends Base {
    };
    Derived = __decorate([
        Class.Describe()
    ], Derived);
    new Derived().methodA();
});
