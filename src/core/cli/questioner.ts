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
    static async prompt(questions: Question[] = []): Promise<Answers> {
        const answers: Answers = {};
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

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
}
