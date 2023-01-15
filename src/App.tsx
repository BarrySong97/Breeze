import { useRef, useState } from "react";
import { useClickAway, useMouse, useKeyPress } from "ahooks";
import TimeScalePaint from "./TimeScale";
import "./App.css";

function TimeScale() {
  const [left, setLeft] = useState<number>(0);
  const [tipLeft, setTipLeft] = useState<number>(0);
  const ref = useRef<HTMLDivElement>(null);
  const paint = useRef<TimeScalePaint | null>(null);
  const hasDown = useRef<boolean>(false);
  const mouse = useMouse(ref.current);
  const [timeTipShow, setTimeTipShowe] = useState<boolean>(false);
  useClickAway(() => {
    hasDown.current = true;
  }, ref);

  useKeyPress("leftarrow", () => {
    if (left > 0) {
      setLeft(left - 1);
    }
  });
  useKeyPress("rightarrow", () => {
    if (left < mouse.elementW) {
      setLeft(left + 1);
    }
  });

  const onMounseDown: React.MouseEventHandler<HTMLDivElement> | undefined = (
    e
  ) => {
    hasDown.current = true;
  };
  const onMouseMove: React.MouseEventHandler<HTMLDivElement> | undefined = (
    e
  ) => {
    if (mouse.elementX >= 0 && mouse.elementX <= mouse.elementW) {
      setTipLeft(mouse.elementX);
      setTimeTipShowe(true);
    } else {
      setTimeTipShowe(false);
    }
    if (
      hasDown.current &&
      mouse.elementX >= 0 &&
      mouse.elementX <= mouse.elementW
    ) {
      setLeft(mouse.elementX);
    } else {
      hasDown.current = false;
    }
  };

  const onMouseUp: React.MouseEventHandler<HTMLDivElement> | undefined = (
    e
  ) => {
    hasDown.current = false;
  };

  return (
    <div className="App">
      <div
        ref={ref}
        className="progress"
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
      >
        <canvas
          ref={(canvas) => {
            if (canvas && !paint.current) {
              const time = new TimeScalePaint(644, 3000, canvas);
              time.draw();
              paint.current = time;
            }
          }}
          id="time-scale"
          onClick={(e) => {
            setLeft(mouse?.elementX);
          }}
        ></canvas>
        <div
          className="progress-preview"
          style={{
            left: tipLeft,
            // display: timeTipShow ? "inline-block" : "none",
          }}
        >
          11:22
        </div>
        <div id="pin" style={{ left }}>
          <div
            id="tr"
            onMouseDown={onMounseDown}
            onMouseMove={onMouseMove}
          ></div>
          <div id="line"></div>
        </div>
      </div>
    </div>
  );
}

export default TimeScale;
