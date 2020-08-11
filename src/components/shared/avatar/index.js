import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import classes from './avatar.module.scss';
import placeholder from '../../../assets/images/avatar-placeholder.jpg';
import Icon from '../svgIcon';

function Avatar({ image, changeHandler, editable = false }) {
  const [avatarImg, setAvatarImg] = useState(image || placeholder);

  useEffect(() => {
    setAvatarImg(image || placeholder);
  }, [image]);

  const imgInput = useRef();
  function errorHandler() {
    setAvatarImg(placeholder);
  }

  function handleBtnClick(event) {
    event.preventDefault();
    imgInput.current.click();
  }

  function handleImgChange(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (imgLoaded) => {
        const mainCanvas = document.createElement('canvas');
        mainCanvas.width = 79;
        mainCanvas.height = 79;
        const ctx = mainCanvas.getContext('2d');
        const tempImg = new Image();
        tempImg.onload = () => {
          ctx.drawImage(tempImg, 0, 0, mainCanvas.width, mainCanvas.height);
          const resizedImg = mainCanvas.toDataURL();
          setAvatarImg(resizedImg);
          changeHandler(resizedImg);
        };
        tempImg.src = imgLoaded.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  const renderImg = () => (
    <img
      data-testid="avatar"
      className={classes.avatar}
      src={avatarImg}
      alt="Avatar"
      onError={errorHandler}
    />
  );

  if (!editable) {
    return renderImg();
  }

  return (
    <div className={classes.imgWrapper}>
      {renderImg()}
      <button
        type="button"
        className={classes.overlay}
        onClick={handleBtnClick}
      >
        <span className={classes.iconWrapper}>
          <Icon name="addPhoto" width={10.5} />
        </span>
      </button>
      <input
        onChange={handleImgChange}
        accept="image/png, image/jpeg"
        type="file"
        ref={imgInput}
        style={{ display: 'none' }}
      />
    </div>
  );
}

Avatar.propTypes = {
  image: PropTypes.string,
  changeHandler: PropTypes.func,
  editable: PropTypes.bool,
};

export default React.memo(Avatar);
