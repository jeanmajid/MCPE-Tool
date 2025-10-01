import { BaseModule } from "../baseModule";

export abstract class BaseAdapter {
    abstract loadModule(modulePath: string): Promise<BaseModule>;
}
