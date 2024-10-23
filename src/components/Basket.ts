import { Component } from "./base/Component";
import { IBasketView, IItemData } from "../types";
import { ensureElement, createElement, formatNumber } from "../utils/utils";
import { EventEmitter } from "./base/events";
import {  } from "../utils/utils";
import { ItemData } from "./base/ItemData";
import { BasketData } from "./base/BasketData";
export class Basket extends Component<IItemData>{
    protected basketList: HTMLElement;
    protected basketTotal: HTMLSpanElement;
    basketButton: HTMLButtonElement;


    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);

        this.basketList = ensureElement<HTMLElement>('.basket__list', this.container);
        this.basketTotal = this.container.querySelector('.basket__price');
        this.basketButton = this.container.querySelector('.basket__button');     

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

}