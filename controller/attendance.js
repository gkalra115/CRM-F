const Attendance = require('../models/attendance');
const User = require('../models/user');
const { query, validationResult } = require('express-validator');
const { ObjectId } = require('mongoose').Types;
const System = require('../models/system');

exports.validateDateQuery = [
  query('date')
    .optional()
    .custom((value) => {
      const getValue = /^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/.test(
        value
      );
      if (getValue) {
        return true;
      }
      return false;
    })
    .withMessage('Please set a valid date filter'),
];

const arePointsNear = (system_lat, system_lng, checkPoint, km) => {
  var ky = 40000 / 360;
  var kx = Math.cos((Math.PI * system_lat) / 180.0) * ky;
  var dx = Math.abs(system_lng - checkPoint.lng) * kx;
  var dy = Math.abs(system_lat - checkPoint.lat) * ky;
  return Math.sqrt(dx * dx + dy * dy) <= km;
};

const formatAMPM = (date) => {
  var startTime = new Date(date);
  startTime = new Date(
    startTime.getTime() + startTime.getTimezoneOffset() * 60000
  );
  var hours = startTime.getHours();
  var minutes = startTime.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
};

exports.create_date_attendance_list = async (req, res, next) => {
  try {
    const newDayDate = new Date().setUTCHours(0, 0, 0, 0);
    const getEmployeeUsers = await User.find({
      user_type: 'Employee',
      is_active: true,
    }).select('_id');
    const createEmployeeList = getEmployeeUsers.map((e) => {
      return {
        employeeId: e._id,
        date: newDayDate,
        timings: [],
      };
    });
    const insertEmployeeData = await Attendance.insertMany(createEmployeeList);
    if (insertEmployeeData.length !== getEmployeeUsers.length) {
      return next({
        error: {
          message: 'There was an error creatig the list for today',
        },
      });
    }
    res.json({
      status: 'OK',
      message: 'Created User List for Today',
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.get_user_single_timings = async (req, res, next) => {
  try {
    const { userId } = req.decoded;
    const todaysDate = new Date().setUTCHours(0, 0, 0, 0);
    const getUserTimings = await Attendance.findOne({
      employeeId: ObjectId(userId),
      date: todaysDate,
    }).select('timings');
    res.json({
      status: 'OK',
      data: getUserTimings.timings,
      totalCount: getUserTimings.timings.length,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.update_user_timings = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { device_info, user_lat, user_long, is_pwa = false } = req.body;
    console.log(req.body);
    const userInfo = await User.find({
      _id: { $ne: ObjectId(id) },
      user_device: device_info
    });
    if (!is_pwa) {
      if (!!userInfo && userInfo.length > 0) {
        return res.status(400).json({
          error: {
            message: 'Device already registered on different account.',
          },
        });
      }
      if (req.decoded.user_device === null) {
        const updateUserDevice = await User.updateOne(
          { _id: ObjectId(id) },
          {
            $set: {
              user_device: device_info,
            },
          }
        );
        if (updateUserDevice.ok !== 1 || updateUserDevice.nModified !== 1) {
          return res.status(400).json({
            error: {
              message: 'Not able to update user device information',
            },
          });
        }
      }
    }
    const getCoordinates = await System.find({ $or: [{ name: 'latitude' }, { name: 'longitude' }] });
    let system_lat = getCoordinates.find(x => x.name === 'latitude').value;
    let system_lng = getCoordinates.find(x => x.name === 'longitude').value;
    const isUserAtOffice = arePointsNear(
      system_lat.toFixed(4),
      system_lng.toFixed(4),
      { lat: user_lat.toFixed(4), lng: user_long.toFixed(4) },
      0.5
    );
    if (!isUserAtOffice) {
      return res.status(400).json({
        error: {
          message: 'Looks like you are not at the office.',
        },
      });
    }
    const todaysDate = new Date().setUTCHours(0, 0, 0, 0);
    const dt = new Date();
    const inTime = new Date(
      dt.getTime() - dt.getTimezoneOffset() * 60000
    ).toISOString();
    let setTime = {};
    setTime['time'] = inTime;
    const findUserCurrentTiming = await Attendance.findOne({
      employeeId: ObjectId(id),
      date: todaysDate,
      // date: new Date('2020-09-15'),
    }).select('timings');
    const { name } = await User.findOne({
      _id: ObjectId(id),
    }).select('name');
    if (!!findUserCurrentTiming && findUserCurrentTiming.timings.length > 0) {
      let { isInTime } = findUserCurrentTiming.timings[
        findUserCurrentTiming.timings.length - 1
      ];
      if (isInTime) {
        setTime['isInTime'] = false;
      } else {
        setTime['isInTime'] = true;
      }
    } else {
      setTime['isInTime'] = true;
    }
    const updateUserTiming = await Attendance.updateOne(
      {
        employeeId: ObjectId(id),
        date: todaysDate,
      },
      {
        $push: {
          timings: setTime,
        },
      }
    );
    if (updateUserTiming.ok !== 1 || updateUserTiming.nModified !== 1) {
      return next({
        error: {
          message: 'There was an error updating the user timestamp',
        },
      });
    }
    res.json({
      status: 'OK',
      message: `${name} your ${setTime.isInTime ? 'in-time' : 'out-time'
        } registered at ${formatAMPM(setTime.time)}`,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.get_user_lists = async (req, res, next) => {
  const { errors } = validationResult(req);
  if (errors.length > 0) {
    return res.status(400).json({
      error: errors[0].msg,
    });
  }
  let date = req.query.date
    ? req.query.date
    : new Date().setUTCHours(0, 0, 0, 0);
  try {
    const todayEmployees = await Attendance.find({
      date: new Date(date),
    })
      .populate({
        path: 'employeeId',
        select: 'name phone email employee.user_role',
      })
      .select('employeeId timings leave_type');
    // let finalList = {};
    // finalList['attended'] = [];
    // finalList['notAttended'] = [];
    // for (let i = 0; i < todayEmployees.length; i++) {
    //   if (todayEmployees[i].timings.length > 0) {
    //     finalList['attended'].push(todayEmployees[i]);
    //   } else {
    //     finalList['notAttended'].push(todayEmployees[i]);
    //   }
    // }
    res.json({
      data: todayEmployees,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
