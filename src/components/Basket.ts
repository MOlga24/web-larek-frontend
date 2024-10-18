import { Component } from "./base/Component";
import { IBasketView, IItemData } from "../types";
import { ensureElement, createElement, formatNumber } from "../utils/utils";
import { EventEmitter } from "./base/events";
import {  } from "../utils/utils";
import { ItemData } from "./base/ItemData";
export class Basket extends Component<IItemData>{
    protected basketList: HTMLElement;
    protected basketTotal: HTMLSpanElement;
    protected basketButton: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);

        this.basketList = ensureElement<HTMLElement>('.basket__list', this.container);
        this.basketTotal = this.container.querySelector('.basket__price');
        this.basketButton = this.container.querySelector('.basket__button');

        if (this.basketButton) {
            this.basketButton.addEventListener('click', () => {
                events.emit('order:open');
            });
        }

        // this.items = [];
    // }


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

    set total(total: number) {
        this.setText(this.basketTotal, formatNumber(total));
    }
}