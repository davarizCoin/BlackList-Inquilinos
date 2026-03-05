import React, { useState, useEffect } from 'react';
import { Clock, CheckSquare, Trash2, Key, Shield } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Admin() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [pendingReports, setPendingReports] = useState<any[]>([]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (login === 'davariz' && password === 'garanhao77') {
            setIsAuthenticated(true);
            fetchPendingReports();
        } else {
            alert('Credenciais Incorretas.');
        }
    };

    const fetchPendingReports = async () => {
        const { data, error } = await supabase
            .from('denuncias')
            .select('*')
            .eq('status', 'pending')
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Erro ao buscar denúncias:", error);
            return;
        }
        setPendingReports(data || []);
    };

    const handleApprove = async (id: string) => {
        if (!confirm("Tem certeza que deseja APROVAR este Inquilino para a lista pública?")) return;

        const { error } = await supabase
            .from('denuncias')
            .update({ status: 'approved' })
            .eq('id', id);

        if (!error) {
            setPendingReports(prev => prev.filter(report => report.id !== id));
            alert("✅ Movido para a Blacklist Pública Oficial!");
        } else {
            alert("Erro ao aprovar.");
        }
    };

    const handleReject = async (id: string) => {
        if (!confirm("Tem certeza que deseja APAGAR permanentemente esta denúncia sem aprovar?")) return;

        const { error } = await supabase
            .from('denuncias')
            .delete()
            .eq('id', id);

        if (!error) {
            setPendingReports(prev => prev.filter(report => report.id !== id));
        } else {
            alert("Erro ao remover do banco.");
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-slate-100 flex items-start justify-center pt-32 px-4">
                <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm border-t-4 border-brand-dark">
                    <div className="flex justify-center mb-6">
                        <Key className="w-12 h-12 text-brand-dark" />
                    </div>
                    <h2 className="text-2xl font-black text-center mb-8 text-slate-800">Acesso Restrito</h2>

                    <div className="mb-4">
                        <label className="block text-sm font-bold text-slate-700 mb-1">Usuário</label>
                        <input type="text" value={login} onChange={(e) => setLogin(e.target.value)} required className="w-full px-4 py-3 bg-slate-50 border rounded outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition" />
                    </div>

                    <div className="mb-8">
                        <label className="block text-sm font-bold text-slate-700 mb-1">Senha Master</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-3 bg-slate-50 border rounded outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition" />
                    </div>

                    <button type="submit" className="w-full bg-brand-dark text-white font-bold py-3 rounded hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition">
                        Entrar no Cofre
                    </button>
                </form>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-12">
            <div className="flex justify-between items-end mb-8 border-b pb-4">
                <div>
                    <h2 className="text-3xl font-black text-brand-dark flex items-center gap-2">
                        <Shield className="w-8 h-8 text-brand-accent" /> Painel Censor
                    </h2>
                    <p className="text-slate-500">Julgamento pendente de CPF's recebidos pelo formulário.</p>
                </div>
                <div className="bg-brand-dark text-white px-4 py-1.5 rounded-full font-bold text-sm shadow-md">
                    👑 Logado(a) como {login}
                </div>
            </div>

            <div className="bg-white shadow-xl border border-slate-200 rounded-2xl overflow-hidden">
                <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex justify-between items-center">
                    <h3 className="font-bold text-slate-700">Fila de Espera</h3>
                    <span className="bg-yellow-200 text-yellow-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                        <Clock className="w-4 h-4" /> {pendingReports.length} Arquivos Analisando
                    </span>
                </div>
                <ul className="divide-y divide-slate-100">

                    {pendingReports.length === 0 ? (
                        <div className="p-12 text-center text-slate-400">
                            <CheckSquare className="w-16 h-16 mx-auto mb-4 opacity-20" />
                            <p className="font-medium text-lg">Você não tem denúncias aguardando moderação no momento.</p>
                        </div>
                    ) : (
                        pendingReports.map((report) => (
                            <li key={report.id} className="p-6 hover:bg-slate-50 transition-colors">
                                <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h4 className="font-black text-xl text-brand-dark">{report.tenant_name}</h4>
                                            <span className="text-slate-500 font-mono text-sm bg-slate-200 px-2 py-0.5 rounded">CPF: {report.cpf}</span>
                                        </div>

                                        <div className="bg-slate-100 p-4 rounded-lg mb-4 border border-slate-200">
                                            <p className="text-slate-700 text-sm leading-relaxed">
                                                <strong>📜 Relato Oficial:</strong> {report.report_relato}
                                            </p>
                                        </div>

                                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-slate-600">
                                            <span className="bg-red-50 text-red-700 px-2 py-1 rounded">💸 Dívida/Prejuízo: {report.debt_amount || 'R$ Não Informado'}</span>
                                            <span className="bg-orange-50 text-orange-700 px-2 py-1 rounded">⚠️ Cláusula: {report.infraction_clause || 'Não Especificada'}</span>

                                            {report.youtube_link && (
                                                <a href={report.youtube_link} target="_blank" rel="noreferrer" className="text-blue-600 underline flex items-center hover:text-blue-800 transition">
                                                    ▶️ Prova em Vídeo (Assistir)
                                                </a>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-row md:flex-col gap-3 min-w-[140px] w-full md:w-auto border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6 border-slate-200">
                                        <button
                                            onClick={() => handleApprove(report.id)}
                                            className="bg-green-600 text-white px-4 py-3 rounded-lg font-black tracking-wide hover:bg-green-700 hover:shadow-lg transition flex-1 flex items-center justify-center gap-2"
                                        >
                                            <CheckSquare className="w-5 h-5" /> APROVAR
                                        </button>
                                        <button
                                            onClick={() => handleReject(report.id)}
                                            className="bg-slate-100 text-slate-500 border border-slate-300 px-4 py-3 rounded-lg font-bold hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition flex-1 flex items-center justify-center gap-2"
                                        >
                                            <Trash2 className="w-5 h-5" /> REJEITAR
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))
                    )}
                </ul>
            </div>
        </div>
    );
}
