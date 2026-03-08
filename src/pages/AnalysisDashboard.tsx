import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShieldAlert, Scale, BadgeDollarSign, Loader2, CheckCircle2, AlertTriangle, Building2, UserCheck } from 'lucide-react';
import { database, type Report } from '../data/mockDatabase';
import { checkLegalProcesses, checkCreditProtection, checkKycData, type LegalProcess, type CreditRestriction, type KycData } from '../data/mockExternalApis';

export default function AnalysisDashboard() {
    const { cpf } = useParams<{ cpf: string }>();
    const displayCpf = cpf ? cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4") : 'CPF Inválido';

    // State for Internal DB
    const [internalReport, setInternalReport] = useState<Report | null>(null);
    const [loadingInternal, setLoadingInternal] = useState(true);

    // State for Legal Processes
    const [legalProcesses, setLegalProcesses] = useState<LegalProcess[]>([]);
    const [loadingLegal, setLoadingLegal] = useState(true);

    // State for Credit Protection
    const [creditRestrictions, setCreditRestrictions] = useState<CreditRestriction[]>([]);
    const [loadingCredit, setLoadingCredit] = useState(true);

    // State for KYC
    const [kycData, setKycData] = useState<KycData | null>(null);
    const [loadingKyc, setLoadingKyc] = useState(true);

    useEffect(() => {
        if (!cpf) return;

        // 1. Check Internal Database (Fastest)
        setTimeout(() => {
            const result = database.find(p => p.cpf.replace(/\D/g, '') === cpf && p.approved);
            setInternalReport(result || null);
            setLoadingInternal(false);
        }, 800);

        // 2. Check Legal Processes API
        checkLegalProcesses(cpf).then((data) => {
            setLegalProcesses(data);
            setLoadingLegal(false);
        });

        // 3. Check Credit Protection API
        checkCreditProtection(cpf).then((data) => {
            setCreditRestrictions(data);
            setLoadingCredit(false);
        });

        // 4. Check KYC API
        checkKycData(cpf).then((data) => {
            setKycData(data);
            setLoadingKyc(false);
        });

    }, [cpf]);

    return (
        <div className="min-h-screen bg-slate-50 pt-8 pb-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header Navigation */}
                <div className="mb-8 flex items-center justify-between">
                    <Link to="/" className="text-slate-500 hover:text-brand-dark flex items-center gap-2 font-medium transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                        Nova Busca
                    </Link>
                    <div className="bg-brand-dark text-white px-4 py-1.5 rounded-full text-sm font-semibold tracking-wider flex items-center gap-2 shadow-sm">
                        <ShieldAlert className="w-4 h-4 text-brand-accent" />
                        Relatório de Risco
                    </div>
                </div>

                {/* Main Subject Info */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8 flex flex-col md:flex-row items-center md:items-start justify-between">
                    <div>
                        <h1 className="text-3xl font-black text-slate-800 mb-2">
                            {internalReport ? internalReport.name : 'Nome indisponível na base interna'}
                        </h1>
                        <p className="text-xl text-slate-500 font-mono tracking-widest">{displayCpf}</p>
                    </div>

                    {/* Overall Score/Alert (Calculated dynamically) */}
                    <div className="mt-6 md:mt-0 flex flex-col items-center">
                        {loadingInternal || loadingLegal || loadingCredit ? (
                            <div className="text-slate-400 flex flex-col items-center">
                                <Loader2 className="w-10 h-10 animate-spin mb-2" />
                                <span className="text-sm font-semibold">Analisando Riscos...</span>
                            </div>
                        ) : (
                            <div className={`px-6 py-4 rounded-xl border-2 flex flex-col items-center text-center max-w-[200px]
                                ${(internalReport || legalProcesses.length > 0 || creditRestrictions.length > 0)
                                    ? 'bg-red-50 border-red-200'
                                    : 'bg-emerald-50 border-emerald-200'}`}
                            >
                                {(internalReport || legalProcesses.length > 0 || creditRestrictions.length > 0) ? (
                                    <>
                                        <AlertTriangle className="w-10 h-10 text-brand-accent mb-2" />
                                        <h3 className="text-brand-accent font-black text-lg">ALTO RISCO</h3>
                                        <p className="text-xs text-red-700 font-medium leading-tight">Apontamentos encontrados nas bases consultadas.</p>
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 className="w-10 h-10 text-emerald-600 mb-2" />
                                        <h3 className="text-emerald-700 font-black text-lg">NADA CONSTA</h3>
                                        <p className="text-xs text-emerald-700 font-medium leading-tight">Nenhuma ocorrência grave localizada neste CPF hoje.</p>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* 4-Column Grid for Data Sources */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">

                    {/* COL 1: Internal Database (Black Lista Home) */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                        <div className="bg-slate-800 text-white p-4 flex items-center gap-3">
                            <Building2 className="w-6 h-6 text-brand-accent" />
                            <h2 className="font-bold text-lg">Base de Imobiliárias</h2>
                        </div>
                        <div className="p-6 flex-grow">
                            {loadingInternal ? (
                                <div className="flex flex-col items-center justify-center h-full text-slate-400 py-10">
                                    <Loader2 className="w-8 h-8 animate-spin mb-3" />
                                    <p className="text-sm font-medium">Buscando na rede de locadores...</p>
                                </div>
                            ) : internalReport ? (
                                <div>
                                    <div className="bg-red-50 border border-red-100 rounded-lg p-4 mb-4">
                                        <span className="text-xs font-bold text-red-600 uppercase tracking-wider block mb-1">Motivo do Alerta</span>
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {internalReport.tags.map((tag, idx) => (
                                                <span key={idx} className="bg-white border border-red-200 text-red-700 px-2 py-0.5 rounded text-xs font-semibold shadow-sm">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                        <p className="text-sm text-slate-700 italic border-l-2 border-brand-accent pl-3">"{internalReport.description}"</p>
                                    </div>
                                    <div className="text-sm pt-4 border-t border-slate-100">
                                        <p className="text-slate-500 flex justify-between mb-1">Registrado por: <span className="font-semibold text-slate-800">Locador Anônimo</span></p>
                                        <p className="text-slate-500 flex justify-between mb-1">Localidade: <span className="font-semibold text-slate-800">{internalReport.city} - {internalReport.state}</span></p>
                                        <p className="text-slate-500 flex justify-between">Dívida declarada: <span className="font-bold text-red-600">
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(internalReport.debtValue)}
                                        </span></p>
                                    </div>
                                    <Link to={`/perfil/${internalReport.id}`} className="mt-6 block w-full text-center bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 rounded-lg transition-colors text-sm">
                                        Ver Dossiê Completo
                                    </Link>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-emerald-600 py-10 text-center">
                                    <CheckCircle2 className="w-12 h-12 mb-3 opacity-50" />
                                    <h3 className="font-bold mb-1">Limpo na Rede Interna</h3>
                                    <p className="text-sm text-emerald-800/70">Nenhum locador reportou problemas com este CPF na nossa plataforma colaborativa.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* COL 2: Judicial Processes */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                        <div className="bg-slate-200 text-slate-800 p-4 flex items-center gap-3 border-b border-slate-300">
                            <Scale className="w-6 h-6 text-slate-700" />
                            <h2 className="font-bold text-lg">Busca Extra-Judicial</h2>
                        </div>
                        <div className="p-0 flex-grow bg-slate-50/50">
                            {loadingLegal ? (
                                <div className="flex flex-col items-center justify-center h-full text-slate-400 py-16">
                                    <Loader2 className="w-8 h-8 animate-spin mb-3" />
                                    <p className="text-sm font-medium">Lendo diários oficiais dos Tribunais...</p>
                                </div>
                            ) : legalProcesses.length > 0 ? (
                                <div className="divide-y divide-slate-200">
                                    {legalProcesses.map((proc) => (
                                        <div key={proc.id} className="p-5 hover:bg-white transition-colors">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="text-xs font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded">{proc.court}</span>
                                                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full
                                                    ${proc.status === 'Em Andamento' ? 'bg-orange-100 text-orange-700' : 'bg-slate-200 text-slate-600'}`
                                                }>
                                                    {proc.status}
                                                </span>
                                            </div>
                                            <h4 className="font-bold text-slate-800 text-sm leading-snug mb-1">{proc.type}</h4>
                                            <p className="text-xs text-slate-500 font-mono mb-2">Processo nº: {proc.cnjNumber}</p>
                                            <p className="text-xs text-slate-600 line-clamp-2">{proc.description}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-slate-400 py-16 text-center px-6">
                                    <CheckCircle2 className="w-12 h-12 mb-3 opacity-30" />
                                    <h3 className="font-bold text-slate-600 mb-1">Nada Encontrado</h3>
                                    <p className="text-xs text-slate-500">A busca em diários de justiça de 1ª instância não retornou apontamentos graves nesta data.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* COL 3: Credit Protection Bureau */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                        <div className="bg-slate-200 text-slate-800 p-4 flex items-center gap-3 border-b border-slate-300">
                            <BadgeDollarSign className="w-6 h-6 text-slate-700" />
                            <h2 className="font-bold text-lg">Birôs de Crédito</h2>
                        </div>
                        <div className="p-0 flex-grow bg-slate-50/50">
                            {loadingCredit ? (
                                <div className="flex flex-col items-center justify-center h-full text-slate-400 py-16">
                                    <Loader2 className="w-8 h-8 animate-spin mb-3" />
                                    <p className="text-sm font-medium">Consultando SPC, Serasa e afins...</p>
                                </div>
                            ) : creditRestrictions.length > 0 ? (
                                <div className="divide-y divide-slate-200">
                                    {creditRestrictions.map((req, idx) => (
                                        <div key={idx} className="p-5 hover:bg-white transition-colors flex items-center gap-4">
                                            <div className="bg-red-100 text-red-600 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                                                <BadgeDollarSign className="w-6 h-6" />
                                            </div>
                                            <div className="flex-grow">
                                                <div className="flex justify-between items-center mb-1">
                                                    <h4 className="font-bold text-slate-800 text-sm">{req.creditor}</h4>
                                                    <span className="text-xs font-bold text-slate-500">{req.source}</span>
                                                </div>
                                                <p className="text-lg font-black text-red-600">
                                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(req.value)}
                                                </p>
                                                <p className="text-[10px] text-slate-400 uppercase tracking-wider mt-1">Apontado em: {new Date(req.date).toLocaleDateString('pt-BR')}</p>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="p-4 bg-yellow-50 text-yellow-800 text-xs text-center border-t border-yellow-200">
                                        <p className="font-semibold flex items-center justify-center gap-1">
                                            <AlertTriangle className="w-4 h-4" /> Score de Crédito Prejudicado
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-slate-400 py-16 text-center px-6">
                                    <CheckCircle2 className="w-12 h-12 mb-3 opacity-30" />
                                    <h3 className="font-bold text-slate-600 mb-1">Nome Limpo</h3>
                                    <p className="text-xs text-slate-500">Sem negatições ativas nos bureaus (SPC/Serasa/BoaVista) ligados a esse documento.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* COL 4: KYC & Fraude */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                        <div className="bg-slate-200 text-slate-800 p-4 flex items-center gap-3 border-b border-slate-300">
                            <UserCheck className="w-6 h-6 text-slate-700" />
                            <h2 className="font-bold text-lg">Biometria & KYC</h2>
                        </div>
                        <div className="p-6 flex-grow bg-slate-50/50">
                            {loadingKyc ? (
                                <div className="flex flex-col items-center justify-center h-full text-slate-400 py-16">
                                    <Loader2 className="w-8 h-8 animate-spin mb-3" />
                                    <p className="text-sm font-medium">Cruzando dados na Receita...</p>
                                </div>
                            ) : kycData ? (
                                <div className="space-y-4">
                                    <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Filiação Verificada</h4>
                                        <p className="text-sm font-medium text-slate-800 mb-1"><span className="text-slate-500">Pai:</span> {kycData.fatherName}</p>
                                        <p className="text-sm font-medium text-slate-800"><span className="text-slate-500">Mãe:</span> {kycData.motherName}</p>
                                    </div>

                                    {(kycData.phoneAlert || kycData.addressAlert) ? (
                                        <div className="space-y-3">
                                            {kycData.phoneAlert && (
                                                <div className="bg-orange-50 border-l-4 border-orange-400 p-3 rounded-r-lg text-sm text-orange-800">
                                                    <span className="font-bold flex items-center gap-1 mb-1"><AlertTriangle className="w-4 h-4" /> Alerta Telefônico</span>
                                                    {kycData.phoneAlert.replace('⚠️ ', '')}
                                                </div>
                                            )}
                                            {kycData.addressAlert && (
                                                <div className="bg-red-50 border-l-4 border-red-400 p-3 rounded-r-lg text-sm text-red-800">
                                                    <span className="font-bold flex items-center gap-1 mb-1"><AlertTriangle className="w-4 h-4" /> Alerta de Domicílios</span>
                                                    {kycData.addressAlert.replace('⚠️ ', '')}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-6 text-emerald-600 text-center">
                                            <CheckCircle2 className="w-8 h-8 mb-2 opacity-50" />
                                            <p className="text-xs text-emerald-800 text-center font-medium">Comportamento de dados cadastrais dentro da normalidade.</p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-slate-400 py-16 text-center px-4">
                                    <AlertTriangle className="w-12 h-12 mb-3 opacity-30" />
                                    <p className="text-xs text-slate-500">Não foi possível localizar KYC.</p>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
