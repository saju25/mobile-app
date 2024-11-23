import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Button } from 'react-native';
import axios from '@/axios/axios';
import * as ImagePicker from 'expo-image-picker';
import FormTextField from '@/components/FormTextField';  
import { ScrollView } from 'react-native-gesture-handler';
import { getToken } from '@/axios/Token';
import { ShopApprovedGet } from '@/src/services/ShopApproved';

const BusinessConsole = () => {
  const [shop_name, setShopName] = useState('');
  const [shop_description, setShopDescription] = useState('');
  const [shop_address, setShopAddress] = useState('');
  const [shop_phone, setShopPhone] = useState('');
  const [shop_email, setShopEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true); // Start with loading as true
  const [shop_photo, setImage] = useState(null);
  const [shopData, setShopData] = useState(null);  

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchShopData = async () => {
      try {
        const data = await ShopApprovedGet();
        setShopData(data);  // Set shop data when available
        setLoading(false);  // Hide loading spinner after fetching data
      } catch (err) {
        setErrors('Failed to fetch shop data');
        setLoading(false);  // Hide loading spinner on error
      }
    };

    fetchShopData();
    return () => controller.abort();  // Cleanup fetch if the component unmounts
  }, []);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert('Permission to access camera roll is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri); 
    }
  };

  const removeImage = () => setImage(null);

  const handleRegister = async () => {
    const token = await getToken();
    if (!token) {
      alert('Token not available');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('shop_name', shop_name);
    formData.append('shop_description', shop_description);
    formData.append('shop_address', shop_address);
    formData.append('shop_phone', shop_phone);
    formData.append('shop_email', shop_email);

    if (shop_photo) {
      const localUri = shop_photo;
      const filename = localUri.split('/').pop();
      const type = `shop_photo/${filename.split('.').pop()}`;
      formData.append('shop_photo', { uri: localUri, name: filename, type });
    }

    setLoading(true);

    try {
      const response = await axios.post('/add-shop', formData, {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: 'Bearer ' + token },
      });
      if (response.data.success) {
        alert('Shop registered successfully!');
        removeImage();
        setShopName('');
        setShopDescription('');
        setShopAddress('');
        setShopPhone('');
        setShopEmail('');
        setErrors({});
      } else {
        setErrors(response.data.errors || {});
      }
    } catch (error) {
      console.error('Error during registration:', error);
      alert('Error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={{textAlign:'center'}}>Loading...</Text>
      </View>
    );
  }

  if (errors && Object.keys(errors).length > 0) {
    return (
      <View style={styles.container}>
        <Text>{errors.general || 'Some errors occurred'}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {/* Only display shop approval status if shopData is available */}
      {shopData ? (
        shopData.map((item) => (
          <View key={item.id}>
            {item.is_approved === 0 ? (
              <Text style={{textAlign:'center'}}>Shop Not Approved By Our Team</Text>
            ) : (
              <Text style={{textAlign:'center'}}>Shop Approved By Our Team</Text>
            )}
          </View>
        ))
      ) : (
        <View style={styles.container}>
          <Text style={styles.header}>Shop Registration</Text>

          <FormTextField label="Shop Name" placeholder="Enter shop name" value={shop_name} onChangeText={setShopName} error={Array.isArray(errors.shop_name) ? errors.shop_name : []} />
          <FormTextField label="Shop Description" placeholder="Enter shop description" value={shop_description} onChangeText={setShopDescription} error={Array.isArray(errors.shop_description) ? errors.shop_description : []} />
          <FormTextField label="Shop Address" placeholder="Enter shop address" value={shop_address} onChangeText={setShopAddress} error={Array.isArray(errors.shop_address) ? errors.shop_address : []} />
          <FormTextField label="Shop Phone (optional)" placeholder="Enter shop phone number" value={shop_phone} onChangeText={setShopPhone} error={Array.isArray(errors.shop_phone) ? errors.shop_phone : []} />
          <FormTextField label="Shop Email (optional)" placeholder="Enter shop email" value={shop_email} onChangeText={setShopEmail} error={Array.isArray(errors.shop_email) ? errors.shop_email : []} />

          {!shop_photo && (
            <TouchableOpacity style={{ borderWidth: 1, borderColor: 'gray', padding: 5 }} onPress={pickImage}>
              <Text style={styles.buttonText}>Pick an image</Text>
            </TouchableOpacity>
          )}

          {shop_photo && (
            <>
              <Image source={{ uri: shop_photo }} style={styles.image} />
              <TouchableOpacity onPress={removeImage}>
                <Text style={styles.buttonText}>Remove an image</Text>
              </TouchableOpacity>
            </>
          )}

          {errors.general && (
            <View>
              {errors.general.map((error, index) => (
                <Text key={index} style={styles.errorText}>{error}</Text>
              ))}
            </View>
          )}

          <Button
            title={loading ? 'Registering...' : 'Register Shop'}
            onPress={handleRegister}
            disabled={loading}
          />
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    gap: 20
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 16,
    color: 'blue',
    textAlign: 'center',
    marginBottom: 10,
  },
  button: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
  },
  image: {
    width: '100%',
    height: 100,
    marginBottom: 10,
    borderRadius: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
  },
});

export default BusinessConsole;
