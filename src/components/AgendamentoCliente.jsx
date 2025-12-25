import React, { useState } from 'react';
import { Calendar, Clock, Car, User, Phone, FileText, CheckCircle } from 'lucide-react';
import './AgendamentoCliente.css';

const AgendamentoCliente = () => {
  const [etapa, setEtapa] = useState(1);
  const [agendamento, setAgendamento] = useState({
    nomeCliente: '', telefone: '', marca: '', modelo: '', ano: '', placa: '',
    descricaoProblema: '', dataSelecionada: '', horarioSelecionado: ''
  });

  const horariosDisponiveis = ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

  const gerarDatasDisponiveis = () => {
    const datas = [];
    const hoje = new Date();
    for (let i = 1; i <= 30; i++) {
      const data = new Date(hoje);
      data.setDate(hoje.getDate() + i);
      if (data.getDay() !== 0) {
        datas.push({
          data: data.toISOString().split('T')[0],
          diaSemana: data.toLocaleDateString('pt-BR', { weekday: 'long' }),
          diaFormatado: data.toLocaleDateString('pt-BR')
        });
      }
    }
    return datas;
  };

  const datasDisponiveis = gerarDatasDisponiveis();

  const handleInputChange = (e) => {
    setAgendamento(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    alert('Agendamento realizado com sucesso!');
    setAgendamento({
      nomeCliente: '', telefone: '', marca: '', modelo: '', ano: '', placa: '',
      descricaoProblema: '', dataSelecionada: '', horarioSelecionado: ''
    });
    setEtapa(1);
  };

  const podeAvancar = () => {
    if (etapa === 1) return agendamento.nomeCliente && agendamento.telefone;
    if (etapa === 2) return agendamento.marca && agendamento.modelo && agendamento.ano;
    if (etapa === 3) return agendamento.descricaoProblema;
    if (etapa === 4) return agendamento.dataSelecionada && agendamento.horarioSelecionado;
    return false;
  };

  return (
    <div className="agendamento-container">
      <div className="agendamento-header">
        <Car size={40} className="logo-icon" />
        <h1>Oficina Mecânica</h1>
        <p>Agende seu atendimento de forma rápida e prática</p>
      </div>

      <div className="progress-bar">
        {[1,2,3,4].map(num => (
          <div key={num} className={`progress-step ${etapa >= num ? 'active' : ''}`}>
            <div className="step-number">{num}</div>
            <span>{['Seus Dados','Veículo','Problema','Data/Hora'][num-1]}</span>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="agendamento-form">
        {etapa === 1 && (
          <div className="form-section">
            <h2><User size={24} /> Seus Dados</h2>
            <div className="form-group">
              <label>Nome Completo *</label>
              <input type="text" name="nomeCliente" value={agendamento.nomeCliente} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label>Telefone/WhatsApp *</label>
              <input type="tel" name="telefone" value={agendamento.telefone} onChange={handleInputChange} required />
            </div>
          </div>
        )}

        {etapa === 2 && (
          <div className="form-section">
            <h2><Car size={24} /> Dados do Veículo</h2>
            <div className="form-row">
              <div className="form-group">
                <label>Marca *</label>
                <input type="text" name="marca" value={agendamento.marca} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Modelo *</label>
                <input type="text" name="modelo" value={agendamento.modelo} onChange={handleInputChange} required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Ano *</label>
                <input type="text" name="ano" value={agendamento.ano} onChange={handleInputChange} maxLength="4" required />
              </div>
              <div className="form-group">
                <label>Placa (opcional)</label>
                <input type="text" name="placa" value={agendamento.placa} onChange={handleInputChange} maxLength="8" />
              </div>
            </div>
          </div>
        )}

        {etapa === 3 && (
          <div className="form-section">
            <h2><FileText size={24} /> Descreva o Problema</h2>
            <div className="form-group">
              <label>O que está acontecendo com seu veículo? *</label>
              <textarea name="descricaoProblema" value={agendamento.descricaoProblema} onChange={handleInputChange} rows="6" required />
              <small>Quanto mais detalhes, melhor poderemos te ajudar!</small>
            </div>
          </div>
        )}

        {etapa === 4 && (
          <div className="form-section">
            <h2><Calendar size={24} /> Escolha Data e Horário</h2>
            <div className="form-group">
              <label>Selecione o dia *</label>
              <div className="data-grid">
                {datasDisponiveis.slice(0, 10).map((item) => (
                  <button key={item.data} type="button" 
                    className={`data-card ${agendamento.dataSelecionada === item.data ? 'selected' : ''}`}
                    onClick={() => setAgendamento(prev => ({ ...prev, dataSelecionada: item.data }))}>
                    <div className="data-dia">{item.diaSemana}</div>
                    <div className="data-numero">{item.diaFormatado}</div>
                  </button>
                ))}
              </div>
            </div>
            {agendamento.dataSelecionada && (
              <div className="form-group">
                <label>Selecione o horário *</label>
                <div className="horario-grid">
                  {horariosDisponiveis.map((horario) => (
                    <button key={horario} type="button"
                      className={`horario-card ${agendamento.horarioSelecionado === horario ? 'selected' : ''}`}
                      onClick={() => setAgendamento(prev => ({ ...prev, horarioSelecionado: horario }))}>
                      <Clock size={18} /> {horario}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="form-actions">
          {etapa > 1 && <button type="button" className="btn-secondary" onClick={() => setEtapa(etapa - 1)}>Voltar</button>}
          {etapa < 4 ? (
            <button type="button" className="btn-primary" onClick={() => setEtapa(etapa + 1)} disabled={!podeAvancar()}>Continuar</button>
          ) : (
            <button type="submit" className="btn-success" disabled={!podeAvancar()}>
              <CheckCircle size={20} /> Confirmar Agendamento
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AgendamentoCliente;
