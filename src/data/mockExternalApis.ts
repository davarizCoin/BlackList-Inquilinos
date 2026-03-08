export interface LegalProcess {
    id: string;
    cnjNumber: string;
    court: string;
    type: string;
    status: string;
    date: string;
    description: string;
}

export interface CreditRestriction {
    source: 'SPC' | 'Serasa' | 'Boa Vista' | 'Protesto';
    value: number;
    creditor: string;
    date: string;
}

export interface KycData {
    motherName: string;
    fatherName: string;
    phoneAlert: string | null;
    addressAlert: string | null;
}

export const checkLegalProcesses = async (cpf: string): Promise<LegalProcess[]> => {
    // Simulando delay de rede (1.5s a 3s)
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1500));

    // Mocks de processos baseados no CPF buscado
    if (cpf === '12312312389') {
        return [
            {
                id: 'pj-1',
                cnjNumber: '1023456-78.2025.8.26.0001',
                court: 'TJSP',
                type: 'Ação de Despejo por Falta de Pagamento',
                status: 'Em Andamento',
                date: '2025-08-10',
                description: 'Despejo requerido em virtude de 6 meses de inadimplência cumulado com cobrança de aluguéis e encargos.'
            }
        ];
    }

    if (cpf === '45645645600') {
        return [
            {
                id: 'pj-2',
                cnjNumber: '0012987-11.2024.8.16.0001',
                court: 'TJPR',
                type: 'Execução de Título Extrajudicial',
                status: 'Julgado Procedente',
                date: '2024-03-15',
                description: 'Cobrança de cotas condominiais em atraso.'
            },
            {
                id: 'pj-3',
                cnjNumber: '0054321-99.2023.8.16.0001',
                court: 'TJPR',
                type: 'Ação Indenizatória por Danos Materiais',
                status: 'Em Andamento',
                date: '2023-11-20',
                description: 'Danos causados ao imóvel locado após a desocupação irregular.'
            }
        ];
    }

    // Por padrão (para CPFs não mockados), retorna sem processos ou com chance aleatória
    if (Math.random() > 0.8) {
        return [
            {
                id: `pj-rand-${Date.now()}`,
                cnjNumber: `000${Math.floor(Math.random() * 9999)}-${Math.floor(Math.random() * 99)}.202${Math.floor(Math.random() * 5)}.8.26.0001`,
                court: 'TJSP',
                type: 'Ação de Cobrança',
                status: 'Arquivado',
                date: `202${Math.floor(Math.random() * 5)}-01-15`,
                description: 'Processo genérico encontrado nos tribunais de justiça estaduais.'
            }
        ];
    }

    return [];
};


export const checkCreditProtection = async (cpf: string): Promise<CreditRestriction[]> => {
    // Simulando delay de rede mais rápido que o jurídico (0.5 a 1.5s)
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));

    if (cpf === '12312312389') {
        return [
            { source: 'Serasa', value: 8500.00, creditor: 'Banco Itaú S.A.', date: '2025-05-10' },
            { source: 'SPC', value: 1200.00, creditor: 'Casas Bahia', date: '2025-09-01' }
        ];
    }

    if (cpf === '45645645600') {
        return [
            { source: 'Protesto', value: 2100.00, creditor: 'Condomínio Spazio', date: '2024-01-10' }
        ];
    }

    // Chance de ter restrição para outros CPFs
    if (Math.random() > 0.5) {
        return [
            { source: 'Serasa', value: Math.floor(Math.random() * 5000) + 100, creditor: 'Financeira XYZ', date: '2025-10-10' }
        ];
    }

    return [];
};

export const checkKycData = async (cpf: string): Promise<KycData | null> => {
    // Simulando delay de rede (0.8s a 2s)
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));

    if (cpf === '12312312389') {
        return {
            motherName: 'Maria',
            fatherName: 'José',
            phoneAlert: '⚠️ Este CPF registrou 12 números de telefone nos últimos 3 anos.',
            addressAlert: '⚠️ Este CPF esteve vinculado a 5 CEPs diferentes em 3 estados no último ano.'
        };
    }

    if (cpf === '45645645600') {
        return {
            motherName: 'Ana',
            fatherName: 'Carlos',
            phoneAlert: null,
            addressAlert: '⚠️ Este CPF esteve vinculado a 3 CEPs diferentes nos últimos 6 meses.'
        };
    }

    // Default genérico
    return {
        motherName: 'Tereza',
        fatherName: 'João',
        phoneAlert: Math.random() > 0.5 ? '⚠️ Este CPF registrou 8 números de telefone nos últimos 2 anos.' : null,
        addressAlert: Math.random() > 0.5 ? '⚠️ Este CPF esteve vinculado a múltiplos endereços recentes.' : null
    };
};
