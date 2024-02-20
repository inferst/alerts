export const socket = (props) => {
  const connect = () => {
    const ws = new WebSocket('ws://127.0.0.1:8080/');

    const subscribe = {
      request: 'Subscribe',
      id: 'alerts',
      events: {
        Twitch: ['Follow', 'Raid'],
      },
    };

    ws.onopen = function () {
      ws.send(JSON.stringify(subscribe));
      ws.onmessage = function (event) {
        const data = JSON.parse(event.data);
        if (data.event && data.event.source == 'Twitch') {
          if (data.event.type == 'Follow') {
            props.onFollow(data.data.user_name);
          } else if (data.event.type == 'Raid') {
            props.onRaid(data.data.from_broadcaster_user_name, data.data.viewers);
          }
        }
      };

      console.log('Connected');
    };

    ws.onclose = function () {
      setTimeout(() => {
        connect();
      }, 10000);

      console.log('Closed');
    };

    ws.onerror = function (error) {
      console.log('Error', error);
    };
  };

  connect();
};
