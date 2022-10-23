import db from '../models/index';
require('dotenv').config();
import _ from 'lodash';

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;

const getTopDoctorHome = (limit) => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = await db.User.findAll({
        limit: limit,
        where: { roleId: 'R2' },
        order: [['createdAt', 'DESC']],
        attributes: {
          exclude: ['password'],
        },
        include: [
          { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
          { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] },
        ],
        raw: true,
        nest: true,
      });

      resolve({
        errCode: 0,
        data: users,
      });
    } catch (error) {
      reject(error);
    }
  });
};

const getAllDoctors = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let doctors = await db.User.findAll({
        where: { roleId: 'R2' },
        attributes: {
          exclude: ['password', 'image'],
        },
      });

      resolve({
        errCode: 0,
        data: doctors,
      });
    } catch (error) {
      reject(error);
    }
  });
};

const saveDetailDoctor = (inputData) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputData.doctorId || !inputData.contentHTML || !inputData.contentMarkdown || !inputData.action) {
        resolve({
          errCode: 1,
          errMessage: 'Missing parameter',
        });
      } else {
        if (inputData.action === 'CREATE') {
          await db.Markdown.create({
            contentHTML: inputData.contentHTML,
            contentMarkdown: inputData.contentMarkdown,
            description: inputData.description,
            doctorId: inputData.doctorId,
          });
        } else if (inputData.action === 'EDIT') {
          let doctorMarkdown = await db.Markdown.findOne({
            where: { doctorId: inputData.doctorId },
            raw: false,
          });
          if (doctorMarkdown) {
            doctorMarkdown.contentHTML = inputData.contentHTML;
            doctorMarkdown.contentMarkdown = inputData.contentMarkdown;
            doctorMarkdown.description = inputData.description;

            await doctorMarkdown.save();
          }
        }

        resolve({
          errCode: 0,
          errMessage: 'Save info doctor succeed',
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

const getDetailDoctorById = (inputId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputId) {
        resolve({
          errCode: -1,
          errMessage: 'Missing required parameter',
        });
      } else {
        let data = await db.User.findOne({
          where: { id: inputId },
          attributes: {
            exclude: ['password'],
          },
          include: [
            { model: db.Markdown, attributes: ['description', 'contentHTML', 'contentMarkdown'] },
            { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
          ],
          raw: false,
          nest: true,
        });

        if (data?.image) {
          data.image = new Buffer(data.image, 'base64').toString('binary');
        }

        if (!data) data = {};

        resolve({
          errCode: 0,
          data: data,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

const bulkCreateSchedule = (data) => {
  return new Promise(async (resolve, reject) => {
    if (!data.arrSchedule) {
      resolve({
        errCode: 1,
        errMessage: 'Missing required parameter!',
      });
    } else {
      let schedules = data.arrSchedule;
      if (schedules?.length) {
        schedules = schedules.map((item) => ({ ...item, maxNumber: MAX_NUMBER_SCHEDULE }));
      }

      if (data?.arrSchedule.length) {
        const { doctorId, date } = data.arrSchedule[0];

        let existing = await db.Schedule.findAll({
          where: { doctorId: doctorId, date: date },
          attributes: ['timeType'],
        });

        if (existing.length) {
          let newData = _.differenceWith(schedules, existing, (a, b) => {
            return a.timeType === b.timeType;
          });

          if (newData.length) {
            await db.Schedule.bulkCreate(newData);
          }
        } else {
          await db.Schedule.bulkCreate(schedules);
        }
      }

      //

      resolve({
        errCode: 0,
        errMessage: 'OK',
      });
    }
    try {
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  getTopDoctorHome: getTopDoctorHome,
  getAllDoctors: getAllDoctors,
  saveDetailDoctor: saveDetailDoctor,
  getDetailDoctorById: getDetailDoctorById,
  bulkCreateSchedule: bulkCreateSchedule,
};
