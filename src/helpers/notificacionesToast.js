import toast from "react-hot-toast";

export default class Notificaciones {
  static notificacion(mensaje) {
    toast(mensaje, {
      icon: "❗",
      style: {
        borderRadius: "10px",
        background: "#FF6B6B", // Rojo suave
        color: "#fff",
        border: "1px solid #FF5252",
      },
      position: "bottom-left",
      // duration: 3000, // Duración en milisegundos (opcional)
    });
  }
}
