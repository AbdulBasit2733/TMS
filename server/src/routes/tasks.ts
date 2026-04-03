import { Router } from 'express';
import {
  getTasks,
  createTask,
  getTaskById,
  updateTask,
  deleteTask,
  toggleTaskStatus,
  toggleTaskPriority,

} from '../controllers/taskController';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

router.use(authenticate);

router.get('/', getTasks);
router.post('/', createTask);
router.get('/:id', getTaskById);
router.patch('/:id', updateTask);
router.delete('/:id', deleteTask);
router.patch('/:id/toggle', toggleTaskStatus);
router.patch('/:id/priority', toggleTaskPriority);

export default router;
