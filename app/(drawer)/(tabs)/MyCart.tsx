import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { cartGet } from '@/src/services/CartGet';
import { Picker } from '@react-native-picker/picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import axios from '@/axios/axios';
import { getToken } from '@/axios/Token';
import url from '@/axios/Url';




const MyCart = () => {
   
    const [quantity, setQuantity] = useState(1);
    const [selectedValue, setSelectedValue] = useState(1);
    const [cartItems, setCartItems] = useState([]);
    const [products, setProduct] = useState([]);
    
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
  
    const [updateQ, setupdateQ] = useState();
    console.log(selectedValue)
  
    const increaseQuantity = async (productId) => {
      try {
         const updatedCartItems = await cartItems.map((item) => {
              if (item.product_id === productId) {
                  return {
                      ...item,
                      quantity: item.quantity + 1, // Increase the quantity by 1
                  };
              }
              return item;
          });
       
         setCartItems(updatedCartItems);
         const token = await getToken();
         const productToUpdate = updatedCartItems.find(product => product.id === productId);
         if (productToUpdate) {
          const response = await axios.put(`/updata-cart/${productId}`, {
              quantity: updatedCartItems.find(item => item.product_id === productId).quantity,
          }, {
              headers: {
                  'Authorization': `Bearer ${token}`,
              },
          });

          // Optionally handle the response to show success or failure
          console.log('Updated cart successfully:', response.data);
          Alert.alert('Product quantity updated in cart!');
      }
      } catch (error) {
         Alert.alert('Failed to update quantity');
      }
  };
  
  const decreaseQuantity = async (productId) => {
    try {
        // Update the cart items state by decreasing the quantity by 1 for the given product ID
        const updatedCartItems = cartItems.map((item) => {
            if (item.product_id === productId) {
                // Ensure the quantity does not go below 1
                return {
                    ...item,
                    quantity: item.quantity > 1 ? item.quantity - 1 : 1,
                };
            }
            return item;
        });

        // Update the state with the modified cart items
        setCartItems(updatedCartItems);

        // Get the token for authorization
        const token = await getToken();
        const productToUpdate = updatedCartItems.find(product => product.product_id === productId);
        if (productToUpdate) {
            // Send the updated quantity to the server
            const response = await axios.put(`/updata-cart/${productId}`, {
                quantity: productToUpdate.quantity,
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            // Optionally handle the response to show success or failure
            console.log('Updated cart successfully:', response.data);
            Alert.alert('Product quantity updated in cart!');
        }
    } catch (error) {
        Alert.alert('Failed to update quantity');
    }
};





    useEffect(() => {
       
      const fetchCartData = async () => {
        try {
            setLoading(true);


            const token = await getToken();
     
            // If no token is returned, handle the case accordingly
            if (!token) {
                throw new Error('No token found');
            }
      
            // Make the GET request to fetch cart data
            const response = await axios.get('/product', {
                headers: {
                    Authorization: `Bearer ${token}`, // Include the token in the request header
                },
            });
           setProduct(response.data.product);
          const data = await cartGet();
            if (!data) {
                setError('No items found in the cart');
                setLoading(false);
                return;
            }
    
            setCartItems(data.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch cart data');
            setLoading(false);
        }
    };
    
    fetchCartData();

    }, []);

    if (loading) {
        return <Text>Loading...</Text>;
    }

    if (error) {
        return <Text>{error}</Text>;
    }

    return (
        <View style={styles.container}>
    {
  products.filter(item => cartItems.some(element => item.id === element.product_id))
    .map((item, index) => (
      <View key={index}>
        {
          cartItems.map((element) => (
            item.id === element.product_id ? (
             <View  
             key={element.id}
             >
           <View style={{flexDirection:'row'}}>
                   <View>
                        <Image
                        style={{width:50,height:100}}
                        source={{ uri: `${url}/storage/${item. product_photo}` }}
                        />
                  </View>
                  <View style={{flexDirection:'column',justifyContent:'center',gap:10,paddingHorizontal:10}}>
                        <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                          <Text style={{width:"80%"}}> {item.product_name.length > 17 ? item.product_name.substring(0, 17) + '...' : item.product_name}</Text>
                         
                          <Text style={{width:"20%"}}>{(item.best_price_of_piece*element.quantity*element.strip*element.pack).toFixed(2)}</Text>
                        </View>
                        <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                           <Text style={{width:"80%"}}> {item.product_brand_name.length > 17 ? item.product_brand_name.substring(0, 17) + '...' : item.product_brand_name}</Text>
                          
                           <Text style={{width:"20%"}}>{(item.mrp_price_of_piece*element.quantity*element.strip*element.pack).toFixed(2)}</Text>
                        </View>
                  <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                          <View style={styles.dropdownContainer}>
                          <Picker
                                  style={styles.picker}
                                  onValueChange={(itemValue) => { setSelectedValue(itemValue); }}
                              >
                                  <Picker.Item label="Piece" value="1" />
                                  <Picker.Item label="Strip" value="2" />
                                  <Picker.Item label="Pack" value="3" />
                              </Picker>
                          </View>

                          <View style={styles.quantityContainer}>
                          <TouchableOpacity style={styles.button} onPress={() => decreaseQuantity(element.product_id)}>
                              <Text style={styles.buttonText}>−</Text>
                          </TouchableOpacity>


                            <View style={styles.quantityTextCon}>
                              <Text style={styles.quantityText}>{element.quantity}</Text>
                            
                            </View>

                          <TouchableOpacity style={styles.button} onPress={() => increaseQuantity(element.product_id)}>
                              <Text style={styles.buttonText}>+</Text>
                          </TouchableOpacity>

                          </View>
                          <TouchableOpacity style={styles.addToCartButton}
                        onPress={(first) => { second }}
                        >
                          <MaterialCommunityIcons name="delete-circle"  size={24} />
                        </TouchableOpacity>
                        </View>
                  </View>
           </View>
             </View>
            ) : null
          ))
        }
      </View>
    ))
}

        </View>
    );
};

export default MyCart;

const styles = StyleSheet.create({
    container: {
        padding: 10,
      },
      centered: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
      },
  produ_conten: {
    borderWidth: 1,
    borderColor: 'grey',
  },
  dropdownContainer: {
    width: '35%',
    height: 40,
    borderRadius: 8,
    padding: 5,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'grey',
    marginRight: 5,
  },
  picker: {
    color: 'grey',
    padding: 0,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '39%',
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'grey',
  },
  button: {
    width: '30%',
  },
  quantityTextCon: {
    width: '40%',
  },
  buttonText: {
    color: 'grey',
    fontSize: 18,
    fontWeight: 'bold',
    width: '100%',
    textAlign: 'center',
  },
  quantityText: {
    color: 'grey',
    fontSize: 18,
    marginHorizontal: 5,
    textAlign: 'center',
  },
  addToCartButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  addToCartText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  descriptionTitle:{
      backgroundColor:'#25a8d6',
      marginBottom:10,
      marginTop:10,
      padding:10,
      color:'#fff',
      fontWeight:'bold',
      textAlign:"justify"
  },
  descriptionTitleText:{
      marginBottom:10,
      marginTop:10,
      padding:10,
      textAlign:"justify"
  },
});
