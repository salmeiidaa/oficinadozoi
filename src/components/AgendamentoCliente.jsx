import React, { useState } from 'react';
import { Calendar, Clock, Car, User, Phone, FileText, CheckCircle } from 'lucide-react';
import './AgendamentoCliente.css';

const AgendamentoCliente = () => {
  const [etapa, setEtapa] = useState(1);
  const [agendamento, setAgendamento] = useState({
    nomeCliente: '',
    telefone: '',
    marca: '',
    modelo: '',
    ano: '',
    placa: '',
    descricaoProblema: '',
    dataSelecionada: '',
    horarioSelecionado: ''
  });

  const horariosDisponiveis = [
    '08:00', '09:00', '10:00', '11:00', 
    '13:00', '14:00', '15:00', '16:00', '17:00'
  ];

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
    const { name, value } = e.target;
    setAgendamento(prev => ({
      ...prev,
