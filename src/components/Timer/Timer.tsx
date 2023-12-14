import { FC, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { timeValueSplit } from "@/utils/date";

interface ITimer {
  initValue?: number; //milliseconds
  onCompleted?: () => void;
  className?: string;
}

const Timer: FC<ITimer> = ({
  initValue = 60 * 60 * 1000,
  onCompleted,
  className,
}) => {
  const [time, setTime] = useState<number>(initValue);
  const interValRef = useRef<NodeJS.Timer | null>(null);

  useEffect(() => {
    interValRef.current = setInterval(() => {
      setTime((prev) => prev - 1000);
    }, 1000);

    return () => {
      if (interValRef.current) clearInterval(interValRef.current);
    };
  }, []);

  useEffect(() => {
    //time > -1000 to prevent onCompleted called multiple times
    if (time <= 0 && time > -1000) {
      onCompleted && onCompleted();
    }
  }, [time]);

  const [date, hour, minute, second] = timeValueSplit(time).map((unit) =>
    unit.toString().padStart(2, "0")
  );

  return (
    <div
      className={clsx(
        "flex justify-around xs:justify-center xs:gap-1 w-full",
        className
      )}
    >
      <span className="bg-black rounded-sm px-1 text-white">{date}d</span>
      <span className="text-black">:</span>
      <span className="bg-black rounded-sm px-1 text-white">{hour}h</span>
      <span className="text-black">:</span>
      <span className="bg-black rounded-sm px-1 text-white">{minute}m</span>
      <span className="text-black">:</span>
      <span className="bg-black rounded-sm px-1 text-white">{second}s</span>
    </div>
  );
};

export default Timer;
