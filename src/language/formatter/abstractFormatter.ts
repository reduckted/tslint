/**
 * @license
 * Copyright 2013 Palantir Technologies, Inc.
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

import { RuleFailure } from "../rule/rule";
import { IFormatter, IFormatterContext, IFormatterMetadata } from "./formatter";

export abstract class AbstractFormatter implements IFormatter {
    public static metadata: IFormatterMetadata;
    public abstract format(context: IFormatterContext): string;
    /**
     * @deprecated Use {@link AbstractFormatter.(format:1)} instead.
     */
    public abstract format(failures: RuleFailure[], fixes?: RuleFailure[]): string;

    protected sortFailures(failures: RuleFailure[]): RuleFailure[] {
        return failures.slice().sort(RuleFailure.compare);
    }

    /**
     * Converts an array of failures and fixed lint failures
     * into a formatter context for backward-compatibility.
     * @param contextOrFailures The context or an array of failures.
     * @param fixes An array of fixed lint failures.
     * @returns The formatter context.
     */
    protected getContext(
        contextOrFailures: IFormatterContext | RuleFailure[],
        fixes?: RuleFailure[],
    ): IFormatterContext {
        // If the first argument is an array, then it's the array of failures.
        // If it's not an array, then it must be the context object.
        if (Array.isArray(contextOrFailures)) {
            return {
                failures: contextOrFailures,
                fixes,
                options: {},
            };
        }
        return contextOrFailures;
    }
}
