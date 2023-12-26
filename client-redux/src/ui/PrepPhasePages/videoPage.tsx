import { useEffect, useState } from "react";

interface VideoComponentProps {
  onVideoDone: () => void;
}

export const VideoComponent: React.FC<VideoComponentProps> = ({ onVideoDone }) => {
  const [showSkipText, setShowSkipText] = useState(false);

  useEffect(() => {
    const textTimerId = setTimeout(() => {
      setShowSkipText(true);
    }, 5000);

    return () => clearTimeout(textTimerId);
  }, []);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === " ") {
        onVideoDone();
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  useEffect(() => {
    const videoElement = document.querySelector("video");

    const handleVideoEnd = () => {
      onVideoDone();
    };

    if (videoElement) {
      videoElement.addEventListener("ended", handleVideoEnd);

      return () => {
        videoElement.removeEventListener("ended", handleVideoEnd);
      };
    }
  }, [onVideoDone]);

  return (
    <>
      {showSkipText && (
        <div
          style={{
            position: "absolute",
            bottom: "10%",
            left: "50%",
            transform: "translateX(-50%)",
            color: "white",
            fontWeight: "bold",
            backgroundColor: "black",
            padding: "10px",
            fontSize: "24px",
            opacity: "0.8",
            transition: "opacity 1s ease-in-out",
            zIndex: "100",
          }}
        >
          Skip By Pressing the Space Bar
        </div>
      )}

      <video autoPlay style={{width:"100%", height:"100%"}}>
        <source src="videos/TrailerVid.webm" type="video/webm"/>
      </video>
    </>
  );
};
