import React, { useState, useRef } from 'react';
import './CommandPrompt.css';

const CommandPrompt = () => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([
    'Bienvenido a nuestro servicio de atención al cliente.'
  ]);
  const inputRef = useRef(null);

  const detectIntention = (message) => {
    const lowerMessage = message.toLowerCase();

    const intentions = [
        {
          keywords: ['precio', 'costo', 'valor', 'tarifa'],
          response: 'Nuestros servicios de desarrollo de software comienzan desde $500 mensuales, con planes personalizados según las necesidades de tu proyecto. Te ayudamos a optimizar tus costos con soluciones eficientes y escalables.'
        },
        {
          keywords: ['trabajar', 'proceso', 'metodología', 'como trabajan'],
          response: 'Nuestro proceso consta de 4 etapas claras: \n1. **Diagnóstico**: Analizamos tus necesidades específicas y objetivos del proyecto. \n2. **Propuesta**: Diseñamos una solución personalizada y flexible. \n3. **Implementación**: Desarrollamos e integramos el software utilizando metodologías ágiles como Scrum. \n4. **Seguimiento**: Ofrecemos soporte continuo y mejoras basadas en tus comentarios.'
        },
        {
          keywords: ['contactar', 'contacto', 'comunicarse', 'número', 'correo'],
          response: 'Puedes comunicarte con nosotros a través de los siguientes canales:\n- Teléfono: +51 997138092 \n- Correo electrónico: adriefape@gmail.com\n- También estamos disponibles para agendar reuniones virtuales a través de Zoom o Google Meet.'
        },
        {
          keywords: ['servicio', 'que ofrecen', 'servicios'],
          response: 'Nuestros servicios incluyen:\n- **Consultoría tecnológica**: Identificamos oportunidades para mejorar tus procesos con tecnología.\n- **Desarrollo de software a medida**: Creamos aplicaciones web y móviles adaptadas a tus requerimientos.\n- **Estrategias digitales**: Implementamos soluciones para optimizar la presencia digital de tu negocio.'
        },
        {
          keywords: ['tecnología', 'herramientas', 'lenguajes', 'frameworks'],
          response: 'Trabajamos con tecnologías modernas como Python, Flask, Django, JavaScript, React, Angular, Node.js, y bases de datos como MySQL y PostgreSQL. Elegimos las herramientas ideales según la complejidad de tu proyecto.'
        },
        {
          keywords: ['tiempo', 'duración', 'cuanto tarda', 'entrega'],
          response: 'El tiempo de entrega depende de la complejidad del proyecto. En promedio, proyectos pequeños toman entre 4 y 6 semanas, mientras que desarrollos más avanzados pueden requerir entre 3 y 6 meses. Garantizamos cumplir con los plazos acordados.'
        },
        {
          keywords: ['seguridad', 'datos', 'protección', 'confidencialidad'],
          response: 'Priorizamos la seguridad de tus datos con estándares como encriptación, autenticación robusta y firewalls. Además, firmamos acuerdos de confidencialidad (NDA) para garantizar la protección de tu información.'
        },
        {
          keywords: ['hosting', 'dominio', 'servidores', 'infraestructura'],
          response: 'Te ayudamos a configurar tu hosting y dominio, ofreciendo opciones escalables en servicios como AWS, Google Cloud, o servicios compartidos según tus necesidades.'
        },
        {
          keywords: ['soporte', 'mantenimiento', 'ayuda', 'errores'],
          response: 'Ofrecemos soporte técnico y mantenimiento post-desarrollo, asegurando que tu software esté actualizado, libre de errores y funcionando al máximo rendimiento.'
        },
        {
          keywords: ['app móvil', 'aplicaciones móviles', 'android', 'ios'],
          response: 'Desarrollamos aplicaciones móviles nativas y multiplataforma para Android e iOS, utilizando tecnologías como React Native y Flutter para garantizar un rendimiento óptimo y una excelente experiencia de usuario.'
        },
        {
          keywords: ['integración', 'api', 'apis', 'sistemas externos'],
          response: 'Implementamos integraciones con APIs de terceros, como sistemas de pago (PayPal, Stripe), CRMs, ERPs y más, para extender la funcionalidad de tu software.'
        },
        {
          keywords: ['ecommerce', 'tienda online', 'venta digital'],
          response: 'Creamos soluciones de comercio electrónico personalizadas, integrando pasarelas de pago, gestión de inventarios y diseño responsive para maximizar tus ventas.'
        },
        {
          keywords: ['proyectos pasados', 'portafolio', 'clientes', 'experiencia'],
          response: 'Hemos trabajado con empresas de diversas industrias, desarrollando soluciones como plataformas educativas, sistemas de gestión empresarial y aplicaciones móviles. Solicítanos nuestro portafolio para más detalles.'
        },
        {
          keywords: ['automatización', 'procesos', 'optimización', 'robotización'],
          response: 'Te ayudamos a automatizar procesos repetitivos en tu empresa mediante soluciones de software personalizadas, reduciendo costos y aumentando la eficiencia operativa.'
        },
        {
          keywords: ['diseño', 'interfaz', 'ux', 'experiencia de usuario'],
          response: 'Nuestro enfoque en diseño UX/UI asegura que tu aplicación sea intuitiva, atractiva y fácil de usar, optimizando la experiencia de los usuarios finales.'
        }
      ];
      

    for (let intention of intentions) {
      if (intention.keywords.some(keyword => lowerMessage.includes(keyword))) {
        return intention.response;
      }
    }

    return 'No entendí completamente. ¿Podrías ser más específico?';
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const cleanInput = input.trim();
    if (cleanInput === '') return;

    const newHistory = [...history, `> ${cleanInput}`];
    const response = detectIntention(cleanInput);
    newHistory.push(response);

    setHistory(newHistory);
    setInput('');
    inputRef.current.focus();
  };

  return (
    <div className="command-prompt">
      <div className="prompt-output">
        {history.map((line, index) => (
          <div 
            key={index} 
            className={`output-line ${line.startsWith('>') ? 'user-input' : 'system-response'}`}
          >
            {line}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="prompt-input-container">
        <span className="prompt-symbol">{'>'}</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={handleInputChange}
          className="prompt-input"
          placeholder="Escribe tu pregunta..."
        />
      </form>
    </div>
  );
};

export default CommandPrompt;