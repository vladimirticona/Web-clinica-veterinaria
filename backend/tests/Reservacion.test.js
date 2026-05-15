const Reservacion = require('../src/domain/entities/Reservacion');

describe('Reservacion Entity', () => {
  describe('Constructor', () => {
    test('debe crear una reservación con todos los parámetros', () => {
      const reservacionData = {
        id: 1,
        nombre_cliente: 'Juan Pérez',
        telefono: '123456789',
        email: 'juan@example.com',
        nombre_mascota: 'Firulais',
        especie: 'Perro',
        motivo_consulta: 'Vacunación',
        fecha_solicitada: '2023-10-01',
        hora_solicitada: '10:00',
        tipo_cita: 'consulta',
        estado: 'pendiente',
        producto_adicional_id: 2,
        cantidad_producto: 1
      };
      const reservacion = new Reservacion(reservacionData);
      expect(reservacion.id).toBe(1);
      expect(reservacion.nombre_cliente).toBe('Juan Pérez');
      expect(reservacion.especie).toBe('perro');
      expect(reservacion.estado).toBe('pendiente');
    });

    test('debe asignar estado por defecto si no se proporciona', () => {
      const reservacionData = {
        id: 1,
        nombre_cliente: 'Juan Pérez',
        telefono: '123456789',
        email: 'juan@example.com',
        nombre_mascota: 'Firulais',
        especie: 'Perro',
        motivo_consulta: 'Vacunación',
        fecha_solicitada: '2023-10-01',
        hora_solicitada: '10:00',
        tipo_cita: 'consulta'
      };
      const reservacion = new Reservacion(reservacionData);
      expect(reservacion.estado).toBe('pendiente');
    });
  });

  describe('validar', () => {
    test('debe pasar validación con datos correctos', () => {
      const reservacion = new Reservacion({
        id: 1,
        nombre_cliente: 'Juan Pérez',
        telefono: '123456789',
        email: 'juan@example.com',
        nombre_mascota: 'Firulais',
        especie: 'Perro',
        motivo_consulta: 'Vacunación',
        fecha_solicitada: '2023-10-01',
        hora_solicitada: '10:00',
        tipo_cita: 'consulta'
      });
      expect(() => reservacion.validar()).not.toThrow();
    });

    test('debe lanzar error si faltan campos requeridos', () => {
      const reservacion = new Reservacion({
        id: 1,
        nombre_cliente: '',
        telefono: '123456789',
        email: 'juan@example.com',
        nombre_mascota: 'Firulais',
        especie: 'Perro',
        motivo_consulta: 'Vacunación',
        fecha_solicitada: '2023-10-01',
        hora_solicitada: '10:00',
        tipo_cita: 'consulta'
      });
      expect(() => reservacion.validar()).toThrow('Faltan campos requeridos para la reservacion');
    });
  });

  describe('validarEstado', () => {
    test('debe pasar validación con estado válido', () => {
      const reservacion = new Reservacion({ id: 1, nombre_cliente: 'Juan', telefono: '123', email: 'a@b.com', nombre_mascota: 'Firu', especie: 'Perro', motivo_consulta: 'Vac', fecha_solicitada: '2023-01-01', hora_solicitada: '10:00', tipo_cita: 'consulta' });
      expect(() => reservacion.validarEstado('confirmada')).not.toThrow();
    });

    test('debe lanzar error con estado inválido', () => {
      const reservacion = new Reservacion({ id: 1, nombre_cliente: 'Juan', telefono: '123', email: 'a@b.com', nombre_mascota: 'Firu', especie: 'Perro', motivo_consulta: 'Vac', fecha_solicitada: '2023-01-01', hora_solicitada: '10:00', tipo_cita: 'consulta' });
      expect(() => reservacion.validarEstado('invalido')).toThrow('Estado invalido. Debe ser: pendiente, confirmada, cancelada o reprogramar');
    });
  });

  describe('confirmar', () => {
    test('debe cambiar estado a confirmada', () => {
      const reservacion = new Reservacion({ id: 1, nombre_cliente: 'Juan', telefono: '123', email: 'a@b.com', nombre_mascota: 'Firu', especie: 'Perro', motivo_consulta: 'Vac', fecha_solicitada: '2023-01-01', hora_solicitada: '10:00', tipo_cita: 'consulta' });
      reservacion.confirmar();
      expect(reservacion.estado).toBe('confirmada');
    });
  });

  describe('cancelar', () => {
    test('debe cambiar estado a cancelada', () => {
      const reservacion = new Reservacion({ id: 1, nombre_cliente: 'Juan', telefono: '123', email: 'a@b.com', nombre_mascota: 'Firu', especie: 'Perro', motivo_consulta: 'Vac', fecha_solicitada: '2023-01-01', hora_solicitada: '10:00', tipo_cita: 'consulta' });
      reservacion.cancelar();
      expect(reservacion.estado).toBe('cancelada');
    });
  });

  describe('reprogramar', () => {
    test('debe reprogramar correctamente', () => {
      const reservacion = new Reservacion({ id: 1, nombre_cliente: 'Juan', telefono: '123', email: 'a@b.com', nombre_mascota: 'Firu', especie: 'Perro', motivo_consulta: 'Vac', fecha_solicitada: '2023-01-01', hora_solicitada: '10:00', tipo_cita: 'consulta' });
      reservacion.reprogramar('2023-10-02', '11:00');
      expect(reservacion.fecha_solicitada).toBe('2023-10-02');
      expect(reservacion.hora_solicitada).toBe('11:00');
      expect(reservacion.estado).toBe('reprogramar');
    });

    test('debe lanzar error si faltan fecha o hora', () => {
      const reservacion = new Reservacion({ id: 1, nombre_cliente: 'Juan', telefono: '123', email: 'a@b.com', nombre_mascota: 'Firu', especie: 'Perro', motivo_consulta: 'Vac', fecha_solicitada: '2023-01-01', hora_solicitada: '10:00', tipo_cita: 'consulta' });
      expect(() => reservacion.reprogramar('', '11:00')).toThrow('Fecha y hora nuevas son requeridas para reprogramar');
    });
  });
});