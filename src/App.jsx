import { useEffect, useState } from "react";
import Dot from "./components/dots-game.jsx";
import './css/DotsGame.css';

export default function App() {

  useEffect(() => {
    if (typeof document !== "undefined") {
      const noSelectElements = document.querySelectorAll(".no-select");
      noSelectElements.forEach((el) => {
        el.style.userSelect = "none";
      });
    }
  }, []);
  return (
    <main id="main-content" className="no-select">
      <Dot />
    </main>
  );
}
