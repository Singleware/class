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
 * The proposal of this example is to show how to implement the member visibility using
 * the class package.
 */
const Class = require("../source");
/**
 * Example of inheritance.
 */
let Base = class Base {
    /**
     * Example of base constructor.
     * Don't use decorators here.
     */
    constructor() {
        this.publicCall();
    }
    /**
     * Example of base private method.
     */
    privateCall() {
        console.log('PRIVATE CALL');
    }
    /**
     * Example of base protected method.
     */
    protectedCall() {
        console.log('PROTECTED CALL');
        this.privateCall();
    }
    /**
     * Example of base public method.
     */
    publicCall() {
        console.log('PUBLIC CALL');
    }
};
__decorate([
    Class.Private()
], Base.prototype, "privateCall", null);
__decorate([
    Class.Protected()
], Base.prototype, "protectedCall", null);
__decorate([
    Class.Public()
], Base.prototype, "publicCall", null);
Base = __decorate([
    Class.Describe()
], Base);
/**
 * Example of derived class.
 */
let Derived = class Derived extends Base {
    /**
     * Example of method overriding.
     */
    publicCall() {
        console.log('OVERRIDING CALL');
        super.publicCall();
        super.protectedCall();
    }
};
__decorate([
    Class.Public()
], Derived.prototype, "publicCall", null);
Derived = __decorate([
    Class.Describe()
], Derived);
/**
 * Construct instances.
 */
const instanceA = new Base();
const instanceB = new Derived();
