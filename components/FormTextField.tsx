import { StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'

const FormTextField = ({
    label,
    error=[],
    ...rest
}) => {
  return (
    <View>
        <Text style={styles.label}>{label}</Text>


      <TextInput
            style={styles.input}
            autoCapitalize='none'
            {...rest}
      />


{
    error.map(((err)=>{
        return <Text key={err} style={styles.error}>{err}</Text>
    }))
}
    </View>
  )
}

export default FormTextField

const styles = StyleSheet.create({
    label: {
        fontSize: 16,
        marginBottom: 5,
      },
    input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 12,
        paddingLeft: 10,
        fontSize: 16,
      },
      error: {
        color: 'red',
        marginBottom: 10,
      },
})