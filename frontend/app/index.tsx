import * as React from 'react';
import { StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Provider as PaperProvider } from 'react-native-paper';

// Import your pages here
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
import AddComplaint from '@/screens/user/AddComplaint';

const Stack = createNativeStackNavigator();
const Tab = createMaterialBottomTabNavigator();

// Admin Tabs
const AdminTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="HomeDash"
      activeColor="#ffffff"
      inactiveColor="#000000"
      barStyle={styles.standardBarStyle} // Use standard bar style
    >
      <Tab.Screen
        name="HomeDash"
        component={HomeDash}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Map"
        component={Map}
        options={{
          tabBarLabel: 'Map',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="map" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="ComplainDash"
        component={ComplainDash}
        options={{
          tabBarLabel: 'Complaints',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="alert-circle" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="StoreDash"
        component={StoreDash}
        options={{
          tabBarLabel: 'Store',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="store" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// User Tabs
const UserTabs = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="UserTabsMain" options={{ headerShown: false }}>
        {() => (
          <Tab.Navigator
            initialRouteName="HomePage"
            activeColor="#ffffff"
            inactiveColor="#000000"
            barStyle={styles.standardBarStyle}
          >
            <Tab.Screen
              name="HomePage"
              component={HomePage}
              options={{
                tabBarLabel: 'Home',
                tabBarIcon: ({ color }) => (
                  <MaterialCommunityIcons name="home" color={color} size={26} />
                ),
              }}
            />
            <Tab.Screen
              name="BulkPage"
              component={BulkPage}
              options={{
                tabBarLabel: 'Bulk',
                tabBarIcon: ({ color }) => (
                  <MaterialCommunityIcons name="warehouse" color={color} size={26} />
                ),
              }}
            />
            <Tab.Screen
              name="ComplainPage"
              component={ComplainPage}
              options={{
                tabBarLabel: 'Complaints',
                tabBarIcon: ({ color }) => (
                  <MaterialCommunityIcons name="alert-circle" color={color} size={26} />
                ),
              }}
            />
            <Tab.Screen
              name="StorePage"
              component={StorePage}
              options={{
                tabBarLabel: 'Store',
                tabBarIcon: ({ color }) => (
                  <MaterialCommunityIcons name="store" color={color} size={26} />
                ),
              }}
            />
          </Tab.Navigator>
        )}
      </Stack.Screen>
      <Stack.Screen name="AddBulkPage" component={AddBulkPage} />


      <Stack.Screen name="AddComplaint" component={AddComplaint}/>
    </Stack.Navigator>
  );
};

// Main App
const App = () => {
  return (
    <PaperProvider>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen
          name="Welcome"
          component={WelcomePage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AdminTabs"
          component={AdminTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="UserTabs"
          component={UserTabs}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  standardBarStyle: {
    backgroundColor: '#3d9c56', // Standard background color for the nav bar
  },
});

export default App;
