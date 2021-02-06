import React from "react";
import Loader from 'react-spinners/CircleLoader';

import "./LoadingButton.css";

interface LoadingButtonProps {
  loading: boolean;
  text: string;
  onClick?: VoidFunction;
  className?: string;
}

const LoadingButton = ({ loading, onClick, text, className }: LoadingButtonProps) => {
  return (
    <button type="submit" className={className ?? "loading-button"} onClick={onClick} value={text}>
      {loading && <Loader color="#FFF" size={20} />}
      {text}
    </button>
  )
}

export default LoadingButton;