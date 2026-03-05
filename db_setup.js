import pg from 'pg';
const { Client } = pg;

async function setup() {
    const connectionString = 'postgresql://postgres:Garanhao1977@db.vwvgzmveehzhmwrgvpug.supabase.co:5432/postgres';
    const client = new Client({ connectionString });

    try {
        await client.connect();
        console.log("Conectado ao PostgreSQL do Supabase via rota padrão!");
        await runQueries(client);
        return;
    } catch (err) {
        console.log("Falha na porta IPv4 padrão. Tentando via Pooler Especializado de Nuvem (Porta 6543)...");
    }

    // Fallback IPv6 / Pooler connection for Supabase Edge Servers
    const client2 = new Client({
        connectionString: 'postgresql://postgres.vwvgzmveehzhmwrgvpug:Garanhao1977@aws-0-us-east-1.pooler.supabase.com:6543/postgres'
    });

    try {
        await client2.connect();
        console.log("Conectado ao PostgreSQL do Supabase via Pooler AWS!");
        await runQueries(client2);
    } catch (err2) {
        console.error("Erro final ao conectar no Banco:", err2.message);
    }
}

async function runQueries(connectedClient) {
    try {
        // 1. Tabela de Denúncias
        const createTableQuery = `
      CREATE TABLE IF NOT EXISTS public.denuncias (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        tenant_name TEXT NOT NULL,
        cpf TEXT NOT NULL,
        debt_amount TEXT,
        infraction_type TEXT,
        infraction_clause TEXT,
        report_relato TEXT,
        youtube_link TEXT,
        photo_url TEXT,
        contract_url TEXT,
        status TEXT DEFAULT 'pending',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
      );
    `;
        await connectedClient.query(createTableQuery);
        console.log("-> Tabela 'denuncias' gerada perfeitamente.");

        // 2. Segurança: RLS - Row Level Security
        await connectedClient.query(`ALTER TABLE public.denuncias ENABLE ROW LEVEL SECURITY;`);

        // Inserção Livre (Anon API Key) para formulários públicos
        await connectedClient.query(`
      DO $$ BEGIN
        CREATE POLICY "PublicInsert" ON public.denuncias FOR INSERT TO anon WITH CHECK (true);
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

        // Busca Pública Livre SOMENTE SE Aprovado pela Moderação
        await connectedClient.query(`
      DO $$ BEGIN
        CREATE POLICY "PublicSelectOnlyApproved" ON public.denuncias FOR SELECT TO anon USING (status = 'approved');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

        // Para o Admin (Quando deslogado, usaremos uma bypass route no backend ou service_role na Nuvem, 
        // Por enquanto habilitaremos leitura total anon pra gente poder construir o painel MVP
        // Mais tarde no projeto trancaremos com Auth. users)
        await connectedClient.query(`
      DO $$ BEGIN
        CREATE POLICY "TempAdminBypass" ON public.denuncias FOR ALL TO anon USING (true) WITH CHECK (true);
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

        console.log("✅ Servidor do Supabase Preparado para a Plataforma!");
    } finally {
        await connectedClient.end();
    }
}

setup();
