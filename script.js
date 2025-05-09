function generarContrasena(longitud = 12, opciones = {}) {
  const usarMinusculas = true;
  const usarMayusculas = opciones.mayusculas || false;
  const usarNumeros = opciones.numeros || false;
  const usarSimbolos = opciones.simbolos || false;

  const minusculas = "abcdefghijklmnopqrstuvwxyz";
  const mayusculas = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numeros = "0123456789";
  const simbolos = "!@#$%^&*()_+-=[]{}|;:,.<>?";

  let conjunto = "";
  const garantizados = [];

  if (usarMinusculas) {
    conjunto += minusculas;
    garantizados.push(randomChar(minusculas));
  }
  if (usarMayusculas) {
    conjunto += mayusculas;
    garantizados.push(randomChar(mayusculas));
  }
  if (usarNumeros) {
    conjunto += numeros;
    garantizados.push(randomChar(numeros));
  }
  if (usarSimbolos) {
    conjunto += simbolos;
    garantizados.push(randomChar(simbolos));
  }

  if (!conjunto) {
    conjunto = minusculas;
    garantizados.push(randomChar(minusculas));
  }

  const restantes = longitud - garantizados.length;
  const aleatorios = new Uint8Array(restantes);
  crypto.getRandomValues(aleatorios);

  for (let i = 0; i < restantes; i++) {
    garantizados.push(conjunto[aleatorios[i] % conjunto.length]);
  }

  // Mezclar
  for (let i = garantizados.length - 1; i > 0; i--) {
    const j = crypto.getRandomValues(new Uint8Array(1))[0] % (i + 1);
    [garantizados[i], garantizados[j]] = [garantizados[j], garantizados[i]];
  }

  return garantizados.join("");
}

function randomChar(str) {
  return str[crypto.getRandomValues(new Uint8Array(1))[0] % str.length];
}

// UI
const btnGenerar = document.getElementById("generar");
const btnCopiar = document.getElementById("copiar");
const resultado = document.getElementById("resultado");
const longitudInput = document.getElementById("longitud");
const longitudFeedback = document.getElementById("longitud-feedback");

btnGenerar.addEventListener("click", () => {
  const opciones = {
    mayusculas: document.getElementById("mayusculas").checked,
    numeros: document.getElementById("numeros").checked,
    simbolos: document.getElementById("simbolos").checked,
  };
  const longitud = parseInt(longitudInput.value, 10);

  if (longitud < 16) {
    longitudFeedback.textContent = "Para máxima seguridad, la longitud de la contraseña debería ser de al menos 16 caracteres.";
    longitudFeedback.style.color = "#FF6347"; // Rojo para advertencia
  } else {
    longitudFeedback.textContent = ""; // Limpiar advertencia si la longitud es adecuada
  }

  const pwd = generarContrasena(longitud, opciones);
  resultado.textContent = pwd;
});

btnCopiar.addEventListener("click", () => {
  const pwd = resultado.textContent;
  navigator.clipboard.writeText(pwd).then(() => {
    btnCopiar.textContent = "Copiado!";
    setTimeout(() => btnCopiar.textContent = "Copiar", 1500);
  });
});
