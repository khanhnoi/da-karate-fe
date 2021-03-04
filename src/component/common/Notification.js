import { NotificationManager } from 'react-notifications';

const createNotification = (type, mes) => {
  switch (type) {
    case 'info':
      NotificationManager.info(mes);
      break;
    case 'success':
      NotificationManager.success(mes, 'Thông báo');
      break;
    case 'warning':
      NotificationManager.warning(mes, 'Cảnh Báo', 3000);
      break;
    case 'error':
      NotificationManager.error(mes, 'Thông Báo!', 5000);
      break;
    default:
      NotificationManager.info(mes);
  }
};

export default createNotification;
