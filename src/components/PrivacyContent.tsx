export function PrivacyContent() {
  return (
    <div className="space-y-4 text-foreground leading-relaxed">
      <p className="text-sm text-muted-foreground">
        <strong>Última actualización: 16 de septiembre de 2025</strong>
      </p>
      <p className="text-black/90">
        Universitas Services C.A. (&quot;nosotros&quot;) se compromete a
        proteger su privacidad. Esta política de privacidad explica cómo
        gestionamos su información personal cuando utiliza nuestra aplicación
        &quot;Actas de entrega&quot; (&quot;aplicación&quot;).
      </p>

      <h3 className="font-bold text-lg text-primary pt-2">
        1. Información que recopilamos
      </h3>
      <ul className="list-disc list-inside space-y-2 pl-4 text-black/90">
        <li>
          <strong>Información de registro:</strong> Nombre, apellido, correo
          electrónico y número de teléfono.
        </li>
        <li>
          <strong>Información de perfil:</strong> Institución y cargo que
          desempeña.
        </li>
        <li>
          <strong>Contenido del usuario:</strong> Información introducida en los
          formularios para generar las actas.
        </li>
        <li>
          <strong>Información de uso (automática):</strong> Datos técnicos como
          dirección IP o tipo de dispositivo para mejorar el servicio.
        </li>
      </ul>

      <h3 className="font-bold text-lg text-primary pt-2">
        2. Cómo utilizamos su información
      </h3>
      <ul className="list-disc list-inside space-y-2 pl-4 text-black/90">
        <li>
          <strong>Para proveer el servicio:</strong> Crear su cuenta, generar
          sus actas y permitirle acceder a las funcionalidades.
        </li>
        <li>
          <strong>Para comunicarnos con usted:</strong> Enviarle correos de
          activación, recuperación de contraseña, enlaces a sus actas y otras
          notificaciones.
        </li>
        <li>
          <strong>Para ofrecer soporte:</strong> Brindarle asistencia técnica a
          través de correo o WhatsApp.
        </li>
        <li>
          <strong>Para marketing y mejoras:</strong> El consentimiento para
          recibir comunicaciones de marketing se otorga al aceptar los términos
          y condiciones. Utilizamos esta vía para informarle sobre servicios y
          promociones. Puede revocar este consentimiento en cualquier momento.
        </li>
      </ul>

      <h3 className="font-bold text-lg text-primary pt-2">
        3. Almacenamiento y seguridad de datos
      </h3>
      <ul className="list-disc list-inside space-y-2 pl-4 text-black/90">
        <li>
          <strong>Usuarios express (gratuitos):</strong> La información se
          procesa para generar un enlace a un Google Docs, que se envía a su
          correo. Dicha información no se almacena de forma persistente en los
          servidores de la aplicación.
        </li>
        <li>
          <strong>Usuarios pro (de pago):</strong> La información de sus actas
          se almacena en su cuenta para permitirle su gestión. Sus datos pueden
          ser procesados por motores de inteligencia artificial para proveerle
          alertas y asistencia.
        </li>
      </ul>

      <h3 className="font-bold text-lg text-primary pt-2">
        4. Intercambio con terceros
      </h3>
      <p className="text-black/90">
        No vendemos ni alquilamos su información personal. Podemos compartirla
        con:
      </p>
      <ul className="list-disc list-inside space-y-2 pl-4 text-black/90">
        <li>
          <strong>Proveedores de pago:</strong> Para procesar pagos (Stripe,
          PayPal).
        </li>
        <li>
          <strong>Herramientas de productividad:</strong> Utilizamos Google
          Drive para alojar los documentos que usted genera. Su interacción con
          estos documentos puede estar sujeta a las políticas de Google.
        </li>
        <li>
          <strong>Requerimiento legal:</strong> Si es requerido por una orden
          judicial válida.
        </li>
      </ul>

      <h3 className="font-bold text-lg text-primary pt-2">
        5. Derechos del usuario
      </h3>
      <p className="text-black/90">
        Usted tiene derecho a acceder y rectificar su información. También puede
        solicitar la eliminación de su cuenta a través del enlace &quot;Eliminar
        cuenta&quot; en la aplicación. Este proceso eliminará su perfil de
        nuestra plataforma, pero usted conservará el acceso a los documentos
        generados a través de los enlaces de Google Docs enviados a su correo.
      </p>

      <h3 className="font-bold text-lg text-primary pt-2">
        6. Cambios a esta política
      </h3>
      <p className="text-black/90">
        Nos reservamos el derecho de modificar esta política. Le notificaremos
        de cualquier cambio publicando la nueva política en esta página.
      </p>

      <h3 className="font-bold text-lg text-primary pt-2">7. Contacto</h3>
      <p className="text-black/90">
        Si tiene preguntas sobre esta política de privacidad, contáctenos en:
        contacto@universitas.legal
      </p>
    </div>
  );
}
