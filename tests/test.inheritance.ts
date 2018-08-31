/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 *
 * Test access rules and calling order in inheritance.
 */
import * as Class from '../source';
import * as Tester from './helper';

// Tests
console.log('Inheritance');

/**
 * Test scenario A
 */
Tester.execute(`Call overridden methods from base to derived and goes to base again.`, () => {
  @Class.Describe()
  class Base {
    @Class.Public()
    public methodA(): void {
      this.methodB();
    }

    @Class.Protected()
    protected methodB(): void {
      throw new Error(`Method does not overwritten.`);
    }

    @Class.Protected()
    protected methodE(): void {}
  }

  @Class.Describe()
  class Middle extends Base {
    @Class.Protected()
    protected methodB(): void {
      this.methodC();
    }

    @Class.Protected()
    protected methodC(): void {
      throw new Error(`Method does not overwritten.`);
    }

    @Class.Protected()
    protected methodD(): void {
      this.methodE();
    }
  }

  @Class.Describe()
  class Derived extends Middle {
    @Class.Protected()
    protected methodC(): void {
      super.methodD();
    }
  }

  new Derived().methodA();
});

/**
 * Test scenario B
 */
Tester.execute(`Access inherited public and protected properties.`, () => {
  @Class.Describe()
  class Base {
    @Class.Protected()
    protected propertyA = 10;
    @Class.Public()
    public baseValue = 1;
  }

  @Class.Describe()
  class Middle extends Base {
    @Class.Protected()
    protected propertyB = 20;
    @Class.Public()
    public middleValue = 2;
  }

  @Class.Describe()
  class Derived extends Middle {
    @Class.Public()
    public get derivedValue(): number {
      return this.propertyA + this.propertyB;
    }
  }

  const instance = new Derived();

  Tester.areEqual(instance.baseValue, 1);
  Tester.areEqual(instance.middleValue, 2);
  Tester.areEqual(instance.derivedValue, 30);
});

/**
 * Test scenario C
 */
Tester.execute(`Access inherited method that call private methods and properties.`, () => {
  @Class.Describe()
  class Base {
    @Class.Private()
    private methodB(): void {}

    @Class.Private()
    private propertyC?: number;

    @Class.Public()
    public methodA(): void {
      this.methodB();
      this.propertyC = 10;
    }
  }

  @Class.Describe()
  class Derived extends Base {}

  new Derived().methodA();
});
