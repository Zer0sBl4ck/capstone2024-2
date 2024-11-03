import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'bookshare',
  webDir: 'www',
  server: {
    url: 'http://192.168.1.26:8100', 
    cleartext: true, 
  },
};

export default config;