import { auth, db } from '../../db';
import { collection, addDoc, query, where, getDocs, doc, deleteDoc, updateDoc,or, and } from 'firebase/firestore';
import { useUserStore } from '../store/userStore/index'
import { App } from 'antd';
import _ from 'underscore'

const categoriesRef = collection(db, 'categories');
const productsRef = collection(db, 'products')
const ordersRef = collection(db, 'orders')
const settingsRef = collection(db, 'settings')


export const useUserActions = () => {

    const { setSettings,setProducts } = useUserStore()
    const { message } = App.useApp()

    const getAllProducts = async () => {
        const q = query(productsRef);
        const snapshot = await getDocs(q);

        const products = snapshot.docs.map((doc) => ({
            ...doc.data(),
        }));
        setProducts(_.sortBy(products, 'category')?.map((data, index) => { return { ...data, index: index + 1 } }))
    };

    const getSettings = async () => {
        const q = query(settingsRef);
        const snapshot = await getDocs(q);
        if (!snapshot?.docs?.length)
            return;
        setSettings({ ...snapshot?.docs[0]?.data(), id: snapshot?.docs[0]?.id })
    }

    const addProduct = async (data) => {
        try {
            message.info("Order Processing...");

            const docRef = await addDoc(ordersRef, data);

            message.destroy();

            if (docRef?.id) {
                return true; // Success
            } else {
                return false; // No ID means failure
            }
        } catch (error) {
            message.destroy();
            console.error("Error adding order:", error);
            return false;
        }
    };

    async function getOrdersByPhoneOrOrderId(phone, orderId) {
        const ordersRef = collection(db, "orders");

        const q = query(
            ordersRef,
            or(
                where("customerData.phone", "==", phone),
                where("orderID", "==", orderId),
            )
        );

        const querySnapshot = await getDocs(q);
        const results = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return results;
    }

    return {
        getSettings, addProduct,getOrdersByPhoneOrOrderId,getAllProducts
    }
}