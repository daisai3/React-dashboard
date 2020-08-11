import React, { useState, useRef, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import classes from './drawing-canvas.module.scss';

import imgPlaceholder from '../../images/Screen Shot 2020-05-12 at 1.56.31 PM.png';
import { scss, LIGHT_BLUE, LIGHT_BLUE_ALPHA } from '../../utils';

const DRAW_COLOR = LIGHT_BLUE; // Light Blue

const LINE_WIDTH = 2;

const LAST_INDEX = -1;

function drawLine(ctx, startX, startY, endX, endY) {
  ctx.globalCompositeOperation = 'color';
  ctx.lineWidth = LINE_WIDTH;
  ctx.strokeStyle = DRAW_COLOR;
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.stroke();
}

const RADIUS = 4;
const RADIUS_W_FONT = 6;

const DOUBLE = 2;
const FULL_CIRCLE = DOUBLE * Math.PI;

const abc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function drawCircle(ctx, x, y, position, withLines) {
  const radius = withLines ? RADIUS : RADIUS_W_FONT;
  ctx.globalCompositeOperation = 'source-over';
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, FULL_CIRCLE);
  ctx.fillStyle = DRAW_COLOR;
  ctx.fill();
  if (!withLines) {
    const FONT_SIZE = 4;
    ctx.font = `6px`;
    ctx.beginPath();
    ctx.fillStyle = 'black';
    ctx.fillText(abc[position], x - FONT_SIZE, y + FONT_SIZE);
  }
}

function redrawCanvas(ctx, coords, withLines) {
  if (!withLines) {
    coords.forEach((pair, i) => {
      drawCircle(ctx, pair[0], pair[1], i);
      if (withLines && i > 0) {
        drawLine(ctx, coords[i - 1][0], coords[i - 1][1], pair[0], pair[1]);
      }
    });
  }
  if (withLines && coords.length > 0) {
    ctx.beginPath();
    ctx.moveTo(coords[0][0], coords[0][1]);
    coords.slice(1).forEach((pair) => {
      ctx.lineTo(pair[0], pair[1]);
    });
    ctx.closePath();
    ctx.lineWidth = 2;
    ctx.fillStyle = LIGHT_BLUE_ALPHA; // Light blue with opacity
    ctx.fill();
    ctx.strokeStyle = DRAW_COLOR;
    ctx.stroke();
    coords.forEach((pair, i) => {
      drawCircle(ctx, pair[0], pair[1], i, withLines);
    });
  }
}

