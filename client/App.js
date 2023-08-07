import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import StackNavigator from './StackNavigator';
import { UserContext } from './UserContext';

export default function App() {
  return (
    <UserContext>
      <StackNavigator />
    </UserContext>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#248',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
