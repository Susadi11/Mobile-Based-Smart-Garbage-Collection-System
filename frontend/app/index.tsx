import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';

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
 

// Import custom TabBar component
import TabBar from '@/components/NavBar/TabBar';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Admin Tabs
const AdminTabs: React.FC = () => (
  <Tab.Navigator
    initialRouteName="HomeDash"
    tabBar={(props) => <TabBar {...props} />}
    screenOptions={{ headerShown: false }} // Hide headers for all screens in this navigator
  >
    <Tab.Screen
      name="HomeDash"
      component={HomeDash}
      options={{ title: 'Home' }}
    />
    <Tab.Screen
      name="Map"
      component={Map}
      options={{ title: 'Map' }}
    />
    <Tab.Screen
      name="ComplainDash"
      component={ComplainDash}
      options={{ title: 'Complaints' }}
    />
    <Tab.Screen
      name="StoreDash"
      component={StoreDash}
      options={{ title: 'Store' }}
    />
  </Tab.Navigator>
);

// User Tabs
const UserTabs: React.FC = () => (
  <Tab.Navigator
    initialRouteName="HomePage"
    tabBar={(props) => <TabBar {...props} />}
    screenOptions={{ headerShown: false }} // Hide headers for all screens in this navigator
  >
    <Tab.Screen
      name="HomePage"
      component={HomePage}
      options={{ title: 'Home' }}
    />
    <Tab.Screen
      name="BulkPage"
      component={BulkPage}
      options={{ title: 'Bulk' }}
    />
    <Tab.Screen
      name="ComplainPage"
      component={ComplainPage}
      options={{ title: 'Complaints' }}
    />
    <Tab.Screen
      name="StorePage"
      component={StorePage}
      options={{ title: 'Store' }}
    />
  </Tab.Navigator>
);

// Main App
const App: React.FC = () => {
  return (
    <PaperProvider>
        <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
          <Stack.Screen
            name="Welcome"
            component={WelcomePage}
          />
          <Stack.Screen
            name="AdminTabs"
            component={AdminTabs}
          />
          <Stack.Screen
            name="UserTabs"
            component={UserTabs}
          />
          <Stack.Screen
            name="AddBulkPage"
            component={AddBulkPage}
          />
           <Stack.Screen
            name="AddProduct"
            component={AddProduct}
          />
          <Stack.Screen
            name="PlaceOrder"
            component={PlaceOrder}
          />
            <Stack.Screen
            name="StoreDash"
            component={StoreDash}
          />
        </Stack.Navigator>
    </PaperProvider>
  );
};

export default App;