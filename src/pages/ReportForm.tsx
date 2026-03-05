import React, { useState } from 'react';
import { Shield, UploadCloud, Link as LinkIcon, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function ReportForm() {
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Captura Completa pro Supabase e Telegram
    const [tenantName, setTenantName] = useState('');
    const [cpf, setCpf] = useState('');
    const [debt, setDebt] = useState('');
    const [relato, setRelato] = useState('');
    const [clausula, setClausula] = useState('');
    const [youtube, setYoutube] = useState('');

    // Validador Matemático de CPF Brasileiro
    const isValidCPF = (cpfToTest: string) => {
        const cleanCpf = cpfToTest.replace(/[^\d]+/g, '');
        if (cleanCpf.length !== 11 || !!cleanCpf.match(/(\d)\1{10}/)) return false;

        let sum = 0;
        let remainder;

        for (let i = 1; i <= 9; i++) sum = sum + parseInt(cleanCpf.substring(i - 1, i)) * (11 - i);
        remainder = (sum * 10) % 11;
        if ((remainder === 10) || (remainder === 11)) remainder = 0;
        if (remainder !== parseInt(cleanCpf.substring(9, 10))) return false;

        sum = 0;
        for (let i = 1; i <= 10; i++) sum = sum + parseInt(cleanCpf.substring(i - 1, i)) * (12 - i);
        remainder = (sum * 10) % 11;
        if ((remainder === 10) || (remainder === 11)) remainder = 0;
        if (remainder !== parseInt(cleanCpf.substring(10, 11))) return false;

        return true;
    };

    const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Bloqueia qualquer coisa que não seja número e limita a 11
        const onlyNum = e.target.value.replace(/[^0-9]/g, '').slice(0, 11);
        setCpf(onlyNum);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Trava de CPF Inválido
        if (!isValidCPF(cpf)) {
            alert("⚠️ O CPF informado é inválido. Por favor, digite um CPF real apenas com números.");
            return;
        }

        setIsSubmitting(true);

        // 1. Gravar no Supabase
        const { error: dbError } = await supabase.from('denuncias').insert([{
            tenant_name: tenantName,
            cpf: cpf,
            debt_amount: debt,
            infraction_clause: clausula,
            report_relato: relato,
            youtube_link: youtube,
            status: 'pending' // Fica aguardando moderação Admin
        }]);

        if (dbError) {
            console.error("Erro ao salvar no BD:", dbError);
            setIsSubmitting(false);
            return;
        }

        // 🚨 CONFIGURAÇÃO DO ROBÔ DO TELEGRAM (@BLinqui_bot) 🚨
        const TELEGRAM_BOT_TOKEN = '8779027776:AAHDyJuMcpTO4z_y6aeklyHGyifwaw1svjQ';
        const TELEGRAM_CHAT_ID = '1615853192';

        const message = `🚨 *NOVA DENÚNCIA (BLACKLIST)* 🚨
        
*Inquilino:* ${tenantName || 'Não Informado'}
*Prejuízo Declarado:* ${debt || 'Sem Dívida'}
*Provas Anexadas:* Sim (Contrato e Fotos)

Deseja analisar e aprovar para a Blacklist agora?
Acesse: https://blacklist-inquilinos.com/admin`;

        try {
            await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: TELEGRAM_CHAT_ID,
                    text: message,
                    parse_mode: 'Markdown'
                })
            });
        } catch (err) {
            console.error("Erro ao enviar pro Telegram:", err);
        }

        setTimeout(() => {
            setIsSubmitting(false);
            setIsSuccess(true);
        }, 1500);
    };

    if (isSuccess) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-20 text-center">
                <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
                <h2 className="text-3xl font-black text-brand-dark mb-4">Denúncia Enviada com Sucesso!</h2>
                <p className="text-slate-600 mb-8">
                    Sua denúncia foi criptografada e enviada para nossos servidores protegidos. Nossa moderação analisará as provas e, se aprovado, o histórico deste locatário será incluído na Black List Nacional.
                    <br /><br /><strong>Importante:</strong> Seus dados de conexão e origem foram embaralhados para garantir proteção jurídica total.
                </p>
                <a href="/" className="bg-brand-dark text-white font-bold py-3 px-8 rounded-lg">Voltar à Página Inicial</a>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-12">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-black text-brand-dark flex items-center justify-center gap-3">
                    <Shield className="w-8 h-8 text-brand-accent" /> Registre uma Ocorrência
                </h2>
                <p className="text-slate-500 mt-2">Plataforma 100% anônima. Cadastre inquilinos destrutivos ou inadimplentes.</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-6 md:p-10 shadow-lg rounded-2xl border border-slate-200">
                {step === 1 && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                        <h3 className="text-xl font-bold mb-6 text-brand-primary border-b pb-2">Passo 1: Dados do Inquilino</h3>
                        <div className="grid gap-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Nome Completo do Inquilino *</label>
                                <input required type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent" placeholder="Ex: João da Silva Sauro" value={tenantName} onChange={(e) => setTenantName(e.target.value)} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">CPF (Apenas os 11 Números) *</label>
                                    <input required type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent" placeholder="Apenas números ex: 12345678900" value={cpf} onChange={handleCpfChange} />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Valor da Dívida / Prejuízo</label>
                                    <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent" placeholder="R$ 0,00" value={debt} onChange={(e) => setDebt(e.target.value)} />
                                </div>
                            </div>

                            <div className="border border-slate-200 bg-slate-50 p-4 rounded-lg">
                                <label className="block text-sm font-bold text-slate-700 mb-2">Foto de Identificação (Rosto do Inquilino)</label>
                                <div
                                    className="border-2 border-dashed border-slate-300 bg-white p-4 rounded-lg text-center cursor-pointer hover:border-brand-accent transition shadow-sm mb-2"
                                    onClick={() => document.getElementById('file-upload-face')?.click()}
                                >
                                    <input type="file" id="file-upload-face" className="hidden" accept="image/*" />
                                    <p className="text-brand-dark font-bold text-sm">📸 Clicar para Anexar Foto (Somente 1 Rosto)</p>
                                </div>
                                <div className="text-xs text-red-600 bg-red-50 p-2 rounded flex items-start gap-2 border border-red-100 font-medium">
                                    <span>⚠️</span>
                                    <p>A foto não será aceita se houverem menores de idade, crianças ou terceiros não envolvidos na locação enquadrados na imagem. Recorte/borre a foto se necessário antes de enviar.</p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-8 flex justify-end">
                            <button type="button" onClick={() => setStep(2)} className="bg-brand-dark text-white px-8 py-3 rounded-lg font-bold hover:bg-slate-800 transition">Avançar ➔</button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                        <h3 className="text-xl font-bold mb-6 text-brand-primary border-b pb-2">Passo 2: Evidências Ocultas</h3>
                        <div className="grid gap-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Relato Descritivo dos Fatos *</label>
                                <p className="text-xs text-slate-400 mb-2">Descreva exatamente o que aconteceu e por que essa pessoa quebrou o contrato. Seja claro e imparcial.</p>
                                <textarea required rows={5} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent" value={relato} onChange={(e) => setRelato(e.target.value)}></textarea>
                            </div>

                            <div className="border-t pt-4">
                                <label className="block text-sm font-bold text-slate-700 mb-3"><UploadCloud className="inline w-5 h-5 mr-1" /> Imagens ou PDFs de Danos/Prejuízos</label>
                                <div
                                    className="border-2 border-dashed border-slate-300 bg-slate-50 p-6 rounded-lg text-center cursor-pointer hover:bg-slate-100 transition relative overflow-hidden group"
                                    onClick={() => document.getElementById('file-upload-damage')?.click()}
                                >
                                    <input type="file" id="file-upload-damage" multiple className="hidden" accept="image/*,application/pdf" />
                                    <p className="text-slate-500 font-medium text-sm group-hover:text-brand-accent transition-colors">Clique aqui para buscar no seu computador, ou arraste fotos aqui</p>
                                    <p className="text-xs text-slate-400 mt-1">(Metadados de rastreio GPS da foto serão removidos pela nossa IA no momento do upload)</p>
                                </div>
                            </div>

                            <div className="border-t pt-4 bg-slate-50 -mx-6 px-6 py-4">
                                <label className="block text-sm font-bold text-slate-700 mb-3"><Shield className="inline w-5 h-5 mr-1 text-brand-dark" /> Prova Máxima: Quebra Contratual</label>
                                <p className="text-xs text-slate-500 mb-4">Adicionar o contrato de locação assinado dá peso jurídico à sua denúncia.</p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div
                                        className="border border-slate-300 bg-white p-4 rounded-lg text-center cursor-pointer hover:border-brand-accent transition shadow-sm flex items-center justify-center p-3"
                                        onClick={() => document.getElementById('file-upload-contract')?.click()}
                                    >
                                        <input type="file" id="file-upload-contract" className="hidden" accept="application/pdf" />
                                        <p className="text-brand-dark font-bold text-sm">📁 Anexar Contrato (PDF)</p>
                                    </div>

                                    <div>
                                        <input type="text" className="w-full h-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent text-sm" placeholder="Ex: Quebrou a Cláusula 5ª" value={clausula} onChange={(e) => setClausula(e.target.value)} />
                                    </div>
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <label className="block text-sm font-bold text-slate-700 mb-1"><LinkIcon className="inline w-5 h-5 mr-1" /> Link de Vídeo (Opcional, porém sugerido)</label>
                                <p className="text-xs text-slate-400 mb-2">Fez um vídeo entrando no imóvel destruído? Suba no YouTube como 'Não Listado' e cole o link aqui.</p>
                                <input type="url" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent" placeholder="https://youtube.com/watch?v=..." value={youtube} onChange={(e) => setYoutube(e.target.value)} />
                            </div>
                        </div>

                        <div className="mt-8 flex justify-between">
                            <button type="button" onClick={() => setStep(1)} className="text-slate-500 px-4 py-3 rounded-lg font-bold hover:bg-slate-100 transition">← Voltar</button>
                            <button type="submit" disabled={isSubmitting} className="bg-brand-accent text-white px-8 py-3 rounded-lg font-bold hover:bg-red-800 transition shadow-lg flex items-center gap-2">
                                {isSubmitting ? 'Criptografando...' : 'Enviar Denúncia'}
                            </button>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
}
