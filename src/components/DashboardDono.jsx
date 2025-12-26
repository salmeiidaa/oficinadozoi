import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Car, FileText, Home, RefreshCw } from 'lucide-react';
import { buscarAgendamentos, atualizarStatusAgendamento } from '../firebase/agendamentosService';
import './DashboardDono.css';

const DashboardDono = () => {
  const [agendamentos, setAgendamentos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [filtroStatus, setFiltroStatus] = useState('todos');

  const carregarAgendamentos = async () => {
    setCarregando(true);
    console.log('🔍 Buscando agendamentos no Firebase...');
    
    try {
      const resultado = await buscarAgendamentos();
      console.log('Resposta completa:', resultado);
      
      if (resultado.success) {
        console.log('✅ Agendamentos encontrados:', resultado.data.length);
        console.log('📋 Dados:', resultado.data);
        setAgendamentos(resultado.data);
      } else {
        console.error('❌ Erro ao buscar:', resultado.error);
      }
    } catch (error) {
      console.error('❌ Erro crítico ao carregar:', error);
    } finally {
      setCarregando(false);
      console.log('✅ Carregamento finalizado');
    }
  };

  useEffect(() => {
    console.log('🚀 Dashboard montado, iniciando carregamento...');
    carregarAgendamentos();
  }, []);

  const mudarStatus = async (id, novoStatus) => {
    const confirmacao = window.confirm(`Deseja mesmo marcar como ${novoStatus}?`);
    if (!confirmacao) return;

    console.log('🔄 Atualizando status:', id, novoStatus);
    const resultado = await atualizarStatusAgendamento(id, novoStatus);
    
    if (resultado.success) {
      console.log('✅ Status atualizado com sucesso!');
      carregarAgendamentos();
      alert('✅ Status atualizado!');
    } else {
      console.error('❌ Erro ao atualizar:', resultado.error);
      alert('❌ Erro ao atualizar status');
    }
  };

  const agendamentosFiltrados = agendamentos.filter(ag => {
    if (filtroStatus === 'todos') return true;
    return ag.status === filtroStatus;
  });

  const formatarData = (dataISO) => {
    const data = new Date(dataISO + 'T00:00:00');
    return data.toLocaleDateString('pt-BR', { 
      weekday: 'long', 
      day: '2-digit', 
      month: 'long' 
    });
  };

  const getStatusCor = (status) => {
    const cores = {
      pendente: '#f6ad55',
      confirmado: '#48bb78',
      cancelado: '#fc8181'
    };
    return cores[status] || '#ccc';
  };

  console.log('🎨 Renderizando dashboard com', agendamentos.length, 'agendamentos');

  return (
    <div className="dashboard-oficina">
      <div className="dashboard-header-oficina">
        <h1>📊 Painel de Agendamentos</h1>
        <div style={{display: 'flex', gap: '10px'}}>
          <button onClick={carregarAgendamentos} className="btn-atualizar" disabled={carregando}>
            <RefreshCw size={18} /> {carregando ? 'Carregando...' : 'Atualizar'}
          </button>
          <a href="/" className="btn-voltar-home">
            <Home size={18} /> Voltar
          </a>
        </div>
      </div>

      <div className="filtros-status">
        <button 
          className={filtroStatus === 'todos' ? 'ativo' : ''} 
          onClick={() => setFiltroStatus('todos')}
        >
          Todos ({agendamentos.length})
        </button>
        <button 
          className={filtroStatus === 'pendente' ? 'ativo' : ''} 
          onClick={() => setFiltroStatus('pendente')}
        >
          Pendentes ({agendamentos.filter(a => a.status === 'pendente').length})
        </button>
        <button 
          className={filtroStatus === 'confirmado' ? 'ativo' : ''} 
          onClick={() => setFiltroStatus('confirmado')}
        >
          Confirmados ({agendamentos.filter(a => a.status === 'confirmado').length})
        </button>
        <button 
          className={filtroStatus === 'cancelado' ? 'ativo' : ''} 
          onClick={() => setFiltroStatus('cancelado')}
        >
          Cancelados ({agendamentos.filter(a => a.status === 'cancelado').length})
        </button>
      </div>

      <div className="agendamentos-lista-oficina">
        {carregando ? (
          <div className="sem-agendamentos-oficina">
            <RefreshCw size={48} className="spinner" />
            <p>Carregando agendamentos...</p>
          </div>
        ) : agendamentosFiltrados.length === 0 ? (
          <div className="sem-agendamentos-oficina">
            <Calendar size={48} />
            <p>Nenhum agendamento encontrado</p>
          </div>
        ) : (
          agendamentosFiltrados.map(ag => (
            <div key={ag.id} className="agendamento-card-oficina">
              <div className="card-header-oficina" style={{background: getStatusCor(ag.status)}}>
                <div className="data-info">
                  <Calendar size={20} />
                  <div>
                    <strong>{formatarData(ag.dataSelecionada)}</strong>
                    <div className="horario-badge">
                      <Clock size={16} /> {ag.horarioSelecionado}
                    </div>
                  </div>
                </div>
                <span className="status-badge-header">{ag.status?.toUpperCase()}</span>
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

                {ag.status === 'pendente' && (
                  <div className="acoes-card">
                    <button onClick={() => mudarStatus(ag.id, 'confirmado')} className="btn-confirmar-mini">
                      Confirmar
                    </button>
                    <button onClick={() => mudarStatus(ag.id, 'cancelado')} className="btn-cancelar-mini">
                      Cancelar
                    </button>
                  </div>
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
