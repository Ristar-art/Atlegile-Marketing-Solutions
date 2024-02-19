import { Stack } from 'expo-router/stack';

export default function Layout() {
  return (<Stack
    screenOptions={{
      headerStyle: {
        backgroundColor: "#252b42",
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}
  />);
}
