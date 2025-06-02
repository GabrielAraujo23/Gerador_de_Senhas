
// Seleção de Elementos
const generatePasswordButton = document.querySelector("#generate-password");
const generatedPasswordElement = document.querySelector("#generated-password");

// Novas funcionalidades
const generatePasswordContainer = document.querySelector("#generate-options");
const lengthInput = document.querySelector("#length");
const lettersInput = document.querySelector("#letters");
const numbersInput = document.querySelector("#numbers");
const symbolsInput = document.querySelector("#symbols");
const copyPasswordButton = document.querySelector("#copy-password");
const nivelValidacao = document.querySelector("#nivel-validacao");


// Funções
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

const generatePassword = (
  getLetterLowerCase,
  getLetterUpperCase,
  getNumber,
  getSymbol
) => {
  let password = "";

  //   Segunda versão
  const passwordLength = +lengthInput.value;

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

  console.log(generators.length);

  if (generators.length === 0) {
    return;
  }

  for (i = 0; i < passwordLength; i = i + generators.length) {
    generators.forEach(() => {
      const randomValue =
        generators[Math.floor(Math.random() * generators.length)]();

      password += randomValue;
    });
  }

  password = password.slice(0, passwordLength);

  generatedPasswordElement.style.display = "block";
  generatedPasswordElement.querySelector("h4").innerText = password;
};

// Eventos
generatePasswordButton.addEventListener("click", () => {
  generatePassword(
    getLetterLowerCase,
    getLetterUpperCase,
    getNumber,
    getSymbol
  );
});


copyPasswordButton.addEventListener("click", (e) => {
  e.preventDefault();

  const password = generatedPasswordElement.querySelector("h4").innerText;

  navigator.clipboard.writeText(password).then(() => {
    copyPasswordButton.innerText = "Senha copiada com sucesso!";

    setTimeout(() => {
      copyPasswordButton.innerText = "Copiar";
    }, 1000);
  });
});


function validarSenha(event) {
  const form = document.getElementById('senha');
  const erro = document.getElementById("mensagem-erro");
  const senha = form.value;
  erro.innerText = ""; // limpa erro anterior

  if (senha.length < 7) {
    erro.innerText = "Insira uma senha válida de no mínimo 7 caracteres.";
    return;
  }
  event.preventDefault();
  console.log(form.value[0])
  var nivel = 0
  if (containsUppercase(form.value)) {
      console.log("tem maiscula");
      nivel=nivel+1
  }
  if(containsNumber(form.value)){
      console.log("tem numero");
      nivel=nivel+1
  }
  if(containsSpecial(form.value)){
      console.log("tem especial");
      nivel=nivel+1
  }
  nivelValidacao.style.display = "block";
  nivelValidacao.querySelector("h4").innerText = "O nível da sua senha é: " +nivel;
  
}


function containsUppercase(str){
  return /[A-Z]/.test(str);
}

function containsNumber(str){
  return /\d/.test(str);
}

function containsSpecial(str){
  return /[\W_]/.test(str);
}


function showValidador(){
  var validador = document.getElementById("validador")
  var btnValidador = document.getElementById("btnValidador")
  var gerador = document.getElementById("gerador")
  var btnGerador = document.getElementById("btnGerador")
  
  
   gerador.style.display = "none";
   validador.style.display = "block";
   btnValidador.disabled = true
   btnGerador.disabled = false
   
   document.getElementById("generated-password").style.display = "none";

}

function showGerador(){
  var gerador = document.getElementById("gerador")
  var btnGerador = document.getElementById("btnGerador")
  var validador = document.getElementById("validador")
  var btnValidador = document.getElementById("btnValidador")

   validador.style.display = "none";
   gerador.style.display = "block";
   btnGerador.disabled = true
   btnValidador.disabled = false
   

   document.getElementById("nivel-validacao").style.display = "none";
}

  