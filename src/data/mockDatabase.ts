export interface Report {
    id: string;
    name: string;
    cpf: string;
    city: string;
    state: string;
    debtValue: number;
    description: string;
    tags: string[];
    youtubeLink: string;
    photoUrl?: string; // Nova Identificação Visual
    approved: boolean; // Flag do Administrador
    createdAt: string;
}

// Simulando banco de dados (que no futuro ficará criptografado num servidor nos EUA)
export const database: Report[] = [
    {
        id: '1',
        name: 'João da Silva Sauro',
        cpf: '123.***.***-89',
        city: 'São Paulo',
        state: 'SP',
        debtValue: 12500,
        description: 'O inquilino abandonou o imóvel na calada da noite, deixando 4 meses de aluguel atrasado, além de faturas de água e luz. A porta da frente estava arrombada, os armários da cozinha foram arrancados e o imóvel foi deixado com lixo acumulado.',
        tags: ['Inadimplência', 'Danos Físicos', 'Fuga'],
        youtubeLink: 'https://youtube.com/watch?v=dummy',
        photoUrl: 'https://images.unsplash.com/photo-1541577141970-eebc83ebe30e?w=400&h=400&fit=crop',
        approved: true,
        createdAt: '2025-12-15'
    },
    {
        id: '2',
        name: 'Carlos R. Oliveira',
        cpf: '456.***.***-00',
        city: 'Curitiba',
        state: 'PR',
        debtValue: 2100,
        description: 'Inadimplência crônica. Saiu do imóvel pacificamente após ordem judicial, mas não pagou as cotas condominiais de 1 ano inteiro.',
        tags: ['Inadimplência Condominial'],
        youtubeLink: '',
        photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
        approved: true,
        createdAt: '2026-01-20'
    }
];
