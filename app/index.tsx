import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './screen/Login';
import Register from './screen/Register';
import Home from './(drawer)/(tabs)/Home';
import { getToken } from '@/axios/Token';
import Loding from './screen/Loding';
import Shop from './(drawer)/Shop';



const Stack = createStackNavigator();

const Index = () => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const storedToken = await getToken(); // Await the token retrieval
        setToken(storedToken);
      } catch (error) {
     }
    };

    fetchToken();
  }, []);

  return (

 
    <Stack.Navigator >
      {token ? (
        // Authenticated User
  <>
     
        <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
        <Stack.Screen name="Shop" component={Shop} options={{ headerShown: false }} />
       
  </>
      ) : (
        // Guest User
        <>
          <Stack.Screen name="Loding" component={Loding} options={{ headerShown: false }} />
          <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
          <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default Index;

const styles = StyleSheet.create({});
