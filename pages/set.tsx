import { getStorage, ref, uploadBytes } from 'firebase/storage';
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { set_firestore, set_storage,storage1 } from '../db/firebase';

import '../src/app/style.css';

const InputComponent: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [oneShot, setOneShot] = useState('');

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setInputValue(event.target.value);
  };

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    set_firestore(inputValue); // Llamada a la función hola con el valor del input
    setInputValue(''); // Reiniciar el valor del input después de enviarlo
  };

  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>): void => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const currentDate = new Date();
      const fileCreationDate = new Date(file.lastModified);

      const horaFile = fileCreationDate.getTime()
      const horaLocal = currentDate.getTime() - 18000000 
      // Compara la fecha de creación del archivo con la fecha actual
      if (horaFile  > horaLocal ) {
        setSelectedImage(file);
        const date1 = new Date(horaFile );
        const date2 = new Date(horaLocal);

        console.log(date1); // Fecha y hora correspondiente al primer timestamp
        console.log(date2);

        console.log(horaFile )
        console.log(horaFile )
        console.log(horaLocal)
      } else {
        const date1 = new Date(horaFile );
        const date2 = new Date(horaLocal);

        console.log(date1); // Fecha y hora correspondiente al primer timestamp
        console.log(date2);

        console.log(horaFile )
        console.log(horaLocal)
        setOneShot('no hay imagenes')
        // El archivo no fue tomado en el momento
        // Aquí puedes mostrar un mensaje de error o realizar alguna acción
      }
    }
  };


const uploadImageToStorage = async (file: File): Promise<void> => {
  storage1;
  const storageRef = ref(storage1, `images/${Date.now()}_${file.name}`);

  await uploadBytes(storageRef, file);
};

  const handleFormSubmit2 = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    if (selectedImage) {
      await uploadImageToStorage(selectedImage);
      setSelectedImage(null);
    }
  };

  const randomId = () =>{
    return `id-${Math.floor(Math.random()*90000000)}`
  }

 

  console.log()
  return (
    <div>
      {/*firestore  */}
      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
        />
        <button type="submit">Enviar a la base de datos</button>
      </form>
      {/* storage */}
      <form onSubmit={handleFormSubmit2}>
        {/* <input type="file" onChange={handleImageChange} name={randomId} /> */}
        <input type="file" onChange={handleImageChange}  />
        <button type="submit">Cargar imagen</button>
      </form>

      <div>{oneShot}</div>

    </div>
  );
};

export default InputComponent;


// return (
//   <div>
    
//     <form onSubmit={handleFormSubmit2}>

//       <input type="file" onChange={handleImageChange}  />
//       <button type="submit">Cargar imagen</button>
//     </form>

//     <div>{oneShot}</div>

//   </div>
// );