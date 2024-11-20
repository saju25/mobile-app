import { Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { getToken } from '@/axios/Token';
import { useRouter } from 'expo-router';

const Loding = () => {
    const router = useRouter();
    useEffect(() => {
        const checkAuthStatus = async () => {
            const token = await getToken();
            if (token) {
                router.push('/(drawer)/(tabs)/Home'); 
                console.log("Hello")
            }else{
                router.push('/screen/Login')
            }
        };

        checkAuthStatus();
    }, []);

  return (
    <View style={styles.container}>
    <Image
      source={{ uri: 'https://cdn.dribbble.com/users/2973561/screenshots/5757826/media/c5083407af44c0753602fa3e7b025ba7.gif' }} // Add the URL for your loading image
      style={styles.image}
    />
  </View>
  )
}

export default Loding

const styles = StyleSheet.create({})
