import './App.css';
import DudeAlert from './components/DudeAlert';
import { createQueue } from './hooks/queue';
import { socket } from './socket/socket';

const followSound = new Audio('/follow.mp3');
followSound.volume = 0.1;

const raidSound = new Audio('/bugle.mp3');
raidSound.volume = 0.2;

function App() {
  const queue = createQueue();

  socket({
    onFollow: (followerName) => {
      queue.push({
        name: followerName,
        text: ', добро пожаловать!',
        duration: 5000,
        onStart: () => {
          followSound.play();
        },
      });
    },
    onRaid: (raiderName, viewers) => {
      queue.push({
        name: raiderName,
        duration: 8000,
        text: ` рейдит c ${viewers} зрителями!`,
        onStart: () => {
          raidSound.play();
        },
      });
    },
  });

  return <DudeAlert queue={queue} />;
}

export default App;
