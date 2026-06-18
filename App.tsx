// ─────────────────────────────────────────────
//  App.tsx  —  entry point
//
//  Imports global.css so NativeWind works,
//  then renders the navigator which owns all screens.
// ─────────────────────────────────────────────

import './global.css';
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
  return <RootNavigator />;
}