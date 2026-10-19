import { Router } from 'express';
import { serviceManager } from '../managers/instances.js';

const router = Router();

router.get('/', (req, res, next) => {
  try {
    res.status(200).json(serviceManager.getServices(req.query));
  } catch (error) {
    next(error);
  }
});

router.get('/:sid', (req, res, next) => {
  try {
    res.status(200).json(serviceManager.getServiceById(req.params.sid));
  } catch (error) {
    next(error);
  }
});

router.post('/', (req, res, next) => {
  try {
    res.status(201).json(serviceManager.addService(req.body));
  } catch (error) {
    next(error);
  }
});

router.put('/:sid', (req, res, next) => {
  try {
    res.status(200).json(serviceManager.updateService(req.params.sid, req.body));
  } catch (error) {
    next(error);
  }
});

router.delete('/:sid', (req, res, next) => {
  try {
    const deleted = serviceManager.deleteService(req.params.sid);
    res.status(200).json({ message: 'Servicio eliminado', service: deleted });
  } catch (error) {
    next(error);
  }
});

export default router;