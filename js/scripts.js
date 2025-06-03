// Seleção de Elementos
const generatePasswordButton = document.querySelector("#generate-password");
const generatedPasswordElement = document.querySelector("#generated-password");

// Elementos para opções do gerador
const lengthInput = document.querySelector("#length");
const lettersInput = document.querySelector("#letters");
const numbersInput = document.querySelector("#numbers");
const symbolsInput = document.querySelector("#symbols");
const copyPasswordButton = document.querySelector("#copy-password");
const nivelValidacao = document.querySelector("#nivel-validacao");

// Funções Geradoras de Caracteres
const getLetterLowerCase = () => {
  return String.fromCharCode(Math.floor(Math.random() * 26) + 97);
};

const getLetterUpperCase = () => {
  return String.fromCharCode(Math.floor(Math.random() * 26) + 65);
};

const getNumber = () => {
  return Math.floor(Math.random() * 10).toString();
};

const getSymbol = () => {
  const symbols = "(){}[]=<>/,.!@#$%&*+-";
  return symbols[Math.floor(Math.random() * symbols.length)];
};

// Função Principal para Gerar Senha
const generatePassword = () => { // Removed parameters as they are globally available
  let password = "";
  const passwordLength = +lengthInput.value; // Use unary plus to convert to number

  if (isNaN(passwordLength) || passwordLength <= 0) {
      alert("Por favor, insira um tamanho de senha válido."); // Simple validation
      return;
  }

  const generators = [];

  if (lettersInput.checked) {
    generators.push(getLetterLowerCase, getLetterUpperCase);
  }
  if (numbersInput.checked) {
    generators.push(getNumber);
  }
  if (symbolsInput.checked) {
    generators.push(getSymbol);
  }

  if (generators.length === 0) {
    alert("Selecione ao menos um tipo de caractere para gerar a senha!");
    generatedPasswordElement.style.display = "none"; // Hide if no options
    return;
  }

  // Ensure all selected types are included if possible, then fill randomly
  let guaranteedChars = "";
  if (lettersInput.checked) {
      guaranteedChars += getLetterLowerCase(); // ensure at least one lower
      if (passwordLength > 1) guaranteedChars += getLetterUpperCase(); // ensure at least one upper if space
  }
  if (numbersInput.checked && guaranteedChars.length < passwordLength) {
      guaranteedChars += getNumber();
  }
  if (symbolsInput.checked && guaranteedChars.length < passwordLength) {
      guaranteedChars += getSymbol();
  }
  
  // Fill the rest of the password
  for (let i = guaranteedChars.length; i < passwordLength; i++) {
    const randomGenerator = generators[Math.floor(Math.random() * generators.length)];
    password += randomGenerator();
  }

  // Combine guaranteed characters with the rest and shuffle
  password = guaranteedChars + password;
  password = password.split('').sort(() => 0.5 - Math.random()).join(''); // Shuffle
  password = password.slice(0, passwordLength); // Ensure correct length

  generatedPasswordElement.style.display = "block";
  generatedPasswordElement.querySelector("h4").innerText = password;
  // Hide validator output when new password is generated
  nivelValidacao.style.display = "none"; 
};

// Eventos
generatePasswordButton.addEventListener("click", generatePassword); // No need to pass functions if they are in scope

copyPasswordButton.addEventListener("click", (e) => {
  e.preventDefault();
  const passwordToCopy = generatedPasswordElement.querySelector("h4").innerText;

  // Using document.execCommand for broader compatibility in restricted environments like iframes
  const textArea = document.createElement("textarea");
  textArea.value = passwordToCopy;
  document.body.appendChild(textArea);
  textArea.select();
  try {
      document.execCommand('copy');
      copyPasswordButton.innerText = "Senha copiada!";
  } catch (err) {
      copyPasswordButton.innerText = "Falha ao copiar";
      console.error('Fallback: Oops, unable to copy', err);
  }
  document.body.removeChild(textArea);

  setTimeout(() => {
    copyPasswordButton.innerText = "Copiar";
  }, 2000);
});

