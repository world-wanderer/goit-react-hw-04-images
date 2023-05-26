import { useState } from 'react';
import { ImSearch } from 'react-icons/im';
import css from './Searchbar.module.css';
import Notiflix from 'notiflix';
import PropTypes from 'prop-types';

const Searchbar = ({ onSubmit }) => {
  const [query, setQuery] = useState('');

  const onChangeInput = e => {
    setQuery(e.currentTarget.value.toLowerCase());
  };

  const onSubmitForm = e => {
    e.preventDefault();

    if (query.trim() === '') {
      Notiflix.Notify.info('Спочатку буквочки введи, потім вже шукай!');
      return;
    }

    onSubmit(query);
    e.target.reset();
  };

  return (
    <header className={css.searchbar}>
      <form className={css.form} onSubmit={onSubmitForm}>
        <button type="submit" className={css.button}>
          <ImSearch size={25} />
        </button>

        <input
          className={css.input}
          type="text"
          placeholder="Search images and photos"
          autoComplete="off"
          autoFocus
          value={query}
          onChange={onChangeInput}
        />
      </form>
    </header>
  );
};
export default Searchbar;

Searchbar.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
