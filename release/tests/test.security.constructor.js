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
 * Test security of private access to base class from derived constructor calls.
 */
const Class = require("../source");
const Tester = require("./helper");
/**
 * Base class.
 */
let Base = class Base {
    /**
     * Private method.
     */
    method() { }
};
__decorate([
    Class.Private()
], Base.prototype, "method", null);
Base = __decorate([
    Class.Describe()
], Base);
// Tests
console.log('Constructor.Security');
/**
 * Security scenario A
 */
Tester.exception(`Deny access to the private members from base class by middle class using 'super' keyword.`, () => {
    let Middle = class Middle extends Base {
        constructor() {
            super();
            super.method();
        }
    };
    Middle = __decorate([
        Class.Describe()
    ], Middle);
    let Test = class Test extends Middle {
    };
    Test = __decorate([
        Class.Describe()
    ], Test);
    new Test();
}, Class.Exception);
/**
 * Security scenario B
 */
Tester.exception(`Deny access to the private members from base class by middle class using 'this' keyword`, () => {
    let Middle = class Middle extends Base {
        constructor() {
            super();
            this.method();
        }
    };
    Middle = __decorate([
        Class.Describe()
    ], Middle);
    let Test = class Test extends Middle {
    };
    Test = __decorate([
        Class.Describe()
    ], Test);
    new Test();
}, Class.Exception);
/**
 * Security scenario C
 */
Tester.exception(`Deny access to the private members from base class using 'super' keyword.`, () => {
    let Test = class Test extends Base {
        constructor() {
            super();
            super.method();
        }
    };
    Test = __decorate([
        Class.Describe()
    ], Test);
    new Test();
}, Class.Exception);
/**
 * Security scenario D
 */
Tester.exception(`Deny access to the private members from base class using 'this' keyword.`, () => {
    let Test = class Test extends Base {
        constructor() {
            super();
            this.method();
        }
    };
    Test = __decorate([
        Class.Describe()
    ], Test);
    new Test();
}, Class.Exception);
