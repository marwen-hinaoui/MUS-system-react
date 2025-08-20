export const openNotification = (api, msg) => {
  api['error']({
    message: msg,
    duration: 30,
  });
};
export const openNotificationSuccess = (api, msg) => {
  api['success']({
    message: msg,
    duration: 30,
  });
};
