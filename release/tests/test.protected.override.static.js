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
 * Test access rules and calling order for static protected overrides in inheritance.
 */
const Class = require("../source");
const Tester = require("./helper");
// Tests
console.log('Protected.Override.Static');
/**
 * Test scenario A
 */
Tester.execute(`Override the protected static method from base class.`, () => {
    let Base = class Base extends Class.Null {
        static methodA() {
            this.methodB();
        }
        static methodB() {
            throw new Error(`Method does not overwritten.`);
        }
    };
    __decorate([
        Class.Public()
    ], Base, "methodA", null);
    __decorate([
        Class.Protected()
    ], Base, "methodB", null);
    Base = __decorate([
        Class.Describe()
    ], Base);
    let TestA = class TestA extends Base {
        static methodB() { }
    };
    __decorate([
        Class.Protected()
    ], TestA, "methodB", null);
    TestA = __decorate([
        Class.Describe()
    ], TestA);
    TestA.methodA();
});
/**
 * Test scenario B
 */
Tester.execute(`Override the protected static method from base class and calls the base method by 'super' keyword.`, () => {
    let Base = class Base extends Class.Null {
        static methodA() {
            this.methodB();
        }
        static methodB() { }
    };
    __decorate([
        Class.Protected()
    ], Base, "methodA", null);
    __decorate([
        Class.Private()
    ], Base, "methodB", null);
    Base = __decorate([
        Class.Describe()
    ], Base);
    let Test = class Test extends Base {
        static methodA() {
            super.methodA();
        }
    };
    __decorate([
        Class.Public()
    ], Test, "methodA", null);
    Test = __decorate([
        Class.Describe()
    ], Test);
    Test.methodA();
});
