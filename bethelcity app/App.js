import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { FlatList as RNFlatList } from 'react-native';

// --- Global FlatList override for logging ---
const OriginalFlatList = RNFlatList;
export const FlatList = (props) => {
  const stack = new Error().stack.split("\n").slice(2, 7).join("\n");
  console.log("FlatList rendered here:\n", stack);
  return <OriginalFlatList {...props} />;
};

// Import your screens
import Dashboard from './dashboard';
import Posts from './posts';
import Register from './register';
import Performance from './performance';
import RegisterBusiness from './RegisterBusiness';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            switch (route.name) {
              case 'Home':
                iconName = focused ? 'home' : 'home-outline';
                break;
              case 'Posts':
                iconName = focused ? 'chatbubble-ellipses' : 'chatbubble-ellipses-outline';
                break;
              case 'Register':
                iconName = focused ? 'person-add' : 'person-add-outline';
                break;
              case 'Performance':
                iconName = focused ? 'trending-up' : 'trending-down';
                break;
              case 'RegisterBusiness':
                iconName = focused ? 'briefcase' : 'briefcase-outline';
                break;
              default:
                iconName = 'ellipsis-horizontal';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#007aff',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: { height: 60 },
          headerShown: false,
          keyboardHidesTabBar: false,
        })}
      >
        <Tab.Screen name="Home" component={Dashboard} />
        <Tab.Screen name="Register" component={Register} />
        <Tab.Screen name="Posts" component={Posts} />
        <Tab.Screen name="Performance" component={Performance} />
        <Tab.Screen name="RegisterBusiness" component={RegisterBusiness} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}