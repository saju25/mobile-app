import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { EvilIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import url from '@/axios/Url';

const ShopCard = ({
    screenWidth,
    images,
    shop_name,
    shop_address,
    shop_review,
    shop_review_no,
    item
}) => {
    const router = useRouter();
    const handlePress = (item) => {
       const shopDataString = encodeURIComponent(JSON.stringify(item));
        router.push(`/Shop?shopDatas=${shopDataString}`);
      };
    const areview = shop_review / shop_review_no;

    
    return (
        <TouchableOpacity onPress={() => handlePress(item)}>
            <View style={{ ...styles.cardView, width: screenWidth }}>
                {/* Container for the Image and Overlay */}
                <View style={styles.imageContainer}>
                    <Image
                        style={{ ...styles.image, width: screenWidth }}
                        source={{ uri: `${url}/storage/${images}` }}
                    />
                    {/* Overlay */}
                    <View style={styles.overlay}>
                        <Text style={styles.reviewText}>{areview.toFixed(1)}</Text>
                    </View>
                </View>
                <View>
                   <Text style={styles.shop_name}>{shop_name}</Text>
                </View>
                <View style={{flexDirection:'row',justifyContent:'space-between',marginTop:10,paddingHorizontal:10, paddingBottom:6}}>
                   
                    <View style={{width:'50%', flexDirection: 'row',borderRightWidth:1,borderColor:'black' }}>
                        <View>
                            <EvilIcons name='location' size={25} />
                        </View>
                        <Text style={styles.shop_distance}>10 km</Text>
                    </View>
                   <View>
                        <Text style={styles.shop_distance}>{shop_address}</Text>
                   </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default ShopCard;

const styles = StyleSheet.create({
    cardView: {
        marginHorizontal: 9,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'grey',
        position: 'relative',
    },
    imageContainer: {
        position: 'relative',
        overflow:'hidden' // This allows the overlay to be placed on top of the image
    },
    image: {
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        height: 150,
    },
    overlay: {
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',  // Semi-transparent overlay (black with 50% opacity)
        alignItems: 'flex-end',
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
    },
    reviewText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 16,
        padding:10
    },
  
    shop_name: {
        color: 'grey',
        fontSize: 15,
        fontWeight: 'bold',
        marginLeft:15,
        marginTop:10
    },
    shop_distance: {
        color: 'grey',
        fontWeight: 'bold',
    },
});
