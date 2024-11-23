import { GestureHandlerRootView, Pressable } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { router, useRouter } from 'expo-router';
import { AntDesign, Feather, Fontisto, Ionicons } from '@expo/vector-icons';
import { Image, View, StyleSheet, Text, Switch, ActivityIndicator } from 'react-native';
import { deleteToken } from '@/axios/Token';
import { useEffect, useState } from 'react';
import { getUserData } from '@/src/services/authService'; // User data fetching service

const CustomDrawerContent = (props) => {
  const router = useRouter();

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
  
    const fetchUserData = async () => {
      try {
        const data = await getUserData();
  
        if (!data) {
          // If no user data is found, stop further processing
          setError('No user data found');
          setLoading(false);
          return;
        }
  
        setUserData(data.user);
        setLoading(false);
      } catch (err) {
        if (err.name === 'AbortError') {
        } else {
          setError('Failed to fetch user data');
          setLoading(false);
          handleLogout();
        }
      }
    };
  
    fetchUserData();
  
    return () => controller.abort(); // Cleanup fetch
  }, []);
  

 const handleLogout = async () => {
    await deleteToken();  
    router.push('/screen/Login');  
  };


  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.conView}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={styles.userImView}>
          <Image
              style={styles.userIM}
              source={{ uri: userData?.profile_picture || 'https://i.postimg.cc/4xX3TBYx/20240427-174542.jpg' }}
            />
          </View>
          <View style={{ marginLeft: 5, gap: 5 }}>
        <Text style={styles.conText}>{userData?.name || 'User Name'}</Text>
            <Text style={styles.conText}>{userData?.email || 'user@example.com'}</Text>
          </View>
        </View>
      </View>
      <DrawerItem
        icon={() => <Feather name="user" size={20} />}
        label="User"
        onPress={() => router.push('/Home')}
      />
      <DrawerItem
        icon={() => <Ionicons name="business-outline" size={20} />}
        label="Business Console"
        onPress={() => router.push('/(drawer)/BusinessConsole')}
      />
      <DrawerItem
        icon={() => <Fontisto name="motorcycle" size={20} color="black" />}
        label="Driver Console"
        onPress={() => router.push('/(drawer)/DiverConsole')}
      />
      <View style={{ backgroundColor: 'orange', padding: 10, marginTop: 10 }}>
        <Text style={{ marginLeft: 5, fontWeight: 'bold', color: 'white' }}>Preferences</Text>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10 }}>
        <Text style={{ fontWeight: 'bold' }}>Dark Theme</Text>
        <Switch trackColor={{ false: '#767577', true: '#81b0ff' }} thumbColor="#f4f3f4" />
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
        <AntDesign name="login" size={20} />
        <Pressable onPress={handleLogout}>
          <Text style={{ marginLeft: 5 }}>Sign Out</Text>
        </Pressable>
      </View>
    </DrawerContentScrollView>
  );
};

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer screenOptions={{ headerShown: false }} drawerContent={(props) => <CustomDrawerContent {...props} />}>
        <Drawer.Screen
          name="DiverConsole"
          options={{
            title: "Driver Console",
            headerShown: true,
          }}
        />
        <Drawer.Screen
          name="BusinessConsole"
          options={{
            title: "Business Console",
            headerShown: true,
          }}
        />
        <Drawer.Screen
          name="Shop"
          options={{
            title: "Shop",
            headerShown: true,
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  conView: {
    backgroundColor: 'orange',
    padding: 10,
  },
  conText: {
    color: 'white',
    fontWeight: 'bold',
  },
  userImView: {
    height: 50,
    width: 50,
    borderRadius: 75, // Half of width/height for a circular shape
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  userIM: {
    height: 50,
    width: 50,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    fontWeight: 'bold',
  },
});
