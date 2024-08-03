const readline = require("readline");
const { Color } = require("./color");

class Questioner {
    static async prompt(questions = []) {
        const answers = {};
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
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
                    answers[question.name] = answer.toLowerCase().includes("y");
                }
            } else if (question.type === "input") {
                answers[question.name] = answer || (typeof question.default === "function" ? question.default() : question.default);
            }
        }

        rl.close();
        return answers;
    }
}

module.exports = {
    Questioner,
};
