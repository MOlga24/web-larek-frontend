//интерфейс товара
export interface IItem {
    _id:string;
    name:string;
    description:string;
    price:string;
    category:string[];
    image:string;
    satus:string;

}
//интерфейс пользователя
export interface IUser {
    adress:string;
    email:string;
    telephone:string;
    paymethod:string;
    _id:string;
}
//интерфейс каталога товаров
export interface IItemData {
    items:IItem[];
    preview:string | null; 
    //поменять по аналогии с фильмами
upadateItem(item:IItem, payload: Function | null):void;
getItem(itemId:string):IItem;


}
export interface IUserData {
    checkvalidation(data:Record<keyof TUserInfo, string>):boolean;
}
//типы модалок: модалка платежа
export type TUserInfo = Pick<IUser,'adress' | 'paymethod'>;
export type TPay=Pick<IUser,'email' | 'telephone'>;