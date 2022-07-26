import { styled } from '@mui/material/styles';
import { Box } from "@mui/material";
import CircularProgress, { CircularProgressProps }  from "@mui/material/CircularProgress";
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import * as React from "react";
import { Drink } from "../models/Drink";
import { PouringStatus } from "../models/PouringStatus";
import './styles/DrinkProgress.css';

interface IDrinkProgressProps {
    activeDrink: Drink;
    pourStatus: PouringStatus;
}

function CircularProgressWithLabel(props: CircularProgressProps & { value: number, time_left: number }) {
    return (
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <Box sx={{ position: 'relative' }}>
                <CircularProgress
                    variant="determinate"
                    sx={{
                    color: (theme) =>
                        theme.palette.grey[800],
                    }}
                    size={40}
                    thickness={4}
                    {...props}
                    value={100}
                />

                <CircularProgress variant="determinate" {...props} sx={{
                    position: 'absolute',
                    left: 0,
                }} />
            </Box>

            <Box
            sx={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
            >
                <p>{props.time_left}s left</p>
            </Box>
        </Box>
    );
}

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 10,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor: theme.palette.grey[800],
    },
    [`& .${linearProgressClasses.bar}`]: {
      borderRadius: 5,
      backgroundColor: '#308fe8',
    }
}));

const DrinkProgress: React.FunctionComponent<IDrinkProgressProps> = ({ activeDrink, pourStatus}) => {
    const getIngredientList = () => {
        return activeDrink.ingredients.map(ingredient => {
            const ingredientStatus = pourStatus.pour_status.filter(i => i.ingredient_id === ingredient.base.id)[0];
            const progress = (1 - ingredientStatus.time_left_sec / ingredientStatus.max_time_sec) * 100;

            return <div className="ingredient-progress" key={`ing-bar-${ingredient.base.id}`}>
                <p className="ingredient-name">{ingredient.base.name}</p>
                <BorderLinearProgress className="ingredient-progress-bar"  variant="determinate" value={progress} />
                <p className="ingredient-percent">{Math.round(progress)}%</p>
            </div>
        });
    } 
    
    return <>
        <h4>Pouring {activeDrink.name}</h4>
        <CircularProgressWithLabel variant="determinate" className="loading-spinner" time_left={pourStatus.pour_time_left} value={(1 - pourStatus.pour_time_left / pourStatus.max_pour_time_sec) * 100} />
        <div className="ingredients">{getIngredientList()}</div>
    </>;
}

export default DrinkProgress;