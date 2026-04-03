import { Router } from 'express';
import {
  getTasks,
  createTask,
  getTaskById,
  updateTask,
  deleteTask,
  toggleTaskStatus,
  assignTaskToUser,
  removeTaskAssignment,
  getTaskAssignments,
  searchAssignableUsers,
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
router.get('/:id/assignments', getTaskAssignments);
router.get('/:id/assignable-users', searchAssignableUsers);
router.post('/:id/assignments', assignTaskToUser);
router.delete('/:id/assignments/:userId', removeTaskAssignment);

export default router;
