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
 * Test the security of overrides changing the member visibility.
 */
const Class = require("../source");
const Tester = require("./helper");
// Tests
console.log('Security.Override');
/**
 * Base class.
 */
let Base = class Base {
    /**
     * Base class.
     */
    constructor() {
        this.propertyA = 0;
        this.propertyB = 0;
        this.propertyC = 0;
    }
    methodA() { }
    methodB() { }
    methodC() { }
};
__decorate([
    Class.Public()
], Base.prototype, "methodA", null);
__decorate([
    Class.Protected()
], Base.prototype, "methodB", null);
__decorate([
    Class.Private()
], Base.prototype, "methodC", null);
__decorate([
    Class.Public()
], Base.prototype, "propertyA", void 0);
__decorate([
    Class.Protected()
], Base.prototype, "propertyB", void 0);
__decorate([
    Class.Private()
], Base.prototype, "propertyC", void 0);
Base = __decorate([
    Class.Describe()
], Base);
/**
 * Test scenario A
 */
Tester.exception(`Try to override a public method as private.`, () => {
    let Test = class Test extends Base {
        methodA() { }
    };
    __decorate([
        Class.Private()
    ], Test.prototype, "methodA", null);
    Test = __decorate([
        Class.Describe()
    ], Test);
}, Class.Exception);
/**
 * Test scenario B
 */
Tester.exception(`Try to override a public method as protected.`, () => {
    let Test = class Test extends Base {
        methodA() { }
    };
    __decorate([
        Class.Protected()
    ], Test.prototype, "methodA", null);
    Test = __decorate([
        Class.Describe()
    ], Test);
}, Class.Exception);
/**
 * Test scenario C
 */
Tester.exception(`Try to override a protected method as private.`, () => {
    let Test = class Test extends Base {
        methodB() { }
    };
    __decorate([
        Class.Private()
    ], Test.prototype, "methodB", null);
    Test = __decorate([
        Class.Describe()
    ], Test);
}, Class.Exception);
/**
 * Test scenario D
 */
Tester.exception(`Try to override a private method as public.`, () => {
    let Test = class Test extends Base {
        methodC() { }
    };
    __decorate([
        Class.Public()
    ], Test.prototype, "methodC", null);
    Test = __decorate([
        Class.Describe()
    ], Test);
}, Class.Exception);
/**
 * Test scenario E
 */
Tester.exception(`Try to override a private method as protected.`, () => {
    let Test = class Test extends Base {
        methodC() { }
    };
    __decorate([
        Class.Protected()
    ], Test.prototype, "methodC", null);
    Test = __decorate([
        Class.Describe()
    ], Test);
}, Class.Exception);
/**
 * Test scenario F
 */
Tester.exception(`Try to override a public property as private.`, () => {
    let Test = class Test extends Base {
        constructor() {
            super(...arguments);
            this.propertyA = 0;
        }
    };
    __decorate([
        Class.Private()
    ], Test.prototype, "propertyA", void 0);
    Test = __decorate([
        Class.Describe()
    ], Test);
}, Class.Exception);
/**
 * Test scenario G
 */
Tester.exception(`Try to override a public property as protected.`, () => {
    let Test = class Test extends Base {
        constructor() {
            super(...arguments);
            this.propertyA = 0;
        }
    };
    __decorate([
        Class.Protected()
    ], Test.prototype, "propertyA", void 0);
    Test = __decorate([
        Class.Describe()
    ], Test);
}, Class.Exception);
/**
 * Test scenario H
 */
Tester.exception(`Try to override a protected property as private.`, () => {
    let Test = class Test extends Base {
        constructor() {
            super(...arguments);
            this.propertyB = 0;
        }
    };
    __decorate([
        Class.Private()
    ], Test.prototype, "propertyB", void 0);
    Test = __decorate([
        Class.Describe()
    ], Test);
}, Class.Exception);
/**
 * Test scenario I
 */
Tester.exception(`Try to override a private property as public.`, () => {
    let Test = class Test extends Base {
        constructor() {
            super(...arguments);
            this.propertyC = 0;
        }
    };
    __decorate([
        Class.Public()
    ], Test.prototype, "propertyC", void 0);
    Test = __decorate([
        Class.Describe()
    ], Test);
}, Class.Exception);
/**
 * Test scenario J
 */
Tester.exception(`Try to override a private property as protected.`, () => {
    let Test = class Test extends Base {
        constructor() {
            super(...arguments);
            this.propertyC = 0;
        }
    };
    __decorate([
        Class.Protected()
    ], Test.prototype, "propertyC", void 0);
    Test = __decorate([
        Class.Describe()
    ], Test);
}, Class.Exception);
