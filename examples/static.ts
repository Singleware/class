/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 *
 * The proposal of this example is to show how to implement the member visibility using the
 * class package.
 */
import * as Class from '../source';

/**
 * Example of static members.
 */
@Class.Describe()
class Base {
  /**
   * Example of private method.
   */
  @Class.Private()
  private static privateCall(): void {
    console.log('PRIVATE CALL');
  }
  /**
   * Example of protected method.
   */
  @Class.Protected()
  protected static protectedCall(): void {
    console.log('PROTECTED CALL');
    this.privateCall();
  }
  /**
   * Example of public method.
   */
  @Class.Public()
  public static publicCall(): void {
    console.log('PUBLIC CALL');
  }
}

/**
 * Example of derived class.
 */
@Class.Describe()
class Derived extends Base {
  /**
   * Example of method overriding.
   */
  @Class.Public()
  public static publicCall(): void {
    console.log('OVERRIDING CALL');
    super.publicCall();
    this.protectedCall();
  }
}

Derived.publicCall();
