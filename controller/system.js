const System = require('../models/system');

exports.put_update_geolocation = async (req, res, next) => {
  try {
    const { latitude, longitude } = req.body;
    const geolocationUpdateLong = await System.updateOne({ name: 'latitude' }, { $set: { value: Number(latitude) } });
    const geolocationUpdateLat = await System.updateOne({ name: 'longitude' }, { $set: { value: Number(longitude) } });
    if ((geolocationUpdateLong.ok !== 1 || geolocationUpdateLong.nModified !== 1) &&
      (geolocationUpdateLat.ok !== 1 || geolocationUpdateLat.nModified !== 1)) {
      return res.json({
        error: 'There was an error updating the Geo Location'
      });
    }
    res.json({
      status: 'OK',
      msg: 'Updated HQ Location !'
    });
  } catch (error) {
    next(error);
  }
};