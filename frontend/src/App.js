import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [newProject, setNewProject] = useState({ 
        name: '', 
        description: '', 
        type: '', 
        status: 'Planejado' 
    });
    const [editingId, setEditingId] = useState(null);

    // Estado para monitorar a largura da tela e garantir a responsividade
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    const API_URL = 'http://localhost:5000/projects';

    useEffect(() => {
        fetchProjects();

        // Remove as margens padrões do navegador (Tira a borda branca)
        document.body.style.margin = "0";
        document.body.style.padding = "0";
        document.body.style.boxSizing = "border-box";

        // Listener para detectar mudança de tamanho de tela
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const fetchProjects = () => {
        axios.get(API_URL)
            .then(response => setProjects(response.data))
            .catch(error => console.error('Erro ao buscar projetos:', error));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProject(prevState => ({ ...prevState, [name]: value }));
    };

    const clearForm = () => {
        setNewProject({ name: '', description: '', type: '', status: 'Planejado' });
        setEditingId(null);
    };

    const handleSaveProject = (e) => {
        e.preventDefault();
        if (!newProject.name) return alert('Por favor, digite o nome do projeto.');

        if (editingId) {
            axios.put(`${API_URL}/${editingId}`, newProject)
                .then(() => {
                    fetchProjects();
                    clearForm();
                    setSelectedProject(null);
                })
                .catch(error => console.error('Erro ao atualizar:', error));
        } else {
            axios.post(API_URL, newProject)
                .then(() => {
                    fetchProjects();
                    clearForm();
                })
                .catch(error => console.error('Erro ao adicionar:', error));
        }
    };

    const handleEditClick = (project) => {
        setEditingId(project._id);
        setNewProject({
            name: project.name,
            description: project.description || '',
            type: project.type || '',
            status: project.status || 'Planejado'
        });
        // Rola até o formulário no celular para facilitar
        if (isMobile) {
            window.scrollTo({ top: 500, behavior: 'smooth' });
        }
    };

    const handleDeleteProject = (projectId) => {
        if (window.confirm('Deseja realmente excluir este projeto?')) {
            axios.delete(`${API_URL}/${projectId}`)
                .then(() => {
                    setProjects(projects.filter(p => p._id !== projectId));
                    setSelectedProject(null);
                })
                .catch(error => console.error('Erro ao deletar:', error));
        }
    };

    const totalProjetos = projects.length;
    const emAndamento = projects.filter(p => p.status === 'Em andamento').length;
    const concluidos = projects.filter(p => p.status === 'Concluído').length;
    const Planejados = projects.filter(p => p.status === 'Planejado').length;

    return (
        <div style={{ backgroundColor: '#f0f4f8', minHeight: '100vh', fontFamily: 'sans-serif', margin: 0, paddingBottom: '40px' }}>
            {/* Header Responsivo */}
            <header style={{ 
                backgroundColor: '#0f2c59', 
                color: 'white', 
                padding: isMobile ? '15px 20px' : '15px 40px', 
                display: 'flex', 
                flexDirection: isMobile ? 'column' : 'row',
                gap: isMobile ? '15px' : '0',
                justifyContent: 'space-between', 
                alignItems: isMobile ? 'flex-start' : 'center' 
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ fontSize: '24px' }}>📘</div>
                    <div>
                        <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>Projetos Escolares</h1>
                        <small style={{ color: '#cbd5e1' }}>Escolas Públicas Locais</small>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center', width: isMobile ? '100%' : 'auto', justifyContent: isMobile ? 'space-between' : 'flex-end' }}>
                    <span style={{ cursor: 'pointer', fontWeight: '500' }}>Home</span>
                    <span style={{ cursor: 'pointer', fontWeight: '500', borderBottom: '2px solid white' }}>Projetos</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ backgroundColor: '#e2e8f0', color: '#0f2c59', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>AD</div>
                        <span style={{ fontSize: '14px' }}>Usuário</span>
                    </div>
                </div>
            </header>

            {/* Título Principal */}
            <main style={{ padding: isMobile ? '20px' : '30px 40px' }}>
                <h2 style={{ margin: '0 0 5px 0', color: '#1e293b', fontSize: isMobile ? '24px' : '28px' }}>Gerenciamento de Projetos</h2>
                <p style={{ margin: '0 0 30px 0', color: '#64748b', fontSize: '14px' }}>Cadastre, visualize e gerencie os projetos das escolas públicas.</p>

                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: isMobile ? '1fr 1fr' : '1fr 1fr 1fr 1fr', 
                    gap: '15px', 
                    marginBottom: '30px' 
                }}>
                    <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', borderLeft: '4px solid #3b82f6' }}>
                        <small style={{ color: '#64748b', fontWeight: 'bold' }}>TOTAL</small>
                        <h3 style={{ margin: '5px 0 0 0', color: '#1e293b', fontSize: '24px' }}>{totalProjetos}</h3>
                    </div>
                    <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', borderLeft: '4px solid #10b981' }}>
                        <small style={{ color: '#64748b', fontWeight: 'bold' }}>EM ANDAMENTO</small>
                        <h3 style={{ margin: '5px 0 0 0', color: '#1e293b', fontSize: '24px' }}>{emAndamento}</h3>
                    </div>
                    <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', borderLeft: '4px solid #f59e0b' }}>
                        <small style={{ color: '#64748b', fontWeight: 'bold' }}>CONCLUÍDOS</small>
                        <h3 style={{ margin: '5px 0 0 0', color: '#1e293b', fontSize: '24px' }}>{concluidos}</h3>
                    </div>
                    <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', borderLeft: '4px solid #8b5cf6' }}>
                        <small style={{ color: '#64748b', fontWeight: 'bold' }}>PLANEJADOS</small>
                        <h3 style={{ margin: '5px 0 0 0', color: '#1e293b', fontSize: '24px' }}>{Planejados}</h3>
                    </div>
                </div>

                {/* Grid que muda de 3 colunas para 1 coluna no celular */}
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', 
                    gap: '25px', 
                    alignItems: 'start' 
                }}>
                    
                    {/* COLUNA 1: Lista de Projetos */}
                    <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ margin: 0, color: '#1e293b', fontSize: '18px' }}>Lista de Projetos</h3>
                            <button onClick={clearForm} style={{ backgroundColor: '#3b82f6', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>Novo Projeto</button>
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {projects.length === 0 ? (
                                <p style={{ color: '#64748b', fontSize: '14px' }}>Nenhum projeto adicionado.</p>
                            ) : (
                                projects.map(project => (
                                    <div 
                                        key={project._id} 
                                        onClick={() => {
                                            setSelectedProject(project);
                                            if (isMobile) window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                                        }}
                                        style={{ 
                                            padding: '15px', 
                                            borderRadius: '8px', 
                                            border: selectedProject?._id === project._id ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                                            cursor: 'pointer',
                                            backgroundColor: '#ffffff',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        <h4 style={{ margin: '0 0 5px 0', color: '#1e293b' }}>{project.name}</h4>
                                        <p style={{ margin: '0 0 10px 0', fontSize: '13px', color: '#64748b' }}>{project.description}</p>
                                        
                                        {project.status && (
                                            <span style={{ 
                                                fontSize: '11px', 
                                                padding: '4px 8px', 
                                                borderRadius: '12px', 
                                                fontWeight: 'bold',
                                                backgroundColor: project.status === 'Em andamento' ? '#dcfce7' : '#ffedd5',
                                                color: project.status === 'Em andamento' ? '#15803d' : '#ea580c'
                                            }}>
                                                {project.status}
                                            </span>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* COLUNA 2: Cadastrar/Editar Novo Projeto */}
                    <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                        <h3 style={{ margin: '0 0 20px 0', color: '#1e293b', fontSize: '18px' }}>{editingId ? 'Editar Projeto' : 'Cadastrar Novo Projeto'}</h3>
                        
                        <form onSubmit={handleSaveProject} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500', color: '#1e293b' }}>Nome do Projeto</label>
                                <input type="text" name="name" value={newProject.name} onChange={handleInputChange} placeholder="Digite o nome do projeto" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500', color: '#1e293b' }}>Descrição</label>
                                <textarea name="description" value={newProject.description} onChange={handleInputChange} placeholder="Descreva o projeto..." rows="4" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box', resize: 'none' }}></textarea>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500', color: '#1e293b' }}>Tipo de Projeto</label>
                                <select name="type" value={newProject.type} onChange={handleInputChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}>
                                    <option value="">Selecione o tipo do projeto</option>
                                    <option value="Tecnologia">Tecnologia</option>
                                    <option value="Matemática">Matemática</option>
                                    <option value="Ciências">Ciências</option>
                                    <option value="Humanas">Humanas</option>
                                    <option value="Outro">Outro</option>
                                </select>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500', color: '#1e293b' }}>Status</label>
                                <select name="status" value={newProject.status} onChange={handleInputChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}>
                                    <option value="Planejado">Planejado</option>
                                    <option value="Em andamento">Em andamento</option>
                                    <option value="Concluído">Concluído</option>
                                </select>
                            </div>

                            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                <button type="button" onClick={clearForm} style={{ flex: 1, backgroundColor: 'white', border: '1px solid #cbd5e1', padding: '10px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' }}>Limpar</button>
                                <button type="submit" style={{ flex: 1, backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '10px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}>
                                    {editingId ? 'Salvar' : 'Salvar Projeto'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* COLUNA 3: Detalhes do Projeto */}
                    <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', minHeight: isMobile ? 'auto' : '300px', display: 'flex', flexDirection: 'column' }}>
                        <h3 style={{ margin: '0 0 20px 0', color: '#1e293b', fontSize: '18px' }}>Detalhes do Projeto</h3>
                        
                        {selectedProject ? (
                            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                                <div style={{ backgroundColor: '#eff6ff', padding: '12px', borderRadius: '6px', color: '#1e40af', fontSize: '13px', marginBottom: '20px' }}>
                                    Visualizando detalhes do projeto selecionado.
                                </div>
                                <h4 style={{ margin: '0 0 10px 0', fontSize: '20px', color: '#1e293b' }}>{selectedProject.name}</h4>
                                <p style={{ color: '#475569', fontSize: '15px', lineHeight: '1.5', margin: '0 0 20px 0', flex: isMobile ? 'none' : '1' }}>{selectedProject.description || 'Sem descrição informada.'}</p>
                                
                                <div style={{ marginBottom: '25px', fontSize: '14px' }}>
                                    <p style={{ margin: '5px 0' }}><strong>Tipo:</strong> {selectedProject.type || 'Não definido'}</p>
                                    <p style={{ margin: '5px 0' }}><strong>Status:</strong> {selectedProject.status}</p>
                                </div>

                                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                    <button onClick={() => handleEditClick(selectedProject)} style={{ flex: 1, minWidth: '80px', backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '10px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Editar</button>
                                    <button onClick={() => handleDeleteProject(selectedProject._id)} style={{ flex: 1, minWidth: '80px', backgroundColor: '#dc2626', color: 'white', border: 'none', padding: '10px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Excluir</button>
                                    <button onClick={() => setSelectedProject(null)} style={{ flex: 1, minWidth: '80px', backgroundColor: '#ea580c', color: 'white', border: 'none', padding: '10px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Voltar</button>
                                </div>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, color: '#64748b', textAlign: 'center', padding: '20px 0' }}>
                                <div style={{ backgroundColor: '#eff6ff', padding: '12px', borderRadius: '6px', color: '#1e40af', fontSize: '13px', width: '100%', boxSizing: 'border-box', marginBottom: '20px' }}>
                                    Selecione um projeto na lista para visualizar os detalhes.
                                </div>
                                <div style={{ fontSize: '48px', marginBottom: '10px' }}>🎈</div>
                                <h4 style={{ margin: '0 0 5px 0', color: '#1e293b' }}>Nenhum projeto selecionado</h4>
                                <p style={{ margin: 0, fontSize: '13px' }}>Clique em um projeto da lista para ver seus detalhes.</p>
                            </div>
                        )}
                    </div>

                </div>
            </main>
            <footer style={{ 
                backgroundColor: '#0f2c59', 
                color: '#cbd5e1', 
                textAlign: 'center', 
                padding: '20px', 
                fontSize: '14px',
                marginTop: '40px' 
            }}>
                © 2026 - Todos os direitos reservados
            </footer>
        </div>
    );
}

export default App;