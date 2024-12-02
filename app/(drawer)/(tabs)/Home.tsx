import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { shopDataGet } from '@/src/services/ShopDataGet';
import ShopCard from '@/components/ShopCard';

const screenWidth = Dimensions.get('window').width;
const url = "http://192.168.31.43:8080"; // Your backend URL

const Home = () => {
  const [errors, setErrors] = useState('');
  const [loading, setLoading] = useState(true);
  const [shopData, setShopData] = useState([]);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchShopData = async () => {
      try {
        const data = await shopDataGet(signal);
      
        if (!data || data.length === 0) {
          setErrors('No shop data found');
        } else {
          setShopData(data);
        }
        setLoading(false);
      } catch (err) {
        setErrors('Failed to fetch shop data');
        setLoading(false);
      }
    };

    fetchShopData();

    return () => controller.abort();
  }, []);

  // Show loading state or error if any
  if (loading) {
    return (
      <View style={styles.centered}>
        <Text>Loading...</Text>
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
      <FlatList
        style={{ marginTop: 10, marginBottom: 10 }}
        horizontal={true}
        data={shopData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity >
            <ShopCard
              screenWidth={screenWidth * 0.8}
              shop_name={item.shop_name}
              shop_address={item.shop_address}
              images={item.shop_photo}
              shop_review={item.shop_review}
              shop_review_no={item.shop_review_no}
              item={item}
            />
          </TouchableOpacity>
        )}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  name: {
    color: 'gray',
    fontSize: 15,
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
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
});

export default Home;
