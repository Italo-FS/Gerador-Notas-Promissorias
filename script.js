function mesExtenso(mes) {
    const meses = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

    if (mes > 11 || mes < 0) throw new Error(`Mês ${mes} inexistente`)

    return meses[mes];
}


function valorExtenso(numeroCompleto) {
    parteInteiraDoNumero = numeroCompleto.split(",")[0].toString();
    parteFracionariaDoNumero = numeroCompleto.split(",")[1] ? numeroCompleto.split(",")[1].toString().padEnd(2, '0').substring(0, 2) : '00';

    let temp = __numeroExtenso(parteInteiraDoNumero);
    let numeroPorExtenso = temp[0];
    let u = temp[1];

    if (parteInteiraDoNumero === "1") {
        numeroPorExtenso += " real";
    } else {
        if (u === "2") {
            numeroPorExtenso += " de";
        }
        numeroPorExtenso += " reais";
    }

    if (parteFracionariaDoNumero > "00") {
        numeroPorExtenso += " e ";
        temp = __numeroExtenso(parteFracionariaDoNumero);
        numeroPorExtenso += temp[0];

        if (parteFracionariaDoNumero === "1") {
            numeroPorExtenso += " centavo";
        } else {
            numeroPorExtenso += " centavos";
        }
    }

    // numeroPorExtenso = numeroPorExtenso.replace(/e\sreais/g, "reais");

    return numeroPorExtenso;
}

function numeroExtenso(numero) {
    if (typeof numero === "number")
        numero = numero.toString();
    return __numeroExtenso(numero)[0];
}

function __numeroExtenso(numero) {
    const EXTENSO = [
        ["", "um", "dois", "três", "quatro", "cinco", "seis", "sete", "oito", "nove", "dez", "onze", "doze", "treze", "quatorze", "quinze", "dezesseis", "dezessete", "dezoito", "dezenove"],
        ["", "dez", "vinte", "trinta", "quarenta", "cinquenta", "sessenta", "setenta", "oitenta", "noventa"],
        ["", "cento", "duzentos", "trezentos", "quatrocentos", "quinhentos", "seiscentos", "setecentos", "oitocentos", "novecentos"],
        ["", "mil", "milhão", "bilhão", "trilhão", "quadrilhão", "quintilhão", "sextilhão", "setilhão", "octilhão", "nonilhão", "decilhão", "undecilhão", "dodecilhão", "tredecilhão", "quatrodecilhão", "quindecilhão", "sedecilhão", "septendecilhão", "octencilhão", "nonencilhão"]
    ];
    let numeroPorExtenso = "";
    numero = numero.replace(/\D/g, "");

    let u;

    if (numero === "0") {
        numeroPorExtenso += "zero";
    } else {
        let quantidadeDeCentenas = Math.ceil(numero.length / 3); // Armazena a quantidade de centenas ex: [0].[000].[000],00 => quantidade_de_centenas = 3
        let algarismosNaPrimeiraCentena = numero.length - (quantidadeDeCentenas - 1) * 3; // Armazena a quantidade de numero na primeira centena
        u = 0;

        // Completa a primeira centena com zeros à esquerda.
        if (algarismosNaPrimeiraCentena !== 0) {
            numero = "0".repeat(3 - algarismosNaPrimeiraCentena) + numero;
        }

        // Pecorre cada centena
        for (let posicaoCentena = 1; posicaoCentena <= quantidadeDeCentenas; posicaoCentena++) {
            let posicaoDoTerceiroAlgarismoDaCentenaAnterior = (posicaoCentena - 1) * 3; // Armazena a posição do maior do terceiro algarismo da centena atual.
            let centenaAtual = numero.substr(posicaoDoTerceiroAlgarismoDaCentenaAnterior, 3); // Armazena o valor da Centena
            let centenasRestantes = quantidadeDeCentenas - posicaoCentena;

            if (centenaAtual !== "000") {
                let pularScannerDeAlgarismos = false;

                // Liga as centenas
                if (posicaoCentena > 1 && (centenaAtual[0] === "0" || (centenaAtual[1] === "0" && centenaAtual[2] === "0"))) {
                    numeroPorExtenso += " e";
                }

                if (centenaAtual === "100") {
                    numeroPorExtenso += " cem";
                    pularScannerDeAlgarismos = true;
                }

                if (!pularScannerDeAlgarismos) {
                    for (let posicaoAlgarismo = 0; posicaoAlgarismo < 3; posicaoAlgarismo++) {
                        if (posicaoAlgarismo === 1) {
                            let dezenaAtual = numero.substr(posicaoDoTerceiroAlgarismoDaCentenaAnterior + posicaoAlgarismo, 2);
                            if (Number(dezenaAtual) < 20) { // Se está entre um e dezenove.
                                numeroPorExtenso += " " + EXTENSO[0][Number(dezenaAtual)];
                                break;
                            }
                        }

                        let unidadeAtual = numero.substr(posicaoDoTerceiroAlgarismoDaCentenaAnterior + posicaoAlgarismo, 1);
                        if (Number(unidadeAtual) > 0) {
                            numeroPorExtenso += " " + EXTENSO[3 - posicaoAlgarismo - 1][Number(unidadeAtual)];
                            if (posicaoAlgarismo < 2 && Number(centenaAtual.substr(posicaoAlgarismo + 1, 3 - posicaoAlgarismo)) > 0) {
                                numeroPorExtenso += " e";
                            }
                        }
                    }
                }
            } else if (centenaAtual === "000" && centenasRestantes <= 1) {
                u += 1;
            }

            if (parseInt(centenaAtual) > 0) {
                let temp = " " + EXTENSO[3][centenasRestantes];

                temp += (centenasRestantes > 1) ? ", " : "";

                if (centenaAtual !== "001") {
                    temp = temp.replace(/ão/, "ões");
                }

                numeroPorExtenso += temp;
            }
        }
    }

    numeroPorExtenso = numeroPorExtenso.replace(/\,\s$/, "");
    numeroPorExtenso = numeroPorExtenso.replace(/\s+/g, " ");
    numeroPorExtenso = numeroPorExtenso.replace(/^\s*/, "");
    numeroPorExtenso = numeroPorExtenso.replace(/\s*$/, "");
    numeroPorExtenso = numeroPorExtenso.replace(/^(um mil) /, "mil ");

    // console.log(numeroPorExtenso, '|', u)

    return [numeroPorExtenso, u];
}

