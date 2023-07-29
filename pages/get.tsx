import { getAllDownloadURLs, get_firestore, delete_firestore, delete_storage_by_link, get_storage } from '../db/firebase';
import '../src/app/styleGet.css';
import { GetStaticProps } from 'next';
import { FaCheck, FaTimes } from 'react-icons/fa';
import React, { useEffect, useState } from 'react';
import { set_firestore_last, set_storage_from_url } from '../db/firebase_users'

async function get_firestore_one(): Promise<any[]> {

  const data = await get_firestore()

  return data;
}

interface DownloadLinksProps {
  downloadURLs: string[];
}



const tickIconClickStorage = (url: string) => {

  const searchParams = new URLSearchParams(url);

// Obtener el valor del parámetro 'token'
const token = searchParams.get('token');
  set_firestore_last(url, `${token}`)
};
const crossIconClickStorage = (url: string) => {
  console.log(url);
  delete_storage_by_link(url)
};
const tickIconClickFireStore = (id: { id: string, text: string }) => {
  set_firestore_last(id.text, id.id)
  delete_firestore(id.id)
};
const crossIconClickFireStore = (id: { id: string, text: string }) => {
  console.log(id);
  delete_firestore(id.id)

};

const DownloadLinksPage: React.FC<DownloadLinksProps> = ({ downloadURLs }) => {
  const [uniqueURLs, setUniqueURLs] = useState(new Set());
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    // En el useEffect, llamamos a la función asíncrona y actualizamos el estado con los datos recibidos.
    const fetchData = async () => {
      try {
        const result = await get_firestore();
        setData(result);
      } catch (error) {
        // Manejar errores aquí si es necesario
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  console.log(downloadURLs)

  return (
    <div className="bodyGets">
      <h1>Enlaces de descarga</h1>
      <ul>

        {data.map((item) => (
          <li key={item.id} className='rows'>
            <h2>{item.text}</h2>
            <div className='check-box'>
              <FaCheck size={100} color={'green'} onClick={() => tickIconClickFireStore(item)} />
              <FaTimes size={100} color={'red'} onClick={() => crossIconClickFireStore(item)} />
            </div>
          </li>
        ))}


        {downloadURLs.map((url) => (
          <li key={url} className='rows'>
            <img src={url} alt="" />
            <div className='check-box'>
              <FaCheck size={100} color={'green'} onClick={() => tickIconClickStorage(url)} />
              <FaTimes size={100} color={'red'} onClick={() => crossIconClickStorage(url)} />
            </div>
          </li>
        ))}


      </ul>
    </div>
  );
};

export const getStaticProps: GetStaticProps<DownloadLinksProps> = async () => {
  // Obtener los enlaces usando la función getAllDownloadURLs
  const downloadURLs = await getAllDownloadURLs();

  return {
    props: {
      downloadURLs,
    },
  };
};



export default DownloadLinksPage;


// https://firebasestorage.googleapis.com/v0/b/mega-fiesta.appspot.com/o/images%2F1690519713261_Captura%20de%20pantalla%202023-07-28%20000812.png?alt=media&token=fc174be6-43df-454f-9929-340a239036db