function DrawingCanvas({
  image,
  initialCoords,
  withLines,
  notInteractive,
  noUpload,
  maxPoints,
  imageUpdate,
  updatedCoordsHandler,
  alignLeft,
}) {
  const canvasRef = useRef();

  const imageBackground = useRef();

  const [sizeReductionAxis, setSizeReductionAxis] = useState([0, 0]);

  const [selectedCoords, setSelectedCoords] = useState([]);

  const [displayImage, setDisplayImage] = useState(image);

  useEffect(() => {
    if (initialCoords) {
      const reducedCoords = initialCoords.map(([x, y]) => [
        x / sizeReductionAxis[0],
        y / sizeReductionAxis[1],
      ]);

      setSelectedCoords(reducedCoords);
    } else {
      setSelectedCoords([]);
    }
  }, [sizeReductionAxis, initialCoords]);

  const addImageToCanvas = useCallback(() => {
    const img = new Image();
    img.onload = () => {
      setSizeReductionAxis([
        img.naturalWidth / imageBackground.current?.width || 1,
        img.naturalHeight / imageBackground.current?.height || 1,
      ]);
    };
    img.width = 581;
    img.height = 483;
    img.src = displayImage;
    if (imageUpdate) {
      imageUpdate(displayImage);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayImage]);

  useEffect(() => {
    canvasRef.current.width = 581;
    canvasRef.current.height = 483;
    addImageToCanvas();
  }, [addImageToCanvas]);

  useEffect(() => {
    if (canvasRef.current && imageBackground.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        addImageToCanvas();
        redrawCanvas(ctx, selectedCoords, withLines);
      }
    }
  }, [selectedCoords, withLines, addImageToCanvas]);

  const clearCanvas = useCallback(
    function clearCanvas() {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      addImageToCanvas();
      const updatedCoords = selectedCoords.slice(0, LAST_INDEX);
      redrawCanvas(ctx, updatedCoords, withLines);
      setSelectedCoords(updatedCoords);
      if (updatedCoordsHandler) {
        const originalSizeCoords = updatedCoords.map((item) => [
          Math.trunc(item[0] * sizeReductionAxis[0]),
          Math.trunc(item[1] * sizeReductionAxis[1]),
        ]);
        updatedCoordsHandler(originalSizeCoords);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [addImageToCanvas, selectedCoords, withLines, sizeReductionAxis],
  );

  const onClickHandler = useCallback(
    function onClickHandler(event) {
      const x = event.nativeEvent.offsetX;
      const y = event.nativeEvent.offsetY;
      const ctx = canvasRef.current?.getContext('2d');
      if (!maxPoints || selectedCoords.length < maxPoints) {
        if (selectedCoords.length < abc.length && displayImage) {
          drawCircle(ctx, x, y, selectedCoords.length);

          const updatedCoords = [...selectedCoords];
          updatedCoords.push([x, y]);
          if (withLines) {
            const coordsLen = selectedCoords.length;
            if (coordsLen !== 0) {
              const lastCoords = selectedCoords[coordsLen - 1];
              drawLine(ctx, lastCoords[0], lastCoords[1], x, y);
            }
          }
          setSelectedCoords(updatedCoords);
          if (updatedCoordsHandler) {
            const originalSizeCoords = updatedCoords.map((item) => [
              Math.trunc(item[0] * sizeReductionAxis[0]),
              Math.trunc(item[1] * sizeReductionAxis[1]),
            ]);
            updatedCoordsHandler(originalSizeCoords);
          }
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [displayImage, maxPoints, selectedCoords, sizeReductionAxis, withLines],
  );

  const handleImageInput = useCallback(function handleImageInput(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (imageLoaded) => {
        const mainCanvas = document.createElement('canvas');
        const ctx = mainCanvas?.getContext('2d');
        const tempImg = new Image();
        tempImg.onload = () => {
          mainCanvas.width = tempImg.naturalWidth;
          mainCanvas.height = tempImg.naturalHeight;
          ctx.drawImage(tempImg, 0, 0, 581, 483);
          setDisplayImage(mainCanvas.toDataURL());
        };
        tempImg.src = imageLoaded.target.result;
      };
      reader.readAsDataURL(file);
    }
  }, []);

  return (
    <>
      <div
        className={classes.toolBar}
        style={alignLeft ? { justifyContent: 'flex-start' } : {}}
      >
        {!noUpload && (
          <input
            type="file"
            accept="image/x-png,image/jpeg"
            onChange={handleImageInput}
          />
        )}
        {!notInteractive && (
          <button
            className={scss('Global_btn_green Global_btn', classes.clearBtn)}
            type="button"
            onClick={clearCanvas}
          >
            Clear
          </button>
        )}
      </div>
      <div className={classes.canvasWrapper}>
        <img
          ref={imageBackground}
          src={displayImage}
          className={classes.imageBackground}
          alt="inserted display"
          style={alignLeft ? { right: 'unset' } : {}}
        />
        <canvas
          style={
            displayImage
              ? {
                  background: `url("${displayImage}") center center/contain no-repeat`,
                  width: 581,
                  height: 483,
                }
              : {
                  background: `url("${imgPlaceholder}") center center/contain no-repeat`,
                  width: 400,
                  height: 300,
                }
          }
          className={scss(classes.canvas, alignLeft ? classes.noMargin : '')}
          ref={canvasRef}
          onClick={notInteractive ? undefined : onClickHandler}
        />
      </div>
    </>
  );
}

DrawingCanvas.propTypes = {
  withLines: PropTypes.bool,
  updatedCoordsHandler: PropTypes.func,
  notInteractive: PropTypes.bool,
  imageUpdate: PropTypes.func,
  maxPoints: PropTypes.number,
  image: PropTypes.string,
  noUpload: PropTypes.bool,
  initialCoords: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
  alignLeft: PropTypes.bool,
};

export default DrawingCanvas;
