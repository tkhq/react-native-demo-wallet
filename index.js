import { registerRootComponent } from 'expo';
import { ExpoRoot } from 'expo-router';
<<<<<<< HEAD
import 'react-native-get-random-values'
=======
import 'react-native-get-random-values';
>>>>>>> 6cbc2ef (migrated to use @turnkey/react-native-sessions)

// https://docs.expo.dev/router/reference/troubleshooting/#expo_router_app_root-not-defined

// Must be exported or Fast Refresh won't update the context
export function App() {
  const ctx = require.context('./app');
  return <ExpoRoot context={ctx} />;
}

registerRootComponent(App);
