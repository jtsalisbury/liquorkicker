import * as React from "react";
import { EVENTS } from "../constants/constants";
import { Drink } from "../models/Drink";
import { PouringStatus } from "../models/PouringStatus";

interface IDrinkProgressProps {
    activeDrink: Drink;
    pourStatus: PouringStatus;
}

const DrinkProgress: React.FunctionComponent<IDrinkProgressProps> = ({ activeDrink, pourStatus}) => {
    return <>
        <p>Now pouring: {activeDrink.name}<br />Finished in {pourStatus.pour_time_left}s</p>
    </>;
}

export default DrinkProgress;