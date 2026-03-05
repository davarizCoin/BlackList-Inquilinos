import { Clock } from 'lucide-react';

export default function Admin() {
    return (
        <div className="max-w-5xl mx-auto px-4 py-12">
            <div className="flex justify-between items-end mb-8 border-b pb-4">
                <div>
                    <h2 className="text-3xl font-black text-brand-dark">Centro de Moderação</h2>
                    <p className="text-slate-500">Aprovações pendentes de novos registros da Black List.</p>
                </div>
                <div className="text-sm font-bold bg-slate-800 text-white px-3 py-1 rounded">Logado como Admin</div>
            </div>

            <div className="bg-white shadow-sm border rounded-xl overflow-hidden">
                <ul className="divide-y divide-slate-100">

                    <li className="p-6 hover:bg-slate-50">
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <h4 className="font-bold text-lg text-slate-800">Mariana P. V. (111.***.***-99)</h4>
                                    <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1">
                                        <Clock className="w-3 h-3" /> PENDENTE
                                    </span>
                                </div>
                                <p className="text-slate-600 text-sm mb-3">
                                    <strong>Relato:</strong> O Inquilino furtou as fechaduras importadas da casa, os vasos sanitários,
                                    rachou todos os azulejos do box e desapareceu sem pagar os últimos 2 meses.
                                </p>
                                <div className="flex gap-4 text-xs font-medium text-slate-500">
                                    <span>📍 Rio de Janeiro - RJ</span>
                                    <span>💸 Dívida/Prejuízo: R$ 8.500,00</span>
                                    <a href="https://youtu.be/dummy" target="_blank" className="text-blue-600 underline">Assista ao Vídeo (YouTube)</a>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 min-w-[120px]">
                                <button className="bg-green-600 text-white px-3 py-2 rounded-lg font-bold hover:bg-green-700 w-full text-center">
                                    APROVAR
                                </button>
                                <button className="bg-slate-200 text-slate-600 px-3 py-2 rounded-lg font-bold hover:bg-slate-300 w-full text-center">
                                    REJEITAR
                                </button>
                            </div>
                        </div>
                    </li>

                </ul>
            </div>
        </div>
    );
}
