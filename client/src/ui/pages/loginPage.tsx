import React from "react";

import { ClickWrapper } from "../clickWrapper";
import { Phase } from "../phaseManager";
import { useDojo } from "../../hooks/useDojo";
import { truncateString } from "../../utils";

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Stack from 'react-bootstrap/Stack';
import Image from 'react-bootstrap/Image';
import Container from 'react-bootstrap/Container';

import headerImageUrl from './concept-art.png';

interface LoginPageProps {
  setUIState: React.Dispatch<Phase>;
}

export const LoginPage: React.FC<LoginPageProps> = ({ setUIState }) => {

  const {
    account: { account, create, isDeploying, clear, select, list },
  } = useDojo();

  //create the client game comp for the start of the loading
  const goToLobby = async () => {
    setUIState(Phase.LOBBY);
  }

  return (
    <Container>
      <Stack gap={3}>

        <Image src={headerImageUrl} rounded fluid />

        <Button onClick={create}>
          {isDeploying ? "deploying burner" : "create burner"}
        </Button>

        <Form.Select onChange={(e) => select(e.target.value)}>
          {list().map((account, index) => {
            return (
              <option value={account.address} key={index}>
                {account.address}
              </option>
            );
          })}
          i
        </Form.Select>

        <Button variant="success" onClick={() => { goToLobby() }}>
          Login as {truncateString(account.address, 5)}
        </Button>

        <hr />

        <Button variant="danger" onClick={clear}>
          delete burners
        </Button>

      </Stack>
    </Container>
  );
};
