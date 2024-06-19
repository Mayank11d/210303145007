const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 9876;
const WINDOW_SIZE = 10;
const TIMEOUT = 500; // milliseconds

const testServerUrl = 'http://20.244.56.144/test/';
let storedNumbers = [];

const getNumberType = (typeId) => {
  switch (typeId) {
    case 'p':
      return `${testServerUrl}primes`;
    case 'f':
      return `${testServerUrl}fibo`;
    case 'e':
      return `${testServerUrl}even`;
    case 'r':
      return `${testServerUrl}rand`;
    default:
      return null;
  }
};

const fetchData = async (typeId) => {
  const url = getNumberType(typeId);
  if (!url) {
    return null;
  }
  try {
    const response = await axios.get(url, { timeout: TIMEOUT });
    return response.data.numbers;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
};

const updateWindow = (newNumbers) => {
  const uniqueNumbers = [...new Set(storedNumbers.concat(newNumbers))];
  storedNumbers = uniqueNumbers.slice(-WINDOW_SIZE);
};

const calculateAverage = () => {
  if (storedNumbers.length < WINDOW_SIZE) {
    return null;
  }
  const sum = storedNumbers.reduce((acc, num) => acc + num, 0);
  return (sum / WINDOW_SIZE).toFixed(2);
};

app.get('/numbers/:typeId', async (req, res) => {
  const typeId = req.params.typeId;

  const newNumbers = await fetchData(typeId);
  if (!newNumbers) {
    return res.status(500).send('Error fetching data');
  }

  updateWindow(newNumbers);
  const windowPrevState = storedNumbers.slice(0, storedNumbers.length - newNumbers.length);
  const windowCurrState = storedNumbers;
  const avg = calculateAverage();

  res.json({
    windowPrevState,
    windowCurrState,
    numbers: newNumbers,
    avg,
  });
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
