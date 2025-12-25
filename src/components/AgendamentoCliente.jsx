import React, { useState } from 'react';
import { Calendar, Clock } from 'lucide-react';
import './AgendamentoCliente.css';

const AgendamentoCliente = () => {
  const [agendamento, setAgendamento] = useState({
    dataSelecionada: '',
    horarioSelecionado: '',
    modeloCarro: '',
    anoCarro: '',
    descricaoProblema: ''
  });

  const horariosDisponiveis = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];

  const gerarDatasDisponiveis = () => {
    const datas = [];
    const hoje = new Date();
    for (let i = 0; i < 30; i++) {
      const data = new Date(hoje);
      data.setDate(hoje.getDate() + i);
      datas.push({
        valor: data.toISOString().split('T')[0],
        label: data.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' })
      });
    }
    return datas;
  };

  const datasDisponiveis = gerarDatasDisponiveis();

  const handleChange = (e) => {
    setAgendamento(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const formularioCompleto = () => {
    return agendamento.dataSelecionada && 
           agendamento.horarioSelecionado && 
           agendamento.modeloCarro.trim() && 
           agendamento.anoCarro.trim() && 
           agendamento.descricaoProblema.trim();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const whatsapp = '5571994063730';
    const mensagem = `Olá, quero agendar um horário na oficina.%0A%0A` +
                    `Dia: ${agendamento.dataSelecionada}%0A` +
                    `Horário: ${agendamento.horarioSelecionado}%0A` +
                    `Modelo do carro: ${agendamento.modeloCarro}%0A` +
                    `Ano do carro: ${agendamento.anoCarro}%0A` +
                    `Descrição do problema: ${agendamento.descricaoProblema}`;
    
    window.open(`https://wa.me/${whatsapp}?text=${mensagem}`, '_blank');
  };

  return (
    <div className="oficina-container">
      <div className="oficina-box">
        <header className="oficina-header">
          <img src="https://i.postimg.cc/cHtTFJnY/Whats-App-Image-2025-07-25-at-10-57-00.jpg" alt="Felipe Zoi - Mecânica em Geral" />
          <h1>Agende seu horário</h1>
        </header>

        <form onSubmit={handleSubmit} className="oficina-form">
          <label htmlFor="dataSelecionada">
            <Calendar size={18} /> Escolha o dia
          </label>
          <select id="dataSelecionada" name="dataSelecionada" value={agendamento.dataSelecionada} onChange={handleChange} required>
            <option value="">Selecione um dia</option>
            {datasDisponiveis.map(data => (
              <option key={data.valor} value={data.valor}>{data.label}</option>
            ))}
          </select>

          <label htmlFor="horarioSelecionado">
            <Clock size={18} /> Escolha o horário
          </label>
          <select id="horarioSelecionado" name="horarioSelecionado" value={agendamento.horarioSelecionado} 
                  onChange={handleChange} disabled={!agendamento.dataSelecionada} required>
            <option value="">Selecione um horário</option>
            {horariosDisponiveis.map(hora => (
              <option key={hora} value={hora}>{hora}</option>
            ))}
          </select>

          <label htmlFor="modeloCarro">Modelo do carro</label>
          <input type="text" id="modeloCarro" name="modeloCarro" value={agendamento.modeloCarro} 
                 onChange={handleChange} placeholder="Ex: Ford Ka" required />

          <label htmlFor="anoCarro">Ano do carro</label>
          <input type="number" id="anoCarro" name="anoCarro" value={agendamento.anoCarro} 
                 onChange={handleChange} placeholder="Ex: 2018" min="1900" max="2100" required />

          <label htmlFor="descricaoProblema">Descrição do problema</label>
          <textarea id="descricaoProblema" name="descricaoProblema" value={agendamento.descricaoProblema} 
                    onChange={handleChange} placeholder="Descreva o problema do carro" rows="4" required />

          <button type="submit" className="submit-btn" disabled={!formularioCompleto()}>
            Enviar pelo WhatsApp
          </button>
        </form>

        <p className="footer-note">* Preencha todos os campos para liberar o envio.</p>
      </div>
    </div>
  );
};

export default AgendamentoCliente;
