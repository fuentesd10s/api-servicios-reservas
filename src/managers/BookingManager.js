import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { AppError } from '../errors/AppError.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_PATH = path.join(__dirname, '../data/bookings.json');

const REQUIRED_FIELDS = ['clientName', 'clientEmail', 'date', 'time'];

class BookingManager {
  #serviceManager;

  constructor(serviceManager) {
    this.#serviceManager = serviceManager;
    this.bookings = this.#loadFromDisk();
  }

  #loadFromDisk() {
    try {
      const raw = fs.readFileSync(DATA_PATH, 'utf-8');
      return JSON.parse(raw);
    } catch (error) {
      if (error.code === 'ENOENT') {
        return [];
      }
      throw new Error(`No se pudo leer ${DATA_PATH}: ${error.message}`);
    }
  }

  #saveToDisk() {
    try {
      fs.writeFileSync(DATA_PATH, JSON.stringify(this.bookings, null, 2), 'utf-8');
    } catch (error) {
      throw new Error(`No se pudo guardar ${DATA_PATH}: ${error.message}`);
    }
  }

  #generateId() {
    return this.bookings.length > 0
      ? Math.max(...this.bookings.map((b) => b.id)) + 1
      : 1;
  }

  createBooking(bookingData) {
    const missing = REQUIRED_FIELDS.filter(
      (field) =>
        bookingData[field] === undefined ||
        bookingData[field] === null ||
        bookingData[field] === ''
    );

    if (missing.length > 0) {
      throw new AppError(`Faltan campos requeridos: ${missing.join(', ')}`, 400);
    }

    const newBooking = {
      id: this.#generateId(),
      clientName: bookingData.clientName,
      clientEmail: bookingData.clientEmail,
      date: bookingData.date,
      time: bookingData.time,
      status: bookingData.status || 'pending',
      services: [],
    };

    this.bookings.push(newBooking);
    this.#saveToDisk();
    return newBooking;
  }

  getBookingById(id) {
    const booking = this.bookings.find((b) => b.id === Number(id));
    if (!booking) {
      throw new AppError(`No existe una reserva con id ${id}`, 404);
    }
    return booking;
  }

  addServiceToBooking(bookingId, serviceId) {
    const booking = this.getBookingById(bookingId);
    this.#serviceManager.getServiceById(serviceId);

    const sid = Number(serviceId);
    const item = booking.services.find((s) => s.service === sid);

    if (item) {
      item.quantity += 1;
    } else {
      booking.services.push({ service: sid, quantity: 1 });
    }

    this.#saveToDisk();
    return booking;
  }
}

export default BookingManager;