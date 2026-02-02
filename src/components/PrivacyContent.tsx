export function PrivacyContent() {
  return (
    <div className="space-y-4 text-foreground leading-relaxed">
      <p className="text-sm text-muted-foreground">
        <strong>Última actualización: Diciembre de 2025</strong>
      </p>
      <p className="text-black/90">
        En el equipo de <strong>Acta de Entrega</strong>, valoramos su confianza
        y nos comprometemos a proteger la información confidencial de los
        usuarios que utilizan nuestra plataforma. Esta política detalla nuestras
        prácticas de recolección, uso y protección de datos para garantizar una
        gestión segura y transparente.
      </p>

      <h3 className="font-bold text-lg text-primary pt-2">
        1. Información que recopilamos
      </h3>
      <p className="text-black/90">
        Para prestar nuestros servicios de asistencia técnica y legal,
        recopilamos los siguientes tipos de datos:
      </p>
      <ul className="list-disc list-inside space-y-2 pl-4 text-black/90">
        <li>
          <strong>Datos de registro (información personal):</strong> Nombre,
          apellido, correo electrónico (institucional o personal), número de
          teléfono, cargo, institución y contraseña (almacenada de forma
          encriptada).
        </li>
        <li>
          <strong>
            Datos operativos del acta (información Institucional):
          </strong>{' '}
          Datos necesarios para estructurar el documento, tales como
          identificación del organismo, motivo de la entrega, identificación de
          testigos y auditores, y declaraciones de conformidad sobre la
          existencia de anexos (inventarios, nóminas, estados de cuenta, etc.).
          La Plataforma procesa la declaración de existencia de estos
          documentos, mas no necesariamente el contenido detallado de los
          mismos.
        </li>
        <li>
          <strong>Datos técnicos y de uso:</strong> Dirección IP, tipo de
          dispositivo, sistema operativo, registros de actividad (logs) y
          preferencias de uso.
        </li>
        <li>
          <strong>Interacciones con IA:</strong> Historial de las consultas
          realizadas al módulo <strong>Consultor IA</strong> para fines de
          soporte y mejora de respuestas.
        </li>
      </ul>

      <h3 className="font-bold text-lg text-primary pt-2">
        2. Finalidad del Tratamiento
      </h3>
      <p className="text-black/90">
        Sus datos son procesados exclusivamente para los siguientes fines
        legítimos:
      </p>
      <ul className="list-disc list-inside space-y-2 pl-4 text-black/90">
        <li>
          <strong>Operatividad:</strong> Generar, previsualizar y exportar las
          actas de entrega y los reportes de cumplimiento.
        </li>
        <li>
          <strong>Gestión administrativa:</strong> Validar accesos, gestionar la
          vigencia de la suscripción y proveer acceso a todas las funciones de
          la plataforma.
        </li>
        <li>
          <strong>Mejora continua (IA):</strong> Analizar las interacciones con
          el <strong>Consultor IA</strong> para reentrenar modelos, corregir
          errores de respuesta y elevar la calidad del asesoramiento
          técnico-legal.
        </li>
        <li>
          <strong>Soporte y seguridad:</strong> Enviar códigos de verificación,
          recuperar accesos, notificar cambios en el servicio y responder
          solicitudes de soporte técnico.
        </li>
      </ul>

      <h3 className="font-bold text-lg text-primary pt-2">
        3. Infraestructura tecnológica y transferencia internacional
      </h3>
      <p className="text-black/90">
        Para garantizar la estabilidad y seguridad de su información, utilizamos
        proveedores de infraestructura líderes a nivel mundial. Al utilizar la
        Plataforma, el Usuario consiente expresamente la transferencia de datos
        a:
      </p>

      <div className="overflow-x-auto my-4">
        <table className="min-w-full text-left text-sm border-collapse border border-gray-300 text-black/90">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2 font-bold">
                Servicio
              </th>
              <th className="border border-gray-300 px-4 py-2 font-bold">
                Proveedor
              </th>
              <th className="border border-gray-300 px-4 py-2 font-bold">
                Finalidad del tratamiento
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 px-4 py-2 font-bold">
                Hosting y Base de Datos
              </td>
              <td className="border border-gray-300 px-4 py-2">Render</td>
              <td className="border border-gray-300 px-4 py-2">
                Alojamiento seguro del código y base de datos con altos
                estándares de cifrado.
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2 font-bold">
                Inteligencia Artificial
              </td>
              <td className="border border-gray-300 px-4 py-2">Google Cloud</td>
              <td className="border border-gray-300 px-4 py-2">
                Procesamiento de lenguaje natural para el Consultor IA y
                análisis normativo.
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2 font-bold">
                Correos Electrónicos
              </td>
              <td className="border border-gray-300 px-4 py-2">Resend</td>
              <td className="border border-gray-300 px-4 py-2">
                Motor de envío de correos transaccionales (entrega de actas y
                alertas de lapsos).
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2 font-bold">
                Almacenamiento de Archivos
              </td>
              <td className="border border-gray-300 px-4 py-2">
                Google Cloud Storage
              </td>
              <td className="border border-gray-300 px-4 py-2">
                Repositorio seguro de leyes, gacetas y documentos de contexto
                legal.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="text-black/90">
        <strong>Autenticación:</strong> La plataforma utiliza un sistema propio
        de seguridad basado en tokens encriptados. No compartimos sus
        credenciales con redes sociales ni terceros ajenos al servicio.
      </p>

      <h3 className="font-bold text-lg text-primary pt-2">
        4. Retención y Eliminación de Datos
      </h3>
      <ul className="list-disc list-inside space-y-2 pl-4 text-black/90">
        <li>
          <strong>Periodo de vigencia:</strong> Los datos se conservan de forma
          íntegra durante toda la vigencia de su suscripción para permitir la
          edición y consulta constante.
        </li>
        <li>
          <strong>Borrado definitivo:</strong> Tras el periodo de 30 días
          continuo de la eliminación de una cuenta, y como medida de protección
          a la privacidad del funcionario, los datos son eliminados
          permanentemente de nuestros servidores principales y respaldos. Es
          responsabilidad del Usuario descargar sus actas antes de este proceso.
        </li>
      </ul>

      <h3 className="font-bold text-lg text-primary pt-2">
        5. Privacidad en IA (Revisión técnica)
      </h3>
      <p className="text-black/90">
        Para garantizar la precisión de las respuestas legales emitidas por la
        plataforma, el Usuario acepta que:
      </p>
      <ul className="list-disc list-inside space-y-2 pl-4 text-black/90">
        <li>
          Las conversaciones con el <strong>Consultor IA</strong> pueden ser
          revisadas por personal técnico especializado con el fin único de
          mejorar la precisión del modelo.
        </li>
        <li>
          <strong>Advertencia de seguridad:</strong> Se recomienda no ingresar
          datos sensibles como claves bancarias, secretos de estado o
          información clasificada en el chat del Consultor IA; su uso debe
          limitarse a consultas sobre la normativa de actas de entrega.
        </li>
      </ul>

      <h3 className="font-bold text-lg text-primary pt-2">
        6. Seguridad de la información
      </h3>
      <p className="text-black/90">
        Implementamos medidas técnicas y organizativas robustas, incluyendo:
      </p>
      <ul className="list-disc list-inside space-y-2 pl-4 text-black/90">
        <li>
          Encriptado de contraseñas mediante algoritmos de <em>hashing</em> de
          alta seguridad.
        </li>
        <li>
          Tránsito de datos cifrado mediante protocolo{' '}
          <strong>HTTPS/TLS 1.2</strong> o superior.
        </li>
        <li>
          Controles de acceso estrictos al entorno administrativo de la
          plataforma.
        </li>
      </ul>
      <p className="text-black/90 italic mt-2">
        Nota: Dado que el envío final de las actas se realiza vía correo
        electrónico, el equipo de soporte no puede garantizar la seguridad del
        servidor de correo receptor propiedad del Usuario.
      </p>

      <h3 className="font-bold text-lg text-primary pt-2">
        7. Derechos y contacto
      </h3>
      <p className="text-black/90">
        El Usuario puede ejercer sus derechos de Acceso, Rectificación,
        Cancelación y Oposición respecto a sus datos personales enviando una
        solicitud a través de los canales oficiales de soporte técnico de la
        aplicación. El equipo de <strong>Acta de Entrega</strong> responderá a
        dichas solicitudes en los plazos establecidos por la normativa vigente.
      </p>
    </div>
  );
}
