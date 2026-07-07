import type { Metadata } from "next";
import LegalContentPage from "../components/LegalContentPage";

export const metadata: Metadata = {
  title: "Términos y Condiciones | PH PLUS",
  description:
    "Consulta las condiciones generales de compra y uso de los canales digitales de PH PLUS.",
};

export default function TerminosYCondicionesPage() {
  return (
    <LegalContentPage
      title="Términos y Condiciones"
      intro="Estas condiciones orientan la compra, entrega y atención de productos PH PLUS."
      sections={[
        {
          title: "Disponibilidad y cobertura",
          body: "La disponibilidad de productos, costos de envío y tiempos de entrega pueden variar según ciudad, zona y agenda logística.",
        },
        {
          title: "Pedidos y pagos",
          body: "Los pedidos se confirman por los canales oficiales de PH PLUS. Los medios de pago disponibles se informan durante el proceso de compra.",
        },
        {
          title: "Uso del sitio",
          body: "La información del sitio busca orientar al cliente sobre productos, beneficios, puntos de venta y canales de compra. PH PLUS puede actualizar contenidos, precios y condiciones cuando sea necesario.",
        },
      ]}
    />
  );
}
