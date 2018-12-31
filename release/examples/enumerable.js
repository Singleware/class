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
 * The proposal of this example is to show how to implement the enumerable member visibility
 * using the class package.
 */
const Class = require("../source");
/**
 * Example of enumerable members.
 */
let Basic = class Basic extends Class.Null {
    /**
     * Example of enumerable members.
     */
    constructor() {
        super(...arguments);
        this.privateProperty = '';
        this.protectedProperty = '';
        this.publicProperty = '';
    }
};
__decorate([
    Class.Private()
], Basic.prototype, "privateProperty", void 0);
__decorate([
    Class.Protected(),
    Class.Property()
], Basic.prototype, "protectedProperty", void 0);
__decorate([
    Class.Public(),
    Class.Property()
], Basic.prototype, "publicProperty", void 0);
Basic = __decorate([
    Class.Describe()
], Basic);
const instance = new Basic();
for (const property in instance) {
    console.log(property);
}
