/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 *
 * Test security of private access to base class from derived constructor calls.
 */
import * as Class from '../source';
import * as Tester from './helper';

/**
 * Base class.
 */
@Class.Describe()
class Base {
  /**
   * Private method.
   */
  @Class.Private()
  method(): void {}
}

// Tests
console.log('Constructor.Security');

/**
 * Security scenario A
 */
Tester.exception(
  `Deny access to the private members from base class by middle class using 'super' keyword.`,
  () => {
    @Class.Describe()
    class Middle extends Base {
      constructor() {
        super();
        super.method();
      }
    }

    @Class.Describe()
    class Test extends Middle {}

    new Test();
  },
  Class.Exception
);

/**
 * Security scenario B
 */
Tester.exception(
  `Deny access to the private members from base class by middle class using 'this' keyword`,
  () => {
    @Class.Describe()
    class Middle extends Base {
      constructor() {
        super();
        this.method();
      }
    }

    @Class.Describe()
    class Test extends Middle {}

    new Test();
  },
  Class.Exception
);

/**
 * Security scenario C
 */
Tester.exception(
  `Deny access to the private members from base class using 'super' keyword.`,
  () => {
    @Class.Describe()
    class Test extends Base {
      constructor() {
        super();
        super.method();
      }
    }

    new Test();
  },
  Class.Exception
);

/**
 * Security scenario D
 */
Tester.exception(
  `Deny access to the private members from base class using 'this' keyword.`,
  () => {
    @Class.Describe()
    class Test extends Base {
      constructor() {
        super();
        this.method();
      }
    }

    new Test();
  },
  Class.Exception
);
