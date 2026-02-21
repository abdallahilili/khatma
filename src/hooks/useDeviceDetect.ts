import { useEffect, useState } from "react";

export function useDeviceDetect() {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();

    const ios = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(ios);

    const standalone =
      (window.navigator as any).standalone === true ||
      window.matchMedia("(display-mode: standalone)").matches;

    setIsStandalone(standalone);
  }, []);

  return { isIOS, isStandalone };
}