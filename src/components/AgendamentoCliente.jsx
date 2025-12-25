import React, { useState } from 'react';
import { Calendar, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { criarAgendamento } from '../firebase/agendamentosService';
import './AgendamentoCliente.css';

const AgendamentoCliente = () => {
  const [mesAtual, setMesAtual] = useState(new Date());
  const [enviando, setEnviando] = useState(false);
  const [agendamento, setAgendamento] = useState({
    dataSelecionada: '',
    horarioSelecionado: '',
    modeloCarro: '',
    anoCarro: '',
    descricaoProblema: ''
  });

  const horariosDisponiveis = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];

  const getDiasDoMes = () => {
    const ano = mesAtual.getFullYear();
    const mes = mesAtual.getMonth();
    const primeiroDia = new Date(ano, mes, 1);
    const ultimoDia = new Date(ano, mes + 1, 0);
    const diasAnteriores = primeiroDia.getDay();
    const totalDias = ultimoDia.getDate();
    
    const dias = [];
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    for (let i = 0; i < diasAnteriores; i++) {
      dias.push(null);
    }

    for (let dia = 1; dia <= totalDias; dia++) {
      const data = new Date(ano, mes, dia);
      const dataStr = data.toISOString().split('T')[0];
      const passado = data < hoje;
      const domingo = data.getDay() === 0;
      
      dias.push({
        dia,
        data: dataStr,
        desabilitado: passado || domingo
      });
    }

    return dias;
  };

  const mudarMes = (direcao) => {
    const novoMes = new Date(mesAtual);
    novoMes.setMonth(mesAtual.getMonth() + direcao);
    setMesAtual(novoMes);
  };

  const handleChange = (e) => {
    setAgendamento(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const selecionarData = (dataStr) => {
    setAgendamento(prev => ({ ...prev, dataSelecionada: dataStr, horarioSelecionado: '' }));
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

  // PREPARAR MENSAGEM DO WHATSAPP
  const whatsapp = '5571994063730';
  const dataFormatada = new Date(agendamento.dataSelecionada + 'T00:00:00').toLocaleDateString('pt-BR');
  const mensagem = `Olá, quero agendar um horário na oficina.%0A%0A` +
                  `Dia: ${dataFormatada}%0A` +
                  `Horário: ${agendamento.horarioSelecionado}%0A` +
                  `Modelo: ${agendamento.modeloCarro}%0A` +
                  `Ano: ${agendamento.anoCarro}%0A` +
                  `Problema: ${agendamento.descricaoProblema}`;

  // ABRIR WHATSAPP IMEDIATAMENTE
  window.open(`https://wa.me/${whatsapp}?text=${mensagem}`, '_blank');

  // SALVAR NO FIREBASE EM BACKGROUND
  criarAgendamento(agendamento).then(resultado => {
    if (resultado.success) {
      console.log('✅ Salvo no Firebase!');
    }
  }).catch(erro => {
    console.error('Erro ao salvar:', erro);
  });

  // RESETAR FORMULÁRIO
  setAgendamento({
    dataSelecionada: '',
    horarioSelecionado: '',
    modeloCarro: '',
    anoCarro: '',
    descricaoProblema: ''
  });
};

  // 5. MOSTRAR MENSAGEM DE SUCESSO
  alert('✅ Agendamento enviado! Verifique o WhatsApp.');
};;

  const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const diasDoMes = getDiasDoMes();

  return (
    <div className="oficina-container">
      <div className="oficina-box">
        <header className="oficina-header">
          <img src="https://i.postimg.cc/cHtTFJnY/Whats-App-Image-2025-07-25-at-10-57-00.jpg" alt="Felipe Zoi" />
          <h1>Agende seu horário</h1>
        </header>

        <form onSubmit={handleSubmit} className="oficina-form">
          
          <label><Calendar size={18} /> Escolha o dia</label>
          <div className="calendario">
            <div className="calendario-header">
              <button type="button" onClick={() => mudarMes(-1)} className="btn-mes">
                <ChevronLeft size={20} />
              </button>
              <span className="mes-ano">
                {mesAtual.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
              </span>
              <button type="button" onClick={() => mudarMes(1)} className="btn-mes">
                <ChevronRight size={20} />
              </button>
            </div>
            
            <div className="dias-semana">
              {diasSemana.map(dia => (
                <div key={dia} className="dia-semana">{dia}</div>
              ))}
            </div>
            
            <div className="dias-grid">
              {diasDoMes.map((item, index) => (
                <button
                  key={index}
                  type="button"
                  className={`dia-btn ${!item ? 'vazio' : ''} 
                             ${item?.desabilitado ? 'desabilitado' : ''} 
                             ${item?.data === agendamento.dataSelecionada ? 'selecionado' : ''}`}
                  disabled={!item || item.desabilitado}
                  onClick={() => item && !item.desabilitado && selecionarData(item.data)}
                >
                  {item?.dia}
                </button>
              ))}
            </div>
          </div>

          {agendamento.dataSelecionada && (
            <>
              <label><Clock size={18} /> Escolha o horário</label>
              <div className="horarios-grid">
                {horariosDisponiveis.map(hora => (
                  <button
                    key={hora}
                    type="button"
                    className={`horario-btn ${agendamento.horarioSelecionado === hora ? 'selecionado' : ''}`}
                    onClick={() => setAgendamento(prev => ({ ...prev, horarioSelecionado: hora }))}
                  >
                    {hora}
                  </button>
                ))}
              </div>
            </>
          )}

          <label>Modelo do carro</label>
          <input type="text" name="modeloCarro" value={agendamento.modeloCarro} 
                 onChange={handleChange} placeholder="Ex: Ford Ka" required />

          <label>Ano do carro</label>
          <input type="number" name="anoCarro" value={agendamento.anoCarro} 
                 onChange={handleChange} placeholder="Ex: 2018" min="1900" max="2100" required />

          <label>Descrição do problema</label>
          <textarea name="descricaoProblema" value={agendamento.descricaoProblema} 
                    onChange={handleChange} placeholder="Descreva o problema do carro" rows="4" required />

          <button type="submit" className="submit-btn" disabled={!formularioCompleto() || enviando}>
            {enviando ? '⏳ Salvando...' : 'Enviar agendamento pelo WhatsApp'}
          </button>
        </form>

        <p className="footer-note">
          * Preencha todos os campos para liberar o envio.
        </p>
      </div>
    </div>
  );
};

export default AgendamentoCliente;
