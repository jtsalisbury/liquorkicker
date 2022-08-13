import { Button, CardContent } from "@mui/material";
import Card from "@mui/material/Card";
import * as React from "react";
import { ENDPOINT } from "../config/config";
import { Drink } from "../models/Drink";
import './styles/DrinkCard.css';

interface IDrinkCardProps {
    drink: Drink;
    onOrder: any;
    onEdit: any;
}

const DrinkCard: React.FunctionComponent<IDrinkCardProps> = ({ drink, onOrder, onEdit }) => {

    const getIngredients = () => {
        return drink.ingredients.map(i => i.base.name).join(', ');
    }

    return <Card variant="outlined" className="drink-card">
        <CardContent className="drink-card-content">
                <img 
                    className="drink-card-icon"
                    src={`${ENDPOINT}/${drink.image}`} 
                    alt={drink.name}
                />

                <div className="drink-card-info">
                    <h4 className="drink-card-header">{drink.name}</h4>
                    <p className="drink-card-ingredients">{getIngredients()}</p>
                </div>  

                <div className="drink-card-actions">
                    <Button variant="contained" className="drink-card-button" size="small" onClick={() => onOrder(drink)}>Pour</Button>
                    {/*<Button variant="outlined" className="drink-card-button" size="small" onClick={() => onEdit(drink)}>Customize</Button>*/}
                </div>                 

        </CardContent>
    </Card>
}

export default DrinkCard;