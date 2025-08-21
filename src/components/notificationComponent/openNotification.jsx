export const openNotification = (api, msg) => {
  api['error']({
    message: msg,
    duration: 15,
  });
};
export const openNotificationSuccess = (api, msg) => {
  api['success']({
    message: msg,
    duration: 15,
  });
};
