import './App.css';
import { useState, useMemo, useEffect } from 'react';
import { Connection } from './socket/Connection';
import * as React from 'react';
import { PouringStatus } from './models/PouringStatus';
import { getDrinks } from './utils';
import { Drink } from './models/Drink';
import { io, Socket } from 'socket.io-client';
import { EVENTS } from './constants/constants';
import DrinkSelector from './components/DrinkSelector';

function App() {
  const [pourStatus, setPourStatus] = useState<PouringStatus>();
  const [drinks, setDrinks] = useState<Drink[]>();
  const [isLoading, setIsLoading] = useState(true);
  const [activeDrink, setActiveDrink] = useState<Drink>();
  const [socket, setSocket] = useState<Socket>(null);

  useEffect(() => {
    if (drinks && pourStatus && !activeDrink) {
      console.log('setting active', drinks)
      
      if (!drinks) {
        return;
      }
      
      const drink = drinks.filter(drink => drink.id === pourStatus.drink_id)[0];
      setActiveDrink(drink);
    }
  }, [drinks, pourStatus])

  useEffect(() => {
   const socket = io('http://localhost:8080', {
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
    setPourStatus(null);
  }

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.on(EVENTS.POUR_IN_PROGRESS, handlePourStatus);
    socket.on(EVENTS.POUR_FINISHED, handlePourFinished);

    return () => {
      socket.off(EVENTS.POUR_IN_PROGRESS, handlePourStatus);
      socket.off(EVENTS.POUR_FINISHED, handlePourFinished);
    }
    
  }, [socket])

  useEffect(() => {
    if (!isLoading) {
      return;
    }

    getDrinks().then(result => {
      console.log('retrieved drinks', result)
      setDrinks([...result]);
      setIsLoading(false);

    });
 
  }, []);



  return (
    <div className="App">
      <header className="App-header">
        {
        pourStatus && 
          <p>time left {pourStatus.pour_time_left}s for {activeDrink && activeDrink.name}</p> 
        || 
          <p>not pouring</p>
        }
        
        <DrinkSelector socket={socket} activeDrink={activeDrink} drinks={drinks}></DrinkSelector>

      </header>
    </div>
  );
}

export default App;