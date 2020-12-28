import React, { useEffect, useState } from 'react';
import { useMnM } from '@mnm-tech/provider';

import Input from './components/input.component';
import Button from './components/button.component';

import 'App.scss';

function App() {
  const { itemList, setItemList } = useMnM();

  const [inputValue, setInputValue] = useState('');

  return (
    <>
      <span className="mfe-child-app-1__heading">Child App #1</span>
      <div>
        <form
          className="mfe-child-app-1__form"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <Input
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
            }}
          />
          <Button
            type="submit"
            onClick={() => {
              setItemList([...itemList, inputValue]);
              setInputValue('');
            }}
          >
            Add item
          </Button>
        </form>
      </div>
    </>
  );
}

export default App;
