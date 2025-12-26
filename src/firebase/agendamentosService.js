import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  query, 
  orderBy,
  where,
  Timestamp 
} from 'firebase/firestore';
import { db } from './config';

const COLLECTION_NAME = 'agendamentos';

// Criar novo agendamento
export const criarAgendamento = async (dadosAgendamento) => {
  try {
    console.log('💾 Salvando agendamento:', dadosAgendamento);
    
    const agendamentoComTimestamp = {
      modeloCarro: dadosAgendamento.modeloCarro,
      anoCarro: dadosAgendamento.anoCarro,
      descricaoProblema: dadosAgendamento.descricaoProblema,
      dataSelecionada: dadosAgendamento.dataSelecionada,
      horarioSelecionado: dadosAgendamento.horarioSelecionado,
      status: 'pendente',
      criadoEm: Timestamp.now(),
      atualizadoEm: Timestamp.now()
    };

    console.log('📋 Dados formatados:', agendamentoComTimestamp);

    const docRef = await addDoc(collection(db, COLLECTION_NAME), agendamentoComTimestamp);
    
    console.log('✅ Agendamento criado com ID:', docRef.id);
    
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('❌ Erro ao criar agendamento:', error);
    return { success: false, error: error.message };
  }
};

// Buscar todos os agendamentos
export const buscarAgendamentos = async () => {
  try {
    console.log('🔍 Buscando agendamentos da coleção:', COLLECTION_NAME);
    
    const q = query(
      collection(db, COLLECTION_NAME),
      orderBy('dataSelecionada', 'desc'),
      orderBy('horarioSelecionado', 'asc')
    );
    
    const querySnapshot = await getDocs(q);
    const agendamentos = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      agendamentos.push({
        id: doc.id,
        ...data,
        criadoEm: data.criadoEm?.toDate().toISOString(),
        atualizadoEm: data.atualizadoEm?.toDate().toISOString()
      });
    });
    
    console.log('📊 Total de agendamentos encontrados:', agendamentos.length);
    
    return { success: true, data: agendamentos };
  } catch (error) {
    console.error('❌ Erro ao buscar agendamentos:', error);
    return { success: false, error: error.message, data: [] };
  }
};

// Buscar agendamentos por data
export const buscarAgendamentosPorData = async (data) => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('dataSelecionada', '==', data),
      orderBy('horarioSelecionado', 'asc')
    );
    
    const querySnapshot = await getDocs(q);
    const agendamentos = [];
    
    querySnapshot.forEach((doc) => {
      agendamentos.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return { success: true, data: agendamentos };
  } catch (error) {
    console.error('Erro ao buscar agendamentos por data:', error);
    return { success: false, error: error.message };
  }
};

// Buscar horários ocupados de uma data
export const buscarHorariosOcupados = async (data) => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('dataSelecionada', '==', data),
      where('status', 'in', ['pendente', 'confirmado'])
    );
    
    const querySnapshot = await getDocs(q);
    const horariosOcupados = [];
    
    querySnapshot.forEach((doc) => {
      horariosOcupados.push(doc.data().horarioSelecionado);
    });
    
    return { success: true, data: horariosOcupados };
  } catch (error) {
    console.error('Erro ao buscar horários ocupados:', error);
    return { success: false, error: error.message };
  }
};

// Atualizar status do agendamento
export const atualizarStatusAgendamento = async (id, novoStatus) => {
  try {
    const agendamentoRef = doc(db, COLLECTION_NAME, id);
    
    await updateDoc(agendamentoRef, {
      status: novoStatus,
      atualizadoEm: Timestamp.now()
    });
    
    console.log('✅ Status atualizado para:', novoStatus);
    
    return { success: true };
  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    return { success: false, error: error.message };
  }
};

export default {
  criarAgendamento,
  buscarAgendamentos,
  buscarAgendamentosPorData,
  buscarHorariosOcupados,
  atualizarStatusAgendamento
};
