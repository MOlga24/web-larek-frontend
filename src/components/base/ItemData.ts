import { IEvents } from "./events";
import { IItemData, TOrderData } from "../../types";
import { IItemsCatalog } from "../../types";

export class ItemData  {
    protected items: IItemData[] = [];
    protected   total:string= '';
    // status: string;
     selected?:boolean;
//     preview: string;
// id: string;
//     name: string;
//     category: string[];
//      image: string;
//    price: string;
// //      status: string;
//      description: string;
//    _preview: string | null;
//     events: IEvents;
    constructor(){
        
    }
   set (id:string, value:boolean){const u = this.getItem(id);
    
   (u.selected == value)}
      setItems(items: IItemData[]){
          this.items = items;
      }

     getItems(item:IItemData[]):IItemData[] {
       return this.items;
    
     }
     getItem(id:string):IItemData{
        return this.items.find(item => item.id ===item.id);
     }
//      selectItem(id:string){
//        const item = this.getItem(id);
//        item.selected = !item.selected;
//   }
     getTotal(items:IItemData[]){
        return this.items.length;
     }
    // getSelected():IItemData[]{
    //     return this.items.filter(item => item.selected)
    // }
    }
// get items (){
//     return this._items;
// }
// getItemInfo(): IItemData{
//     return {
//         items: this.items,
//         total:this.total
//     }
// }
// addItem(item:IItemData){
//     this._items = [item, ...this._items]

// }
// deleteItem(itemId:string, payload: Function | null = null){    
// this._items = this._items.filter(item => item._id!==itemId);

// }
// get preview (){
//     return this. _preview;
// }
// } 