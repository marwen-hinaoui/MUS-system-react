export const openNotification = (api, msg) => {
  api['error']({
    message: msg,
    duration: 5,
  });
};
