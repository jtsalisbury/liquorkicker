import { ENDPOINT } from "./config/config";
import { Drink } from "./models/Drink";

export const getDrinks = (): Promise<Drink[]> => {
    return new Promise((resolve, reject) => {
        fetch(ENDPOINT + 'drinks').then(async response => {
            if (response.ok) {

                const data = await response.json();
                resolve(data);
            }
        })
    });
}