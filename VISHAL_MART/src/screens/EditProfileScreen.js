import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Container from '../components/layout/Container';
import { useAuth } from '../state/authContext';
import { useTheme } from '../theme/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EditProfileScreen = ({ navigation }) => {
    const { user, updateProfile } = useAuth();
    const { colors, isDark } = useTheme();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                address: user.address || '',
            });
        }
    }, [user]);

    const handleChange = (key, value) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = async () => {
        if (!formData.name || !formData.email) {
            Alert.alert('Error', 'Name and Email are required.');
            return;
        }

        setLoading(true);
        try {
            await updateProfile(formData);

            Alert.alert('Success', 'Profile updated successfully!');
            navigation.goBack();
        } catch (error) {
            console.error('Update failed', error);
            Alert.alert('Error', 'Failed to update profile.');
        } finally {
            setLoading(false);
        }
    };

    const styles = createStyles(colors, isDark);

    return (
        <Container>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Text style={styles.title}>Edit Profile</Text>
                </View>

                <View style={styles.formContainer}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Full Name</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.name}
                            onChangeText={(text) => handleChange('name', text)}
                            placeholder="Enter your full name"
                            placeholderTextColor={colors.text + '80'}
                            autoCorrect={false}
                            autoComplete="off"
                            textContentType="none"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Email Address</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.email}
                            onChangeText={(text) => handleChange('email', text)}
                            placeholder="Enter your email"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            placeholderTextColor={colors.text + '80'}
                            autoCorrect={false}
                            autoComplete="off"
                            textContentType="none"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Phone Number</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.phone}
                            onChangeText={(text) => handleChange('phone', text)}
                            placeholder="Enter your phone number"
                            keyboardType="phone-pad"
                            placeholderTextColor={colors.text + '80'}
                            autoCorrect={false}
                            autoComplete="off"
                            textContentType="none"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Address</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            value={formData.address}
                            onChangeText={(text) => handleChange('address', text)}
                            placeholder="Enter your address"
                            multiline
                            numberOfLines={3}
                            placeholderTextColor={colors.text + '80'}
                            autoCorrect={false}
                            autoComplete="off"
                            textContentType="none"
                        />
                    </View>

                    <TouchableOpacity
                        style={styles.saveButton}
                        onPress={handleSave}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.saveButtonText}>Save Changes</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </Container>
    );
};

const createStyles = (colors, isDark) => StyleSheet.create({
    scrollContent: {
        padding: 20,
    },
    header: {
        marginBottom: 30,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text,
    },
    formContainer: {
        width: '100%',
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        color: colors.text,
        fontWeight: '600',
    },
    input: {
        backgroundColor: isDark ? '#2C2C2C' : '#f5f5f5',
        borderRadius: 10,
        padding: 15,
        fontSize: 16,
        color: colors.text,
        borderWidth: 1,
        borderColor: isDark ? '#444' : '#ddd',
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    saveButton: {
        backgroundColor: '#007AFF',
        padding: 18,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 20,
        shadowColor: '#007AFF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default EditProfileScreen;
