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

import { assert } from "chai";
import commander = require("commander");

import { extractCustomOptions } from "../src/customOptions";

describe("Custom Options", () => {
    it("returns empty object if no arguments have prefix", () => {
        const commands = new commander.Command();
        commands.option("--foo");

        const result = commands.parseOptions(["--foo", "--bar"]);
        const custom = extractCustomOptions("custom", result);
        assert.deepEqual(custom, {});
    });

    it("does not remove unknown arguments if no arguments have prefix", () => {
        const commands = new commander.Command();
        commands.option("--foo");

        const result = commands.parseOptions(["--foo", "--bar"]);
        extractCustomOptions("custom", result);
        assert.deepEqual(result.unknown, ["--bar"]);
    });

    it("removes prefix from custom options", () => {
        const commands = new commander.Command();
        commands.option("--foo");

        const result = commands.parseOptions(["--foo", "--bar-test-value"]);
        const custom = extractCustomOptions("bar", result);
        assert.deepEqual(custom, { testValue: true });
    });

    it("accepts values for custom options", () => {
        const commands = new commander.Command();
        commands.option("--foo");

        const result = commands.parseOptions(["--foo", "--bar-test", "value"]);
        const custom = extractCustomOptions("bar", result);
        assert.deepEqual(custom, { test: "value" });
    });

    it("removes unknown options used for custom options", () => {
        const commands = new commander.Command();
        commands.option("--foo");

        const result = commands.parseOptions([
            "--foo",
            "--bar-test-value",
            "--bar-other",
            "--not-custom",
        ]);
        assert.deepEqual(result.unknown, ["--bar-test-value", "--bar-other", "--not-custom"]);

        extractCustomOptions("bar", result);
        assert.deepEqual(result.unknown, ["--not-custom"]);
    });
});
