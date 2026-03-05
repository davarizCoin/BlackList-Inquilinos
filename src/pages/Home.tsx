import React, { useState, useEffect } from 'react';
import { Search, MapPin, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { database } from '../data/mockDatabase';

export default function Home() {
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    // Sistema de Publicidade Dinâmica (Loop)
    const [currentAdIndex, setCurrentAdIndex] = useState(0);
    const ads = [
        {
            title: "Seguro Fiança Locatícia Premium",
            desc: "Garanta seus aluguéis mesmo se ele não pagar. Cotação Rápida!",
            btnText: "Cotar Agora",
            bgColors: "from-blue-900 to-blue-700",
            btnColors: "bg-yellow-500 text-blue-900 hover:bg-yellow-400",
            link: "#"
        },
        {
            title: "Anuncie sua Empresa Aqui",
            desc: "Atingimos milhares de proprietários e imobiliárias todos os dias.",
            btnText: "Falar com Vendas",
            bgColors: "from-slate-800 to-slate-900",
            btnColors: "bg-brand-accent text-white hover:bg-red-700",
            link: "mailto:vendas@blacklistinquilinos.com.br"
        },
        {
            title: "Assessoria Jurídica de Despejo",
            desc: "Especialistas em retomada rápida de imóveis com danos materiais.",
            btnText: "Falar c/ Especialista",
            bgColors: "from-slate-900 to-brand-dark",
            btnColors: "bg-slate-200 text-brand-dark hover:bg-white",
            link: "#"
        },
        {
            title: "Vistoria Imobiliária com Laudo",
            desc: "Blinde seu contrato de locação com vistorias completas e validade legal.",
            btnText: "Agendar Vistoria",
            bgColors: "from-teal-900 to-emerald-800",
            btnColors: "bg-white text-teal-900 hover:bg-emerald-50",
            link: "#"
        }
    ];

    useEffect(() => {
        const adTimer = setInterval(() => {
            setCurrentAdIndex((prev) => (prev + 1) % ads.length);
        }, 5000); // Roda a cada 5 segundos
        return () => clearInterval(adTimer);
    }, [ads.length]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();

        // Remove espaços em branco
        const rawTerm = searchTerm.trim();
        if (rawTerm.length < 3) {
            alert('Por favor, digite pelo menos 3 caracteres para buscar por Nome ou os 11 números para buscar por CPF.');
            return;
        }

        // Verifica se é apenas números (CPF) ou Nome
        const isCpfSearch = /^\d+$/.test(rawTerm.replace(/[.-]/g, ''));

        let result;

        if (isCpfSearch) {
            // Se for CPF, pega apenas os números
            const cleanCpf = rawTerm.replace(/[^0-9]/g, '');
            if (cleanCpf.length !== 11) {
                alert('O CPF deve conter exatamente 11 números.');
                return;
            }
            result = database.find(p => p.cpf === cleanCpf && p.approved);
        } else {
            // Busca por nome
            result = database.find(p => p.name.toLowerCase().includes(rawTerm.toLowerCase()) && p.approved);
        }

        if (result) {
            navigate(`/perfil/${result.id}`);
        } else {
            alert('Nenhum registro aprovado encontrado para esse termo.');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center pt-24">
            {/* Hero Section */}
            <div className="max-w-3xl w-full text-center px-4">
                <h1 className="text-4xl md:text-5xl font-black text-brand-dark tracking-tight mb-4">
                    Proteja o seu patrimônio. <br />
                    <span className="text-brand-accent">Consulte o histórico do seu locatário.</span>
                </h1>
                <p className="text-lg text-slate-500 mb-10">
                    A maior lista inter-estadual de restrição a maus inquilinos do Brasil. Consultas 100% sigilosas e análises factuais.
                </p>

                {/* Search Bar */}
                <form onSubmit={handleSearch} className="flex w-full mb-16 shadow-2xl rounded-full bg-white border-2 border-slate-200 overflow-hidden focus-within:border-brand-accent transition-colors">
                    <input
                        type="text"
                        placeholder="Digite o Nome Completo ou CPF..."
                        className="flex-grow px-6 py-4 outline-none text-lg text-slate-800"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button type="submit" className="bg-brand-accent hover:bg-red-800 text-white px-8 md:px-12 flex items-center justify-center transition-colors">
                        <Search className="w-6 h-6" />
                    </button>
                </form>
            </div>

            {/* BANNER 1 PUBLICIDADE (CARROSSEL) */}
            <div className="w-full bg-slate-100 border-y border-slate-200 py-8 my-10 overflow-hidden flex flex-col items-center">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-4">Publicidade</p>

                <div className="relative w-full max-w-4xl h-auto min-h-[140px] px-4">
                    {/* Container de Altura Fixa para não "Pular" a página na transição */}
                    {ads.map((ad, idx) => (
                        <div
                            key={idx}
                            className={`absolute inset-0 px-4 transition-all duration-1000 ease-in-out flex flex-col justify-center
                                ${idx === currentAdIndex ? 'opacity-100 translate-x-0 z-10' : 'opacity-0 translate-x-10 pointer-events-none z-0'}
                            `}
                        >
                            <div
                                onClick={() => window.location.href = ad.link}
                                className={`bg-gradient-to-r ${ad.bgColors} text-white p-6 sm:px-10 rounded-2xl flex flex-col sm:flex-row items-center justify-between shadow-lg cursor-pointer hover:scale-[1.01] transition-transform`}
                            >
                                <div className="text-center sm:text-left mb-4 sm:mb-0">
                                    <h4 className="font-black text-2xl mb-1">{ad.title}</h4>
                                    <p className="text-white/80">{ad.desc}</p>
                                </div>
                                <a
                                    href={ad.link}
                                    onClick={(e) => e.stopPropagation()}
                                    className={`${ad.btnColors} font-bold px-8 py-3 rounded-lg shadow-md whitespace-nowrap text-center block`}
                                >
                                    {ad.btnText}
                                </a>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Dots Identificadores */}
                <div className="flex gap-2 mt-20 sm:mt-8">
                    {ads.map((_, idx) => (
                        <div
                            key={idx}
                            className={`h-2 rounded-full transition-all duration-500 ${idx === currentAdIndex ? 'w-8 bg-brand-accent' : 'w-2 bg-slate-300'}`}
                        />
                    ))}
                </div>
            </div>

            {/* Info Cards */}
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center">
                    <div className="bg-red-50 text-brand-accent w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertTriangle className="w-8 h-8" />
                    </div>
                    <h3 className="font-bold text-lg mb-2 text-brand-dark">Denúncias Verificadas</h3>
                    <p className="text-slate-500 text-sm">Só aceitamos relatórios com provas físicas (fotos, vídeos ou BO), garantindo o máximo de assertividade e sem difamação gratuita.</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center">
                    <div className="bg-blue-50 text-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MapPin className="w-8 h-8" />
                    </div>
                    <h3 className="font-bold text-lg mb-2 text-brand-dark">Base Nacional</h3>
                    <p className="text-slate-500 text-sm">Problemas com inadimplentes no Rio ou inquilinos destrutivos em São Paulo? Tudo centralizado e atualizado por donos de imóveis.</p>
                </div>
                <div className="bg-brand-dark text-white p-6 rounded-2xl shadow-lg border border-slate-800 text-center flex flex-col justify-center">
                    <h3 className="font-black text-xl mb-3">Teve o imóvel depredado?</h3>
                    <p className="text-slate-400 text-sm mb-6">Cadastre o CPF na lista negra anonimamente e evite que outros passem pelo que você passou.</p>
                    <a href="/reportar" className="bg-brand-accent text-white py-2 rounded-lg font-bold hover:bg-red-700 transition">Denunciar Agora</a>
                </div>
            </div>
        </div>
    );
}
