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
 * Test security of private access outside of class.
 */
const Class = require("../source");
const Tester = require("./helper");
// Tests
console.log('Security.Private');
/**
 * Security scenario A
 */
Tester.exception(`Deny access to the private method from public context.`, () => {
    let Test = class Test {
        method() { }
    };
    __decorate([
        Class.Private()
    ], Test.prototype, "method", null);
    Test = __decorate([
        Class.Describe()
    ], Test);
    new Test().method();
}, Class.Exception);
/**
 * Security scenario B
 */
Tester.exception(`Deny access to the private getter from public context.`, () => {
    let Test = class Test {
        constructor() {
            this.property = 10;
        }
    };
    __decorate([
        Class.Private()
    ], Test.prototype, "property", void 0);
    Test = __decorate([
        Class.Describe()
    ], Test);
    new Test().property;
}, Class.Exception);
/**
 * Security scenario C
 */
Tester.exception(`Deny access to the private setter from public context.`, () => {
    let Test = class Test {
        constructor() {
            this.property = 10;
        }
    };
    __decorate([
        Class.Private()
    ], Test.prototype, "property", void 0);
    Test = __decorate([
        Class.Describe()
    ], Test);
    new Test().property = 0;
}, Class.Exception);
