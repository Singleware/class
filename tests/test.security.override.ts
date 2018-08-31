/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 *
 * Test the security of overrides changing the member visibility.
 */
import * as Class from '../source';
import * as Tester from './helper';

// Tests
console.log('Security.Override');

/**
 * Base class.
 */
@Class.Describe()
class Base {
  @Class.Public()
  methodA(): void {}

  @Class.Protected()
  methodB(): void {}

  @Class.Private()
  methodC(): void {}

  @Class.Public()
  propertyA = 0;

  @Class.Protected()
  propertyB = 0;

  @Class.Private()
  propertyC = 0;
}

/**
 * Test scenario A
 */
Tester.exception(
  `Try to override a public method as private.`,
  () => {
    @Class.Describe()
    class Test extends Base {
      @Class.Private()
      methodA(): void {}
    }
  },
  Class.Exception
);

/**
 * Test scenario B
 */
Tester.exception(
  `Try to override a public method as protected.`,
  () => {
    @Class.Describe()
    class Test extends Base {
      @Class.Protected()
      methodA(): void {}
    }
  },
  Class.Exception
);

/**
 * Test scenario C
 */
Tester.exception(
  `Try to override a protected method as private.`,
  () => {
    @Class.Describe()
    class Test extends Base {
      @Class.Private()
      methodB(): void {}
    }
  },
  Class.Exception
);

/**
 * Test scenario D
 */
Tester.exception(
  `Try to override a private method as public.`,
  () => {
    @Class.Describe()
    class Test extends Base {
      @Class.Public()
      methodC(): void {}
    }
  },
  Class.Exception
);

/**
 * Test scenario E
 */
Tester.exception(
  `Try to override a private method as protected.`,
  () => {
    @Class.Describe()
    class Test extends Base {
      @Class.Protected()
      methodC(): void {}
    }
  },
  Class.Exception
);

/**
 * Test scenario F
 */
Tester.exception(
  `Try to override a public property as private.`,
  () => {
    @Class.Describe()
    class Test extends Base {
      @Class.Private()
      propertyA = 0;
    }
  },
  Class.Exception
);

/**
 * Test scenario G
 */
Tester.exception(
  `Try to override a public property as protected.`,
  () => {
    @Class.Describe()
    class Test extends Base {
      @Class.Protected()
      propertyA = 0;
    }
  },
  Class.Exception
);

/**
 * Test scenario H
 */
Tester.exception(
  `Try to override a protected property as private.`,
  () => {
    @Class.Describe()
    class Test extends Base {
      @Class.Private()
      propertyB = 0;
    }
  },
  Class.Exception
);

/**
 * Test scenario I
 */
Tester.exception(
  `Try to override a private property as public.`,
  () => {
    @Class.Describe()
    class Test extends Base {
      @Class.Public()
      propertyC = 0;
    }
  },
  Class.Exception
);

/**
 * Test scenario J
 */
Tester.exception(
  `Try to override a private property as protected.`,
  () => {
    @Class.Describe()
    class Test extends Base {
      @Class.Protected()
      propertyC = 0;
    }
  },
  Class.Exception
);
