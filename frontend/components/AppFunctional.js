import React, { useState } from "react";
import axios from "axios";

// Önerilen başlangıç stateleri
const initialMessage = "";
const initialEmail = "";
const initialSteps = 0;
const initialIndex = 4; // "B" nin bulunduğu indexi

export default function AppFunctional(props) {
  // State tanımlamaları
  const [message, setMessage] = useState(initialMessage);
  const [email, setEmail] = useState(initialEmail);
  const [steps, setSteps] = useState(initialSteps);
  const [index, setIndex] = useState(initialIndex);

  // Helper fonksiyonlar
  function getXY() {
    const x = (index % 3) + 1;
    const y = Math.floor(index / 3) + 1;
    return { x, y };
  }

  function getXYMesaj() {
    const { x, y } = getXY();
    return `Koordinatlar (${x}, ${y})`;
  }

  function reset() {
    setMessage(initialMessage);
    setEmail(initialEmail);
    setSteps(initialSteps);
    setIndex(initialIndex);
  }

  function sonrakiIndex(yon) {
    const newIndex = {
      left: index % 3 === 0 ? index : index - 1,
      right: index % 3 === 2 ? index : index + 1,
      up: index < 3 ? index : index - 3,
      down: index > 5 ? index : index + 3,
    }[yon];
    return newIndex;
  }

  function ilerle(evt) {
    const direction = evt.target.id;
    const newIndex = sonrakiIndex(direction);

    if (newIndex === index) {
      setMessage(
        {
          left: "Sola gidemezsiniz",
          right: "Sağa gidemezsiniz",
          up: "Yukarıya gidemezsiniz",
          down: "Aşağıya gidemezsiniz",
        }[direction]
      );
    } else {
      setIndex(newIndex);
      setSteps(steps + 1);
      setMessage("");
    }
  }

  function onChange(evt) {
    setEmail(evt.target.value);
  }

  const kordinat = getXY();

  function onSubmit(evt) {
    evt.preventDefault();

    axios
      .post("http://localhost:9000/api/result", {
        x: kordinat.x,
        y: kordinat.y,
        steps: steps,
        email: email,
      })
      .then((response) => {
        setMessage(response.data.message);
        console.log("Response:", response.data);
      })
      .catch((error) => {
        setMessage(error.response.data.message);
        console.log("Error:", error);
      });
    setMessage(`Email ${email} ile gönderildi!`);
    setEmail(initialEmail);
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMesaj()}</h3>
        <h3 id="steps">{steps} kere ilerlediniz</h3>
      </div>
      <div id="grid">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
          <div key={idx} className={`square${idx === index ? " active" : ""}`}>
            {idx === index ? "B" : null}
          </div>
        ))}
      </div>
      <div className="info">
        <h3 id="message">{message}</h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={ilerle}>
          SOL
        </button>
        <button id="up" onClick={ilerle}>
          YUKARI
        </button>
        <button id="right" onClick={ilerle}>
          SAĞ
        </button>
        <button id="down" onClick={ilerle}>
          AŞAĞI
        </button>
        <button id="reset" onClick={reset}>
          reset
        </button>
      </div>
      <form onSubmit={onSubmit}>
        <input
          id="email"
          type="email"
          placeholder="email girin"
          value={email}
          onChange={onChange}
        ></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  );
}
