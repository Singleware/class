/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */

/**
 * Call entry interface.
 */
export interface Entry {
  /**
   * Method name.
   */
  name: string;
  /**
   * Method context.
   */
  context: any;
  /**
   * Method prototype.
   */
  prototype: any;
  /**
   * Previous call.
   */
  previous?: Entry;
  /**
   * Next call.
   */
  next?: Entry;
}
