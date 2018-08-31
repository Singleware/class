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
 * Test security for injected member at runtime.
 */
const Class = require("../source");
const Tester = require("./helper");
// Tests
console.log('Security');
/**
 * Test class.
 */
let Test = class Test {
    static privateStaticMethod() { }
    static protectedStaticMethod() { }
    privateMethod() { }
    protectedMethod() { }
};
__decorate([
    Class.Private()
], Test.prototype, "privateMethod", null);
__decorate([
    Class.Protected()
], Test.prototype, "protectedMethod", null);
__decorate([
    Class.Private()
], Test, "privateStaticMethod", null);
__decorate([
    Class.Protected()
], Test, "protectedStaticMethod", null);
Test = __decorate([
    Class.Describe()
], Test);
/**
 * Security scenario A
 */
Tester.exception(`Prevent method decoration.`, () => {
    __decorate([Class.Public()], Test.prototype, 'invader', null);
}, Class.Exception);
/**
 * Security scenario B
 */
Tester.exception(`Prevent static method decoration.`, () => {
    __decorate([Class.Public()], Test, 'invader', null);
}, Class.Exception);
/**
 * Security scenario C
 */
Tester.exception(`Prevent defined method to call a private method.`, () => {
    Reflect.defineProperty(Test.prototype, 'invader', {
        value: function () {
            this.privateMethod();
        }
    });
    const instance = new Test();
    instance.invader();
});
/**
 * Security scenario D
 */
Tester.exception(`Prevent defined method to call a protected method.`, () => {
    Reflect.defineProperty(Test.prototype, 'invader', {
        value: function () {
            this.protectedMethod();
        }
    });
    const instance = new Test();
    instance.invader();
});
/**
 * Security scenario E
 */
Tester.exception(`Prevent defined method to call a static private method.`, () => {
    Reflect.defineProperty(Test, 'invader', {
        value: function () {
            this.privateStaticMethod();
        }
    });
    Test.invader();
});
/**
 * Security scenario F
 */
Tester.exception(`Prevent defined method to call a static protected method.`, () => {
    Reflect.defineProperty(Test, 'invader', {
        value: function () {
            this.protectedStaticMethod();
        }
    });
    Test.invader();
});
