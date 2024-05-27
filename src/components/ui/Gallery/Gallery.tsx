import { FC } from "react";
import styles from "./Gallery.module.css";
import { Button } from "@mui/material";
import IImage from "../../../types/IImage";

// Interfaz para las propiedades del componente Gallery
interface IPropsGallery {
  images: IImage[]; // Arreglo de objetos tipo IImage que representan las imágenes
  handleDeleteImg: (uuid: string, url: string) => void; // Función para manejar la eliminación de una imagen
}

// Componente funcional Gallery que muestra una galería de imágenes
export const Gallery: FC<IPropsGallery> = ({ images, handleDeleteImg }) => {
  return (
    <div className={styles.containerPrincipal}>
      <div className={styles.galleryContainer}>
        {/* Mapeo sobre el arreglo de imágenes para mostrar cada una */}
        {images.map((el) => (
          <div key={el.id} className={styles.containerImg}>
            {/* Mostrar la imagen utilizando el componente <img> */}
            <img src={el.url} className={styles.imgGallery} />

            {/* Botón para eliminar la imagen */}
            <Button
              onClick={() => {
                handleDeleteImg(el.id.toString(), el.url); // Llamar a la función handleDeleteImg con el ID y URL de la imagen
              }}
              color="error"
              variant="contained"
            >
              Eliminar
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
