import './App.css';
import { useState, useEffect } from 'react';
import * as React from 'react';
import { PouringStatus } from './models/PouringStatus';
import { getDrinks } from './utils';
import { Drink } from './models/Drink';
import { io, Socket } from 'socket.io-client';
import { EVENTS } from './constants/constants';
import DrinkSelector from './components/DrinkSelector';
import DrinkProgress from './components/DrinkProgress';
import Loading from './components/Loading';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ENDPOINT } from './config/config';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  const [pourStatus, setPourStatus] = useState<PouringStatus>();
  const [drinks, setDrinks] = useState<Drink[]>();
  const [isLoading, setIsLoading] = useState(true);
  const [activeDrink, setActiveDrink] = useState<Drink>();
  const [socket, setSocket] = useState<Socket>(null);

  useEffect(() => {
    if (drinks && pourStatus && !activeDrink) {      
      if (!drinks) {
        return;
      }
      
      const drink = drinks.filter(drink => drink.id === pourStatus.drink_id)[0];
      setActiveDrink(drink);
    }
  }, [drinks, pourStatus, activeDrink])

  useEffect(() => {
   const socket = io(ENDPOINT, {
        transports: ['websocket', 'polling', 'flashsocket']
   });

   setSocket(socket);

   return (): any => socket.close();

  }, [setSocket]);

  const handlePourStatus = (status: string) => {
    const ev = JSON.parse(status);
    setPourStatus(ev);
  }

  const handlePourFinished = () => {
    setActiveDrink(null);
    setPourStatus(null);
  }

  // TODO: Try to reconnect
  const handleDisconnect = () => {
    setActiveDrink(null);
    setPourStatus(null);
  }

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.on(EVENTS.POUR_IN_PROGRESS, handlePourStatus);
    socket.on(EVENTS.POUR_FINISHED, handlePourFinished);
    socket.on(EVENTS.DISCONNECT, handleDisconnect);

    return () => {
      socket.off(EVENTS.POUR_IN_PROGRESS, handlePourStatus);
      socket.off(EVENTS.POUR_FINISHED, handlePourFinished);
      socket.off(EVENTS.DISCONNECT, handleDisconnect);
    }
    
  }, [socket])

  useEffect(() => {
    if (!isLoading) {
      return;
    }

    getDrinks().then(result => {
      setDrinks([...result]);
      setIsLoading(false);
    });
 
  }, [isLoading]);

  return (
    <ThemeProvider theme={darkTheme}>
      <div className="App">
        {!drinks && <div className="container"><Loading></Loading></div>}

        {(drinks && activeDrink) && 
            <div className="container">
              <DrinkProgress activeDrink={activeDrink} pourStatus={pourStatus}></DrinkProgress>
            </div>
        }

        {(drinks && !activeDrink) && <DrinkSelector socket={socket} activeDrink={activeDrink} drinks={drinks}></DrinkSelector>}

      </div>
      </ThemeProvider>
  );
}

export default App;