import { cssInterop } from 'nativewind';
import { CopyIcon } from 'lucide-react-native';

const icons = {
  copy: cssInterop(CopyIcon, {
    className: {
      target: 'style',
      nativeStyleToProp: {
        color: true,
        opacity: true,
      },
    },
  }),
};

export const Icons = {
  copy: icons.copy,
};
