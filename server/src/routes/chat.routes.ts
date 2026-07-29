import { Router } from 'express';
import {
  getChats,
  createChat,
  deleteChat,
  updateChat,
  getMessages,
  sendMessage,
  regenerateMessage,
} from '../controllers/chat.controller';
import { authenticate } from '../middleware/auth.middleware';
import { aiRateLimiter } from '../middleware/rateLimiter';

const router = Router();

router.use(authenticate);

router.get('/', getChats);
router.post('/', createChat);
router.delete('/:id', deleteChat);
router.patch('/:id', updateChat);
router.get('/:id/messages', getMessages);
router.post('/:id/messages', aiRateLimiter, sendMessage);
router.post('/:id/regenerate', aiRateLimiter, regenerateMessage);

export default router;
