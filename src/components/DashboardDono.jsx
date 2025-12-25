import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Car, User, Phone, FileText, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import './DashboardDono.css';

const DashboardDono = () => {
  const [agendamentos, setAgendamentos] = useState([]);
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [filtroData, setFiltroData] = useState('');
  const [estatisticas, setEstatisticas] = useState({
    total: 0,
    pendentes: 0,
    confirmados: 0,
    cancelados: 0
  });

  const agendamentosMock = [
    {
      id: '1',
      nomeCliente: 'João Silva',
      telefone: '(71) 98765-4321',
      marca: 'Fiat',
      modelo: 'Uno',
      ano: '2018',
      placa: 'ABC-1234',
      descricaoProblema: 'Barulho estranho no motor ao acelerar, luz de injeção acesa',
      dataSelecionada: '2024-12-27',
      horarioSelecionado: '09:00',
      status: 'pendente',
      criadoEm: '2024-12-25T10:30:00'
    },
    {
      id: '2',
      nomeCliente: 'Maria Santos',
      telefone: '(71) 99876-5432',
      marca: 'Volkswagen',
      modelo: 'Gol',
      ano: '2020',
      placa: 'XYZ-5678',
      descricaoProblema: 'Troca de óleo e revisão dos 10.000 km',
      dataSelecionada: '2024-12-27',
      horarioSelecionado: '14:00',
      status: 'confirmado',
      criadoEm: '2024-12-24T15:20:00'
    },
    {
      id: '3',
      nomeCliente: 'Carlos Oliveira',
      telefone: '(71) 97654-3210',
      marca: 'Chevrolet',
      modelo: 'Onix',
      ano: '2022',
      placa: 'DEF-9012',
      descricaoProblema: 'Freio fazendo barulho, pastilhas precisam ser verificadas',
      dataSelecionada: '2024-12-28',
      horarioSelecionado: '10:00',
      status: 'pendente',
      criadoEm: '2024-12-25T09:15:00'
    }
  ];

  useEffect(() => {
    setAgendamentos(agendamentosMock);
    calcularEstatisticas(agendamentosMock);
  }, []);

  const calcularEstatisticas = (dados) => {
    setEstatisticas({
      total: dados.length,
      pendentes: dados.filter(a => a.status === 'pendente').length,
      confirmados: dados.filter(a => a.status === 'confirmado').length,
      cancelados: dados.filter(a => a.status === 'cancelado').length
    });
  };

  const atualizarStatus = (id, novoStatus) => {
    const novosAgendamentos = agendamentos.map(ag => 
      ag.id === id ? { ...ag, status: novoStatus } : ag
    );
    setAgendamentos(novosAgendamentos);
    calcularEstatisticas(novosAgendamentos);
    console.log(`Agendamento ${id} atualizado para: ${novoStatus}`);
  };

  const agendamentosFiltrados = agendamentos.filter(ag => {
    const passaFiltroStatus = filtroStatus === 'todos' || ag.status === filtroStatus;
    const passaFiltroData = !filtroData || ag.dataSelecionada === filtroData;
    return passaFiltroStatus && passaFiltroData;
  });

  const formatarData = (dataISO) => {
    const data = new Date(dataISO + 'T00:00:00');
    return data.toLocaleDateString('pt-BR', { 
      weekday: 'long', 
      day: '2-digit', 
      month: 'long' 
    });
  };

  const getStatusBadge = (status) => {
    const configs = {
      pendente: { color: 'warning', icon: AlertCircle, texto: 'Pendente' },
      confirmado: { color: 'success', icon: CheckCircle, texto: 'Confirmado' },
      cancelado: { color: 'danger', icon: XCircle, texto: 'Cancelado' }
    };
    
    const config = configs[status];
    const Icon = config.icon;
    
    return (
      <span className={`status-badge status-${config.color}`}>
        <Icon size={16} />
        {config.texto}
      </span>
    );
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1>Painel de Agendamentos</h1>
          <p>Gerencie todos os agendamentos da oficina</p>
        </div>
        <a href="/" className="btn-voltar">
          Página de Agendamento
        </a>
      </div>

      <div className="stats-grid">
        <div className="stat-card total">
          <div className="stat-icon">
            <Calendar size={28} />
          </div>
          <div className="stat-info">
            <h3>{estatisticas.total}</h3>
            <p>Total de Agendamentos</p>
          </div>
        </div>

        <div className="stat-card pendente">
          <div className="stat-icon">
            <AlertCircle size={28} />
          </div>
          <div className="stat-info">
            <h3>{estatisticas.pendentes}</h3>
            <p>Pendentes</p>
          </div>
        </div>

        <div className="stat-card confirmado">
          <div className="stat-icon">
            <CheckCircle size={28} />
          </div>
          <div className="stat-info">
            <h3>{estatisticas.confirmados}</h3>
            <p>Confirmados</p>
          </div>
        </div>

        <div className="stat-card cancelado">
          <div className="stat-icon">
            <XCircle size={28} />
          </div>
          <div className="stat-info">
            <h3>{estatisticas.cancelados}</h3>
            <p>Cancelados</p>
          </div>
        </div>
      </div>

      <div className="filtros-container">
        <div className="filtro-group">
          <label>Filtrar por Status:</label>
          <select 
            value={filtroStatus} 
            onChange={(e) => setFiltroStatus(e.target.value)}
            className="filtro-select"
          >
            <option value="todos">Todos</option>
            <option value="pendente">Pendentes</option>
            <option value="confirmado">Confirmados</option>
            <option value="cancelado">Cancelados</option>
          </select>
        </div>

        <div className="filtro-group">
          <label>Filtrar por Data:</label>
          <input
            type="date"
            value={filtroData}
            onChange={(e) => setFiltroData(e.target.value)}
            className="filtro-input"
          />
        </div>
      </div>

      <div className="agendamentos-lista">
        {agendamentosFiltrados.length === 0 ? (
          <div className="sem-agendamentos">
            <Calendar size={48} />
            <p>Nenhum agendamento encontrado</p>
          </div>
        ) : (
          agendamentosFiltrados.map(agendamento => (
            <div key={agendamento.id} className="agendamento-card">
              <div className="agendamento-header-card">
                <div className="agendamento-data">
                  <Calendar size={20} />
                  <div>
                    <strong>{formatarData(agendamento.dataSelecionada)}</strong>
                    <div className="horario-info">
                      <Clock size={16} />
                      {agendamento.horarioSelecionado}
                    </div>
                  </div>
                </div>
                {getStatusBadge(agendamento.status)}
              </div>

              <div className="agendamento-body">
                <div className="info-section">
                  <div className="info-item">
                    <User size={18} />
                    <div>
                      <label>Cliente</label>
                      <p>{agendamento.nomeCliente}</p>
                    </div>
                  </div>

                  <div className="info-item">
                    <Phone size={18} />
                    <div>
                      <label>Telefone</label>
                      <p>{agendamento.telefone}</p>
                    </div>
                  </div>
                </div>

                <div className="info-section">
                  <div className="info-item">
                    <Car size={18} />
                    <div>
                      <label>Veículo</label>
                      <p>
                        {agendamento.marca} {agendamento.modelo} {agendamento.ano}
                        {agendamento.placa && ` - ${agendamento.placa}`}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="info-section problema">
                  <div className="info-item">
                    <FileText size={18} />
                    <div>
                      <label>Descrição do Problema</label>
                      <p>{agendamento.descricaoProblema}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="agendamento-actions">
                {agendamento.status === 'pendente' && (
                  <>
                    <button
                      onClick={() => atualizarStatus(agendamento.id, 'confirmado')}
                      className="btn-action btn-confirmar"
                    >
                      <CheckCircle size={18} />
                      Confirmar
                    </button>
                    <button
                      onClick={() => atualizarStatus(agendamento.id, 'cancelado')}
                      className="btn-action btn-cancelar"
                    >
                      <XCircle size={18} />
                      Cancelar
                    </button>
                  </>
                )}
                {agendamento.status === 'confirmado' && (
                  <button
                    onClick={() => atualizarStatus(agendamento.id, 'cancelado')}
                    className="btn-action btn-cancelar"
                  >
                    <XCircle size={18} />
                    Cancelar Agendamento
                  </button>
                )}
                {agendamento.status === 'cancelado' && (
                  <button
                    onClick={() => atualizarStatus(agendamento.id, 'pendente')}
                    className="btn-action btn-reativar"
                  >
                    <AlertCircle size={18} />
                    Reativar
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DashboardDono;
