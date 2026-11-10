import { Platform } from 'react-native';

// Spread into a touchable's style so it shows a pointer cursor on web.
export const webPointer = Platform.OS === 'web' ? { cursor: 'pointer' } : {};
