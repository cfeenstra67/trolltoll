import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'
import { useCookies } from 'react-cookie';


export default function DarkMode() {
  let [cookies, setCookie, removeCookie] = useCookies(["noDarkMode"]);
  let [enabled, setEnabled] = useState(!cookies.noDarkMode);

  let handleClick = (evt) => {
    if (enabled) {
      setCookie("noDarkMode", "1", { path: "/" });
    } else if (cookies.noDarkMode) {
      removeCookie("noDarkMode", { path: "/" });
    };
    setEnabled(!enabled);
  };

  let body = document.querySelector("body");
  body.className = enabled ? "theme--dark" : "theme--light";

  return (
    enabled ? (
      <FontAwesomeIcon
        onClick={handleClick}
        className="dark-mode-button"
        icon={faMoon}
      />
    ) : (
      <FontAwesomeIcon
        onClick={handleClick}
        className="dark-mode-button"
        icon={faSun}
      />
    )
  )
}
