import { addDoc, doc, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import Toast from 'react-native-root-toast';

import { auth, tripsRef, usersRef } from '../firebase/config';
export const addTrip = async ({ trip }) => {
  // onAuthStateChanged(auth, async (user) => {
  try {
    const docRef = await addDoc(tripsRef, {
      city: trip.city,
      country: trip.country,
      date: trip.date,
      detailsAboutCompanion: trip.personDetails,
      detailsAboutTrip: trip.tripDetails,
      duration: trip.duration,
      image: trip.image,
      maxAge: trip.maxAge,
      minAge: trip.minAge,
      owner: auth.currentUser.uid,
      // user.uid,
    });
    console.log('docRef', docRef.id)
    Toast.show("Trip successfully added", {
      duration: Toast.durations.LONG,
      position: Toast.positions.CENTER,
      backgroundColor: '#375ABE',
      textColor: "#fff",
      hideOnPress: true,
    });
  } catch (e) {
    Toast.show("Error adding document: ", e, {
      duration: Toast.durations.LONG,
      position: Toast.positions.CENTER,
      backgroundColor: 'red',
      textColor: "#fff",
      hideOnPress: true,
    });
    console.log(e);
  }
  // });
};
