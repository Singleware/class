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
 * Test access rules in object constructions.
 */
const Class = require("../source");
const Tester = require("./helper");
// Tests
console.log('Constructor');
/**
 * Test scenario A
 */
Tester.execute(`Call internals methods in object construction.`, () => {
    let Test = class Test {
        constructor() {
            this.methodA();
            this.methodB();
            this.methodC();
        }
        methodA() {
            this.methodD();
            this.methodE();
        }
        methodB() {
            this.methodD();
            this.methodE();
        }
        methodC() {
            this.methodD();
            this.methodE();
        }
        methodD() { }
        methodE() { }
    };
    __decorate([
        Class.Public()
    ], Test.prototype, "methodA", null);
    __decorate([
        Class.Private()
    ], Test.prototype, "methodB", null);
    __decorate([
        Class.Protected()
    ], Test.prototype, "methodC", null);
    __decorate([
        Class.Private()
    ], Test.prototype, "methodD", null);
    __decorate([
        Class.Protected()
    ], Test.prototype, "methodE", null);
    Test = __decorate([
        Class.Describe()
    ], Test);
    new Test();
});
/**
 * Test scenario B
 */
Tester.execute(`Define own internal properties in object construction.`, () => {
    let Test = class Test {
        constructor() {
            this.propertyA = 10;
            this.propertyB = 20;
            this.propertyC = 30;
        }
        get propertyD() {
            return this.propertyA + this.propertyB + this.propertyC;
        }
    };
    __decorate([
        Class.Private()
    ], Test.prototype, "propertyA", void 0);
    __decorate([
        Class.Protected()
    ], Test.prototype, "propertyB", void 0);
    __decorate([
        Class.Public()
    ], Test.prototype, "propertyC", void 0);
    __decorate([
        Class.Public()
    ], Test.prototype, "propertyD", null);
    Test = __decorate([
        Class.Describe()
    ], Test);
    const instance = new Test();
    Tester.areEqual(instance.propertyC, 30);
    Tester.areEqual(instance.propertyD, 60);
});
/**
 * Test scenario C
 */
Tester.execute(`Call internal methods and properties during an inherited construction.`, () => {
    let Base = class Base {
        constructor() {
            this.propertyA = 10;
            this.methodA();
        }
        methodA() { }
    };
    __decorate([
        Class.Private()
    ], Base.prototype, "propertyA", void 0);
    __decorate([
        Class.Private()
    ], Base.prototype, "methodA", null);
    Base = __decorate([
        Class.Describe()
    ], Base);
    let Middle = class Middle extends Base {
        constructor() {
            super();
            this.propertyB = 20;
            this.methodB();
        }
        methodB() { }
    };
    __decorate([
        Class.Private()
    ], Middle.prototype, "propertyB", void 0);
    __decorate([
        Class.Private()
    ], Middle.prototype, "methodB", null);
    Middle = __decorate([
        Class.Describe()
    ], Middle);
    let Derived = class Derived extends Middle {
        constructor() {
            super();
            this.propertyC = 30;
            this.methodC();
        }
        methodC() { }
    };
    __decorate([
        Class.Private()
    ], Derived.prototype, "propertyC", void 0);
    __decorate([
        Class.Private()
    ], Derived.prototype, "methodC", null);
    Derived = __decorate([
        Class.Describe()
    ], Derived);
    new Derived();
});
/**
 * Test scenario D
 */
Tester.execute(`Method binding in object construction (bind the unwrapped 'this' and call after)`, () => {
    let Base = class Base {
        constructor() {
            this.callbackA = this.methodA.bind(this);
            this.callbackB = this.methodB.bind(this);
        }
        methodA() { }
        methodB() { }
    };
    __decorate([
        Class.Public()
    ], Base.prototype, "callbackA", void 0);
    __decorate([
        Class.Public()
    ], Base.prototype, "callbackB", void 0);
    __decorate([
        Class.Private()
    ], Base.prototype, "methodA", null);
    __decorate([
        Class.Protected()
    ], Base.prototype, "methodB", null);
    Base = __decorate([
        Class.Describe()
    ], Base);
    let Test = class Test extends Base {
        constructor() {
            super(...arguments);
            this.callbackC = this.methodC.bind(this);
            this.callbackD = this.methodD.bind(this);
        }
        methodC() { }
        methodD() { }
    };
    __decorate([
        Class.Public()
    ], Test.prototype, "callbackC", void 0);
    __decorate([
        Class.Public()
    ], Test.prototype, "callbackD", void 0);
    __decorate([
        Class.Private()
    ], Test.prototype, "methodC", null);
    __decorate([
        Class.Protected()
    ], Test.prototype, "methodD", null);
    Test = __decorate([
        Class.Describe()
    ], Test);
    const instance = new Test();
    instance.callbackA();
    instance.callbackB();
    instance.callbackC();
    instance.callbackD();
});
