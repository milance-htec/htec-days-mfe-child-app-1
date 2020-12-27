import React, { useEffect, useState } from 'react';
import { useMnM } from '@mnm-tech/provider';

function App() {
  const { itemList } = useMnM();

  const [receivedNumber, setReceivedNumber] = useState(-1);

  useEffect(() => {
    if (itemList.length) {
      setReceivedNumber(itemList[0]);
    }
  }, [itemList]);

  return <div>{`Received item is: ${receivedNumber}`}</div>;
}

export default App;
