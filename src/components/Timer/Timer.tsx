import { FC, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { timeValueSplit } from "@/utils/date";

interface ITimer {
  initValue?: number; //milliseconds
  onCompleted?: () => void;
  className?: string;
  classNames?: {
    root?: string;
    element?: string;
  };
}

const defaultClasses = "bg-black rounded-sm p-1.5 text-white";

const Timer: FC<ITimer> = ({
  initValue = 60 * 60 * 1000,
  onCompleted,
  className,
  classNames,
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
        className,
        classNames?.root
      )}
    >
      <span className={clsx(defaultClasses, classNames?.element)}>{date}d</span>
      <span className="text-black">:</span>
      <span className={clsx(defaultClasses, classNames?.element)}>{hour}h</span>
      <span className="text-black">:</span>
      <span className={clsx(defaultClasses, classNames?.element)}>
        {minute}m
      </span>
      <span className="text-black">:</span>
      <span className={clsx(defaultClasses, classNames?.element)}>
        {second}s
      </span>
    </div>
  );
};

export default Timer;
