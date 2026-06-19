const Reservacion = require('../../src/domain/entities/Reservacion');

describe('Reservacion', () => {
  const datosPrueba = {
    nombre_cliente: 'Juan Perez',
    telefono: '999888777',
    email: 'juan@gmail.com',
    nombre_mascota: 'Firulais',
    especie: 'Perro',
    motivo_consulta: 'Consulta general',
    fecha_solicitada: '2024-06-01',
    hora_solicitada: '10:00',
    tipo_cita: 'consulta'
  };

  test('CP05 - crear reservacion con datos correctos', () => {
    const reservacion = new Reservacion(datosPrueba);
    expect(reservacion.nombre_cliente).toBe('Juan Perez');
  });

  test('CP06 - crear reservacion sin nombre cliente debe lanzar error', () => {
    const reservacion = new Reservacion({ ...datosPrueba, nombre_cliente: null });
    expect(() => reservacion.validar()).toThrow('Faltan campos requeridos');
  });

  test('CP07 - estado inicial debe ser pendiente', () => {
    const reservacion = new Reservacion(datosPrueba);
    expect(reservacion.estado).toBe('pendiente');
  });

  test('CP08 - estado invalido debe lanzar error', () => {
    const reservacion = new Reservacion(datosPrueba);
    expect(() => reservacion.validarEstado('invalido')).toThrow('Estado invalido');
  });

  test('CP09 - estado valido confirmada no debe lanzar error', () => {
    const reservacion = new Reservacion(datosPrueba);
    expect(() => reservacion.validarEstado('confirmada')).not.toThrow();
  });

  test('CP - especie debe guardarse en minusculas en reservacion', () => {
    const reservacion = new Reservacion({ ...datosPrueba, especie: 'PERRO' });
    expect(reservacion.especie).toBe('perro');
  });

  test('CP - estado valido pendiente no debe lanzar error', () => {
    const reservacion = new Reservacion(datosPrueba);
    expect(() => reservacion.validarEstado('pendiente')).not.toThrow();
  });

  test('CP - estado valido cancelada no debe lanzar error', () => {
    const reservacion = new Reservacion(datosPrueba);
    expect(() => reservacion.validarEstado('cancelada')).not.toThrow();
  });

  test('CP - estado valido reprogramar no debe lanzar error', () => {
    const reservacion = new Reservacion(datosPrueba);
    expect(() => reservacion.validarEstado('reprogramar')).not.toThrow();
  });
});