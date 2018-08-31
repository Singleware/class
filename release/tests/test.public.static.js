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
 * Test access rules for static public calls.
 */
const Class = require("../source");
const Tester = require("./helper");
// Tests
console.log('Public.Static');
/**
 * Test scenario A
 */
Tester.execute(`Call a public method.`, () => {
    let Test = class Test {
        static methodA() {
            this.methodD();
            this.methodE();
        }
        static methodD() { }
        static methodE() { }
    };
    __decorate([
        Class.Public()
    ], Test, "methodA", null);
    __decorate([
        Class.Private()
    ], Test, "methodD", null);
    __decorate([
        Class.Protected()
    ], Test, "methodE", null);
    Test = __decorate([
        Class.Describe()
    ], Test);
    Test.methodA();
});
/**
 * Test scenario B
 */
Tester.execute(`Access public properties.`, () => {
    let Test = class Test {
        static get propertyB() {
            return this.propertyA + 10;
        }
        static set propertyC(value) {
            this.propertyA = value;
        }
    };
    Test.propertyA = 10;
    __decorate([
        Class.Public()
    ], Test, "propertyA", void 0);
    __decorate([
        Class.Public()
    ], Test, "propertyB", null);
    __decorate([
        Class.Public()
    ], Test, "propertyC", null);
    Test = __decorate([
        Class.Describe()
    ], Test);
    Test.propertyC = 20;
    Tester.areEqual(Test.propertyA, 20);
    Tester.areEqual(Test.propertyB, 30);
    Test.propertyA = 5;
    Tester.areEqual(Test.propertyA, 5);
});
