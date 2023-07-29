import React, { useEffect, useState } from 'react';
import { get_firestore_last } from '../db/firebase_users';
import '../src/app/stylePublic.css'
// import style from '../src/app/stylePublic.css'

type FirestoreData = {
  id: string;
  text?: string; // Hacemos que el campo text sea opcional
};

const Public = () => {
  const [data, setData] = useState<FirestoreData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await get_firestore_last();
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className='bodyPublic'>
        <div className='lateralColumn1'></div>
      <ul>
        {data.map((item) => (
            <li key={item.id} className='rows'>
            {item.text && item.text.startsWith('https://firebasestorage.googleapis.com') ? (
                <img src={item.text} alt={item.id} />
                ) : item.text === '' || item.text=== undefined?<></>:(
                    <h2>{item.text}</h2>
                    )}
          </li>
        ))}
      </ul>
        <div className='lateralColumn2'></div>
    </div>
  );
};

export default Public;