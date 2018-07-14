/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */

/**
 * Call trace interface.
 */
export interface Trace {
  /**
   * Context name.
   */
  context: string;
  /**
   * Method name.
   */
  method: string;
}
