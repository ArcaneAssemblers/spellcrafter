import { useEffect,useState } from "react";
import { NetworkLayer } from "../dojo/createNetworkLayer";
import { store } from "../store/store";
import { usePhaserLayer } from "../hooks/usePhaserLayer";

import { drawPhaserLayer } from "./systems/eventSystems/eventEmitter";

type Props = {
  networkLayer: NetworkLayer | null;
};

// TODO: this is where we need to set the burner account from local storage.

export const PhaserLayer = ({ networkLayer }: Props) => {
 
    const { phaserLayer, ref } = usePhaserLayer({ networkLayer });
    const [isVisible, setIsVisible] = useState(false);  // visibility of the tooltip
  
  
    useEffect(() => {
      if (phaserLayer) {
        store.setState({ phaserLayer });
  
        console.log("Setting phaser layer");
      }
    }, [phaserLayer]);
  
  
    const visibilitySet = (visibility: boolean) => 
    {
      setIsVisible(visibility);
    }
  
    useEffect(() => {
      drawPhaserLayer.on("toggleVisibility", visibilitySet);
  
      return () => {
        drawPhaserLayer.off("toggleVisibility", visibilitySet);
      };
    }, []);

    
    return (
        <div>
          {isVisible ? (
            <div ref={ref} className="phaser-layer-original" />
          ) : (
            <div className="phaser-layer-substitute" />
          )}
        </div>
        );
};
