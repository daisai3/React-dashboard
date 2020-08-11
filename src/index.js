import React from 'react';
import ReactDOM from 'react-dom';
import { IntlProvider } from 'react-intl';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import translations from './locales';
import './sass/global.scss';
import Routing from './components/router';
import StoreContext from './store';
import 'typeface-lato';
import 'typeface-roboto';

const language = navigator.language.split(/[-_]/)[0]; // language without region code
if (language === 'ar') {
  document.getElementsByTagName('html')[0].dir = 'rtl'; // changes text direction for Arabic
}

ReactDOM.render(
  <IntlProvider
    locale={language}
    defaultLocale="en"
    messages={translations[language]}
  >
    <StoreContext>
      <Routing />
    </StoreContext>
  </IntlProvider>,
  document.getElementById('root'),
);
