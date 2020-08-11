import React, { useState, useEffect, useContext } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { Store } from '../../store';
import centerService from '../../services/center.service';
import Spinner from '../../components/shared/spinner';
import Icon from '../../components/shared/icon';
import classes from './camera-config-dashboard.module.scss';
import CameraConfigForm from '../../components/center-config-form';
import { getStartOfTheDay } from '../../utils';

const MS = 1000;
function CameraConfigPage({ location }) {
  const [store] = useContext(Store);
  const [center] = useState(location.state?.center || store.user.center_name);
  const [centerInfo, setCenterInfo] = useState();

  useEffect(() => {
    centerService
      .getCenter(center, getStartOfTheDay(), Date.now() / MS)
      .then((centerResponse) => {
        setCenterInfo(centerResponse.data);
      });
  }, [center]);

  if (!centerInfo) {
    return (
      <div className="Spinner_contained">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <div className={classes.pageHeader}>
        <Icon name="config" />
        <FormattedMessage
          id="camera_config_dashboard__title"
          defaultMessage="Centers Configuration: {center}"
          values={{ center }}
        />
        {/* <input
          type="text"
          value={imageCoords.id}
          placeholder="Camera Id"
          onChange={(event) =>
            setImageCoords({ ...imageCoords, id: event.target.value })
          }
        />
        <button
          type="button"
          style={{
            backgroundColor: 'green',
            borderRadius: '5px',
            color: 'white',
          }}
          onClick={() => {
            calibrationService.sendCameraAndBlueprintCoordsRelation(
              imageCoords,
            );
          }}
        >
          Send
        </button> */}
      </div>
      <CameraConfigForm center={centerInfo} />
    </>
  );
}

CameraConfigPage.propTypes = {
  location: PropTypes.shape({
    state: PropTypes.shape({ center: PropTypes.string }),
  }),
};

export default CameraConfigPage;
