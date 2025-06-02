import { Module } from "../models/files/module";

export type Config = {
    /** The name of the project. */
    name: string;
    /** The description of the project. */
    description: string;
    /** The modules of the project. */
    modules: Module[];
    /** The ID of the project. */
    id: string;
    /** The Path to the Resource Pack (optional). */
    resourcePackPath?: string;
    /** The Path to the Behaviour Pack (optional). */
    behaviourPackPath?: string;

    /**Path  */
    outPut?: "preview" | "stable";

    remote: {
        host: string;
        username: string;
        privateKey: string;
        targetPathBP: string;
        targetPathRP: string;
        passphrase: string;
        password: string;
        disabled: boolean;
    };
};
