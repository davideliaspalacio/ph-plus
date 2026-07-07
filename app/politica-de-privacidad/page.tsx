import type { Metadata } from "next";
import LegalContentPage from "../components/LegalContentPage";

export const metadata: Metadata = {
  title: "Política de Privacidad | PH PLUS",
  description:
    "Consulta cómo PH PLUS trata los datos personales recibidos en sus canales digitales.",
};

export default function PoliticaDePrivacidadPage() {
  return (
    <LegalContentPage
      title="Política de Privacidad"
      intro="Cuidamos tus datos personales con la misma seriedad con la que cuidamos cada entrega."
      sections={[
        {
          title: "Datos que podemos recibir",
          body: "Podemos recibir tu nombre, teléfono, correo, dirección de entrega y datos relacionados con tus pedidos cuando nos contactas por la web, WhatsApp u otros canales oficiales.",
        },
        {
          title: "Uso de la información",
          body: "Usamos esta información para responder tus solicitudes, coordinar entregas, procesar pedidos, prestar soporte y mejorar la experiencia de compra de PH PLUS.",
        },
        {
          title: "Canales de contacto",
          body: "Si necesitas consultar, actualizar o eliminar tus datos, puedes escribirnos a info@aguaphplus.com o al WhatsApp +57 3234392470.",
        },
      ]}
    />
  );
}
