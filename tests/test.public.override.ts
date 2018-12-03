/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 *
 * Test access rules and calling order for public overrides in inheritance.
 */
import * as Class from '../source';
import * as Tester from './helper';

// Tests
console.log('Public.Override');

/**
 * Test scenario A
 */
Tester.execute(`Override the public method from base class.`, () => {
  @Class.Describe()
  class Base extends Class.Null {
    @Class.Public()
    public methodA(): void {
      this.methodB();
    }

    @Class.Public()
    public methodB(): void {
      throw new Error(`Method does not overwritten.`);
    }
  }

  @Class.Describe()
  class Test extends Base {
    @Class.Public()
    public methodB(): void {}
  }

  new Test().methodA();
});

/**
 * Test scenario B
 */
Tester.execute(`Override the public method from base class and calls the base method by 'super' keyword.`, () => {
  @Class.Describe()
  class Base extends Class.Null {
    @Class.Public()
    public methodA(): void {
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
Tester.execute(`Override the public method from base class and calls during object construction.`, () => {
  @Class.Describe()
  class Base extends Class.Null {
    @Class.Public()
    public methodA(): void {
      throw new Error(`Method does not overwritten.`);
    }

    constructor() {
      super();
      this.methodA();
    }
  }

  @Class.Describe()
  class Test extends Base {
    @Class.Public()
    public methodA(): void {}
  }

  new Test();
});
