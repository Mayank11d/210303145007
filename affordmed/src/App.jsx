import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [prevState, setPrevState] = useState([]);
  const [currState, setCurrState] = useState([]);
  const [numbers, setNumbers] = useState([]);
  const [avg, setAvg] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchNumbers = async (type) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:9876/numbers/${type}`);
      setPrevState(response.data.windowPrevState);
      setCurrState(response.data.windowCurrState);
      setNumbers(response.data.numbers);
      setAvg(response.data.avg);
    } catch (error) {
      console.error('Error fetching numbers:', error);
    }
    setLoading(false);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Average Calculator</h1>
        <div>
          <button onClick={() => fetchNumbers('e')}>Fetch Even Numbers</button>
          <button onClick={() => fetchNumbers('p')}>Fetch Prime Numbers</button>
          <button onClick={() => fetchNumbers('f')}>Fetch Fibonacci Numbers</button>
          <button onClick={() => fetchNumbers('r')}>Fetch Random Numbers</button>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div>
            <h2>Previous State</h2>
            <p>{JSON.stringify(prevState)}</p>
            <h2>Current State</h2>
            <p>{JSON.stringify(currState)}</p>
            <h2>New Numbers</h2>
            <p>{JSON.stringify(numbers)}</p>
            <h2>Average</h2>
            <p>{avg}</p>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
