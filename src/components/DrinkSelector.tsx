import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import ClearIcon from '@mui/icons-material/Clear';
import * as React from "react";
import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { EVENTS } from "../constants/constants";
import { Drink } from "../models/Drink";
import DrinkCard from "./DrinkCard";
import './styles/DrinkSelector.css';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@mui/material";

interface IDrinkSelectorProps {
    socket: Socket;
    activeDrink: Drink;
    drinks: Drink[];
}

const DrinkSelector: React.FunctionComponent<IDrinkSelectorProps> = ({ socket, drinks = []}) => {
    const [query, setQuery] = useState('');
    const [filteredDrinks, setFilteredDrinks] = useState<Drink[]>();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [drinkId, setDrinkId] = useState<number>();

    useEffect(() => {
        const result = drinks.filter(drink => {
            const tests = query.toLowerCase().split(',').filter(test => test && test.trim().length > 0);

            if (tests.length === 0) {
                return drink;
            }

            for (let test of tests) {
                test = test.trim();

                if (drink.name.toLowerCase().includes(test)) {
                    return drink;
                }
    
                for (let ing of drink.ingredients) {
                    if (ing.base.name.toLowerCase().includes(test)) {
                        return drink;
                    }
                }
            }

            return null;
        });

        setFilteredDrinks(result);

    }, [drinks, query]);

    const onOrder = (drink: Drink) => {
        setDrinkId(drink.id);
        setDialogOpen(true);
    }

    const onEdit = (drink: Drink) => {

    }

    const onDialogClose = (confirmed: boolean) => {
        setDialogOpen(false);

        if (confirmed) {
            socket.emit(EVENTS.REQUEST_POUR, JSON.stringify({
                drink_id: drinkId
            }));
        }
    }

    return <div className="drink-selector">
        <div>
            <Dialog
                open={dialogOpen}
                onClose={() => onDialogClose(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    Verify an empty cup
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Please confirm that there is an empty cup available under the nozzle
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => onDialogClose(false)}>Cancel</Button>
                    <Button onClick={() => onDialogClose(true)} autoFocus>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </div>

        <div className="drink-selector-container">
            <div className="drink-search-container">
                <TextField 
                    className="drink-search" 
                    label="Search..." 
                    variant="outlined" 
                    onChange={(event) => setQuery(event.target.value)}
                    value={query}
                    InputProps={{
                        endAdornment: <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={() => setQuery('')}
                                edge="end"
                                >
                                {<ClearIcon></ClearIcon>}
                            </IconButton>
                        </InputAdornment>,
                    }}
                />
            </div>
            
            <div className="drink-cards-container">
                {filteredDrinks && filteredDrinks.map((drink: Drink) => {
                    return <DrinkCard drink={drink} onOrder={onOrder} onEdit={onEdit} key={`drink-card-${drink.id}`}></DrinkCard>
                })}
            </div>
        </div>
    </div>;
}

export default DrinkSelector;