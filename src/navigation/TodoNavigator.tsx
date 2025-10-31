import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import TodoPage from '../pages/TodoPage';

const Stack = createStackNavigator();

export default function TodoNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Todo" component={TodoPage} />
    </Stack.Navigator>
  );
}