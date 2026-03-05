import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { database } from '../data/mockDatabase';
import { AlertCircle, Calendar, EyeOff, MapPin, Target } from 'lucide-react';

export default function Profile() {
    const { id } = useParams<{ id: string }>();
    const profile = database.find(p => p.id === id);
    const [showEvidence, setShowEvidence] = useState(false);

    if (!profile) return <div className="p-20 text-center font-bold">Perfil não encontrado.</div>;

    return (
        <div className="bg-slate-100 min-h-screen pb-12">
            {/* Banner de Risco */}
            <div className="bg-brand-accent text-white py-12 px-4 shadow-inner">
                <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8">
                    <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center border-4 border-white/40 shrink-0 overflow-hidden shadow-xl">
                        {profile.photoUrl ? (
                            <img src={profile.photoUrl} alt={`Foto de ${profile.name}`} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-4xl">👤</span>
                        )}
                    </div>
                    <div className="text-center md:text-left">
                        <h1 className="text-3xl font-black mb-2 uppercase tracking-tight">{profile.name}</h1>
                        <p className="text-red-200 text-lg flex items-center justify-center md:justify-start gap-2">
                            <Target className="w-5 h-5" /> CPF Envolvido: {profile.cpf}
                        </p>
                    </div>
                    <div className="md:ml-auto text-center bg-black/30 rounded-xl p-4 min-w-[150px]">
                        <p className="text-xs uppercase font-bold text-red-200 tracking-wider">Status Nasc.</p>
                        <p className="text-2xl font-black uppercase text-red-400">ALTO RISCO</p>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 mt-[-2rem] relative z-10">
                {/* Timeline Evento Principal */}
                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                    <div className="p-8">
                        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mb-6 border-b pb-4">
                            <div className="flex items-center gap-1 font-semibold"><Calendar className="w-4 h-4" /> Data do BO: {profile.createdAt}</div>
                            <div className="flex items-center gap-1 font-semibold"><MapPin className="w-4 h-4" /> Local: {profile.city}-{profile.state}</div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-6">
                            {profile.tags.map(tag => (
                                <span key={tag} className="bg-red-50 text-red-800 text-xs font-black uppercase px-3 py-1 rounded-full border border-red-200">
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <h3 className="text-lg font-bold text-slate-800 mb-2">Relato do Proprietário Afetado:</h3>
                        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 text-slate-700 text-lg leading-relaxed italic border-l-4 border-l-brand-accent">
                            "{profile.description}"
                        </div>

                        {profile.debtValue > 0 && (
                            <div className="mt-8 bg-brand-dark text-white p-4 rounded-xl flex items-center justify-between">
                                <span className="font-bold">Prejuízo Financeiro / Calote Declarado:</span>
                                <span className="text-2xl font-black text-red-400 tracking-tighter">R$ {profile.debtValue.toLocaleString('pt-BR')}</span>
                            </div>
                        )}
                    </div>

                    {/* Galeria de Provas Blindada */}
                    <div className="bg-slate-800 p-8 text-center text-white relative overflow-hidden group">
                        {!showEvidence ? (
                            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md flex flex-col items-center justify-center z-10 transition-all">
                                <EyeOff className="w-12 h-12 mb-4 text-slate-400" />
                                <h4 className="text-xl font-bold mb-2">Censura de Provas Ativa</h4>
                                <p className="text-sm text-slate-400 mb-6 max-w-sm">Imagens sensíveis e laudos periciais estão ocultos.</p>
                                <button
                                    onClick={() => setShowEvidence(true)}
                                    className="bg-brand-accent font-bold py-3 px-8 rounded-full hover:bg-red-600 transition shadow-lg shadow-red-900/50"
                                >
                                    Revelar Anexos Ocultos
                                </button>
                            </div>
                        ) : null}

                        {/* Conteudo Sensivel (Oculto por padrao) */}
                        <div className={`transition-all duration-1000 ${showEvidence ? 'opacity-100 blur-none' : 'opacity-20 blur-xl pointer-events-none'}`}>
                            <h4 className="text-lg font-bold flex items-center justify-center gap-2 mb-6 text-brand-accent">
                                <AlertCircle /> Acervo Probatório do Proprietário (1)
                            </h4>
                            {profile.youtubeLink ? (
                                <div className="aspect-video w-full max-w-2xl mx-auto rounded-lg overflow-hidden border border-slate-700 bg-black flex items-center justify-center">
                                    <a href={profile.youtubeLink} className="text-blue-400 underline font-bold" target="_blank">📺 Assistir Compilado de Danos no YouTube</a>
                                </div>
                            ) : (
                                <div className="py-20 bg-slate-700 rounded-lg text-slate-400">Nenhum laudo pericial anexado.</div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <Link to="/" className="text-slate-500 font-bold hover:text-brand-dark transition underline">← Fazer nova busca de inquilino</Link>
                </div>
            </div>
        </div>
    );
}
