"use client";
import { useState, useEffect } from "react";

export default function AdminPanel() {
  const [licencas, setLicencas] = useState([]);
  const [formData, setFormData] = useState({ cliente_id: "", email: "", nome: "", plano: "1_MES", marketing_mode: false });
  const [bulkDays, setBulkDays] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLicencas();
  }, []);

  const fetchLicencas = async () => {
    const res = await fetch("/api/licencas");
    const data = await res.json();
    setLicencas(data);
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch("/api/licencas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    setFormData({ cliente_id: "", email: "", nome: "", plano: "1_MES", marketing_mode: false });
    fetchLicencas();
  };

  const handleAction = async (id, data) => {
    await fetch(`/api/licencas/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    fetchLicencas();
  };

  const handleDelete = async (id) => {
    if (!confirm("Excluir licença permanentemente?")) return;
    await fetch(`/api/licencas/${id}`, { method: "DELETE" });
    fetchLicencas();
  };

  const handleBulkAdd = async () => {
    if (!confirm(`Adicionar ${bulkDays} dias para TODOS?`)) return;
    await fetch("/api/licencas/bulk-add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ days: bulkDays }),
    });
    fetchLicencas();
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8 font-sans">
      <h1 className="text-3xl font-bold mb-8 text-center text-cyan-400">🚀 SALVATORE ADMIN</h1>

      {/* Form Criar */}
      <div className="bg-slate-800 p-6 rounded-xl shadow-lg mb-8 border border-slate-700">
        <h2 className="text-xl font-semibold mb-4 text-cyan-300">Nova Licença</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
          <input type="number" placeholder="ID" className="bg-slate-700 p-2 rounded border border-slate-600 outline-none focus:border-cyan-500" value={formData.cliente_id} onChange={e => setFormData({...formData, cliente_id: e.target.value})} required />
          <input type="text" placeholder="Nome" className="bg-slate-700 p-2 rounded border border-slate-600 outline-none focus:border-cyan-500" value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})} required />
          <input type="email" placeholder="E-mail" className="bg-slate-700 p-2 rounded border border-slate-600 outline-none focus:border-cyan-500" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
          <select className="bg-slate-700 p-2 rounded border border-slate-600 outline-none" value={formData.plano} onChange={e => setFormData({...formData, plano: e.target.value})}>
            <option value="TESTE">Teste (24h)</option>
            <option value="1_MES">Mensal (30 dias)</option>
            <option value="3_MESES">Trimestral (90 dias)</option>
            <option value="VITALICIO">Vitalício</option>
          </select>
          <label className="flex items-center space-x-2 cursor-pointer bg-slate-700 p-2 rounded border border-slate-600">
            <input type="checkbox" checked={formData.marketing_mode} onChange={e => setFormData({...formData, marketing_mode: e.target.checked})} className="form-checkbox h-5 w-5 text-cyan-500" />
            <span className="text-sm">Fake Real</span>
          </label>
          <button type="submit" className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded transition">GERAR</button>
        </form>
      </div>

      {/* Bulk Add */}
      <div className="bg-slate-800 p-6 rounded-xl shadow-lg mb-8 border border-slate-700 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-cyan-300">Ações em Massa</h2>
          <p className="text-slate-400 text-sm">Adicionar dias para todos os clientes ativos (exceto vitalícios).</p>
        </div>
        <div className="flex items-center space-x-4">
          <input type="number" className="bg-slate-700 p-2 rounded border border-slate-600 w-20 outline-none" value={bulkDays} onChange={e => setBulkDays(e.target.value)} />
          <button onClick={handleBulkAdd} className="bg-orange-600 hover:bg-orange-500 py-2 px-6 rounded font-bold transition">ADD DIAS PARA TODOS</button>
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-700 text-cyan-300">
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">Nome / Email</th>
              <th className="p-4">Vencimento</th>
              <th className="p-4">Status</th>
              <th className="p-4">Marketing</th>
              <th className="p-4 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {licencas.map(lic => (
              <tr key={lic._id} className="border-t border-slate-700 hover:bg-slate-750 transition">
                <td className="p-4 font-mono">{lic.cliente_id}</td>
                <td className="p-4">
                  <div className="font-bold">{lic.nome}</div>
                  <div className="text-sm text-slate-400">{lic.email}</div>
                </td>
                <td className="p-4">
                  {lic.vitalicio ? <span className="text-yellow-400 font-bold">VITALÍCIO</span> : new Date(lic.vencimento).toLocaleDateString()}
                </td>
                <td className="p-4">
                  <button onClick={() => handleAction(lic._id, { ativa: !lic.ativa })} className={`px-3 py-1 rounded text-xs font-bold ${lic.ativa ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                    {lic.ativa ? 'ATIVA' : 'INATIVA'}
                  </button>
                </td>
                <td className="p-4">
                  <button onClick={() => handleAction(lic._id, { marketing_mode: !lic.marketing_mode })} className={`px-3 py-1 rounded text-xs font-bold ${lic.marketing_mode ? 'bg-purple-600 text-white' : 'bg-slate-600 text-slate-300'}`}>
                    {lic.marketing_mode ? 'ON (FAKE)' : 'OFF'}
                  </button>
                </td>
                <td className="p-4 flex justify-center space-x-2">
                  <button onClick={() => handleAction(lic._id, { hardware_id: null })} className="bg-slate-600 hover:bg-slate-500 px-3 py-1 rounded text-xs font-bold" title="Resetar PC">HWID</button>
                  <button onClick={() => handleDelete(lic._id)} className="bg-red-900 hover:bg-red-700 px-3 py-1 rounded text-xs font-bold">EXCLUIR</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
