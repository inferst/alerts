export const connection = (props) => {
  const socket = new WebSocket('ws://127.0.0.1:8080/');

  const subscribe = {
    request: 'Subscribe',
    id: 'alerts',
    events: {
      Twitch: ['Follow'],
    },
  };

  socket.onopen = function () {
    socket.send(JSON.stringify(subscribe));
    socket.onmessage = function (event) {
      const data = JSON.parse(event.data);
      if (data.event && data.event.source == 'Twitch') {
        if (data.event.type == 'Follow') {
          props.onFollow(data.user_name);
        }
      }

      console.log('Data received', data);
    };
  };

  socket.onclose = function (event) {
    if (event.wasClean) {
      console.log('Connection was closed');
    } else {
      console.log('Connection is terminated');
    }
    console.log('Code: ' + event.code + ' reason: ' + event.reason);
  };

  socket.onerror = function (error) {
    console.log('Error', error);
  };
};
