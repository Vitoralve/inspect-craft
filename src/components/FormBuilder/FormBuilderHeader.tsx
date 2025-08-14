import React from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { FormVersion } from '../../types/form';
import { Save, Eye, Download, Upload, History } from 'lucide-react';

interface FormBuilderHeaderProps {
  form: FormVersion;
  onFormUpdate: (form: FormVersion) => void;
}

export const FormBuilderHeader: React.FC<FormBuilderHeaderProps> = ({
  form,
  onFormUpdate
}) => {
  const handleNameChange = (name: string) => {
    onFormUpdate({
      ...form,
      name
    });
  };

  const handleSaveDraft = () => {
    console.log('Salvando rascunho...');
  };

  const handlePublish = () => {
    console.log('Publicando versão...');
    onFormUpdate({
      ...form,
      status: 'published',
      publishedAt: new Date()
    });
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(form, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${form.name.replace(/\s+/g, '_')}_v${form.version}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Input
            value={form.name}
            onChange={(e) => handleNameChange(e.target.value)}
            className="text-lg font-semibold border-none bg-transparent p-0 h-auto focus-visible:ring-0"
          />
          <Badge variant={form.status === 'published' ? 'default' : 'secondary'}>
            v{form.version} • {form.status === 'published' ? 'Publicado' : 'Rascunho'}
          </Badge>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={handleSaveDraft}>
          <Save className="w-4 h-4 mr-2" />
          Salvar Rascunho
        </Button>
        
        <Button variant="outline" size="sm">
          <Eye className="w-4 h-4 mr-2" />
          Pré-visualizar
        </Button>
        
        <Button variant="outline" size="sm">
          <History className="w-4 h-4 mr-2" />
          Versões
        </Button>
        
        <Button variant="outline" size="sm" onClick={handleExport}>
          <Download className="w-4 h-4 mr-2" />
          Exportar
        </Button>
        
        <Button variant="outline" size="sm">
          <Upload className="w-4 h-4 mr-2" />
          Importar
        </Button>
        
        <Button onClick={handlePublish} className="bg-gradient-to-r from-primary to-secondary">
          Publicar Versão
        </Button>
      </div>
    </header>
  );
};