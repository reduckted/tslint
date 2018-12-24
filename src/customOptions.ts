/**
 * @license
 * Copyright 2018 Palantir Technologies, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import commander = require("commander");

import { hasOwnProperty } from "./utils";

export interface CustomOptions {
    [name: string]: any;
}

/**
 * Converts the unknown arguments from the given command
 * line parsing result into an object of custom options.
 *
 * Any unknown arguments that were used for custom
 * options are removed from the result's unknown options.
 * @param prefix The prefix for the custom options.
 * @param result The result of parsing command line arguments.
 * @returns The custom options from arguments that started with the given prefix.
 */
export function extractCustomOptions(
    prefix: string,
    result: commander.ParseOptionsResult,
): CustomOptions {
    const custom = new commander.Command();

    // Define options for any unknown
    // arguments that start with the prefix.
    for (let i = 0; i < result.unknown.length; i++) {
        if (result.unknown[i].startsWith(`--${prefix}-`)) {
            let flags = result.unknown[i];
            // If the next unknown argument is not prefixed with a dash,
            // then it will be the value for the current argument.
            // Change the option's flags to indicate that it expects a value.
            if (i + 1 < result.unknown.length && result.unknown[i + 1][0] !== "-") {
                flags += " []";
            }
            custom.option(flags);
        }
    }

    // Parse the options and replace the original unknown arguments with
    // the unknown arguments that are left after parsing the custom options.
    result.unknown = custom.parseOptions(result.unknown).unknown;

    // Get the values of the options. The names of the options
    // will include the prefix, so we need to remove that prefix.
    return removePrefixFromPropertyNames(prefix, custom.opts());
}

function removePrefixFromPropertyNames(
    prefix: string,
    obj: { [name: string]: any },
): CustomOptions {
    const result: CustomOptions = {};
    for (const key in obj) {
        if (hasOwnProperty(obj, key)) {
            let fixed = key.substr(prefix.length);
            fixed = fixed.charAt(0).toLowerCase() + fixed.substr(1);
            result[fixed] = obj[key];
        }
    }
    return result;
}
