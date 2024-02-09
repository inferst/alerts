import { createSignal } from "solid-js";

export const createQueue = () => {
  const [queue, setQueue] = createSignal([]);

  return {
    push: (item) => {
      setQueue([...queue(), item]);
    },
    shift: () => {
      const value = queue();
      const item = value.shift();
      setQueue(value);
      return item;
    },
    value: queue,
  };
};
