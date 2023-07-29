import firebase, { initializeApp } from "firebase/app";
import { getFirestore, deleteDoc } from "firebase/firestore";
import "firebase/firestore";
import { QueryDocumentSnapshot } from 'firebase/firestore';
import { query, where } from 'firebase/firestore';
import { deleteObject } from "firebase/storage";
import { doc, setDoc, collection, getDocs } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL, listAll } from 'firebase/storage';
import { storage1 } from '../db/firebase'



const firebaseConfig_last = {
  apiKey: "AIzaSyBJyWGtzW9YYN7Pb1KG8sEPIy0JEcYtrv0",
  authDomain: "last-mega-fiesta.firebaseapp.com",
  projectId: "last-mega-fiesta",
  storageBucket: "last-mega-fiesta.appspot.com",
  messagingSenderId: "892039231142",
  appId: "1:892039231142:web:f5ae935fa662f104982667"
};

const app2 = initializeApp(firebaseConfig_last, 'app2');
const db2 = getFirestore(app2);

const storage2 = getStorage(app2);


const set_firestore_last = async (params: string, id: string) => {

  await setDoc(doc(db2, "texts", id), {
    text: params,
  });
}

const get_firestore_last = async (): Promise<{ id: string; text: string }[]> => {
  const querySnapshot = await getDocs(collection(db2, "texts"));
  const resultsArray: { id: string; text: string }[] = [];

  querySnapshot.forEach((doc: QueryDocumentSnapshot) => {
    const data = doc.data();
    const id = doc.id;
    const text = data['text'];
    resultsArray.push({ id, text });
  });

  console.log(resultsArray)
  return resultsArray;
};


const set_storage_from_url = async (downloadURL: string) => {
  try {
    // Obtener la referencia al archivo en Firebase Storage utilizando la enlace URL
    const fileRef = ref(storage1, downloadURL);

    // Obtener la URL de descarga del archivo desde storage1
    const fileDownloadURL = await getDownloadURL(fileRef);
    console.log(fileDownloadURL);

    // Hacer la descarga del archivo desde la URL
    const response = await fetch(fileDownloadURL);
    const fileBlob = await response.blob();

    // Subir el archivo a storage2 en Firebase Storage
    const storageRef = ref(storage2, `images/${downloadURL}`);
    await uploadBytes(storageRef, fileBlob);

    console.log('Archivo descargado y subido con éxito a storage2:', fileBlob);
  } catch (error) {
    console.error('Error al cargar el archivo desde el enlace URL:', error);
  }
};




const getAllDownloadURLs_last = async () => {
  const storageRef = ref(storage2, `images/`);

  try {
    const { items } = await listAll(storageRef);
    const downloadURLs = await Promise.all(
      items.map(async (item) => {
        const downloadURL = await getDownloadURL(item);
        return downloadURL;
      })
    );

    console.log(downloadURLs);
    return downloadURLs;
  } catch (error) {
    console.error('Error al obtener los enlaces de descarga:', error);
    return [];
  }
};



export {
  set_firestore_last,
  get_firestore_last,
  set_storage_from_url,
  getAllDownloadURLs_last
};

