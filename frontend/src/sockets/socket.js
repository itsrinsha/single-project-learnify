let socket = null;

export const setSocketInstance = (instance) => {
  socket = instance;
};

export const getSocket = () => {
  return socket;
};
