import firebase, { initializeApp } from "firebase/app";
import { getFirestore, deleteDoc } from "firebase/firestore";
import "firebase/firestore";
import { QueryDocumentSnapshot} from 'firebase/firestore';
import { query, where } from 'firebase/firestore';
import {  deleteObject  } from "firebase/storage";



const firebaseConfig = {
  apiKey: "AIzaSyCbSSMOmMXyd2rCIEqqNd4U7yCxzGBNV1M",
  authDomain: "mega-fiesta.firebaseapp.com",
  projectId: "mega-fiesta",
  storageBucket: "mega-fiesta.appspot.com",
  messagingSenderId: "613090257214",
  appId: "1:613090257214:web:7343bad023b07f58cd646f"
};

const app1 = initializeApp(firebaseConfig,'app1');
const db1 = getFirestore(app1);

const storage1 = getStorage(app1);

import { doc, setDoc,collection, getDocs } from "firebase/firestore";

const set_firestore = async (params: string) => {

  await setDoc(doc(db1, "texts", `id-${Math.floor(Math.random() * (9000000000 + 1))}`), {
    text: params,
  });
}

const get_firestore = async (): Promise<{ id: string; text: string }[]> => {
  const querySnapshot = await getDocs(collection(db1, "texts"));
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

import { getStorage, ref, uploadBytes, getDownloadURL, listAll } from 'firebase/storage';
// import { getStorage, ref, uploadBytes} from 'firebase/storage';

const set_storage = async (file: File) => {
  const storage = getStorage(); // Obtiene la instancia de Firebase Storage
  const storageRef = ref(storage, `images/${file.name}`); // Referencia al archivo en Firebase Storage

  await uploadBytes(storageRef, file); // Carga el archivo en Firebase Storage
};



const get_storage = async (filename: string) => {
   // Obtiene la instancia de Firebase Storage
  const fileRef = ref(storage1, `images/${filename}`); // Referencia al archivo en Firebase Storage

  const downloadURL = await getDownloadURL(fileRef); // Obtiene la URL de descarga del archivo

  console.log(downloadURL); // Muestra la URL de descarga del archivo
};


const getAllDownloadURLs = async () => {
  const storage = getStorage(app1);
  const storageRef = ref(storage, `images/`);

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

const delete_storage_by_link = async (downloadURL: string) => {
  try {
    const storage = getStorage(app1);
    const fileRef = ref(storage, downloadURL);

    await deleteObject(fileRef);
    console.log(`Archivo con enlace ${downloadURL} eliminado de Firebase Storage.`);
  } catch (error) {
    console.error('Error al eliminar el archivo:', error);
  }
};

const delete_firestore = async (docId: string) => {
  const docRef = doc(db1, "texts", docId); // Referencia al documento en Firestore

  try {
    await deleteDoc(docRef); // Elimina el documento de Firestore
    console.log(`Documento con ID ${docId} eliminado de Firestore.`);
  } catch (error) {
    console.error('Error al eliminar el documento:', error);
  }
};

const delete_storage = async (filename: string) => {
  const storage = getStorage(app1); // Obtiene la instancia de Firebase Storage
  const fileRef = ref(storage, `images/${filename}`); // Referencia al archivo en Firebase Storage

  try {
    await deleteObject(fileRef); // Elimina el archivo de Firebase Storage
    console.log(`Archivo ${filename} eliminado de Firebase Storage.`);
  } catch (error) {
    console.error('Error al eliminar el archivo:', error);
  }
};

export {
  set_firestore,
  get_firestore,
  set_storage,
  get_storage,
  getAllDownloadURLs,
  delete_storage_by_link ,
  delete_firestore, 
  storage1
};

