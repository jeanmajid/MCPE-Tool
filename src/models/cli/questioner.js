import readline from "readline";
import { Color } from "./color.js";

/**
 * Class representing a Questioner.
 * @class
 */
export class Questioner {
    /**
     * Prompts the user with a series of questions and returns the answers.
     * @param {Array} questions - An array of question objects.
     * @returns {Promise<Object>} - A promise that resolves to an object containing the user's answers.
     */
    static async prompt(questions = []) {
        const answers = {};
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        for (const question of questions) {
            console.log(Color.blue(question.message));
            const answer = await new Promise((resolve) => {
                rl.question(Color.green("(" + question.default() + ")" + " "), (ans) => {
                    resolve(ans);
                });
            });

            if (question.type === "confirm") {
                if (answer === "") {
                    answers[question.name] = question.default();
                } else {
                    answers[question.name] =
                        answer.toLowerCase().includes("y") || answer.toLowerCase().includes("t");
                }
            } else if (question.type === "input") {
                answers[question.name] =
                    answer ||
                    (typeof question.default === "function"
                        ? question.default()
                        : question.default);
            }
        }

        rl.close();
        return answers;
    }
}
