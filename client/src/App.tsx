
import './App.css';
import { useEffect } from 'react';
import { useNetworkLayer } from './hooks/useNetworkLayer';
import { store } from "./store/store";
import { UI } from './ui';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const networkLayer = useNetworkLayer();

  useEffect(() => {
    if (!networkLayer) return;

    console.log("Setting network layer");

    store.setState({ networkLayer });

  }, [networkLayer]);


  return (
    <div>
      <UI />
      <ToastContainer />
    </div>
  );
}

export default App;