function formatarDocumento(doc) {
    // Remove todos os caracteres não numéricos
    const docNumerico = doc.replace(/\D/g, '');

    // Verifica se é um CPF (tem 11 dígitos) ou CNPJ (tem 14 dígitos)
    if (docNumerico.length === 11) {
        // Formata como CPF: 000.000.000-00
        return docNumerico.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else if (docNumerico.length === 14) {
        // Formata como CNPJ: 00.000.000/0000-00
        return docNumerico.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    } else {
        throw new Error('Formato de documento inválido. Por favor, insira um CPF ou CNPJ válido.');
    }
}

// function isEuropeanDecimalFormat(string) {
//     const EuropeanDecimalFormatRegex = /^(\d{1,3}(?:\.?\d{3})*,\d{2})$/; // #.##0,00
//     return EuropeanDecimalFormatRegex.test(string);
// }

// function isInternationalDecimalFormatRegex(string) {
//     const InternationalDecimalFormatRegex = /^(\d{1,3}(?:,?\d{3})*\.\d{2})$/; // #,##0.00
//     return InternationalDecimalFormatRegex.test(string);
// }

// function isNoDecimalFormatRegex(string) {
//     const NoDecimalFormatRegex = /^(\d+)$/; // ######0
//     return NoDecimalFormatRegex.test(string);
// }

// function convertEuropeanToInternationalFormat(string) {
//     return parseFloat(string.replace(/\./g, '').replace(',', '.')).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
// }

// function convertInternationalToEuropeanFormat(string) {
//     console.log("a", string.replace(/\d(?=(\d{3})+\.)/g, '$&,'))
//     return string.replace(/\d(?=(\d{3})+\.)/g, '$&,').replace('.', '@').replace(',', '.').replace('@', ',');
// }

// function formatNumberToEuropeanDecimalFormat(string) {
//     try {
//         string = string.trim();
//         if (isNoDecimalFormatRegex(string)) return convertInternationalToEuropeanFormat(string);
//         if (isInternationalDecimalFormatRegex(string)) return convertInternationalToEuropeanFormat(string);
//         if (isEuropeanDecimalFormat(string)) return convertEuropeanToInternationalFormat(string);
//         throw new Error(`formato de '${string}' não identificado.`);
//     } catch (e) {
//         return e
//         // throw new Error(`Ocorreu um erro ao tentar converter ${string} para texto`);
//     }
// }

function validate({ value, validatedElement, validation, hintId } = data) {
    const trueHint = document.getElementById(`${hintId}:true`)
    const falseHint = document.getElementById(`${hintId}:false`)
    if (validation(value)) {
        if (trueHint) trueHint.classList.remove('hidden');
        if (falseHint) falseHint.classList.add('hidden');
        if (validatedElement) validatedElement.classList.remove('invalid');
    } else {
        if (falseHint) falseHint.classList.remove('hidden');
        if (trueHint) trueHint.classList.add('hidden');
        if (validatedElement) validatedElement.classList.add('invalid');
    }
}

function isCpfValid(cpf) {
    const sumDigits = (string) => {
        let sum = 0;
        for (let i = 0; i < string.length; i++) {
            sum += parseInt(cpf[i]) * (string.length + 1 - i);
        }
        return sum;
    }

    cpf = cpf.toString().replace(/[^0-9]/g, "");
    if (cpf.length !== 11) {
        return false;
    }

    const soma1 = sumDigits(cpf.substring(0, 9))
    const resto1 = soma1 % 11;
    const digito1 = (11 - resto1) % 10;

    const soma2 = sumDigits(cpf.substring(0, 10))
    const resto2 = soma2 % 11;
    const digito2 = (11 - resto2) % 10;

    return cpf[9] == digito1 && cpf[10] == digito2;
}

function isValidValue(value) {
    console.log("a", value)
    return value >= 1;
}

function isValidInstallments(value) {
    return value >= 1;
}