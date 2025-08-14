import React from 'react';
import { FormField } from '../../types/form';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Plus, X, Settings2 } from 'lucide-react';

interface FieldPropertiesPanelProps {
  field: FormField;
  onFieldUpdate: (fieldId: string, updates: Partial<FormField>) => void;
}

export const FieldPropertiesPanel: React.FC<FieldPropertiesPanelProps> = ({
  field,
  onFieldUpdate
}) => {
  const updateField = (updates: Partial<FormField>) => {
    onFieldUpdate(field.id, updates);
  };

  const updateOptions = (newOptions: string[]) => {
    updateField({ options: newOptions });
  };

  const addOption = () => {
    const currentOptions = field.options || [];
    updateOptions([...currentOptions, 'Nova opção']);
  };

  const removeOption = (index: number) => {
    const currentOptions = field.options || [];
    updateOptions(currentOptions.filter((_, i) => i !== index));
  };

  const updateOption = (index: number, value: string) => {
    const currentOptions = field.options || [];
    const newOptions = [...currentOptions];
    newOptions[index] = value;
    updateOptions(newOptions);
  };

  const hasOptions = ['select', 'radio'].includes(field.type);
  const hasValidation = ['text', 'rich_text', 'number'].includes(field.type);

  return (
    <div className="w-80 border-l border-border bg-card overflow-y-auto">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Settings2 className="w-4 h-4 text-muted-foreground" />
          <h3 className="font-medium text-sm">Propriedades do Campo</h3>
        </div>
        <Badge variant="outline" className="mt-2 text-xs">
          {field.type.replace('_', ' ')}
        </Badge>
      </div>

      <div className="p-4 space-y-6">
        {/* Basic Properties */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="field-label" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Rótulo do Campo
            </Label>
            <Input
              id="field-label"
              value={field.label}
              onChange={(e) => updateField({ label: e.target.value })}
              placeholder="Digite o rótulo..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="field-placeholder" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Placeholder
            </Label>
            <Input
              id="field-placeholder"
              value={field.placeholder || ''}
              onChange={(e) => updateField({ placeholder: e.target.value })}
              placeholder="Texto de exemplo..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="field-help" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Texto de Ajuda
            </Label>
            <Textarea
              id="field-help"
              value={field.helpText || ''}
              onChange={(e) => updateField({ helpText: e.target.value })}
              placeholder="Instruções para preenchimento..."
              className="min-h-16"
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="field-required" className="text-sm font-medium">
              Campo obrigatório
            </Label>
            <Switch
              id="field-required"
              checked={field.required}
              onCheckedChange={(checked) => updateField({ required: checked })}
            />
          </div>
        </div>

        {/* Options for select fields */}
        {hasOptions && (
          <>
            <Separator />
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Opções
                </Label>
                <Button variant="outline" size="sm" onClick={addOption}>
                  <Plus className="w-3 h-3 mr-1" />
                  Adicionar
                </Button>
              </div>
              
              <div className="space-y-2">
                {(field.options || []).map((option, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      placeholder={`Opção ${index + 1}`}
                      className="flex-1"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeOption(index)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
              
              {field.options?.length === 0 && (
                <div className="text-center py-4 text-muted-foreground text-sm">
                  Nenhuma opção adicionada
                </div>
              )}
            </div>
          </>
        )}

        {/* Validation rules */}
        {hasValidation && (
          <>
            <Separator />
            <div className="space-y-4">
              <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Validações
              </Label>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label htmlFor="field-min" className="text-xs">
                    Mínimo
                  </Label>
                  <Input
                    id="field-min"
                    type="number"
                    value={field.validation?.min || ''}
                    onChange={(e) => updateField({
                      validation: {
                        ...field.validation,
                        min: e.target.value ? parseInt(e.target.value) : undefined
                      }
                    })}
                    placeholder="0"
                  />
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="field-max" className="text-xs">
                    Máximo
                  </Label>
                  <Input
                    id="field-max"
                    type="number"
                    value={field.validation?.max || ''}
                    onChange={(e) => updateField({
                      validation: {
                        ...field.validation,
                        max: e.target.value ? parseInt(e.target.value) : undefined
                      }
                    })}
                    placeholder="100"
                  />
                </div>
              </div>

              {field.type === 'text' && (
                <div className="space-y-2">
                  <Label htmlFor="field-pattern" className="text-xs">
                    Padrão (RegEx)
                  </Label>
                  <Input
                    id="field-pattern"
                    value={field.validation?.pattern || ''}
                    onChange={(e) => updateField({
                      validation: {
                        ...field.validation,
                        pattern: e.target.value
                      }
                    })}
                    placeholder="^[A-Za-z]+$"
                  />
                </div>
              )}
            </div>
          </>
        )}

        {/* Conditional Logic */}
        <Separator />
        <div className="space-y-4">
          <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Lógica Condicional
          </Label>
          
          <div className="p-3 bg-muted/20 rounded-lg text-xs text-muted-foreground text-center">
            Funcionalidade em desenvolvimento
          </div>
        </div>
      </div>
    </div>
  );
};