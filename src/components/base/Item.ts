import { ensureElement } from "../../utils/utils";
import { Component } from "../Component";
    export class Item extends Component {
        protected itemTitle: HTMLElement;
        protected itemButton:HTMLButtonElement;
        protected itemDescription: HTMLParagraphElement;
        protected itemCategory: HTMLSpanElement;
        protected itemPrice:HTMLSpanElement;
        protected itemImage:HTMLImageElement;
       
        constructor(container:HTMLElement){
           super(container)
           this.itemTitle = ensureElement('.card__title',this.container);
           this.itemButton = ensureElement('.button',this.container) as HTMLButtonElement;
           this.itemDescription = ensureElement('.card__text',this.container) as HTMLParagraphElement;
           this.itemCategory = ensureElement('.card__category',this.container);
          this.itemPrice=ensureElement('.card__price',this.container);
          this.itemImage=ensureElement('.card__image',container) as HTMLImageElement;
        }

        set title(value:string){
            this.setText(this.itemTitle,value); 
        }
        set category(value:string){
            this.setText(this.itemCategory,value); 
        }
        set price(value:string){
            this.setText(this.itemPrice,value); 
        }
        set image(value:string) {
            this.setImage(this.itemImage, value, this.title);
        }
        set sescription(value:string){
            this.setText(this.itemDescription,value); 
        }
        // //для переключения способа оплаты => перенести в order
        // set paymethod(value:boolean) {
        //     this.toggleClass(this.orderPaymethod,'.button_alt-active',value);
        //     this.toggleClass(this.orderPaymethod,'.button_alt',!value);
        // }
    }
