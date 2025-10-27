// Elimina guiones y espacios del CUIT
function normalizarCuit(cuit) {
  return cuit.replace(/[-\s]/g, '');
}

// Valida formato y dígito verificador de CUIT argentino
export function validarCuit(cuit) {
  const cuitLimpio = normalizarCuit(cuit);
  
  // Valida longitud
  if (!/^[0-9]{11}$/.test(cuitLimpio)) {
    return { valido: false, mensaje: "El CUIT debe tener 11 dígitos" };
  }
  
  // Valida tipo
  const tipo = parseInt(cuitLimpio.substring(0, 2));
  const tiposValidos = [20, 23, 24, 27, 30, 33, 34];
  if (!tiposValidos.includes(tipo)) {
    return { 
      valido: false, 
      mensaje: "Tipo de CUIT inválido. Debe comenzar con: 20, 23, 24, 27, 30, 33 o 34" 
    };
  }
  
  // Calcula dígito verificador
  const multiplicadores = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
  let suma = 0;
  
  for (let i = 0; i < 10; i++) {
    suma += parseInt(cuitLimpio[i]) * multiplicadores[i];
  }
  
  const resto = suma % 11;
  let digitoEsperado;
  
  if (resto === 0) {
    digitoEsperado = 0;
  } else if (resto === 1) {
    if (tipo === 20) {
      digitoEsperado = 9;
    } else if (tipo === 27) {
      digitoEsperado = 4;
    } else {
      return { valido: false, mensaje: "CUIT inválido para este tipo con resto 1" };
    }
  } else {
    digitoEsperado = 11 - resto;
  }
  
  const verificador = parseInt(cuitLimpio[10]);
  
  if (verificador !== digitoEsperado) {
    return { 
      valido: false, 
      mensaje: `Dígito verificador incorrecto. Esperado: ${digitoEsperado}, recibido: ${verificador}` 
    };
  }
  
  return { valido: true, mensaje: "CUIT válido", cuitNormalizado: cuitLimpio };
}

// Maneja la respuesta del servidor y parsea JSON
const handleResponse = async (res) => {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch (e) {
    return { error: "Respuesta inválida del servidor", raw: text };
  }
};



 // Inicia sesión con CUIT y contraseña
export async function login(cuit_usu, pass_usu) {
  try {
    // Normaliza CUIT antes de enviar (quita guiones)
    const cuitNormalizado = normalizarCuit(cuit_usu);
    
    const res = await fetch("/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        cuit: cuitNormalizado,  // Envia como "cuit" según backend
        password: pass_usu       // Envia como "password" según backend
      }),
    });
    return await handleResponse(res);
  } catch (e) {
    console.error("Error en login:", e);
    return { error: "Error de red" };
  }
}


// Registra un nuevo usuario
export async function register(nom_usu, cuit_usu, pass_usu, rol_id, ambitos = []) {
  try {
    // Valida CUIT antes de enviar
    const validacion = validarCuit(cuit_usu);
    if (!validacion.valido) {
      return { error: validacion.mensaje };
    }
    
    // Valida que ambitos sea un array con al menos 1 elemento
    if (!Array.isArray(ambitos) || ambitos.length === 0) {
      return { error: "Debe seleccionar al menos un ámbito" };
    }
    
    const res = await fetch("/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        nom_usu, 
        cuit_usu: validacion.cuitNormalizado,  // Envia CUIT normalizado
        pass_usu, 
        rol_id: parseInt(rol_id),              // Asegurar que sea número
        ambitos                                 // Array de IDs de ámbitos
      }),
    });
    return await handleResponse(res);
  } catch (e) {
    console.error("Error en register:", e);
    return { error: "Error de red" };
  }
}

// Obtiene lista de roles desde el backend
export async function getRoles() {
  try {
    const res = await fetch("/index.php?path=/api/roles");
    return await handleResponse(res);
  } catch (e) {
    console.error("Error al obtener roles:", e);
    return { error: "Error de red" };
  }
}

// Obtiene lista de ámbitos desde el backend

export async function getAmbitos() {
  try {
    const res = await fetch("/index.php?path=/api/ambitos");
    return await handleResponse(res);
  } catch (e) {
    console.error("Error al obtener ámbitos:", e);
    return { error: "Error de red" };
  }
}

// Obtiene lista de usuarios (solo admin)
export async function getUsuarios() {
  try {
    const res = await fetch("/index.php?path=/api/usuarios");
    return await handleResponse(res);
  } catch (e) {
    console.error("Error al obtener usuarios:", e);
    return { error: "Error de red" };
  }
}