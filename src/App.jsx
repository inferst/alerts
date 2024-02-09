import './App.css';
import FollowAlert from './components/FollowAlert';
import { createQueue } from './hooks/queue';
import { socket } from './socket/socket';

function App() {
  const queue = createQueue();

  socket({
    onFollow: (followerName) => {
      queue.push(followerName);
    },
  });

  return <FollowAlert queue={queue} />;
}

export default App;
