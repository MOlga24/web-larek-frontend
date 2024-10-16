import { IItemData } from "../../types";
import { Api } from "./api";

export class ItemDataApi extends Api {
getItems(): Promise<IItemData[]>{
    return this.get<IItemData[]>('/api/weblarek/product/');
}

}