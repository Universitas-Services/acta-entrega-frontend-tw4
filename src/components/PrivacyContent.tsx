export function PrivacyContent() {
  return (
    <div className="space-y-4 text-foreground leading-relaxed">
      <p className="text-sm text-muted-foreground">
        <strong>Última actualización: septiembre de 2025</strong>
      </p>
      <p className="text-black/90">
        En <strong>Universitas Services C.A.</strong>, valoramos su confianza y
        nos comprometemos a proteger la información confidencial de los usuarios
        que utilizan nuestra aplicación &quot;Actas de entrega&quot;. Esta
        política detalla nuestras prácticas de recolección, uso y protección de
        datos.
      </p>

      <h3 className="font-bold text-lg text-primary pt-2">
        1. Información que recopilamos
      </h3>
      <p className="text-black/90">
        Para prestar nuestros servicios, recopilamos diferentes tipos de
        información:
      </p>
      <ul className="list-disc list-inside space-y-2 pl-4 text-black/90">
        <li>
          <strong>Datos de registro (información personal):</strong> Nombre,
          apellido, correo electrónico institucional o personal, número de
          teléfono, cargo, institución y contraseña (almacenada encriptada).
        </li>
        <li>
          <strong>
            Datos operativos del acta (información institucional):
          </strong>{' '}
          Datos necesarios para estructurar el documento, tales como:
          identificación del organismo, motivo de la entrega, datos de
          identificación de testigos y auditores, y{' '}
          <strong>declaraciones de conformidad</strong> sobre la existencia de
          anexos administrativos (ej: confirmación de posesión de inventarios,
          nóminas o estados de cuenta, sin que la Plataforma procese
          necesariamente el contenido detallado de estos documentos).
        </li>
        <li>
          <strong>Datos de uso y técnicos:</strong> Dirección IP, tipo de
          dispositivo, sistema operativo, registros de actividad (logs) y
          preferencias de idioma.
        </li>
        <li>
          <strong>Interacciones con IA:</strong> Historial completo de las
          consultas realizadas al módulo &quot;Consultor IA&quot;.
        </li>
      </ul>

      <h3 className="font-bold text-lg text-primary pt-2">
        2. Finalidad del tratamiento
      </h3>
      <p className="text-black/90">
        Sus datos son procesados exclusivamente para los siguientes fines
        legítimos:
      </p>
      <ol className="list-decimal list-inside space-y-2 pl-4 text-black/90">
        <li>
          <strong>Operatividad:</strong> Generar, previsualizar y exportar las
          actas de entrega y reportes asociados.
        </li>
        <li>
          <strong>Gestión administrativa:</strong> Validar pagos, gestionar la
          vigencia de la suscripción PRO y proveer acceso a funciones
          exclusivas.
        </li>
        <li>
          <strong>Mejora continua (IA):</strong> Analizar las interacciones con
          el Consultor IA para reentrenar modelos, corregir errores de respuesta
          y mejorar la calidad del asesoramiento técnico.
        </li>
        <li>
          <strong>Soporte y seguridad:</strong> Enviar códigos de verificación,
          recuperar accesos, notificar sobre cambios en el servicio y responder
          tickets de soporte.
        </li>
      </ol>

      <h3 className="font-bold text-lg text-primary pt-2">
        3. Infraestructura tecnológica y transferencia internacional
      </h3>
      <p className="text-black/90">
        Para garantizar la estabilidad y seguridad, utilizamos proveedores de
        infraestructura líderes a nivel mundial. Al utilizar la Plataforma, el
        Usuario consiente expresamente la{' '}
        <strong>transferencia internacional de datos</strong> a:
      </p>

      <div className="overflow-x-auto pt-2">
        <table className="w-full text-sm text-left border-collapse border border-g2">
          <thead className="bg-g1 text-black/90">
            <tr>
              <th className="border border-g2 p-2">Servicio</th>
              <th className="border border-g2 p-2">Proveedor</th>
              <th className="border border-g2 p-2">Ubicación</th>
              <th className="border border-g2 p-2">
                Finalidad del tratamiento
              </th>
            </tr>
          </thead>
          <tbody className="text-black/90">
            <tr>
              <td className="border border-g2 p-2 font-medium">
                Hosting y base de datos
              </td>
              <td className="border border-g2 p-2">Render</td>
              <td className="border border-g2 p-2">EE.UU. / Alemania</td>
              <td className="border border-g2 p-2">
                Alojamiento seguro del código y base de datos PostgreSQL con
                datos estructurados.
              </td>
            </tr>
            <tr>
              <td className="border border-g2 p-2 font-medium">
                Inteligencia artificial
              </td>
              <td className="border border-g2 p-2">Google Cloud (Vertex AI)</td>
              <td className="border border-g2 p-2">EE.UU.</td>
              <td className="border border-g2 p-2">
                Procesamiento de lenguaje natural para el Consultor IA y
                análisis de textos legales.
              </td>
            </tr>
            <tr>
              <td className="border border-g2 p-2 font-medium">
                Correos electrónicos
              </td>
              <td className="border border-g2 p-2">Resend</td>
              <td className="border border-g2 p-2">EE.UU.</td>
              <td className="border border-g2 p-2">
                Motor de envío de correos transaccionales (entrega de actas y
                alertas).
              </td>
            </tr>
            <tr>
              <td className="border border-g2 p-2 font-medium">
                Almacenamiento archivos
              </td>
              <td className="border border-g2 p-2">Google Cloud Storage</td>
              <td className="border border-g2 p-2">EE.UU.</td>
              <td className="border border-g2 p-2">
                Repositorio de leyes, gacetas y documentos de contexto.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="text-black/90 pt-4">
        <strong>Autenticación:</strong> Universitas utiliza un sistema propio
        (Self-Hosted) con tokens JWT. No compartimos credenciales con redes
        sociales externas.
      </p>

      <h3 className="font-bold text-lg text-primary pt-2">
        4. Retención y eliminación de datos
      </h3>
      <ul className="list-disc list-inside space-y-2 pl-4 text-black/90">
        <li>
          <strong>Usuarios versión Express:</strong> Aunque el servicio es de
          uso inmediato, conservamos una copia de seguridad operativa de los
          datos estructurados por un periodo máximo de{' '}
          <strong>noventa (90) días</strong> continuos con fines de soporte
          técnico. Posteriormente, se procede a su eliminación o anonimización
          irreversible.
        </li>
        <li>
          <strong>Usuarios versión PRO:</strong> Los datos se conservan durante
          toda la vigencia de la suscripción.
          <ul className="list-[circle] list-inside pl-8 pt-1 space-y-1">
            <li>
              <strong>Vencimiento:</strong> Al finalizar la suscripción, los
              datos entran en un estado de retención (&quot;solo lectura&quot;)
              por <strong>30 días</strong>.
            </li>
            <li>
              <strong>Borrado definitivo:</strong> Tras el periodo de gracia,
              los datos son eliminados permanentemente de nuestros servidores
              principales y respaldos.
            </li>
          </ul>
        </li>
      </ul>

      <h3 className="font-bold text-lg text-primary pt-2">
        5. Privacidad en IA (Human in the loop)
      </h3>
      <p className="text-black/90">
        Para garantizar la calidad de nuestras respuestas legales, el Usuario
        acepta que:
      </p>
      <ol className="list-decimal list-inside space-y-2 pl-4 text-black/90">
        <li>
          Las conversaciones con el &quot;Consultor IA&quot; pueden ser{' '}
          <strong>monitoreadas y revisadas por personal humano</strong> de
          Universitas.
        </li>
        <li>
          Dichas revisiones tienen fines estrictamente técnicos y de mejora del
          producto.
        </li>
        <li>
          <strong>Advertencia:</strong> Se recomienda{' '}
          <strong>no ingresar</strong> datos personales sensibles, secretos de
          estado, claves bancarias o información clasificada en el chat del
          Consultor IA.
        </li>
      </ol>

      <h3 className="font-bold text-lg text-primary pt-2">
        6. Seguridad de la información
      </h3>
      <p className="text-black/90">
        Implementamos medidas de seguridad técnicas y organizativas, incluyendo:
      </p>
      <ul className="list-disc list-inside space-y-2 pl-4 text-black/90">
        <li>
          Encriptado de contraseñas mediante algoritmos de hashing robustos
          (Bcrypt).
        </li>
        <li>
          Tránsito de datos cifrado mediante protocolo HTTPS/TLS 1.2 o superior.
        </li>
        <li>Controles de acceso estrictos al backend administrativo.</li>
      </ul>
      <p className="text-black/90 pt-2">
        Sin embargo, dado que el envío final de las actas se realiza vía correo
        electrónico, Universitas no puede garantizar la seguridad del servidor
        de correo del propio usuario.
      </p>

      <h3 className="font-bold text-lg text-primary pt-2">
        7. Derechos ARCO y contacto
      </h3>
      <p className="text-black/90">
        El Usuario puede ejercer sus derechos de{' '}
        <strong>Acceso, Rectificación, Cancelación y Oposición</strong> respecto
        a sus datos personales enviando una solicitud formal a
        contacto@universitas.legal. Universitas responderá en los plazos
        establecidos por la legislación vigente.
      </p>
    </div>
  );
}
