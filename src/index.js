import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix'

const DEBOUNCE_DELAY = 300;

const countryInput = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

countryInput.addEventListener('input', debounce(onCountryInput, DEBOUNCE_DELAY));

function onCountryInput() {
  const name = countryInput.value.trim()
  if (name === '') {
    return (countryList.innerHTML = ''), (countryInfo.innerHTML = '');
  }

  fetchCountries(name)
    .then(countries => {
      countryList.innerHTML = '';
      countryInfo.innerHTML = '';
      if (countries.length === 1) {
        countryList.insertAdjacentHTML('beforeend', addrCountryList(countries));
        countryInfo.insertAdjacentHTML('beforeend', addrCountryInfo(countries));
      } else if (countries.length >= 10) {
        alertTooManyMatches()
      } else {
        countryList.insertAdjacentHTML('beforeend', addrCountryList(countries));
      }
    })
    .catch(alertWrongName);
}

function addrCountryList(countries) {
  const markup = countries
    .map(({ name, flags }) => {
      return `
          <li class="country-list__item">
              <img class="country-list__flag" src="${flags.svg}" alt="Flag of ${name.official}" width = 60px height = 40px>
              <h2 class="country-list__name">${name.official}</h2>
          </li>
          `
    })
    .join('');
  return markup;
}

function addrCountryInfo(countries) {
  const markup = countries
    .map(({ capital, population, languages }) => {
      return `
        <ul class="country-info__list">
            <li class="country-info__item"><b><p>Capital: </b>${capital}</p></li>
            <li class="country-info__item"><b><p>Population: </b>${population}</p></li>
            <li class="country-info__item"><b><p>Languages: </b>${Object.values(languages).join(', ')}</p></li>
        </ul>
        `
    })
    .join('');
  return markup;
}

function alertWrongName() {
  Notiflix.Notify.failure('Oops, there is no country with that name');
}

function alertTooManyMatches() {
  Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
}
