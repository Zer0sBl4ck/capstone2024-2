import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'bookshare',
  webDir: 'www',
  server: {
    url: 'http://192.168.123.79:8100', //http://192.168.1.26:8100 http://192.168.123.79:8100
    cleartext: true, 
  },
  plugins: {
    LocalNotifications: {
      smallIcon: 'ic_stat_icon_config_sample',
      iconColor: '#488AFF',
      sound: 'beep.wav',
    },
  },
};

export default config;