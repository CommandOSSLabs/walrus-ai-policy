import { useState } from "react";

export default () => {
  const [isCopy, setIsCopy] = useState(false);

  const handleCopy = (text: string, duration = 2000) => {
    navigator.clipboard.writeText(text);

    setIsCopy(true);

    setTimeout(() => setIsCopy(false), duration);
  };

  return {
    handleCopy,

    isCopy,
  };
};
