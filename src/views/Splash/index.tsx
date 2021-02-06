import Footer from "components/Footer/Footer";
import { useCountdownQuick } from "hooks/useCountdown";
import React from "react";
import "./Splash.css";

interface SplashViewProps {
  toTime: number;
}
const SplashView: React.FC<SplashViewProps> = ({ toTime }) => {
  const countdown = useCountdownQuick(toTime);

  return (
    <div className="splash">
      <div className="splash-title">
        <h1>{countdown}</h1>
      </div>
      <video autoPlay={true} loop={true} muted={true} playsInline={true}>
        <source src="./lines.webm" type="video/webm"/>
      </video>
      <Footer/>
    </div>
  );
}


export default SplashView;