// Funções de Validação de Senha
function validarSenha(event) {
  // 'event' might not be strictly necessary if not using form submission preventDefault
  // but good practice if the button were type="submit" inside a form.
  // For type="button", event.preventDefault() has no effect.
  
  const senhaInput = document.getElementById('senha'); // Corrected: was 'form'
  const erroDiv = document.getElementById("mensagem-erro");
  const senha = senhaInput.value; // Removed .trim() here to evaluate actual input for levels
                                  // but for length check, trimmed is fine.
  
  erroDiv.innerText = ""; // Limpa erro anterior

  if (senha.trim().length === 0) {
      erroDiv.innerText = "O campo da senha não pode estar vazio.";
      nivelValidacao.style.display = "none";
      return;
  }
  if (senha.trim().length < 7) {
    erroDiv.innerText = "Insira uma senha válida de no mínimo 7 caracteres.";
    nivelValidacao.style.display = "none"; // Hide level if too short
    return;
  }
  
  let nivel = 0;
  if (containsUppercase(senha)) {
    console.log("tem maiúscula");
    nivel = nivel + 1;
  }
  if (containsNumber(senha)) {
    console.log("tem número");
    nivel = nivel + 1;
  }
  if (containsSpecial(senha)) {
    console.log("tem especial");
    nivel = nivel + 1;
  }

  nivelValidacao.style.display = "block";
  nivelValidacao.querySelector("h4").innerText = "O nível da sua senha é: " + nivel;
  // Hide generated password output when validator is used
  generatedPasswordElement.style.display = "none"; 
}

function containsUppercase(str) {
  return /[A-Z]/.test(str);
}
function containsNumber(str) {
  return /\d/.test(str);
}
function containsSpecial(str) {
  // \W matches any non-word character (equivalent to [^a-zA-Z0-9_])
  // _ is also a word character, so explicitly include it if you want it as special.
  // If you want to be more specific about symbols: return /[!@#$%^&*(),.?":{}|<>]/.test(str);
  return /[\W_]/.test(str); // This includes underscore as special.
                            // If underscore should NOT be special, use /[^\w\s]|[_]/.test(str) is a bit redundant.
                            // Or more simply: /[!@#$%^&*()+=\-[\]{};':"\\|,.<>\/?~`]/.test(str)
}

// Função para Gerar Hash (SHA-256)
// This function is called by the onclick attribute in the HTML
function gerarHash() {
  const input = document.getElementById("input-hash").value;
  const resultadoHashElement = document.getElementById("resultado-hash");

  if (!input) {
    resultadoHashElement.innerText = "Digite um valor para gerar o hash.";
    return;
  }

  const encoder = new TextEncoder();
  const data = encoder.encode(input);

  crypto.subtle.digest("SHA-256", data)
    .then((hashBuffer) => {
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
      resultadoHashElement.innerText = hashHex;
    })
    .catch((err) => {
      resultadoHashElement.innerText = "Erro ao gerar hash.";
      console.error("Erro ao gerar hash:", err);
    });
}

// Funções para Mostrar/Ocultar Seções
function ocultarTodasAsSecoes() {
  document.getElementById("gerador").style.display = "none";
  document.getElementById("validador").style.display = "none";
  document.getElementById("hasheador").style.display = "none";
  document.getElementById("generated-password").style.display = "none";
  document.getElementById("nivel-validacao").style.display = "none";

  // Reativar todos os botões de navegação
  document.getElementById("btnGerador").disabled = false;
  document.getElementById("btnValidador").disabled = false;
  document.getElementById("btnGerarHash").disabled = false; // Corrected ID
}

function showValidador() {
  ocultarTodasAsSecoes();
  document.getElementById("validador").style.display = "block";
  document.getElementById("btnValidador").disabled = true;
}

function showGerador() {
  ocultarTodasAsSecoes();
  document.getElementById("gerador").style.display = "block";
  document.getElementById("btnGerador").disabled = true;
}

function showHash() {
  ocultarTodasAsSecoes();
  document.getElementById("hasheador").style.display = "block";
  document.getElementById("btnGerarHash").disabled = true; // Corrected ID
}

// Configuração Inicial ao Carregar a Página
document.addEventListener("DOMContentLoaded", function() {
  ocultarTodasAsSecoes();
  showGerador(); // Define o gerador como a seção padrão visível
});