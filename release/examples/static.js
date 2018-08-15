"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Base_1;
"use strict";
/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 *
 * The proposal of this example is to show how to implement the member visibility using the
 * class package.
 */
const Class = require("../source");
/**
 * Example of static members.
 */
let Base = Base_1 = class Base {
    /**
     * Example of private method.
     */
    static privateCall() {
        console.log('PRIVATE CALL');
    }
    /**
     * Example of protected method.
     */
    static protectedCall() {
        console.log('PROTECTED CALL');
        Base_1.privateCall();
    }
    /**
     * Example of public method.
     */
    static publicCall() {
        console.log('PUBLIC CALL');
    }
};
__decorate([
    Class.Private()
], Base, "privateCall", null);
__decorate([
    Class.Protected()
], Base, "protectedCall", null);
__decorate([
    Class.Public()
], Base, "publicCall", null);
Base = Base_1 = __decorate([
    Class.Describe()
], Base);
/**
 * Example of derived class.
 */
let Derived = class Derived extends Base {
    /**
     * Example of method overriding.
     */
    static publicCall() {
        console.log('OVERRIDING CALL');
        Base.publicCall();
        Base.protectedCall();
        // (Base as any).privateCall();
    }
};
__decorate([
    Class.Public()
], Derived, "publicCall", null);
Derived = __decorate([
    Class.Describe()
], Derived);
Derived.publicCall();
