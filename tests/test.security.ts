/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 *
 * Test security for injected member at runtime.
 */
import * as Class from '../source';
import * as Tester from './helper';

// Tests
console.log('Security');

/**
 * Decorator
 */
declare const __decorate: any;

/**
 * Test class.
 */
@Class.Describe()
class Test {
  @Class.Private()
  static privateStaticMethod(): void {}

  @Class.Protected()
  static protectedStaticMethod(): void {}

  @Class.Private()
  privateMethod(): void {}

  @Class.Protected()
  protectedMethod(): void {}
}

/**
 * Security scenario A
 */
Tester.exception(
  `Prevent method decoration.`,
  () => {
    __decorate([Class.Public()], Test.prototype, 'invader', null);
  },
  Class.Exception
);

/**
 * Security scenario B
 */
Tester.exception(
  `Prevent static method decoration.`,
  () => {
    __decorate([Class.Public()], Test, 'invader', null);
  },
  Class.Exception
);

/**
 * Security scenario C
 */
Tester.exception(`Prevent defined method to call a private method.`, () => {
  Reflect.defineProperty(Test.prototype, 'invader', {
    value: function(this: Test) {
      this.privateMethod();
    }
  });
  const instance = new Test();
  (<any>instance).invader();
});

/**
 * Security scenario D
 */
Tester.exception(`Prevent defined method to call a protected method.`, () => {
  Reflect.defineProperty(Test.prototype, 'invader', {
    value: function(this: Test) {
      this.protectedMethod();
    }
  });
  const instance = new Test();
  (<any>instance).invader();
});

/**
 * Security scenario E
 */
Tester.exception(`Prevent defined method to call a static private method.`, () => {
  Reflect.defineProperty(Test, 'invader', {
    value: function(this: typeof Test) {
      this.privateStaticMethod();
    }
  });
  (<any>Test).invader();
});

/**
 * Security scenario F
 */
Tester.exception(`Prevent defined method to call a static protected method.`, () => {
  Reflect.defineProperty(Test, 'invader', {
    value: function(this: typeof Test) {
      this.protectedStaticMethod();
    }
  });
  (<any>Test).invader();
});
