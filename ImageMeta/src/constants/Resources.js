import { Platform } from 'react-native';

export const ADMOB_AD_ID = 'ca-app-pub-2379651866005548/3792023915';
export const STORE_PAGE_URI = PageUri = Platform.select({
    ios: 'http://apple.com',
    android: 'market://details?id=net.ar90n.imagemeta'
});
export const GITHUB_PAGE_URI = 'https://github.com/ar90n/imagemeta';
export const PRIVACY_POLICY_PAGE_URI = 'https://ar90n.github.io/lab/privacy-policy';
export const MANUAL_MESSAGE_01 = 'Choose a picture';
export const MANUAL_MESSAGE_02 = 'Share with ImageMeta';
export const MANUAL_MESSAGE_03 = 'Check meta information about it';
export const MANUAL_IMAGE_KEY_01 = 'manual_01';
export const MANUAL_IMAGE_KEY_02 = 'manual_02';
export const MANUAL_IMAGE_KEY_03 = 'manual_03';
export const APP_ICON_KEY = 'app_icon';
