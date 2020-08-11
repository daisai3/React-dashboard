import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import centerService from '../../../services/center.service';
import classes from './stage-3.module.scss';
import DrawingCanvas from '../../drawing-canvas';

function AreasStage({ center }) {
  const [zones, setZones] = useState([]);

  const [selectedZoneIndex, setSelectedZoneIndex] = useState('');
  const [selectedZone, setSelectedZone] = useState({});

  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    setSelectedZone(zones[selectedZoneIndex]);
  }, [selectedZoneIndex, zones]);

  useEffect(() => {
    centerService.getZones(center.name).then((resp) => {
      setZones(resp.data);
      setSelectedZone({ area_name: '', area_type: '' });
      setSelectedZoneIndex('');
    });
  }, [center, tabIndex]);

  function updateZone() {
    const body = {
      old_zone: zones[selectedZoneIndex],
      new_zone: selectedZone,
    };
    centerService.updateZone(body);
    const copyZones = [...zones];
    copyZones[selectedZoneIndex] = selectedZone;
    setZones(copyZones);
  }

  return (
    <div className={classes.mainWrapper}>
      <div className={classes.zoneManage}>
        <FormattedMessage
          id="camera_config__zone_management"
          defaultMessage="Area Management"
        />
        <div style={{ display: 'flex', margin: '10px 0' }}>
          <button
            disabled={tabIndex === 0}
            type="button"
            className="Global_btn Global_btn_green"
            onClick={() => setTabIndex(0)}
          >
            Add
          </button>
          <button
            type="button"
            disabled={tabIndex === 1}
            className="Global_btn Global_btn_green"
            onClick={() => setTabIndex(1)}
          >
            Update
          </button>
        </div>
        {tabIndex === 1 && (
          <select
            value={selectedZoneIndex}
            onChange={(event) => {
              setSelectedZoneIndex(event.target.value);
            }}
            onBlur={(event) => {
              setSelectedZoneIndex(event.target.value);
            }}
          >
            <FormattedMessage id="select" defaultMessage="Select area">
              {(message) => (
                <option disabled value="">
                  {message}
                </option>
              )}
            </FormattedMessage>
            {zones.map((zone, i) => (
              <option
                key={`${zone.area_type} - ${zone.area_name}`}
                value={i}
              >{`${zone.area_type} - ${zone.area_name}`}</option>
            ))}
          </select>
        )}

        <label htmlFor="Area Name">
          <FormattedMessage
            id="camera_config__area_name"
            defaultMessage="Area Name"
          />
          <input
            type="text"
            disabled={!zones[selectedZoneIndex] && tabIndex === 1}
            value={selectedZone?.area_name}
            onChange={(event) => {
              setSelectedZone({
                ...selectedZone,
                area_name: event.target.value,
              });
            }}
          />
        </label>
        <label htmlFor="Area Type">
          <FormattedMessage
            id="camera_config__area_type"
            defaultMessage="Area Type"
          />
          <input
            type="text"
            disabled={!zones[selectedZoneIndex] && tabIndex === 1}
            value={selectedZone?.area_type}
            onChange={(event) => {
              setSelectedZone({
                ...selectedZone,
                area_type: event.target.value,
              });
            }}
          />
        </label>
        <label htmlFor="coords">
          <FormattedMessage
            id="camera_config__area_name"
            defaultMessage="Selected points"
          />
          <br />
          {selectedZone?.polygon?.join(' - ')}
        </label>

        {tabIndex === 0 && (
          <button
            disabled={
              !selectedZone?.area_name ||
              !selectedZone?.area_type ||
              !selectedZone?.polygon?.length
            }
            type="button"
            className="Global_btn Global_btn_green"
            onClick={() => {
              centerService.addZone({
                ...selectedZone,
                center_name: center.name,
              });
              setSelectedZone({ area_name: '', area_type: '' });
              setSelectedZoneIndex('');
            }}
          >
            <FormattedMessage
              id="camera_config__add_zone"
              defaultMessage="Add new area"
            />
          </button>
        )}
        {tabIndex === 1 && (
          <div style={{ display: 'flex', margin: '10px 0' }}>
            <button
              disabled={!zones[selectedZoneIndex]}
              type="button"
              className="Global_btn Global_btn_green"
              onClick={updateZone}
            >
              <FormattedMessage
                id="camera_config__update_zone"
                defaultMessage="Update"
              />
            </button>
            <button
              disabled={!zones[selectedZoneIndex]}
              type="button"
              className="Global_btn Global_btn_green"
              onClick={() => {
                centerService.deleteZone({
                  ...selectedZone,
                  center: center.name,
                });
                setSelectedZone({ area_name: '', area_type: '' });
                setSelectedZoneIndex('');
              }}
            >
              <FormattedMessage
                id="camera_config__delete_zone"
                defaultMessage="Delete"
              />
            </button>
          </div>
        )}
      </div>
      <div className={classes.floorMap}>
        <DrawingCanvas
          image={center.floor_plan}
          noUpload
          withLines
          notInteractive={!zones[selectedZoneIndex] && tabIndex === 1}
          updatedCoordsHandler={(polygon) => {
            setSelectedZone({ ...selectedZone, polygon });
          }}
          initialCoords={selectedZone?.polygon}
        />
      </div>
    </div>
  );
}

AreasStage.propTypes = {
  center: PropTypes.shape({
    name: PropTypes.string,
    floor_plan: PropTypes.string,
    cameras: PropTypes.arrayOf(PropTypes.shape({})),
  }),
  form: PropTypes.shape({
    floor_plan: PropTypes.string,
    cameras: PropTypes.arrayOf(PropTypes.shape({})),
  }),
};

export default AreasStage;
