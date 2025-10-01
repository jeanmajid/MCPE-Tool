import { BaseModule } from "../baseModule";
import { BaseAdapter } from "./baseAdapter";

export class JavaScriptAdapter extends BaseAdapter {
    loadModule(modulePath: string): Promise<BaseModule> {
        return new BaseModule();
    }
}
