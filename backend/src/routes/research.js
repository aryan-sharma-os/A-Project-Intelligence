import express from 'express';
import Joi from 'joi';
import { validate } from '../middleware/validate.js';
import {
  startResearch,
  getReport,
  streamResearch,
  getReportHistory,
  chatWithReport
} from '../controllers/researchController.js';

const router = express.Router();

const researchRequestSchema = {
  ticker: Joi.string().trim().uppercase().max(10).required(),
  query: Joi.string().trim().max(500).optional().allow(''),
};

router.post('/', validate(researchRequestSchema), startResearch);
router.get('/history', getReportHistory);
router.get('/:id', getReport);
router.get('/:id/stream', streamResearch);
router.post('/:id/chat', chatWithReport);

export default router;
