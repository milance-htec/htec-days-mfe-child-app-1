import React, { useEffect, useState } from 'react';
import { useMnM } from '@mnm-tech/provider';

import 'App.scss';

function App() {
  const { itemList } = useMnM();

  const [receivedNumber, setReceivedNumber] = useState(-1);

  useEffect(() => {
    if (itemList.length) {
      setReceivedNumber(itemList[0]);
    }
  }, [itemList]);

  return (
    <>
      <span className="mfe-child-app-1__heading">Child App #1</span>
      <div className="mfe-child-app-1">
        <div>{`Received item is: ${receivedNumber}`}</div>
      </div>
    </>
  );
}

export default App;
