import React from "react";
import { WistiaPlayer } from "@wistia/wistia-player-react";

interface WistiaPlayerSectionProps {
  handlePlay: () => void;
  handleOnEnded: () => void;
  handleOnPause: () => void;
}

const WistiaPlayerSection: React.FC<WistiaPlayerSectionProps> = ({ handlePlay, handleOnEnded, handleOnPause }) => (
  <div className="wistia-palyer-video-class">
    <WistiaPlayer
      mediaId="w9mg776ol6"
      onPlay={handlePlay}
      onEnded={handleOnEnded}
      onPause={handleOnPause}
    />
  </div>
);

export default WistiaPlayerSection;
