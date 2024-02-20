import './App.css';
import DudeAlert from './components/DudeAlert';
import { createQueue } from './hooks/queue';
import { socket } from './socket/socket';

const followSound = new Audio('/follow.mp3');
followSound.volume = 0.1;

const raidSound = new Audio('/bugle.mp3');
raidSound.volume = 0.1;

function App() {
  const queue = createQueue();

  socket({
    onFollow: (followerName) => {
      queue.push({
        name: followerName,
        text: ', добро пожаловать!',
        onStart: () => {
          followSound.play();
        },
      });
    },
    onRaid: (raiderName, viewers) => {
      queue.push({
        name: raiderName,
        text: ` рэйдит c ${viewers} зрителями!`,
        onStart: () => {
          raidSound.play();
        },
      });
    },
  });

  return <DudeAlert queue={queue} />;
}

export default App;
