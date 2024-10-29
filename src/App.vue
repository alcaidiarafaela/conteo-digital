<template>
  <div id="app">
    <div class="overlay"></div>
    <IngresoGuardia
      v-if="currentSection === 'ingreso-guardia'"
      :isVisible="currentSection === 'ingreso-guardia'" 
      @next="goToSection('selector-home')"
    />
    <SelectorHome
      v-if="currentSection === 'selector-home'"
      :isVisible="currentSection === 'selector-home'"
      @goToForm="goToForm"
      @goToList="goToList" 
    />
    <FormularioIngreso
      v-if="currentSection === 'formulario-ingreso'"
      :isVisible="currentSection === 'formulario-ingreso'"
      @nuevoInterno="agregarInterno"
      @next="goToSection('visualizacion-datos')"
    />
    <FormularioSalida
      v-if="currentSection === 'formulario-salida'"
      :isVisible="currentSection === 'formulario-salida'"
      @submitSalida="handleSalidaSubmit"
      @next="goToSection('visualizacion-datos')"
    />
    <VisualizacionDatos
      v-if="currentSection === 'visualizacion-datos'"
      :isVisible="currentSection === 'visualizacion-datos'"
      :internos="internosList"
      :salida="salida"  
      @next="goToSection('listado-internos')"
    />
    <ListadoInternos
      v-if="currentSection === 'listado-internos'"
      :isVisible="currentSection === 'listado-internos'"
      :internos="internosList"
      @next="goToSection('selector-home')"
      @goToSelectorHome="goToSection('selector-home')"
    />

  </div>
</template>


<script>
import axios from 'axios';
import IngresoGuardia from './components/IngresoGuardia.vue';
import SelectorHome from './components/SelectorHome.vue';
import FormularioIngreso from './components/FormularioIngreso.vue';
import FormularioSalida from './components/FormularioSalida.vue';
import VisualizacionDatos from './components/VisualizacionDatos.vue';
import ListadoInternos from './components/ListadoInternos.vue';

export default {
  components: {
    IngresoGuardia,
    SelectorHome,
    FormularioIngreso,
    FormularioSalida,
    VisualizacionDatos,
    ListadoInternos,
  },
  data() {
    return {
      currentSection: 'ingreso-guardia',
      internosList: [],
      salida: null,
      egresosList: [], // Lista para los egresos
    };
  },
  methods: {
    goToSection(section) {
      this.currentSection = section;
    },

    async fetchInternos() {
      try {
        const response = await axios.get('http://localhost:3000/internos');
        this.internosList = response.data;
      } catch (error) {
        console.error('Error al obtener los internos:', error);
      }
    },

    goToList() {
      this.fetchInternos();
      this.goToSection('listado-internos');
    },

    goToForm(tipoEntrada) {
      if (tipoEntrada === '1') {
        this.goToSection('formulario-ingreso');
      } else if (tipoEntrada === '2') {
        this.goToSection('formulario-salida');
      }
    },

    agregarInterno(nuevoInterno) {
      this.internosList.push(nuevoInterno);
      this.goToSection('visualizacion-datos');
    },

    handleSalidaSubmit(datos) {
      const { tipoSalida, nombre, fechaEgreso } = datos;
      this.salida = datos;

      // Mueve el interno a la lista de egresos si es "Libertad" o "Traslado"
      if (tipoSalida === '4' || tipoSalida === '5') {
        const internoIndex = this.internosList.findIndex(interno => interno.nombre === nombre);
        if (internoIndex !== -1) {
          const [interno] = this.internosList.splice(internoIndex, 1); // Remueve de la lista de internos
          this.egresosList.push({ ...interno, fechaEgreso }); // Agrega a la lista de egresos
        }
      }
    },

    formatDate(dateString) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('es-ES', options);
    },
  },
  mounted() {
    this.fetchInternos(); // Llama a la función al montar el componente
  },
};
</script>

<style>
/* Agrega aquí el CSS global si es necesario */
</style>
