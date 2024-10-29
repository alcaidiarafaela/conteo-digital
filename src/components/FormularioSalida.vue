<template>
  <section id="formulario-salida" v-show="isVisible">
    <div class="container">
      <form @submit.prevent="handleSubmit">
        <h2 class="fw-bold">Tipo de Salida</h2>
        <label for="tipo-salida1" class="form-label">Seleccionar</label>
        
        <select v-model="tipoSalida" id="tipo-salida1" class="form-select mb-3" required>
          <option disabled value="">Elige una opción del menú</option>
          <option value="1">Audiencia</option>
          <option value="2">Médico</option>
          <option value="3">Mantenimiento</option>
          <option value="4">Traslado</option>
          <option value="5">Libertad</option>
        </select>
        
        <div class="mb-2">
          <label for="nombre" class="form-label label-small">Nombre y Apellido:</label>
          <input type="text" v-model="nombre" id="nombre" class="form-control" required />
        </div>

        <div class="mb-2">
          <label for="fecha-egreso" class="form-label label-small">Fecha y hora de Salida:</label>
          <input type="datetime-local" v-model="fechaEgreso" id="fecha-egreso" class="form-control" required />
        </div>

        <div class="form-check form-switch mb-3">
          <input class="form-check-input" type="checkbox" v-model="registrarHuella" id="flexSwitchCheckDefault1" />
          <label class="form-check-label" for="flexSwitchCheckDefault1">Registrar la huella dactilar del interno</label>
        </div>
        
        <button id="button-salida" type="submit" class="btn btn-primary w-100 mt-3">Enviar</button>
      </form>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    isVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      tipoSalida: '',
      nombre: '',
      fechaEgreso: '',
      registrarHuella: false,
    };
  },
  methods: {
    handleSubmit() {
      // Validar que los campos estén llenos
      if (!this.tipoSalida || !this.nombre || !this.fechaEgreso) {
        alert('Por favor, completa todos los campos.');
        return;
      }

      // Emitir los datos al componente padre
      this.$emit('submitSalida', {
        tipoSalida: this.tipoSalida,
        nombre: this.nombre,
        fechaEgreso: this.fechaEgreso,
        registrarHuella: this.registrarHuella,
      });

      // Limpiar el formulario después de enviar
      this.resetForm();
    },
    resetForm() {
      this.tipoSalida = '';
      this.nombre = '';
      this.fechaEgreso = '';
      this.registrarHuella = false;
    },
  },
};
</script>

<style scoped>
.container {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  max-width: 600px;
}

h2 {
  margin-bottom: 20px;
}

.form-label {
  margin-bottom: 5px;
  font-weight: bold;
  color: #555;
  text-align: left;
  display: block; 
}

.form-check {
  margin-bottom: 15px;
}
</style>
