import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_PATH = path.join(__dirname, '../data/services.json');

const REQUIRED_FIELDS = [
  'name',
  'description',
  'duration',
  'price',
  'category',
  'available',
];

class ServiceManager {
  constructor() {
    this.services = this.#loadFromDisk();
  }

  #loadFromDisk() {
    try {
      const raw = fs.readFileSync(DATA_PATH, 'utf-8');
      return JSON.parse(raw);
    } catch (error) {
      console.error(`No se pudo leer ${DATA_PATH}, se inicia con lista vacía.`);
      return [];
    }
  }

  #saveToDisk() {
    fs.writeFileSync(DATA_PATH, JSON.stringify(this.services, null, 2), 'utf-8');
  }

    getServices(filters = {}) {
    const { category, available } = filters;

    return this.services.filter((service) => {
      if (
        category !== undefined &&
        service.category.toLowerCase() !== String(category).toLowerCase()
      ) {
        return false;
      }
      if (available !== undefined && service.available !== (available === 'true')) {
        return false;
      }
      return true;
    });
  }

  getServiceById(id) {
    const service = this.services.find((s) => s.id === Number(id));
    return service || { error: `No existe un servicio con id ${id}` };
  }

    #generateId() {
    return this.services.length > 0
      ? Math.max(...this.services.map((s) => s.id)) + 1
      : 1;
  }

    addService(serviceData) {
    const missing = REQUIRED_FIELDS.filter(
      (field) =>
        serviceData[field] === undefined ||
        serviceData[field] === null ||
        serviceData[field] === ''
    );

    if (missing.length > 0) {
      return { error: `Faltan campos requeridos: ${missing.join(', ')}` };
    }

    const newService = {
      id: this.#generateId(),
      name: serviceData.name,
      description: serviceData.description,
      duration: serviceData.duration,
      price: serviceData.price,
      category: serviceData.category,
      available: serviceData.available,
    };

    this.services.push(newService);
    this.#saveToDisk();
    return newService;
  }

    updateService(id, updatedData) {
    const index = this.services.findIndex((s) => s.id === Number(id));
    if (index === -1) {
      return { error: `No existe un servicio con id ${id}` };
    }

    const { id: _ignoredId, ...safeData } = updatedData;

    this.services[index] = {
      ...this.services[index],
      ...safeData,
    };

    this.#saveToDisk();
    return this.services[index];
  }

    deleteService(id) {
    const index = this.services.findIndex((s) => s.id === Number(id));
    if (index === -1) {
      return { error: `No existe un servicio con id ${id}` };
    }

    const [deleted] = this.services.splice(index, 1);
    this.#saveToDisk();
    return deleted;
  }
}

export default ServiceManager;