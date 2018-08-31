/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
export { ClassDecorator, MemberDecorator, Constructor, Callable } from './types';
export { Exception } from './exception';
import { Helper } from './helper';

// Aliases for decorators
export import Describe = Helper.Describe;
export import Public = Helper.Public;
export import Protected = Helper.Protected;
export import Private = Helper.Private;
export import perform = Helper.perform;
