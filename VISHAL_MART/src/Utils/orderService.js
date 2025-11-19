
import { addDoc, collection } from "firebase/firestore";

export const placeOrder = async (orderData, db, appId, clearCart) => {
  try {
    const userId = orderData.userId;
    if (!userId) {
      throw new Error("User ID is missing from order data.");
    }
    const orderCollectionPath = `/artifacts/${appId}/users/${userId}/orders`;
    const docRef = await addDoc(collection(db, orderCollectionPath), orderData);
    await clearCart();
    return docRef.id;
  } catch (error) {
    console.error("Error placing order:", error);
    throw error;
  }
};
