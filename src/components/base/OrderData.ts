import { TOrderData, PayMethods, IOrder} from "../../types"; 
import  { IOrderData } from "../../types"; 
import { IEvents } from "./events";
import { FormOrder } from "../Form_Order";
export class OrderData extends FormOrder<IOrderData> {
  	items: string[];
   total: number | null;
  payment:string;
     adress: string;
    email: string;
     phone: string;
    //valid: boolean;
//   errors: Partial<Record<keyof TOrderData, string>>;

 constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);

}
    
    // getOrderInfo(): TOrderData{
    //     return {
    //         // items: this.items,
    //         // total:this.total
    //     }
    // }
    setOrderInfo(orderData:IOrder){
        this.adress = orderData.adress;
        this.email = orderData.email;
        this.phone = orderData.phone;
        this.payment= orderData.payment
        this.events.emit('order:input');
    }
  set paymethod(value:boolean) {
   this.toggleClass(this.payMethod,'.button_alt-active',value);
    this.toggleClass(this.payMethod,'.button_alt',!value);
 }
}
