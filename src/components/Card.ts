import {Component} from "./base/Component";
// import {ItemStatus} from "../types";
import {bem, createElement, ensureElement} from "../utils/utils";
import { CDN_URL } from "../utils/constants";
import clsx from "clsx";
interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

export interface ICard<T> {
    title: string;
    image: string;
    description: string | string[];   
    category:string;
    price: number;
    status: T;
    id:string;
}

export class Card<T> extends Component<ICard<T>> {
    protected сardTitle: HTMLElement;
    protected cardImage?: HTMLImageElement;
    protected cardDescription: HTMLParagraphElement;
    protected cardCategory?: HTMLSpanElement;
    protected cardPrice: HTMLSpanElement;
    protected cardButton?: HTMLButtonElement;//кнопка нужна не на всех отображениях карточек
    protected cardItemButton?:HTMLElement; 
    constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions) {
        super(container);

        this.сardTitle = ensureElement<HTMLElement>(`.${blockName}__title`, container);
        this.cardImage= container.querySelector(`.${blockName}__image`);
        this.cardButton= container.querySelector(`.${blockName}__button`);
        this.cardDescription = container.querySelector(`.${blockName}__description`);
        this.cardCategory= container.querySelector(`.${blockName}__category`);
        this.cardPrice= ensureElement<HTMLSpanElement>(`.${blockName}__price`, container);
     
// this.cardItemButton.addEventListener('click',() =>this.actions.emit('card:select'),this.data)
        if (actions?.onClick) {
            if (this.cardButton) {
                this.cardButton.addEventListener('click', actions.onClick);
            } else {
                // this.cardItemButton.addEventListener('click', actions.onClick);
               this.container.addEventListener('click', actions.onClick);
            }
        }
    }
  
  
    set id(value: string) {
        this.container.dataset.id = value;
    }

    get id(): string {
        return this.container.dataset.id || '';
    }

    set title(value: string) {
        this.setText(this.сardTitle, value);
    }

    get title(): string {
        return this.сardTitle.textContent || '';
    }

    set image(value: string) {
        this.setImage(this.cardImage,  value, this.title)
    }
    // set image(value: string) {
    //     this.setImage(this._image,  CDN_URL + value, this.title)
    // }
    set description(value: string | string[]) {
        if (Array.isArray(value)) {
            this.cardDescription.replaceWith(...value.map(str => {
                const descTemplate = this.cardDescription.cloneNode() as HTMLElement;
                this.setText(descTemplate, str);
                return descTemplate;
            }));
        } else {
            this.setText(this.cardDescription, value);
        }
    }
}

export type CatalogItemStatus = {
    status: boolean,
    label: string
};

export class CatalogItem extends Card<CatalogItemStatus> {
    protected _status: HTMLElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super('card', container, actions);
        // this._status = ensureElement<HTMLElement>(`.card__status`, container);
    }

    set status({ status, label }: CatalogItemStatus) {
        this.setText(this._status, label);
        this._status.className = clsx('card__status', {
            [bem(this.blockName, 'status', 'selected').name]: status === true,
            [bem(this.blockName, 'status', 'not selected').name]: status === false
        });
    }
}

// export type AuctionStatus = {
//     status: string,
//     time: string,
//     label: string,
//     nextBid: number,
//     history: number[]
// };

// export class AuctionItem extends Card<HTMLElement> {
//     protected _status: HTMLElement;

//     constructor(container: HTMLElement, actions?: ICardActions) {
//         super('lot', container, actions);
//         // this._status = ensureElement<HTMLElement>(`.lot__status`, container);
//     }

//     set status(content: HTMLElement) {
//         this._status.replaceWith(content);
//     }
// }

// interface IAuctionActions {
//     onSubmit: (price: number) => void;
// }

// export class Auction extends Component<AuctionStatus> {
//     protected _time: HTMLElement;
//     protected _label: HTMLElement;
//     protected _button: HTMLButtonElement;
//     protected _input: HTMLInputElement;
//     protected _history: HTMLElement;
//     protected _bids: HTMLElement
//     protected _form: HTMLFormElement;

//     constructor(container: HTMLElement, actions?: IAuctionActions) {
//         super(container);

//         this._time = ensureElement<HTMLElement>(`.lot__auction-timer`, container);
//         this._label = ensureElement<HTMLElement>(`.lot__auction-text`, container);
//         this._button = ensureElement<HTMLButtonElement>(`.button`, container);
//         this._input = ensureElement<HTMLInputElement>(`.form__input`, container);
//         this._bids = ensureElement<HTMLElement>(`.lot__history-bids`, container);
//         this._history = ensureElement<HTMLElement>('.lot__history', container);
//         this._form = ensureElement<HTMLFormElement>(`.lot__bid`, container);

//         this._form.addEventListener('submit', (event) => {
//             event.preventDefault();
//             actions?.onSubmit?.(parseInt(this._input.value));
//             return false;
//         });
//     }

//     set time(value: string) {
//         this.setText(this._time, value);
//     }
//     set label(value: string) {
//         this.setText(this._label, value);
//     }
//     set nextBid(value: number) {
//         this._input.value = String(value);
//     }
//     set history(value: number[]) {
//         this._bids.replaceChildren(...value.map(item => createElement<HTMLUListElement>('li', {
//             className: 'lot__history-item',
//             textContent: formatNumber(item)
//         })));
//     }

//     set status(value: LotStatus) {
//         if (value !== 'active') {
//             this.setHidden(this._history);
//             this.setHidden(this._form);
//         } else {
//             this.setVisible(this._history);
//             this.setVisible(this._form);
//         }
//     }

//     focus() {
//         this._input.focus();
//     }
// }

// export interface BidStatus {
//     amount: number;
//     status: boolean;
// }

// export class BidItem extends Card<BidStatus> {
//     protected _amount: HTMLElement;
//     protected _status: HTMLElement;
//     protected _selector: HTMLInputElement;

//     constructor(container: HTMLElement, actions?: ICardActions) {
//         super('bid', container, actions);
//         this._amount = ensureElement<HTMLElement>(`.bid__amount`, container);
//         this._status = ensureElement<HTMLElement>(`.bid__status`, container);
//         this._selector = container.querySelector(`.bid__selector-input`);

//         if (!this._button && this._selector) {
//             this._selector.addEventListener('change', (event: MouseEvent) => {
//                 actions?.onClick?.(event);
//             })
//         }
//     }

//     set status({ amount, status }: BidStatus) {
//         this.setText(this._amount, formatNumber(amount));

//         if (status) this.setVisible(this._status);
//         else this.setHidden(this._status);
//     }
// }