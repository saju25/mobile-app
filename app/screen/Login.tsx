import { Button, Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import FormTextField from '@/components/FormTextField';
import { usePathname, useRouter } from 'expo-router';
import axios from '@/axios/axios';
import { getToken, setToken } from '@/axios/Token';





const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({}); 
    const [loading, setLoading] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const router = useRouter();
     useEffect(() => {
        const checkAuthStatus = async () => {
            const token = await getToken();
            if (token) {
                router.push('/(drawer)/(tabs)/Home'); 
             }
        };

        checkAuthStatus();
    }, []);
    const handleLogin = async () => {
        setErrors({}); // Clear any previous errors
        setLoading(true); // Show loading indicator
    
        try {
            const response = await axios.post('/login', {
                email,
                password
            }, {
                headers: {
                    Accept: "application/json"
                }
            });
    
            if (response.data && response.data.token) {
                // If token is returned, save it and navigate to Home
                await setToken(response.data.token);
                router.push('/(drawer)/(tabs)/Home'); 
            } else {
                // If no token is provided, show an unauthorized error
                setErrors({ general: 'Unauthorized: Invalid credentials or user not found.' });
            }
    
        } catch (error) {
            setLoading(false); // Stop the loading indicator
    
            if (error.response) {
                if (error.response.status === 401) {
                    // Unauthorized status
                    setErrors({ general: 'Unauthorized: Invalid credentials.' });
                } else if (error.response.data.errors) {
                    // Validation errors
                    setErrors(error.response.data.errors);
                } else if (error.response.data.error) {
                    // General error message
                    setErrors({ general: error.response.data.error });
                }
            } else {
                setErrors({ general: 'Something went wrong. Please try again later.' });
            }
        }
    };
    

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Log In</Text>
              {errors.general && <Text style={styles.generalError}>{errors.general}</Text>}
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
                secureTextEntry={!passwordVisible}
                error={errors.password || []} 
            />

             <Button 
                title={loading ? 'Logging In...' : 'Log In'} 
                onPress={handleLogin} 
                disabled={loading} 
            />

            <Text style={styles.orstyle}>Or</Text>

            <Pressable style={styles.button2} onPress={() => router.push('/screen/Register')}>
                <Text style={{ textAlign: 'center' }}>Register A New Account</Text>
            </Pressable>
        </View>
    );
};

export default Login;

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
    orstyle: {
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
        marginTop: 10,
    },
    button2: {
        borderWidth: 1,
        borderColor: '#0866ff',
        textAlign: 'center',
        padding: 5,
    },
});
