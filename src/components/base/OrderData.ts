import { TOrderData, PayMethods, IOrder, IContacts} from "../../types"; 
import  { IOrderData } from "../../types"; 
import { IEvents } from "./events";
import { FormOrder } from "../Form_Order";
import { Model } from "./Model";
export class OrderData extends Model<IOrder> {
  	items: string[]=[];
    total: number | null=null;
    payment: string;
    adress: string ='';
    email: string ='';
    phone: string ='';
    valid: boolean = false;
    errors:string[];
    errorMessage = ['поле не может быть пустым', 'необходимо выбрать способ оплаты',
        'необходимо заполнить все поля'];
   
    setOrderField(field: keyof TOrderData, value: string) {
        this[field] = value;

        if (this.validateOrder()) {
            this.events.emit('order:ready', this);
  
        }
    }
    setContactsField(field: keyof TOrderData, value: string) {
            this[field] = value;
        if (this.validateContacts()){
             this.events.emit('contacts:ready', this);
  
        }
    }

    validateOrder(){
        const errors:string[]=[];   console.log(Object.keys(this)) ;
        if(!this.adress && !this.payment){
            errors.push(this.errorMessage[2])
        }
        else
        { if (!this.adress){        
            errors.push(this.errorMessage[0]); 
        }
        if (!this.payment){ 
            errors.push(this.errorMessage[1]); 
        }    
        }   
        this.errors= errors;
        this.events.emit('order:change',this.errors);
        return Object.keys(errors).length === 0;
    }


    validateContacts(){
    const errors:string[]=[];
    if(!this.phone && !this.email){
    errors.push(this.errorMessage[2])
    }       
    else
    { if (!this.phone){        
    errors.push(this.errorMessage[0]); 
    }
    if (!this.email){ 
    errors.push(this.errorMessage[1]); 
    }
    }  
    this.errors= errors;
    this.events.emit('contacts:change',this.errors);
    return Object.keys(errors).length === 0;
}

}
