import type { Metadata } from "next";
import LegalContentPage from "../components/LegalContentPage";

export const metadata: Metadata = {
  title: "Política de Cambios | PH PLUS",
  description:
    "Consulta las condiciones generales para cambios o novedades con productos PH PLUS.",
};

export default function PoliticaDeCambiosPage() {
  return (
    <LegalContentPage
      title="Política de Cambios"
      intro="Queremos que recibas tus productos PH PLUS en buen estado y con una atención clara."
      sections={[
        {
          title: "Reporte de novedades",
          body: "Si recibes un producto con alguna novedad, contáctanos por WhatsApp o correo indicando tu pedido, dirección y evidencia del caso.",
        },
        {
          title: "Revisión del caso",
          body: "Nuestro equipo revisará la solicitud y te informará los pasos a seguir según el tipo de producto, estado de entrega y cobertura.",
        },
        {
          title: "Canales oficiales",
          body: "Para cambios o soporte, escríbenos a info@aguaphplus.com o al WhatsApp +57 3234392470.",
        },
      ]}
    />
  );
}
