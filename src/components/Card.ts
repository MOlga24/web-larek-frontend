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
    description: string;   
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
    protected basketItemIndex?: HTMLSpanElement;
    constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions) {
        super(container);

        this.сardTitle = ensureElement<HTMLElement>(`.${blockName}__title`, container);
        this.cardImage= container.querySelector(`.${blockName}__image`);
        this.cardButton= container.querySelector(`.${blockName}__button`);
        this.cardDescription = container.querySelector(`.${blockName}__text`);
        this.cardCategory= container.querySelector(`.${blockName}__category`);
        this.cardPrice= ensureElement<HTMLSpanElement>(`.${blockName}__price`, container);
        this.basketItemIndex =this.container.querySelector('.basket__item-index');
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
    set description(value: string) {
        
            this.setText(this.cardDescription, value);
        }
    
    set price(value: string){
        this.setText(this.cardPrice, value+ ' ' +'синапсов');
    }
    set category (value: string){
        this.setText(this.cardCategory, value);

    }
    set index(value: number){
        this.setText(this.basketItemIndex, value);
      }
}

//  type CatalogItemStatus = {
//     status: boolean,
//     label: string
// };







