const validateFormData = (formData) => {
    if (typeof formData.nomeCompleto !== 'string' ) {
        return "Nome Completo deve ser uma string";
    }
    
    const tiposSanguineosValidos = ["A+", 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    if (!tiposSanguineosValidos.includes(formData.tipoSanguineo)) {
        return "Tipo Sanguíneo inválido";
    }
    
    if (typeof formData.matricula !== 'string' || formData.matricula === '') {
        return "Matrícula deve ser uma string";
    }

    if (!formData.dataDeNascimento || isNaN(new Date(formData.dataDeNascimento).getTime())) {
        return "Data de Nascimento inválida";
    }
    
    const sexosValidos = ['Masculino', 'Feminino', 'Outro'];
    if (!sexosValidos.includes(formData.sexo)) {
        return "Sexo inválido";
    }

    if (typeof formData.naturalidade !== 'string' || formData.naturalidade === '') {
        return "Naturalidade deve ser uma string";
    }

    const ufsValidos = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'];
    if (!ufsValidos.includes(formData.uf_naturalidade)) {
        return "UF inválida";
    }

    const estadosCivisValidos = ['Solteiro', 'Casado', 'Divorciado', 'Viúvo', 'União Estável'];
    if (!estadosCivisValidos.includes(formData.estadoCivil)) {
        return "Estado Civil inválido";
    }

    // if (!validateCPF(formData.cpf)) {
    //     return "CPF inválido";
    // }

    const cargosValidos = ['Advogado', 'Agente', 'Técnico Administrativo', 'Outro'];
    if (!cargosValidos.includes(formData.cargo)) {
        return "Cargo inválido";
    }

    return true;
};

module.exports = {
    validateFormData
};
