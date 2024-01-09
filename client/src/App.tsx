
import './App.css';
import { useEffect } from 'react';
import { useNetworkLayer } from './hooks/useNetworkLayer';
import { useStore } from "./store/store";
import { UI } from './ui';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


function App() {
  const networkLayer = useNetworkLayer();

  useEffect(() => {
    if (!networkLayer) return;

    console.log("Setting network layer");

    useStore.setState({ networkLayer });

  }, [networkLayer]);


  return (
    <Container>
      <Row className="justify-content-md-center">
      <Col md={5}>
      <UI />
      <ToastContainer />
      </Col>
      </Row>
    </Container>
  );
}

export default App;
