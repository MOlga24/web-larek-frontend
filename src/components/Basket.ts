import { Component } from "./base/Component";
import {  IItemData } from "../types";
import { ensureElement, createElement } from "../utils/utils";
import { EventEmitter } from "./base/events";
import {  } from "../utils/utils";


export class Basket extends Component<IItemData>{
    protected basketList: HTMLElement;
    protected basketTotal: HTMLSpanElement;
    protected basketButton: HTMLButtonElement;
    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);
        this.basketList = ensureElement<HTMLElement>('.basket__list', this.container);
        this.basketTotal = this.container.querySelector('.basket__price');
        this.basketButton = this.container.querySelector('.basket__button');     
        this.basketButton.addEventListener('click', () => {
            events.emit('form:open');
        });
}
    set items(items: HTMLElement[]) {
        if (items.length) {
            this.basketList.replaceChildren(...items);
        } else {
            this.basketList.replaceChildren(createElement<HTMLParagraphElement>('p', {
                textContent: 'Корзина пуста'
            }));
            
        }
    }

    set selected(items: string[]) {
        if (items.length) {
            this.setDisabled(this.basketButton, false);
        } else {
            this.setDisabled(this.basketButton, true);
        }
    }

    set total(total:string) {
        this.setText(this.basketTotal, total);
    }
    toggleButton(value:boolean) {
        this.setDisabled(this.basketButton, !value);
    }
    setHidden(): void {
        this.basketTotal.style.display = 'none';
       }
        
    }
