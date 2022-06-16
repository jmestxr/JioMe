import {Dimensions, Image} from 'react-native';
import profileDefaultImage from '../assets/profile_default.png';

export const PROFILE_DEFAULT_IMAGE = Image.resolveAssetSource(profileDefaultImage).uri;

export const WINDOW_HEIGHT = Dimensions.get('window').height;
export const WINDOW_WIDTH = Dimensions.get('window').width;

export const WEEKDAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const WEEKDAY_LONG = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export const MONTH = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];
