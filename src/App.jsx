import { createMemo, createSignal, onCleanup } from 'solid-js';
import { Motion } from 'solid-motionone';
import './App.css';
import { connection } from './connection';

const alertSound = new Audio('/game_treasure.wav');
alertSound.volume = 0.1;

function App() {
  const [followerName, setFollowerName] = createSignal('');
  const [followText, setFollowText] = createSignal('');
  const [leftoverFollowerName, setLeftoverFollowerName] = createSignal('');
  const [leftoverFollowText, setLeftoverFollowText] = createSignal('');

  const [isPlaying, setIsPlaying] = createSignal(false);

  const queue = [];

  const followTextTemplate = ', добро пожаловать!';

  connection({
    onFollow: (followerName) => {
      queue.push(followerName);
    },
  });

  const timer = setInterval(() => {
    if (queue.length > 0 && !isPlaying()) {
      setLeftoverFollowerName(queue.shift());
      setLeftoverFollowText(followTextTemplate);

      setIsPlaying(true);

      setTimeout(() => {
        writeSymbol();

        alertSound.pause();
        alertSound.currentTime = 0;
        alertSound.play().catch(() => {});

        setTimeout(() => {
          setIsPlaying(false);
          setFollowerName('');
          setFollowText('');
        }, 5000);
      }, 500);
    }
  }, 100);

  onCleanup(() => clearInterval(timer));

  const writeSymbol = () => {
    if (!leftoverFollowText()) {
      return;
    }

    if (leftoverFollowerName()) {
      const symbol = leftoverFollowerName()[0];
      setLeftoverFollowerName(leftoverFollowerName().slice(1));
      setFollowerName(followerName() + symbol);
    } else {
      const symbol = leftoverFollowText()[0];
      setLeftoverFollowText(leftoverFollowText().slice(1));
      setFollowText(followText() + symbol);
    }

    setTimeout(writeSymbol, 50);
  };

  const animate = createMemo(() => {
    return isPlaying()
      ? { opacity: [0, 1], y: [40, 0] }
      : { opacity: [1, 0], y: [0, 40] };
  });

  return (
    <div class="w-[800px] h-[400px]  overflow-hidden">
      <div class="relative top-[32px]">
        <Motion.div
          class="absolute left-[40px]"
          animate={animate()}
          transition={{ duration: 0.5, easing: 'ease-in-out' }}
        >
          <div class="py-6 mx-6 w-[464px] h-[128px] flex items-center justify-center absolute overflow-hidden">
            <p class="text-4xl text-center z-10">
              <span class="text-pink-600 font-semibold">
                {followerName()}
                <span class="opacity-0">{leftoverFollowerName()}</span>
              </span>
              {followText()}
              <span class="opacity-0">{leftoverFollowText()}</span>
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

export default App;
