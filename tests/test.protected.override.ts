/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 *
 * Test access rules and calling order for protected overrides in inheritance.
 */
import * as Class from '../source';
import * as Tester from './helper';

// Tests
console.log('Protected.Override');

/**
 * Test scenario A
 */
Tester.execute(`Override the protected method from base class.`, () => {
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
  }

  @Class.Describe()
  class Test extends Base {
    @Class.Protected()
    protected methodB(): void {}
  }

  new Test().methodA();
});

/**
 * Test scenario B
 */
Tester.execute(`Override the protected method from base class and calls the base method by 'super' keyword.`, () => {
  @Class.Describe()
  class Base {
    @Class.Protected()
    protected methodA(): void {
      this.methodB();
    }

    @Class.Private()
    private methodB(): void {}
  }

  @Class.Describe()
  class Test extends Base {
    @Class.Public()
    public methodA(): void {
      super.methodA();
    }
  }

  new Test().methodA();
});

/**
 * Test scenario C
 */
Tester.execute(`Override the protected method from base class and calls during object construction.`, () => {
  @Class.Describe()
  class Base {
    @Class.Protected()
    protected methodA(): void {
      throw new Error(`Method does not overwritten.`);
    }

    constructor() {
      this.methodA();
    }
  }

  @Class.Describe()
  class Test extends Base {
    @Class.Protected()
    protected methodA(): void {}
  }

  new Test();
});
