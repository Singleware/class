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
 * Test security of private static access outside of class.
 */
const Class = require("../source");
const Tester = require("./helper");
// Tests
console.log('Security.Private.Static');
/**
 * Security scenario A
 */
Tester.exception(`Deny access to the private static method from public context.`, () => {
    let Test = class Test {
        static method() { }
    };
    __decorate([
        Class.Private()
    ], Test, "method", null);
    Test = __decorate([
        Class.Describe()
    ], Test);
    Test.method();
}, Class.Exception);
/**
 * Security scenario B
 */
Tester.exception(`Deny access to the private static getter from public context.`, () => {
    let Test = class Test {
    };
    Test.property = 10;
    __decorate([
        Class.Private()
    ], Test, "property", void 0);
    Test = __decorate([
        Class.Describe()
    ], Test);
    Test.property;
}, Class.Exception);
/**
 * Security scenario C
 */
Tester.exception(`Deny access to the private static setter from public context.`, () => {
    let Test = class Test {
    };
    Test.property = 10;
    __decorate([
        Class.Private()
    ], Test, "property", void 0);
    Test = __decorate([
        Class.Describe()
    ], Test);
    Test.property = 0;
}, Class.Exception);
