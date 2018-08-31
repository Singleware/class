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
 * Test access rules and calling order in static inheritance.
 */
const Class = require("../source");
const Tester = require("./helper");
// Tests
console.log('Inheritance.Static');
/**
 * Test scenario A
 */
Tester.execute(`Call overridden static methods from base to derived and goes to base again.`, () => {
    let Base = class Base {
        static methodA() {
            this.methodB();
        }
        static methodB() {
            throw new Error(`Method does not overwritten.`);
        }
        static methodE() { }
    };
    __decorate([
        Class.Public()
    ], Base, "methodA", null);
    __decorate([
        Class.Protected()
    ], Base, "methodB", null);
    __decorate([
        Class.Protected()
    ], Base, "methodE", null);
    Base = __decorate([
        Class.Describe()
    ], Base);
    let Middle = class Middle extends Base {
        static methodB() {
            this.methodC();
        }
        static methodC() {
            throw new Error(`Method does not overwritten.`);
        }
        static methodD() {
            this.methodE();
        }
    };
    __decorate([
        Class.Protected()
    ], Middle, "methodB", null);
    __decorate([
        Class.Protected()
    ], Middle, "methodC", null);
    __decorate([
        Class.Protected()
    ], Middle, "methodD", null);
    Middle = __decorate([
        Class.Describe()
    ], Middle);
    let Derived = class Derived extends Middle {
        static methodC() {
            super.methodD();
        }
    };
    __decorate([
        Class.Protected()
    ], Derived, "methodC", null);
    Derived = __decorate([
        Class.Describe()
    ], Derived);
    Derived.methodA();
});
/**
 * Test scenario B
 */
Tester.execute(`Access inherited static public and static protected properties.`, () => {
    let Base = class Base {
    };
    Base.propertyA = 10;
    Base.baseValue = 1;
    __decorate([
        Class.Protected()
    ], Base, "propertyA", void 0);
    __decorate([
        Class.Public()
    ], Base, "baseValue", void 0);
    Base = __decorate([
        Class.Describe()
    ], Base);
    let Middle = class Middle extends Base {
    };
    Middle.propertyB = 20;
    Middle.middleValue = 2;
    __decorate([
        Class.Protected()
    ], Middle, "propertyB", void 0);
    __decorate([
        Class.Public()
    ], Middle, "middleValue", void 0);
    Middle = __decorate([
        Class.Describe()
    ], Middle);
    let Derived = class Derived extends Middle {
        static get derivedValue() {
            return this.propertyA + this.propertyB;
        }
    };
    __decorate([
        Class.Public()
    ], Derived, "derivedValue", null);
    Derived = __decorate([
        Class.Describe()
    ], Derived);
    Tester.areEqual(Derived.baseValue, 1);
    Tester.areEqual(Derived.middleValue, 2);
    Tester.areEqual(Derived.derivedValue, 30);
});
/**
 * Test scenario C
 */
Tester.execute(`Access inherited method that call private static methods and properties.`, () => {
    let Base = class Base {
        static methodB() { }
        static methodA() {
            this.methodB();
            this.propertyC = 10;
        }
    };
    __decorate([
        Class.Private()
    ], Base, "methodB", null);
    __decorate([
        Class.Private()
    ], Base, "propertyC", void 0);
    __decorate([
        Class.Public()
    ], Base, "methodA", null);
    Base = __decorate([
        Class.Describe()
    ], Base);
    let Derived = class Derived extends Base {
    };
    Derived = __decorate([
        Class.Describe()
    ], Derived);
    Derived.methodA();
});
