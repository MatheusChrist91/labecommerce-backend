const imprimeArgumento = (args) => {

    for (let i=2; i < args.length; i++){
        console.log(args[i]);
    }

}

imprimeArgumento(process.argv)

/* const bananinha = process.argv.splice(2)

const imprimeArgumento = (arg) => {

    bananinha.forEach((arg) => {
        console.log(arg)
    })

}

imprimeArgumento(bananinha) */

/* console.log(process.argv[2], process.argv[3]) */