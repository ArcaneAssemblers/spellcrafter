import { useStore } from "../store/store";
import { Wrapper } from "./wrapper";

import { PhaseManager} from "./phaseManager";

export const UI = () => {

  const layers = useStore((state) => {
    return {
      networkLayer: state.networkLayer,
    };
  });

  if (!layers.networkLayer ) return <></>;

  //main index that loads the layers we need to this before we do any operations 

  return (
    <Wrapper>
      <PhaseManager />
    </Wrapper>
  );
};
