import { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router'; // import useLocalSearchParams
import url from '@/axios/Url';
import { MaterialIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { getToken } from '@/axios/Token';
import axios from '@/axios/axios';
import { cartGet } from '@/src/services/CartGet';


const ProductDetail = () => {
  // Get the query parameter from the URL
  const [loading, setLoading] = useState(false);
  const { productData } = useLocalSearchParams();
  const [product, setProduct] = useState(null);
  // Cart 
  const [quantity, setQuantity] = useState(1);
  const [selectedValue, setSelectedValue] = useState('piece');
  
  const [mrp, setMrp] = useState('');
  const [unit, setUnit] = useState('piece');
  const increaseQuantity = () => setQuantity(quantity + 1);
  const decreaseQuantity = () => {if (quantity > 1) setQuantity(quantity - 1);};
  const unitBestPrice = product?.best_price_of_piece || 0;
  const unitMrpPrice = product?.mrp_price_of_piece || 0;
  const striptValue = (selectedValue === "strip") ? product?.Num_of_piece_one_strip : null;
  const packtValue = (selectedValue === "pack") ? product?.Num_of_strip_one_pack*product?.Num_of_piece_one_strip : null;
const newBestPrice = unitBestPrice*(striptValue ?? 1)*quantity*(packtValue ?? 1) ;
  const newMrpPrice = unitMrpPrice*(striptValue ?? 1)*quantity*(packtValue ?? 1) ;
  const [error, setErrors] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
console.log(selectedValue)


  const handleAddToCart = async () => {
    setLoading(true);
    const token = await getToken();
    const cartCheck = await cartGet();
    const cartData = cartCheck.data;
  
    try {
      // Check if the product already exists in the cart
      let productExists = false;
  
      for (const item of cartData) {
        if (item.product_id === product.id) {
        productExists = true;
          break; // Exit the loop if a match is found
        }
      }
  
      if (!productExists) {
        // If the product is not already in the cart, add it
      
        const response = await axios.post('/add-cart', {
          product_id: product.id,
          quantity: quantity,
          piece_strip_pack: selectedValue,
        }, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        console.log(response)
        // Show a success message and alert when the request completes
        Alert.alert('Product added to cart successfully!');
      }else{
        const response = await axios.put(`/updata-cart/${product.id}`, {
          product_id: product.id,
          quantity: quantity,
          piece_strip_pack: selectedValue,
        }, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
  
        // Show a success message and alert when the request completes
        Alert.alert('Product Update to cart successfully!');
      }
  
      setLoading(false); // Set loading to false after processing
    } catch (error) {
      setLoading(false); // Ensure loading state is updated even if an error occurs
  
      if (error.response) {
        if (error.response.data.errors) {
          setErrors(error.response.data.errors);
        } else if (error.response.data.error) {
          setErrors({ general: error.response.data.error });
        }
      } else {
        console.error('Error adding to cart:', error);
      }
    }
  };
  

  useEffect(() =>  {

    const cartCheck = async () =>{
      const respons = await cartGet();
    }
    
        if (productData) {
          const parsedProduct = JSON.parse(decodeURIComponent(productData));
          setProduct(parsedProduct);
        }
      }, [productData]); 
    
    

  if (!product) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View>
        <Image
          style={styles.product_image}
          source={{ uri: `${url}/storage/${product.product_photo}` }}
        />
      </View>

      <View style={{ margin: 5, gap: 6 }}>
        <View>
          <Text>{product.product_name}</Text>
        </View>
        <View>
          <Text>{product.product_brand_name}</Text>
        </View>

        <View style={{ flexDirection: 'row', gap: 10 }}>
          <View style={{ flexDirection: 'row' }}>
            <MaterialIcons name="currency-franc" size={15} />
            <Text style={styles.shop_distance}>
              {String(newBestPrice)}
            </Text>
          </View>

          <View style={{ flexDirection: 'row' }}>
            <MaterialIcons name="currency-franc" size={15} />
            <Text style={{ ...styles.shop_distance, textDecorationLine: 'line-through' }}>
            {String(newMrpPrice)}
            </Text>
          </View>
        </View>
      </View>

      <View>
        <View style={{ flexDirection: 'row', marginBottom: 10 }}>
          <View style={styles.dropdownContainer}>
            <Picker
                  selectedValue={selectedValue}
                  onValueChange={(itemValue) => setSelectedValue(itemValue)}
              style={styles.picker}
              
            >
              <Picker.Item label="Piece" value="piece" />
              <Picker.Item label="Strip" value="strip" />
              <Picker.Item label="Pack" value="pack" />
            </Picker>
          </View>

          <View style={styles.quantityContainer}>
            <TouchableOpacity style={styles.button} onPress={decreaseQuantity}>
              <Text style={styles.buttonText}>−</Text>
            </TouchableOpacity>

            <View style={styles.quantityTextCon}>
              <Text style={styles.quantityText}>{quantity}</Text>
            </View>

            <TouchableOpacity style={styles.button} onPress={increaseQuantity}>
              <Text style={styles.buttonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.addToCartButton}
        onPress={handleAddToCart}
        >
          <Text style={styles.addToCartText}>Add to cart</Text>
        </TouchableOpacity>
      </View>

      <View>
        <Text style={styles.descriptionTitle}>Product Description</Text>
        <Text style={styles.descriptionTitleText}>{product.product_description}</Text>
      </View>
    </View>
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
  shopCon: {
    borderWidth: 1,
    borderColor: 'grey',
  },
  shop_name: {
    color: 'grey',
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 10,
  },
  shop_distance: {
    color: 'grey',
    fontWeight: 'bold',
  },
  product_image: {
    height: 200,
    width: '97%',
    resizeMode: 'cover',
    borderRadius: 10,
  },
  produ_conten: {
    borderWidth: 1,
    borderColor: 'grey',
  },
  dropdownContainer: {
    width: '49%',
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
    width: '49%',
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
    backgroundColor: '#25a8d6',
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

export default ProductDetail;
