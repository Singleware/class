/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 *
 * Test access rules for public calls.
 */
import * as Class from '../source';
import * as Tester from './helper';

// Tests
console.log('Public');

/**
 * Test scenario A
 */
Tester.execute(`Call a public method.`, () => {
  @Class.Describe()
  class Test extends Class.Null {
    @Class.Public()
    public methodA(): void {
      this.methodD();
      this.methodE();
    }

    @Class.Private()
    private methodD(): void {}

    @Class.Protected()
    protected methodE(): void {}
  }

  new Test().methodA();
});

/**
 * Test scenario B
 */
Tester.execute(`Access public properties.`, () => {
  @Class.Describe()
  class Test extends Class.Null {
    @Class.Public()
    public propertyA = 10;

    @Class.Public()
    public get propertyB(): number {
      return this.propertyA + 10;
    }

    @Class.Public()
    public set propertyC(value: number) {
      this.propertyA = value;
    }
  }

  const instance = new Test();

  instance.propertyC = 20;
  Tester.areEqual(instance.propertyA, 20);
  Tester.areEqual(instance.propertyB, 30);

  instance.propertyA = 5;
  Tester.areEqual(instance.propertyA, 5);
});
