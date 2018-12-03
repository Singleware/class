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
 * Test access rules and calling order for protected overrides in inheritance.
 */
const Class = require("../source");
const Tester = require("./helper");
// Tests
console.log('Protected.Override');
/**
 * Test scenario A
 */
Tester.execute(`Override the protected method from base class.`, () => {
    let Base = class Base extends Class.Null {
        methodA() {
            this.methodB();
        }
        methodB() {
            throw new Error(`Method does not overwritten.`);
        }
    };
    __decorate([
        Class.Public()
    ], Base.prototype, "methodA", null);
    __decorate([
        Class.Protected()
    ], Base.prototype, "methodB", null);
    Base = __decorate([
        Class.Describe()
    ], Base);
    let Test = class Test extends Base {
        methodB() { }
    };
    __decorate([
        Class.Protected()
    ], Test.prototype, "methodB", null);
    Test = __decorate([
        Class.Describe()
    ], Test);
    new Test().methodA();
});
/**
 * Test scenario B
 */
Tester.execute(`Override the protected method from base class and calls the base method by 'super' keyword.`, () => {
    let Base = class Base extends Class.Null {
        methodA() {
            this.methodB();
        }
        methodB() { }
    };
    __decorate([
        Class.Protected()
    ], Base.prototype, "methodA", null);
    __decorate([
        Class.Private()
    ], Base.prototype, "methodB", null);
    Base = __decorate([
        Class.Describe()
    ], Base);
    let Test = class Test extends Base {
        methodA() {
            super.methodA();
        }
    };
    __decorate([
        Class.Public()
    ], Test.prototype, "methodA", null);
    Test = __decorate([
        Class.Describe()
    ], Test);
    new Test().methodA();
});
/**
 * Test scenario C
 */
Tester.execute(`Override the protected method from base class and calls during object construction.`, () => {
    let Base = class Base extends Class.Null {
        constructor() {
            super();
            this.methodA();
        }
        methodA() {
            throw new Error(`Method does not overwritten.`);
        }
    };
    __decorate([
        Class.Protected()
    ], Base.prototype, "methodA", null);
    Base = __decorate([
        Class.Describe()
    ], Base);
    let Test = class Test extends Base {
        methodA() { }
    };
    __decorate([
        Class.Protected()
    ], Test.prototype, "methodA", null);
    Test = __decorate([
        Class.Describe()
    ], Test);
    new Test();
});
