// se Usuário é par ou ímpar
const userParImpar = process.argv[2]
// número do usuário
const userNumber = parseInt(process.argv[3])

// Faz uma checagem para ver se o usuário digitou apenas "par" ou "impar"
if(userParImpar !== "par" && userParImpar !== "impar"){
    console.log("Você deve digitar apeans 'par' ou 'impar'");
    process.exit(1)
}

// Faz uma checagem para ver se o usuário digitou números entre 1 e 5
if(userNumber < 1 || userNumber > 5){
    console.log("Você deve digitar apenas números entre 1 e 5");
    process.exit(1)
}


// PC par ou impar
const pcResult = (userChoice) => {
    return userChoice === 'par' ? 'impar' : 'par';
} 

const pcParImpar = pcResult(userParImpar)

// PC número aleatório entre 1 e 5 
const pcNumber = Math.floor(Math.random() * (6 - 1) + 1)

// Soma do número do user e do PC para ver se o resultado será par ou ímpar
const resutladoFinal = userNumber + pcNumber

// Checagem para ver se resultado e par ou ímpar
const checaParImpar = resutladoFinal % 2 === 0

// Faz o resultado da checagem a cima converter em um string dizendo se o resultado é par ou ímpar
const resultado = (num) => {

    if(num){
        return 0
    }else{
        return 1
    }

}

const resultadoParImpar = resultado(checaParImpar)

// Determina quem venceu o jogo, você ou o computador
const ganhador = () => {

    if(resultadoParImpar === 1 && userParImpar === "impar"){
        console.log(`você escolheu ${userParImpar} e ${userNumber}. o PC escolheu ${pcParImpar} e ${pcNumber}.
         Logo VOCÊ venceu`)
    }if(resultadoParImpar === 0 && userParImpar === "par"){
        console.log(`você escolheu ${userParImpar} e ${userNumber}. o PC escolheu ${pcParImpar} e ${pcNumber}.
        Logo VOCÊ venceu`)
    }else{
        console.log(`você escolheu ${userParImpar} e ${userNumber}. o PC escolheu ${pcParImpar} e ${pcNumber}.
        Logo O PC venceu`)
    }

}

ganhador()