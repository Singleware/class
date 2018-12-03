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
 * Test access rules for public calls.
 */
const Class = require("../source");
const Tester = require("./helper");
// Tests
console.log('Public');
/**
 * Test scenario A
 */
Tester.execute(`Call a public method.`, () => {
    let Test = class Test extends Class.Null {
        methodA() {
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
    ], Test.prototype, "methodD", null);
    __decorate([
        Class.Protected()
    ], Test.prototype, "methodE", null);
    Test = __decorate([
        Class.Describe()
    ], Test);
    new Test().methodA();
});
/**
 * Test scenario B
 */
Tester.execute(`Access public properties.`, () => {
    let Test = class Test extends Class.Null {
        constructor() {
            super(...arguments);
            this.propertyA = 10;
        }
        get propertyB() {
            return this.propertyA + 10;
        }
        set propertyC(value) {
            this.propertyA = value;
        }
    };
    __decorate([
        Class.Public()
    ], Test.prototype, "propertyA", void 0);
    __decorate([
        Class.Public()
    ], Test.prototype, "propertyB", null);
    __decorate([
        Class.Public()
    ], Test.prototype, "propertyC", null);
    Test = __decorate([
        Class.Describe()
    ], Test);
    const instance = new Test();
    instance.propertyC = 20;
    Tester.areEqual(instance.propertyA, 20);
    Tester.areEqual(instance.propertyB, 30);
    instance.propertyA = 5;
    Tester.areEqual(instance.propertyA, 5);
});
