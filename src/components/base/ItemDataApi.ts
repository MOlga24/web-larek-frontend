import { IItemData, IOrder, IOrderResult } from "../../types";
import { BasketData } from "./BasketData";
import { ItemData } from "./ItemData";
import { OrderData } from "./OrderData";
import { Api,ApiListResponse } from "./api";
export interface IDataAPI {
    getItemsList: () => Promise<IItemData[]>;
    getItem: (id: string) => Promise<IItemData>;
 
    orderItems: (order: IOrder) => Promise<IOrderResult>;
}
export class ItemDataApi extends Api implements IDataAPI{
    readonly cdn: string;
    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    }

    // getItemsList(): Promise<IItemData[]>{
    // return this.get<IItemData[]>('/api/weblarek/product/');
// }

getItemsList(): Promise<IItemData[]> {
    return this.get('/api/weblarek/product')
    .then((data: ApiListResponse<IItemData>) =>
        data.items.map((item) => ({
            ...item,
            image: this.cdn + item.image

        }))
      );
}
getItem(id: string): Promise<IItemData> {
    return this.get(`/api/weblarek/product/${id}`).then(
        (item: IItemData) => ({
            ...item,
            image: this.cdn + item.image,
        })
    );
}

orderItems(order: IOrder): Promise<IOrderResult> {
    return this.post('/api/weblarek/order', order).then(
        (data: IOrderResult) => data
    );
}

}