import { createMemo, createSignal, onCleanup } from 'solid-js';
import { Motion } from 'solid-motionone';

function DudeAlert(props) {
  const [name, setName] = createSignal('');
  const [alertText, setAlertText] = createSignal('');
  const [leftoverName, setLeftoverName] = createSignal('');
  const [leftoverAlertText, setLeftoverAlertText] = createSignal('');

  const [isPlaying, setIsPlaying] = createSignal(false);

  const timer = setInterval(() => {
    if (props.queue.value().length > 0 && !isPlaying()) {
      const item = props.queue.shift();
      setLeftoverName(item.name);
      setLeftoverAlertText(item.text);

      setIsPlaying(true);

      item.onStart();

      setTimeout(() => {
        writeSymbol();

        setTimeout(() => {
          setIsPlaying(false);
          setName('');
          setAlertText('');
        }, item.duration);
      }, 500);
    }
  }, 100);

  onCleanup(() => clearInterval(timer));

  const writeSymbol = () => {
    if (!leftoverAlertText()) {
      return;
    }

    if (leftoverName()) {
      const symbol = leftoverName()[0];
      setLeftoverName(leftoverName().slice(1));
      setName(name() + symbol);
    } else {
      const symbol = leftoverAlertText()[0];
      setLeftoverAlertText(leftoverAlertText().slice(1));
      setAlertText(alertText() + symbol);
    }

    setTimeout(writeSymbol, 50);
  };

  const animate = createMemo(() => {
    return isPlaying()
      ? { opacity: [0, 1], y: [40, 0] }
      : { opacity: [1, 0], y: [0, 40] };
  });

  return (
    <div class="w-[800px] h-[400px] overflow-hidden">
      <div class="relative top-[32px]">
        <Motion.div
          class="absolute left-[40px]"
          animate={animate()}
          transition={{ duration: 0.5, easing: 'ease-in-out' }}
        >
          <div class="py-6 mx-6 w-[464px] h-[128px] flex items-center justify-center absolute overflow-hidden">
            <p class="text-4xl text-center z-10 font-semibold">
              <span class="text-pink-600">
                {name()}
                <span class="opacity-0">{leftoverName()}</span>
              </span>
              {alertText()}
              <span class="opacity-0">{leftoverAlertText()}</span>
            </p>
          </div>
          <img
            src="/dialogue_box.png"
            alt=""
            class="block -z-10 w-[512px] -scale-x-100"
          />
        </Motion.div>
        <Motion.div
          class="absolute top-[112px] -left-[264px]"
          animate={isPlaying() ? { x: [64, 140] } : { x: [140, 64] }}
          transition={{ duration: 0.5, easing: 'ease-in-out' }}
        >
          <img
            src="/dude_outline.gif"
            alt=""
            class="block w-[256px] rotate-90"
          />
        </Motion.div>
      </div>
    </div>
  );
}

export default DudeAlert;
