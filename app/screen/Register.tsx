import { Button, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import FormTextField from '@/components/FormTextField';
import { useRouter } from 'expo-router';
import axios from '@/axios/axios';
import { getToken, setToken } from '@/axios/Token';
const Register = () => {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const handleRegister = async () => {
        setErrors({});
        setLoading(true);


        try {
            const response = await axios.post('/register', {
                name,
                email,
                password,
                password_confirmation: passwordConfirmation,
            }, {
                headers: {
                    Accept: 'application/json',
                },
            });

           await setToken(response.data.token);
            router.push('/(drawer)/(tabs)/Home'); // Adjust route as needed
        } catch (error) {
            setLoading(false);

            if (error.response) {
                if (error.response.data.errors) {
                    setErrors(error.response.data.errors);
                } else if (error.response.data.error) {
                    setErrors({ general: error.response.data.error });
                }
            } else {
           }
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Register</Text>

            {errors.general && <Text style={styles.generalError}>{errors.general}</Text>}

            <FormTextField
                label="Name"
                placeholder="Name"
                value={name}
                onChangeText={setName}
                error={errors.name || []}
            />

            <FormTextField
                label="Email"
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                error={errors.email || []}
            />

            <FormTextField
                label="Password"
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                error={errors.password || []}
            />

            <FormTextField
                label="Confirm Password"
                placeholder="Confirm Password"
                value={passwordConfirmation}
                onChangeText={setPasswordConfirmation}
                secureTextEntry
                error={errors.password_confirmation || []}
            />

            <Button
                title={loading ? "Registering..." : "Register"}
                onPress={handleRegister}
                disabled={loading}
            />
        </View>
    );
};

export default Register;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
        marginTop: 10,
    },
    generalError: {
        color: 'red',
        textAlign: 'center',
        marginBottom: 10,
    },
});
