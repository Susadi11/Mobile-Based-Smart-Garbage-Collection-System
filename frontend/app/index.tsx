// Import necessary modules
import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

// Import your screens here
import HomePage from '@/screens/user/HomePage';
import BulkPage from '@/screens/user/BulkPage';
import StorePage from '@/screens/user/StorePage';
import ComplainPage from '@/screens/user/ComplainPage';
import HomeDash from '@/screens/admin/HomeDash';
import ComplainDash from '@/screens/admin/ComplainDash';
import StoreDash from '@/screens/admin/StoreDash';
import Map from '@/screens/admin/Map';
import WelcomePage from '@/screens/WelcomePage';
import AddBulkPage from '@/screens/user/AddBulkPage';
import AddProduct from '@/screens/admin/AddProduct';
import PlaceOrder from '@/screens/user/PlaceOrder';
import UpdateProduct from '@/screens/admin/UpdateProduct';
import AddComplaint from '@/screens/user/AddComplaint';
import ComplainRead from '@/screens/user/ComplainRead';
import AllComplaints from '@/screens/admin/AllComplaints';
import PendingComplaints from '@/screens/admin/PendingComplaints';

// Define stack and tab navigators
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Animated icon component to apply scale animation
const AnimatedIcon: React.FC<{ routeName: string; focused: boolean; color: string }> = ({ routeName, focused, color }) => {
  const scale = useSharedValue(focused ? 1 : 0);

  useEffect(() => {
    scale.value = withSpring(focused ? 1 : 0, { stiffness: 200 });
  }, [focused]);

  const animatedStyle = useAnimatedStyle(() => {
    const scaleValue = interpolate(scale.value, [0, 1], [1, 1.2]);
    return {
      transform: [{ scale: scaleValue }],
    };
  });

  const renderIcon = (routeName: string) => {
    switch (routeName) {
      case 'HomePage':
      case 'HomeDash':
        return <MaterialCommunityIcons name="home" color={color} size={26} />;
      case 'BulkPage':
        return <MaterialCommunityIcons name="warehouse" color={color} size={26} />;
      case 'ComplainPage':
      case 'ComplainDash':
        return <MaterialCommunityIcons name="alert-circle" color={color} size={26} />;
      case 'StorePage':
      case 'StoreDash':
        return <MaterialCommunityIcons name="store" color={color} size={26} />;
      case 'Map':
        return <MaterialCommunityIcons name="map" color={color} size={26} />;
      default:
        return null;
    }
  };

  return <Animated.View style={animatedStyle}>{renderIcon(routeName)}</Animated.View>;
};

// Admin Tabs with animated icons
const AdminTabs: React.FC = () => (
  <Tab.Navigator
    initialRouteName="HomeDash"
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ focused, color }) => <AnimatedIcon routeName={route.name} focused={focused} color={color} />,
      tabBarActiveTintColor: '#3d9c56',
      tabBarInactiveTintColor: '#737373',
      tabBarStyle: {
        height: 80, // Increase height of the tab bar
        paddingBottom: 10, // Adjust padding for better alignment
        paddingTop: 10,
      },
    })}
  >
    <Tab.Screen name="HomeDash" component={HomeDash} options={{ title: 'Home' }} />
    <Tab.Screen name="Map" component={Map} options={{ title: 'Map' }} />
    <Tab.Screen name="ComplainDash" component={ComplainDash} options={{ title: 'Complaints' }} />
    <Tab.Screen name="StoreDash" component={StoreDash} options={{ title: 'Store' }} />
  </Tab.Navigator>
);

// User Tabs with animated icons
const UserTabs: React.FC = () => (
  <Tab.Navigator
    initialRouteName="HomePage"
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ focused, color }) => <AnimatedIcon routeName={route.name} focused={focused} color={color} />,
      tabBarActiveTintColor: '#3d9c56',
      tabBarInactiveTintColor: '#737373',
      tabBarStyle: {
        height: 80, // Increase height of the tab bar
        paddingBottom: 10, // Adjust padding for better alignment
        paddingTop: 10,
      },
    })}
  >
    <Tab.Screen name="HomePage" component={HomePage} options={{ title: 'Home' }} />
    <Tab.Screen name="BulkPage" component={BulkPage} options={{ title: 'Bulk' }} />
    <Tab.Screen name="ComplainPage" component={ComplainPage} options={{ title: 'Complaints' }} />
    <Tab.Screen name="StorePage" component={StorePage} options={{ title: 'Store' }} />
  </Tab.Navigator>
);

// Main App component
const App: React.FC = () => {
  return (
    <PaperProvider>
        <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Welcome" component={WelcomePage} />
          <Stack.Screen name="AdminTabs" component={AdminTabs} />
          <Stack.Screen name="UserTabs" component={UserTabs} />
          <Stack.Screen name="AddBulkPage" component={AddBulkPage} />
          <Stack.Screen name="AddComplaint" component={AddComplaint} />
          <Stack.Screen name="ComplainRead" component={ComplainRead} />
          <Stack.Screen name="AllComplaints" component={AllComplaints} />
          <Stack.Screen name="AddProduct" component={AddProduct} />
          <Stack.Screen name="PlaceOrder" component={PlaceOrder} />
          <Stack.Screen name="StoreDash" component={StoreDash} />
          <Stack.Screen name="UpdateProduct" component={UpdateProduct} />
          <Stack.Screen name="StorePage" component={StorePage} />
          <Stack.Screen name="PendingComplaints" component={PendingComplaints} />
        </Stack.Navigator>
    </PaperProvider>
  );
};

export default App;
