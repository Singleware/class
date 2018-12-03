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
 * Test preservation of context access rules in static calls.
 */
const Class = require("../source");
const Tester = require("./helper");
// Tests
console.log('Context.Static');
/**
 * Test scenario A
 */
Tester.execute(`Call internal static methods from callback context.`, () => {
    var Test_1;
    let Test = Test_1 = class Test extends Class.Null {
        static methodA() {
            return () => {
                this.methodC();
                this.methodD();
            };
        }
        static methodB() {
            return function () {
                this.methodC();
                this.methodD();
            }.bind(this);
        }
        static methodC() { }
        static methodD() { }
    };
    __decorate([
        Class.Public()
    ], Test, "methodA", null);
    __decorate([
        Class.Public()
    ], Test, "methodB", null);
    __decorate([
        Class.Private()
    ], Test, "methodC", null);
    __decorate([
        Class.Protected()
    ], Test, "methodD", null);
    Test = Test_1 = __decorate([
        Class.Describe()
    ], Test);
    Test.methodA()();
    Test.methodB()();
});
/**
 * Test scenario B
 */
Tester.execute(`Call internal methods from another instance of same type.`, () => {
    var Test_2;
    let Test = Test_2 = class Test extends Class.Null {
        static methodAA() { }
        static methodAB() { }
        methodBA() { }
        methodBB() { }
        static methodBC(other) {
            other.methodBA();
            other.methodBB();
        }
        static methodA(other) {
            other.methodAA();
            other.methodAB();
        }
        static methodB(other) {
            other.methodBA();
            other.methodBB();
            this.methodBC(other);
        }
    };
    __decorate([
        Class.Private()
    ], Test.prototype, "methodBA", null);
    __decorate([
        Class.Protected()
    ], Test.prototype, "methodBB", null);
    __decorate([
        Class.Private()
    ], Test, "methodAA", null);
    __decorate([
        Class.Protected()
    ], Test, "methodAB", null);
    __decorate([
        Class.Protected()
    ], Test, "methodBC", null);
    __decorate([
        Class.Public()
    ], Test, "methodA", null);
    __decorate([
        Class.Public()
    ], Test, "methodB", null);
    Test = Test_2 = __decorate([
        Class.Describe()
    ], Test);
    Test.methodA(Test);
    Test.methodB(new Test());
});
