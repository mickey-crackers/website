import { db } from '../../db';
import { collection, query, where, getDocs } from 'firebase/firestore';

export async function checkEmailExists(email) {
    const usersRef = collection(db, 'admins'); // or your admin collection
    const q = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);

    return !querySnapshot.empty; // true if email found, false otherwise
}
