/* SPDX-License-Identifier: LGPL-3.0-or-later
 * ============================================================================
 *  MC Tool - Minecraft Bedrock addon development tool
 *  Copyright (C) 2024-2026 jeanmajid and contributors
 *  https://github.com/jeanmajid/MCPE-Tool
 * ============================================================================
 *
 * This file is part of MC Tool.
 *
 * MC Tool is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * MC Tool is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with MC Tool. If not, see <https://www.gnu.org/licenses/>.
 */

import readline from "readline";

import { Color } from "../logger/color.js";

interface Question {
    name: string;
    message: string;
    type: "confirm" | "input";
    default: (() => string | boolean) | string | boolean;
}

interface Answers {
    [key: string]: string | boolean;
}

export class Questioner {
    /**
     * Prompts the user with a series of questions and returns the answers.
     * @param questions - An array of question objects.
     * @returns A promise that resolves to an object containing the user's answers.
     */
    public static async prompt(questions: Question[] = []): Promise<Answers> {
        const answers: Answers = {};
        const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

        for (const question of questions) {
            console.log(Color.blue(question.message));
            const defaultValue =
                typeof question.default === "function" ? question.default() : question.default;
            const answer = await new Promise<string>((resolve) => {
                rl.question(Color.green("(" + defaultValue + ")" + " "), (ans) => {
                    resolve(ans);
                });
            });

            if (question.type === "confirm") {
                if (answer === "") {
                    answers[question.name] = defaultValue;
                } else {
                    answers[question.name] =
                        answer.toLowerCase().includes("y") || answer.toLowerCase().includes("t");
                }
            } else if (question.type === "input") {
                answers[question.name] = answer || defaultValue;
            }
        }

        rl.close();
        return answers;
    }

    /**
     * Prompts the user with a confirmation question and waits for their input.
     *
     * @param question - The question to display to the user
     * @returns A Promise that resolves to `true` if the user's answer contains 'y' or 't', otherwise `false`
     *
     * @example
     * ```typescript
     * const shouldContinue = await Questioner.promptConfirm("Do you want to continue?");
     * if (shouldContinue) {
     *   console.log("Continuing...");
     * }
     * ```
     */
    public static async promptConfirm(question: string, color = Color.blue): Promise<boolean> {
        const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

        console.log(color(question));
        const answer = await new Promise<string>((resolve) => {
            rl.question(Color.green("(NO)" + " "), (ans) => {
                resolve(ans);
            });
        });

        rl.close();
        return answer.toLowerCase().includes("y") || answer.toLowerCase().includes("t");
    }
}
