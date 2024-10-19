import { IItem, IItemData } from "../../types";
import { Model } from "./Model";

export class BasketData extends Model<IItemData> {
    items: IItemData[] =[];
    total:number;
    getTotalSum(){
       return this.items.reduce((partialSum, a) => partialSum + a.price, 0);
    }
    addToBasket(item:IItemData){
        item.selected =true;
        this.items.push(item);
        this.total = this.getTotalSum();
    }
   removeFromBasket(item:IItemData){
        item.selected =!true;
       this.items = this.items.filter((it) => it.id !==item.id);
        this.total = this.getTotalSum();
    }
    clearBasket(){
        this.items = [];
        this.total = 0;
    }
}