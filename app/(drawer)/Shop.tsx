import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import axios from '@/axios/axios';
import url from '@/axios/Url';
import { AntDesign,Fontisto, MaterialCommunityIcons, MaterialIcons,  } from '@expo/vector-icons';
const Shop = () => {
  const { shopDatas } = useLocalSearchParams();
  const [errors, setErrors] = useState('');
  const [loading, setLoading] = useState(true);
  const [shopProduct, setShopProduct] = useState([]);
  const router = useRouter();
  const shop = shopDatas ? JSON.parse(shopDatas) : null;
  
  // Using useRef to ensure fetchShopProduct is only called once
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (!shop || !isFirstRender.current) return; // If shop data is not available or if it's already been fetched

    const controller = new AbortController();
    const signal = controller.signal;

    const fetchShopProduct = async () => {
      try {
        // Use the shop.id for fetching products specific to this shop
        const response = await axios.get(`shop-product/${shop.id}`, { signal });

        if (!response.data.product || response.data.product.length === 0) {
          setErrors('No shop data found');
        } else {
          setShopProduct(response.data.product); // Set the fetched products data
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

    fetchShopProduct();

    // Mark that the data has been fetched after the first call
    isFirstRender.current = false;

    return () => controller.abort(); // Cleanup fetch on component unmount
  }, [shop]); // Dependency array, fetch data once when shop is available
 



  if (loading) {
    return (
      <View style={styles.centered}>
        <Text style={{ textAlign: 'center' }}>Loading...</Text>
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
    <ScrollView>
      <View style={styles.container}>
        <View style={{...styles.shopCon}}>
            <View style={{alignItems:'center'}}>
                <Image
                      style={{ ...styles.image}}
                      source={{ uri: `${url}/storage/${shop.shop_photo}` }}
                  />
            </View>
            <View style={{ marginLeft:10,marginTop:10,paddingBottom:10,flexDirection:'row',alignItems:"center"}}>
                  <View style={{ gap:10,borderRightWidth:1,borderRightColor:'grey',width:'60%'}}>
                    <View style={{flexDirection: 'row', gap:10 }}>
                          <View>
                              <AntDesign name='dingding' size={20} />
                          </View>
                          <Text style={styles.shop_distance}>{shop.shop_name}</Text>
                      </View>
                    <View style={{flexDirection: 'row', gap:10 }}>
                          <View>
                              <Fontisto name='email' size={20} />
                          </View>
                          <Text style={styles.shop_distance}> {shop.shop_email.length > 17 ? shop.shop_email.substring(0, 17) + '...' : shop.shop_email}</Text>
                        
                      </View>
                    <View style={{flexDirection: 'row', gap:10 }}>
                          <View>
                              <MaterialCommunityIcons name='phone' size={20} />
                          </View>
                          <Text style={styles.shop_distance}>{shop.shop_phone}</Text>
                      </View>
                  </View>
                  <View >
                    <Text style={{paddingLeft:5}}>{shop.shop_address}</Text>
                  </View>
            </View>
        </View>
      
        <View style={{flexDirection:'row'}}>
            {
              shopProduct.map((item, index) => (
            
              <TouchableOpacity
              onPress={() => {
                // Serialize item and encode it for URL
                const productData = encodeURIComponent(JSON.stringify(item)); 
                // Pass the product data via query parameter
                router.push(`/ProductDetail?productData=${productData}`);
              }}
              key={index}
              style={{...styles.produ_conten,margin:10}}
             
              >
              
              <View >
                <Image
                      style={{ ...styles.product_image}}
                      source={{ uri: `${url}/storage/${item.product_photo}` }}
                  />
              </View>
  <View style={{margin:5,gap:6}}>
  <View>
              <Text> {item.product_name.length > 17 ? item.product_name.substring(0, 17) + '...' : item.product_name}</Text>
              
            </View>
            <View>
              <Text> {item.product_brand_name.length > 17 ? item.product_brand_name.substring(0, 17) + '...' : item.product_brand_name}</Text>
              
            </View>
          <View style={{flexDirection:'row',gap:10}}>
          <View style={{flexDirection: 'row',  }}>
                        <View>
                              <MaterialIcons name='currency-franc' size={15} />
                          </View>
                        <Text style={styles.shop_distance}>{item.best_price_of_piece}</Text>
                      </View>
            <View style={{flexDirection: 'row',  }}>
                <View>
                      <MaterialIcons name='currency-franc' size={15} />
                  </View>
                <Text style={{...styles.shop_distance,  textDecorationLine: 'line-through',}}>{item.mrp_price_of_piece}</Text>
              </View>
  </View>
  </View>
              </TouchableOpacity>
            
              ))
            }
        </View>
        
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  shopCon:{
    borderWidth:1,
    borderColor:'grey'
  },
  image:{
    width:"97%",
    height:150
  },
  shop_name: {
    color: 'grey',
    fontSize: 15,
    fontWeight: 'bold',
    marginTop:10
},
shop_distance: {
    color: 'grey',
    fontWeight: 'bold',
},
product_image:{
  height:100,
  width:150,
  resizeMode: 'cover',
  borderRadius: 10,
},
  produ_conten:{
    borderWidth:1,
    borderColor:'grey'
  }
});

export default Shop;
