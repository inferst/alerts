import { createMemo, createSignal } from 'solid-js';
import './App.css';
import { connection } from './connection';
import { Motion } from 'solid-motionone';

function App() {
  const [followerName, setFollowerName] = createSignal('');
  const [followText, setFollowText] = createSignal('');

  const [isPlaying, setIsPlaying] = createSignal(false);

  const queue = ['GracefulPotato'];

  const followTextTemplate = ', добро пожаловать!';

  let currentFollowerName = '';
  let currentFollowText = '';

  connection({
    onFollow: (followerName) => {
      queue.push(followerName);
    },
  });

  setInterval(() => {
    queue.push('GracefulPotato');
  }, 10000);

  setInterval(() => {
    if (queue.length > 0 && !isPlaying()) {
      currentFollowerName = queue.shift();
      currentFollowText = followTextTemplate;

      setIsPlaying(true);

      setTimeout(() => {
        writeSymbol();

        setTimeout(() => {
          setIsPlaying(false);
          setFollowerName('');
          setFollowText('');
        }, 5000);
      }, 500);
    }
  }, 100);

  const writeSymbol = () => {
    if (!currentFollowText) {
      return;
    }

    if (currentFollowerName) {
      const symbol = currentFollowerName[0];
      currentFollowerName = currentFollowerName.slice(1);
      setFollowerName(followerName() + symbol);
    } else {
      const symbol = currentFollowText[0];
      currentFollowText = currentFollowText.slice(1);
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
          class="absolute right-[40px]"
          animate={animate()}
          transition={{ duration: 0.5, easing: 'ease-in-out' }}
        >
          <div class="my-6 mx-6 w-[464px] h-[128px] flex justify-center absolute overflow-hidden">
            <p class="text-4xl text-center">
              <span class="text-pink-600 italic font-semibold">{followerName()}</span>
              {followText()}
            </p>
          </div>
          <img src="/dialogue_box.png" alt="" class="block -z-10 w-[512px]" />
        </Motion.div>
        <Motion.div
          class="absolute top-[112px] -right-16"
          animate={isPlaying() ? { x: [140, 64] } : { x: [64, 140] }}
          transition={{ duration: 0.5, easing: 'ease-in-out' }}
        >
          <img
            src="/dude_outline.gif"
            alt=""
            class="block w-[256px] -rotate-90 -scale-x-100"
          />
        </Motion.div>
      </div>
    </div>
  );
}

export default App;
