import { TOrderData, PayMethods, IOrder} from "../../types"; 
import  { IOrderData } from "../../types"; 
import { IEvents } from "./events";
export class OrderData implements IOrderData {
  	items: string[];
   total: number | null;
     paymethod: PayMethods;
     adress: string;
    email: string;
     phone: string;
    valid: boolean;
  errors: Partial<Record<keyof TOrderData, string>>;
 events: IEvents;
    constructor(events:IEvents){
        this.events = events;
    }
    // getOrderInfo(): TOrderData{
    //     return {
    //         // items: this.items,
    //         // total:this.total
    //     }
    // }
    setOrderInfo(orderData:IOrder){
        this.adress = orderData.address;
        this.email = orderData.email;
        this.phone = orderData.phone;
        this.paymethod = orderData.payment;
        this.events.emit('order:input');
    }
}
