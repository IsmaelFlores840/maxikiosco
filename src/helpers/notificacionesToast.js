import toast from "react-hot-toast";

export default class Notifiaciones {
  static notificacion(mensaje) {
    toast(mensaje, {
      icon: "❗",
      style: {
        borderRadius: "10px",
        background: "#008185",
        color: "#fff",
      },
      position: "bottom-right",
    });
  }
}
