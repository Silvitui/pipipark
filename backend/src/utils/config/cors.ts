export const options = {
    origin: "http://localhost:4200", 
    credentials: true, // Permite enviar cookies con las solicitudes
    methods: ["GET", "POST", "PUT", "DELETE"], // Métodos permitidos
    allowedHeaders: ["Content-Type", "Authorization"] // Headers permitidos
  }