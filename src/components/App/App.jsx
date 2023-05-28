import { useState, useEffect } from 'react';
import fetchImages from '../../servises/images-api';
import Searchbar from 'components/Searchbar';
import ImageGallery from 'components/ImageGallery';
import Button from 'components/Button';
import Loader from 'components/Loader';
import Modal from 'components/Modal';

const App = () => {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [imagesOnPage, setImagesOnPage] = useState(0);
  const [totalImages, setTotalImages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [images, setImages] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState(null);
  const [currentImageDescription, setCurrentImageDescription] = useState(null);

  useEffect(() => {
    const fetchImagesData = () => {
      setIsLoading(true);

      fetchImages(query)
        .then(({ hits, totalHits }) => {
          const imagesArray = hits.map(hit => ({
            id: hit.id,
            description: hit.tags,
            smallImage: hit.webformatURL,
            largeImage: hit.largeImageURL,
          }));

          setPage(1);
          setImages(imagesArray);
          setImagesOnPage(imagesArray.length);
          setTotalImages(totalHits);
        })
        .catch(error => {
          console.error(error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    };

    if (query) {
      fetchImagesData();
    }
  }, [query]);

  useEffect(() => {
    if (page !== 1) {
      const fetchNextPageImages = () => {
        setIsLoading(true);

        fetchImages(query, page)
          .then(({ hits }) => {
            const imagesArray = hits.map(hit => ({
              id: hit.id,
              description: hit.tags,
              smallImage: hit.webformatURL,
              largeImage: hit.largeImageURL,
            }));

            setImages(prevImages => [...prevImages, ...imagesArray]);
            setImagesOnPage(
              prevImagesOnPage => prevImagesOnPage + imagesArray.length
            );
          })
          .catch(error => {
            console.error(error);
          })
          .finally(() => {
            setIsLoading(false);
          });
      };

      fetchNextPageImages();
    }
  }, [query, page]);

  const getSearchRequest = query => setQuery(query);
  const onNextFetch = () => setPage(page + 1);
  const toggleModal = () => setShowModal(!showModal);

  const openModal = e => {
    const currentImageUrl = e.target.dataset.large;
    const currentImageDescription = e.target.alt;

    if (e.target.nodeName === 'IMG') {
      setShowModal(prevShowModal => !prevShowModal);
      setCurrentImageUrl(currentImageUrl);
      setCurrentImageDescription(currentImageDescription);
    }
  };

  return (
    <>
      <Searchbar onSubmit={getSearchRequest} />

      {images && <ImageGallery images={images} openModal={openModal} />}

      {isLoading && <Loader />}

      {imagesOnPage >= 12 && imagesOnPage < totalImages && (
        <Button onNextFetch={onNextFetch} />
      )}

      {showModal && (
        <Modal
          onClose={toggleModal}
          currentImageUrl={currentImageUrl}
          currentImageDescription={currentImageDescription}
        />
      )}
    </>
  );
};

export default App;
