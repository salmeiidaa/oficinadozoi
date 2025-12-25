import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Car, Phone, FileText, Home } from 'lucide-react';
import './DashboardDono.css';

const DashboardDono = () => {
  const [agendamentos, setAgendamentos] = useState([]);

  const agendamentosMock = [
    {
      id: '1',
      modeloCarro: 'Ford Ka',
      anoCarro: '2018',
      descricaoProblema: 'Barulho estranho no motor',
      dataSelecionada: '2024-12-27',
      horarioSelecionado: '09:00',
      criadoEm: '2024-12-25T10:30:00'
    },
    {
      id: '2',
      modeloCarro: 'Volkswagen Gol',
      anoCarro: '2020',
      descricaoProblema: 'Troca de óleo',
      dataSelecionada: '2024-12-27',
      horarioSelecionado: '14:00',
      criadoEm: '2024-12-24T15:20:00'
    }
  ];

  useEffect(() => {
    setAgendamentos(agendamentosMock);
  }, []);

  const formatarData = (dataISO) => {
    const data = new Date(dataISO + 'T00:00:00');
    return data.toLocaleDateString('pt-BR', { 
      weekday: 'long', 
      day: '2-digit', 
      month: 'long' 
    });
  };

  return (
    <div className="dashboard-oficina">
      <div className="dashboard-header-oficina">
        <h1>📊 Painel de Agendamentos</h1>
        <a href="/" className="btn-voltar-home">
          <Home size={18} /> Voltar para agendamento
        </a>
      </div>

      <div className="info-box">
        <p>💡 <strong>Atenção:</strong> Os agendamentos são enviados diretamente para o WhatsApp. Este painel mostra exemplos de como os dados aparecerão.</p>
      </div>

      <div className="agendamentos-lista-oficina">
        {agendamentos.length === 0 ? (
          <div className="sem-agendamentos-oficina">
            <Calendar size={48} />
            <p>Nenhum agendamento no momento</p>
          </div>
        ) : (
          agendamentos.map(ag => (
            <div key={ag.id} className="agendamento-card-oficina">
              <div className="card-header-oficina">
                <div className="data-info">
                  <Calendar size={20} />
                  <div>
                    <strong>{formatarData(ag.dataSelecionada)}</strong>
                    <div className="horario-badge">
                      <Clock size={16} /> {ag.horarioSelecionado}
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-body-oficina">
                <div className="info-item-oficina">
                  <Car size={18} />
                  <div>
                    <label>Veículo</label>
                    <p>{ag.modeloCarro} - {ag.anoCarro}</p>
                  </div>
                </div>

                <div className="info-item-oficina">
                  <FileText size={18} />
                  <div>
                    <label>Problema</label>
                    <p>{ag.descricaoProblema}</p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DashboardDono;
