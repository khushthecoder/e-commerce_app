import AsyncStorage from '@react-native-async-storage/async-storage';

const ADDRESS_STORAGE_KEY = '@shipping_addresses';
const listeners = [];

const notifyListeners = (userId, addresses) => {
    listeners.forEach(listener => {
        if (listener.userId === userId) {
            listener.callback(addresses);
        }
    });
};

export const addressService = {
    subscribeToAddresses: (userId, callback) => {
        const loadAddresses = async () => {
            try {
                const storedAddresses = await AsyncStorage.getItem(ADDRESS_STORAGE_KEY);
                const allAddresses = storedAddresses ? JSON.parse(storedAddresses) : {};
                const userAddresses = allAddresses[userId] || [];
                callback(userAddresses);
            } catch (error) {
                console.error('Error loading addresses:', error);
                callback([]);
            }
        };

        loadAddresses();

        const listener = { userId, callback };
        listeners.push(listener);

        return () => {
            const index = listeners.indexOf(listener);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        };
    },

    addAddress: async (userId, address) => {
        try {
            const storedAddresses = await AsyncStorage.getItem(ADDRESS_STORAGE_KEY);
            const allAddresses = storedAddresses ? JSON.parse(storedAddresses) : {};
            const userAddresses = allAddresses[userId] || [];

            const newAddress = { ...address, id: Date.now().toString() };
            const updatedUserAddresses = [...userAddresses, newAddress];

            allAddresses[userId] = updatedUserAddresses;
            await AsyncStorage.setItem(ADDRESS_STORAGE_KEY, JSON.stringify(allAddresses));
            notifyListeners(userId, updatedUserAddresses);

            return newAddress;
        } catch (error) {
            console.error('Error adding address:', error);
            throw error;
        }
    },

    updateAddress: async (userId, addressId, updatedAddress) => {
        try {
            const storedAddresses = await AsyncStorage.getItem(ADDRESS_STORAGE_KEY);
            const allAddresses = storedAddresses ? JSON.parse(storedAddresses) : {};
            const userAddresses = allAddresses[userId] || [];

            const updatedUserAddresses = userAddresses.map(addr =>
                addr.id === addressId ? { ...updatedAddress, id: addressId } : addr
            );

            allAddresses[userId] = updatedUserAddresses;
            await AsyncStorage.setItem(ADDRESS_STORAGE_KEY, JSON.stringify(allAddresses));
            notifyListeners(userId, updatedUserAddresses);
        } catch (error) {
            console.error('Error updating address:', error);
            throw error;
        }
    },

    deleteAddress: async (userId, addressId) => {
        try {
            const storedAddresses = await AsyncStorage.getItem(ADDRESS_STORAGE_KEY);
            const allAddresses = storedAddresses ? JSON.parse(storedAddresses) : {};
            const userAddresses = allAddresses[userId] || [];

            const updatedUserAddresses = userAddresses.filter(addr => addr.id !== addressId);

            allAddresses[userId] = updatedUserAddresses;
            await AsyncStorage.setItem(ADDRESS_STORAGE_KEY, JSON.stringify(allAddresses));
            notifyListeners(userId, updatedUserAddresses);
        } catch (error) {
            console.error('Error deleting address:', error);
            throw error;
        }
    }
};
