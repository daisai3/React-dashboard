import React from 'react';
import { scss } from '../../utils';

function Header() {
  return (
    <header className={scss('Header_container')}>
      <div className={scss('Header_titleContainer')}>
        <h1>Burj Al Nahar Dashboard</h1>
      </div>
    </header>
  );
}

export default React.memo(Header);
