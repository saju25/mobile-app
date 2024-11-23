import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useSearchParams } from 'expo-router';


const Shop = ({ route }) => {
  const { id } = useSearchParams();
  return (
    <View>
      <Text>Shop ID: {id}</Text>
    </View>
  )
}

export default Shop

const styles = StyleSheet.create({})