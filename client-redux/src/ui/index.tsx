import { store } from "../store/store";
import { Wrapper } from "./wrapper";

import { PhaseManager} from "./phaseManager";

export const UI = () => {

  const layers = store((state) => {
    return {
      networkLayer: state.networkLayer,
      phaserLayer: state.phaserLayer,
    };
  });

  if (!layers.networkLayer || !layers.phaserLayer) return <></>;

  //main index that loads the layers we need to this before we do any operations 

  return (
    <Wrapper>
      <PhaseManager />
    </Wrapper>
  );
};
