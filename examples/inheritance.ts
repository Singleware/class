/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 *
 * The proposal of this example is to show how to implement the member visibility using
 * the class package.
 */
import * as Class from '../source';

/**
 * Example of inheritance.
 */
@Class.Describe()
class Base {
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
  @Class.Private()
  private privateCall(): void {
    console.log('PRIVATE CALL');
  }
  /**
   * Example of base protected method.
   */
  @Class.Protected()
  protected protectedCall(): void {
    console.log('PROTECTED CALL');
    this.privateCall();
  }
  /**
   * Example of base public method.
   */
  @Class.Public()
  public publicCall(): void {
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
  public publicCall(): void {
    console.log('OVERRIDING CALL');
    super.publicCall();
    super.protectedCall();
  }
}

/**
 * Construct instances.
 */
const instanceA = new Base();
const instanceB = new Derived();
