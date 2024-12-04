import "react-native-url-polyfill/auto";
import {
  NavigationContainer,
  NavigationIndependentTree,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import RegisterScreen from "@/components/RegisterScreen";
import Home from "@/components/Home";
import CheckInScreen from "@/components/CheckInScreen";
import CheckOutScreen from "@/components/CheckOutScreen";

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationIndependentTree>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{ headerShown: true }} //  headers
        >
          {/* Home Screen */}
          <Stack.Screen name="Home" component={Home} />

          {/* Register Screen */}
          <Stack.Screen name="Register" component={RegisterScreen} />

          {/* Check In Screen */}
          <Stack.Screen
            name="Check In"
            component={CheckInScreen}
            // options={{
            //   headerShown: false,
            // }}
          />

          {/* Check Out Screen */}
          <Stack.Screen
            name="Check Out"
            component={CheckOutScreen}
            // options={{
            //   headerShown: false,
            // }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </NavigationIndependentTree>
  );
};

export default App;
