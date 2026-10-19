import { Router } from 'express';
import ServiceManager from '../managers/ServiceManager.js';

const router = Router();
const serviceManager = new ServiceManager();

router.get('/', (req, res) => {
  res.status(200).json(serviceManager.getServices(req.query));
});

router.get('/:sid', (req, res) => {
  const result = serviceManager.getServiceById(req.params.sid);
  if (result.error) {
    return res.status(404).json(result);
  }
  res.status(200).json(result);
});

router.post('/', (req, res) => {
  const result = serviceManager.addService(req.body);
  if (result.error) {
    return res.status(400).json(result);
  }
  res.status(201).json(result);
});

router.put('/:sid', (req, res) => {
  const result = serviceManager.updateService(req.params.sid, req.body);
  if (result.error) {
    return res.status(404).json(result);
  }
  res.status(200).json(result);
});

router.delete('/:sid', (req, res) => {
  const result = serviceManager.deleteService(req.params.sid);
  if (result.error) {
    return res.status(404).json(result);
  }
  res.status(200).json({ message: 'Servicio eliminado', service: result });
});

export default router;