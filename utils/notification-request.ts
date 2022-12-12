// const notifications = new NotificationRequest();
// notifications.requestPermission();
// return { requestPermission: notifications.requestPermission }

const requestPermission = (): Promise<"granted" | "denied" | "default"> => {
  const isNotificationsSupported = Boolean(window.Notification);
  if (!isNotificationsSupported) return Promise.resolve("denied");

  const isGrantedNotifications = Notification.permission === "granted"; //notifications already granted
  if (isGrantedNotifications) return Promise.resolve("granted");

  const shouldRequestPermission = Notification.permission !== "denied";
  if (shouldRequestPermission) {
    return Notification.requestPermission().then((permission) => {
      return permission === "granted" ? "granted" : "denied";
    });
  }
  return Promise.resolve("denied");
};
export default requestPermission;
