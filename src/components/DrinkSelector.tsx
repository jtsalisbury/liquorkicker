import * as React from "react";
import { EVENTS } from "../constants/constants";
import { Drink } from "../models/Drink";

const DrinkSelector = (props: any) => {
    const { socket, activeDrink, drinks } = props;

    const submitDrink = (e: any, drink_id: number) => {
        e.preventDefault();

        socket.emit(EVENTS.REQUEST_POUR, JSON.stringify({
            drink_id: drink_id
        }));
    }

    return (
        drinks && drinks.map((drink: Drink) => {
            return <form onSubmit={(e) => submitDrink(e, drink.id)} key={`order-form-${drink.id}`}>
                <button>Order {drink.name}</button>
            </form>
        })
    );
}

export default DrinkSelector;