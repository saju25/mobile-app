import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Pressable, Dimensions } from 'react-native';
import Swiper from 'react-native-swiper'; 
import { shopDataGet } from '@/src/services/Shop';
import { useNavigation, useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const Home = ( ) => {
  const [errors, setErrors] = useState('');
  const [loading, setLoading] = useState(true);
  const [shopData, setShopData] = useState([]);
  const router = useRouter();
  const url = "http://192.168.31.43:8080"; // Your backend URL

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchShopData = async () => {
      try {
        const data = await shopDataGet(signal); // Assuming you are passing the signal for aborting request

        if (!data || data.length === 0) {
          setErrors('No shop data found');
        } else {
          setShopData(data); // Set the fetched data
        }

        setLoading(false);
      } catch (err) {
        if (err.name === 'AbortError') {
          console.log('Request aborted');
        } else {
          setErrors('Failed to fetch shop data');
        }
        setLoading(false);
      }
    };

    fetchShopData();

    return () => controller.abort(); // Cleanup fetch on component unmount
  }, []);

  // Show loading state or error if any
  if (loading) {
    return (
      <View style={styles.centered}>
        <Text style={{textAlign:'center'}}>Loading...</Text>
      </View>
    );
  }

  if (errors) {
    return (
      <View style={styles.centered}>
        <Text>{errors}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Shop Data</Text>
      <Swiper
        showsButtons={false}
        loop={true} // Allow the swiper to loop through slides
        autoplay={true} // Auto scroll slides after a certain interval
      >
        {shopData.map((shop, index) => (
          <View key={index}>
            <Pressable
              onPress={() => {
                router.push(`/(drawer)/Shop?id=${shop.id}`)
                router.push('/(drawer)/Shop')
              }}
            >
              <Image 
                source={{ uri: `${url}/storage/${shop.shop_photo}` }} 
                style={styles.image} 
              />
              <Text>{shop.shop_name || 'Shop Name'}</Text>
              <Text>{shop.shop_address || 'Shop Address'}</Text>
            </Pressable>
          </View>
        ))}
      </Swiper>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  image: {
    width: 300,
    height: 200,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Home;
